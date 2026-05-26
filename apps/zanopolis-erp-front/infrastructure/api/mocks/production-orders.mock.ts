import type { ApiResource } from "@/shared/types/api.types";

export type ProductionStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface ProductionOrderAttributes {
  recipeId: string;
  recipeName?: string;
  quantity: number;
  scheduledDate?: string;
  notes?: string;
  status: ProductionStatus;
}

export const productionOrdersMock: ApiResource<ProductionOrderAttributes>[] = [
  {
    type: "production-order",
    id: "po-001",
    attributes: {
      recipeId: "rec-001",
      recipeName: "Torta de Chocolate",
      quantity: 2,
      scheduledDate: "2026-05-19T08:00:00.000Z",
      status: "PLANNED",
      notes: "Pedido especial fin de semana",
    },
  },
  {
    type: "production-order",
    id: "po-002",
    attributes: {
      recipeId: "rec-003",
      recipeName: "Cupcakes Vainilla",
      quantity: 24,
      scheduledDate: "2026-05-18T06:00:00.000Z",
      status: "IN_PROGRESS",
    },
  },
  {
    type: "production-order",
    id: "po-003",
    attributes: {
      recipeId: "rec-001",
      recipeName: "Torta de Chocolate",
      quantity: 1,
      scheduledDate: "2026-05-16T10:00:00.000Z",
      status: "COMPLETED",
    },
  },
];
