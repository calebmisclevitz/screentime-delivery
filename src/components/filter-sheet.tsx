"use client";

import { SlidersHorizontalIcon } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_FILTERS,
  PRICE_CEILING,
  SORT_LABELS,
  activeFilterCount,
  type Filters,
  type SortKey,
} from "@/lib/filters";
import { CONDITIONS, type Condition } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FilterSheet({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filters);
  const count = activeFilterCount(filters);

  function openSheet(next: boolean) {
    if (next) setDraft(filters);
    setOpen(next);
  }

  function toggleCondition(condition: Condition) {
    setDraft((d) => ({
      ...d,
      conditions: d.conditions.includes(condition)
        ? d.conditions.filter((c) => c !== condition)
        : [...d.conditions, condition],
    }));
  }

  return (
    <Sheet open={open} onOpenChange={openSheet}>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-10 gap-2 px-3">
          <SlidersHorizontalIcon className="size-4" />
          Filters
          {count > 0 && (
            <Badge className="ml-0.5 size-4 justify-center rounded-full p-0 text-[10px] tabular-nums">
              {count}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="max-h-[86vh] gap-0 overflow-y-auto rounded-t-2xl sm:max-w-none md:inset-x-auto md:right-0 md:h-full md:max-h-none md:rounded-none"
      >
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="space-y-7 px-5 py-5">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Max price</Label>
              <span className="font-heading text-sm font-medium tabular-nums">
                {draft.maxPrice >= PRICE_CEILING
                  ? "Any"
                  : `$${draft.maxPrice.toLocaleString("en-US")}`}
              </span>
            </div>
            <Slider
              value={[draft.maxPrice]}
              min={50}
              max={PRICE_CEILING}
              step={50}
              onValueChange={([value]) =>
                setDraft((d) => ({ ...d, maxPrice: value }))
              }
            />
          </section>

          <section className="space-y-3">
            <Label>Condition</Label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((condition) => {
                const active = draft.conditions.includes(condition);
                return (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => toggleCondition(condition)}
                    aria-pressed={active}
                    className={cn(
                      "h-9 rounded-full border px-4 text-sm transition-colors",
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {condition}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="delivery-only">Delivery available</Label>
              <p className="text-xs text-muted-foreground">
                Only show items a courier can bring to you
              </p>
            </div>
            <Switch
              id="delivery-only"
              checked={draft.deliveryOnly}
              onCheckedChange={(checked) =>
                setDraft((d) => ({ ...d, deliveryOnly: checked }))
              }
            />
          </section>

          <section className="space-y-3">
            <Label>Sort by</Label>
            <div className="grid gap-2">
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, sort: key }))}
                  aria-pressed={draft.sort === key}
                  className={cn(
                    "flex h-10 items-center rounded-lg border px-3 text-sm transition-colors",
                    draft.sort === key
                      ? "border-foreground bg-secondary text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {SORT_LABELS[key]}
                </button>
              ))}
            </div>
          </section>
        </div>

        <SheetFooter className="sticky bottom-0 flex-row gap-2 border-t bg-popover px-5 py-4">
          <Button
            variant="outline"
            className="h-11 flex-1"
            onClick={() =>
              setDraft({
                ...DEFAULT_FILTERS,
                query: draft.query,
                category: draft.category,
              })
            }
          >
            Reset
          </Button>
          <Button
            className="h-11 flex-1"
            onClick={() => {
              onChange(draft);
              setOpen(false);
            }}
          >
            Show results
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
