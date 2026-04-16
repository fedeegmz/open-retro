import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@open-retro/shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist-lib',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'OpenRetroWebClient',
      fileName: (format) => `open-retro-web-client.${format}.js`,
    },
    rollupOptions: {
      // Ensure we don't bundle dependencies that should be provided by the SaaS Vite app
      external: ['vue', 'vue-router', 'vue-i18n', '@open-retro/shared', 'pinia'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          'vue-i18n': 'VueI18n',
          '@open-retro/shared': 'OpenRetroShared',
        },
      },
    },
  },
})
