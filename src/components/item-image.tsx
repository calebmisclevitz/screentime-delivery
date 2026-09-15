"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { cn } from "@/lib/utils";

/**
 * Listing photo that holds a spinner over its frame until the image has
 * decoded. Fills the nearest positioned ancestor, the same box the photo does.
 */
export function ItemImage({ alt, className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Image
        alt={alt}
        {...props}
        // A cached image can finish before hydration, which never fires onLoad.
        ref={(node) => {
          if (node?.complete) setLoaded(true);
        }}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        className={cn(className, !loaded && "opacity-0")}
      />
      {!loaded && (
        <ProgressIndicator
          label="Loading photo"
          className="absolute inset-0 m-auto size-6"
        />
      )}
    </>
  );
}
