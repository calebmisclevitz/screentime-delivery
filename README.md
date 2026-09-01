# Swapmeet

A mobile-first marketplace for buying and selling secondhand things near you, demoed in Raleigh, North Carolina.

The thing that makes Swapmeet different from Craigslist or Facebook Marketplace is delivery. Most secondhand sales die at the logistics step: the buyer can't fit a credenza in their car and the seller doesn't want to drive across town. In Swapmeet the buyer picks **Delivery** at checkout and a neighbor collects the item from the seller and brings it over, for a fee based on the item's bulk and the distance.

This is an unbranded MVP. The theme is deliberately monochrome and the copy is minimal so design and brand can be layered on later.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

The map tiles come from OpenStreetMap, so the app needs network access to render them, but there is no API key or account to set up.

## Feature tour

| Screen | Route | What to try |
| --- | --- | --- |
| Map browse | `/` | Items appear as photo-and-price stickers on the map. Tap one to select it and the card rail below scrolls to match. Category chips filter the pins. |
| List browse | `/browse` | Category tabs plus a filter sheet for max price, condition, delivery-only, and sort order. |
| Search | `/search` | Instant results across titles, descriptions, and neighborhoods. Recent searches persist. |
| Item detail | `/item/[id]` | Photo, condition, distance, seller, delivery estimate, and a pickup-area mini map. |
| Checkout | `/checkout/[id]` | Choose delivery or self-pickup and see the fee breakdown before confirming. |
| Delivery tracking | `/delivery/[orderId]` | Watch the courier travel from their standby point to the seller and then to you, with a live status timeline. |
| Saved | `/saved` | Everything you've bookmarked. |
| Sell | `/sell` | Post a listing, including a toggle for whether you'll offer delivery. |
| Your stall | `/selling` | Your active and sold listings, plus everything you've bought. |

A delivery runs its full course in about 90 seconds of real time, standing in for a roughly 38-minute trip. Progress is derived from the order's timestamp, so leaving the page and coming back resumes where it should be rather than restarting.

## How it's built

- **Next.js 16** App Router with TypeScript and Tailwind v4
- **shadcn/ui** on Radix, default style, `neutral` base color for the monochrome theme
- **Leaflet** and **react-leaflet** over OpenStreetMap raster tiles. Tiles are desaturated in CSS so item photos are the only color on screen.
- **Zustand** with the `persist` middleware for saved items, orders, and your own listings

There is no backend. The catalog in [src/lib/data/items.ts](src/lib/data/items.ts) is a static module of 24 seeded items scattered across real Raleigh neighborhoods, and everything you do on top of it is stored in `localStorage` under the `swapmeet` key. Clearing site data resets the demo.

### Layout of note

```
src/
  app/                     one folder per route
  components/
    map/
      canvas.tsx           the Leaflet components
      index.tsx            dynamic ssr:false wrappers
    app-shell.tsx          bottom tab bar on mobile, header nav on desktop
  lib/
    clock.ts               shared ticking clock as a React external store
    delivery.ts            route geometry and the delivery simulation
    filters.ts             search, filter, and sort logic
    geo.ts                 distances, fees, formatting
    store.ts               the persisted Zustand store
```

Leaflet touches `window` at import time, so every map is loaded through `next/dynamic` with `ssr: false`. Leaflet also assigns its panes z-indexes in the hundreds, which is why `.leaflet-container` gets `isolation: isolate` in `globals.css` — without it the map paints over the floating search bar and sticky headers.

Anything read from `localStorage` is gated behind `useHydrated()` so the server and client render the same markup on the first pass.

## Responsive behavior

Built mobile-first. On phones there's a five-tab bottom bar with Sell as the center action, full-bleed maps, thumb-height sticky action bars, and bottom sheets for filters. From the `md` breakpoint up the bottom bar becomes a header nav, grids widen to three and four columns, and at `lg` the map screen splits into a scrollable results panel beside a persistent map.

## Dev checks

```bash
npm run typecheck
npm run lint
npm run shots   # screenshots every screen at phone and desktop widths
npm run flow    # buys an item and samples the delivery tracking screen
```

The last two need Playwright's Chromium (`npx playwright install chromium`) and a dev server already running. They write PNGs to `.screenshots/`, which is gitignored. Set `BASE_URL` if your dev server isn't on port 3000, or `SCALE=2` for retina captures.

Both run in a few seconds each. `shots` walks the two viewports in parallel and caches OSM tiles across them; `flow` backdates the persisted order's `placedAt` to jump between courier stages rather than waiting out the 90-second simulation.

## Demo caveats

- No payments, accounts, or messaging. Checkout collects nothing.
- The listing form picks from a sample photo library instead of uploading files.
- Couriers are simulated. There's no courier-side app for accepting jobs.
- Item photos are generated images of representative vintage pieces, not real inventory.
