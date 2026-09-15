"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArchiveBoxXMarkIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

import { ConditionBadge } from "@/components/condition-badge";
import { EmptyState } from "@/components/empty-state";
import { ItemImage } from "@/components/item-image";
import { UserAvatar } from "@/components/user-avatar";
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
  distanceKm,
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

  const kilometres = distanceKm(item.location, HOME);
  const fee = deliveryFee(item.size, kilometres);
  const isMine = item.seller.id === "me";
  const isSold = item.status === "sold";

  return (
    <PageContainer className="relative pb-floating-nav md:pb-10">
      <PageHeader title="Item" titleHidden variant="overlay" />

      <div className="md:grid md:grid-cols-2 md:gap-8 md:p-6">
        <div
          className="relative aspect-square md:overflow-hidden md:rounded-xl"
          style={{ backgroundColor: item.backgroundColor }}
        >
          <ItemImage
            src={item.images[0]}
            alt={item.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-8"
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
            <div className="space-y-1">
              <p className="text-foreground type-display-medium font-medium">
                {formatPrice(item.price)}
              </p>
              <h1 className="type-body-large font-medium">{item.title}</h1>
            </div>
          
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{item.category}</Badge>
              <Badge variant="outline">{SIZE_LABEL[item.size]}</Badge>
            </div>

            <p className="whitespace-pre-line">
              {item.description}
            </p>
          </div>

          <Separator />

          <div className="flex items-center gap-4">
            <UserAvatar name={item.seller.name} />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="font-medium">{item.seller.name}</p>
              <p className="flex items-center gap-2 text-muted-foreground type-label-small">
                <StarSolid className="size-4 text-primary" />
                {item.seller.rating.toFixed(1)} · {item.seller.sales} sales
              </p>
            </div>
          </div>

          <div className="h-44 overflow-hidden rounded-xl">
            <PinMap point={item.location} label={item.location.neighborhood} />
          </div>

          {item.deliveryAvailable ? (
            <div className="flex gap-4 rounded-xl bg-card p-4">
              <TruckIcon className="size-icon shrink-0 text-primary" />
              <div className="space-y-2">
                <p className="font-medium">Delivery in 24-40 mins</p>
                <p className="text-muted-foreground type-label-small">
                  {item.location.neighborhood} · {formatDistance(kilometres)} ·{" "}
                  {formatRelativeTime(item.postedAt)}
                </p>
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

          {/* Desktop actions sit inline; mobile gets the sticky bar below. */}
          <div className="hidden gap-4 md:flex">
            <ItemActions
              itemId={item.id}
              isMine={isMine}
              isSold={isSold}
            />
          </div>
        </div>
      </div>

      <StickyActionBar>
        <ItemActions
          itemId={item.id}
          isMine={isMine}
          isSold={isSold}
        />
      </StickyActionBar>
    </PageContainer>
  );
}

function ItemActions({
  itemId,
  isMine,
  isSold,
}: {
  itemId: string;
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
      <SaveButton itemId={itemId} size="default" />
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
