import { apiClient } from "@/infrastructure/api";
import type { ApiSingle } from "@/shared/types/api.types";
import type {
  DailyFinanceSummary,
  MonthlyFinanceSummary,
} from "@/infrastructure/api/mocks/finance.mock";

export const financeService = {
  getDaily: (date: string) =>
    apiClient.get<ApiSingle<DailyFinanceSummary>>("/finance/daily", { date }),

  getMonthly: (year: number, month: number) =>
    apiClient.get<ApiSingle<MonthlyFinanceSummary>>("/finance/monthly", { year, month }),
};
