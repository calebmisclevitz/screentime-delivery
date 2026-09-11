"use client";

import {
  GeoJSONSource,
  LngLatBounds,
  Map as MapLibreMap,
  Marker,
  setWorkerUrl,
} from "maplibre-gl";
import { useCallback, useEffect, useRef } from "react";

import { HOME, formatPrice } from "@/lib/geo";
import type { Item, LatLng } from "@/lib/types";
import { cn } from "@/lib/utils";

import { applyYardsaleStyle, POSITRON_STYLE } from "./style";

// Next/Turbopack does not emit the worker's sibling shared chunk, so tiles
// never fetch unless the worker is served from public/ next to that file.
setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

function lngLat(point: LatLng): [number, number] {
  return [point.lng, point.lat];
}

function stickerEl(item: Item, selected: boolean) {
  const ring = selected
    ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
    : "border-border bg-card text-foreground shadow-brand";
  const el = document.createElement("div");
  el.className = "cursor-pointer";
  el.innerHTML = `
    <div class="flex items-center gap-1 rounded-full border py-0.5 pr-2 pl-0.5 transition-all ${ring}">
      <img src="${item.images[0]}" alt="" class="size-6 shrink-0 rounded-full object-cover" />
      <span class="type-label-small whitespace-nowrap">${formatPrice(item.price)}</span>
    </div>
  `;
  return el;
}

function dotEl(label: string, filled: boolean) {
  const style = filled
    ? "border-background bg-primary text-primary-foreground"
    : "border-primary bg-card text-primary";
  const el = document.createElement("div");
  el.innerHTML = `
    <div class="flex items-center gap-1.5">
      <span class="size-3 rounded-full border-2 ${style}"></span>
      <span class="rounded-full border border-border bg-card/90 px-2 py-1 type-label-small whitespace-nowrap text-foreground">${label}</span>
    </div>
  `;
  return el;
}

function courierEl() {
  const el = document.createElement("div");
  el.innerHTML = `
    <span class="flex size-7 items-center justify-center rounded-full border-2 border-background bg-primary shadow-md">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 text-primary-foreground">
        <path d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
      </svg>
    </span>
  `;
  return el;
}

