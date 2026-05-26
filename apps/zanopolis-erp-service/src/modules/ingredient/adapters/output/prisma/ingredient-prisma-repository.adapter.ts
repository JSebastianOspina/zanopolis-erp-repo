/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { IIngredientRepository } from '../../../domain/output-ports/ingredient.repository.interface';
import { IngredientModel } from '../../../domain/ingredient.model';
import { PrismaService } from '@/common/adapters/database/prisma.service';
import { CrudRepositoryPrismaAdapter } from '@/common/adapters/database/crud-repository-prisma.adapter';

import { Ingredient } from '@prisma/client';

@Injectable()
export class IngredientPrismaRepositoryAdapter
  extends CrudRepositoryPrismaAdapter<IngredientModel, string>
  implements IIngredientRepository
{
  constructor(
    @Inject(PrismaService)
    prismaService: PrismaService,
  ) {
    super(prismaService);
  }

  protected getTable() {
    return this.prismaService.ingredient;
  }

  public toModel(data: Ingredient): IngredientModel {
    return IngredientModel.create({
      id: data.id,
      name: data.name,
      unit: data.unit,
      currentStock: data.currentStock,
      minimumStock: data.minimumStock,
      averageCostPerUnit: data.averageCostPerUnit,
      category: data.category as unknown as any,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  public toDto(data: Partial<IngredientModel>): Partial<Ingredient> {
    return {
      name: data.name,
      unit: data.unit,
      currentStock: data.currentStock,
      minimumStock: data.minimumStock,
      averageCostPerUnit: data.averageCostPerUnit,
      category: data.category,
      isActive: data.isActive,
    };
  }

  async findLowStock(): Promise<IngredientModel[]> {
    // using raw prisma syntax to compare currentStock <= minimumStock
    const results = await this.prismaService.ingredient.findMany({
      where: {
        currentStock: {
          lte: this.prismaService.ingredient.fields.minimumStock,
        },
      },
    });
    return results.map((result) => this.toModel(result));
  }
}
