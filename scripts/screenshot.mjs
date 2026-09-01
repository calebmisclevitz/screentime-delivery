/**
 * Dev-only visual check: walks the main screens at phone and desktop widths
 * and writes PNGs to .screenshots/ for review.
 */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = ".screenshots";
const SCALE = Number(process.env.SCALE ?? 1);

const SHOTS = [
  { name: "map", path: "/" },
  { name: "browse", path: "/browse" },
  { name: "search", path: "/search" },
  { name: "item", path: "/item/rhodes-mark-i" },
  { name: "checkout", path: "/checkout/rhodes-mark-i" },
  { name: "saved", path: "/saved" },
  { name: "sell", path: "/sell" },
  { name: "selling", path: "/selling" },
];

const VIEWPORTS = [
  { label: "phone", width: 390, height: 844 },
  { label: "desktop", width: 1440, height: 900 },
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

/**
 * OSM tiles are the slowest thing on the page and every context refetches the
 * same ones. Serving repeats from memory keeps the map looking real without
 * paying for the round trip twice.
 */
const tileCache = new Map();

async function cacheTiles(context) {
  await context.route("**://*.tile.openstreetmap.org/**", async (route) => {
    const url = route.request().url();
    const hit = tileCache.get(url);
    if (hit) return route.fulfill(hit);
    try {
      const res = await route.fetch();
      const body = await res.body();
      const entry = { status: res.status(), headers: res.headers(), body };
      tileCache.set(url, entry);
      await route.fulfill(entry);
    } catch {
      await route.abort();
    }
  });
}

/** Bounded settle: never block a shot for more than a beat on a slow tile. */
async function settle(page) {
  await page.waitForLoadState("networkidle", { timeout: 2500 }).catch(() => {});
  const map = page.locator(".leaflet-container");
  if (await map.count()) {
    await page
      .waitForFunction(
        () => document.querySelectorAll(".leaflet-tile-loaded").length > 0,
        undefined,
        { timeout: 2500 },
      )
      .catch(() => {});
  }
  await page.waitForTimeout(250);
}

async function run(viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: SCALE,
  });
  await cacheTiles(context);
  const page = await context.newPage();
  page.on("pageerror", (err) => console.error(`[${viewport.label}] ${err}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.error(`[console] ${msg.text()}`);
  });

  for (const shot of SHOTS) {
    await page.goto(`${BASE}${shot.path}`, { waitUntil: "load" });
    await settle(page);
    await page.screenshot({ path: `${OUT}/${shot.name}-${viewport.label}.png` });
    console.log(`captured ${shot.name}-${viewport.label}`);
  }

  await context.close();
}

const started = Date.now();
await Promise.all(VIEWPORTS.map(run));
console.log(`done in ${((Date.now() - started) / 1000).toFixed(1)}s`);

await browser.close();
