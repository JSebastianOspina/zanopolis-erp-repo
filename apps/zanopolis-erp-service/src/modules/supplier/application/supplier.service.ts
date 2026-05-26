import { Inject, Injectable } from '@nestjs/common';
import type { ISupplierService } from '../domain/input-ports/supplier.service.interface';
import type { ISupplierRepository } from '../domain/output-ports/supplier.repository.interface';
import { SupplierModel } from '../domain/supplier.model';
import { CrudService } from '@/common/application/crud.service';

@Injectable()
export class SupplierService
  extends CrudService<SupplierModel, string>
  implements ISupplierService
{
  constructor(
    @Inject('ISupplierRepository')
    private supplierRepository: ISupplierRepository,
  ) {
    super(supplierRepository);
  }

  async create(
    partialModel: Partial<SupplierModel>,
    userId: string,
  ): Promise<SupplierModel> {
    const model = SupplierModel.create(partialModel);
    return super.create(model, userId);
  }
}
