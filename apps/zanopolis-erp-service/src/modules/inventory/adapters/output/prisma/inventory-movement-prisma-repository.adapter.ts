import { Inject, Injectable } from '@nestjs/common';
import { IInventoryMovementRepository } from '../../../domain/output-ports/inventory-movement.repository.interface';
import { InventoryMovementModel } from '../../../domain/inventory-movement.model';
import { PrismaService } from '@/common/adapters/database/prisma.service';
import { CrudRepositoryPrismaAdapter } from '@/common/adapters/database/crud-repository-prisma.adapter';
import { InventoryMovement } from '@prisma/client';

@Injectable()
export class InventoryMovementPrismaRepositoryAdapter
  extends CrudRepositoryPrismaAdapter<InventoryMovementModel, string>
  implements IInventoryMovementRepository
{
  constructor(
    @Inject(PrismaService)
    prismaService: PrismaService,
  ) {
    super(prismaService);
  }

  protected getTable() {
    return this.prismaService.inventoryMovement;
  }

  public toModel(data: InventoryMovement): InventoryMovementModel {
    return InventoryMovementModel.create({
      id: data.id,
      ingredientId: data.ingredientId,
      type: data.type as any,
      quantity: data.quantity as any,
      reason: data.reason,
      referenceType: data.referenceType as any,
      referenceId: data.referenceId,
      createdAt: data.createdAt,
    });
  }

  public toDto(data: Partial<InventoryMovementModel>): Partial<InventoryMovement> {
    return {
      ingredientId: data.ingredientId,
      type: data.type as any,
      quantity: data.quantity as any,
      reason: data.reason,
      referenceType: data.referenceType as any,
      referenceId: data.referenceId,
    };
  }
}
