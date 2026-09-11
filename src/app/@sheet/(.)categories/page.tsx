import { Suspense } from "react";

import { CategoriesView } from "@/components/categories-view";
import { RouteSheet } from "@/components/route-sheet";

export default function CategoriesSheet() {
  return (
    <RouteSheet>
      <Suspense>
        <CategoriesView />
      </Suspense>
    </RouteSheet>
  );
}
