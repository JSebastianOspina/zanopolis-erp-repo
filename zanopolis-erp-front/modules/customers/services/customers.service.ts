import { apiClient } from "@/infrastructure/api";
import type { ApiCollection, ApiSingle, PaginationParams } from "@/shared/types/api.types";
import type { ClientAttributes } from "@/infrastructure/api/mocks/clients.mock";

export const customersService = {
  list: (params?: PaginationParams) =>
    apiClient.get<ApiCollection<ClientAttributes>>("/clients", params),

  getById: (id: string) =>
    apiClient.get<ApiSingle<ClientAttributes>>(`/clients/${id}`),

  create: (data: Partial<ClientAttributes>) =>
    apiClient.post<ApiSingle<ClientAttributes>>("/clients", data),

  update: (id: string, data: Partial<ClientAttributes>) =>
    apiClient.patch<ApiSingle<ClientAttributes>>(`/clients/${id}`, data),

  delete: (id: string) => apiClient.delete<{ message: string }>(`/clients/${id}`),
};
