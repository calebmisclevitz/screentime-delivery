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
        "flex items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={active}
            className={cn(
              "shrink-0 text-lg lowercase tracking-wide whitespace-nowrap transition-colors",
              active
                ? "rounded-full bg-card px-4 py-2 text-foreground"
                : "text-foreground/50 hover:text-foreground/70",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
