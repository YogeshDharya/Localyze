import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
<<<<<<< HEAD
        target: 'http://localhost:8082',
=======
        target: 'http://localhost:8080',
>>>>>>> 4782d7faa5224e2aff0d702313f1926634784d74
        changeOrigin: true,
      },
    },
  },
})
