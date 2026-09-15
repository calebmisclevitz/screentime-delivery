"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { STOCK_IMAGES } from "@/lib/data/items";
import { cn } from "@/lib/utils";

const FRAMES_PER_SECOND = 6;
const FRAME_MS = 1000 / FRAMES_PER_SECOND;
const REEL_LENGTH = 9;

/** How long the reel plays before a surface is allowed to reveal its map. */
export const MINIMUM_PLAY_MS = 1000;

/** An even spread of the source list, so consecutive cuts land on unlike objects. */
function reel(images: string[]) {
  if (images.length <= REEL_LENGTH) return images;
  const step = images.length / REEL_LENGTH;
  return Array.from(
    { length: REEL_LENGTH },
    (_, index) => images[Math.floor(index * step)],
  );
}

/** Skips frames whose image has not decoded yet, so no cut lands on a blank. */
function nextFrame(
  current: number,
  { frames, decoded }: { frames: string[]; decoded: ReadonlySet<string> },
) {
  for (let step = 1; step <= frames.length; step++) {
    const index = (current + step) % frames.length;
    if (decoded.has(frames[index])) return index;
  }
  return current;
}

/**
 * Loading state for a map surface: listing cutouts cut between each other six
 * times a second. Every frame is mounted so the browser decodes the reel up
 * front and a cut is only ever a visibility flip. Surfaces that go on to deal
 * their stickers out pass the same images they will pin to the map.
 */
export function MapLoader({
  images = STOCK_IMAGES,
  className,
}: {
  images?: string[];
  className?: string;
}) {
  const frames = useMemo(() => reel(images), [images]);
  const [decoded, setDecoded] = useState<ReadonlySet<string>>(new Set());
  const [frame, setFrame] = useState(-1);
  const reelRef = useRef({ frames, decoded });

  // A new reel can be shorter than the one the cut was counting through.
  const shown = frame < frames.length ? frame : -1;

  useEffect(() => {
    reelRef.current = { frames, decoded };
  }, [frames, decoded]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setFrame((current) => nextFrame(current, reelRef.current));
    }, FRAME_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center",
        className,
      )}
    >
      <span className="sr-only">Loading map</span>
      <div className="relative size-24">
        {frames.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="96px"
            priority={index === 0}
            onLoad={() => {
              setDecoded((current) => new Set(current).add(src));
              setFrame((current) => (current < 0 ? index : current));
            }}
            className={cn(
              "object-contain drop-shadow-md",
              index === shown ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>
    </div>
  );
}
