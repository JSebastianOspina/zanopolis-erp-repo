import { Inject, Injectable } from '@nestjs/common';
import type { IClientService } from '../domain/input-ports/client.service.interface';
import type { IClientRepository } from '../domain/output-ports/client.repository.interface';
import { ClientModel } from '../domain/client.model';
import { CrudService } from '@/common/application/crud.service';

@Injectable()
export class ClientService
  extends CrudService<ClientModel, string>
  implements IClientService
{
  constructor(
    @Inject('IClientRepository')
    private clientRepository: IClientRepository,
  ) {
    super(clientRepository);
  }

  async create(
    partialModel: Partial<ClientModel>,
    userId: string,
  ): Promise<ClientModel> {
    const model = ClientModel.create(partialModel);
    return super.create(model, userId);
  }
}
