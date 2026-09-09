"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartIcon as HeartOutline,
  MapIcon as MapOutline,
  PlusIcon as PlusOutline,
  Squares2X2Icon as BrowseOutline,
  TagIcon as TagOutline,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolid,
  MapIcon as MapSolid,
  PlusIcon as PlusSolid,
  Squares2X2Icon as BrowseSolid,
  TagIcon as TagSolid,
} from "@heroicons/react/24/solid";
import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  outline: ComponentType<{ className?: string }>;
  solid: ComponentType<{ className?: string }>;
};

const NAV: NavItem[] = [
  { href: "/", label: "Map", outline: MapOutline, solid: MapSolid },
  { href: "/browse", label: "Browse", outline: BrowseOutline, solid: BrowseSolid },
  { href: "/sell", label: "Sell", outline: PlusOutline, solid: PlusSolid },
  { href: "/saved", label: "Saved", outline: HeartOutline, solid: HeartSolid },
  { href: "/selling", label: "Selling", outline: TagOutline, solid: TagSolid },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <header className="z-30 flex h-14 shrink-0 items-center gap-6 bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <span className="font-display text-[28px] leading-none font-medium tracking-[-0.04em] text-primary">
            swapmeet
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {NAV.map(({ href, label, outline: Outline, solid: Solid }) => {
            const active = isActive(pathname, href);
            const Icon = active ? Solid : Outline;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-full px-3 text-sm transition-colors",
                  active
                    ? "bg-card text-primary shadow-brand"
                    : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <span className="ml-auto font-mono text-xs tracking-wider text-muted-foreground md:ml-0">
          Raleigh, NC
        </span>
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        {children}
      </main>

      <nav className="z-30 flex h-16 shrink-0 items-stretch bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
        {NAV.map(({ href, label, outline: Outline, solid: Solid }) => {
          const active = isActive(pathname, href);
          const isSell = href === "/sell";
          const Icon = active || isSell ? Solid : Outline;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center justify-center gap-1"
            >
              {isSell ? (
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-brand">
                  <Icon className="size-4" />
                </span>
              ) : (
                <Icon
                  className={cn(
                    "size-6",
                    active ? "text-primary" : "text-foreground/40",
                  )}
                />
              )}
              <span
                className={cn(
                  "text-[10px] leading-none",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
