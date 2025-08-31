import { defineConfig } from 'astro/config';

import solidJs from '@astrojs/solid-js';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://benjamin.caradeuc.info',

  markdown: {
    syntaxHighlight: 'prism'
  },

  integrations: [
    solidJs(),
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      filter: (page) => !page.includes('/drafts/'),
    })
  ],
});