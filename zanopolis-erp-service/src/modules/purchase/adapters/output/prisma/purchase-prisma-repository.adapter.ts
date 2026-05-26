/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Inject, Injectable } from '@nestjs/common';
import { IPurchaseRepository } from '../../../domain/output-ports/purchase.repository.interface';
import { PurchaseModel } from '../../../domain/purchase.model';
import { PurchaseItemModel } from '../../../domain/purchase-item.model';
import { PrismaService } from '@/common/adapters/database/prisma.service';
import {
  PaginatedResult,
  PaginationParams,
} from '@/common/domain/interfaces/crud.repository.interface';
import {
  InventoryMovementType,
  FinancialMovementType,
  Purchase,
  PurchaseItem,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

type PurchaseWithItems = Purchase & { items?: PurchaseItem[] };

@Injectable()
export class PurchasePrismaRepositoryAdapter implements IPurchaseRepository {
  constructor(
    @Inject(PrismaService)
    private prismaService: PrismaService,
  ) {}

  public toModel(data: PurchaseWithItems): PurchaseModel {
    return PurchaseModel.create({
      id: data.id,
      supplierId: data.supplierId,
      paymentMethod: data.paymentMethod as any,
      total: data.total,
      purchasedAt: data.purchasedAt,
      items: data.items
        ? data.items.map((i: PurchaseItem) =>
            PurchaseItemModel.create({
              id: i.id,
              purchaseId: i.purchaseId,
              ingredientId: i.ingredientId,
              quantity: i.quantity as any,
              totalCost: i.totalCost as any,
              costPerUnit: i.costPerUnit as any,
            }),
          )
        : [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async get(id: string): Promise<PurchaseModel | null> {
    const result = await this.prismaService.purchase.findUnique({
      where: { id },
      include: { items: true },
    });
    return result ? this.toModel(result) : null;
  }

  async search(
    filter: any,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<PurchaseModel>> {
    const { limit = 50, offset = 0 } = pagination;
    const [data, total] = await Promise.all([
      this.prismaService.purchase.findMany({
        where: filter,
        take: limit,
        skip: offset,
        include: { items: true },
      }),
      this.prismaService.purchase.count({ where: filter }),
    ]);

    return {
      data: data.map((item: any) => this.toModel(item)),
      total,
    };
  }

  async createWithTransaction(
    model: Partial<PurchaseModel>,
  ): Promise<PurchaseModel> {
    const items = model.items || [];

    const result = await this.prismaService.$transaction(async (tx) => {
      // 1. Create Purchase and PurchaseItems
      const purchase = await tx.purchase.create({
        data: {
          supplierId: model.supplierId!,
          paymentMethod: model.paymentMethod!,
          total:
            model.total ||
            items.reduce(
              (acc, i) => acc.add(new Decimal(i.totalCost)),
              new Decimal(0),
            ),
          items: {
            create: items.map((i) => ({
              ingredientId: i.ingredientId,
              quantity: i.quantity,
              totalCost: i.totalCost,
              costPerUnit: i.costPerUnit,
            })),
          },
        },
        include: { items: true },
      });

      // 2. Financial Movement
      await tx.financialMovement.create({
        data: {
          type: FinancialMovementType.EXPENSE,
          category: 'PURCHASES',
          amount: purchase.total,
          paymentMethod: purchase.paymentMethod,
          referenceType: 'PURCHASE',
          referenceId: purchase.id,
        },
      });

      // 3. For each item: Update Stock, Recalculate Average Cost, Create Inventory Movement
      for (const item of purchase.items) {
        // Find current ingredient
        const currentIng = await tx.ingredient.findUnique({
          where: { id: item.ingredientId },
        });

        if (currentIng) {
          const oldStock = new Decimal(currentIng.currentStock);
          const oldAvgCost = new Decimal(currentIng.averageCostPerUnit);
          const oldTotalValue = oldStock.mul(oldAvgCost);

          const addedStock = new Decimal(item.quantity);
          const addedCost = new Decimal(item.totalCost);

          const newStock = oldStock.add(addedStock);
          let newAvgCost = oldAvgCost;
          if (newStock.gt(0)) {
            newAvgCost = oldTotalValue.add(addedCost).dividedBy(newStock);
          }

          await tx.ingredient.update({
            where: { id: item.ingredientId },
            data: {
              currentStock: newStock,
              averageCostPerUnit: newAvgCost,
            },
          });

          await tx.inventoryMovement.create({
            data: {
              ingredientId: item.ingredientId,
              type: InventoryMovementType.IN,
              quantity: item.quantity,
              reason: 'PURCHASE',
              referenceType: 'PURCHASE',
              referenceId: purchase.id,
            },
          });
        }
      }

      return purchase;
    });

    return this.toModel(result);
  }
}
