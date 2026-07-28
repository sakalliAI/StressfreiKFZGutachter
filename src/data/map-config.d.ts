/**
 * Typen zu `map-config.mjs`.
 *
 * Die Datei selbst bleibt bewusst reines JavaScript, damit sowohl der
 * Astro-Build als auch das Node-Skript `scripts/build-map.mjs` sie ohne
 * Umweg laden koennen.
 */

export declare const MAP_W: number;
export declare const MAP_H: number;
export declare const M_PER_PX: number;
export declare const TILE_ZOOM: number;
export declare const TILE_SIZE: number;
export declare const CENTER: { readonly lat: number; readonly lon: number };

export declare function tileMetersPerPx(zoom?: number): number;
export declare function tileScale(zoom?: number): number;
export declare function worldPx(lat: number, lon: number, zoom?: number): { x: number; y: number };
export declare function toMap(lat: number, lon: number): { x: number; y: number };
export declare function pxPerKm(): number;
