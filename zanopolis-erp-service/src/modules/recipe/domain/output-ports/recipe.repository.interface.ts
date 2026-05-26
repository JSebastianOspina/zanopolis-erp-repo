import { ICrudRepository } from '@/common/domain/interfaces/crud.repository.interface';
import { RecipeModel } from '../recipe.model';

export interface IRecipeRepository extends ICrudRepository<
  RecipeModel,
  string
> {
  createWithItems(model: Partial<RecipeModel>): Promise<RecipeModel>;
  updateCosts(
    id: string,
    productionCost: any,
    suggestedPrice: any,
  ): Promise<RecipeModel>;
  getRecipeIdsByIngredients(ingredientIds: string[]): Promise<string[]>;
}
