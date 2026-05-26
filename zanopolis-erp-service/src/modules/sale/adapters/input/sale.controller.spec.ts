import { Test, TestingModule } from '@nestjs/testing';
import { SaleController } from '@/modules/sale/adapters/input/sale.controller';
import { SaleService } from '../../application/sale.service';
import { SaleModel } from '@/modules/sale/domain/sale.model';
import { JsonApiSerializer } from '@/common/utils/json-api';
import { PaymentMethod } from '@prisma/client';

jest.mock('@/common/utils/json-api', () => ({
  JsonApiSerializer: {
    serialize: jest.fn((data) => ({ data: { attributes: data } })),
    serializeMany: jest.fn((data) => ({ data: data })),
  },
}));

describe('SaleController', () => {
  let controller: SaleController;
  let service: jest.Mocked<SaleService>;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn(),
      search: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleController],
      providers: [
        {
          provide: SaleService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<SaleController>(SaleController);
    service = module.get(SaleService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a sale and pass createProductionIfNeeded flag', async () => {
      const dto = { paymentMethod: PaymentMethod.CASH as any, items: [] };
      const model = SaleModel.create(dto);
      service.create.mockResolvedValue(model);

      const result = await controller.create(dto, true, 'user-1');

      expect(service.create).toHaveBeenCalledWith(dto, 'user-1', { createProductionIfNeeded: true });
      expect(JsonApiSerializer.serialize).toHaveBeenCalledWith(model);
      expect(result).toHaveProperty('data.attributes');
    });
  });
});
