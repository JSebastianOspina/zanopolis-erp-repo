import { ICrudRepository } from '@/common/domain/interfaces/crud.repository.interface';
import { ClientModel } from '../client.model';

export type IClientRepository = ICrudRepository<ClientModel, string>;
