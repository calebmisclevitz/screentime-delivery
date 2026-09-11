import Link from "next/link";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <span className="flex size-control items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Icon className="size-icon" />
      </span>
      <div className="space-y-1">
        <p className="font-heading text-base">{title}</p>
        <p className="mx-auto max-w-xs text-muted-foreground">
          {description}
        </p>
      </div>
      {actionLabel && actionHref && (
        <Button asChild size="lg" className="mt-2">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
