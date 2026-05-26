import { ICrudRepository } from '@/common/domain/interfaces/crud.repository.interface';
import { InventoryMovementModel } from '../inventory-movement.model';

export interface IInventoryMovementRepository extends ICrudRepository<InventoryMovementModel, string> {}
