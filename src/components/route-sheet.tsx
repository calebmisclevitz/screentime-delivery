"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

const RoutePresentationContext = createContext<"page" | "sheet">("page");

export function useRoutePresentation() {
  return useContext(RoutePresentationContext);
}

export function RouteSheet({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") router.back();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <section
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      <RoutePresentationContext.Provider value="sheet">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </RoutePresentationContext.Provider>
    </section>
  );
}
