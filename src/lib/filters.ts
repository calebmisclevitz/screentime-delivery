import { HOME, distanceMiles } from "./geo";
import type { Category, Condition, Item } from "./types";

export type SortKey = "recent" | "price-asc" | "price-desc" | "distance";

export const SORT_LABELS: Record<SortKey, string> = {
  recent: "Newest first",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  distance: "Closest to me",
};

export type Filters = {
  query: string;
  category: Category | "All";
  maxPrice: number;
  conditions: Condition[];
  deliveryOnly: boolean;
  sort: SortKey;
};

export const PRICE_CEILING = 3200;

export const DEFAULT_FILTERS: Filters = {
  query: "",
  category: "All",
  maxPrice: PRICE_CEILING,
  conditions: [],
  deliveryOnly: false,
  sort: "recent",
};

export function matchesQuery(item: Item, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    item.title,
    item.category,
    item.description,
    item.location.neighborhood,
    item.condition,
  ]
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

export function applyFilters(items: Item[], filters: Filters): Item[] {
  const result = items.filter((item) => {
    if (filters.category !== "All" && item.category !== filters.category)
      return false;
    if (item.price > filters.maxPrice) return false;
    if (filters.conditions.length && !filters.conditions.includes(item.condition))
      return false;
    if (filters.deliveryOnly && !item.deliveryAvailable) return false;
    return matchesQuery(item, filters.query);
  });

  const sorted = [...result];
  switch (filters.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "distance":
      sorted.sort(
        (a, b) =>
          distanceMiles(a.location, HOME) - distanceMiles(b.location, HOME),
      );
      break;
    default:
      sorted.sort(
        (a, b) => Date.parse(b.postedAt) - Date.parse(a.postedAt),
      );
  }
  return sorted;
}

export function activeFilterCount(filters: Filters): number {
  let count = 0;
  if (filters.category !== "All") count++;
  if (filters.maxPrice < PRICE_CEILING) count++;
  if (filters.conditions.length) count++;
  if (filters.deliveryOnly) count++;
  if (filters.sort !== "recent") count++;
  return count;
}
