import { BaseModel } from '@/common/domain/models/base.model';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';
import Decimal from 'decimal.js';

export class ProductStockModel extends BaseModel {
  public readonly recipeId: string;
  public availableQuantity: Decimal;

  private constructor(params: Partial<ProductStockModel>) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
    this.recipeId = params.recipeId!;
    this.availableQuantity = params.availableQuantity ?? new Decimal(0);
  }

  static create(params: Partial<ProductStockModel>): ProductStockModel {
    if (!params.recipeId) {
      throw new BadRequestException('Recipe ID is required');
    }
    return new ProductStockModel(params);
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
    return 'product-stock';
  }
}
