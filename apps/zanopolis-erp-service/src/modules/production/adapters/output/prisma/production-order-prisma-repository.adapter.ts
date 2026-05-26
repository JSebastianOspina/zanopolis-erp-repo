/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Inject, Injectable } from '@nestjs/common';
import { IProductionOrderRepository } from '../../../domain/output-ports/production-order.repository.interface';
import { ProductionOrderModel } from '../../../domain/production-order.model';
import { PrismaService } from '@/common/adapters/database/prisma.service';
import { CrudRepositoryPrismaAdapter } from '@/common/adapters/database/crud-repository-prisma.adapter';
import { ProductionOrder, ProductionOrderStatus, InventoryMovementType } from '@prisma/client';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';
import Decimal from 'decimal.js';

@Injectable()
export class ProductionOrderPrismaRepositoryAdapter
  extends CrudRepositoryPrismaAdapter<ProductionOrderModel, string>
  implements IProductionOrderRepository
{
  constructor(
    @Inject(PrismaService)
    prismaService: PrismaService,
  ) {
    super(prismaService);
  }

  protected getTable() {
    return this.prismaService.productionOrder;
  }

  public toModel(data: ProductionOrder): ProductionOrderModel {
    return ProductionOrderModel.create({
      id: data.id,
      recipeId: data.recipeId,
      quantity: data.quantity as any,
      status: data.status as any,
      scheduledDate: data.scheduledDate,
      producedAt: data.producedAt,
      notes: data.notes,
      totalProductionCostSnapshot: data.totalProductionCostSnapshot as any,
      laborCostSnapshot: data.laborCostSnapshot as any,
      ingredientCostSnapshot: data.ingredientCostSnapshot as any,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  public toDto(data: Partial<ProductionOrderModel>): Partial<ProductionOrder> {
    return {
      recipeId: data.recipeId,
      quantity: data.quantity as any,
      status: data.status as any,
      scheduledDate: data.scheduledDate,
      producedAt: data.producedAt,
      notes: data.notes,
      totalProductionCostSnapshot: data.totalProductionCostSnapshot as any,
      laborCostSnapshot: data.laborCostSnapshot as any,
      ingredientCostSnapshot: data.ingredientCostSnapshot as any,
    };
  }

  async findUpcoming(): Promise<ProductionOrderModel[]> {
    const results = await this.prismaService.productionOrder.findMany({
      where: {
        status: ProductionOrderStatus.PLANNED,
        scheduledDate: {
          not: null,
          gte: new Date(),
        },
      },
      orderBy: { scheduledDate: 'asc' },
    });
    return results.map((r) => this.toModel(r));
  }

  async completeWithTransaction(id: string): Promise<ProductionOrderModel> {
    const result = await this.prismaService.$transaction(async (tx) => {
      // 1. Obtener la orden
      const order = await tx.productionOrder.findUnique({ where: { id } });
      if (!order) {
        throw new BadRequestException('Production Order not found');
      }
      if (order.status === ProductionOrderStatus.COMPLETED) {
        throw new BadRequestException('Production Order is already completed');
      }

      // 2. Obtener la receta
      const recipe = await tx.recipe.findUnique({
        where: { id: order.recipeId },
        include: { items: true },
      });
      if (!recipe) {
        throw new BadRequestException('Recipe not found');
      }

      // Simplificaci\u00f3n para MVP: Solo deducimos items de tipo INGREDIENT de nivel superior.
      // Para recetas anidadas (RECIPE), requerir\u00eda una expansi\u00f3n recursiva de la lista de materiales.
      const ingredientItems = recipe.items.filter(
        (i) => i.type === 'INGREDIENT',
      );

      const multiplier = new Decimal(order.quantity);
      let totalIngredientCost = new Decimal(0);

      // 3. Validar y descontar stock
      for (const item of ingredientItems) {
        const requiredQty = new Decimal(item.quantity).mul(multiplier);
        
        const ingredient = await tx.ingredient.findUnique({
          where: { id: item.referenceId },
        });

        if (!ingredient) {
          throw new BadRequestException(`Ingredient not found: ${item.referenceId}`);
        }

        const currentStock = new Decimal(ingredient.currentStock);
        if (currentStock.lt(requiredQty)) {
          throw new BadRequestException(
            `Insufficient stock for ingredient ${ingredient.name}`,
          );
        }

        // Descontar
        const newStock = currentStock.minus(requiredQty);
        await tx.ingredient.update({
          where: { id: ingredient.id },
          data: { currentStock: newStock },
        });

        // Sumar costo
        const cost = new Decimal(ingredient.averageCostPerUnit).mul(requiredQty);
        totalIngredientCost = totalIngredientCost.add(cost);

        // Movimiento inventario
        await tx.inventoryMovement.create({
          data: {
            ingredientId: ingredient.id,
            type: InventoryMovementType.OUT,
            quantity: requiredQty,
            reason: 'PRODUCTION',
            referenceType: 'PRODUCTION_ORDER',
            referenceId: order.id,
          },
        });
      }

      const laborCost = new Decimal(recipe.laborCost).mul(multiplier);
      const totalCost = totalIngredientCost.add(laborCost);

      // 4. Upsert ProductStock
      await tx.productStock.upsert({
        where: { recipeId: recipe.id },
        update: {
          availableQuantity: {
            increment: order.quantity,
          },
        },
        create: {
          recipeId: recipe.id,
          availableQuantity: order.quantity,
        },
      });

      // 5. Marcar como completada y guardar snapshots
      return tx.productionOrder.update({
        where: { id },
        data: {
          status: ProductionOrderStatus.COMPLETED,
          producedAt: new Date(),
          totalProductionCostSnapshot: totalCost,
          laborCostSnapshot: laborCost,
          ingredientCostSnapshot: totalIngredientCost,
        },
      });
    });

    return this.toModel(result);
  }
}
