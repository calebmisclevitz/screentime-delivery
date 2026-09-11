import ItemPage from "@/app/item/[id]/page";
import { RouteSheet } from "@/components/route-sheet";

export default function ItemSheet() {
  return (
    <RouteSheet>
      <ItemPage />
    </RouteSheet>
  );
}
