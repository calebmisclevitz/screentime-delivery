"use client";

import L from "leaflet";
import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";

import { HOME, formatPrice } from "@/lib/geo";
import type { Item, LatLng } from "@/lib/types";

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

function stickerIcon(item: Item, selected: boolean) {
  const ring = selected
    ? "border-foreground bg-foreground text-background shadow-lg scale-105"
    : "border-border bg-background text-foreground shadow-sm";

  return L.divIcon({
    className: "sticker-icon",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `
      <div class="sticker-wrap">
        <div class="flex items-center gap-1 rounded-full border py-0.5 pr-2 pl-0.5 transition-all ${ring}">
          <img src="${item.images[0]}" alt="" class="size-6 shrink-0 rounded-full object-cover" />
          <span class="text-[11px] font-semibold whitespace-nowrap">${formatPrice(item.price)}</span>
        </div>
      </div>
    `,
  });
}

function dotIcon(label: string, filled: boolean) {
  const style = filled
    ? "border-background bg-foreground text-background"
    : "border-foreground bg-background text-foreground";
  return L.divIcon({
    className: "sticker-icon",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `
      <div class="sticker-wrap" style="transform: translate(-50%, 50%)">
        <div class="flex items-center gap-1.5">
          <span class="size-3 rounded-full border-2 ${style}"></span>
          <span class="rounded-full border border-border bg-background/90 px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-foreground">${label}</span>
        </div>
      </div>
    `,
  });
}

function courierIcon() {
  return L.divIcon({
    className: "sticker-icon",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `
      <div class="sticker-wrap" style="transform: translate(-50%, 50%)">
        <span class="flex size-7 items-center justify-center rounded-full border-2 border-background bg-foreground shadow-md">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 text-background">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
            <path d="M15 18H9"/>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
            <circle cx="17" cy="18" r="2"/>
            <circle cx="7" cy="18" r="2"/>
          </svg>
        </span>
      </div>
    `,
  });
}

/** Keeps the Leaflet viewport in sync with React state changes. */
function ViewSync({
  center,
  bounds,
  fitPadding = [48, 48],
}: {
  center?: LatLng;
  bounds?: LatLng[];
  /** Inset in pixels, sized to clear whatever chrome floats over the map. */
  fitPadding?: [number, number];
}) {
  const map = useMap();
  const lat = center?.lat;
  const lng = center?.lng;
  const [padX, padY] = fitPadding;

  useEffect(() => {
    if (lat == null || lng == null) return;
    map.panTo([lat, lng], { animate: true, duration: 0.4 });
  }, [map, lat, lng]);

  useEffect(() => {
    if (!bounds?.length) return;
    map.fitBounds(
      bounds.map((p) => [p.lat, p.lng] as [number, number]),
      { padding: [padX, padY], animate: false },
    );
  }, [map, bounds, padX, padY]);

  // Leaflet measures its container on init; when that happens before layout
  // settles the tiles come out misaligned until a resize is forced.
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 120);
    return () => clearTimeout(id);
  }, [map]);

  return null;
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
  const markers = useMemo(
    () =>
      items.map((item) => ({
        item,
        icon: stickerIcon(item, item.id === selectedId),
      })),
    [items, selectedId],
  );

  const selected = items.find((i) => i.id === selectedId);

  return (
    <MapContainer
      // Framed on the item cluster rather than fitted to every pin — fitting
      // the full spread zooms out far enough that the stickers collide.
      center={[HOME.lat, HOME.lng]}
      zoom={13}
      zoomControl={false}
      className={className}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <ViewSync center={selected ? selected.location : undefined} />
      {markers.map(({ item, icon }) => (
        <Marker
          key={item.id}
          position={[item.location.lat, item.location.lng]}
          icon={icon}
          zIndexOffset={item.id === selectedId ? 1000 : 0}
          eventHandlers={{ click: () => onSelect?.(item.id) }}
        />
      ))}
    </MapContainer>
  );
}

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
  const bounds = useMemo(() => route, [route]);

  return (
    <MapContainer
      center={[seller.lat, seller.lng]}
      zoom={13}
      zoomControl={false}
      className={className}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <ViewSync bounds={bounds} />
      <Polyline
        positions={route.map((p) => [p.lat, p.lng] as [number, number])}
        pathOptions={{
          color: "#171717",
          weight: 3,
          opacity: 0.35,
          dashArray: "6 8",
        }}
      />
      <Marker
        position={[seller.lat, seller.lng]}
        icon={dotIcon(sellerLabel, pickedUp)}
      />
      <Marker position={[buyer.lat, buyer.lng]} icon={dotIcon(buyerLabel, false)} />
      {courier && (
        <Marker
          position={[courier.lat, courier.lng]}
          icon={courierIcon()}
          zIndexOffset={1000}
        />
      )}
    </MapContainer>
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
  return (
    <MapContainer
      center={[point.lat, point.lng]}
      zoom={14}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      keyboard={false}
      attributionControl={false}
      className={className}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url={TILE_URL} />
      <ViewSync />
      <Marker position={[point.lat, point.lng]} icon={dotIcon(label, true)} />
    </MapContainer>
  );
}
