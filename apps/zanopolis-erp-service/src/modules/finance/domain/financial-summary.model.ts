import { BaseModel } from '@/common/domain/models/base.model';
import Decimal from 'decimal.js';

export class FinancialSummaryModel extends BaseModel {
  public period: string;
  public totalIncome: Decimal;
  public totalExpense: Decimal;
  public grossProfit: Decimal; // Income - Expense
  public netProfit: Decimal; // Calculated using Sale snapshots (Income - true production cost of goods sold)

  private constructor(params: Partial<FinancialSummaryModel>) {
    super({
      id: params.id || 'summary-id',
      createdAt: params.createdAt || new Date(),
      updatedAt: params.updatedAt || new Date(),
    });
    this.period = params.period!;
    this.totalIncome = params.totalIncome!;
    this.totalExpense = params.totalExpense!;
    this.grossProfit = params.grossProfit!;
    this.netProfit = params.netProfit!;
  }

  static create(params: Partial<FinancialSummaryModel>): FinancialSummaryModel {
    return new FinancialSummaryModel(params);
  }

  getRelationships(): string[] {
    return [];
  }

  getId(): string {
    return 'id';
  }

  getBlacklistedProperties(): string[] {
    return [];
  }

  getType(): string {
    return 'financial-summary';
  }
}
