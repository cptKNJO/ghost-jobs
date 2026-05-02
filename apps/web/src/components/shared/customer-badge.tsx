import { Badge } from "@repo/ui/components/ui/badge";
import { cn } from "@repo/ui/lib/utils";

interface CustomerBadgeProps {
  plan: "human" | "robot";
  className?: string;
}

export function CustomerBadge({ plan, className }: CustomerBadgeProps) {
  const styles = {
    human:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    robot:
      "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
  };

  return (
    <Badge
      variant="outline"
      className={cn("px-2 py-0.5 font-semibold", styles[plan], className)}
    >
      I am {plan}
    </Badge>
  );
}
