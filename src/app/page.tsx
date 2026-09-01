"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { SearchIcon, TruckIcon } from "lucide-react";

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
      <aside className="hidden w-[380px] shrink-0 flex-col border-r lg:flex xl:w-[440px]">
        <div className="border-b p-4">
          <SearchLink />
          <CategoryChips
            value={category}
            onChange={setCategory}
            className="mt-3"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="pb-3 text-xs text-muted-foreground">
            {items.length} items in Raleigh
          </p>
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setPickedId(item.id)}
                className={cn(
                  "rounded-xl transition-shadow",
                  selectedId === item.id && "ring-2 ring-foreground/20",
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
        />

        {/* Mobile overlay controls */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 space-y-3 p-3 lg:hidden">
          <div className="pointer-events-auto">
            <SearchLink />
          </div>
          <div className="pointer-events-auto">
            <CategoryChips value={category} onChange={setCategory} />
          </div>
        </div>

        {/* Mobile card rail */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 flex gap-3 overflow-x-auto p-3 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
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
      className="flex h-11 items-center gap-2.5 rounded-full border bg-background/95 px-4 text-sm text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground"
    >
      <SearchIcon className="size-4" />
      Search vintage finds in Raleigh
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
        "relative flex w-[248px] shrink-0 gap-3 rounded-xl border bg-background/95 p-2 shadow-sm backdrop-blur transition-colors",
        selected ? "border-foreground" : "border-border",
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
        <div className="flex items-center gap-1.5">
          <span className="font-heading text-sm font-semibold">
            {formatPrice(item.price)}
          </span>
          {item.deliveryAvailable && (
            <TruckIcon className="size-3 text-muted-foreground" />
          )}
        </div>
        <p className="truncate text-xs text-foreground">{item.title}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {item.location.neighborhood} · {formatDistance(miles)}
        </p>
      </div>
      <SaveButton
        itemId={item.id}
        title={item.title}
        className="absolute top-2 right-2 size-7 bg-transparent"
      />
    </Link>
  );
}
