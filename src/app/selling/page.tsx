"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArchiveBoxIcon,
  TagIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/geo";
import { formatRelativeTime } from "@/lib/time";
import { useHydrated, useStore } from "@/lib/store";
import type { Item } from "@/lib/types";

export default function SellingPage() {
  const hydrated = useHydrated();
  const listings = useStore((s) => s.listings);
  const markSold = useStore((s) => s.markSold);
  const removeListing = useStore((s) => s.removeListing);

  const active = listings.filter((l) => l.status === "active");
  const sold = listings.filter((l) => l.status === "sold");

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      <PageHeader title="Selling" fallbackHref="/you" />
      <Tabs defaultValue="active" className="gap-0">
        <div className="sticky top-browse-header z-10 flex items-center gap-2 border-b bg-background/95 px-4 py-3 backdrop-blur md:px-6">
          <TabsList className="h-10 min-w-0 flex-1">
            <TabsTrigger value="active">
              Active {hydrated && active.length > 0 && `(${active.length})`}
            </TabsTrigger>
            <TabsTrigger value="sold">
              Sold {hydrated && sold.length > 0 && `(${sold.length})`}
            </TabsTrigger>
          </TabsList>
          <Button asChild size="lg" className="h-10 shrink-0">
            <Link href="/sell">New listing</Link>
          </Button>
        </div>

        {!hydrated ? (
          <div className="space-y-3 p-4 md:px-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="active" className="p-4 md:px-6">
              {active.length === 0 ? (
                <EmptyState
                  icon={TagIcon}
                  title="No active listings"
                  description="Post something from around the house and offer delivery so buyers across town can take it."
                  actionLabel="List an item"
                  actionHref="/sell"
                />
              ) : (
                <ul className="space-y-3">
                  {active.map((item) => (
                    <ListingRow
                      key={item.id}
                      item={item}
                      onMarkSold={() => {
                        markSold(item.id);
                        toast("Marked as sold", { description: item.title });
                      }}
                      onRemove={() => {
                        removeListing(item.id);
                        toast("Listing removed", { description: item.title });
                      }}
                    />
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="sold" className="p-4 md:px-6">
              {sold.length === 0 ? (
                <EmptyState
                  icon={ArchiveBoxIcon}
                  title="Nothing sold yet"
                  description="Once a buyer takes one of your listings it moves here with the final price."
                />
              ) : (
                <ul className="space-y-3">
                  {sold.map((item) => (
                    <ListingRow key={item.id} item={item} />
                  ))}
                </ul>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
function ListingRow({
  item,
  onMarkSold,
  onRemove,
}: {
  item: Item;
  onMarkSold?: () => void;
  onRemove?: () => void;
}) {
  return (
    <li className="flex gap-3 rounded-xl bg-card p-3 shadow-brand">
      <Link
        href={`/item/${item.id}`}
        className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        <Image
          src={item.images[0]}
          alt={item.title}
          fill
          sizes="80px"
          className="object-cover"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link href={`/item/${item.id}`} className="min-w-0">
          <p className="truncate text-sm">{item.title}</p>
          <p className="font-mono text-sm tracking-wide">
            {formatPrice(item.price)}
          </p>
        </Link>
        <p className="flex flex-wrap items-center gap-x-3 font-mono text-xs tracking-wider text-muted-foreground">
          <span>
            {formatRelativeTime(item.postedAt)} · {item.location.neighborhood}
          </span>
          {item.deliveryAvailable && (
            <span className="inline-flex items-center gap-1">
              <TruckIcon className="size-3" />
              Delivery on
            </span>
          )}
        </p>
        {(onMarkSold || onRemove) && (
          <div className="mt-1 flex gap-2">
            {onMarkSold && (
              <Button variant="outline" size="sm" onClick={onMarkSold}>
                Mark sold
              </Button>
            )}
            {onRemove && (
              <Button variant="ghost" size="sm" onClick={onRemove}>
                Remove
              </Button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
