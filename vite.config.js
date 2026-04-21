import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Dashboard Uber',
        short_name: 'Uber Dash',
        description: 'Gestión financiera para conductores de Uber',
        theme_color: '#000000',
        background_color: '#f8fafc',
        display: 'standalone',
        icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
    }),
  ],
})
