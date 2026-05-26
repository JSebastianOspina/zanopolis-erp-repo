import {
  PaginatedResult,
  PaginationParams,
} from '@/common/domain/interfaces/crud.repository.interface';
import { SupplierModel } from '../supplier.model';

export interface ISupplierService {
  get(id: string): Promise<SupplierModel>;
  search(
    filter: any,
    paginationParams: PaginationParams,
    userData: { userId: string },
  ): Promise<PaginatedResult<SupplierModel>>;
  create(
    partialModel: Partial<SupplierModel>,
    userId: string,
  ): Promise<SupplierModel>;
  update(
    id: string,
    updatedPartialModel: Partial<SupplierModel>,
  ): Promise<SupplierModel>;
  delete(id: string, userId: string): Promise<void>;
}
