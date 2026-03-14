import { Hono } from "hono";
import { Layout } from "./layout";
import { WebGPU } from "./pages/WebGpu";

const app = new Hono();

app.get("/", (c) => {
  return c.html(
    <Layout title="Homepage">
      <section class="about-section">
        <h2>About This Project</h2>
        <p>
          In this project I try to work with the low-level Webgpu API to create
          something, while trying to learn about interacting with GPU's and
          working with pipelines. Go to the WEB_GPU link at the navigation to
          see the first steps.
        </p>
      </section>
    </Layout>,
  );
});

app.get("/webgpu", (c) => {
  return c.html(<WebGPU />);
});

export default app;
