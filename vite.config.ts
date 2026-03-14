import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import cloudflareAdapter from '@hono/vite-dev-server/cloudflare'

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/index.tsx',
      adapter: cloudflareAdapter,
    }),
  ],
})
