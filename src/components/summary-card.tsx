import Image from "next/image";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SummaryCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn("flex-row gap-4 p-4 ring-0", className)}
      {...props}
    />
  );
}

export function SummaryCardImage({
  src,
  alt,
  size = "default",
  backgroundColor,
}: {
  src: string;
  alt: string;
  size?: "default" | "compact";
  backgroundColor?: string;
}) {
  const pixels = size === "default" ? 80 : 64;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg bg-muted",
        size === "default" ? "size-20" : "size-16",
      )}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${pixels}px`}
        className="object-contain p-1.5"
      />
    </div>
  );
}

export function SummaryCardBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("min-w-0 flex-1 space-y-1", className)}
      {...props}
    />
  );
}
