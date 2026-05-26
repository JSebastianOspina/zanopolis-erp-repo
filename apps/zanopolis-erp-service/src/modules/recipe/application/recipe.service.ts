import { Inject, Injectable } from '@nestjs/common';
import type { IRecipeService } from '../domain/input-ports/recipe.service.interface';
import type { IRecipeRepository } from '../domain/output-ports/recipe.repository.interface';
import { RecipeModel } from '../domain/recipe.model';
import { RecipeItemType } from '@prisma/client';
import { RecipeItemModel } from '../domain/recipe-item.model';
import { CrudService } from '@/common/application/crud.service';
import Decimal from 'decimal.js';
import type { IIngredientRepository } from '@/modules/ingredient/domain/output-ports/ingredient.repository.interface';

@Injectable()
export class RecipeService
  extends CrudService<RecipeModel, string>
  implements IRecipeService
{
  constructor(
    @Inject('IRecipeRepository')
    private recipeRepository: IRecipeRepository,
    @Inject('IIngredientRepository')
    private ingredientRepository: IIngredientRepository,
  ) {
    super(recipeRepository);
  }

  async create(
    partialModel: Partial<RecipeModel>,
    _userId: string,
  ): Promise<RecipeModel> {
    const model = RecipeModel.create(partialModel);
    return this.recipeRepository.createWithItems(model);
  }

  async duplicate(id: string, _userId: string): Promise<RecipeModel> {
    const original = await this.get(id);
    const newModelParams: Partial<RecipeModel> = {
      name: `${original.name} (Copy)`,
      laborCost: original.laborCost,
      marginPercentage: original.marginPercentage,
      customSalePrice: original.customSalePrice,
      isActive: true,
      items: original.items.map(
        (item) =>
          ({
            ...item,
            id: undefined, // Let DB generate ID
            recipeId: undefined, // Re-assigned later
          }) as unknown as RecipeItemModel,
      ),
    };
    const newModel = RecipeModel.create(newModelParams);
    const duplicated = await this.recipeRepository.createWithItems(newModel);
    return this.recalculateCost(duplicated.id!);
  }

  async recalculateCost(id: string): Promise<RecipeModel> {
    const recipe = await this.get(id);
    let totalCost = new Decimal(recipe.laborCost);

    for (const item of recipe.items) {
      if ((item.type as string) === (RecipeItemType.INGREDIENT as string)) {
        const ingredient = await this.ingredientRepository.get(
          item.referenceId,
        );
        if (ingredient) {
          totalCost = totalCost.add(
            new Decimal(ingredient.averageCostPerUnit).mul(
              new Decimal(item.quantity),
            ),
          );
        }
      } else if ((item.type as string) === (RecipeItemType.RECIPE as string)) {
        // Recursively recalculate sub-recipe
        const subRecipe = await this.recalculateCost(item.referenceId);
        totalCost = totalCost.add(
          new Decimal(subRecipe.currentProductionCost).mul(
            new Decimal(item.quantity),
          ),
        );
      }
    }

    const marginMultiplier = new Decimal(1).add(
      new Decimal(recipe.marginPercentage).dividedBy(100),
    );
    const suggestedPrice = totalCost.mul(marginMultiplier);

    return this.recipeRepository.updateCosts(id, totalCost, suggestedPrice);
  }

  async getRecipeIdsByIngredients(ingredientIds: string[]): Promise<string[]> {
    return this.recipeRepository.getRecipeIdsByIngredients(ingredientIds);
  }
}
