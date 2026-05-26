import { BaseModel } from '@/common/domain/models/base.model';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';
import Decimal from 'decimal.js';

export enum FinancialMovementType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
}

export class FinancialMovementModel extends BaseModel {
  public readonly type: FinancialMovementType;
  public readonly category: string;
  public readonly amount: Decimal;
  public readonly paymentMethod: PaymentMethod;
  public readonly referenceType: string | null;
  public readonly referenceId: string | null;

  private constructor(params: Partial<FinancialMovementModel>) {
    super({
      id: params.id,
      createdAt: params.createdAt,
    });
    this.type = params.type!;
    this.category = params.category!;
    this.amount = params.amount!;
    this.paymentMethod = params.paymentMethod!;
    this.referenceType = params.referenceType ?? null;
    this.referenceId = params.referenceId ?? null;
  }

  static create(
    params: Partial<FinancialMovementModel>,
  ): FinancialMovementModel {
    if (!params.type) {
      throw new BadRequestException('Movement type is required');
    }
    if (!params.category) {
      throw new BadRequestException('Category is required');
    }
    if (!params.amount || new Decimal(params.amount).lte(0)) {
      throw new BadRequestException('Amount must be greater than zero');
    }
    if (!params.paymentMethod) {
      throw new BadRequestException('Payment method is required');
    }
    return new FinancialMovementModel(params);
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
    return 'financial-movement';
  }
}
