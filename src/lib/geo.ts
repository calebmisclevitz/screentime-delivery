import type { ItemSize, LatLng } from "./types";

/** Bengaluru city centre — the demo city centre. */
export const BENGALURU_CENTER: LatLng = { lat: 12.9716, lng: 77.5946 };

/** The signed-in demo user's home base, in Indiranagar. */
export const HOME: LatLng & { address: string } = {
  lat: 12.9784,
  lng: 77.6408,
  address: "100 Feet Road, Indiranagar, Bengaluru 560038",
};

const EARTH_RADIUS_KM = 6371.0088;

export function distanceKm(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.asin(Math.sqrt(h));
}

export function formatDistance(kilometres: number): string {
  return kilometres < 0.1 ? "Nearby" : `${kilometres.toFixed(1)} km`;
}

const SIZE_BASE_FEE: Record<ItemSize, number> = {
  small: 500,
  medium: 900,
  large: 1500,
};

export const SIZE_LABEL: Record<ItemSize, string> = {
  small: "Fits in a backpack",
  medium: "Fits in a car",
  large: "Needs a tempo",
};

/** Base fee by item bulk, plus ₹70 per kilometre, rounded to the nearest ₹10. */
export function deliveryFee(size: ItemSize, kilometres: number): number {
  const raw = SIZE_BASE_FEE[size] + kilometres * 70;
  return Math.round(raw / 10) * 10;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Interpolates a position along a polyline, where `t` runs 0 to 1 across the
 * whole path rather than per segment, so speed stays constant.
 */
export function pointAlongPath(path: LatLng[], t: number): LatLng {
  if (path.length === 0) return BENGALURU_CENTER;
  if (path.length === 1) return path[0];

  const legs = path.slice(1).map((p, i) => distanceKm(path[i], p));
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
