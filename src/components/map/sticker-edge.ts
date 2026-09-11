/**
 * Bakes the die-cut edge into a listing cutout once and hands back an image.
 *
 * As a CSS filter the ring is redrawn every frame a sticker moves or scales,
 * and the map carries a sticker per listing, so the cost lands on panning and
 * on the flight that deals them in. Painting it into a canvas up front leaves
 * the markers as plain images.
 */

/** Cutouts are drawn at 64px, so this covers three times that density. */
const RENDER_PX = 192;
const EDGE_PX = 6;
const EDGE_STEPS = 12;
/** Cutouts are cut with feathered alpha, so the rim needs stacking to go solid. */
const EDGE_PASSES = 3;

const OFFSETS = Array.from({ length: EDGE_STEPS }, (_, step) => {
  const angle = (step / EDGE_STEPS) * Math.PI * 2;
  return [Math.cos(angle) * EDGE_PX, Math.sin(angle) * EDGE_PX] as const;
});

const baked = new Map<string, string>();
const pending = new Map<string, Promise<string>>();

function edgeColor() {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--card")
      .trim() || "#ffffff"
  );
}

function load(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = src;
  });
}

async function bake(src: string, color: string) {
  const image = await load(src);
  const scale = Math.min(
    RENDER_PX / image.naturalWidth,
    RENDER_PX / image.naturalHeight,
    1,
  );
  const width = Math.round(image.naturalWidth * scale);
  const height = Math.round(image.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width + EDGE_PX * 2;
  canvas.height = height + EDGE_PX * 2;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("no 2d context");

  // The offset copies union into the dilated silhouette, which `source-in`
  // then floods with the edge color before the cutout goes back on top.
  for (let pass = 0; pass < EDGE_PASSES; pass++) {
    for (const [dx, dy] of OFFSETS) {
      context.drawImage(image, EDGE_PX + dx, EDGE_PX + dy, width, height);
    }
  }
  context.globalCompositeOperation = "source-in";
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = "source-over";
  context.drawImage(image, EDGE_PX, EDGE_PX, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("no sticker blob");
  return URL.createObjectURL(blob);
}

/**
 * The edged cutout when it is ready, otherwise the plain cutout now and the
 * edged one through `onReady`.
 */
export function stickerSource(src: string, onReady: (baked: string) => void) {
  const key = `${src}|${edgeColor()}`;
  const ready = baked.get(key);
  if (ready) return ready;

  let job = pending.get(key);
  if (!job) {
    job = bake(src, edgeColor())
      .then((url) => {
        baked.set(key, url);
        return url;
      })
      .catch(() => src);
    pending.set(key, job);
  }
  job.then(onReady);

  return src;
}
