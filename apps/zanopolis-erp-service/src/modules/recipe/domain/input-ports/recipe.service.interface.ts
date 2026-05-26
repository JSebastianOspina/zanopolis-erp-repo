import {
  PaginatedResult,
  PaginationParams,
} from '@/common/domain/interfaces/crud.repository.interface';
import { RecipeModel } from '../recipe.model';

export interface IRecipeService {
  get(id: string): Promise<RecipeModel>;
  search(
    filter: any,
    paginationParams: PaginationParams,
    userData: { userId: string },
  ): Promise<PaginatedResult<RecipeModel>>;
  create(
    partialModel: Partial<RecipeModel>,
    userId: string,
  ): Promise<RecipeModel>;
  update(
    id: string,
    updatedPartialModel: Partial<RecipeModel>,
  ): Promise<RecipeModel>;
  delete(id: string, userId: string): Promise<void>;

  duplicate(id: string, userId: string): Promise<RecipeModel>;
  recalculateCost(id: string): Promise<RecipeModel>;
  getRecipeIdsByIngredients(ingredientIds: string[]): Promise<string[]>;
}
