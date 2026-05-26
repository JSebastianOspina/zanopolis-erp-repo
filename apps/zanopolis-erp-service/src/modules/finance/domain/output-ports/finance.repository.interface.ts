import { FinancialSummaryModel } from '../financial-summary.model';

export interface IFinanceRepository {
  getSummaryByDateRange(startDate: Date, endDate: Date): Promise<FinancialSummaryModel>;
}
