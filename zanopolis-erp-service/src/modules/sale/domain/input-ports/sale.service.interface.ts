import {
  PaginatedResult,
  PaginationParams,
} from '@/common/domain/interfaces/crud.repository.interface';
import { SaleModel } from '../sale.model';
import { IUbitsFilter } from '@/common/domain/interfaces/filter/filter.interface';

export interface ISaleService {
  get(id: string): Promise<SaleModel>;
  search(
    filter: IUbitsFilter | any,
    paginationParams: PaginationParams,
    userData: { userId: string },
  ): Promise<PaginatedResult<SaleModel>>;
  create(
    partialModel: Partial<SaleModel>,
    userId: string,
    options?: { createProductionIfNeeded?: boolean },
  ): Promise<SaleModel>;
  update(
    id: string,
    updatedPartialModel: Partial<SaleModel>,
  ): Promise<SaleModel>;
  delete(id: string, userId: string): Promise<void>;
}
