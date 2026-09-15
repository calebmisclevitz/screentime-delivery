import type { Map as MapLibreMap } from "maplibre-gl";

export const POSITRON_STYLE = "https://tiles.openfreemap.org/styles/positron";

/**
 * Positron paints its ground and roads in neutral greys, which go muddy over
 * the muted ground. Everything here is a darker step off that ground so the
 * map reads as one family and listing stickers stay the only real color.
 * Features are filled rather than outlined, so casings match what they carry.
 */
/**
 * Positron layers that add street names, shields, rails, extra places, and
 * administrative boundaries.
 */
const HIDDEN_LAYERS = [
  "highway-name-path",
  "highway-name-minor",
  "highway-name-major",
  "highway-shield-non-us",
  "highway-shield-us-interstate",
  "road_shield_us",
  "airport",
  "railway_transit",
  "railway_transit_dashline",
  "railway_service",
  "railway_service_dashline",
  "railway",
  "railway_dashline",
  "aeroway-taxiway",
  "aeroway-runway-casing",
  "aeroway-area",
  "aeroway-runway",
  "label_other",
  "label_village",
  "waterway_line_label",
  "boundary_2",
  "boundary_3",
  "boundary_disputed",
];

const LABEL_LAYERS = [
  "label_town",
  "label_city",
  "label_city_capital",
  "label_state",
  "water_name_point_label",
  "water_name_line_label",
];

type PaintProperty = Parameters<MapLibreMap["setPaintProperty"]>[1];

type MapColor =
  | "ground"
  | "water"
  | "green"
  | "block"
  | "building"
  | "road-path"
  | "road-minor"
  | "road-arterial"
  | "road-major"
  | "label";

/**
 * Layer id, paint property, semantic map color.
 *
 * In a dense grid the trunk and primary roads carry most of the frame, so they
 * only get the accent on their inner line — the casing and the low-zoom subtle
 * layer stay on the quieter arterial step. That keeps the accent as thin
 * structure behind the listings rather than a mat the stickers sit on.
 */
const PAINT: Array<[string, PaintProperty, MapColor]> = [
  ["background", "background-color", "ground"],
  ["water", "fill-color", "water"],
  ["waterway", "line-color", "water"],
  ["park", "fill-color", "green"],
  ["landcover_wood", "fill-color", "green"],
  ["landuse_residential", "fill-color", "block"],
  ["building", "fill-color", "building"],
  ["building", "fill-outline-color", "building"],
  ["road_area_pier", "fill-color", "ground"],
  ["road_pier", "line-color", "ground"],
  ["highway_path", "line-color", "road-path"],
  ["highway_minor", "line-color", "road-minor"],
  ["highway_major_inner", "line-color", "road-major"],
  ["highway_major_casing", "line-color", "road-arterial"],
  ["highway_major_subtle", "line-color", "road-arterial"],
  ["highway_motorway_inner", "line-color", "road-major"],
  ["highway_motorway_casing", "line-color", "road-major"],
  ["highway_motorway_subtle", "line-color", "road-major"],
  ["highway_motorway_bridge_inner", "line-color", "road-major"],
  ["highway_motorway_bridge_casing", "line-color", "road-major"],
  ["tunnel_motorway_inner", "line-color", "road-major"],
  ["tunnel_motorway_casing", "line-color", "road-major"],
];

function mapColor(name: MapColor) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--map-${name}`)
    .trim();
}

/** Quiet OpenFreeMap Positron so listing stickers stay the loudest color. */
export function applyYardsaleStyle(map: MapLibreMap) {
  for (const id of HIDDEN_LAYERS) {
    if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", "none");
  }

  for (const [id, property, color] of PAINT) {
    if (map.getLayer(id)) map.setPaintProperty(id, property, mapColor(color));
  }

  for (const id of LABEL_LAYERS) {
    if (!map.getLayer(id)) continue;
    map.setPaintProperty(id, "text-color", mapColor("label"));
    map.setPaintProperty(id, "text-halo-color", mapColor("ground"));
  }
}
