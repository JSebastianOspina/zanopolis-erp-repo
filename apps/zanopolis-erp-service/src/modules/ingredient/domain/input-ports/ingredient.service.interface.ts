import {
  PaginatedResult,
  PaginationParams,
} from '@/common/domain/interfaces/crud.repository.interface';
import { IngredientModel } from '../ingredient.model';

export interface IIngredientService {
  get(id: string): Promise<IngredientModel>;
  search(
    filter: any,
    paginationParams: PaginationParams,
    userData: { userId: string },
  ): Promise<PaginatedResult<IngredientModel>>;
  create(
    partialModel: Partial<IngredientModel>,
    userId: string,
  ): Promise<IngredientModel>;
  update(
    id: string,
    updatedPartialModel: Partial<IngredientModel>,
  ): Promise<IngredientModel>;
  delete(id: string, userId: string): Promise<void>;

  getLowStockIngredients(): Promise<IngredientModel[]>;
}
