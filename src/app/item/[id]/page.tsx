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
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { SaveButton } from "@/components/save-button";
import { StickyActionBar } from "@/components/sticky-action-bar";
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
      <PageContainer>
        <PageHeader title="Item" />
        <EmptyState
          icon={ArchiveBoxXMarkIcon}
          title="This listing is gone"
          description="It may have been sold or taken down. There's plenty more nearby."
          actionLabel="Browse items"
          actionHref="/"
        />
      </PageContainer>
    );
  }

  const miles = distanceMiles(item.location, HOME);
  const fee = deliveryFee(item.size, miles);
  const isMine = item.seller.id === "me";
  const isSold = item.status === "sold";

  return (
    <PageContainer className="pb-24 md:pb-10">
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
              <Badge>Sold</Badge>
            </div>
          )}
        </div>

        <div className="space-y-6 p-4 md:p-0">
          <div className="space-y-4">
            <ConditionBadge condition={item.condition} />
            <div className="space-y-2">
              <h1 className="type-heading-medium">{item.title}</h1>
              <p className="type-label-small text-foreground">
                {formatPrice(item.price)}
              </p>
            </div>
            <p className="type-label-small text-muted-foreground">
              {item.location.neighborhood} · {formatDistance(miles)} ·{" "}
              {formatRelativeTime(item.postedAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{item.category}</Badge>
            <Badge variant="outline">{SIZE_LABEL[item.size]}</Badge>
          </div>

          {item.deliveryAvailable ? (
            <div className="flex gap-4 rounded-xl bg-card p-4 shadow-brand">
              <TruckIcon className="size-icon shrink-0 text-primary" />
              <div className="space-y-1">
                <p>Delivery available</p>
                <p className="text-muted-foreground">
                  A Swapmeeter meets the seller and brings it to you, about{" "}
                  {formatPrice(fee)} for this trip.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-4 text-muted-foreground">
              Pickup only — this seller isn&apos;t offering delivery.
            </div>
          )}

          <div className="space-y-2">
            <h2 className="font-medium">Description</h2>
            <p className="whitespace-pre-line">
              {item.description}
            </p>
          </div>

          <Separator />

          <div className="flex items-center gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary type-body-large text-primary-foreground">
              {item.seller.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </span>
            <div className="min-w-0 flex-1">
              <p>{item.seller.name}</p>
              <p className="flex items-center gap-2 type-label-small text-muted-foreground">
                <StarSolid className="size-4 text-primary" />
                {item.seller.rating.toFixed(1)} · {item.seller.sales} sales
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-medium">Pickup area</h2>
            <div className="h-44 overflow-hidden rounded-xl">
              <PinMap point={item.location} label={item.location.neighborhood} />
            </div>
            <p className="type-label-small text-muted-foreground">
              Exact address is shared once a sale is confirmed.
            </p>
          </div>

          {/* Desktop actions sit inline; mobile gets the sticky bar below. */}
          <div className="hidden gap-4 md:flex">
            <ItemActions
              itemId={item.id}
              title={item.title}
              isMine={isMine}
              isSold={isSold}
            />
          </div>
        </div>
      </div>

      <StickyActionBar>
        <ItemActions
          itemId={item.id}
          title={item.title}
          isMine={isMine}
          isSold={isSold}
        />
      </StickyActionBar>
    </PageContainer>
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
      <Button asChild variant="outline" className="flex-1">
        <Link href="/selling">Manage in Selling</Link>
      </Button>
    );
  }

  return (
    <>
      <SaveButton itemId={itemId} title={title} variant="full" />
      {isSold ? (
        <Button disabled className="flex-1">
          Sold
        </Button>
      ) : (
        <Button asChild className="flex-1">
          <Link href={`/checkout/${itemId}`}>Buy now</Link>
        </Button>
      )}
    </>
  );
}
