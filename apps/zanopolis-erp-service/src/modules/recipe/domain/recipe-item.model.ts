import { BaseModel } from '@/common/domain/models/base.model';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';
import Decimal from 'decimal.js';

export enum RecipeItemType {
  INGREDIENT = 'INGREDIENT',
  RECIPE = 'RECIPE',
}

export class RecipeItemModel extends BaseModel {
  public readonly recipeId: string;
  public readonly type: RecipeItemType;
  public readonly referenceId: string;
  public readonly quantity: Decimal;

  private constructor(params: Partial<RecipeItemModel>) {
    super({
      id: params.id,
    });
    this.recipeId = params.recipeId!;
    this.type = params.type!;
    this.referenceId = params.referenceId!;
    this.quantity = params.quantity!;
  }

  static create(params: Partial<RecipeItemModel>): RecipeItemModel {
    if (!params.type)
      throw new BadRequestException('RecipeItem type is required');
    if (!params.referenceId)
      throw new BadRequestException('RecipeItem referenceId is required');
    if (!params.quantity || new Decimal(params.quantity).lte(0)) {
      throw new BadRequestException('RecipeItem requires valid quantity > 0');
    }
    return new RecipeItemModel(params);
  }

  getRelationships(): string[] {
    return [];
  }

  getId(): string {
    return 'id';
  }

  getBlacklistedProperties(): string[] {
    return [];
  }

  getType(): string {
    return 'recipe-item';
  }
}
