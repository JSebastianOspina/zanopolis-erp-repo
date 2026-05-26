import {
  PaginatedResult,
  PaginationParams,
} from '@/common/domain/interfaces/crud.repository.interface';
import { PurchaseModel } from '../purchase.model';

export interface IPurchaseRepository {
  get(id: string): Promise<PurchaseModel | null>;
  search(
    filter: any,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<PurchaseModel>>;
  createWithTransaction(model: Partial<PurchaseModel>): Promise<PurchaseModel>;
}
