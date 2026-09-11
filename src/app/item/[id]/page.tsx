"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArchiveBoxXMarkIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

import { ConditionBadge } from "@/components/condition-badge";
import { EmptyState } from "@/components/empty-state";
import { PinMap } from "@/components/map";
import { PageHeader } from "@/components/page-header";
import { SaveButton } from "@/components/save-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  HOME,
  SIZE_LABEL,
  deliveryFee,
  distanceMiles,
  formatDistance,
  formatPrice,
} from "@/lib/geo";
import { formatRelativeTime } from "@/lib/time";
import { findItem, useStore } from "@/lib/store";

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const listings = useStore((s) => s.listings);
  const item = findItem(id, listings);

  if (!item) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <PageHeader title="Item" />
        <EmptyState
          icon={ArchiveBoxXMarkIcon}
          title="This listing is gone"
          description="It may have been sold or taken down. There's plenty more nearby."
          actionLabel="Browse items"
          actionHref="/"
        />
      </div>
    );
  }

  const miles = distanceMiles(item.location, HOME);
  const fee = deliveryFee(item.size, miles);
  const isMine = item.seller.id === "me";
  const isSold = item.status === "sold";

  return (
    <div className="mx-auto w-full max-w-6xl pb-[calc(var(--spacing-floating-nav)+4.5rem)] md:pb-10">
      <PageHeader
        title="Item"
        action={
          !isMine && (
            <SaveButton
              itemId={item.id}
              title={item.title}
              className="bg-card"
            />
          )
        }
      />

      <div className="md:grid md:grid-cols-2 md:gap-8 md:p-6">
        <div className="relative aspect-4/3 bg-muted md:overflow-hidden md:rounded-xl">
          <Image
            src={item.images[0]}
            alt={item.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <span className="rounded-full bg-primary px-4 py-1.5 font-mono text-sm text-primary-foreground">
                Sold
              </span>
            </div>
          )}
        </div>

        <div className="space-y-6 p-4 md:p-0">
          <div className="space-y-3">
            <ConditionBadge condition={item.condition} />
            <div className="space-y-2">
              <h1 className="text-xl font-medium leading-snug">{item.title}</h1>
              <p className="font-mono text-xs tracking-wide">
                {formatPrice(item.price)}
              </p>
            </div>
            <p className="font-mono text-xs tracking-wider text-muted-foreground">
              {item.location.neighborhood} · {formatDistance(miles)} ·{" "}
              {formatRelativeTime(item.postedAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{item.category}</Badge>
            <Badge variant="outline">{SIZE_LABEL[item.size]}</Badge>
          </div>

          {item.deliveryAvailable ? (
            <div className="flex gap-3 rounded-xl bg-card p-4 shadow-brand">
              <TruckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
              <div className="space-y-1 text-sm">
                <p>Delivery available</p>
                <p className="text-muted-foreground">
                  A Swapmeeter meets the seller and brings it to you, about{" "}
                  {formatPrice(fee)} for this trip.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
              Pickup only — this seller isn&apos;t offering delivery.
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-[15px] font-medium">
              Description
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-display text-2xl text-primary-foreground">
              {item.seller.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </span>
            <div className="min-w-0 flex-1 text-sm">
              <p>{item.seller.name}</p>
              <p className="flex items-center gap-1 font-mono text-xs tracking-wider text-muted-foreground">
                <StarSolid className="size-3 text-primary" />
                {item.seller.rating.toFixed(1)} · {item.seller.sales} sales
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-[15px] font-medium">
              Pickup area
            </h2>
            <div className="h-44 overflow-hidden rounded-xl">
              <PinMap point={item.location} label={item.location.neighborhood} />
            </div>
            <p className="font-mono text-xs tracking-wider text-muted-foreground">
              Exact address is shared once a sale is confirmed.
            </p>
          </div>

          {/* Desktop actions sit inline; mobile gets the sticky bar below. */}
          <div className="hidden gap-3 md:flex">
            <ItemActions
              itemId={item.id}
              title={item.title}
              isMine={isMine}
              isSold={isSold}
            />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-60 flex gap-3 bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <ItemActions
          itemId={item.id}
          title={item.title}
          isMine={isMine}
          isSold={isSold}
        />
      </div>
    </div>
  );
}

function ItemActions({
  itemId,
  title,
  isMine,
  isSold,
}: {
  itemId: string;
  title: string;
  isMine: boolean;
  isSold: boolean;
}) {
  if (isMine) {
    return (
      <Button asChild variant="outline" className="h-12 flex-1">
        <Link href="/selling">Manage in Selling</Link>
      </Button>
    );
  }

  return (
    <>
      <SaveButton itemId={itemId} title={title} variant="full" />
      {isSold ? (
        <Button disabled className="h-12 flex-1">
          Sold
        </Button>
      ) : (
        <Button asChild className="h-12 flex-1">
          <Link href={`/checkout/${itemId}`}>Buy now</Link>
        </Button>
      )}
    </>
  );
}
