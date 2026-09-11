"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ClockIcon,
  MagnifyingGlassMinusIcon,
} from "@heroicons/react/24/outline";

import { EmptyState } from "@/components/empty-state";
import { ItemCard } from "@/components/item-card";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";
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
    <PageContainer className="pb-10">
      <PageHeader title="Search Results" />
      <div className="sticky top-browse-header z-10 flex items-center gap-2 bg-background/95 px-4 py-2 backdrop-blur md:px-6">
        <SearchField
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
          onClear={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
          enterKeyHint="search"
          placeholder="Search"
          aria-label="Search items"
          className="flex-1"
        />
      </div>

      {!query.trim() ? (
        <div className="space-y-8 p-4 md:px-6">
          {hydrated && recentSearches.length > 0 && (
            <section>
              <div className="flex items-center justify-between pb-2">
                <h2 className="type-label-small text-muted-foreground">
                  Recent
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearches}
                  className="text-muted-foreground"
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
                      className="flex h-control w-full items-center gap-2 text-left"
                    >
                      <ClockIcon className="size-icon shrink-0 text-muted-foreground" />
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="pb-2 type-label-small text-muted-foreground">
              Try searching
            </h2>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((term) => (
                <Button
                  key={term}
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setQuery(term)}
                  className="bg-card text-muted-foreground shadow-brand hover:text-foreground"
                >
                  {term}
                </Button>
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
          <p className="px-4 pt-4 type-label-small text-muted-foreground md:px-6">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          <div className="grid grid-cols-2 border-t md:grid-cols-3 lg:grid-cols-4">
            {results.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}
