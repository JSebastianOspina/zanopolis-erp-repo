import { BaseModel } from '@/common/domain/models/base.model';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';
import Decimal from 'decimal.js';

export enum ProductionOrderStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class ProductionOrderModel extends BaseModel {
  public readonly recipeId: string;
  public readonly quantity: Decimal;
  public status: ProductionOrderStatus;
  public scheduledDate: Date | null;
  public producedAt: Date | null;
  public notes: string | null;

  public totalProductionCostSnapshot: Decimal | null;
  public laborCostSnapshot: Decimal | null;
  public ingredientCostSnapshot: Decimal | null;

  private constructor(params: Partial<ProductionOrderModel>) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
    this.recipeId = params.recipeId!;
    this.quantity = params.quantity!;
    this.status = params.status ?? ProductionOrderStatus.PLANNED;
    this.scheduledDate = params.scheduledDate ?? null;
    this.producedAt = params.producedAt ?? null;
    this.notes = params.notes ?? null;
    this.totalProductionCostSnapshot = params.totalProductionCostSnapshot ?? null;
    this.laborCostSnapshot = params.laborCostSnapshot ?? null;
    this.ingredientCostSnapshot = params.ingredientCostSnapshot ?? null;
  }

  static create(params: Partial<ProductionOrderModel>): ProductionOrderModel {
    if (!params.recipeId) {
      throw new BadRequestException('Recipe ID is required');
    }
    if (!params.quantity || new Decimal(params.quantity).lte(0)) {
      throw new BadRequestException('Quantity must be greater than zero');
    }
    return new ProductionOrderModel(params);
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
    return 'production-order';
  }
}
