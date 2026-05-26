import type { ApiResource } from "@/shared/types/api.types";

export interface PurchaseAttributes {
  supplierId: string;
  paymentMethod: "CASH" | "TRANSFER";
  totalCost: number;
  purchaseDate: string;
  items?: Array<{
    ingredientId: string;
    quantity: number;
    totalCost: number;
  }>;
}

export const purchasesMock: ApiResource<PurchaseAttributes>[] = [
  {
    type: "purchase",
    id: "pur-001",
    attributes: {
      supplierId: "sup-001",
      paymentMethod: "TRANSFER",
      totalCost: 170000,
      purchaseDate: "2026-05-17T18:00:00.000Z",
      items: [
        { ingredientId: "ing-001", quantity: 10, totalCost: 55000 },
        { ingredientId: "ing-002", quantity: 5, totalCost: 21000 },
      ],
    },
  },
  {
    type: "purchase",
    id: "pur-002",
    attributes: {
      supplierId: "sup-002",
      paymentMethod: "CASH",
      totalCost: 96000,
      purchaseDate: "2026-05-15T14:30:00.000Z",
      items: [{ ingredientId: "ing-005", quantity: 3, totalCost: 96000 }],
    },
  },
];
