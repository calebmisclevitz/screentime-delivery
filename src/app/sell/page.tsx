"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { PageContainer } from "@/components/page-container";
import { StickyActionBar } from "@/components/sticky-action-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { STOCK_IMAGES } from "@/lib/data/items";
import { NEIGHBORHOOD_NAMES } from "@/lib/data/neighborhoods";
import { useStore } from "@/lib/store";
import { CATEGORIES, CONDITIONS, type Draft } from "@/lib/types";

const EMPTY: Draft = {
  title: "",
  price: "",
  category: "Home Goods",
  condition: "Good",
  description: "",
  neighborhood: "Glenwood South",
  image: STOCK_IMAGES[0],
  deliveryAvailable: true,
};

export default function SellPage() {
  const router = useRouter();
  const addListing = useStore((s) => s.addListing);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  const priceValid = Number(draft.price) > 0;
  const valid = draft.title.trim().length > 2 && priceValid;

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!valid) return;
    const item = addListing(draft);
    toast("Listing posted", { description: item.title });
    router.push("/selling");
  }

  return (
    <PageContainer
      as="form"
      width="narrow"
      onSubmit={submit}
      className="pb-32 md:pb-10"
    >
      <PageHeader title="Sell an item" />
      <div className="space-y-8 px-4 pb-8 md:px-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-medium">Add Photos</Label>
            <span className="type-label-small">(Up to 8)</span>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 md:-mx-6 md:px-6">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="relative size-32 shrink-0 rounded-xl bg-muted"
              >
                <PlusIcon className="absolute top-1/2 left-1/2 size-icon -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <Label htmlFor="title" className="font-medium">
            Item name
          </Label>
          <Input
            id="title"
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Name"
            aria-invalid={submitted && draft.title.trim().length <= 2}
          />
        </section>

        <section className="space-y-4">
          <Label htmlFor="neighborhood" className="font-medium">
            Location
          </Label>
          <Select
            value={draft.neighborhood}
            onValueChange={(value) => set("neighborhood", value)}
          >
            <SelectTrigger id="neighborhood" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NEIGHBORHOOD_NAMES.map((neighborhood) => (
                <SelectItem key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <section className="space-y-4">
          <Label htmlFor="price" className="font-medium">
            Pricing
          </Label>
          <div className="relative">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-foreground">
              $
            </span>
            <Input
              id="price"
              value={draft.price}
              onChange={(e) =>
                set("price", e.target.value.replace(/[^0-9.]/g, ""))
              }
              inputMode="decimal"
              placeholder="0"
              className="pl-8"
              aria-invalid={submitted && !priceValid}
            />
          </div>
        </section>

        <section className="space-y-4">
          <Label className="font-medium">Product Details</Label>
          <div className="space-y-4">
            <Select
              value={draft.category}
              onValueChange={(value) =>
                set("category", value as Draft["category"])
              }
            >
              <SelectTrigger aria-label="Category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={draft.condition}
              onValueChange={(value) =>
                set("condition", value as Draft["condition"])
              }
            >
              <SelectTrigger aria-label="Condition" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              aria-label="Description"
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Description"
              rows={3}
            />
          </div>
        </section>

        <section className="flex items-start justify-between gap-4 rounded-xl border bg-background p-4">
          <div className="space-y-2">
            <Label htmlFor="delivery" className="font-medium">
              Offer Delivery
            </Label>
            <p className="max-w-72 text-muted-foreground">
              A Swapmeeter collects it from you and takes it to the buyer.
            </p>
          </div>
          <Switch
            id="delivery"
            size="sm"
            checked={draft.deliveryAvailable}
            onCheckedChange={(checked) => set("deliveryAvailable", checked)}
            className="mt-0.5 w-11"
          />
        </section>

        <div className="hidden md:block">
          <Button type="submit" className="w-full">
            Post listing
          </Button>
        </div>
      </div>

      <StickyActionBar>
        <Button type="submit" className="w-full">
          Post listing
        </Button>
      </StickyActionBar>
    </PageContainer>
  );
}
