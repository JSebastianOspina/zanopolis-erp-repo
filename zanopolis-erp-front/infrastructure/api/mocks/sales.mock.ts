import type { ApiResource } from "@/shared/types/api.types";

export interface SaleItemAttributes {
  recipeId: string;
  recipeName?: string;
  quantity: number;
  customSalePrice: number;
  costSnapshot?: number;
  marginSnapshot?: number;
}

export interface SaleAttributes {
  clientId?: string;
  clientName?: string;
  paymentMethod: "CASH" | "TRANSFER";
  totalAmount: number;
  totalCost?: number;
  profit?: number;
  saleDate: string;
  items?: SaleItemAttributes[];
}

export const salesMock: ApiResource<SaleAttributes>[] = [
  {
    type: "sale",
    id: "sal-001",
    attributes: {
      clientId: "cli-001",
      clientName: "María González",
      paymentMethod: "TRANSFER",
      totalAmount: 90000,
      totalCost: 57000,
      profit: 33000,
      saleDate: "2026-05-18T11:30:00.000Z",
      items: [
        {
          recipeId: "rec-001",
          recipeName: "Torta de Chocolate",
          quantity: 2,
          customSalePrice: 45000,
          costSnapshot: 28500,
          marginSnapshot: 16500,
        },
      ],
    },
  },
  {
    type: "sale",
    id: "sal-002",
    attributes: {
      paymentMethod: "CASH",
      totalAmount: 48000,
      totalCost: 31200,
      profit: 16800,
      saleDate: "2026-05-18T09:15:00.000Z",
      items: [
        {
          recipeId: "rec-003",
          recipeName: "Cupcakes Vainilla",
          quantity: 6,
          customSalePrice: 8000,
          costSnapshot: 5200,
          marginSnapshot: 2800,
        },
      ],
    },
  },
];
