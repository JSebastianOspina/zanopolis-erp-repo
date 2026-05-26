import { ICrudRepository } from '@/common/domain/interfaces/crud.repository.interface';
import { SaleModel } from '../sale.model';

export interface ISaleRepository extends ICrudRepository<SaleModel, string> {
  createWithTransaction(
    model: Partial<SaleModel>,
    options?: { createProductionIfNeeded?: boolean },
  ): Promise<SaleModel>;
}
