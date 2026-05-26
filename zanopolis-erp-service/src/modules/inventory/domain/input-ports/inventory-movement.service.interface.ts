import {
  PaginatedResult,
  PaginationParams,
} from '@/common/domain/interfaces/crud.repository.interface';
import { InventoryMovementModel } from '../inventory-movement.model';

export interface IInventoryMovementService {
  get(id: string): Promise<InventoryMovementModel>;
  search(
    filter: any,
    paginationParams: PaginationParams,
    userData: { userId: string },
  ): Promise<PaginatedResult<InventoryMovementModel>>;
}
