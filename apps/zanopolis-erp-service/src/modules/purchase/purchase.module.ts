import { Module } from '@nestjs/common';
import { PurchaseController } from './adapters/input/purchase.controller';
import factoryProvider from '@/common/providers/factory-provider';
import { DatabaseModule } from '@/common/adapters/database/database.module';
import { PurchasePrismaRepositoryAdapter } from './adapters/output/prisma/purchase-prisma-repository.adapter';
import { PurchaseService } from './application/purchase.service';
import { RecipeModule } from '../recipe/recipe.module';

class DummyMemoryRepository {}

@Module({
  imports: [DatabaseModule, RecipeModule],
  providers: [
    factoryProvider(
      'IPurchaseRepository',
      PurchasePrismaRepositoryAdapter,
      DummyMemoryRepository,
    ),
    PurchaseService,
  ],
  controllers: [PurchaseController],
  exports: [PurchaseService],
})
export class PurchaseModule {}
