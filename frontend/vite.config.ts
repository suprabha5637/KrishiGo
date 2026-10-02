import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Root alias — import from '@/...' maps to 'src/...'
      '@': `${import.meta.dirname}/src`,

      // Domain-level aliases
      '@/ecommerce':        `${import.meta.dirname}/src/components/ecommerce`,
      '@/farmer':           `${import.meta.dirname}/src/components/farmer`,
      '@/auth':             `${import.meta.dirname}/src/components/auth`,
      '@/common':           `${import.meta.dirname}/src/components/common`,
      '@/services':         `${import.meta.dirname}/src/services`,
      '@/hooks':            `${import.meta.dirname}/src/hooks`,
      '@/context':          `${import.meta.dirname}/src/context`,
      '@/types':            `${import.meta.dirname}/src/types`,
      '@/config':           `${import.meta.dirname}/src/config`,
      '@/lib':              `${import.meta.dirname}/src/lib`,
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
