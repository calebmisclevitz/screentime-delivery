import Image from "next/image";
import Link from "next/link";
import { TruckIcon } from "@heroicons/react/24/outline";

import { ConditionBadge } from "@/components/condition-badge";
import { SaveButton } from "@/components/save-button";
import { Badge } from "@/components/ui/badge";
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
        "group relative flex flex-col gap-4 border-r border-b p-4 transition-colors hover:bg-card/60",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <p className="line-clamp-1 font-medium">{item.title}</p>
        <p className="flex items-center gap-2 type-label-small">
          <span>{formatPrice(item.price)}</span>
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <span>{formatDistance(miles)}</span>
          {item.deliveryAvailable && (
            <TruckIcon
              className="size-4 shrink-0 text-muted-foreground"
              aria-label="Delivery available"
            />
          )}
        </p>
      </div>

      <ConditionBadge condition={item.condition} />

      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted/50">
        <Image
          src={item.images[0]}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {item.status === "sold" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Badge>Sold</Badge>
          </div>
        )}
        {showSave && (
          <SaveButton
            itemId={item.id}
            title={item.title}
            className="absolute right-2 bottom-2"
          />
        )}
      </div>
    </Link>
  );
}
