import type { ApiResource } from "@/shared/types/api.types";

export interface InventoryMovementAttributes {
  ingredientId: string;
  ingredientName?: string;
  type: "IN" | "OUT" | "WASTE" | "ADJUSTMENT";
  quantity: number;
  referenceType?: string;
  referenceId?: string;
  createdAt: string;
  notes?: string;
}

export const inventoryMovementsMock: ApiResource<InventoryMovementAttributes>[] = [
  {
    type: "inventory-movement",
    id: "mov-001",
    attributes: {
      ingredientId: "ing-001",
      ingredientName: "Harina de Trigo",
      type: "IN",
      quantity: 10,
      referenceType: "purchase",
      referenceId: "pur-001",
      createdAt: "2026-05-17T18:00:00.000Z",
    },
  },
  {
    type: "inventory-movement",
    id: "mov-002",
    attributes: {
      ingredientId: "ing-005",
      ingredientName: "Chocolate 70%",
      type: "OUT",
      quantity: 0.4,
      referenceType: "production-order",
      referenceId: "po-003",
      createdAt: "2026-05-16T10:30:00.000Z",
    },
  },
  {
    type: "inventory-movement",
    id: "mov-003",
    attributes: {
      ingredientId: "ing-003",
      ingredientName: "Mantequilla",
      type: "WASTE",
      quantity: 0.2,
      createdAt: "2026-05-15T16:00:00.000Z",
      notes: "Vencimiento",
    },
  },
];
