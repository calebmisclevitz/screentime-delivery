import {
  HeartIcon,
  ShoppingBagIcon,
  TagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { PageMenu } from "@/components/page-menu";

const YOU_LINKS = [
  { href: "/saves", label: "Saves", icon: HeartIcon },
  { href: "/selling", label: "Selling", icon: TagIcon },
  { href: "/purchases", label: "Purchases", icon: ShoppingBagIcon },
  { href: "/account", label: "Account", icon: UserCircleIcon },
];

export default function YouPage() {
  return (
    <PageContainer width="narrow">
      <PageHeader title="You" />
      <PageMenu items={YOU_LINKS} />
    </PageContainer>
  );
}
