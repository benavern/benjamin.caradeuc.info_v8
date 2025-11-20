import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import rehypeHeadingAnimation from './src/plugins/rehypeheadingAnimation';

export default defineConfig({
    site: 'https://benjamin.caradeuc.info',

    markdown: {
        rehypePlugins: [
           rehypeHeadingAnimation,
        ],
        syntaxHighlight: 'shiki',
        shikiConfig: {
            theme: 'dracula-soft',
        },
    },

    integrations: [
        sitemap(),
        icon({
            include: {
                mdi: ['*'],
            },
        })
    ],
});
