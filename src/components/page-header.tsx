"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { useRoutePresentation } from "@/components/route-sheet";

/** Sticky bar with a back affordance, used on pushed detail-style screens. */
export function PageHeader({
  title,
  action,
  navigation,
  fallbackHref = "/",
  className,
}: {
  title?: string;
  action?: React.ReactNode;
  navigation?: "back" | "close";
  fallbackHref?: string;
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

  return (
    <div
      className={cn(
        "sticky top-0 z-20 flex h-browse-header items-center gap-1 bg-background/95 px-4 backdrop-blur",
        className,
      )}
    >
      <IconButton
        type="button"
        onClick={navigateBack}
        icon={NavigationIcon}
        aria-label={navigationStyle === "close" ? "Close" : "Go back"}
        variant="ghost"
        className="-ml-3"
      />
      {title && (
        <span className="truncate type-body-medium font-medium">{title}</span>
      )}
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}
