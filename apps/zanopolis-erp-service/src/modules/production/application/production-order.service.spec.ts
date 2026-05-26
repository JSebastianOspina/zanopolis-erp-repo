import { Test, TestingModule } from '@nestjs/testing';
import { ProductionOrderService } from '@/modules/production/application/production-order.service';
import { IProductionOrderRepository } from '@/modules/production/domain/output-ports/production-order.repository.interface';
import { ProductionOrderModel } from '@/modules/production/domain/production-order.model';
import { NotFoundException } from '@/common/domain/exceptions/custom-exceptions/not-found-exception';

describe('ProductionOrderService', () => {
  let service: ProductionOrderService;
  let repository: jest.Mocked<IProductionOrderRepository>;

  beforeEach(async () => {
    const repositoryMock = {
      create: jest.fn(),
      get: jest.fn(),
      completeWithTransaction: jest.fn(),
      findUpcoming: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductionOrderService,
        {
          provide: 'IProductionOrderRepository',
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<ProductionOrderService>(ProductionOrderService);
    repository = module.get('IProductionOrderRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a production order successfully', async () => {
      const partialOrder = { recipeId: 'recipe-1', quantity: new (require("decimal.js").default)(10) as any };
      const expectedOrder = ProductionOrderModel.create(partialOrder);
      repository.create.mockResolvedValue(expectedOrder);

      const result = await service.create(partialOrder, 'user-1');

      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual(expectedOrder);
    });
  });

  describe('complete', () => {
    it('should complete a production order if it exists', async () => {
      const orderId = 'order-1';
      const existingOrder = ProductionOrderModel.create({ recipeId: 'recipe-1', quantity: new (require("decimal.js").default)(10) as any });
      repository.get.mockResolvedValue(existingOrder);
      repository.completeWithTransaction.mockResolvedValue(existingOrder);

      const result = await service.complete(orderId);

      expect(repository.get).toHaveBeenCalledWith(orderId);
      expect(repository.completeWithTransaction).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(existingOrder);
    });

    it('should throw NotFoundException if production order does not exist', async () => {
      const orderId = 'order-missing';
      repository.get.mockResolvedValue(null as any);

      await expect(service.complete(orderId)).rejects.toThrow(NotFoundException);
      expect(repository.get).toHaveBeenCalledWith(orderId);
      expect(repository.completeWithTransaction).not.toHaveBeenCalled();
    });
  });

  describe('getUpcoming', () => {
    it('should return a list of upcoming production orders', async () => {
      const orders = [ProductionOrderModel.create({ recipeId: 'recipe-1', quantity: new (require("decimal.js").default)(10) as any })];
      repository.findUpcoming.mockResolvedValue(orders);

      const result = await service.getUpcoming();

      expect(repository.findUpcoming).toHaveBeenCalled();
      expect(result).toEqual(orders);
    });
  });
});
