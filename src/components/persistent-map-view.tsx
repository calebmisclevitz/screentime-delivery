"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { TruckIcon } from "@heroicons/react/24/outline";

import { StickerMap } from "@/components/map";
import { SaveButton } from "@/components/save-button";
import { itemsInCategory, parseCategory } from "@/lib/browse";
import { MARKET_ITEMS } from "@/lib/data/items";
import { HOME, distanceKm, formatDistance, formatPrice } from "@/lib/geo";
import type { Item } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Lives in the root app shell so MapLibre can stay initialized while pages
 * change. Visibility follows the route without unmounting the map.
 */
export function PersistentMapView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === "/map";
  const category = parseCategory(searchParams.get("category"));
  const [pickedId, setPickedId] = useState<string | null>(null);

  const items = useMemo(
    () => itemsInCategory(MARKET_ITEMS, category),
    [category],
  );
  const selectedId = items.some((item) => item.id === pickedId)
    ? pickedId
    : null;
  const selectedItem = items.find((item) => item.id === selectedId);

  return (
    <div
      inert={!active}
      className={cn(
        "absolute inset-0",
        // MapLibre's stylesheet forces its attribution control back to
        // `visibility: visible`, so an inactive map is hidden with opacity.
        !active && "invisible opacity-0",
      )}
    >
      <StickerMap
        items={items}
        selectedId={selectedId}
        onSelect={setPickedId}
        className="absolute inset-0"
      />

      {selectedItem && (
        <div className="absolute inset-x-0 bottom-floating-nav z-20 flex justify-center px-4 pb-4">
          <SelectedItemCard item={selectedItem} />
        </div>
      )}
    </div>
  );
}

function SelectedItemCard({ item }: { item: Item }) {
  const kilometres = distanceKm(item.location, HOME);

  return (
    <Link
      href={`/item/${item.id}`}
      className="relative flex w-full max-w-sm gap-4 rounded-xl bg-card p-2 shadow-float transition-colors"
    >
      <div
        className="relative size-16 shrink-0 overflow-hidden rounded-lg"
        style={{ backgroundColor: item.backgroundColor }}
      >
        <Image
          src={item.images[0]}
          alt={item.title}
          fill
          sizes="64px"
          className="object-contain p-1.5"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center pr-8">
        <p className="truncate font-medium">{item.title}</p>
        <p className="flex items-center gap-2 text-muted-foreground type-label-small">
          <span>{formatPrice(item.price)}</span>
          <span aria-hidden>·</span>
          <span>{formatDistance(kilometres)}</span>
          {item.deliveryAvailable && (
            <TruckIcon className="size-4" />
          )}
        </p>
      </div>
      <SaveButton itemId={item.id} className="absolute top-2 right-2" />
    </Link>
  );
}
