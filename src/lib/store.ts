"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { ME, MARKET_ITEMS, MY_SEEDED_LISTINGS } from "./data/items";
import { NEIGHBORHOODS } from "./data/neighborhoods";
import { HOME, deliveryFee, distanceMiles } from "./geo";
import type { Draft, Fulfillment, Item, Order } from "./types";

export { useHydrated } from "./clock";

const COURIERS = [
  "Rosalie B.",
  "Amir T.",
  "Devon Marsh",
  "Priya N.",
  "Hollis Grant",
];

/** Courier standby points around Raleigh, so each order starts somewhere different. */
const COURIER_STARTS = [
  { lat: 35.7721, lng: -78.6553 },
  { lat: 35.7994, lng: -78.6265 },
  { lat: 35.8112, lng: -78.6591 },
  { lat: 35.7688, lng: -78.6301 },
];

type State = {
  savedIds: string[];
  orders: Order[];
  listings: Item[];
  recentSearches: string[];
};

type Actions = {
  toggleSaved: (id: string) => void;
  placeOrder: (item: Item, fulfillment: Fulfillment, dropoff: string) => Order;
  addListing: (draft: Draft) => Item;
  markSold: (id: string) => void;
  removeListing: (id: string) => void;
  recordSearch: (query: string) => void;
  clearSearches: () => void;
};

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      savedIds: ["technics-sl1200", "kilim-rug"],
      orders: [],
      listings: MY_SEEDED_LISTINGS,
      recentSearches: [],

      toggleSaved: (id) =>
        set((s) => ({
          savedIds: s.savedIds.includes(id)
            ? s.savedIds.filter((x) => x !== id)
            : [id, ...s.savedIds],
        })),

      placeOrder: (item, fulfillment, dropoff) => {
        const miles = distanceMiles(item.location, HOME);
        const fee =
          fulfillment === "delivery" ? deliveryFee(item.size, miles) : 0;
        const seed = get().orders.length;
        const order: Order = {
          id: `SM-${Math.random().toString(36).toUpperCase().slice(2, 8)}`,
          itemId: item.id,
          fulfillment,
          dropoffAddress: dropoff,
          itemPrice: item.price,
          deliveryFee: fee,
          total: item.price + fee,
          courierName: COURIERS[seed % COURIERS.length],
          courierStart: COURIER_STARTS[seed % COURIER_STARTS.length],
          placedAt: Date.now(),
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },

      addListing: (draft) => {
        const spot = NEIGHBORHOODS[draft.neighborhood] ?? HOME;
        const item: Item = {
          id: `mine-${Date.now().toString(36)}`,
          title: draft.title.trim(),
          price: Number(draft.price) || 0,
          category: draft.category,
          condition: draft.condition,
          description: draft.description.trim(),
          images: [draft.image],
          seller: ME,
          location: {
            lat: spot.lat,
            lng: spot.lng,
            neighborhood: draft.neighborhood.trim() || "Glenwood South",
          },
          size: "medium",
          deliveryAvailable: draft.deliveryAvailable,
          postedAt: new Date().toISOString(),
          status: "active",
        };
        set((s) => ({ listings: [item, ...s.listings] }));
        return item;
      },

      markSold: (id) =>
        set((s) => ({
          listings: s.listings.map((l) =>
            l.id === id ? { ...l, status: "sold" as const } : l,
          ),
        })),

      removeListing: (id) =>
        set((s) => ({ listings: s.listings.filter((l) => l.id !== id) })),

      recordSearch: (query) => {
        const q = query.trim();
        if (!q) return;
        set((s) => ({
          recentSearches: [
            q,
            ...s.recentSearches.filter(
              (x) => x.toLowerCase() !== q.toLowerCase(),
            ),
          ].slice(0, 6),
        }));
      },

      clearSearches: () => set({ recentSearches: [] }),
    }),
    { name: "swapmeet" },
  ),
);

/** Looks an item up across the seeded market and the user's own listings. */
export function findItem(id: string, listings: Item[]): Item | undefined {
  return (
    MARKET_ITEMS.find((i) => i.id === id) ?? listings.find((i) => i.id === id)
  );
}
