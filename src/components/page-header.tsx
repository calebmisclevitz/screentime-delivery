"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** Sticky bar with a back affordance, used on pushed detail-style screens. */
export function PageHeader({
  title,
  action,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "sticky top-0 z-20 flex h-12 items-center gap-1 border-b bg-background/95 px-2 backdrop-blur",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-muted"
      >
        <ChevronLeftIcon className="size-5" />
      </button>
      <span className="truncate font-heading text-sm font-medium">{title}</span>
      {action && <div className="ml-auto pr-1">{action}</div>}
    </div>
  );
}

/** Plain title block for top-level tab screens, which have no back target. */
export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3 px-4 pt-5 pb-3 md:px-6">
      <div>
        <h1 className="font-heading text-xl font-semibold tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
