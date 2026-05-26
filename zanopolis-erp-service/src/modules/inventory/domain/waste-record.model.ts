import { BaseModel } from '@/common/domain/models/base.model';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';
import Decimal from 'decimal.js';

export class WasteRecordModel extends BaseModel {
  public readonly referenceType: string;
  public readonly referenceId: string;
  public readonly quantity: Decimal;
  public readonly notes: string | null;

  private constructor(params: Partial<WasteRecordModel>) {
    super({
      id: params.id,
      createdAt: params.createdAt,
    });
    this.referenceType = params.referenceType!;
    this.referenceId = params.referenceId!;
    this.quantity = params.quantity!;
    this.notes = params.notes ?? null;
  }

  static create(params: Partial<WasteRecordModel>): WasteRecordModel {
    if (!params.referenceType) {
      throw new BadRequestException('Reference type is required');
    }
    if (!params.referenceId) {
      throw new BadRequestException('Reference ID is required');
    }
    if (!params.quantity || new Decimal(params.quantity).lte(0)) {
      throw new BadRequestException('Quantity must be greater than zero');
    }
    return new WasteRecordModel(params);
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
    return 'waste-record';
  }
}
