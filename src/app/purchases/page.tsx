"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClock } from "@/lib/clock";
import { progressFor, stageAt } from "@/lib/delivery";
import { formatPrice } from "@/lib/geo";
import { findItem, useHydrated, useStore } from "@/lib/store";
import type { Order } from "@/lib/types";

export default function PurchasesPage() {
  const hydrated = useHydrated();
  const orders = useStore((s) => s.orders);

  return (
    <div className="mx-auto w-full max-w-2xl pb-10">
      <PageHeader title="Purchases" fallbackHref="/you" />
      {!hydrated ? (
        <div className="space-y-3 p-4 md:px-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBagIcon}
          title="No purchases yet"
          description="Your orders and delivery status will appear here."
          actionLabel="Browse items"
          actionHref="/"
        />
      ) : (
        <ul className="space-y-3 p-4 md:px-6">
          {orders.map((order) => (
            <PurchaseRow key={order.id} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
}

function PurchaseRow({ order }: { order: Order }) {
  const listings = useStore((s) => s.listings);
  const now = useClock();
  const item = findItem(order.itemId, listings);
  if (!item) return null;

  const stage =
    order.fulfillment === "pickup"
      ? "Pickup arranged"
      : stageAt(progressFor(order, now)).label;

  return (
    <li className="flex gap-3 rounded-xl bg-card p-3 shadow-brand">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image src={item.images[0]} alt={item.title} fill sizes="80px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-sm">{item.title}</p>
        <p className="font-mono text-xs tracking-wider text-muted-foreground">
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
