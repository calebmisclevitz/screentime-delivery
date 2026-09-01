"use client";

import Image from "next/image";
import Link from "next/link";
import { PackageIcon, ShoppingBagIcon, TagIcon, TruckIcon } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/empty-state";
import { SectionHeader } from "@/components/page-header";
import { useClock } from "@/lib/clock";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { progressFor, stageAt } from "@/lib/delivery";
import { formatPrice } from "@/lib/geo";
import { formatRelativeTime } from "@/lib/time";
import { findItem, useHydrated, useStore } from "@/lib/store";
import type { Item, Order } from "@/lib/types";

export default function SellingPage() {
  const hydrated = useHydrated();
  const listings = useStore((s) => s.listings);
  const orders = useStore((s) => s.orders);
  const markSold = useStore((s) => s.markSold);
  const removeListing = useStore((s) => s.removeListing);

  const active = listings.filter((l) => l.status === "active");
  const sold = listings.filter((l) => l.status === "sold");

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      <SectionHeader
        title="Your stall"
        subtitle="Listings you've posted and things you've bought"
        action={
          <Button asChild size="lg" className="h-10">
            <Link href="/sell">New listing</Link>
          </Button>
        }
      />

      <Tabs defaultValue="active" className="gap-0">
        <div className="sticky top-0 z-10 border-b bg-background/95 px-4 pb-3 backdrop-blur md:px-6">
          <TabsList className="h-10 w-full">
            <TabsTrigger value="active">
              Active {hydrated && active.length > 0 && `(${active.length})`}
            </TabsTrigger>
            <TabsTrigger value="sold">
              Sold {hydrated && sold.length > 0 && `(${sold.length})`}
            </TabsTrigger>
            <TabsTrigger value="purchases">
              Bought {hydrated && orders.length > 0 && `(${orders.length})`}
            </TabsTrigger>
          </TabsList>
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
                  icon={PackageIcon}
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

            <TabsContent value="purchases" className="p-4 md:px-6">
              {orders.length === 0 ? (
                <EmptyState
                  icon={ShoppingBagIcon}
                  title="No purchases yet"
                  description="Buy something with delivery and you'll be able to watch the courier make their way to you."
                  actionLabel="Browse items"
                  actionHref="/browse"
                />
              ) : (
                <ul className="space-y-3">
                  {orders.map((order) => (
                    <OrderRow key={order.id} order={order} />
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
    <li className="flex gap-3 rounded-xl border p-3">
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
          <p className="truncate text-sm font-medium">{item.title}</p>
          <p className="font-heading text-sm font-semibold">
            {formatPrice(item.price)}
          </p>
        </Link>
        <p className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
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

function OrderRow({ order }: { order: Order }) {
  const listings = useStore((s) => s.listings);
  const now = useClock();
  const item = findItem(order.itemId, listings);
  if (!item) return null;

  const stage =
    order.fulfillment === "pickup"
      ? "Pickup arranged"
      : stageAt(progressFor(order, now)).label;

  return (
    <li className="flex gap-3 rounded-xl border p-3">
      <Link
        href={`/delivery/${order.id}`}
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
        <p className="truncate text-sm font-medium">{item.title}</p>
        <p className="text-xs text-muted-foreground">
          {order.id} · {formatPrice(order.total)} total
        </p>
        <p className="text-xs font-medium">{stage}</p>
        <div className="mt-1">
          <Button asChild variant="outline" size="sm">
            <Link href={`/delivery/${order.id}`}>
              {order.fulfillment === "delivery" ? "Track delivery" : "View order"}
            </Link>
          </Button>
        </div>
      </div>
    </li>
  );
}
