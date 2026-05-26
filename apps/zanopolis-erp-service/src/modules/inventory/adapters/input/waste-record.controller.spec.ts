import Decimal from 'decimal.js';
import { Test, TestingModule } from '@nestjs/testing';
import { WasteRecordController } from '@/modules/inventory/adapters/input/waste-record.controller';
import { WasteRecordService } from '../../application/waste-record.service';
import { WasteRecordModel } from '@/modules/inventory/domain/waste-record.model';
import { JsonApiSerializer } from '@/common/utils/json-api';

jest.mock('@/common/utils/json-api', () => ({
  JsonApiSerializer: {
    serialize: jest.fn((data) => ({ data: { attributes: data } })),
    serializeMany: jest.fn((data) => ({ data: data })),
  },
}));

describe('WasteRecordController', () => {
  let controller: WasteRecordController;
  let service: jest.Mocked<WasteRecordService>;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn(),
      search: jest.fn(),
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WasteRecordController],
      providers: [
        {
          provide: WasteRecordService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<WasteRecordController>(WasteRecordController);
    service = module.get(WasteRecordService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and serialize', async () => {
      const dto = { referenceType: 'INGREDIENT' as const, referenceId: 'ing-1', quantity: new Decimal(5) as any };
      const model = WasteRecordModel.create(dto);
      service.create.mockResolvedValue(model);

      const result = await controller.create(dto, 'user-1');

      expect(service.create).toHaveBeenCalled();
      expect(JsonApiSerializer.serialize).toHaveBeenCalledWith(model);
      expect(result).toHaveProperty('data.attributes');
    });
  });

  describe('search', () => {
    it('should call service.search and serialize', async () => {
      const model = WasteRecordModel.create({ referenceType: 'INGREDIENT', referenceId: 'ing-1', quantity: new Decimal(5) as any });
      service.search.mockResolvedValue({ data: [model], total: 1 });

      const result = await controller.search({ limit: 10, offset: 0 }, 'user-1');

      expect(service.search).toHaveBeenCalled();
      expect(JsonApiSerializer.serializeMany).toHaveBeenCalled();
      expect(result).toHaveProperty('data');
    });
  });
});
