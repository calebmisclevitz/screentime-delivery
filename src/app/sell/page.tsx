"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";

import { SectionHeader } from "@/components/page-header";
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
import { cn } from "@/lib/utils";

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
    <form onSubmit={submit} className="mx-auto w-full max-w-2xl pb-28 md:pb-10">
      <SectionHeader
        title="List an item"
        subtitle="Two minutes and it's live to everyone nearby"
      />

      <div className="space-y-7 p-4 md:p-6">
        <section className="space-y-3">
          <Label>Photo</Label>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {STOCK_IMAGES.slice(0, 12).map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => set("image", src)}
                aria-pressed={draft.image === src}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg border-2 bg-muted transition-colors",
                  draft.image === src ? "border-foreground" : "border-transparent",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                {draft.image === src && (
                  <span className="absolute right-1 bottom-1 flex size-4 items-center justify-center rounded-full bg-foreground text-background">
                    <CheckIcon className="size-2.5" />
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Demo mode — pick from the sample photo library instead of uploading.
          </p>
        </section>

        <section className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="1970s walnut record cabinet"
            className="h-11"
            aria-invalid={submitted && draft.title.trim().length <= 2}
          />
        </section>

        <div className="grid gap-5 sm:grid-cols-2">
          <section className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
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
                className="h-11 pl-7"
                aria-invalid={submitted && !priceValid}
              />
            </div>
          </section>

          <section className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={draft.category}
              onValueChange={(value) =>
                set("category", value as Draft["category"])
              }
            >
              <SelectTrigger id="category" className="h-11 w-full">
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
          </section>

          <section className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select
              value={draft.condition}
              onValueChange={(value) =>
                set("condition", value as Draft["condition"])
              }
            >
              <SelectTrigger id="condition" className="h-11 w-full">
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
          </section>

          <section className="space-y-2">
            <Label htmlFor="neighborhood">Pickup neighborhood</Label>
            <Select
              value={draft.neighborhood}
              onValueChange={(value) => set("neighborhood", value)}
            >
              <SelectTrigger id="neighborhood" className="h-11 w-full">
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
        </div>

        <section className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Say where it came from, what shape it's in, and anything a buyer should know."
            rows={5}
          />
        </section>

        <section className="flex items-center justify-between gap-4 rounded-xl border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="delivery">Offer delivery</Label>
            <p className="text-xs text-muted-foreground">
              A Swapmeeter collects it from you and takes it to the buyer. You
              never leave home.
            </p>
          </div>
          <Switch
            id="delivery"
            checked={draft.deliveryAvailable}
            onCheckedChange={(checked) => set("deliveryAvailable", checked)}
          />
        </section>

        <div className="hidden md:block">
          <Button type="submit" className="h-12 w-full">
            Post listing
          </Button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-20 border-t bg-background/95 p-3 backdrop-blur md:hidden">
        <Button type="submit" className="h-12 w-full">
          Post listing
        </Button>
      </div>
    </form>
  );
}
