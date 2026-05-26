"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { salesService } from "../services/sales.service";

export function useSales() {
  return useQuery({
    queryKey: ["sales"],
    queryFn: () => salesService.list(),
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
      createProductionIfNeeded,
    }: {
      data: Parameters<typeof salesService.create>[0];
      createProductionIfNeeded?: boolean;
    }) => salesService.create(data, createProductionIfNeeded),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["recipes"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
