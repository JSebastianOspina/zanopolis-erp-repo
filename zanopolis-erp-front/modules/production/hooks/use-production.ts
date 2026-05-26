"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productionService } from "../services/production.service";
import type { ProductionOrderAttributes } from "@/infrastructure/api/mocks/production-orders.mock";

export function useProductionOrders() {
  return useQuery({
    queryKey: ["production-orders"],
    queryFn: () => productionService.list(),
  });
}

export function useUpcomingProduction() {
  return useQuery({
    queryKey: ["production-orders", "upcoming"],
    queryFn: () => productionService.getUpcoming(),
  });
}

export function useCreateProductionOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productionService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["production-orders"] }),
  });
}

export function useUpdateProductionOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductionOrderAttributes> }) =>
      productionService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["production-orders"] }),
  });
}

export function useCompleteProductionOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productionService.complete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["production-orders"] });
      qc.invalidateQueries({ queryKey: ["ingredients"] });
      qc.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}
