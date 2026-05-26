import type { ApiResource } from "@/shared/types/api.types";

export interface SupplierAttributes {
  name: string;
  phone?: string;
  notes?: string;
}

export const suppliersMock: ApiResource<SupplierAttributes>[] = [
  {
    type: "supplier",
    id: "sup-001",
    attributes: {
      name: "Distribuidora Panadera S.A.",
      phone: "+57 300 123 4567",
      notes: "Entrega los lunes y jueves",
    },
  },
  {
    type: "supplier",
    id: "sup-002",
    attributes: {
      name: "Chocolates del Valle",
      phone: "+57 310 987 6543",
      notes: "Especialista en cacao",
    },
  },
];
