import { Inject, Injectable } from '@nestjs/common';
import { ISupplierRepository } from '../../../domain/output-ports/supplier.repository.interface';
import { SupplierModel } from '../../../domain/supplier.model';
import { PrismaService } from '@/common/adapters/database/prisma.service';
import { CrudRepositoryPrismaAdapter } from '@/common/adapters/database/crud-repository-prisma.adapter';

import { Supplier } from '@prisma/client';

@Injectable()
export class SupplierPrismaRepositoryAdapter
  extends CrudRepositoryPrismaAdapter<SupplierModel, string>
  implements ISupplierRepository
{
  constructor(
    @Inject(PrismaService)
    prismaService: PrismaService,
  ) {
    super(prismaService);
  }

  protected getTable() {
    return this.prismaService.supplier;
  }

  public toModel(data: Supplier): SupplierModel {
    return SupplierModel.create({
      id: data.id,
      name: data.name,
      phone: data.phone,
      notes: data.notes,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  public toDto(data: Partial<SupplierModel>): Partial<Supplier> {
    return {
      name: data.name,
      phone: data.phone,
      notes: data.notes,
    };
  }
}
