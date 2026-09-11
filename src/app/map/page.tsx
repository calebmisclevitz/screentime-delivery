"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { ChevronDownIcon, TruckIcon } from "@heroicons/react/24/outline";

import { StickerMap } from "@/components/map";
import { SaveButton } from "@/components/save-button";
import { itemsInCategory, parseCategory } from "@/lib/browse";
import { MARKET_ITEMS } from "@/lib/data/items";
import { HOME, distanceMiles, formatDistance, formatPrice } from "@/lib/geo";
import type { Item } from "@/lib/types";

export default function MapPage() {
  return (
    <Suspense>
      <MapContent />
    </Suspense>
  );
}

function MapContent() {
  const searchParams = useSearchParams();
  const category = parseCategory(searchParams.get("category"));
  const [pickedId, setPickedId] = useState<string | null>(null);

  const items = useMemo(
    () => itemsInCategory(MARKET_ITEMS, category),
    [category],
  );

  // Changing category can filter out the picked item, so selection is derived
  // rather than reset in an effect.
  const selectedId = items.some((item) => item.id === pickedId)
    ? pickedId
    : null;
  const selectedItem = items.find((item) => item.id === selectedId);

  return (
    <div className="absolute inset-0">
      <StickerMap
        items={items}
        selectedId={selectedId}
        onSelect={setPickedId}
        className="absolute inset-0"
      />

      <div className="absolute top-browse-header left-4 z-20">
        <Link
          href="/categories?from=map"
          className="flex h-control items-center gap-2 rounded-full bg-card px-4 type-body-large shadow-float focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {category === "All" ? "All categories" : category}
          <ChevronDownIcon className="size-icon" />
        </Link>
      </div>

      {selectedItem && (
        <div className="absolute inset-x-0 bottom-floating-nav z-20 flex justify-center px-4 pb-4">
          <SelectedItemCard item={selectedItem} />
        </div>
      )}
    </div>
  );
}

function SelectedItemCard({ item }: { item: Item }) {
  const miles = distanceMiles(item.location, HOME);

  return (
    <Link
      href={`/item/${item.id}`}
      className="relative flex w-full max-w-sm gap-4 rounded-xl bg-card p-2 shadow-float transition-colors"
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={item.images[0]}
          alt={item.title}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center pr-8">
        <p className="truncate">{item.title}</p>
        <p className="flex items-center gap-2 type-label-small">
          <span>{formatPrice(item.price)}</span>
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <span>{formatDistance(miles)}</span>
          {item.deliveryAvailable && (
            <TruckIcon className="size-4 text-muted-foreground" />
          )}
        </p>
      </div>
      <SaveButton
        itemId={item.id}
        title={item.title}
        className="absolute top-2 right-2"
      />
    </Link>
  );
}
