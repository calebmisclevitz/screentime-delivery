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
    ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
    : "border-border bg-card text-foreground shadow-brand";

  return L.divIcon({
    className: "sticker-icon",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `
      <div class="sticker-wrap">
        <div class="flex items-center gap-1 rounded-full border py-0.5 pr-2 pl-0.5 transition-all ${ring}">
          <img src="${item.images[0]}" alt="" class="size-6 shrink-0 rounded-full object-cover" />
          <span class="font-mono text-[11px] tracking-wide whitespace-nowrap">${formatPrice(item.price)}</span>
        </div>
      </div>
    `,
  });
}

function dotIcon(label: string, filled: boolean) {
  const style = filled
    ? "border-background bg-primary text-primary-foreground"
    : "border-primary bg-card text-primary";
  return L.divIcon({
    className: "sticker-icon",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `
      <div class="sticker-wrap" style="transform: translate(-50%, 50%)">
        <div class="flex items-center gap-1.5">
          <span class="size-3 rounded-full border-2 ${style}"></span>
          <span class="rounded-full border border-border bg-card/90 px-2 py-0.5 font-mono text-[10px] tracking-wide whitespace-nowrap text-foreground">${label}</span>
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
        <span class="flex size-7 items-center justify-center rounded-full border-2 border-background bg-primary shadow-md">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 text-primary-foreground">
            <path d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
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
          color: "#3a1e6c",
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
