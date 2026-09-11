import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IconButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "size"
> & {
  "aria-label": string;
  icon: React.ElementType;
  size?: "default" | "compact";
  iconClassName?: string;
};

/**
 * A named icon-only control. The default preserves a 48px touch target around
 * a 24px icon; compact is reserved for controls embedded inside other fields.
 */
function IconButton({
  icon: Icon,
  size = "default",
  className,
  iconClassName,
  ...props
}: IconButtonProps) {
  return (
    <Button
      size={size === "default" ? "icon" : "icon-sm"}
      className={className}
      {...props}
    >
      <Icon
        aria-hidden
        className={cn(size === "default" ? "size-icon" : "size-4", iconClassName)}
      />
    </Button>
  );
}

export { IconButton };
