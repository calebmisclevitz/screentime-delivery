import type { ItemSize, LatLng } from "./types";

/** Downtown Raleigh, NC — the demo city center. */
export const RALEIGH_CENTER: LatLng = { lat: 35.7796, lng: -78.6382 };

/** The signed-in demo user's home base, in Glenwood South. */
export const HOME: LatLng & { address: string } = {
  lat: 35.7846,
  lng: -78.6469,
  address: "612 Glenwood Ave, Raleigh, NC 27603",
};

const EARTH_RADIUS_MI = 3958.8;

export function distanceMiles(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_MI * 2 * Math.asin(Math.sqrt(h));
}

export function formatDistance(miles: number): string {
  return miles < 0.1 ? "Nearby" : `${miles.toFixed(1)} mi away`;
}

const SIZE_BASE_FEE: Record<ItemSize, number> = {
  small: 6,
  medium: 11,
  large: 19,
};

export const SIZE_LABEL: Record<ItemSize, string> = {
  small: "Fits in a backpack",
  medium: "Fits in a car",
  large: "Needs a truck",
};

/** Base fee by item bulk, plus $1.40 per mile, rounded to the nearest half dollar. */
export function deliveryFee(size: ItemSize, miles: number): number {
  const raw = SIZE_BASE_FEE[size] + miles * 1.4;
  return Math.round(raw * 2) / 2;
}

export function formatPrice(value: number): string {
  return value % 1 === 0
    ? `$${value.toLocaleString("en-US")}`
    : `$${value.toFixed(2)}`;
}

/**
 * Interpolates a position along a polyline, where `t` runs 0 to 1 across the
 * whole path rather than per segment, so speed stays constant.
 */
export function pointAlongPath(path: LatLng[], t: number): LatLng {
  if (path.length === 0) return RALEIGH_CENTER;
  if (path.length === 1) return path[0];

  const legs = path.slice(1).map((p, i) => distanceMiles(path[i], p));
  const total = legs.reduce((sum, l) => sum + l, 0);
  if (total === 0) return path[0];

  let remaining = Math.min(Math.max(t, 0), 1) * total;
  for (let i = 0; i < legs.length; i++) {
    if (remaining <= legs[i] || i === legs.length - 1) {
      const ratio = legs[i] === 0 ? 0 : Math.min(remaining / legs[i], 1);
      return {
        lat: path[i].lat + (path[i + 1].lat - path[i].lat) * ratio,
        lng: path[i].lng + (path[i + 1].lng - path[i].lng) * ratio,
      };
    }
    remaining -= legs[i];
  }
  return path[path.length - 1];
}
