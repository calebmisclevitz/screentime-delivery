import * as React from "react";
import { Slot } from "radix-ui";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IconButtonProps = Omit<React.ComponentProps<typeof Button>, "size"> & {
  "aria-label": string;
  icon: React.ElementType;
  size?: "default" | "compact";
  iconClassName?: string;
};

/**
 * A named icon-only control. Default is a 48px target around a 24px icon;
 * compact is a 32px target around a 16px icon. Pass `asChild` with a single
 * element child (such as a `Link`) to render the icon inside that element.
 */
function IconButton({
  icon: Icon,
  size = "default",
  className,
  iconClassName,
  children,
  ...props
}: IconButtonProps) {
  return (
    <Button
      size={size === "default" ? "icon" : "icon-compact"}
      className={className}
      {...props}
    >
      <Slot.Slottable>{children}</Slot.Slottable>
      <Icon
        aria-hidden
        className={cn(size === "default" ? "size-icon" : "size-4", iconClassName)}
      />
    </Button>
  );
}

export { IconButton };
