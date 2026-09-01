"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PackageSearchIcon, SearchIcon } from "lucide-react";

import { CategoryChips } from "@/components/category-chips";
import { EmptyState } from "@/components/empty-state";
import { FilterSheet } from "@/components/filter-sheet";
import { ItemCard } from "@/components/item-card";
import { SectionHeader } from "@/components/page-header";
import { MARKET_ITEMS } from "@/lib/data/items";
import {
  DEFAULT_FILTERS,
  SORT_LABELS,
  applyFilters,
  type Filters,
} from "@/lib/filters";

export default function BrowsePage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const results = useMemo(
    () => applyFilters(MARKET_ITEMS, filters),
    [filters],
  );

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      <SectionHeader
        title="Browse"
        subtitle={`${results.length} ${results.length === 1 ? "item" : "items"} · ${SORT_LABELS[filters.sort]}`}
        action={
          <Link
            href="/search"
            aria-label="Search"
            className="flex size-10 items-center justify-center rounded-lg border text-muted-foreground hover:text-foreground md:hidden"
          >
            <SearchIcon className="size-4" />
          </Link>
        }
      />

      <div className="sticky top-0 z-10 space-y-3 border-b bg-background/95 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <CategoryChips
              value={filters.category}
              onChange={(category) => setFilters({ ...filters, category })}
            />
          </div>
          <FilterSheet filters={filters} onChange={setFilters} />
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={PackageSearchIcon}
          title="Nothing matches those filters"
          description="Try widening the price range or clearing a category to see more of what's listed in Raleigh."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3 md:px-6 lg:grid-cols-4">
          {results.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
