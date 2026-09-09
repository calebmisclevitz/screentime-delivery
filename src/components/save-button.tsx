"use client";

import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useHydrated, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Props = {
  itemId: string;
  title?: string;
  /** `icon` is the floating overlay on cards; `full` is the labelled button. */
  variant?: "icon" | "full";
  className?: string;
};

export function SaveButton({ itemId, title, variant = "icon", className }: Props) {
  const hydrated = useHydrated();
  const saved = useStore((s) => s.savedIds.includes(itemId));
  const toggleSaved = useStore((s) => s.toggleSaved);
  const isSaved = hydrated && saved;
  const Icon = isSaved ? HeartSolid : HeartOutline;

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(itemId);
    toast(isSaved ? "Removed from saved" : "Saved", {
      description: title,
    });
  }

  if (variant === "full") {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={onClick}
        aria-pressed={isSaved}
        className={cn("h-12 gap-2 px-4", className)}
      >
        <Icon className={cn("size-4", isSaved && "text-primary")} />
        {isSaved ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isSaved ? "Remove from saved" : "Save item"}
      aria-pressed={isSaved}
      className={cn(
        "flex size-6 items-center justify-center rounded-xl border border-black/8 bg-card text-primary shadow-brand transition-colors hover:bg-card",
        className,
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}
