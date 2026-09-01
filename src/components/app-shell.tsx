"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookmarkIcon,
  LayoutGridIcon,
  MapIcon,
  PlusIcon,
  TagIcon,
} from "lucide-react";
import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const NAV: NavItem[] = [
  { href: "/", label: "Map", icon: MapIcon },
  { href: "/browse", label: "Browse", icon: LayoutGridIcon },
  { href: "/sell", label: "Sell", icon: PlusIcon },
  { href: "/saved", label: "Saved", icon: BookmarkIcon },
  { href: "/selling", label: "Selling", icon: TagIcon },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <header className="z-30 flex h-14 shrink-0 items-center gap-6 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-[11px] font-semibold text-primary-foreground">
            S
          </span>
          <span className="font-heading text-base font-semibold tracking-tight">
            Swapmeet
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors",
                isActive(pathname, href)
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        <span className="ml-auto text-xs text-muted-foreground md:ml-0">
          Raleigh, NC
        </span>
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        {children}
      </main>

      <nav className="z-30 flex h-16 shrink-0 items-stretch border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          const isSell = href === "/sell";
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center justify-center gap-1"
            >
              {isSell ? (
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="size-4" />
                </span>
              ) : (
                <Icon
                  className={cn(
                    "size-5",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                />
              )}
              <span
                className={cn(
                  "text-[10px] leading-none",
                  active ? "font-medium text-foreground" : "text-muted-foreground",
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
