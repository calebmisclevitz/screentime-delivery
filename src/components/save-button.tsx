"use client";

import { BookmarkIcon } from "lucide-react";
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
        <BookmarkIcon className={cn("size-4", isSaved && "fill-current")} />
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
        "flex size-8 items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur transition-colors hover:bg-background",
        className,
      )}
    >
      <BookmarkIcon className={cn("size-4", isSaved && "fill-current")} />
    </button>
  );
}
