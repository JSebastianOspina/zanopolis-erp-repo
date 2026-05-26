import { Inject, Injectable } from '@nestjs/common';
import { IProductionOrderService } from '../domain/input-ports/production-order.service.interface';
import { IProductionOrderRepository } from '../domain/output-ports/production-order.repository.interface';
import { ProductionOrderModel } from '../domain/production-order.model';
import { CrudService } from '@/common/application/crud.service';
import { NotFoundException } from '@/common/domain/exceptions/custom-exceptions/not-found-exception';

@Injectable()
export class ProductionOrderService
  extends CrudService<ProductionOrderModel, string>
  implements IProductionOrderService
{
  constructor(
    @Inject('IProductionOrderRepository')
    private productionOrderRepository: IProductionOrderRepository,
  ) {
    super(productionOrderRepository);
  }

  async create(
    partialModel: Partial<ProductionOrderModel>,
    _userId: string,
  ): Promise<ProductionOrderModel> {
    const model = ProductionOrderModel.create(partialModel);
    return this.productionOrderRepository.create(model);
  }

  async complete(id: string): Promise<ProductionOrderModel> {
    const existing = await this.productionOrderRepository.get(id);
    if (!existing) {
      throw new NotFoundException('Production Order not found');
    }
    return this.productionOrderRepository.completeWithTransaction(id);
  }

  async getUpcoming(): Promise<ProductionOrderModel[]> {
    return this.productionOrderRepository.findUpcoming();
  }
}
