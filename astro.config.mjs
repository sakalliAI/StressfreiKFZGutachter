// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Hauptdomain. Daraus entstehen Canonical, Sitemap, robots.txt,
// llms.txt, Open-Graph- und Schema.org-Adressen.
const SITE = 'https://www.mk-stressfrei.de';

export default defineConfig({
  site: SITE,
  output: 'static',
  // Jede Seite hat genau eine Adresse, immer mit Schraegstrich am Ende.
  // Ohne diese Festlegung waeren /leistungen/kasko und
  // /leistungen/kasko/ zwei Adressen fuer denselben Inhalt.
  trailingSlash: 'always',
  build: {
    // Das gesamte CSS inline ausliefern spart einen render-blockierenden
    // Request und drueckt den LCP. Das Stylesheet ist klein genug, dass
    // es sich auch bei mehreren Seiten lohnt; gemessen in docs/handover.md.
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      // Die 404-Seite gehoert nicht in die Sitemap.
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: false,
    },
  },
});
