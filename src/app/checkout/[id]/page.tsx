"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArchiveBoxXMarkIcon,
  HandRaisedIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

import { EmptyState } from "@/components/empty-state";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { StickyActionBar } from "@/components/sticky-action-bar";
import {
  SummaryCard,
  SummaryCardBody,
  SummaryCardImage,
} from "@/components/summary-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  HOME,
  SIZE_LABEL,
  deliveryFee,
  distanceMiles,
  formatDistance,
  formatPrice,
} from "@/lib/geo";
import { findItem, useStore } from "@/lib/store";
import type { Fulfillment } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const listings = useStore((s) => s.listings);
  const placeOrder = useStore((s) => s.placeOrder);
  const item = findItem(id, listings);

  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [address, setAddress] = useState(HOME.address);
  const [submitting, setSubmitting] = useState(false);

  if (!item) {
    return (
      <PageContainer width="narrow">
        <PageHeader title="Checkout" />
        <EmptyState
          icon={ArchiveBoxXMarkIcon}
          title="This listing is gone"
          description="It may have been sold or taken down while you were deciding."
          actionLabel="Browse items"
          actionHref="/"
        />
      </PageContainer>
    );
  }

  const miles = distanceMiles(item.location, HOME);
  const fee = fulfillment === "delivery" ? deliveryFee(item.size, miles) : 0;
  const total = item.price + fee;
  const canDeliver = item.deliveryAvailable;
  const chosen = canDeliver ? fulfillment : "pickup";

  function confirm() {
    if (!item) return;
    setSubmitting(true);
    const order = placeOrder(item, chosen, address);
    router.push(`/delivery/${order.id}`);
  }

  return (
    <PageContainer width="narrow" className="pb-floating-nav md:pb-10">
      <PageHeader title="Checkout" />

      <div className="space-y-8 p-4 md:p-6">
        <SummaryCard>
          <SummaryCardImage
            src={item.images[0]}
            alt={item.title}
            backgroundColor={item.backgroundColor}
          />
          <SummaryCardBody>
            <p className="truncate">{item.title}</p>
            <p className="text-foreground">
              {formatPrice(item.price)}
            </p>
            <p className="text-muted-foreground">
              {item.location.neighborhood} · {formatDistance(miles)}
            </p>
          </SummaryCardBody>
        </SummaryCard>

        <section className="space-y-4">
          <FulfillmentOption
            icon={TruckIcon}
            title="Delivery"
            description={
              canDeliver
                ? `A Swapmeeter picks it up in ${item.location.neighborhood} and brings it to you. ${SIZE_LABEL[item.size]}.`
                : "This seller isn't offering delivery for this item."
            }
            price={canDeliver ? formatPrice(deliveryFee(item.size, miles)) : "—"}
            selected={chosen === "delivery"}
            disabled={!canDeliver}
            onSelect={() => setFulfillment("delivery")}
            badge="Swapmeet exclusive"
          />

          <FulfillmentOption
            icon={HandRaisedIcon}
            title="Pick it up myself"
            description={`Arrange a time with ${item.seller.name} and meet in ${item.location.neighborhood}.`}
            price="Free"
            selected={chosen === "pickup"}
            onSelect={() => setFulfillment("pickup")}
          />
        </section>

        {chosen === "delivery" && (
          <section className="space-y-2">
            <Label htmlFor="dropoff">Drop-off address</Label>
            <Input
              id="dropoff"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address, Raleigh NC"
            />
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-muted-foreground">
            Summary
          </h2>
          <dl className="space-y-2">
            <Row label="Item" value={formatPrice(item.price)} />
            <Row
              label="Delivery"
              value={chosen === "delivery" ? formatPrice(fee) : "Free"}
            />
            <Separator />
            <div className="flex items-baseline justify-between">
              <dt>Total</dt>
              <dd>
                {formatPrice(total)}
              </dd>
            </div>
          </dl>
          <p className="text-muted-foreground">
            Demo checkout — no payment is collected.
          </p>
        </section>

        <div className="hidden md:block">
          <Button
            onClick={confirm}
            disabled={submitting}
            className="w-full"
          >
            {chosen === "delivery"
              ? `Buy and request delivery · ${formatPrice(total)}`
              : `Buy for pickup · ${formatPrice(total)}`}
          </Button>
        </div>
      </div>

      <StickyActionBar>
        <Button onClick={confirm} disabled={submitting} className="w-full">
          {chosen === "delivery"
            ? `Buy and request delivery · ${formatPrice(total)}`
            : `Buy for pickup · ${formatPrice(total)}`}
        </Button>
      </StickyActionBar>
    </PageContainer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

function FulfillmentOption({
  icon: Icon,
  title,
  description,
  price,
  selected,
  disabled,
  onSelect,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  price: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "flex w-full gap-4 rounded-xl border p-4 text-left transition-colors",
        selected ? "bg-muted" : "border-border",
        disabled && "opacity-50",
      )}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-primary bg-primary" : "border-muted-foreground/40",
        )}
      >
        {selected && <span className="size-2 rounded-full bg-primary-foreground" />}
      </span>
      <span className="min-w-0 flex-1 space-y-1">
        <span className="flex flex-wrap items-center gap-2">
          <Icon className="size-icon text-primary" />
          <span className="font-medium">{title}</span>
          {badge && (
            <span className="rounded-full bg-accent px-2 py-1 text-accent-foreground">
              {badge}
            </span>
          )}
        </span>
        <span className="block text-muted-foreground">
          {description}
        </span>
      </span>
      <span className="shrink-0 text-foreground">
        {price}
      </span>
    </button>
  );
}
