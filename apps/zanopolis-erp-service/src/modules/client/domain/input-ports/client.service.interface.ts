import {
  PaginatedResult,
  PaginationParams,
} from '@/common/domain/interfaces/crud.repository.interface';
import { ClientModel } from '../client.model';

export interface IClientService {
  get(id: string): Promise<ClientModel>;
  search(
    filter: any,
    paginationParams: PaginationParams,
    userData: { userId: string },
  ): Promise<PaginatedResult<ClientModel>>;
  create(
    partialModel: Partial<ClientModel>,
    userId: string,
  ): Promise<ClientModel>;
  update(
    id: string,
    updatedPartialModel: Partial<ClientModel>,
  ): Promise<ClientModel>;
  delete(id: string, userId: string): Promise<void>;
}
