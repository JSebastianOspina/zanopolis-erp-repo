import { Module } from '@nestjs/common';
import { RecipeController } from './adapters/input/recipe.controller';
import factoryProvider from '@/common/providers/factory-provider';
import { DatabaseModule } from '@/common/adapters/database/database.module';
import { RecipePrismaRepositoryAdapter } from './adapters/output/prisma/recipe-prisma-repository.adapter';
import { RecipeService } from './application/recipe.service';
import { IngredientModule } from '../ingredient/ingredient.module';

class DummyMemoryRepository {}

@Module({
  imports: [DatabaseModule, IngredientModule],
  providers: [
    factoryProvider(
      'IRecipeRepository',
      RecipePrismaRepositoryAdapter,
      DummyMemoryRepository,
    ),
    RecipeService,
    {
      provide: 'IRecipeService',
      useExisting: RecipeService,
    },
  ],
  controllers: [RecipeController],
  exports: [RecipeService, 'IRecipeService'],
})
export class RecipeModule {}
