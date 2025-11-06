import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
    site: 'https://benjamin.caradeuc.info',

    markdown: {
        syntaxHighlight: 'shiki',
        shikiConfig: {
            theme: 'dracula-soft',
        },
    },

    integrations: [
        sitemap(),
        icon({
            mdi: ['*'],
        })
    ],
});
