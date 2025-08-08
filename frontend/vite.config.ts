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
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          ws: true,
          // remove '/api' before hitting backend (so FE `/api/users` -> BE `/users`)
          rewrite: (path) => path.replace(/^\/api/, ''),
          // set to false if your backend uses self-signed HTTPS
          secure: false
        }
      }
    }
  }
})