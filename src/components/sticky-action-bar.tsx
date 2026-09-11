import { cn } from "@/lib/utils";

export function StickyActionBar({
  position = "fixed",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { position?: "fixed" | "static" }) {
  const isFixed = position === "fixed";

  return (
    <div
      data-slot="sticky-action-bar"
      className={cn(
        "pointer-events-none",
        isFixed
          ? "fixed inset-x-0 bottom-0 z-60 md:hidden"
          : "relative",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"
      />
      <div
        className={cn(
          "pointer-events-auto relative flex gap-4 px-4",
          isFixed
            ? "pb-[max(1rem,env(safe-area-inset-bottom))] pt-4"
            : "py-4",
        )}
      >
        {children}
      </div>
    </div>
  );
}
