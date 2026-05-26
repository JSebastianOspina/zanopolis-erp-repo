import { BaseModel } from '@/common/domain/models/base.model';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';
import Decimal from 'decimal.js';
import { PurchaseItemModel } from './purchase-item.model';

export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
}

export class PurchaseModel extends BaseModel {
  public readonly supplierId: string;
  public readonly paymentMethod: PaymentMethod;
  public readonly total: Decimal;
  public readonly purchasedAt: Date;
  public readonly items: PurchaseItemModel[];

  private constructor(params: Partial<PurchaseModel>) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
    this.supplierId = params.supplierId!;
    this.paymentMethod = params.paymentMethod!;
    this.total = params.total ?? new Decimal(0);
    this.purchasedAt = params.purchasedAt ?? new Date();
    this.items = params.items ?? [];
  }

  static create(params: Partial<PurchaseModel>): PurchaseModel {
    if (!params.supplierId) {
      throw new BadRequestException('Supplier ID is required');
    }
    if (!params.items || params.items.length === 0) {
      throw new BadRequestException('Purchase must have at least one item');
    }
    return new PurchaseModel(params);
  }

  getRelationships(): string[] {
    return ['items'];
  }

  getId(): string {
    return 'id';
  }

  getBlacklistedProperties(): string[] {
    return [];
  }

  getType(): string {
    return 'purchase';
  }
}
