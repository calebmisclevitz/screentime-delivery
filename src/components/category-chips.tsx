"use client";

import { CATEGORIES, type Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export type CategoryValue = Category | "All";

export function CategoryChips({
  value,
  onChange,
  className,
}: {
  value: CategoryValue;
  onChange: (value: CategoryValue) => void;
  className?: string;
}) {
  const options: CategoryValue[] = ["All", ...CATEGORIES];

  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={cn(
            "h-8 shrink-0 rounded-full border px-3 text-xs font-medium whitespace-nowrap transition-colors",
            value === option
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
