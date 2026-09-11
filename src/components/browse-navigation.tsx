"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  HomeIcon as HomeOutline,
  MapIcon as MapOutline,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolid,
  MapIcon as MapSolid,
} from "@heroicons/react/24/solid";

import { IconButton } from "@/components/ui/icon-button";
import { browseHref, parseCategory } from "@/lib/browse";

export function BrowseNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = parseCategory(searchParams.get("category"));
  const onMap = pathname === "/map";
  const HomeIcon = onMap ? HomeOutline : HomeSolid;
  const MapIcon = onMap ? MapSolid : MapOutline;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"
      />
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <nav
          aria-label="Browse view"
          className="pointer-events-auto flex items-center gap-4 rounded-full bg-card px-4 py-3 text-primary shadow-float"
        >
          <Link
            href={browseHref("/", category)}
            aria-label="Show list view"
            aria-current={!onMap ? "page" : undefined}
            className="flex size-6 items-center justify-center rounded focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <HomeIcon className="size-6" />
          </Link>
          <Link
            href={browseHref("/map", category)}
            aria-label="Show map view"
            aria-current={onMap ? "page" : undefined}
            className="flex size-6 items-center justify-center rounded focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <MapIcon className="size-6" />
          </Link>
        </nav>

        <IconButton
          asChild
          icon={PlusIcon}
          aria-label="Sell an item"
          className="pointer-events-auto shadow-float"
        >
          <Link href="/sell" />
        </IconButton>
      </div>
    </div>
  );
}
