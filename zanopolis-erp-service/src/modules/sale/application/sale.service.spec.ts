import { Test, TestingModule } from '@nestjs/testing';
import { SaleService } from '@/modules/sale/application/sale.service';
import { ISaleRepository } from '@/modules/sale/domain/output-ports/sale.repository.interface';
import { SaleModel } from '@/modules/sale/domain/sale.model';
import { PaymentMethod } from '@prisma/client';

describe('SaleService', () => {
  let service: SaleService;
  let repository: jest.Mocked<ISaleRepository>;

  beforeEach(async () => {
    const repositoryMock = {
      createWithTransaction: jest.fn(),
      get: jest.fn(),
      search: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleService,
        {
          provide: 'ISaleRepository',
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<SaleService>(SaleService);
    repository = module.get('ISaleRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a sale successfully with transaction', async () => {
      const partialSale = { paymentMethod: PaymentMethod.CASH as any, items: [] };
      const expectedSale = SaleModel.create(partialSale);
      repository.createWithTransaction.mockResolvedValue(expectedSale);

      const result = await service.create(partialSale, 'user-1', { createProductionIfNeeded: true });

      expect(repository.createWithTransaction).toHaveBeenCalledWith(expect.any(SaleModel), { createProductionIfNeeded: true });
      expect(result).toEqual(expectedSale);
    });
  });
});
