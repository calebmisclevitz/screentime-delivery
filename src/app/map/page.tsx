"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlassIcon, TruckIcon } from "@heroicons/react/24/outline";

import { CategoryChips, type CategoryValue } from "@/components/category-chips";
import { ItemCard } from "@/components/item-card";
import { StickerMap } from "@/components/map";
import { SaveButton } from "@/components/save-button";
import { MARKET_ITEMS } from "@/lib/data/items";
import { HOME, distanceMiles, formatDistance, formatPrice } from "@/lib/geo";
import type { Item } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function MapPage() {
  const [category, setCategory] = useState<CategoryValue>("All");
  const [pickedId, setPickedId] = useState<string | null>(null);
  const cardRefs = useRef(new Map<string, HTMLAnchorElement>());

  const items = useMemo(
    () =>
      category === "All"
        ? MARKET_ITEMS
        : MARKET_ITEMS.filter((item) => item.category === category),
    [category],
  );

  // Changing category can filter out the picked item, so selection is derived
  // rather than reset in an effect.
  const selectedId = items.some((item) => item.id === pickedId)
    ? pickedId
    : null;

  // Selecting a sticker should bring its card into view in the rail.
  useEffect(() => {
    if (!selectedId) return;
    cardRefs.current.get(selectedId)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedId]);

  return (
    <div className="absolute inset-0 flex">
      {/* Desktop results panel */}
      <aside className="hidden w-[380px] shrink-0 flex-col border-r pt-14 lg:flex xl:w-[440px]">
        <div className="p-4">
          <SearchLink />
          <CategoryChips
            value={category}
            onChange={setCategory}
            className="mt-3"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <p className="px-4 pb-3 font-mono text-xs tracking-wider text-muted-foreground">
            {items.length} items in Raleigh
          </p>
          <div className="grid grid-cols-2">
            {items.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setPickedId(item.id)}
                className={cn(
                  selectedId === item.id && "bg-card",
                )}
              >
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="relative min-w-0 flex-1">
        <StickerMap
          items={items}
          selectedId={selectedId}
          onSelect={setPickedId}
          className="absolute inset-0"
        />

        {/* Mobile overlay controls */}
        <div className="pointer-events-none absolute inset-x-0 top-14 z-10 space-y-3 p-3 lg:hidden">
          <div className="pointer-events-auto">
            <SearchLink />
          </div>
          <div className="pointer-events-auto">
            <CategoryChips value={category} onChange={setCategory} />
          </div>
        </div>

        {/* Mobile card rail */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 flex gap-3 overflow-x-auto p-3 pb-floating-nav [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <RailCard
              key={item.id}
              item={item}
              selected={selectedId === item.id}
              onFocusItem={() => setPickedId(item.id)}
              ref={(el) => {
                if (el) cardRefs.current.set(item.id, el);
                else cardRefs.current.delete(item.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchLink() {
  return (
    <Link
      href="/search"
      className="flex h-12 items-center gap-3 rounded-full bg-card px-4 text-lg text-muted-foreground transition-colors hover:text-foreground"
    >
      <MagnifyingGlassIcon className="size-4" />
      Search
    </Link>
  );
}

function RailCard({
  item,
  selected,
  onFocusItem,
  ref,
}: {
  item: Item;
  selected: boolean;
  onFocusItem: () => void;
  ref: React.Ref<HTMLAnchorElement>;
}) {
  const miles = distanceMiles(item.location, HOME);

  return (
    <Link
      ref={ref}
      href={`/item/${item.id}`}
      onFocus={onFocusItem}
      className={cn(
        "relative flex w-[248px] shrink-0 gap-3 rounded-xl bg-card p-2 shadow-brand transition-colors",
        selected && "ring-2 ring-primary/30",
      )}
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
      <div className="flex min-w-0 flex-1 flex-col justify-center pr-7">
        <p className="truncate text-sm">{item.title}</p>
        <p className="mt-1 flex items-center gap-1 font-mono text-xs tracking-wide">
          <span>{formatPrice(item.price)}</span>
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <span>{formatDistance(miles)}</span>
          {item.deliveryAvailable && (
            <TruckIcon className="size-3 text-muted-foreground" />
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
