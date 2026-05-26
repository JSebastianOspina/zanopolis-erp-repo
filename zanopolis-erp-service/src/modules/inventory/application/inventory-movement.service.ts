import { Inject, Injectable } from '@nestjs/common';
import { IInventoryMovementService } from '../domain/input-ports/inventory-movement.service.interface';
import { IInventoryMovementRepository } from '../domain/output-ports/inventory-movement.repository.interface';
import { InventoryMovementModel } from '../domain/inventory-movement.model';
import { CrudService } from '@/common/application/crud.service';

@Injectable()
export class InventoryMovementService
  extends CrudService<InventoryMovementModel, string>
  implements IInventoryMovementService
{
  constructor(
    @Inject('IInventoryMovementRepository')
    private inventoryMovementRepository: IInventoryMovementRepository,
  ) {
    super(inventoryMovementRepository);
  }
}
