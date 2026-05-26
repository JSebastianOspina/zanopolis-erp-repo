import { BaseModel } from '@/common/domain/models/base.model';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';
import Decimal from 'decimal.js';

export class PurchaseItemModel extends BaseModel {
  public readonly purchaseId: string;
  public readonly ingredientId: string;
  public readonly quantity: Decimal;
  public readonly totalCost: Decimal;
  public readonly costPerUnit: Decimal;

  private constructor(params: Partial<PurchaseItemModel>) {
    super({
      id: params.id,
    });
    this.purchaseId = params.purchaseId!;
    this.ingredientId = params.ingredientId!;
    this.quantity = params.quantity!;
    this.totalCost = params.totalCost!;
    this.costPerUnit = params.costPerUnit!;
  }

  static create(params: Partial<PurchaseItemModel>): PurchaseItemModel {
    if (!params.ingredientId)
      throw new BadRequestException(
        'Ingredient ID is required for Purchase Item',
      );
    if (!params.quantity || new Decimal(params.quantity).lte(0))
      throw new BadRequestException('Valid quantity is required');
    if (!params.totalCost || new Decimal(params.totalCost).lte(0))
      throw new BadRequestException('Valid totalCost is required');

    // Automatically calculate costPerUnit if not provided
    const qty = new Decimal(params.quantity);
    const cost = new Decimal(params.totalCost);

    return new PurchaseItemModel({
      ...params,
      costPerUnit: params.costPerUnit ?? cost.dividedBy(qty),
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
    return 'purchase-item';
  }
}
