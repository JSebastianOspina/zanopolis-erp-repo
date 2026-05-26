import { Inject, Injectable } from '@nestjs/common';
import { IFinanceService } from '../domain/input-ports/finance.service.interface';
import { IFinanceRepository } from '../domain/output-ports/finance.repository.interface';
import { FinancialSummaryModel } from '../domain/financial-summary.model';
import * as dayjs from 'dayjs';

@Injectable()
export class FinanceService implements IFinanceService {
  constructor(
    @Inject('IFinanceRepository')
    private financeRepository: IFinanceRepository,
  ) {}

  async getDailySummary(date: Date): Promise<FinancialSummaryModel> {
    const startDate = dayjs(date).startOf('day').toDate();
    const endDate = dayjs(date).endOf('day').toDate();
    return this.financeRepository.getSummaryByDateRange(startDate, endDate);
  }

  async getMonthlySummary(year: number, month: number): Promise<FinancialSummaryModel> {
    const startDate = dayjs().year(year).month(month - 1).startOf('month').toDate();
    const endDate = dayjs().year(year).month(month - 1).endOf('month').toDate();
    return this.financeRepository.getSummaryByDateRange(startDate, endDate);
  }
}
