import Image from "next/image";
import Link from "next/link";
import { TruckIcon } from "lucide-react";

import { SaveButton } from "@/components/save-button";
import { HOME, distanceMiles, formatDistance, formatPrice } from "@/lib/geo";
import type { Item } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ItemCard({
  item,
  className,
  showSave = true,
}: {
  item: Item;
  className?: string;
  showSave?: boolean;
}) {
  const miles = distanceMiles(item.location, HOME);

  return (
    <Link
      href={`/item/${item.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-foreground/25",
        className,
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <Image
          src={item.images[0]}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {item.status === "sold" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Sold
            </span>
          </div>
        )}
        {showSave && (
          <SaveButton
            itemId={item.id}
            title={item.title}
            className="absolute top-2 right-2"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-heading text-sm font-semibold">
            {formatPrice(item.price)}
          </span>
          {item.deliveryAvailable && (
            <TruckIcon
              className="size-3.5 shrink-0 text-muted-foreground"
              aria-label="Delivery available"
            />
          )}
        </div>
        <p className="line-clamp-2 text-sm leading-snug text-foreground">
          {item.title}
        </p>
        <p className="mt-auto truncate pt-1 text-xs text-muted-foreground">
          {item.location.neighborhood} · {formatDistance(miles)}
        </p>
      </div>
    </Link>
  );
}
