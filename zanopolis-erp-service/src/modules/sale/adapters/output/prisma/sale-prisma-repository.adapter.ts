/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Inject, Injectable } from '@nestjs/common';
import { ISaleRepository } from '../../../domain/output-ports/sale.repository.interface';
import { SaleModel } from '../../../domain/sale.model';
import { SaleItemModel } from '../../../domain/sale-item.model';
import { PrismaService } from '@/common/adapters/database/prisma.service';
import { CrudRepositoryPrismaAdapter } from '@/common/adapters/database/crud-repository-prisma.adapter';
import {
  Sale,
  SaleItem,
  FinancialMovementType,
  ProductionOrderStatus,
  InventoryMovementType,
} from '@prisma/client';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';
import Decimal from 'decimal.js';

type SaleWithItems = Sale & { items?: SaleItem[] };

@Injectable()
export class SalePrismaRepositoryAdapter
  extends CrudRepositoryPrismaAdapter<SaleModel, string>
  implements ISaleRepository
{
  constructor(
    @Inject(PrismaService)
    prismaService: PrismaService,
  ) {
    super(prismaService);
  }

  protected getTable() {
    return this.prismaService.sale;
  }

  public toModel(data: SaleWithItems): SaleModel {
    return SaleModel.create({
      id: data.id,
      clientId: data.clientId,
      paymentMethod: data.paymentMethod as any,
      total: data.total as any,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      items: data.items
        ? data.items.map((i: SaleItem) =>
            SaleItemModel.create({
              id: i.id,
              saleId: i.saleId,
              recipeId: i.recipeId,
              quantity: i.quantity as any,
              customSalePrice: i.customSalePrice as any,
              unitProductionCostSnapshot: i.unitProductionCostSnapshot as any,
              unitProfitSnapshot: i.unitProfitSnapshot as any,
            }),
          )
        : [],
    });
  }

  public toDto(data: Partial<SaleModel>): any {
    return {
      clientId: data.clientId,
      paymentMethod: data.paymentMethod,
      total: data.total,
    };
  }

  async createWithTransaction(
    model: Partial<SaleModel>,
    options?: { createProductionIfNeeded?: boolean },
  ): Promise<SaleModel> {
    const items = model.items || [];

    const result = await this.prismaService.$transaction(async (tx) => {
      let totalSale = new Decimal(0);
      const saleItemsData: any[] = [];

      for (const item of items) {
        const recipe = await tx.recipe.findUnique({
          where: { id: item.recipeId },
          include: { items: true },
        });

        if (!recipe) {
          throw new BadRequestException(`Recipe not found: ${item.recipeId}`);
        }

        const quantityToSell = new Decimal(item.quantity);
        const salePrice = new Decimal(item.customSalePrice);
        const currentProdCost = new Decimal(recipe.currentProductionCost);
        const unitProfit = salePrice.minus(currentProdCost);

        saleItemsData.push({
          recipeId: item.recipeId,
          quantity: quantityToSell,
          customSalePrice: salePrice,
          unitProductionCostSnapshot: currentProdCost,
          unitProfitSnapshot: unitProfit,
        });

        totalSale = totalSale.add(salePrice.mul(quantityToSell));

        // 1. Check ProductStock
        let productStock = await tx.productStock.findUnique({
          where: { recipeId: recipe.id },
        });

        let availableQty = productStock
          ? new Decimal(productStock.availableQuantity)
          : new Decimal(0);

        if (availableQty.lt(quantityToSell)) {
          if (!options?.createProductionIfNeeded) {
            throw new BadRequestException(
              `Insufficient stock for product ${recipe.name}. Available: ${availableQty}, Required: ${quantityToSell}`,
            );
          }

          // 2. Producci\u00f3n autom\u00e1tica
          const qtyToProduce = quantityToSell.minus(availableQty);
          
          const ingredientItems = recipe.items.filter(
            (i) => i.type === 'INGREDIENT',
          );
          let totalIngredientCost = new Decimal(0);

          for (const ingItem of ingredientItems) {
            const requiredIngQty = new Decimal(ingItem.quantity).mul(qtyToProduce);
            const ingredient = await tx.ingredient.findUnique({
              where: { id: ingItem.referenceId },
            });

            if (!ingredient) {
              throw new BadRequestException(`Ingredient not found: ${ingItem.referenceId}`);
            }

            const currentIngStock = new Decimal(ingredient.currentStock);
            if (currentIngStock.lt(requiredIngQty)) {
              throw new BadRequestException(
                `Insufficient stock for ingredient ${ingredient.name} during automatic production`,
              );
            }

            // Descontar ingrediente
            await tx.ingredient.update({
              where: { id: ingredient.id },
              data: { currentStock: currentIngStock.minus(requiredIngQty) },
            });

            // Sumar costo
            const cost = new Decimal(ingredient.averageCostPerUnit).mul(requiredIngQty);
            totalIngredientCost = totalIngredientCost.add(cost);

            // Crear orden de producci\u00f3n dummy + completarla en el acto
            const prodOrder = await tx.productionOrder.create({
              data: {
                recipeId: recipe.id,
                quantity: qtyToProduce,
                status: ProductionOrderStatus.COMPLETED,
                producedAt: new Date(),
                notes: 'Automatic production from sale',
                totalProductionCostSnapshot: totalIngredientCost.add(new Decimal(recipe.laborCost).mul(qtyToProduce)),
                laborCostSnapshot: new Decimal(recipe.laborCost).mul(qtyToProduce),
                ingredientCostSnapshot: totalIngredientCost,
              }
            });

            // Movimiento inventario
            await tx.inventoryMovement.create({
              data: {
                ingredientId: ingredient.id,
                type: InventoryMovementType.OUT,
                quantity: requiredIngQty,
                reason: 'PRODUCTION_AUTO',
                referenceType: 'PRODUCTION_ORDER',
                referenceId: prodOrder.id,
              },
            });
          }

          // Aumentar ProductStock temporalmente
          productStock = await tx.productStock.upsert({
            where: { recipeId: recipe.id },
            update: { availableQuantity: { increment: qtyToProduce } },
            create: { recipeId: recipe.id, availableQuantity: qtyToProduce },
          });
          availableQty = new Decimal(productStock.availableQuantity);
        }

        // 3. Descontar ProductStock de la venta
        await tx.productStock.update({
          where: { recipeId: recipe.id },
          data: { availableQuantity: availableQty.minus(quantityToSell) },
        });
      }

      // 4. Crear Sale y SaleItems
      const sale = await tx.sale.create({
        data: {
          clientId: model.clientId,
          paymentMethod: model.paymentMethod!,
          total: totalSale,
          items: {
            create: saleItemsData,
          },
        },
        include: { items: true },
      });

      // 5. Crear FinancialMovement
      await tx.financialMovement.create({
        data: {
          type: FinancialMovementType.INCOME,
          category: 'SALE',
          amount: totalSale,
          paymentMethod: sale.paymentMethod,
          referenceType: 'SALE',
          referenceId: sale.id,
        },
      });

      return sale;
    });

    return this.toModel(result);
  }
}
