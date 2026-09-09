"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/outline";

import { CategoryChips } from "@/components/category-chips";
import { EmptyState } from "@/components/empty-state";
import { FilterSheet } from "@/components/filter-sheet";
import { ItemCard } from "@/components/item-card";
import { PromoRail } from "@/components/promo-rail";
import { MARKET_ITEMS } from "@/lib/data/items";
import { DEFAULT_FILTERS, applyFilters, type Filters } from "@/lib/filters";

export default function HomePage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const results = useMemo(
    () => applyFilters(MARKET_ITEMS, filters),
    [filters],
  );

  return (
    <div className="mx-auto w-full max-w-6xl pb-floating-nav md:pb-10">
      <div className="px-4 pt-3 pb-3 md:px-6">
        <Link
          href="/search"
          className="flex h-12 items-center gap-3 rounded-full bg-card px-4 text-lg text-muted-foreground transition-colors hover:text-foreground"
        >
          <MagnifyingGlassIcon className="size-4" />
          Search
        </Link>
      </div>

      <PromoRail />

      <div className="sticky top-0 z-10 space-y-3 bg-background/95 px-4 py-3 backdrop-blur md:px-6">
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
          icon={MagnifyingGlassPlusIcon}
          title="Nothing matches those filters"
          description="Try widening the price range or clearing a category to see more of what's listed in Raleigh."
        />
      ) : (
        <div className="grid grid-cols-2 border-t md:grid-cols-3 lg:grid-cols-4">
          {results.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
