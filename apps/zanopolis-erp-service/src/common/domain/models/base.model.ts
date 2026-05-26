export abstract class BaseModel {
  public id?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(params: Partial<BaseModel>) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  abstract getRelationships(): string[];
  abstract getId(): string;
  abstract getBlacklistedProperties(): string[];
  abstract getType(): string;
}
