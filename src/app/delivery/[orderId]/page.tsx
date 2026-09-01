"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { CheckIcon, PackageXIcon } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { RouteMap } from "@/components/map";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  STAGE_ORDER,
  courierPosition,
  etaMinutes,
  routeFor,
  stageAt,
  stageSpec,
  useDeliveryProgress,
} from "@/lib/delivery";
import { formatPrice } from "@/lib/geo";
import { findItem, useHydrated, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function DeliveryPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const hydrated = useHydrated();
  const listings = useStore((s) => s.listings);
  const order = useStore((s) => s.orders.find((o) => o.id === orderId));
  const item = order ? findItem(order.itemId, listings) : undefined;
  const progress = useDeliveryProgress(order);

  const route = useMemo(
    () => (order && item ? routeFor(order, item) : []),
    [order, item],
  );

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <PageHeader title="Order" />
        <Skeleton className="m-4 h-64 rounded-xl" />
      </div>
    );
  }

  if (!order || !item) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <PageHeader title="Order" />
        <EmptyState
          icon={PackageXIcon}
          title="Order not found"
          description="This order isn't on this device. Orders in the demo are stored locally in your browser."
          actionLabel="Browse items"
          actionHref="/browse"
        />
      </div>
    );
  }

  if (order.fulfillment === "pickup") {
    return <PickupConfirmation orderId={order.id} itemTitle={item.title} />;
  }

  const current = stageAt(progress);
  const currentIndex = STAGE_ORDER.indexOf(current.stage);
  const courier = courierPosition(route, progress);
  const eta = etaMinutes(progress);
  const done = current.stage === "delivered";

  return (
    <div className="mx-auto w-full max-w-2xl pb-10">
      <PageHeader title={`Order ${order.id}`} />

      <div className="h-64 border-b md:h-80">
        <RouteMap
          route={route}
          courier={done ? undefined : courier}
          sellerLabel={item.location.neighborhood}
          buyerLabel="You"
          pickedUp={progress >= 0.5}
        />
      </div>

      <div className="space-y-6 p-4 md:p-6">
        <div className="space-y-1">
          <div className="flex items-baseline justify-between gap-3">
            <h1 className="font-heading text-lg font-semibold tracking-tight">
              {current.label}
            </h1>
            {!done && (
              <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                {eta} min away
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{current.detail}</p>
        </div>

        <div className="h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground transition-[width] duration-300 ease-linear"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        <ol className="space-y-0">
          {STAGE_ORDER.map((stage, index) => {
            const spec = stageSpec(stage);
            const complete = index < currentIndex;
            const active = index === currentIndex;
            const last = index === STAGE_ORDER.length - 1;
            return (
              <li key={stage} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      complete || active
                        ? "border-foreground bg-foreground text-background"
                        : "border-muted-foreground/30",
                    )}
                  >
                    {complete && <CheckIcon className="size-3" />}
                    {active && !complete && (
                      <span className="size-1.5 rounded-full bg-background" />
                    )}
                  </span>
                  {!last && (
                    <span
                      className={cn(
                        "w-0.5 flex-1 transition-colors",
                        complete ? "bg-foreground" : "bg-border",
                      )}
                    />
                  )}
                </div>
                <div className={cn("pb-5", last && "pb-0")}>
                  <p
                    className={cn(
                      "text-sm",
                      active || complete
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {spec.label}
                  </p>
                  {active && (
                    <p className="text-xs text-muted-foreground">{spec.detail}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <Separator />

        <div className="flex gap-3">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={item.images[0]}
              alt={item.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5 text-sm">
            <p className="truncate font-medium">{item.title}</p>
            <p className="text-muted-foreground">
              Courier: {order.courierName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              To {order.dropoffAddress}
            </p>
          </div>
        </div>

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Item</dt>
            <dd className="tabular-nums">{formatPrice(order.itemPrice)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Delivery</dt>
            <dd className="tabular-nums">{formatPrice(order.deliveryFee)}</dd>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <dt>Total paid</dt>
            <dd className="font-heading tabular-nums">
              {formatPrice(order.total)}
            </dd>
          </div>
        </dl>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="h-11 flex-1">
            <Link href="/selling">View orders</Link>
          </Button>
          <Button asChild className="h-11 flex-1">
            <Link href="/browse">Keep browsing</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function PickupConfirmation({
  orderId,
  itemTitle,
}: {
  orderId: string;
  itemTitle: string;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <PageHeader title={`Order ${orderId}`} />
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-foreground text-background">
            <CheckIcon className="size-5" />
          </span>
          <div className="space-y-1">
            <p className="font-heading text-base font-medium">
              Pickup confirmed
            </p>
            <p className="mx-auto max-w-xs text-sm text-muted-foreground">
              The seller has your details and will message you to arrange a time
              for {itemTitle}.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="h-11 flex-1">
            <Link href="/selling">View orders</Link>
          </Button>
          <Button asChild className="h-11 flex-1">
            <Link href="/browse">Keep browsing</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
