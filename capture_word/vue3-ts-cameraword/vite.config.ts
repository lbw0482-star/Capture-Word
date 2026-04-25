import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: { 
    allowedHosts: true, 
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
      '/tts': {
        target: 'https://openspeech.byteoversea.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/tts/, ''),
      },
    },
  },
})
