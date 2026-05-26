import { Module } from '@nestjs/common';
import { SupplierController } from './adapters/input/supplier.controller';
import factoryProvider from '@/common/providers/factory-provider';
import { DatabaseModule } from '@/common/adapters/database/database.module';
import { SupplierPrismaRepositoryAdapter } from './adapters/output/prisma/supplier-prisma-repository.adapter';
import { SupplierService } from './application/supplier.service';

class DummyMemoryRepository {}

@Module({
  imports: [DatabaseModule],
  providers: [
    factoryProvider(
      'ISupplierRepository',
      SupplierPrismaRepositoryAdapter,
      DummyMemoryRepository,
    ),
    SupplierService,
  ],
  controllers: [SupplierController],
  exports: [SupplierService],
})
export class SupplierModule {}
