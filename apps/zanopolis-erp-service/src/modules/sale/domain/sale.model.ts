import { BaseModel } from '@/common/domain/models/base.model';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';
import Decimal from 'decimal.js';
import { SaleItemModel } from './sale-item.model';

export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
}

export class SaleModel extends BaseModel {
  public readonly clientId: string | null;
  public readonly paymentMethod: PaymentMethod;
  public readonly total: Decimal;
  public items: SaleItemModel[];

  private constructor(params: Partial<SaleModel>) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
    this.clientId = params.clientId ?? null;
    this.paymentMethod = params.paymentMethod!;
    this.total = params.total ?? new Decimal(0);
    this.items = params.items ?? [];
  }

  static create(params: Partial<SaleModel>): SaleModel {
    if (!params.paymentMethod) {
      throw new BadRequestException('Payment method is required');
    }
    return new SaleModel(params);
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
    return 'sale';
  }
}
