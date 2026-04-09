import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OpenRetro',
  description: 'Retrospectivas de equipo colaborativas y en tiempo real.',
  lang: 'es',
  vite: {
    resolve: {
      alias: {
        '@shared': fileURLToPath(new URL('../../shared', import.meta.url)),
      },
    },
  },

  themeConfig: {
    nav: [
      { text: 'Guía', link: '/guide/' },
      { text: 'API', link: '/api/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guía',
          items: [{ text: 'Introducción', link: '/guide/' }],
        },
      ],
      '/api/': [
        {
          text: 'API',
          items: [{ text: 'Referencia', link: '/api/' }],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/fedeegmz/open-retro' }],
  },
})
