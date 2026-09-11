"use client";

import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { useHydrated, useStore } from "@/lib/store";

type Props = {
  itemId: string;
  title?: string;
  /** `icon` is the floating overlay on cards; `full` is the labelled button. */
  variant?: "icon" | "full";
  /** Sizing for the `icon` variant; cards use the compact 32px form. */
  size?: "default" | "compact";
  className?: string;
};

export function SaveButton({
  itemId,
  title,
  variant = "icon",
  size = "compact",
  className,
}: Props) {
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
        variant="overlay"
        onClick={onClick}
        aria-pressed={isSaved}
        className={className}
      >
        <Icon data-icon="inline-start" />
        {isSaved ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <IconButton
      type="button"
      size={size}
      variant="overlay"
      icon={Icon}
      onClick={onClick}
      aria-label={isSaved ? "Remove from saved" : "Save item"}
      aria-pressed={isSaved}
      className={className}
    />
  );
}
