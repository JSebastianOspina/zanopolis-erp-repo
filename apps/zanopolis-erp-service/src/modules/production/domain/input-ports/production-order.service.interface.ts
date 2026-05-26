import {
  PaginatedResult,
  PaginationParams,
} from '@/common/domain/interfaces/crud.repository.interface';
import { ProductionOrderModel } from '../production-order.model';
import { IUbitsFilter } from '@/common/domain/interfaces/filter/filter.interface';

export interface IProductionOrderService {
  get(id: string): Promise<ProductionOrderModel>;
  search(
    filter: IUbitsFilter | any,
    paginationParams: PaginationParams,
    userData: { userId: string },
  ): Promise<PaginatedResult<ProductionOrderModel>>;
  create(
    partialModel: Partial<ProductionOrderModel>,
    userId: string,
  ): Promise<ProductionOrderModel>;
  update(
    id: string,
    updatedPartialModel: Partial<ProductionOrderModel>,
  ): Promise<ProductionOrderModel>;
  delete(id: string, userId: string): Promise<void>;
  complete(id: string): Promise<ProductionOrderModel>;
  getUpcoming(): Promise<ProductionOrderModel[]>;
}
