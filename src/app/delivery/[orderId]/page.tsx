"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { ArchiveBoxXMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

import { EmptyState } from "@/components/empty-state";
import { RouteMap } from "@/components/map";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import {
  SummaryCard,
  SummaryCardBody,
  SummaryCardImage,
} from "@/components/summary-card";
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
      <PageContainer width="narrow">
        <PageHeader title="Delivery Status" />
        <Skeleton className="m-4 h-64 rounded-xl" />
      </PageContainer>
    );
  }

  if (!order || !item) {
    return (
      <PageContainer width="narrow">
        <PageHeader title="Delivery Status" />
        <EmptyState
          icon={ArchiveBoxXMarkIcon}
          title="Order not found"
          description="This order isn't on this device. Orders in the demo are stored locally in your browser."
          actionLabel="Browse items"
          actionHref="/"
        />
      </PageContainer>
    );
  }

  if (order.fulfillment === "pickup") {
    return <PickupConfirmation itemTitle={item.title} />;
  }

  const current = stageAt(progress);
  const currentIndex = STAGE_ORDER.indexOf(current.stage);
  const courier = courierPosition(route, progress);
  const eta = etaMinutes(progress);
  const done = current.stage === "delivered";

  return (
    <PageContainer width="narrow" className="pb-floating-nav md:pb-10">
      <PageHeader title="Delivery Status" />

      <div className="h-64 md:h-80">
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
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="type-body-large font-medium">
              {current.label}
            </h1>
            {!done && (
              <span className="shrink-0 type-label-small text-muted-foreground tabular-nums">
                {eta} min away
              </span>
            )}
          </div>
          <p className="text-muted-foreground">{current.detail}</p>
        </div>

        <div className="h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300 ease-linear"
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
              <li key={stage} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      complete || active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30",
                    )}
                  >
                    {complete && <CheckIcon className="size-4" />}
                    {active && !complete && (
                      <span className="size-2 rounded-full bg-primary-foreground" />
                    )}
                  </span>
                  {!last && (
                    <span
                      className={cn(
                        "w-0.5 flex-1 transition-colors",
                        complete ? "bg-primary" : "bg-border",
                      )}
                    />
                  )}
                </div>
                <div className={cn("pb-6", last && "pb-0")}>
                  <p
                    className={cn(
                      active || complete
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {spec.label}
                  </p>
                  {active && (
                    <p className="type-label-small text-muted-foreground">
                      {spec.detail}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <Separator />

        <SummaryCard>
          <SummaryCardImage
            src={item.images[0]}
            alt={item.title}
            size="compact"
          />
          <SummaryCardBody>
            <p className="truncate">{item.title}</p>
            <p className="text-muted-foreground">
              Courier: {order.courierName}
            </p>
            <p className="truncate type-label-small text-muted-foreground">
              To {order.dropoffAddress}
            </p>
          </SummaryCardBody>
        </SummaryCard>

        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Item</dt>
            <dd className="font-mono tabular-nums">{formatPrice(order.itemPrice)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Delivery</dt>
            <dd className="font-mono tabular-nums">{formatPrice(order.deliveryFee)}</dd>
          </div>
          <Separator />
          <div className="flex justify-between">
            <dt>Total paid</dt>
            <dd className="font-mono tabular-nums">
              {formatPrice(order.total)}
            </dd>
          </div>
        </dl>

        <div className="flex gap-4">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/purchases">View purchases</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/">Keep browsing</Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

function PickupConfirmation({
  itemTitle,
}: {
  itemTitle: string;
}) {
  return (
    <PageContainer width="narrow">
      <PageHeader title="Delivery Status" />
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <span className="flex size-control items-center justify-center rounded-full bg-accent text-accent-foreground">
            <CheckIcon className="size-icon" />
          </span>
          <div className="space-y-1">
            <p className="type-body-large font-medium">Pickup confirmed</p>
            <p className="mx-auto max-w-xs text-muted-foreground">
              The seller has your details and will message you to arrange a time
              for {itemTitle}.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/purchases">View purchases</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/">Keep browsing</Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
