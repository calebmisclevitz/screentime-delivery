"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { useRoutePresentation } from "@/components/route-sheet";

/** Sticky bar with a back affordance, used on pushed detail-style screens. */
export function PageHeader({
  title,
  titleHidden = false,
  action,
  navigation,
  fallbackHref = "/",
  variant = "default",
  className,
}: {
  title?: string;
  /** Keeps the title for assistive tech on screens that already show it. */
  titleHidden?: boolean;
  action?: React.ReactNode;
  navigation?: "back" | "close";
  fallbackHref?: string;
  /** `overlay` floats the bar over leading media instead of sitting above it. */
  variant?: "default" | "overlay";
  className?: string;
}) {
  const router = useRouter();
  const presentation = useRoutePresentation();
  const navigationStyle =
    navigation ?? (presentation === "sheet" ? "close" : "back");
  const NavigationIcon =
    navigationStyle === "close" ? XMarkIcon : ChevronLeftIcon;

  function navigateBack() {
    if (window.history.length > 1) router.back();
    else router.replace(fallbackHref);
  }

  const isOverlay = variant === "overlay";

  return (
    <div
      className={cn(
        // Equal side tracks keep the title centered on the header itself,
        // regardless of how wide the action is.
        "grid h-browse-header grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-1 px-4",
        isOverlay
          ? "absolute inset-x-0 top-0 z-30"
          : "sticky top-0 z-20 bg-background/95 backdrop-blur",
        className,
      )}
    >
      <IconButton
        type="button"
        onClick={navigateBack}
        icon={NavigationIcon}
        aria-label={navigationStyle === "close" ? "Close" : "Go back"}
        variant={isOverlay ? "overlay" : "ghost"}
        className={cn("justify-self-start", isOverlay && "shadow-brand")}
      />
      {title && (
        <span
          className={cn(
            "truncate type-body-medium font-medium",
            titleHidden && "sr-only",
          )}
        >
          {title}
        </span>
      )}
      {action && <div className="col-start-3 justify-self-end">{action}</div>}
    </div>
  );
}
