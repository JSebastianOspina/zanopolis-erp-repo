import { Inject, Injectable } from '@nestjs/common';
import { IFinanceRepository } from '../../../domain/output-ports/finance.repository.interface';
import { FinancialSummaryModel } from '../../../domain/financial-summary.model';
import { PrismaService } from '@/common/adapters/database/prisma.service';
import { FinancialMovementType } from '@prisma/client';
import Decimal from 'decimal.js';

@Injectable()
export class FinancePrismaRepositoryAdapter implements IFinanceRepository {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService,
  ) {}

  async getSummaryByDateRange(startDate: Date, endDate: Date): Promise<FinancialSummaryModel> {
    // 1. Get Financial Movements
    const movements = await this.prismaService.financialMovement.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    let totalIncome = new Decimal(0);
    let totalExpense = new Decimal(0);

    for (const mov of movements) {
      if (mov.type === FinancialMovementType.INCOME) {
        totalIncome = totalIncome.add(mov.amount);
      } else if (mov.type === FinancialMovementType.EXPENSE) {
        totalExpense = totalExpense.add(mov.amount);
      }
    }

    const grossProfit = totalIncome.minus(totalExpense);

    // 2. Calculate Net Profit using Sale snapshots
    const salesInPeriod = await this.prismaService.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: true,
      },
    });

    let totalProfitFromSales = new Decimal(0);
    for (const sale of salesInPeriod) {
      for (const item of sale.items) {
        totalProfitFromSales = totalProfitFromSales.add(
          new Decimal(item.unitProfitSnapshot).mul(item.quantity)
        );
      }
    }

    return FinancialSummaryModel.create({
      period: `${startDate.toISOString()} - ${endDate.toISOString()}`,
      totalIncome,
      totalExpense,
      grossProfit,
      netProfit: totalProfitFromSales,
    });
  }
}
