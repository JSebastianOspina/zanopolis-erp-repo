/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { IRecipeRepository } from '../../../domain/output-ports/recipe.repository.interface';
import { RecipeModel } from '../../../domain/recipe.model';
import { RecipeItemModel } from '../../../domain/recipe-item.model';
import { PrismaService } from '@/common/adapters/database/prisma.service';
import { CrudRepositoryPrismaAdapter } from '@/common/adapters/database/crud-repository-prisma.adapter';

import { Recipe, RecipeItem } from '@prisma/client';

type RecipeWithItems = Recipe & { items?: RecipeItem[] };

@Injectable()
export class RecipePrismaRepositoryAdapter
  extends CrudRepositoryPrismaAdapter<RecipeModel, string>
  implements IRecipeRepository
{
  constructor(
    @Inject(PrismaService)
    prismaService: PrismaService,
  ) {
    super(prismaService);
  }

  protected getTable() {
    return this.prismaService.recipe;
  }

  public toModel(data: RecipeWithItems): RecipeModel {
    return RecipeModel.create({
      id: data.id,
      name: data.name,
      laborCost: data.laborCost,
      marginPercentage: data.marginPercentage,
      suggestedPrice: data.suggestedPrice,
      customSalePrice: data.customSalePrice,
      currentProductionCost: data.currentProductionCost,
      isActive: data.isActive,
      items: data.items
        ? data.items.map((i: RecipeItem) =>
            RecipeItemModel.create({
              id: i.id,
              recipeId: i.recipeId,
              type: i.type as any,
              referenceId: i.referenceId,
              quantity: i.quantity as any,
            }),
          )
        : [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  public toDto(data: Partial<RecipeModel>): Partial<Recipe> {
    return {
      name: data.name,
      laborCost: data.laborCost,
      marginPercentage: data.marginPercentage,
      customSalePrice: data.customSalePrice,
      isActive: data.isActive,
    };
  }

  async get(id: string): Promise<RecipeModel | null> {
    const result = await this.prismaService.recipe.findUnique({
      where: { id },
      include: { items: true },
    });
    return result ? this.toModel(result) : null;
  }

  async createWithItems(model: Partial<RecipeModel>): Promise<RecipeModel> {
    const data = this.toDto(model);
    const result = await this.prismaService.recipe.create({
      data: {
        ...data,
        name: data.name!,
        items: {
          create: (model.items || []).map((item: RecipeItemModel) => ({
            type: item.type,
            referenceId: item.referenceId,
            quantity: item.quantity as any,
          })),
        },
      },
      include: { items: true },
    });
    return this.toModel(result);
  }

  async updateCosts(
    id: string,
    productionCost: any,
    suggestedPrice: any,
  ): Promise<RecipeModel> {
    const result = await this.prismaService.recipe.update({
      where: { id },
      data: {
        currentProductionCost: productionCost,
        suggestedPrice: suggestedPrice,
      },
      include: { items: true },
    });
    return this.toModel(result);
  }

  async getRecipeIdsByIngredients(ingredientIds: string[]): Promise<string[]> {
    if (ingredientIds.length === 0) return [];
    const items = await this.prismaService.recipeItem.findMany({
      where: {
        referenceId: { in: ingredientIds },
        type: 'INGREDIENT',
      },
      select: { recipeId: true },
      distinct: ['recipeId'],
    });
    return items.map((i) => i.recipeId);
  }
}
