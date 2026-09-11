import type { Map as MapLibreMap } from "maplibre-gl";

export const POSITRON_STYLE = "https://tiles.openfreemap.org/styles/positron";

/**
 * Positron paints its ground and roads in neutral greys, which go muddy over
 * the pale blue background. Everything here is a tint of that background so
 * the map reads as one family and listing stickers stay the only real color.
 */
/** Positron layers that add street names, shields, rails, and extra places. */
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
  | "building-edge"
  | "road-path"
  | "road-minor"
  | "road-major"
  | "road-major-edge"
  | "road-motorway"
  | "road-motorway-edge"
  | "label"
  | "boundary";

/** Layer id, paint property, semantic map color. */
const PAINT: Array<[string, PaintProperty, MapColor]> = [
  ["background", "background-color", "ground"],
  ["water", "fill-color", "water"],
  ["waterway", "line-color", "water"],
  ["park", "fill-color", "green"],
  ["landcover_wood", "fill-color", "green"],
  ["landuse_residential", "fill-color", "block"],
  ["building", "fill-color", "building"],
  ["building", "fill-outline-color", "building-edge"],
  ["road_area_pier", "fill-color", "ground"],
  ["road_pier", "line-color", "ground"],
  ["highway_path", "line-color", "road-path"],
  ["highway_minor", "line-color", "road-minor"],
  ["highway_major_inner", "line-color", "road-major"],
  ["highway_major_casing", "line-color", "road-major-edge"],
  ["highway_major_subtle", "line-color", "road-major"],
  ["highway_motorway_inner", "line-color", "road-motorway"],
  ["highway_motorway_casing", "line-color", "road-motorway-edge"],
  ["highway_motorway_subtle", "line-color", "road-motorway"],
  ["highway_motorway_bridge_inner", "line-color", "road-motorway"],
  ["highway_motorway_bridge_casing", "line-color", "road-motorway-edge"],
  ["tunnel_motorway_inner", "line-color", "road-motorway"],
  ["tunnel_motorway_casing", "line-color", "road-motorway-edge"],
  ["boundary_2", "line-color", "boundary"],
  ["boundary_3", "line-color", "boundary"],
  ["boundary_disputed", "line-color", "boundary"],
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
