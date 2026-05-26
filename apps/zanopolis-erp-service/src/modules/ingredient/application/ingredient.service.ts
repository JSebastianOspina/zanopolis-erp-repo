import { Inject, Injectable } from '@nestjs/common';
import type { IIngredientService } from '../domain/input-ports/ingredient.service.interface';
import type { IIngredientRepository } from '../domain/output-ports/ingredient.repository.interface';
import { IngredientModel } from '../domain/ingredient.model';
import { CrudService } from '@/common/application/crud.service';

@Injectable()
export class IngredientService
  extends CrudService<IngredientModel, string>
  implements IIngredientService
{
  constructor(
    @Inject('IIngredientRepository')
    private ingredientRepository: IIngredientRepository,
  ) {
    super(ingredientRepository);
  }

  async create(
    partialModel: Partial<IngredientModel>,
    userId: string,
  ): Promise<IngredientModel> {
    const model = IngredientModel.create(partialModel);
    return super.create(model, userId);
  }

  async getLowStockIngredients(): Promise<IngredientModel[]> {
    return this.ingredientRepository.findLowStock();
  }
}
