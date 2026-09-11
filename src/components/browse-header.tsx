import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/**
 * Floats over the browse content on both list and map. Browse views reserve
 * room for it with `pt-browse-header`.
 */
export function BrowseHeader() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 px-4 py-4">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4">
        <Link
          href="/search"
          className="pointer-events-auto flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full bg-card px-4 text-lg text-muted-foreground shadow-brand transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <MagnifyingGlassIcon className="size-4 shrink-0" />
          <span className="truncate">Search Raleigh</span>
        </Link>
        <Link
          href="/you"
          aria-label="You"
          className="pointer-events-auto shrink-0 rounded-full shadow-brand focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Avatar className="size-12">
            <AvatarFallback className="bg-lime font-display text-2xl text-primary">
              Y
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
