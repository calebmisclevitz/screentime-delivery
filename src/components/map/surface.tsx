"use client";

import type { Ref } from "react";

import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { cn } from "@/lib/utils";

import { MapLoader } from "./loader";

/**
 * Holds the MapLibre container and, on the browse map, the loading reel as
 * siblings. Either way the surface keeps its map hidden until it has painted,
 * so nothing half-drawn shows through.
 */
export function MapSurface({
  className,
  containerRef,
  images,
  loader = false,
  ready = false,
}: {
  className?: string;
  containerRef?: Ref<HTMLDivElement>;
  images?: string[];
  loader?: boolean;
  ready?: boolean;
}) {
  return (
    <div className={cn("relative size-full", className)}>
      <div
        ref={containerRef}
        data-map-ready={ready}
        className="yardsale-map size-full"
      />
      {loader && !ready && <MapLoader images={images} />}
      {!loader && !ready && (
        <ProgressIndicator
          label="Loading map"
          className="pointer-events-none absolute inset-0 m-auto size-6"
        />
      )}
    </div>
  );
}
