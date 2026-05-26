"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recipesService } from "../services/recipes.service";
import type { RecipeAttributes } from "@/infrastructure/api/mocks/recipes.mock";

export function useRecipes(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["recipes", params],
    queryFn: () => recipesService.list(params),
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: () => recipesService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RecipeAttributes> }) =>
      recipesService.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
      qc.invalidateQueries({ queryKey: ["recipes", id] });
    },
  });
}

export function useDuplicateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recipesService.duplicate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes"] }),
  });
}
