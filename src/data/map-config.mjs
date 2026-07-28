/**
 * Gemeinsame Kartenparameter.
 *
 * Wird sowohl vom Kartenskript (`scripts/build-map.mjs`, holt die
 * Kacheln von OpenStreetMap und setzt sie zusammen) als auch von der
 * Komponente (`src/components/CoverageMap.astro`, legt Ringe und
 * Ortsmarken darauf) verwendet. Beide müssen exakt dieselbe Projektion
 * rechnen, sonst liegen die Marken neben den Orten. Deshalb steht das
 * hier an einer Stelle und nicht zweimal.
 */

/** Ausgabegröße des Kartenbildes in Bildpunkten. */
export const MAP_W = 880;
export const MAP_H = 550;

/**
 * Maßstab: Meter je Bildpunkt der Ausgabe.
 *
 * 120 ist so gewählt, dass Pfaffenhofen im Süden mit Rand ins Bild
 * passt und die Orte um Ingolstadt trotzdem weit genug auseinander
 * liegen, um sie einzeln beschriften zu können.
 */
export const M_PER_PX = 120;

/** Zoomstufe der bezogenen Kacheln. */
export const TILE_ZOOM = 10;
export const TILE_SIZE = 256;

/** Ingolstadt, Mittelpunkt der Karte. */
export const CENTER = { lat: 48.763, lon: 11.425 };

/** Meter je Bildpunkt einer Kachel dieser Zoomstufe, auf Höhe der Mitte. */
export function tileMetersPerPx(zoom = TILE_ZOOM) {
  return (156543.03392 * Math.cos((CENTER.lat * Math.PI) / 180)) / 2 ** zoom;
}

/**
 * Verkleinerungsfaktor von der Kachelauflösung auf die Ausgabe.
 * Größer als 1 heißt: es wird herunterskaliert, die Karte bleibt scharf.
 */
export function tileScale(zoom = TILE_ZOOM) {
  return M_PER_PX / tileMetersPerPx(zoom);
}

/** Web-Mercator: Grad zu Weltbildpunkten der Kachel-Zoomstufe. */
export function worldPx(lat, lon, zoom = TILE_ZOOM) {
  const size = TILE_SIZE * 2 ** zoom;
  const latRad = (lat * Math.PI) / 180;
  return {
    x: ((lon + 180) / 360) * size,
    y: ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * size,
  };
}

/** Grad zu Bildpunkten innerhalb des erzeugten Kartenausschnitts. */
export function toMap(lat, lon) {
  const scale = tileScale();
  const c = worldPx(CENTER.lat, CENTER.lon);
  const p = worldPx(lat, lon);
  return {
    x: (p.x - c.x) / scale + MAP_W / 2,
    y: (p.y - c.y) / scale + MAP_H / 2,
  };
}

/** Bildpunkte je Kilometer im fertigen Kartenausschnitt. */
export function pxPerKm() {
  return 1000 / M_PER_PX;
}
