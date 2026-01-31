import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@reference/system': path.resolve(process.cwd(), '.reference/dist/index.mjs'),
    },
  },
  server: {
    port: 5173,
  },
})
