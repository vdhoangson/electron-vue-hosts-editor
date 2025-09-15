import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vuetify({
      autoImport: true, // Tự động import components khi sử dụng
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['vue', 'vuetify'],
  },
  ssr: {
    noExternal: ['vuetify'], // Cần thiết cho Vuetify
  },
  server: {
    port: 5173, // Đổi port để tránh xung đột
    strictPort: true, // Không tự động chuyển port
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit to 1000 kB
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          vue: ['vue', 'vue-i18n'],
          vuetify: ['vuetify'],
          electron: ['electron'],
          utils: ['sudo-prompt', 'flag-icons'],
        },
      },
    },
  },
})
