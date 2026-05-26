import Decimal from 'decimal.js';
import { Test, TestingModule } from '@nestjs/testing';
import { WasteRecordService } from '@/modules/inventory/application/waste-record.service';
import { IWasteRecordRepository } from '@/modules/inventory/domain/output-ports/waste-record.repository.interface';
import { WasteRecordModel } from '@/modules/inventory/domain/waste-record.model';

describe('WasteRecordService', () => {
  let service: WasteRecordService;
  let repository: jest.Mocked<IWasteRecordRepository>;

  beforeEach(async () => {
    const repositoryMock = {
      createWithTransaction: jest.fn(),
      get: jest.fn(),
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WasteRecordService,
        {
          provide: 'IWasteRecordRepository',
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<WasteRecordService>(WasteRecordService);
    repository = module.get('IWasteRecordRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a waste record with transaction', async () => {
      const partialRecord = { referenceType: 'INGREDIENT', referenceId: 'ing-1', quantity: new Decimal(5) as any };
      const expectedRecord = WasteRecordModel.create(partialRecord);
      repository.createWithTransaction.mockResolvedValue(expectedRecord);

      const result = await service.create(partialRecord, 'user-1');

      expect(repository.createWithTransaction).toHaveBeenCalled();
      expect(result).toEqual(expectedRecord);
    });
  });
});
