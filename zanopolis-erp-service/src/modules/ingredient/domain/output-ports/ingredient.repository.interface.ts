import { ICrudRepository } from '@/common/domain/interfaces/crud.repository.interface';
import { IngredientModel } from '../ingredient.model';

export interface IIngredientRepository extends ICrudRepository<
  IngredientModel,
  string
> {
  findLowStock(): Promise<IngredientModel[]>;
}
