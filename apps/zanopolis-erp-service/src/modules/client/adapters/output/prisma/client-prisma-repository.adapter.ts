import { Inject, Injectable } from '@nestjs/common';
import { IClientRepository } from '../../../domain/output-ports/client.repository.interface';
import { ClientModel } from '../../../domain/client.model';
import { PrismaService } from '@/common/adapters/database/prisma.service';
import { CrudRepositoryPrismaAdapter } from '@/common/adapters/database/crud-repository-prisma.adapter';

import { Client } from '@prisma/client';

@Injectable()
export class ClientPrismaRepositoryAdapter
  extends CrudRepositoryPrismaAdapter<ClientModel, string>
  implements IClientRepository
{
  constructor(
    @Inject(PrismaService)
    prismaService: PrismaService,
  ) {
    super(prismaService);
  }

  protected getTable() {
    return this.prismaService.client;
  }

  public toModel(data: Client): ClientModel {
    return ClientModel.create({
      id: data.id,
      name: data.name,
      phone: data.phone,
      address: data.address,
      notes: data.notes,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  public toDto(data: Partial<ClientModel>): Partial<Client> {
    return {
      name: data.name,
      phone: data.phone,
      address: data.address,
      notes: data.notes,
    };
  }
}
