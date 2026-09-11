import type { Metadata } from "next";

import { DesignSystemShowcase } from "@/components/design-system/showcase";

export const metadata: Metadata = {
  title: "Visual Design System — Yardsale",
  description: "The public review surface for Yardsale's visual foundations.",
};

export default function DesignSystemPage() {
  return <DesignSystemShowcase />;
}
