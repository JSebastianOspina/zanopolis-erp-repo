import { Module } from '@nestjs/common';
import { FinanceController } from './adapters/input/finance.controller';
import factoryProvider from '@/common/providers/factory-provider';
import { DatabaseModule } from '@/common/adapters/database/database.module';
import { FinancePrismaRepositoryAdapter } from './adapters/output/prisma/finance-prisma-repository.adapter';
import { FinanceService } from './application/finance.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    factoryProvider(
      'IFinanceRepository',
      FinancePrismaRepositoryAdapter,
      FinancePrismaRepositoryAdapter, 
    ),
    FinanceService,
  ],
  controllers: [FinanceController],
  exports: [FinanceService],
})
export class FinanceModule {}
