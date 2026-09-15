"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline";

import { EmptyState } from "@/components/empty-state";
import { ItemCard } from "@/components/item-card";
import { PageContainer } from "@/components/page-container";
import { PromoRail } from "@/components/promo-rail";
import { Button } from "@/components/ui/button";
import {
  browseHref,
  categoryLabel,
  itemsInCategory,
  parseCategory,
  type BrowseCategory,
} from "@/lib/browse";
import { MARKET_ITEMS } from "@/lib/data/items";
import { CATEGORIES } from "@/lib/types";

const HOME_TABS: BrowseCategory[] = ["All", ...CATEGORIES];

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

      <nav
        aria-label="Categories"
        className="flex overflow-x-auto px-4 py-6"
      >
        {HOME_TABS.map((tab) => {
          const active = tab === category;
          return (
            <Button
              key={tab}
              asChild
              size="compact"
              variant={active ? "overlay" : "ghost"}
              className={active ? undefined : "text-muted-foreground"}
            >
              <Link
                href={browseHref("/", tab)}
                aria-current={active ? "page" : undefined}
              >
                {categoryLabel(tab)}
              </Link>
            </Button>
          );
        })}
      </nav>

      {results.length === 0 ? (
        <EmptyState
          icon={MagnifyingGlassPlusIcon}
          title="Nothing listed in this category"
          description="Try another category to see more of what's listed in Bengaluru."
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
