// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Optional: allow BACKEND_URL via .env (defaults to localhost:3001)
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.BACKEND_URL || 'http://localhost:3001'

  return {
    plugins: [react()],
    server: {
      port: 3000,          // FE runs on localhost:3000
      open: true,          // auto-opens browser on start
      proxy: {
        '/api': {
          target,              // backend target (from above)
          changeOrigin: true,  // changes origin header to match backend
          ws: true,            // proxy WebSocket connections too
          rewrite: (path) => path, // keep '/api' in path
          secure: false        // allow self-signed HTTPS certs
        }
      },
    }
  }
})