"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ClockIcon,
  MagnifyingGlassIcon,
  MagnifyingGlassMinusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { EmptyState } from "@/components/empty-state";
import { ItemCard } from "@/components/item-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { searchItems } from "@/lib/browse";
import { MARKET_ITEMS } from "@/lib/data/items";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const hydrated = useHydrated();
  const recentSearches = useStore((s) => s.recentSearches);
  const recordSearch = useStore((s) => s.recordSearch);
  const clearSearches = useStore((s) => s.clearSearches);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => searchItems(MARKET_ITEMS, query), [query]);

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      <PageHeader title="Search Results" />
      <div className="sticky top-browse-header z-10 flex items-center gap-2 bg-background/95 px-4 py-2 backdrop-blur md:px-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
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
            placeholder="Search"
            aria-label="Search items"
            className="h-12 w-full rounded-full bg-card pr-10 pl-9 text-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:hidden"
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
              <XMarkIcon className="size-4" />
            </button>
          )}
        </div>
      </div>

      {!query.trim() ? (
        <div className="space-y-7 p-4 md:px-6">
          {hydrated && recentSearches.length > 0 && (
            <section>
              <div className="flex items-center justify-between pb-2">
                <h2 className="font-mono text-xs font-medium tracking-wider text-muted-foreground">
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
            <h2 className="pb-2 font-mono text-xs font-medium tracking-wider text-muted-foreground">
              Try searching
            </h2>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="h-9 rounded-full bg-card px-4 text-sm text-muted-foreground shadow-brand transition-colors hover:text-foreground"
                >
                  {term}
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={MagnifyingGlassMinusIcon}
          title={`No results for "${query.trim()}"`}
          description="Check the spelling, or browse by category to see everything listed nearby."
          actionLabel="Browse all items"
          actionHref="/"
        />
      ) : (
        <>
          <p className="px-4 pt-4 font-mono text-xs tracking-wider text-muted-foreground md:px-6">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          <div className="grid grid-cols-2 border-t md:grid-cols-3 lg:grid-cols-4">
            {results.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
