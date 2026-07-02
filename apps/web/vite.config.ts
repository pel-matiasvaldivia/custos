import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icons/apple-touch-icon.png', 'icons/favicon-32.png'],
      manifest: {
        name: 'CustOS GO',
        short_name: 'CustOS GO',
        description: 'App de vigilancia móvil de CustOS: asistencia, rondas y pánico.',
        // La app instalada abre directamente el flujo del guardia.
        start_url: '/mobile',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0e1f3a',
        theme_color: '#0e1f3a',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache del app-shell → la app abre sin internet.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/index.html',
        // No interceptar el backend con el fallback de navegación.
        navigateFallbackDenylist: [/^\/api/, /^\/socket\.io/],
        runtimeCaching: [
          {
            // GET de solo lectura del móvil: se sirven de red y se cachean para
            // consultarlos offline (turno actual, etc.). Las escrituras NO se
            // cachean acá: van por la cola offline (Fase 1).
            urlPattern: ({ url, request }) =>
              request.method === 'GET' && url.pathname.startsWith('/api/v1/mobile'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'mobile-api-get',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
    },
  },
})
