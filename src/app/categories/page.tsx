import { Suspense } from "react";

import { CategoriesView } from "@/components/categories-view";

export default function CategoriesPage() {
  return (
    <Suspense>
      <CategoriesView />
    </Suspense>
  );
}
