import { BaseModel } from '@/common/domain/models/base.model';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';

export class SupplierModel extends BaseModel {
  public readonly name: string;
  public readonly phone: string | null;
  public readonly notes: string | null;

  private constructor(params: Partial<SupplierModel>) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
    this.name = params.name!;
    this.phone = params.phone ?? null;
    this.notes = params.notes ?? null;
  }

  static create(params: Partial<SupplierModel>): SupplierModel {
    if (!params.name) {
      throw new BadRequestException('Supplier name is required');
    }
    return new SupplierModel(params);
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
    return 'supplier';
  }
}
