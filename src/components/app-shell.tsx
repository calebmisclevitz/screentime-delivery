"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";

import { BrowseHeader } from "@/components/browse-header";
import { BrowseNavigation } from "@/components/browse-navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBrowse = pathname === "/" || pathname === "/map";

  return (
    <>
      {isBrowse && <BrowseHeader />}
      <main className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        {children}
      </main>
      {isBrowse && (
        <Suspense>
          <BrowseNavigation />
        </Suspense>
      )}
    </>
  );
}
