import { BaseModel } from '@/common/domain/models/base.model';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';
import Decimal from 'decimal.js';

export enum InventoryMovementType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  WASTE = 'WASTE',
}

export class InventoryMovementModel extends BaseModel {
  public readonly ingredientId: string;
  public readonly type: InventoryMovementType;
  public readonly quantity: Decimal;
  public readonly reason: string | null;
  public readonly referenceType: string | null;
  public readonly referenceId: string | null;

  private constructor(params: Partial<InventoryMovementModel>) {
    super({
      id: params.id,
      createdAt: params.createdAt,
    });
    this.ingredientId = params.ingredientId!;
    this.type = params.type!;
    this.quantity = params.quantity!;
    this.reason = params.reason ?? null;
    this.referenceType = params.referenceType ?? null;
    this.referenceId = params.referenceId ?? null;
  }

  static create(
    params: Partial<InventoryMovementModel>,
  ): InventoryMovementModel {
    if (!params.ingredientId) {
      throw new BadRequestException('Ingredient ID is required');
    }
    if (!params.type) {
      throw new BadRequestException('Movement type is required');
    }
    if (!params.quantity || new Decimal(params.quantity).lte(0)) {
      throw new BadRequestException('Quantity must be greater than zero');
    }
    return new InventoryMovementModel(params);
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
    return 'inventory-movement';
  }
}
