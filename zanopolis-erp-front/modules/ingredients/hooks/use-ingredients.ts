"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ingredientsService } from "../services/ingredients.service";
import type { IngredientAttributes } from "@/infrastructure/api/mocks/ingredients.mock";

export function useIngredients(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["ingredients", params],
    queryFn: () => ingredientsService.list(params),
  });
}

export function useIngredient(id: string) {
  return useQuery({
    queryKey: ["ingredients", id],
    queryFn: () => ingredientsService.getById(id),
    enabled: !!id,
  });
}

export function useLowStockIngredients() {
  return useQuery({
    queryKey: ["ingredients", "low-stock"],
    queryFn: () => ingredientsService.getLowStock(),
  });
}

export function useCreateIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<IngredientAttributes>) => ingredientsService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ingredients"] }),
  });
}

export function useUpdateIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IngredientAttributes> }) =>
      ingredientsService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ingredients"] }),
  });
}
