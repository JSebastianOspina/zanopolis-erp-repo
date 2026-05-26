import { BaseModel } from '@/common/domain/models/base.model';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';
import Decimal from 'decimal.js';

export enum IngredientCategory {
  RAW_MATERIAL = 'RAW_MATERIAL',
  PACKAGING = 'PACKAGING',
  DECORATION = 'DECORATION',
  OTHER = 'OTHER',
}

export class IngredientModel extends BaseModel {
  public readonly name: string;
  public readonly unit: string;
  public currentStock: Decimal;
  public minimumStock: Decimal;
  public averageCostPerUnit: Decimal;
  public category: IngredientCategory;
  public isActive: boolean;

  private constructor(params: Partial<IngredientModel>) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
    this.name = params.name!;
    this.unit = params.unit!;
    this.currentStock = params.currentStock ?? new Decimal(0);
    this.minimumStock = params.minimumStock ?? new Decimal(0);
    this.averageCostPerUnit = params.averageCostPerUnit ?? new Decimal(0);
    this.category = params.category!;
    this.isActive = params.isActive ?? true;
  }

  static create(params: Partial<IngredientModel>): IngredientModel {
    if (!params.name) {
      throw new BadRequestException('Ingredient name is required');
    }
    if (!params.unit) {
      throw new BadRequestException('Ingredient unit is required');
    }
    if (!params.category) {
      throw new BadRequestException('Ingredient category is required');
    }
    return new IngredientModel(params);
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
    return 'ingredient';
  }
}
