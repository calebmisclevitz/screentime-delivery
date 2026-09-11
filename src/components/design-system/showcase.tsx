"use client";

import { useState } from "react";
import {
  ArrowRightIcon,
  HeartIcon,
  ShoppingBagIcon,
  TagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import { ConditionBadge } from "@/components/condition-badge";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { PageMenu } from "@/components/page-menu";
import { StickyActionBar } from "@/components/sticky-action-bar";
import {
  SummaryCard,
  SummaryCardBody,
  SummaryCardImage,
} from "@/components/summary-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchField } from "@/components/ui/search-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const COLORS = [
  ["Background", "bg-background", "text-foreground"],
  ["Card", "bg-card", "text-card-foreground"],
  ["Primary", "bg-primary", "text-primary-foreground"],
  ["Secondary", "bg-secondary", "text-secondary-foreground"],
  ["Tertiary", "bg-tertiary", "text-tertiary-foreground"],
  ["Muted", "bg-muted", "text-foreground"],
  ["Accent", "bg-accent", "text-accent-foreground"],
] as const;

const MENU_ITEMS = [
  { href: "#saves", label: "Saves", icon: HeartIcon },
  { href: "#selling", label: "Selling", icon: TagIcon },
  { href: "#purchases", label: "Purchases", icon: ShoppingBagIcon },
  { href: "#account", label: "Account", icon: UserCircleIcon },
];

export function DesignSystemShowcase() {
  const [query, setQuery] = useState("teak");

  return (
    <main className="mx-auto w-full max-w-6xl space-y-16 px-4 py-8 md:px-6 md:py-16">
      <header className="max-w-2xl space-y-4">
        <p className="type-label-small text-muted-foreground">
          Yardsale foundations
        </p>
        <h1 className="type-display-medium">Visual design system</h1>
        <p className="type-body-large text-muted-foreground">
          A compact review surface for the shared type, color, spacing, and
          component decisions used throughout the app.
        </p>
      </header>

      <ShowcaseSection
        id="typography"
        title="Typography"
        description="Body Medium is the inherited base. Every other role is a deliberate exception."
      >
        <div className="divide-y rounded-xl bg-card px-4 shadow-brand">
          <TypeSample name="Display Medium" meta="32 / 40">
            <span className="type-display-medium">Sell what you have</span>
          </TypeSample>
          <TypeSample name="Heading Medium" meta="24 / 32">
            <span className="type-heading-medium">Recently listed</span>
          </TypeSample>
          <TypeSample name="Body Large" meta="18 / 24">
            <span className="type-body-large">Furniture in your area</span>
          </TypeSample>
          <TypeSample name="Body Medium · base" meta="16 / 24">
            <span>Clear, comfortable text for product UI and longer copy.</span>
          </TypeSample>
          <TypeSample name="Label Small" meta="12 / 16">
            <span className="type-label-small">PRICE · DISTANCE · STATUS</span>
          </TypeSample>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="color"
        title="Semantic color"
        description="Components consume roles rather than brand color names. Dark tokens are ready for a future app-level theme control."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <ThemePanel title="Light" />
          <ThemePanel title="Dark preview" dark />
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="spacing"
        title="Spacing and shape"
        description="Common layout increments use an 8px rhythm; controls and icons use 48px and 24px defaults."
      >
        <div className="grid gap-8 rounded-xl bg-card p-4 shadow-brand md:grid-cols-2 md:p-6">
          <div className="space-y-4">
            {[8, 16, 24, 32, 48].map((size) => (
              <div key={size} className="flex items-center gap-4">
                <span className="w-12 type-label-small text-muted-foreground">
                  {size}px
                </span>
                <span
                  className="h-2 rounded-full bg-primary"
                  style={{ width: size }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-end gap-4">
            <Shape label="8" className="rounded-lg" />
            <Shape label="16" className="rounded-xl" />
            <Shape label="24" className="rounded-3xl" />
            <Shape label="Full" className="rounded-full" />
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="actions"
        title="Buttons and icon buttons"
        description="The normal action is 48px high with a 24px icon; compact is explicit."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
          <Button>
            Continue <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <IconButton icon={HeartIcon} aria-label="Save item" />
          <IconButton
            icon={HeartIcon}
            aria-label="Compact save item"
            size="compact"
            variant="outline"
          />
          <Button size="sm">Compact action</Button>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="fields"
        title="Fields and selection"
        description="Inputs and select triggers share the 48px control height and base body style."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <Field label="Title">
            <Input placeholder="1970s walnut record cabinet" />
          </Field>
          <Field label="Invalid field">
            <Input defaultValue="Incomplete" aria-invalid />
          </Field>
          <Field label="Disabled field">
            <Input defaultValue="Unavailable" disabled />
          </Field>
          <Field label="Category">
            <Select defaultValue="furniture">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="music">Music Gear</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="home">Home Goods</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Description" className="md:col-span-2">
            <Textarea placeholder="Share its history, condition, and anything a buyer should know." />
          </Field>
          <div className="flex items-center justify-between rounded-xl bg-card p-4 shadow-brand md:col-span-2">
            <div>
              <Label htmlFor="delivery-preview">Offer delivery</Label>
              <p className="text-muted-foreground">
                Let a Swapmeeter bring it to the buyer.
              </p>
            </div>
            <Switch id="delivery-preview" defaultChecked />
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="search"
        title="Search"
        description="Linked browse search and editable search use the same field shell."
      >
        <div className="grid max-w-3xl gap-4 md:grid-cols-2">
          <SearchField href="/search" placeholder="Search Raleigh" />
          <SearchField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            placeholder="Search"
            aria-label="Editable search example"
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="content" title="Badges and cards">
        <div className="mb-8 flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <ConditionBadge condition="Excellent" />
          <ConditionBadge condition="Good" />
          <ConditionBadge condition="Fair" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card title</CardTitle>
              <CardDescription>
                Shared surfaces inherit the base body style and semantic color.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Use cards for grouped content, not as a default wrapper for every
              row.
            </CardContent>
          </Card>
          <SummaryCard>
            <SummaryCardImage
              src="/items/rattan-lounge-chair.jpg"
              alt="Rattan lounge chair"
            />
            <SummaryCardBody>
              <p className="font-medium">Rattan and Cane Lounge Chair</p>
              <p className="type-label-small">$420 · 1.1 MI</p>
              <ConditionBadge condition="Good" />
            </SummaryCardBody>
          </SummaryCard>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="navigation" title="Navigation and menus">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-20 overflow-auto rounded-xl bg-background shadow-brand">
            <PageHeader title="Page title" />
          </div>
          <div className="rounded-xl bg-background py-2 shadow-brand">
            <PageMenu items={MENU_ITEMS} />
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="feedback" title="Feedback and loading">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-card shadow-brand">
            <EmptyState
              icon={HeartIcon}
              title="Nothing saved yet"
              description="Items you save will show up here."
              actionLabel="Browse items"
              actionHref="/"
            />
          </div>
          <div className="space-y-4 rounded-xl bg-card p-4 shadow-brand">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-control w-full rounded-full" />
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="sticky-action"
        title="Sticky action composition"
        description="Shown statically here; product pages pin the same component to the viewport."
      >
        <div className="overflow-hidden rounded-xl border">
          <StickyActionBar position="static">
            <Button variant="outline" className="flex-1">
              Save
            </Button>
            <Button className="flex-1">Buy now</Button>
          </StickyActionBar>
        </div>
      </ShowcaseSection>
    </main>
  );
}

function ShowcaseSection({
  title,
  description,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  title: string;
  description?: string;
}) {
  return (
    <section className={className} {...props}>
      <div className="mb-6 max-w-2xl">
        <h2 className="type-heading-medium">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function TypeSample({
  name,
  meta,
  children,
}: {
  name: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 py-4 md:grid-cols-[10rem_1fr] md:items-baseline">
      <span className="type-label-small text-muted-foreground">
        {name}
        <span className="block font-normal">{meta}</span>
      </span>
      {children}
    </div>
  );
}

function ThemePanel({ title, dark = false }: { title: string; dark?: boolean }) {
  return (
    <div
      className={
        dark
          ? "dark rounded-xl bg-background p-4 text-foreground shadow-brand"
          : "rounded-xl bg-background p-4 text-foreground shadow-brand"
      }
    >
      <h3 className="mb-4 type-body-large font-medium">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {COLORS.map(([name, background, foreground]) => (
          <div
            key={name}
            className={`${background} ${foreground} flex min-h-20 items-end rounded-lg p-2`}
          >
            <span className="type-label-small">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Shape({ label, className }: { label: string; className: string }) {
  return (
    <div className="text-center">
      <div className={`${className} size-16 bg-secondary`} />
      <span className="type-label-small text-muted-foreground">{label}</span>
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-2">{label}</Label>
      {children}
    </div>
  );
}
