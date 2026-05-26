import { Inject, Injectable } from '@nestjs/common';
import type { IPurchaseService } from '../domain/input-ports/purchase.service.interface';
import type { IPurchaseRepository } from '../domain/output-ports/purchase.repository.interface';
import { PurchaseModel } from '../domain/purchase.model';
import {
  PaginatedResult,
  PaginationParams,
} from '@/common/domain/interfaces/crud.repository.interface';
import { NotFoundException } from '@/common/domain/exceptions/custom-exceptions/not-found-exception';
import type { IRecipeService } from '../../recipe/domain/input-ports/recipe.service.interface';

@Injectable()
export class PurchaseService implements IPurchaseService {
  constructor(
    @Inject('IPurchaseRepository')
    private purchaseRepository: IPurchaseRepository,
    @Inject('IRecipeService')
    private recipeService: IRecipeService,
  ) {}

  async get(id: string): Promise<PurchaseModel> {
    const result = await this.purchaseRepository.get(id);
    if (!result) throw new NotFoundException('Purchase not found', { id });
    return result;
  }

  async search(
    filter: any,
    paginationParams: PaginationParams,
    _userData: { userId: string },
  ): Promise<PaginatedResult<PurchaseModel>> {
    return this.purchaseRepository.search(filter, paginationParams);
  }

  async create(
    partialModel: Partial<PurchaseModel>,
    _userId: string,
  ): Promise<PurchaseModel> {
    const model = PurchaseModel.create(partialModel);
    // The repository adapter handles the transaction for updating stock and movements
    const purchase = await this.purchaseRepository.createWithTransaction(model);

    // After purchase transaction is committed, trigger recipe cost recalculation
    // Find ingredients affected by this purchase
    const affectedIngredientIds = purchase.items.map((i) => i.ingredientId);
    
    // Find recipes that use these ingredients
    const affectedRecipeIds =
      await this.recipeService.getRecipeIdsByIngredients(affectedIngredientIds);
      
    // Disparar recálculo fuera de la transacción para cada receta afectada
    for (const recipeId of affectedRecipeIds) {
      // Catch errors so one failed recalculation doesn't throw the whole process
      try {
        await this.recipeService.recalculateCost(recipeId);
      } catch (error) {
        console.error(`Failed to recalculate recipe ${recipeId}`, error);
      }
    }

    return purchase;
  }
}
