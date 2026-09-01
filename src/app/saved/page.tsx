"use client";

import { BookmarkIcon } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { ItemCard } from "@/components/item-card";
import { SectionHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { findItem, useHydrated, useStore } from "@/lib/store";

export default function SavedPage() {
  const hydrated = useHydrated();
  const savedIds = useStore((s) => s.savedIds);
  const listings = useStore((s) => s.listings);

  const items = savedIds
    .map((id) => findItem(id, listings))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      <SectionHeader
        title="Saved"
        subtitle={
          hydrated
            ? `${items.length} ${items.length === 1 ? "item" : "items"} you're keeping an eye on`
            : "Loading your list"
        }
      />

      {!hydrated ? (
        <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3 md:px-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-3/4 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={BookmarkIcon}
          title="Nothing saved yet"
          description="Tap the bookmark on any listing and it will show up here so you can come back to it."
          actionLabel="Find something"
          actionHref="/browse"
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3 md:px-6 lg:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
