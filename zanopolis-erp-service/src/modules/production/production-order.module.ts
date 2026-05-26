import { Module } from '@nestjs/common';
import { ProductionOrderController } from './adapters/input/production-order.controller';
import factoryProvider from '@/common/providers/factory-provider';
import { DatabaseModule } from '@/common/adapters/database/database.module';
import { ProductionOrderPrismaRepositoryAdapter } from './adapters/output/prisma/production-order-prisma-repository.adapter';
import { ProductionOrderService } from './application/production-order.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    factoryProvider(
      'IProductionOrderRepository',
      ProductionOrderPrismaRepositoryAdapter,
      ProductionOrderPrismaRepositoryAdapter, // No memory mock implemented yet
    ),
    ProductionOrderService,
  ],
  controllers: [ProductionOrderController],
  exports: [ProductionOrderService],
})
export class ProductionOrderModule {}
