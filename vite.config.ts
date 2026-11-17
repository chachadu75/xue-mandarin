import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// BASE_PATH lets the app live under a sub-path (e.g. GitHub Pages: /xue/)
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  server: { host: true, port: 5173 },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Xué 学 — Mandarin HSK 3',
        short_name: 'Xué',
        description: 'Lire, tracer, écrire le pinyin et prononcer le mandarin, 10 minutes par jour.',
        lang: 'fr',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F7F8FC',
        theme_color: '#FFFFFF',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,json,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
})
