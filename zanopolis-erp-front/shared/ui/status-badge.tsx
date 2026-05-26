import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusVariant =
  | "critical"
  | "low"
  | "ok"
  | "planned"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "default";

const variantConfig: Record<
  StatusVariant,
  { label: string; className: string }
> = {
  critical: {
    label: "Crítico",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  low: {
    label: "Bajo",
    className: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
  },
  ok: {
    label: "OK",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
  },
  planned: {
    label: "Pendiente",
    className: "bg-muted text-muted-foreground",
  },
  in_progress: {
    label: "En proceso",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  completed: {
    label: "Completada",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
  },
  cancelled: {
    label: "Cancelada",
    className: "bg-muted text-muted-foreground line-through",
  },
  default: { label: "", className: "" },
};

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;
  className?: string;
}

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  const config = variantConfig[variant];
  return (
    <Badge variant="outline" className={cn("font-medium", config.className, className)}>
      {label ?? config.label}
    </Badge>
  );
}

export function getStockStatus(
  current: number,
  minimum: number
): StatusVariant {
  if (current <= 0 || current <= minimum * 0.5) return "critical";
  if (current <= minimum) return "low";
  return "ok";
}
