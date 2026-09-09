import { cn } from "@/lib/utils";
import type { Condition } from "@/lib/types";

const STYLES: Record<Condition, string> = {
  Excellent: "bg-lime text-forest",
  Good: "bg-lime text-forest",
  Fair: "bg-lime text-foreground",
};

export function ConditionBadge({
  condition,
  className,
}: {
  condition: Condition;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit max-w-full items-center self-start rounded-full px-1.5 py-1 font-mono text-xs leading-none whitespace-nowrap",
        STYLES[condition],
        className,
      )}
    >
      {condition}
    </span>
  );
}
