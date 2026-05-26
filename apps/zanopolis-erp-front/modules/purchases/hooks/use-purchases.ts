"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { purchasesService, suppliersService } from "../services/purchases.service";

export function usePurchases() {
  return useQuery({
    queryKey: ["purchases"],
    queryFn: () => purchasesService.list(),
  });
}

export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: () => suppliersService.list(),
  });
}

export function useCreatePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: purchasesService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchases"] });
      qc.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
}
