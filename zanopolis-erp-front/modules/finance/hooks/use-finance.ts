"use client";

import { useQuery } from "@tanstack/react-query";
import { financeService } from "../services/finance.service";

export function useDailyFinance(date: string) {
  return useQuery({
    queryKey: ["finance", "daily", date],
    queryFn: () => financeService.getDaily(date),
  });
}

export function useMonthlyFinance(year: number, month: number) {
  return useQuery({
    queryKey: ["finance", "monthly", year, month],
    queryFn: () => financeService.getMonthly(year, month),
  });
}
