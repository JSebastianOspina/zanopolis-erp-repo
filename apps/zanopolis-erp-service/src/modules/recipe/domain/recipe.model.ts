import { BaseModel } from '@/common/domain/models/base.model';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';
import Decimal from 'decimal.js';
import { RecipeItemModel } from './recipe-item.model';

export class RecipeModel extends BaseModel {
  public readonly name: string;
  public readonly laborCost: Decimal;
  public readonly marginPercentage: Decimal;
  public readonly suggestedPrice: Decimal;
  public readonly customSalePrice: Decimal;
  public readonly currentProductionCost: Decimal;
  public isActive: boolean;
  public items: RecipeItemModel[];

  private constructor(params: Partial<RecipeModel>) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
    this.name = params.name!;
    this.laborCost = params.laborCost ?? new Decimal(0);
    this.marginPercentage = params.marginPercentage ?? new Decimal(0);
    this.suggestedPrice = params.suggestedPrice ?? new Decimal(0);
    this.customSalePrice = params.customSalePrice ?? new Decimal(0);
    this.currentProductionCost = params.currentProductionCost ?? new Decimal(0);
    this.isActive = params.isActive ?? true;
    this.items = params.items ?? [];
  }

  static create(params: Partial<RecipeModel>): RecipeModel {
    if (!params.name) {
      throw new BadRequestException('Recipe name is required');
    }
    return new RecipeModel(params);
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
    return 'recipe';
  }
}
