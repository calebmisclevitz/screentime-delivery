"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  ArchiveBoxIcon,
  PlusIcon,
  TagIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { EmptyState } from "@/components/empty-state";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import {
  SummaryCard,
  SummaryCardBody,
  SummaryCardImage,
} from "@/components/summary-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/geo";
import { formatRelativeTime } from "@/lib/time";
import { useHydrated, useStore } from "@/lib/store";
import type { Item } from "@/lib/types";
import { cn } from "@/lib/utils";

type ListingTab = "active" | "sold";

export default function SellingPage() {
  const hydrated = useHydrated();
  const listings = useStore((s) => s.listings);
  const markSold = useStore((s) => s.markSold);
  const removeListing = useStore((s) => s.removeListing);
  const [tab, setTab] = useState<ListingTab>("active");

  const active = listings.filter((l) => l.status === "active");
  const sold = listings.filter((l) => l.status === "sold");
  const shown = tab === "active" ? active : sold;

  return (
    <PageContainer className="pb-10">
      <PageHeader
        title="Selling"
        fallbackHref="/you"
        action={
          <IconButton asChild icon={PlusIcon} aria-label="New listing">
            <Link href="/sell" />
          </IconButton>
        }
      />
      <div className="sticky top-browse-header z-10 bg-background/95 px-4 py-4 backdrop-blur md:px-6">
        <nav aria-label="Listing status" className="flex">
          <TabButton
            active={tab === "active"}
            count={hydrated ? active.length : undefined}
            onClick={() => setTab("active")}
          >
            Active
          </TabButton>
          <TabButton
            active={tab === "sold"}
            count={hydrated ? sold.length : undefined}
            onClick={() => setTab("sold")}
          >
            Sold
          </TabButton>
        </nav>
      </div>

      {!hydrated ? (
        <div className="space-y-4 p-4 md:px-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        tab === "active" ? (
          <EmptyState
            icon={TagIcon}
            title="No active listings"
            description="Post something from around the house and offer delivery so buyers across town can take it."
            actionLabel="List an item"
            actionHref="/sell"
          />
        ) : (
          <EmptyState
            icon={ArchiveBoxIcon}
            title="Nothing sold yet"
            description="Once a buyer takes one of your listings it moves here with the final price."
          />
        )
      ) : (
        <ul className="space-y-4 p-4 md:px-6">
          {shown.map((item) => (
            <ListingRow
              key={item.id}
              item={item}
              onMarkSold={
                tab === "active"
                  ? () => {
                      markSold(item.id);
                      toast("Marked as sold", { description: item.title });
                    }
                  : undefined
              }
              onRemove={
                tab === "active"
                  ? () => {
                      removeListing(item.id);
                      toast("Listing removed", { description: item.title });
                    }
                  : undefined
              }
            />
          ))}
        </ul>
      )}
    </PageContainer>
  );
}

function TabButton({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count?: number;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      size="compact"
      variant={active ? "overlay" : "ghost"}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        active ? undefined : "text-muted-foreground",
        // Match left padding to the badge so the count sits concentric
        // with the pill instead of leaving extra space on the right.
        count != null && "pr-1.5",
      )}
    >
      {children}
      {count != null && (
        <Badge
          className={cn(
            "size-5 justify-center rounded-full px-0 tabular-nums",
            active
              ? "bg-primary text-card"
              : "bg-muted-foreground text-background",
          )}
        >
          {count}
        </Badge>
      )}
    </Button>
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
    <li>
      <SummaryCard>
        <Link href={`/item/${item.id}`} className="shrink-0">
          <SummaryCardImage
            src={item.images[0]}
            alt={item.title}
            backgroundColor={item.backgroundColor}
          />
        </Link>
        <SummaryCardBody className="flex flex-col gap-2 space-y-0">
          <Link
            href={`/item/${item.id}`}
            className="flex min-w-0 flex-col gap-2"
          >
            <p className="truncate font-medium">{item.title}</p>
            <p className="text-foreground">{formatPrice(item.price)}</p>
            <p className="flex flex-wrap items-center gap-x-4 text-muted-foreground type-label-small">
              <span>
                {formatRelativeTime(item.postedAt)} ·{" "}
                {item.location.neighborhood}
              </span>
              {item.deliveryAvailable && (
                <TruckIcon
                  className="size-4"
                  aria-label="Delivery available"
                />
              )}
            </p>
          </Link>
          {(onMarkSold || onRemove) && (
            <div className="flex gap-2">
              {onMarkSold && (
                <Button size="compact" onClick={onMarkSold}>
                  Mark sold
                </Button>
              )}
              {onRemove && (
                <Button variant="ghost" size="compact" onClick={onRemove}>
                  Remove
                </Button>
              )}
            </div>
          )}
        </SummaryCardBody>
      </SummaryCard>
    </li>
  );
}
