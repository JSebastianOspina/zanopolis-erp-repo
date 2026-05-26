import { Module } from '@nestjs/common';
import { IngredientController } from './adapters/input/ingredient.controller';
import factoryProvider from '@/common/providers/factory-provider';
import { DatabaseModule } from '@/common/adapters/database/database.module';
import { IngredientPrismaRepositoryAdapter } from './adapters/output/prisma/ingredient-prisma-repository.adapter';
import { IngredientService } from './application/ingredient.service';

class DummyMemoryRepository {}

@Module({
  imports: [DatabaseModule],
  providers: [
    factoryProvider(
      'IIngredientRepository',
      IngredientPrismaRepositoryAdapter,
      DummyMemoryRepository,
    ),
    IngredientService,
  ],
  controllers: [IngredientController],
  exports: [IngredientService, 'IIngredientRepository'],
})
export class IngredientModule {}
