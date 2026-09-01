"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { HandshakeIcon, PackageXIcon, TruckIcon } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
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
      <div className="mx-auto w-full max-w-2xl">
        <PageHeader title="Checkout" />
        <EmptyState
          icon={PackageXIcon}
          title="This listing is gone"
          description="It may have been sold or taken down while you were deciding."
          actionLabel="Browse items"
          actionHref="/browse"
        />
      </div>
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
    <div className="mx-auto w-full max-w-2xl pb-28 md:pb-10">
      <PageHeader title="Checkout" />

      <div className="space-y-7 p-4 md:p-6">
        <div className="flex gap-3 rounded-xl border p-3">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={item.images[0]}
              alt={item.title}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="truncate text-sm font-medium">{item.title}</p>
            <p className="font-heading text-sm font-semibold">
              {formatPrice(item.price)}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.location.neighborhood} · {formatDistance(miles)}
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            How do you want it?
          </h2>

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
            icon={HandshakeIcon}
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
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Your courier only sees this after they collect the item.
            </p>
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Summary
          </h2>
          <dl className="space-y-2 text-sm">
            <Row label="Item" value={formatPrice(item.price)} />
            <Row
              label="Delivery"
              value={chosen === "delivery" ? formatPrice(fee) : "Free"}
            />
            <Separator />
            <div className="flex items-baseline justify-between">
              <dt className="font-medium">Total</dt>
              <dd className="font-heading text-lg font-semibold">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground">
            Demo checkout — no payment is collected.
          </p>
        </section>

        <div className="hidden md:block">
          <Button
            onClick={confirm}
            disabled={submitting}
            className="h-12 w-full"
          >
            {chosen === "delivery"
              ? `Buy and request delivery · ${formatPrice(total)}`
              : `Buy for pickup · ${formatPrice(total)}`}
          </Button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-20 border-t bg-background/95 p-3 backdrop-blur md:hidden">
        <Button onClick={confirm} disabled={submitting} className="h-12 w-full">
          {chosen === "delivery"
            ? `Buy and request delivery · ${formatPrice(total)}`
            : `Buy for pickup · ${formatPrice(total)}`}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
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
        "flex w-full gap-3 rounded-xl border p-4 text-left transition-colors",
        selected ? "border-foreground bg-secondary/50" : "border-border",
        disabled && "opacity-50",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-foreground bg-foreground" : "border-muted-foreground/40",
        )}
      >
        {selected && <span className="size-1.5 rounded-full bg-background" />}
      </span>
      <span className="min-w-0 flex-1 space-y-1">
        <span className="flex flex-wrap items-center gap-2">
          <Icon className="size-4" />
          <span className="text-sm font-medium">{title}</span>
          {badge && (
            <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium text-background">
              {badge}
            </span>
          )}
        </span>
        <span className="block text-xs text-muted-foreground">{description}</span>
      </span>
      <span className="shrink-0 text-sm font-medium tabular-nums">{price}</span>
    </button>
  );
}
