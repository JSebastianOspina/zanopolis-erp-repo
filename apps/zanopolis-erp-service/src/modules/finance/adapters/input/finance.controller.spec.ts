import { Test, TestingModule } from '@nestjs/testing';
import { FinanceController } from '@/modules/finance/adapters/input/finance.controller';
import { FinanceService } from '../../application/finance.service';
import { FinancialSummaryModel } from '@/modules/finance/domain/financial-summary.model';
import { JsonApiSerializer } from '@/common/utils/json-api';
import { BadRequestException } from '@nestjs/common';
import Decimal from 'decimal.js';

jest.mock('@/common/utils/json-api', () => ({
  JsonApiSerializer: {
    serialize: jest.fn((data) => ({ data: { attributes: data } })),
  },
}));

describe('FinanceController', () => {
  let controller: FinanceController;
  let service: jest.Mocked<FinanceService>;

  beforeEach(async () => {
    const serviceMock = {
      getDailySummary: jest.fn(),
      getMonthlySummary: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinanceController],
      providers: [
        {
          provide: FinanceService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<FinanceController>(FinanceController);
    service = module.get(FinanceService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDailySummary', () => {
    it('should throw BadRequestException if date is missing', async () => {
      await expect(controller.getDailySummary('', 'user-1')).rejects.toThrow(BadRequestException);
    });

    it('should return daily summary and serialize response', async () => {
      const summary = FinancialSummaryModel.create({
        period: 'test',
        totalIncome: new Decimal(0),
        totalExpense: new Decimal(0),
        grossProfit: new Decimal(0),
        netProfit: new Decimal(0),
      });
      service.getDailySummary.mockResolvedValue(summary);

      const result = await controller.getDailySummary('2023-10-31', 'user-1');

      expect(service.getDailySummary).toHaveBeenCalled();
      expect(JsonApiSerializer.serialize).toHaveBeenCalledWith(summary);
      expect(result).toHaveProperty('data.attributes');
    });
  });

  describe('getMonthlySummary', () => {
    it('should throw BadRequestException if month is invalid', async () => {
      await expect(controller.getMonthlySummary('2023', '13', 'user-1')).rejects.toThrow(BadRequestException);
    });

    it('should return monthly summary and serialize response', async () => {
      const summary = FinancialSummaryModel.create({
        period: 'test',
        totalIncome: new Decimal(0),
        totalExpense: new Decimal(0),
        grossProfit: new Decimal(0),
        netProfit: new Decimal(0),
      });
      service.getMonthlySummary.mockResolvedValue(summary);

      const result = await controller.getMonthlySummary('2023', '10', 'user-1');

      expect(service.getMonthlySummary).toHaveBeenCalledWith(2023, 10);
      expect(JsonApiSerializer.serialize).toHaveBeenCalledWith(summary);
      expect(result).toHaveProperty('data.attributes');
    });
  });
});
