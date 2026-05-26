import { apiClient } from "@/infrastructure/api";
import type { ApiCollection, ApiSingle, PaginationParams } from "@/shared/types/api.types";
import type { PurchaseAttributes } from "@/infrastructure/api/mocks/purchases.mock";
import type { SupplierAttributes } from "@/infrastructure/api/mocks/suppliers.mock";

export const purchasesService = {
  list: (params?: PaginationParams) =>
    apiClient.get<ApiCollection<PurchaseAttributes>>("/purchases", params),

  getById: (id: string) =>
    apiClient.get<ApiSingle<PurchaseAttributes>>(`/purchases/${id}`),

  create: (data: {
    supplierId: string;
    paymentMethod: "CASH" | "TRANSFER";
    items: Array<{ ingredientId: string; quantity: number; totalCost: number }>;
  }) => apiClient.post<ApiSingle<PurchaseAttributes>>("/purchases", data),
};

export const suppliersService = {
  list: (params?: PaginationParams) =>
    apiClient.get<ApiCollection<SupplierAttributes>>("/suppliers", params),

  getById: (id: string) =>
    apiClient.get<ApiSingle<SupplierAttributes>>(`/suppliers/${id}`),

  create: (data: Partial<SupplierAttributes>) =>
    apiClient.post<ApiSingle<SupplierAttributes>>("/suppliers", data),
};
