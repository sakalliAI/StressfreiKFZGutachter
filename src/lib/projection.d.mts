export interface LatLon {
  lat: number;
  lon: number;
}

export interface View {
  center: LatLon;
  mPerPx: number;
  tileZoom: number;
  w: number;
  h: number;
}

export declare function worldPx(lat: number, lon: number, zoom: number): { x: number; y: number };
export declare function fromWorldPx(x: number, y: number, zoom: number): LatLon;
export declare function metersPerPx(lat: number, zoom: number): number;
export declare function projector(view: View): {
  scale: number;
  pxPerKm: number;
  toMap(lat: number, lon: number): { x: number; y: number };
  originPx(): { x: number; y: number };
};
export declare function fitView(
  points: LatLon[],
  opts: { w: number; h: number; pad?: number; minMPerPx?: number },
): View;
