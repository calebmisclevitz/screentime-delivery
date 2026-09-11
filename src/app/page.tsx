"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { EmptyState } from "@/components/empty-state";
import { ItemCard } from "@/components/item-card";
import { PageContainer } from "@/components/page-container";
import { PromoRail } from "@/components/promo-rail";
import { Button } from "@/components/ui/button";
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
    <PageContainer className="pt-browse-header pb-floating-nav md:pb-10">
      <PromoRail />

      <div className="px-4 py-4 md:px-6">
        <Button asChild variant="outline">
          <Link href="/categories">
            {category === "All" ? "All categories" : category}
            <ChevronDownIcon data-icon="inline-end" data-icon-size="mini" />
          </Link>
        </Button>
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
    </PageContainer>
  );
}
