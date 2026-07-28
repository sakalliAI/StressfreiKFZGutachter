// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Vorschau-Domain. Beim Go-Live auf die Kundendomain umstellen
// (siehe docs/handover.md, Abschnitt "Domain wechseln").
const SITE = 'https://mk-stressfrei.sakalli.ai';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // Onepager: das gesamte CSS inline ausliefern spart einen
    // render-blockierenden Request und drueckt den LCP.
    inlineStylesheets: 'always',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: false,
    },
  },
});
