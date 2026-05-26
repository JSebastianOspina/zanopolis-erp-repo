import type { ApiResource } from "@/shared/types/api.types";

export interface ClientAttributes {
  name: string;
  phone?: string;
  address?: string;
  notes?: string;
  lastPurchaseDate?: string;
  totalPurchased?: number;
}

export const clientsMock: ApiResource<ClientAttributes>[] = [
  {
    type: "client",
    id: "cli-001",
    attributes: {
      name: "María González",
      phone: "+57 300 111 2233",
      address: "Calle 45 #12-34",
      notes: "Prefiere tortas sin nueces",
      lastPurchaseDate: "2026-05-17T10:00:00.000Z",
      totalPurchased: 285000,
    },
  },
  {
    type: "client",
    id: "cli-002",
    attributes: {
      name: "Pedro Ramírez",
      phone: "+57 310 444 5566",
      notes: "Cliente corporativo",
      lastPurchaseDate: "2026-05-14T15:30:00.000Z",
      totalPurchased: 520000,
    },
  },
  {
    type: "client",
    id: "cli-003",
    attributes: {
      name: "Ana Martínez",
      phone: "+57 320 777 8899",
      lastPurchaseDate: "2026-05-10T09:00:00.000Z",
      totalPurchased: 95000,
    },
  },
];
