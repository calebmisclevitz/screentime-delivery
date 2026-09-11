import { cn } from "@/lib/utils";

type PageContainerProps = React.HTMLAttributes<HTMLElement> & {
  as?: "div" | "form";
  width?: "wide" | "narrow";
};

/** Consistent centered page shell; children own their internal gutters. */
export function PageContainer({
  as: Comp = "div",
  width = "wide",
  className,
  ...props
}: PageContainerProps) {
  return (
    <Comp
      className={cn(
        "mx-auto w-full",
        width === "wide" ? "max-w-6xl" : "max-w-2xl",
        className,
      )}
      {...props}
    />
  );
}
