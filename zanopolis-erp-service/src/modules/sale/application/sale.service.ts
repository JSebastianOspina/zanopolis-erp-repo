import { Inject, Injectable } from '@nestjs/common';
import { ISaleService } from '../domain/input-ports/sale.service.interface';
import { ISaleRepository } from '../domain/output-ports/sale.repository.interface';
import { SaleModel } from '../domain/sale.model';
import { CrudService } from '@/common/application/crud.service';

@Injectable()
export class SaleService
  extends CrudService<SaleModel, string>
  implements ISaleService
{
  constructor(
    @Inject('ISaleRepository')
    private saleRepository: ISaleRepository,
  ) {
    super(saleRepository);
  }

  async create(
    partialModel: Partial<SaleModel>,
    _userId: string,
    options?: { createProductionIfNeeded?: boolean },
  ): Promise<SaleModel> {
    const model = SaleModel.create(partialModel);
    return this.saleRepository.createWithTransaction(model, options);
  }
}
