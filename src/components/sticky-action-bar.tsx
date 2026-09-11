import { cn } from "@/lib/utils";

export function StickyActionBar({
  position = "fixed",
  className,
  ...props
}: React.ComponentProps<"div"> & { position?: "fixed" | "static" }) {
  return (
    <div
      data-slot="sticky-action-bar"
      className={cn(
        "flex gap-4 border-t bg-background/95 p-4 backdrop-blur",
        position === "fixed"
          ? "fixed inset-x-0 bottom-0 z-60 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden"
          : "relative",
        className,
      )}
      {...props}
    />
  );
}
