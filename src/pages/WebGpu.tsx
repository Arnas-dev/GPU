import { Layout } from "../layout";

export const WebGPU = () => {
  return (
    <Layout title="WebGPU">
      <script type="module" src="/src/webgpu.js" defer />
      <div class="bento-grid">
        <div class="card canvas-card">
          <canvas width="2000" height="2000" id="gpu-canvas"></canvas>
        </div>
      </div>
    </Layout>
  );
};
