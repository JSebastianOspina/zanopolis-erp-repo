/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Inject, Injectable } from '@nestjs/common';
import { IWasteRecordRepository } from '../../../domain/output-ports/waste-record.repository.interface';
import { WasteRecordModel } from '../../../domain/waste-record.model';
import { PrismaService } from '@/common/adapters/database/prisma.service';
import { CrudRepositoryPrismaAdapter } from '@/common/adapters/database/crud-repository-prisma.adapter';
import { WasteRecord, InventoryMovementType } from '@prisma/client';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';
import Decimal from 'decimal.js';

@Injectable()
export class WasteRecordPrismaRepositoryAdapter
  extends CrudRepositoryPrismaAdapter<WasteRecordModel, string>
  implements IWasteRecordRepository
{
  constructor(
    @Inject(PrismaService)
    prismaService: PrismaService,
  ) {
    super(prismaService);
  }

  protected getTable() {
    return this.prismaService.wasteRecord;
  }

  public toModel(data: WasteRecord): WasteRecordModel {
    return WasteRecordModel.create({
      id: data.id,
      referenceType: data.referenceType as any,
      referenceId: data.referenceId,
      quantity: data.quantity as any,
      notes: data.notes,
      createdAt: data.createdAt,
      updatedAt: data.createdAt, // prisma model doesnt have updatedAt
    });
  }

  public toDto(data: Partial<WasteRecordModel>): Partial<WasteRecord> {
    return {
      referenceType: data.referenceType as any,
      referenceId: data.referenceId,
      quantity: data.quantity as any,
      notes: data.notes,
    };
  }

  async createWithTransaction(model: Partial<WasteRecordModel>): Promise<WasteRecordModel> {
    const result = await this.prismaService.$transaction(async (tx) => {
      // 1. Create the waste record
      const record = await tx.wasteRecord.create({
        data: this.toDto(model) as any,
      });

      const qty = new Decimal(model.quantity!);

      if (model.referenceType === 'INGREDIENT') {
        // Descontar stock de ingrediente y crear movimiento
        const ingredient = await tx.ingredient.findUnique({
          where: { id: model.referenceId },
        });

        if (!ingredient) {
          throw new BadRequestException('Ingredient not found');
        }

        const currentStock = new Decimal(ingredient.currentStock);
        if (currentStock.lt(qty)) {
          throw new BadRequestException('Insufficient ingredient stock for waste');
        }

        await tx.ingredient.update({
          where: { id: ingredient.id },
          data: { currentStock: currentStock.minus(qty) },
        });

        await tx.inventoryMovement.create({
          data: {
            ingredientId: ingredient.id,
            type: InventoryMovementType.WASTE,
            quantity: qty,
            reason: model.notes || 'WASTE_RECORD',
            referenceType: 'WASTE_RECORD',
            referenceId: record.id,
          },
        });
      } else if (model.referenceType === 'RECIPE') {
        // Descontar ProductStock
        const productStock = await tx.productStock.findUnique({
          where: { recipeId: model.referenceId },
        });

        if (!productStock) {
          throw new BadRequestException('Product stock not found');
        }

        const availableQty = new Decimal(productStock.availableQuantity);
        if (availableQty.lt(qty)) {
          throw new BadRequestException('Insufficient product stock for waste');
        }

        await tx.productStock.update({
          where: { recipeId: model.referenceId! },
          data: { availableQuantity: availableQty.minus(qty) },
        });
        
        // NO retroactivamente generamos InventoryMovement de ingredientes.
      } else {
        throw new BadRequestException('Invalid referenceType');
      }

      return record;
    });

    return this.toModel(result);
  }
}
