import { apiClient } from "@/infrastructure/api";
import type { ApiCollection, ApiSingle, PaginationParams } from "@/shared/types/api.types";
import type { RecipeAttributes } from "@/infrastructure/api/mocks/recipes.mock";

export const recipesService = {
  list: (params?: PaginationParams) =>
    apiClient.get<ApiCollection<RecipeAttributes>>("/recipes", params),

  getById: (id: string) =>
    apiClient.get<ApiSingle<RecipeAttributes>>(`/recipes/${id}`),

  create: (data: Partial<RecipeAttributes>) =>
    apiClient.post<ApiSingle<RecipeAttributes>>("/recipes", data),

  update: (id: string, data: Partial<RecipeAttributes>) =>
    apiClient.patch<ApiSingle<RecipeAttributes>>(`/recipes/${id}`, data),

  delete: (id: string) => apiClient.delete<{ message: string }>(`/recipes/${id}`),

  duplicate: (id: string) =>
    apiClient.post<ApiSingle<RecipeAttributes>>(`/recipes/${id}/duplicate`),

  recalculateCost: (id: string) =>
    apiClient.post<ApiSingle<RecipeAttributes>>(`/recipes/${id}/recalculate-cost`),
};
