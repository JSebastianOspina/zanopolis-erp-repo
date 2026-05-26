"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";
import { formatDateTime } from "@/shared/utils/format";
import type { ApiResource } from "@/shared/types/api.types";
import type {
  ProductionOrderAttributes,
  ProductionStatus,
} from "@/infrastructure/api/mocks/production-orders.mock";
import {
  useCompleteProductionOrder,
  useUpdateProductionOrder,
} from "../hooks/use-production";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { Check, Play } from "lucide-react";

const columns: { status: ProductionStatus; label: string }[] = [
  { status: "PLANNED", label: "Pendiente" },
  { status: "IN_PROGRESS", label: "En proceso" },
  { status: "COMPLETED", label: "Completada" },
  { status: "CANCELLED", label: "Cancelada" },
];

function statusVariant(status: ProductionStatus) {
  const map = {
    PLANNED: "planned" as const,
    IN_PROGRESS: "in_progress" as const,
    COMPLETED: "completed" as const,
    CANCELLED: "cancelled" as const,
  };
  return map[status];
}

interface ProductionQueueProps {
  orders: ApiResource<ProductionOrderAttributes>[];
}

export function ProductionQueue({ orders }: ProductionQueueProps) {
  const updateOrder = useUpdateProductionOrder();
  const completeOrder = useCompleteProductionOrder();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
  <>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((col) => {
        const items = orders.filter((o) => o.attributes.status === col.status);
        return (
          <Card key={col.status} className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between font-heading text-sm">
                {col.label}
                <span className="text-xs font-normal text-muted-foreground">
                  {items.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border bg-card p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{order.attributes.recipeName}</p>
                    <StatusBadge variant={statusVariant(order.attributes.status)} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {order.attributes.quantity} unidades
                    {order.attributes.scheduledDate &&
                      ` · ${formatDateTime(order.attributes.scheduledDate)}`}
                  </p>
                  <div className="flex gap-1">
                    {order.attributes.status === "PLANNED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() =>
                          updateOrder.mutate({
                            id: order.id,
                            data: { status: "IN_PROGRESS" },
                          })
                        }
                      >
                        <Play className="mr-1 size-3" />
                        Iniciar
                      </Button>
                    )}
                    {order.attributes.status === "IN_PROGRESS" && (
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setConfirmId(order.id)}
                      >
                        <Check className="mr-1 size-3" />
                        Completar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>

    <ConfirmDialog
      open={!!confirmId}
      onOpenChange={() => setConfirmId(null)}
      title="Completar producción"
      description="Se descontará inventario de ingredientes y se generará producto terminado. ¿Confirmar?"
      onConfirm={() => {
        if (confirmId) {
          completeOrder.mutate(confirmId);
          setConfirmId(null);
        }
      }}
    />
  </>
  );
}
