import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SearchField } from "@/components/ui/search-field";

/**
 * Floats over the browse content on both list and map. Browse views reserve
 * room for it with `pt-browse-header`.
 */
export function BrowseHeader() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 px-4 py-4">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4">
        <SearchField
          href="/search"
          placeholder="Search Raleigh"
          className="pointer-events-auto min-w-0 flex-1 hover:text-foreground"
        />
        <Link
          href="/you"
          aria-label="You"
          className="pointer-events-auto shrink-0 rounded-full shadow-brand focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Avatar className="size-12">
            <AvatarFallback className="bg-accent type-heading-medium text-primary">
              Y
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
