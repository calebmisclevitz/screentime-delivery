import { cn } from "@/lib/utils";

export function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** 48px initials mark used in the browse header, listing seller rows, and similar. */
export function UserAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-control shrink-0 items-center justify-center rounded-full bg-primary type-body-large font-medium text-primary-foreground",
        className,
      )}
    >
      {initialsFromName(name)}
    </span>
  );
}
