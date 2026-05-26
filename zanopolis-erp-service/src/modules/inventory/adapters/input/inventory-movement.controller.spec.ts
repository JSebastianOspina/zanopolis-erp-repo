import { Test, TestingModule } from '@nestjs/testing';
import { InventoryMovementController } from '@/modules/inventory/adapters/input/inventory-movement.controller';
import { InventoryMovementService } from '../../application/inventory-movement.service';
import { InventoryMovementModel } from '@/modules/inventory/domain/inventory-movement.model';
import { JsonApiSerializer } from '@/common/utils/json-api';
import { InventoryMovementType } from '@prisma/client';
import Decimal from 'decimal.js';

jest.mock('@/common/utils/json-api', () => ({
  JsonApiSerializer: {
    serializeMany: jest.fn((data) => ({ data: data })),
  },
}));

describe('InventoryMovementController', () => {
  let controller: InventoryMovementController;
  let service: jest.Mocked<InventoryMovementService>;

  beforeEach(async () => {
    const serviceMock = {
      search: jest.fn(),
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryMovementController],
      providers: [
        {
          provide: InventoryMovementService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<InventoryMovementController>(InventoryMovementController);
    service = module.get(InventoryMovementService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should search movements and serialize response', async () => {
      const movements = [
        InventoryMovementModel.create({
          ingredientId: 'ing-1',
          type: InventoryMovementType.IN as any,
          quantity: new Decimal(10),
        }),
      ];
      service.search.mockResolvedValue({ data: movements, total: 1 });

      const result = await controller.search({ limit: 10, offset: 0 }, 'user-1');

      expect(service.search).toHaveBeenCalled();
      expect(JsonApiSerializer.serializeMany).toHaveBeenCalled();
      expect(result).toHaveProperty('data');
    });
  });
});
