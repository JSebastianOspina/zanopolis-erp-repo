import { Test, TestingModule } from '@nestjs/testing';
import { FinanceService } from '@/modules/finance/application/finance.service';
import { IFinanceRepository } from '@/modules/finance/domain/output-ports/finance.repository.interface';
import { FinancialSummaryModel } from '@/modules/finance/domain/financial-summary.model';
import Decimal from 'decimal.js';

describe('FinanceService', () => {
  let service: FinanceService;
  let repository: jest.Mocked<IFinanceRepository>;

  beforeEach(async () => {
    const repositoryMock = {
      getSummaryByDateRange: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceService,
        {
          provide: 'IFinanceRepository',
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<FinanceService>(FinanceService);
    repository = module.get('IFinanceRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDailySummary', () => {
    it('should query the repository for a specific day', async () => {
      const date = new Date('2023-10-31T12:00:00.000Z');
      const expectedSummary = FinancialSummaryModel.create({
        period: 'some-period',
        totalIncome: new Decimal(100),
        totalExpense: new Decimal(50),
        grossProfit: new Decimal(50),
        netProfit: new Decimal(40),
      });
      repository.getSummaryByDateRange.mockResolvedValue(expectedSummary);

      const result = await service.getDailySummary(date);

      expect(repository.getSummaryByDateRange).toHaveBeenCalled();
      expect(result).toEqual(expectedSummary);
    });
  });

  describe('getMonthlySummary', () => {
    it('should query the repository for a specific month', async () => {
      const expectedSummary = FinancialSummaryModel.create({
        period: 'some-period',
        totalIncome: new Decimal(1000),
        totalExpense: new Decimal(500),
        grossProfit: new Decimal(500),
        netProfit: new Decimal(400),
      });
      repository.getSummaryByDateRange.mockResolvedValue(expectedSummary);

      const result = await service.getMonthlySummary(2023, 10);

      expect(repository.getSummaryByDateRange).toHaveBeenCalled();
      expect(result).toEqual(expectedSummary);
    });
  });
});
