import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es2015'
  },
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'safari >= 11', 'ios >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
})
