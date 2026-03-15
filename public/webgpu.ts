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

  const shaderModule = state.device.createShaderModule({
    label: "Hardcoded triangle shader",
    code: /* WGSL */ `
	struct VertexOutput {
	@builtin(position) pos: vec4f,
	@location(0) color: vec3f,
	};
	@vertex
	fn vs_main(
	@location(0) pos: vec2f,
	@location(1) color: vec3f
	) -> VertexOutput {
	var out: VertexOutput;
	out.pos = vec4f(pos, 0.0, 1.0);
	out.color = color;
	return out;
	}
	
	@fragment
	fn fs_main(@location(0) color: vec3f) -> @location(0) vec4f {
	return vec4f(color, 1.0);
	}`,
  });

  const FLOAT_SIZE = 4;
  const VERTEX_STRIDE = 5 * FLOAT_SIZE;

  const pipeline = state.device.createRenderPipeline({
    layout: "auto",
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
  render(state, pipeline);
}

function render(state: WebGPUState, pipeline: GPURenderPipeline) {
  const vertices = new Float32Array([
    0.0, 0.5, 1.0, 0.0, 0.0, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, 0.0, 0.0,
    1.0,
  ]);

  const vertexBuffer = state.device.createBuffer({
    label: "Triangle vertices",
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  state.device.queue.writeBuffer(vertexBuffer, 0, vertices);

  function frame() {
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

    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.draw(3);
    renderPass.end();

    state.device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