function useYardsaleMap({
  center,
  zoom,
  interactive = true,
  attribution = true,
}: {
  center: LatLng;
  zoom: number;
  interactive?: boolean;
  attribution?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const readyRef = useRef(false);
  const listeners = useRef(new Set<() => void>());

  const whenReady = useCallback((fn: (map: MapLibreMap) => void) => {
    const map = mapRef.current;
    if (map && readyRef.current) {
      fn(map);
      return;
    }
    const wait = () => {
      const next = mapRef.current;
      if (next && readyRef.current) fn(next);
    };
    listeners.current.add(wait);
    return () => {
      listeners.current.delete(wait);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = new MapLibreMap({
      container,
      style: POSITRON_STYLE,
      center: lngLat(center),
      zoom,
      attributionControl: attribution ? { compact: true } : false,
      interactive,
      dragRotate: false,
      pitchWithRotate: false,
    });
    mapRef.current = map;

    map.on("load", () => {
      applyYardsaleStyle(map);
      readyRef.current = true;
      for (const listener of listeners.current) listener();
      window.setTimeout(() => map.resize(), 120);
    });

    return () => {
      readyRef.current = false;
      mapRef.current = null;
      map.remove();
    };
    // Map is created once for the surface; later pans happen through whenReady.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only
  }, []);

  return { containerRef, whenReady };
}

export function StickerMap({
  items,
  selectedId,
  onSelect,
  className,
}: {
  items: Item[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const { containerRef, whenReady } = useYardsaleMap({
    center: HOME,
    zoom: 13,
  });
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const markers: Marker[] = [];
    const stop = whenReady((map) => {
      for (const item of items) {
        const selected = item.id === selectedId;
        const el = stickerEl(item, selected);
        el.addEventListener("click", (event) => {
          event.stopPropagation();
          onSelectRef.current?.(item.id);
        });
        const marker = new Marker({ element: el, anchor: "bottom" })
          .setLngLat(lngLat(item.location))
          .addTo(map);
        if (selected) marker.getElement().style.zIndex = "2";
        markers.push(marker);
      }
    });
    return () => {
      stop?.();
      for (const marker of markers) marker.remove();
    };
  }, [items, selectedId, whenReady]);

  useEffect(() => {
    const selected = items.find((item) => item.id === selectedId);
    if (!selected) return;
    return whenReady((map) => {
      map.easeTo({ center: lngLat(selected.location), duration: 400 });
    });
  }, [items, selectedId, whenReady]);

  return (
    <div
      ref={containerRef}
      className={cn("yardsale-map size-full", className)}
    />
  );
}

const ROUTE_SOURCE = "yardsale-route";
const ROUTE_LAYER = "yardsale-route-line";

export function RouteMap({
  route,
  courier,
  sellerLabel,
  buyerLabel,
  pickedUp,
  className,
}: {
  route: LatLng[];
  courier?: LatLng;
  sellerLabel: string;
  buyerLabel: string;
  pickedUp: boolean;
  className?: string;
}) {
  const seller = route[2] ?? route[0];
  const buyer = route.at(-1)!;
  const { containerRef, whenReady } = useYardsaleMap({
    center: seller,
    zoom: 13,
  });

  useEffect(() => {
    return whenReady((map) => {
      const data = {
        type: "Feature" as const,
        properties: {},
        geometry: {
          type: "LineString" as const,
          coordinates: route.map(lngLat),
        },
      };

      if (map.getSource(ROUTE_SOURCE)) {
        (map.getSource(ROUTE_SOURCE) as GeoJSONSource).setData(data);
      } else {
        map.addSource(ROUTE_SOURCE, { type: "geojson", data });
        map.addLayer({
          id: ROUTE_LAYER,
          type: "line",
          source: ROUTE_SOURCE,
          paint: {
            "line-color": "#5e2355",
            "line-width": 3,
            "line-opacity": 0.35,
            "line-dasharray": [2, 2],
          },
        });
      }

      const bounds = new LngLatBounds();
      for (const point of route) bounds.extend(lngLat(point));
      map.fitBounds(bounds, { padding: 48, animate: false });
    });
  }, [route, whenReady]);

  useEffect(() => {
    const markers: Marker[] = [];
    const stop = whenReady((map) => {
      markers.push(
        new Marker({
          element: dotEl(sellerLabel, pickedUp),
          anchor: "center",
        })
          .setLngLat(lngLat(seller))
          .addTo(map),
        new Marker({
          element: dotEl(buyerLabel, false),
          anchor: "center",
        })
          .setLngLat(lngLat(buyer))
          .addTo(map),
      );

      if (courier) {
        markers.push(
          new Marker({ element: courierEl(), anchor: "center" })
            .setLngLat(lngLat(courier))
            .addTo(map),
        );
      }
    });
    return () => {
      stop?.();
      for (const marker of markers) marker.remove();
    };
  }, [courier, seller, buyer, sellerLabel, buyerLabel, pickedUp, whenReady]);

  return (
    <div
      ref={containerRef}
      className={cn("yardsale-map size-full", className)}
    />
  );
}

export function PinMap({
  point,
  label,
  className,
}: {
  point: LatLng;
  label: string;
  className?: string;
}) {
  const { containerRef, whenReady } = useYardsaleMap({
    center: point,
    zoom: 14,
    interactive: false,
    attribution: false,
  });

  useEffect(() => {
    let marker: Marker | undefined;
    const stop = whenReady((map) => {
      marker = new Marker({
        element: dotEl(label, true),
        anchor: "center",
      })
        .setLngLat(lngLat(point))
        .addTo(map);
    });
    return () => {
      stop?.();
      marker?.remove();
    };
  }, [point, label, whenReady]);

  return (
    <div
      ref={containerRef}
      className={cn("yardsale-map size-full", className)}
    />
  );
}
