import { ICrudRepository } from '@/common/domain/interfaces/crud.repository.interface';
import { ProductionOrderModel } from '../production-order.model';

export interface IProductionOrderRepository
  extends ICrudRepository<ProductionOrderModel, string> {
  completeWithTransaction(id: string): Promise<ProductionOrderModel>;
  findUpcoming(): Promise<ProductionOrderModel[]>;
}
