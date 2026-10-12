/**
 * Titelbilder der Leistungen, zugeordnet ueber `services[].id`.
 *
 * Steht getrennt von site.ts, weil astro:assets statische Importe
 * braucht und site.ts auch im Browser-Script des Formulars landet. Dort
 * haetten Bildimporte nichts verloren.
 */
import type { ImageMetadata } from 'astro';

import haftpflicht from '../assets/leistung-haftpflicht.jpeg';
import kasko from '../assets/leistung-kasko.jpeg';
import kurzgutachten from '../assets/leistung-kurzgutachten.jpeg';
import wertgutachten from '../assets/leistung-wertgutachten.jpeg';
import beweissicherung from '../assets/leistung-beweissicherung.jpeg';
import leasing from '../assets/leistung-leasing.jpeg';

export const serviceImages: Record<string, ImageMetadata> = {
  haftpflicht,
  kasko,
  kurzgutachten,
  wertgutachten,
  beweissicherung,
  leasing,
};
