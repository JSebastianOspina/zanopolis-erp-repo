import { BaseModel } from '@/common/domain/models/base.model';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';
import Decimal from 'decimal.js';

export class SaleItemModel extends BaseModel {
  public readonly saleId: string;
  public readonly recipeId: string;
  public readonly quantity: Decimal;
  public readonly customSalePrice: Decimal;
  public readonly unitProductionCostSnapshot: Decimal;
  public readonly unitProfitSnapshot: Decimal;

  private constructor(params: Partial<SaleItemModel>) {
    super({
      id: params.id,
    });
    this.saleId = params.saleId!;
    this.recipeId = params.recipeId!;
    this.quantity = params.quantity!;
    this.customSalePrice = params.customSalePrice!;
    this.unitProductionCostSnapshot = params.unitProductionCostSnapshot!;
    this.unitProfitSnapshot = params.unitProfitSnapshot!;
  }

  static create(params: Partial<SaleItemModel>): SaleItemModel {
    if (!params.recipeId) {
      throw new BadRequestException('Recipe ID is required');
    }
    if (!params.quantity || new Decimal(params.quantity).lte(0)) {
      throw new BadRequestException('Quantity must be greater than zero');
    }
    if (!params.customSalePrice || new Decimal(params.customSalePrice).lt(0)) {
      throw new BadRequestException('Custom sale price must be positive');
    }

    // Automatically calculate unitProfitSnapshot if not provided
    const salePrice = new Decimal(params.customSalePrice);
    const prodCost = new Decimal(params.unitProductionCostSnapshot ?? 0);

    return new SaleItemModel({
      ...params,
      unitProfitSnapshot:
        params.unitProfitSnapshot ?? salePrice.minus(prodCost),
    });
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
    return 'sale-item';
  }
}
