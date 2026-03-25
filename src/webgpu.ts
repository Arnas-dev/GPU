import { mat4 } from "gl-matrix";

interface WebGPUState {
  device: GPUDevice;
  context: GPUCanvasContext;
  format: GPUTextureFormat;
}

run();

async function initWebGPU(canvas: HTMLCanvasElement): Promise<WebGPUState> {
  if (!navigator.gpu)
    throw new Error("WebGPU is not supported on this browser");

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw new Error("No appropriate GPU adapter found");

  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu") as GPUCanvasContext;
  const format = navigator.gpu.getPreferredCanvasFormat();

  device.lost.then(() => {
    throw new Error("GPU device has disconnected");
  });

  context.configure({
    device: device,
    format: format,
    alphaMode: "premultiplied",
  });

  console.log("WebGPU is ready", device);
  return { device, context, format };
}

async function run() {
  const canvas = document.getElementById("gpu-canvas") as HTMLCanvasElement;
  if (!canvas) throw Error("No canvas element was found for GPU to connect to");

  const state = await initWebGPU(canvas);

  const shaderSource = await fetch("/shader.wgsl").then((r) => r.text());

  const shaderModule = state.device.createShaderModule({
    label: "Hardcoded triangle shader",
    code: shaderSource,
  });
  const compilationInfo = await shaderModule.getCompilationInfo();
  if (compilationInfo.messages.length > 0) {
    console.error("WGSL Compilation Errors:");
    compilationInfo.messages.forEach((msg) => {
      console.error(`${msg.lineNum}:${msg.linePos} - ${msg.message}`);
    });
  }

  const bindGroupLayout = state.device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: "uniform" },
      },
    ],
  });

  const FLOAT_SIZE = 4;
  const VERTEX_STRIDE = 5 * FLOAT_SIZE;

  const pipeline = state.device.createRenderPipeline({
    layout: state.device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    }),
    vertex: {
      module: shaderModule,
      entryPoint: "vs_main",
      buffers: [
        {
          arrayStride: VERTEX_STRIDE,
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: "float32x2",
            },
            {
              shaderLocation: 1,
              offset: 8,
              format: "float32x3",
            },
          ],
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fs_main",
      targets: [{ format: state.format }],
    },
    primitive: {
      topology: "triangle-list",
    },
  });

  render(state, pipeline, bindGroupLayout);
}

function render(
  state: WebGPUState,
  pipeline: GPURenderPipeline,
  bindGroupLayout: GPUBindGroupLayout,
) {
  const vertices = createVertexArray([
    { pos: [-0.5, -0.5], color: [1.0, 0.0, 0.0] },
    { pos: [0.5, -0.5], color: [0.0, 1.0, 0.0] },
    { pos: [0.0, 0.5], color: [0.0, 0.0, 1.0] },
  ]);

  const vertexBuffer = state.device.createBuffer({
    label: "Triangle vertices",
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  const mvpBuffer = state.device.createBuffer({
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  state.device.queue.writeBuffer(vertexBuffer, 0, new Float32Array(vertices));

  function frame() {
    const mvpMatrix = mat4.create();
    mat4.perspective(
      mvpMatrix,
      Math.PI / 4, // 45 degree field of view
      1, // aspect ratio
      0.1, // near plane
      100, // far plane
    );
    mat4.translate(mvpMatrix, mvpMatrix, [0, 0, -2]);
    mat4.rotateX(mvpMatrix, mvpMatrix, Date.now() / 1000);
    mat4.rotateY(mvpMatrix, mvpMatrix, Date.now() / 1500);
    state.device.queue.writeBuffer(mvpBuffer, 0, new Float32Array(mvpMatrix));

    const commandEncoder = state.device.createCommandEncoder();
    const textureView = state.context.getCurrentTexture().createView();

    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 },
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    });

    const bindGroup = state.device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: { buffer: mvpBuffer },
        },
      ],
    });

    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setBindGroup(0, bindGroup);
    renderPass.draw(3);
    renderPass.end();

    state.device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

interface Vertex {
  pos: number[];
  color: number[];
}

function createVertexArray(vertices: Vertex[]): Float32Array {
  const VERTEX_SIZE = 5;
  const vertexArr = new Float32Array(vertices.length * VERTEX_SIZE);

  for (let i = 0; i < vertices.length; i++) {
    const offset = i * VERTEX_SIZE;
    vertexArr[offset + 0] = vertices[i].pos[0];
    vertexArr[offset + 1] = vertices[i].pos[1];
    vertexArr[offset + 2] = vertices[i].color[0];
    vertexArr[offset + 3] = vertices[i].color[1];
    vertexArr[offset + 4] = vertices[i].color[2];
  }

  return vertexArr;
}
