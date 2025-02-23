import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      exportAsDefault: true
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3030,
  },
  preview: {
    host: '0.0.0.0',
    port: 8080,
  },
})
