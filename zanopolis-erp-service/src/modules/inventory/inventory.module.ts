import { Module } from '@nestjs/common';
import { InventoryMovementController } from './adapters/input/inventory-movement.controller';
import { WasteRecordController } from './adapters/input/waste-record.controller';
import factoryProvider from '@/common/providers/factory-provider';
import { DatabaseModule } from '@/common/adapters/database/database.module';
import { InventoryMovementPrismaRepositoryAdapter } from './adapters/output/prisma/inventory-movement-prisma-repository.adapter';
import { WasteRecordPrismaRepositoryAdapter } from './adapters/output/prisma/waste-record-prisma-repository.adapter';
import { InventoryMovementService } from './application/inventory-movement.service';
import { WasteRecordService } from './application/waste-record.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    factoryProvider(
      'IInventoryMovementRepository',
      InventoryMovementPrismaRepositoryAdapter,
      InventoryMovementPrismaRepositoryAdapter, 
    ),
    factoryProvider(
      'IWasteRecordRepository',
      WasteRecordPrismaRepositoryAdapter,
      WasteRecordPrismaRepositoryAdapter, 
    ),
    InventoryMovementService,
    WasteRecordService,
  ],
  controllers: [InventoryMovementController, WasteRecordController],
  exports: [InventoryMovementService, WasteRecordService],
})
export class InventoryModule {}
