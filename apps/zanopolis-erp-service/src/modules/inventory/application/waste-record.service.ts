import { Inject, Injectable } from '@nestjs/common';
import { IWasteRecordService } from '../domain/input-ports/waste-record.service.interface';
import { IWasteRecordRepository } from '../domain/output-ports/waste-record.repository.interface';
import { WasteRecordModel } from '../domain/waste-record.model';
import { CrudService } from '@/common/application/crud.service';

@Injectable()
export class WasteRecordService
  extends CrudService<WasteRecordModel, string>
  implements IWasteRecordService
{
  constructor(
    @Inject('IWasteRecordRepository')
    private wasteRecordRepository: IWasteRecordRepository,
  ) {
    super(wasteRecordRepository);
  }

  async create(
    partialModel: Partial<WasteRecordModel>,
    _userId: string,
  ): Promise<WasteRecordModel> {
    const model = WasteRecordModel.create(partialModel);
    return this.wasteRecordRepository.createWithTransaction(model);
  }
}
