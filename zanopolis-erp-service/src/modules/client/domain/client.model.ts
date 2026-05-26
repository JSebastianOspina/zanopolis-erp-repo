import { BaseModel } from '@/common/domain/models/base.model';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';

export class ClientModel extends BaseModel {
  public readonly name: string;
  public readonly phone: string | null;
  public readonly address: string | null;
  public readonly notes: string | null;

  private constructor(params: Partial<ClientModel>) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
    this.name = params.name!;
    this.phone = params.phone ?? null;
    this.address = params.address ?? null;
    this.notes = params.notes ?? null;
  }

  static create(params: Partial<ClientModel>): ClientModel {
    if (!params.name) {
      throw new BadRequestException('Client name is required');
    }
    return new ClientModel(params);
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
    return 'client';
  }
}
