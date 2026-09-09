import type { Map as MapLibreMap } from "maplibre-gl";

export const POSITRON_STYLE = "https://tiles.openfreemap.org/styles/positron";

/**
 * Positron paints its ground and roads in neutral greys, which go muddy over
 * the pale blue background. Everything here is a tint of that background so
 * the map reads as one family and listing stickers stay the only real color.
 */
const GROUND = "#deedf2";
const WATER = "#c5d8de";
const GREEN = "#d4e6dc";
const BLOCK = "#e4eef0";
const BUILDING = "#dbe8ec";
const BUILDING_EDGE = "#d3e3e9";

/** Roads darken as they get more important; width carries the rest. */
const ROAD_PATH = "#d7e8ee";
const ROAD_MINOR = "#cde1ea";
const ROAD_MAJOR = "#EBFEBA";
const ROAD_MAJOR_EDGE = "#b7d1de";
const ROAD_MOTORWAY = "#bbd4e0";
const ROAD_MOTORWAY_EDGE = "#accad8";

const LABEL_TEXT = "#6a6a6a";
const BOUNDARY = "#c2d5dd";

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

/** Layer id, paint property, color. Layers absent from the style are skipped. */
const PAINT: Array<[string, PaintProperty, string]> = [
  ["background", "background-color", GROUND],
  ["water", "fill-color", WATER],
  ["waterway", "line-color", WATER],
  ["park", "fill-color", GREEN],
  ["landcover_wood", "fill-color", GREEN],
  ["landuse_residential", "fill-color", BLOCK],
  ["building", "fill-color", BUILDING],
  ["building", "fill-outline-color", BUILDING_EDGE],
  ["road_area_pier", "fill-color", GROUND],
  ["road_pier", "line-color", GROUND],
  ["highway_path", "line-color", ROAD_PATH],
  ["highway_minor", "line-color", ROAD_MINOR],
  ["highway_major_inner", "line-color", ROAD_MAJOR],
  ["highway_major_casing", "line-color", ROAD_MAJOR_EDGE],
  ["highway_major_subtle", "line-color", ROAD_MAJOR],
  ["highway_motorway_inner", "line-color", ROAD_MOTORWAY],
  ["highway_motorway_casing", "line-color", ROAD_MOTORWAY_EDGE],
  ["highway_motorway_subtle", "line-color", ROAD_MOTORWAY],
  ["highway_motorway_bridge_inner", "line-color", ROAD_MOTORWAY],
  ["highway_motorway_bridge_casing", "line-color", ROAD_MOTORWAY_EDGE],
  ["tunnel_motorway_inner", "line-color", ROAD_MOTORWAY],
  ["tunnel_motorway_casing", "line-color", ROAD_MOTORWAY_EDGE],
  ["boundary_2", "line-color", BOUNDARY],
  ["boundary_3", "line-color", BOUNDARY],
  ["boundary_disputed", "line-color", BOUNDARY],
];

/** Quiet OpenFreeMap Positron so listing stickers stay the loudest color. */
export function applyYardsaleStyle(map: MapLibreMap) {
  for (const id of HIDDEN_LAYERS) {
    if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", "none");
  }

  for (const [id, property, color] of PAINT) {
    if (map.getLayer(id)) map.setPaintProperty(id, property, color);
  }

  for (const id of LABEL_LAYERS) {
    if (!map.getLayer(id)) continue;
    map.setPaintProperty(id, "text-color", LABEL_TEXT);
    map.setPaintProperty(id, "text-halo-color", GROUND);
  }
}
