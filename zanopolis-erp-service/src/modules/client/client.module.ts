import { Module } from '@nestjs/common';
import { ClientController } from './adapters/input/client.controller';
import factoryProvider from '@/common/providers/factory-provider';
import { DatabaseModule } from '@/common/adapters/database/database.module';
import { ClientPrismaRepositoryAdapter } from './adapters/output/prisma/client-prisma-repository.adapter';
import { ClientService } from './application/client.service';

class DummyMemoryRepository {}

@Module({
  imports: [DatabaseModule],
  providers: [
    factoryProvider(
      'IClientRepository',
      ClientPrismaRepositoryAdapter,
      DummyMemoryRepository,
    ),
    ClientService,
  ],
  controllers: [ClientController],
  exports: [ClientService],
})
export class ClientModule {}
