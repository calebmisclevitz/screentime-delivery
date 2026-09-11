import { Badge } from "@/components/ui/badge";
import type { Condition } from "@/lib/types";

export function ConditionBadge({
  condition,
  className,
}: {
  condition: Condition;
  className?: string;
}) {
  return (
    <Badge variant="condition" className={className}>
      {condition}
    </Badge>
  );
}
