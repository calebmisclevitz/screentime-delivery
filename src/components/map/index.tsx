"use client";

import dynamic from "next/dynamic";

import { MapSurface } from "./surface";

/**
 * MapLibre reaches for `window` at import time, so every map surface is loaded
 * on the client only. Each fallback is the same surface the map mounts into:
 * the browse map keeps its reel running across the handoff, while the inline
 * maps hold a quiet surface until they can fade in.
 */
const browseLoading = () => <MapSurface loader />;
const inlineLoading = () => <MapSurface />;

export const StickerMap = dynamic(
  () => import("./canvas").then((m) => m.StickerMap),
  { ssr: false, loading: browseLoading },
);

export const RouteMap = dynamic(
  () => import("./canvas").then((m) => m.RouteMap),
  { ssr: false, loading: inlineLoading },
);

export const PinMap = dynamic(() => import("./canvas").then((m) => m.PinMap), {
  ssr: false,
  loading: inlineLoading,
});
