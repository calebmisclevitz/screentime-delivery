"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Leaflet reaches for `window` at import time, so every map surface is loaded
 * on the client only.
 */
const loading = () => <Skeleton className="size-full rounded-none" />;

export const StickerMap = dynamic(
  () => import("./canvas").then((m) => m.StickerMap),
  { ssr: false, loading },
);

export const RouteMap = dynamic(
  () => import("./canvas").then((m) => m.RouteMap),
  { ssr: false, loading },
);

export const PinMap = dynamic(() => import("./canvas").then((m) => m.PinMap), {
  ssr: false,
  loading,
});
