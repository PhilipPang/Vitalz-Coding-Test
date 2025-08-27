import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://exam-vitalz-backend-8267f8929b82.herokuapp.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
