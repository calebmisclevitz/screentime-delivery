"use client";

import { useSearchParams } from "next/navigation";
import {
  HomeModernIcon,
  MusicalNoteIcon,
  RectangleGroupIcon,
  ShoppingBagIcon,
  SparklesIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

import { PageHeader } from "@/components/page-header";
import { PageMenu } from "@/components/page-menu";
import { PageContainer } from "@/components/page-container";
import { browseHref } from "@/lib/browse";
import { CATEGORIES } from "@/lib/types";

const CATEGORY_ICONS = {
  "Music Gear": MusicalNoteIcon,
  Furniture: RectangleGroupIcon,
  "Home Goods": HomeModernIcon,
  Clothes: ShoppingBagIcon,
  Trinkets: SparklesIcon,
} as const;

/** Picking a category returns to whichever browse mode opened this list. */
export function CategoriesView() {
  const searchParams = useSearchParams();
  const base = searchParams.get("from") === "map" ? "/map" : "/";
  const items = [
    {
      href: browseHref(base, "All"),
      label: "All categories",
      icon: Squares2X2Icon,
    },
    ...CATEGORIES.map((category) => ({
      href: browseHref(base, category),
      label: category,
      icon: CATEGORY_ICONS[category],
    })),
  ];

  return (
    <PageContainer width="narrow">
      <PageHeader title="Categories" />
      <PageMenu items={items} />
    </PageContainer>
  );
}
