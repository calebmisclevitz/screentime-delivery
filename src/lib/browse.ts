import { CATEGORIES, type Category, type Item } from "./types";

export type BrowseCategory = Category | "All";

/**
 * The browse category lives in the URL rather than component state so it
 * survives the list/map toggle and the Categories sheet, both of which leave
 * the browse views mounted.
 */
export function parseCategory(value: string | null): BrowseCategory {
  return CATEGORIES.includes(value as Category) ? (value as Category) : "All";
}

export function browseHref(
  path: "/" | "/map",
  category: BrowseCategory,
): string {
  return category === "All"
    ? path
    : `${path}?category=${encodeURIComponent(category)}`;
}

export function sortByRecent(items: Item[]): Item[] {
  return [...items].sort(
    (a, b) => Date.parse(b.postedAt) - Date.parse(a.postedAt),
  );
}

export function itemsInCategory(
  items: Item[],
  category: BrowseCategory,
): Item[] {
  return sortByRecent(
    category === "All"
      ? items
      : items.filter((item) => item.category === category),
  );
}

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

export function searchItems(items: Item[], query: string): Item[] {
  if (!query.trim()) return [];
  return sortByRecent(items.filter((item) => matchesQuery(item, query)));
}
