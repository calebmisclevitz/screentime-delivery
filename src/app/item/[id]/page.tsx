"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PackageXIcon, StarIcon, TruckIcon } from "lucide-react";

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
          icon={PackageXIcon}
          title="This listing is gone"
          description="It may have been sold or taken down. There's plenty more nearby."
          actionLabel="Browse items"
          actionHref="/browse"
        />
      </div>
    );
  }

  const miles = distanceMiles(item.location, HOME);
  const fee = deliveryFee(item.size, miles);
  const isMine = item.seller.id === "me";
  const isSold = item.status === "sold";

  return (
    <div className="mx-auto w-full max-w-6xl pb-28 md:pb-10">
      <PageHeader
        title={item.title}
        action={
          !isMine && (
            <SaveButton
              itemId={item.id}
              title={item.title}
              className="bg-transparent"
            />
          )
        }
      />

      <div className="md:grid md:grid-cols-2 md:gap-8 md:p-6">
        <div className="relative aspect-4/3 bg-muted md:overflow-hidden md:rounded-2xl">
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
              <span className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">
                Sold
              </span>
            </div>
          )}
        </div>

        <div className="space-y-6 p-4 md:p-0">
          <div className="space-y-2">
            <p className="font-heading text-2xl font-semibold tracking-tight">
              {formatPrice(item.price)}
            </p>
            <h1 className="font-heading text-lg leading-snug font-medium">
              {item.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {item.location.neighborhood} · {formatDistance(miles)} ·{" "}
              {formatRelativeTime(item.postedAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{item.category}</Badge>
            <Badge variant="outline">{item.condition} condition</Badge>
            <Badge variant="outline">{SIZE_LABEL[item.size]}</Badge>
          </div>

          {item.deliveryAvailable ? (
            <div className="flex gap-3 rounded-xl border bg-secondary/50 p-4">
              <TruckIcon className="mt-0.5 size-4 shrink-0" />
              <div className="space-y-1 text-sm">
                <p className="font-medium">Delivery available</p>
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
            <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Details
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {item.seller.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </span>
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-medium">{item.seller.name}</p>
              <p className="flex items-center gap-1 text-muted-foreground">
                <StarIcon className="size-3 fill-current" />
                {item.seller.rating.toFixed(1)} · {item.seller.sales} sales
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Pickup area
            </h2>
            <div className="h-44 overflow-hidden rounded-xl border">
              <PinMap point={item.location} label={item.location.neighborhood} />
            </div>
            <p className="text-xs text-muted-foreground">
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

      <div className="fixed inset-x-0 bottom-16 z-20 flex gap-3 border-t bg-background/95 p-3 backdrop-blur md:hidden">
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
