import { ICrudRepository } from '@/common/domain/interfaces/crud.repository.interface';
import { WasteRecordModel } from '../waste-record.model';

export interface IWasteRecordRepository extends ICrudRepository<WasteRecordModel, string> {
  createWithTransaction(model: Partial<WasteRecordModel>): Promise<WasteRecordModel>;
}
