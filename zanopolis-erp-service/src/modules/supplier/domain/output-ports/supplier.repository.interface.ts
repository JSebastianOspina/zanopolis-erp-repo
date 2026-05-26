import { ICrudRepository } from '@/common/domain/interfaces/crud.repository.interface';
import { SupplierModel } from '../supplier.model';

export type ISupplierRepository = ICrudRepository<SupplierModel, string>;
