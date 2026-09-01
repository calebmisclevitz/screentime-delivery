/**
 * Dev-only flow check: buys an item with delivery, then samples the tracking
 * screen at each stage of the simulated courier run.
 */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = ".screenshots";

/** Mirrors DELIVERY_DURATION_MS in src/lib/delivery.ts. */
const DELIVERY_DURATION_MS = 90_000;

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();
page.on("pageerror", (err) => console.error(`pageerror: ${err}`));
page.on("console", (msg) => {
  if (msg.type() === "error") console.error(`console: ${msg.text()}`);
});

/**
 * Progress is derived from `now - placedAt`, so backdating the persisted order
 * jumps the courier to any point in the run. Beats sleeping for real minutes.
 */
async function seekTo(progress) {
  await page.evaluate(
    ({ progress, duration }) => {
      const raw = localStorage.getItem("swapmeet");
      if (!raw) throw new Error("no persisted swapmeet state");
      const parsed = JSON.parse(raw);
      const order = parsed.state.orders[0];
      if (!order) throw new Error("no order to seek");
      order.placedAt = Date.now() - progress * duration;
      localStorage.setItem("swapmeet", JSON.stringify(parsed));
    },
    { progress, duration: DELIVERY_DURATION_MS },
  );
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(600);
}

async function capture(name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`${name}:`, await page.locator("h1").innerText());
}

await page.goto(`${BASE}/item/teak-credenza`, { waitUntil: "load" });
await page.getByRole("link", { name: "Buy now" }).click();
await page.waitForURL(/\/checkout\//);

await page.getByRole("button", { name: /Buy and request delivery/ }).click();
await page.waitForURL(/\/delivery\//);
console.log("landed on", new URL(page.url()).pathname);

await page.waitForTimeout(600);
await capture("delivery-early");

await seekTo(0.55);
await capture("delivery-mid");

await seekTo(1);
await capture("delivery-done");

await page.goto(`${BASE}/selling`, { waitUntil: "load" });
await page.getByRole("tab", { name: /Bought/ }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/selling-bought.png` });

await browser.close();
