"use client";

import { useClock } from "./clock";
import { HOME, pointAlongPath } from "./geo";
import type { DeliveryStage, Item, LatLng, Order } from "./types";

/** A full simulated delivery runs this long from order placement to drop-off. */
export const DELIVERY_DURATION_MS = 90_000;

type StageSpec = {
  stage: DeliveryStage;
  /** Progress value at which this stage ends. */
  until: number;
  label: string;
  detail: string;
};

const STAGE_SPECS: StageSpec[] = [
  {
    stage: "matching",
    until: 0.12,
    label: "Finding a courier",
    detail: "Pinging Swapmeeters near the pickup",
  },
  {
    stage: "to_seller",
    until: 0.42,
    label: "Heading to the seller",
    detail: "On the way to collect your item",
  },
  {
    stage: "picked_up",
    until: 0.5,
    label: "Item picked up",
    detail: "Confirmed with the seller",
  },
  {
    stage: "to_buyer",
    until: 0.97,
    label: "On the way to you",
    detail: "Bringing it to your drop-off address",
  },
  {
    stage: "delivered",
    until: 1,
    label: "Delivered",
    detail: "Left at your door",
  },
];

export const STAGE_ORDER = STAGE_SPECS.map((s) => s.stage);

export function stageAt(progress: number): StageSpec {
  return STAGE_SPECS.find((s) => progress <= s.until) ?? STAGE_SPECS.at(-1)!;
}

export function stageSpec(stage: DeliveryStage): StageSpec {
  return STAGE_SPECS.find((s) => s.stage === stage)!;
}

/**
 * Nudges a midpoint off the direct line so the drawn route reads like streets
 * rather than a ruler. Deterministic per leg so it does not jitter on rerender.
 */
function bend(from: LatLng, to: LatLng, amount: number): LatLng {
  const mid = { lat: (from.lat + to.lat) / 2, lng: (from.lng + to.lng) / 2 };
  return {
    lat: mid.lat + (to.lng - from.lng) * amount,
    lng: mid.lng - (to.lat - from.lat) * amount,
  };
}

/** Courier standby point, to the seller, then on to the buyer. */
export function routeFor(order: Order, item: Item): LatLng[] {
  const seller = { lat: item.location.lat, lng: item.location.lng };
  const home = { lat: HOME.lat, lng: HOME.lng };
  return [
    order.courierStart,
    bend(order.courierStart, seller, 0.14),
    seller,
    bend(seller, home, -0.12),
    home,
  ];
}

/** Index in the route at which the courier reaches the seller. */
const PICKUP_INDEX = 2;

export function courierPosition(route: LatLng[], progress: number): LatLng {
  // The first half of the timeline covers the leg to the seller, the second
  // half covers the leg to the buyer, so pickup always lands at the midpoint.
  if (progress <= 0.5) {
    return pointAlongPath(route.slice(0, PICKUP_INDEX + 1), progress / 0.5);
  }
  return pointAlongPath(route.slice(PICKUP_INDEX), (progress - 0.5) / 0.5);
}

export function progressFor(order: Order, now: number): number {
  if (order.fulfillment !== "delivery") return 1;
  return Math.min((now - order.placedAt) / DELIVERY_DURATION_MS, 1);
}

/** The 90s simulation stands in for a delivery of roughly this many minutes. */
const SIMULATED_TOTAL_MINUTES = 38;

export function etaMinutes(progress: number): number {
  return Math.max(0, Math.ceil((1 - progress) * SIMULATED_TOTAL_MINUTES));
}

/** Recomputes on every clock tick while the app is hydrated. */
export function useDeliveryProgress(order: Order | undefined): number {
  const now = useClock();
  if (!order || now === 0) return 0;
  return progressFor(order, now);
}
