import type { LatLng } from "../types";

/** Pickup areas offered in the listing form, with their map coordinates. */
export const NEIGHBORHOODS: Record<string, LatLng> = {
  Indiranagar: { lat: 12.9784, lng: 77.6408 },
  Koramangala: { lat: 12.9352, lng: 77.6245 },
  Jayanagar: { lat: 12.925, lng: 77.5938 },
  Malleshwaram: { lat: 13.0035, lng: 77.5647 },
  Basavanagudi: { lat: 12.9417, lng: 77.575 },
  Rajajinagar: { lat: 12.985, lng: 77.5533 },
  Whitefield: { lat: 12.9698, lng: 77.75 },
  "HSR Layout": { lat: 12.9116, lng: 77.6389 },
};

export const NEIGHBORHOOD_NAMES = Object.keys(NEIGHBORHOODS);
