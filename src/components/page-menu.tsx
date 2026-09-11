import Link from "next/link";
import type { ElementType } from "react";

export type PageMenuItem = {
  href: string;
  label: string;
  icon: ElementType;
};

export function PageMenu({ items }: { items: PageMenuItem[] }) {
  return (
    <nav>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-14 items-center gap-2 px-4 py-2 transition-colors hover:bg-card/40"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card">
              <Icon className="size-6" />
            </span>
            <span className="min-w-0 flex-1 type-body-large">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
