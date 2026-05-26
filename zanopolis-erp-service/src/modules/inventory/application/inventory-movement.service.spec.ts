import { Test, TestingModule } from '@nestjs/testing';
import { InventoryMovementService } from '@/modules/inventory/application/inventory-movement.service';
import { IInventoryMovementRepository } from '@/modules/inventory/domain/output-ports/inventory-movement.repository.interface';
import { InventoryMovementModel } from '@/modules/inventory/domain/inventory-movement.model';
import { InventoryMovementType } from '@prisma/client';
import Decimal from 'decimal.js';

describe('InventoryMovementService', () => {
  let service: InventoryMovementService;
  let repository: jest.Mocked<IInventoryMovementRepository>;

  beforeEach(async () => {
    const repositoryMock = {
      search: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryMovementService,
        {
          provide: 'IInventoryMovementRepository',
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<InventoryMovementService>(InventoryMovementService);
    repository = module.get('IInventoryMovementRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should query the repository for movements', async () => {
      const movements = [
        InventoryMovementModel.create({
          ingredientId: 'ing-1',
          type: InventoryMovementType.IN as any,
          quantity: new Decimal(10),
        }),
      ];
      repository.search.mockResolvedValue({ data: movements, total: 1 });

      const result = await (service.search as any)({}, { limit: 10, offset: 0 }, { userId: "user-1" });

      expect(repository.search).toHaveBeenCalled();
      expect(result.data).toEqual(movements);
    });
  });
});
