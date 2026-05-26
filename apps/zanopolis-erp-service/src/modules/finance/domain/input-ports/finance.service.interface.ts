import { FinancialSummaryModel } from '../financial-summary.model';

export interface IFinanceService {
  getDailySummary(date: Date): Promise<FinancialSummaryModel>;
  getMonthlySummary(year: number, month: number): Promise<FinancialSummaryModel>;
}
