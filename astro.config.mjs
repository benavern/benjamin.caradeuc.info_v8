import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
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
        solidJs(),
        sitemap(),
        icon({
            mdi: ['*'],
        })
    ],
});
