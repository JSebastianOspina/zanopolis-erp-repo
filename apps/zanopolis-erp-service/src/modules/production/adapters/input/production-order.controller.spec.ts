import Decimal from 'decimal.js';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductionOrderController } from '@/modules/production/adapters/input/production-order.controller';
import { ProductionOrderService } from '../../application/production-order.service';
import { ProductionOrderModel } from '@/modules/production/domain/production-order.model';
import { JsonApiSerializer } from '@/common/utils/json-api';

jest.mock('@/common/utils/json-api', () => ({
  JsonApiSerializer: {
    serialize: jest.fn((data) => ({ data: { attributes: data } })),
    serializeMany: jest.fn((data) => ({ data: data })),
  },
}));

describe('ProductionOrderController', () => {
  let controller: ProductionOrderController;
  let service: jest.Mocked<ProductionOrderService>;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn(),
      search: jest.fn(),
      getUpcoming: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
      complete: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionOrderController],
      providers: [
        {
          provide: ProductionOrderService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<ProductionOrderController>(ProductionOrderController);
    service = module.get(ProductionOrderService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a production order and serialize response', async () => {
      const dto = { recipeId: 'recipe-1', quantity: new Decimal(10) as any };
      const model = ProductionOrderModel.create(dto);
      service.create.mockResolvedValue(model);

      const result = await controller.create(dto, 'user-1');

      expect(service.create).toHaveBeenCalledWith(dto, 'user-1');
      expect(JsonApiSerializer.serialize).toHaveBeenCalledWith(model);
      expect(result).toHaveProperty('data.attributes');
    });
  });

  describe('complete', () => {
    it('should call service.complete and serialize response', async () => {
      const orderId = 'order-1';
      const model = ProductionOrderModel.create({ recipeId: 'recipe-1', quantity: new Decimal(10) as any });
      service.complete.mockResolvedValue(model);

      const result = await controller.complete(orderId);

      expect(service.complete).toHaveBeenCalledWith(orderId);
      expect(JsonApiSerializer.serialize).toHaveBeenCalledWith(model);
      expect(result).toHaveProperty('data.attributes');
    });
  });
});
