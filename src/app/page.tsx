"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/outline";

import { EmptyState } from "@/components/empty-state";
import { ItemCard } from "@/components/item-card";
import { PromoRail } from "@/components/promo-rail";
import { itemsInCategory, parseCategory } from "@/lib/browse";
import { MARKET_ITEMS } from "@/lib/data/items";

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const category = parseCategory(searchParams.get("category"));
  const results = useMemo(
    () => itemsInCategory(MARKET_ITEMS, category),
    [category],
  );

  return (
    <div className="mx-auto w-full max-w-6xl pt-browse-header pb-floating-nav md:pb-10">
      <PromoRail />

      <div className="px-4 py-3 md:px-6">
        <Link
          href="/categories"
          className="flex min-w-0 items-center gap-2 text-lg tracking-wide"
        >
          <span className="truncate">
            {category === "All" ? "All categories" : category}
          </span>
          <ChevronDownIcon className="size-4 shrink-0" />
        </Link>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={MagnifyingGlassPlusIcon}
          title="Nothing listed in this category"
          description="Try another category to see more of what's listed in Raleigh."
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
