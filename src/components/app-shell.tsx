"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartIcon as HeartOutline,
  HomeIcon as HomeOutline,
  MapIcon as MapOutline,
  PlusIcon as PlusOutline,
  Squares2X2Icon,
  TagIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolid,
  HomeIcon as HomeSolid,
  PlusIcon as PlusSolid,
} from "@heroicons/react/24/solid";
import type { ComponentType } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  outline: ComponentType<{ className?: string }>;
  solid: ComponentType<{ className?: string }>;
};

const NAV: NavItem[] = [
  { href: "/", label: "Home", outline: HomeOutline, solid: HomeSolid },
  { href: "/saved", label: "Saves", outline: HeartOutline, solid: HeartSolid },
  { href: "/sell", label: "Sell", outline: PlusOutline, solid: PlusSolid },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onMap = pathname === "/map";

  return (
    <>
      <header
        className={cn(
          "z-30 flex h-14 items-center gap-6 px-4 md:px-6",
          onMap
            ? "pointer-events-none absolute inset-x-0 top-0"
            : "shrink-0 bg-background",
        )}
      >
        <Link
          href="/"
          className="pointer-events-auto flex h-9 items-stretch"
          aria-label="Yardsale home"
        >
          <span className="flex items-center bg-primary px-1.5 pt-px">
            <span className="font-display text-[30px] leading-none text-primary-foreground">
              YARDSALE
            </span>
          </span>
          <span
            aria-hidden
            className="w-3 bg-primary"
            style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
          />
        </Link>

        <nav className="pointer-events-auto hidden flex-1 items-center gap-1 md:flex">
          {NAV.map((item) => (
            <HeaderNavLink key={item.href} pathname={pathname} item={item} />
          ))}
        </nav>

        <div className="pointer-events-auto ml-auto flex items-center gap-2 md:ml-0">
          <MapToggle onMap={onMap} className="hidden md:flex" />
          <AccountMenu />
        </div>
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        {children}
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 md:hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"
        />
        <div className="relative flex items-end justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <nav
            aria-label="Main"
            className="pointer-events-auto flex items-center gap-6 rounded-full bg-card px-6 py-[15px] shadow-float"
          >
            {NAV.map(({ href, label, outline: Outline, solid: Solid }) => {
              const active = isActive(pathname, href);
              const Icon = active ? Solid : Outline;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className="flex size-6 items-center justify-center text-primary"
                >
                  <Icon className="size-6" />
                </Link>
              );
            })}
          </nav>
          <MapToggle
            onMap={onMap}
            className="pointer-events-auto absolute right-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))] size-14"
          />
        </div>
      </div>
    </>
  );
}

function HeaderNavLink({
  pathname,
  item: { href, label, outline: Outline, solid: Solid },
}: {
  pathname: string;
  item: NavItem;
}) {
  const active = isActive(pathname, href);
  const Icon = active ? Solid : Outline;

  return (
    <Link
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
}

function MapToggle({
  onMap,
  className,
}: {
  onMap: boolean;
  className?: string;
}) {
  const Icon = onMap ? Squares2X2Icon : MapOutline;

  return (
    <Link
      href={onMap ? "/" : "/map"}
      aria-label={onMap ? "Show list view" : "Show map view"}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float transition-colors hover:bg-primary/80",
        className,
      )}
    >
      <Icon className="size-6 md:size-4" />
    </Link>
  );
}

function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account"
          className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary font-display text-2xl text-primary-foreground">
              Y
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Your account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/selling">
            <TagIcon />
            Your stall
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
