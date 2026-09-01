"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeftIcon,
  ClockIcon,
  SearchIcon,
  SearchXIcon,
  XIcon,
} from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { ItemCard } from "@/components/item-card";
import { Button } from "@/components/ui/button";
import { MARKET_ITEMS } from "@/lib/data/items";
import { applyFilters, DEFAULT_FILTERS } from "@/lib/filters";
import { useHydrated, useStore } from "@/lib/store";

const SUGGESTIONS = [
  "Rhodes",
  "teak",
  "turntable",
  "brass",
  "Five Points",
  "lamp",
];

export default function SearchPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const hydrated = useHydrated();
  const recentSearches = useStore((s) => s.recentSearches);
  const recordSearch = useStore((s) => s.recordSearch);
  const clearSearches = useStore((s) => s.clearSearches);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(
    () =>
      query.trim()
        ? applyFilters(MARKET_ITEMS, { ...DEFAULT_FILTERS, query })
        : [],
    [query],
  );

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/95 px-2 py-2 backdrop-blur md:px-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg hover:bg-muted"
        >
          <ChevronLeftIcon className="size-5" />
        </button>
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => recordSearch(query)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                recordSearch(query);
                inputRef.current?.blur();
              }
            }}
            type="search"
            enterKeyHint="search"
            placeholder="Search Swapmeet Raleigh"
            aria-label="Search items"
            className="h-11 w-full rounded-full border bg-background pr-10 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      </div>

      {!query.trim() ? (
        <div className="space-y-7 p-4 md:px-6">
          {hydrated && recentSearches.length > 0 && (
            <section>
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Recent
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearches}
                  className="h-7 text-muted-foreground"
                >
                  Clear
                </Button>
              </div>
              <ul className="divide-y">
                {recentSearches.map((term) => (
                  <li key={term}>
                    <button
                      type="button"
                      onClick={() => setQuery(term)}
                      className="flex h-11 w-full items-center gap-3 text-left text-sm"
                    >
                      <ClockIcon className="size-4 shrink-0 text-muted-foreground" />
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Try searching
            </h2>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="h-9 rounded-full border px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {term}
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={SearchXIcon}
          title={`No results for "${query.trim()}"`}
          description="Check the spelling, or browse by category to see everything listed nearby."
          actionLabel="Browse all items"
          actionHref="/browse"
        />
      ) : (
        <>
          <p className="px-4 pt-4 text-xs text-muted-foreground md:px-6">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3 md:px-6 lg:grid-cols-4">
            {results.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
