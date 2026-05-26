import {
  PaginatedResult,
  PaginationParams,
} from '@/common/domain/interfaces/crud.repository.interface';
import { PurchaseModel } from '../purchase.model';

export interface IPurchaseService {
  get(id: string): Promise<PurchaseModel>;
  search(
    filter: any,
    paginationParams: PaginationParams,
    userData: { userId: string },
  ): Promise<PaginatedResult<PurchaseModel>>;
  create(
    partialModel: Partial<PurchaseModel>,
    userId: string,
  ): Promise<PurchaseModel>;
}
