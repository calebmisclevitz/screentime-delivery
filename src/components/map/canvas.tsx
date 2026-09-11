"use client";

import {
  GeoJSONSource,
  LngLatBounds,
  Map as MapLibreMap,
  Marker,
  setWorkerUrl,
} from "maplibre-gl";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { HOME, formatPrice } from "@/lib/geo";
import type { Item, LatLng } from "@/lib/types";

import { MINIMUM_PLAY_MS } from "./loader";
import { stickerSource } from "./sticker-edge";
import { applyYardsaleStyle, POSITRON_STYLE } from "./style";
import { MapSurface } from "./surface";

// Next/Turbopack does not emit the worker's sibling shared chunk, so tiles
// never fetch unless the worker is served from public/ next to that file.
setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

function lngLat(point: LatLng): [number, number] {
  return [point.lng, point.lat];
}

function stickerEl(item: Item, selected: boolean) {
  const chip = selected
    ? "border-primary bg-primary text-primary-foreground shadow-lg"
    : "border-border bg-card text-foreground shadow-brand";
  const scale = selected ? "scale-110" : "";
  const el = document.createElement("div");
  el.className = "cursor-pointer";
  const img = document.createElement("img");
  img.alt = "";
  img.className = "size-16 object-contain drop-shadow-md";
  img.src = stickerSource(item.images[0], (edged) => {
    img.src = edged;
  });
  el.innerHTML = `
    <div class="flex flex-col items-center transition-transform ${scale}">
      <span class="mt-0.5 rounded-full border px-1 py-px type-label-small whitespace-nowrap ${chip}">${formatPrice(item.price)}</span>
    </div>
  `;
  el.firstElementChild?.prepend(img);
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
      <span class="rounded-full border border-border bg-card/90 px-2 py-1 whitespace-nowrap text-foreground">${label}</span>
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
  const styleReadyRef = useRef(false);
  const listeners = useRef(new Set<() => void>());
  const [canvasReady, setCanvasReady] = useState(false);

  const whenReady = useCallback((fn: (map: MapLibreMap) => void) => {
    const map = mapRef.current;
    if (map && styleReadyRef.current) {
      fn(map);
      return;
    }
    const wait = () => {
      const next = mapRef.current;
      if (next && styleReadyRef.current) fn(next);
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

    const revealCanvas = () => setCanvasReady(true);
    const handleLoad = () => {
      applyYardsaleStyle(map);
      map.once("idle", revealCanvas);
      styleReadyRef.current = true;
      for (const listener of listeners.current) listener();
      window.setTimeout(() => map.resize(), 120);
    };
    map.on("load", handleLoad);

    return () => {
      map.off("load", handleLoad);
      map.off("idle", revealCanvas);
      styleReadyRef.current = false;
      mapRef.current = null;
      map.remove();
    };
    // Map is created once for the surface; later pans happen through whenReady.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only
  }, []);

  return { canvasReady, containerRef, whenReady };
}

/** Keeps a surface loading until the reel has had its full run. */
function useHeldReady(ready: boolean, holdMs: number) {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setHeld(true), holdMs);
    return () => window.clearTimeout(id);
  }, [holdMs]);

  return ready && held;
}

const DEAL_DURATION_MS = 460;
const DEAL_STAGGER_MS = 12;

/**
 * Sends every sticker out from the spot the reel just vacated to its own pin,
 * nearest first, so the loader reads as the pile the map is dealt from.
 */
function dealStickers(map: MapLibreMap, markers: Marker[]) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const container = map.getContainer();
  const center = {
    x: container.clientWidth / 2,
    y: container.clientHeight / 2,
  };

  const flights = markers
    .map((marker) => {
      const point = map.project(marker.getLngLat());
      return {
        // MapLibre owns the marker's own transform, so the flight rides on the
        // sticker inside it.
        sticker: marker.getElement().firstElementChild,
        dx: center.x - point.x,
        dy: center.y - point.y,
      };
    })
    .sort((a, b) => Math.hypot(a.dx, a.dy) - Math.hypot(b.dx, b.dy));

  flights.forEach(({ sticker, dx, dy }, rank) => {
    if (!(sticker instanceof HTMLElement)) return;
    sticker.animate(
      [
        // Starts at the reel's size so the first frame of the flight matches
        // the cutout the loader just cut away from.
        { transform: `translate(${dx}px, ${dy}px) scale(1.4)`, opacity: 0 },
        { opacity: 1, offset: 0.2 },
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
      ],
      {
        duration: DEAL_DURATION_MS,
        delay: rank * DEAL_STAGGER_MS,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards",
      },
    );
  });
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
  const { canvasReady, containerRef, whenReady } = useYardsaleMap({
    center: HOME,
    zoom: 13,
  });
  const revealed = useHeldReady(canvasReady, MINIMUM_PLAY_MS);
  const onSelectRef = useRef(onSelect);
  const markersRef = useRef<Marker[]>([]);
  const dealtRef = useRef(false);
  const reelImages = useMemo(
    () => items.map((item) => item.images[0]),
    [items],
  );

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
      markersRef.current = markers;
    });
    return () => {
      stop?.();
      markersRef.current = [];
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

  // Layout effect so the stickers are already mid-flight on the frame the
  // reveal paints, rather than blinking into place first.
  useLayoutEffect(() => {
    if (!revealed || dealtRef.current) return;
    dealtRef.current = true;
    return whenReady((map) => dealStickers(map, markersRef.current));
  }, [revealed, whenReady]);

  return (
    <MapSurface
      containerRef={containerRef}
      images={reelImages}
      loader
      ready={revealed}
      className={className}
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
  const { canvasReady, containerRef, whenReady } = useYardsaleMap({
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
    <MapSurface
      containerRef={containerRef}
      ready={canvasReady}
      className={className}
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
  const { canvasReady, containerRef, whenReady } = useYardsaleMap({
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
    <MapSurface
      containerRef={containerRef}
      ready={canvasReady}
      className={className}
    />
  );
}
