import { Module } from '@nestjs/common';
import { SaleController } from './adapters/input/sale.controller';
import factoryProvider from '@/common/providers/factory-provider';
import { DatabaseModule } from '@/common/adapters/database/database.module';
import { SalePrismaRepositoryAdapter } from './adapters/output/prisma/sale-prisma-repository.adapter';
import { SaleService } from './application/sale.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    factoryProvider(
      'ISaleRepository',
      SalePrismaRepositoryAdapter,
      SalePrismaRepositoryAdapter, 
    ),
    SaleService,
  ],
  controllers: [SaleController],
  exports: [SaleService],
})
export class SaleModule {}
