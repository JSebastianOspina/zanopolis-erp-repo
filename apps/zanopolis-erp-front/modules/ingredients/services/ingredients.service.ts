import { apiClient } from "@/infrastructure/api";
import type { ApiCollection, ApiSingle, PaginationParams } from "@/shared/types/api.types";
import type { IngredientAttributes } from "@/infrastructure/api/mocks/ingredients.mock";

export const ingredientsService = {
  list: (params?: PaginationParams) =>
    apiClient.get<ApiCollection<IngredientAttributes>>("/ingredients", params),

  getById: (id: string) =>
    apiClient.get<ApiSingle<IngredientAttributes>>(`/ingredients/${id}`),

  getLowStock: () =>
    apiClient.get<ApiCollection<IngredientAttributes>>("/ingredients/low-stock"),

  create: (data: Partial<IngredientAttributes>) =>
    apiClient.post<ApiSingle<IngredientAttributes>>("/ingredients", data),

  update: (id: string, data: Partial<IngredientAttributes>) =>
    apiClient.patch<ApiSingle<IngredientAttributes>>(`/ingredients/${id}`, data),

  delete: (id: string) => apiClient.delete<{ message: string }>(`/ingredients/${id}`),
};
