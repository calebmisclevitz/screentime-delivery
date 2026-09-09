"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

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
        "sticky top-0 z-20 flex h-12 items-center gap-1 bg-background/95 px-2 backdrop-blur",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="flex size-9 items-center justify-center rounded-full text-foreground hover:bg-muted"
      >
        <ChevronLeftIcon className="size-5" />
      </button>
      <span className="truncate text-sm">{title}</span>
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
    <div className="flex items-end justify-between gap-3 px-4 pt-4 pb-3 md:px-6">
      <div>
        <h1 className="font-display text-[32px] leading-none font-medium tracking-[-0.04em] text-primary lowercase">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 font-mono text-xs tracking-wider text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
