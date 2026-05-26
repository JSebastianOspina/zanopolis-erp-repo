import { apiClient } from "@/infrastructure/api";
import type { ApiCollection, ApiSingle, PaginationParams } from "@/shared/types/api.types";
import type { ProductionOrderAttributes } from "@/infrastructure/api/mocks/production-orders.mock";

export const productionService = {
  list: (params?: PaginationParams) =>
    apiClient.get<ApiCollection<ProductionOrderAttributes>>("/production-orders", params),

  getUpcoming: () =>
    apiClient.get<ApiCollection<ProductionOrderAttributes>>("/production-orders/upcoming"),

  getById: (id: string) =>
    apiClient.get<ApiSingle<ProductionOrderAttributes>>(`/production-orders/${id}`),

  create: (data: {
    recipeId: string;
    quantity: number;
    scheduledDate?: string;
    notes?: string;
  }) =>
    apiClient.post<ApiSingle<ProductionOrderAttributes>>("/production-orders", data),

  update: (id: string, data: Partial<ProductionOrderAttributes>) =>
    apiClient.patch<ApiSingle<ProductionOrderAttributes>>(`/production-orders/${id}`, data),

  complete: (id: string) =>
    apiClient.post<ApiSingle<ProductionOrderAttributes>>(`/production-orders/${id}/complete`),

  delete: (id: string) =>
    apiClient.delete<{ message: string }>(`/production-orders/${id}`),
};
