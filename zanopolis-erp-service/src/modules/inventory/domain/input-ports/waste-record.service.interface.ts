import {
  PaginatedResult,
  PaginationParams,
} from '@/common/domain/interfaces/crud.repository.interface';
import { WasteRecordModel } from '../waste-record.model';

export interface IWasteRecordService {
  get(id: string): Promise<WasteRecordModel>;
  search(
    filter: any,
    paginationParams: PaginationParams,
    userData: { userId: string },
  ): Promise<PaginatedResult<WasteRecordModel>>;
  create(
    partialModel: Partial<WasteRecordModel>,
    userId: string,
  ): Promise<WasteRecordModel>;
}
