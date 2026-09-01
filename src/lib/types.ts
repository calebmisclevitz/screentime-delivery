export const CATEGORIES = [
  "Music Gear",
  "Furniture",
  "Home Goods",
  "Trinkets",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CONDITIONS = ["Excellent", "Good", "Fair"] as const;

export type Condition = (typeof CONDITIONS)[number];

/** Drives the delivery base fee and the courier vehicle copy. */
export type ItemSize = "small" | "medium" | "large";

export type LatLng = { lat: number; lng: number };

export type Seller = {
  id: string;
  name: string;
  rating: number;
  sales: number;
};

export type Item = {
  id: string;
  title: string;
  price: number;
  category: Category;
  condition: Condition;
  description: string;
  images: string[];
  seller: Seller;
  location: LatLng & { neighborhood: string };
  size: ItemSize;
  deliveryAvailable: boolean;
  postedAt: string;
  status: "active" | "sold";
};

export type Fulfillment = "pickup" | "delivery";

export const DELIVERY_STAGES = [
  "matching",
  "to_seller",
  "picked_up",
  "to_buyer",
  "delivered",
] as const;

export type DeliveryStage = (typeof DELIVERY_STAGES)[number];

export type Order = {
  id: string;
  itemId: string;
  fulfillment: Fulfillment;
  dropoffAddress: string;
  itemPrice: number;
  deliveryFee: number;
  total: number;
  courierName: string;
  courierStart: LatLng;
  placedAt: number;
};

export type Draft = {
  title: string;
  price: string;
  category: Category;
  condition: Condition;
  description: string;
  neighborhood: string;
  image: string;
  deliveryAvailable: boolean;
};
