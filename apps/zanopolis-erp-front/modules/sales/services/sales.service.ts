import { apiClient } from "@/infrastructure/api";
import type { ApiCollection, ApiSingle, PaginationParams } from "@/shared/types/api.types";
import type { SaleAttributes } from "@/infrastructure/api/mocks/sales.mock";

export const salesService = {
  list: (params?: PaginationParams) =>
    apiClient.get<ApiCollection<SaleAttributes>>("/sales", params),

  getById: (id: string) => apiClient.get<ApiSingle<SaleAttributes>>(`/sales/${id}`),

  create: (
    data: {
      clientId?: string;
      paymentMethod: "CASH" | "TRANSFER";
      items: Array<{
        recipeId: string;
        quantity: number;
        customSalePrice: number;
        costSnapshot?: number;
      }>;
    },
    createProductionIfNeeded?: boolean
  ) =>
    apiClient.post<ApiSingle<SaleAttributes>>(
      "/sales",
      data,
      createProductionIfNeeded !== undefined
        ? { createProductionIfNeeded }
        : undefined
    ),

  delete: (id: string) => apiClient.delete<{ message: string }>(`/sales/${id}`),
};
