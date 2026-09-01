import type { LatLng } from "../types";

/** Pickup areas offered in the listing form, with their map coordinates. */
export const NEIGHBORHOODS: Record<string, LatLng> = {
  "Glenwood South": { lat: 35.7876, lng: -78.6465 },
  "Five Points": { lat: 35.8034, lng: -78.6421 },
  "Historic Oakwood": { lat: 35.7869, lng: -78.6297 },
  Mordecai: { lat: 35.7965, lng: -78.6329 },
  "Boylan Heights": { lat: 35.7742, lng: -78.6488 },
  "Cameron Village": { lat: 35.79, lng: -78.656 },
  "Warehouse District": { lat: 35.7772, lng: -78.6432 },
  "North Hills": { lat: 35.8367, lng: -78.642 },
};

export const NEIGHBORHOOD_NAMES = Object.keys(NEIGHBORHOODS);
