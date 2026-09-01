const DAY_MS = 86_400_000;

/**
 * Start of the current UTC day. Seed timestamps and relative labels are both
 * derived from this fixed anchor rather than `Date.now()`, so the server and
 * the browser always agree and sort ties never flip during hydration.
 */
export const TODAY_UTC = new Date().setUTCHours(0, 0, 0, 0);

export function daysAgoISO(days: number): string {
  return new Date(TODAY_UTC - days * DAY_MS).toISOString();
}

export function formatRelativeTime(iso: string): string {
  const days = Math.round((TODAY_UTC - Date.parse(iso)) / DAY_MS);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}
