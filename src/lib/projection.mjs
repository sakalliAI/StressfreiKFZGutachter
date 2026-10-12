/**
 * Web-Mercator-Projektion fuer frei gewaehlte Kartenausschnitte.
 *
 * Wird vom Bauskript der Ortskarten (scripts/build-route-maps.mjs) und
 * von der Komponente src/components/RouteMap.astro benutzt. Beide
 * muessen exakt dieselbe Rechnung machen, sonst liegt die Route neben
 * der Strasse. Deshalb steht sie an einer Stelle.
 *
 * Reines JavaScript, damit das Node-Skript sie ohne Compiler laden kann.
 */

const TILE = 256;

/** Grad zu Weltbildpunkten einer Zoomstufe. */
export function worldPx(lat, lon, zoom) {
  const size = TILE * 2 ** zoom;
  const latRad = (lat * Math.PI) / 180;
  return {
    x: ((lon + 180) / 360) * size,
    y: ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * size,
  };
}

/** Weltbildpunkte zurueck zu Grad. */
export function fromWorldPx(x, y, zoom) {
  const size = TILE * 2 ** zoom;
  const lon = (x / size) * 360 - 180;
  const lat = (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / size))) * 180) / Math.PI;
  return { lat, lon };
}

/** Meter je Bildpunkt einer Kachel auf gegebener Breite. */
export function metersPerPx(lat, zoom) {
  return (156543.03392 * Math.cos((lat * Math.PI) / 180)) / 2 ** zoom;
}

/**
 * Projektion fuer einen Ausschnitt.
 *
 * @param {{ center: {lat:number, lon:number}, mPerPx: number, tileZoom: number, w: number, h: number }} view
 */
export function projector(view) {
  const scale = view.mPerPx / metersPerPx(view.center.lat, view.tileZoom);
  const c = worldPx(view.center.lat, view.center.lon, view.tileZoom);
  return {
    scale,
    pxPerKm: 1000 / view.mPerPx,
    /** Grad zu Bildpunkten im Ausschnitt. */
    toMap(lat, lon) {
      const p = worldPx(lat, lon, view.tileZoom);
      return { x: (p.x - c.x) / scale + view.w / 2, y: (p.y - c.y) / scale + view.h / 2 };
    },
    /** Linke obere Ecke des Ausschnitts in Kachel-Weltbildpunkten. */
    originPx() {
      return { x: c.x - (view.w * scale) / 2, y: c.y - (view.h * scale) / 2 };
    },
  };
}

/**
 * Waehlt Mitte, Massstab und Kachelstufe so, dass alle Punkte mit Rand
 * ins Bild passen.
 *
 * Die Kachelstufe ist die feinste, bei der die Kacheln noch verkleinert
 * statt vergroessert werden. So bleibt die Zeichnung scharf.
 *
 * @param {{lat:number, lon:number}[]} points
 * @param {{ w: number, h: number, pad?: number, minMPerPx?: number }} opts
 */
export function fitView(points, { w, h, pad = 0.14, minMPerPx = 18 }) {
  const Z0 = 20;
  const px = points.map((p) => worldPx(p.lat, p.lon, Z0));
  const minX = Math.min(...px.map((p) => p.x));
  const maxX = Math.max(...px.map((p) => p.x));
  const minY = Math.min(...px.map((p) => p.y));
  const maxY = Math.max(...px.map((p) => p.y));
  const center = fromWorldPx((minX + maxX) / 2, (minY + maxY) / 2, Z0);

  const usableW = w * (1 - 2 * pad);
  const usableH = h * (1 - 2 * pad);
  const z0PerOut = Math.max((maxX - minX) / usableW, (maxY - minY) / usableH);
  const mPerPx = Math.max(minMPerPx, z0PerOut * metersPerPx(center.lat, Z0));

  const tileZoom = Math.min(
    16,
    Math.ceil(Math.log2((156543.03392 * Math.cos((center.lat * Math.PI) / 180)) / mPerPx)),
  );

  return {
    center: { lat: Math.round(center.lat * 1e5) / 1e5, lon: Math.round(center.lon * 1e5) / 1e5 },
    mPerPx: Math.round(mPerPx * 10) / 10,
    tileZoom,
    w,
    h,
  };
}
