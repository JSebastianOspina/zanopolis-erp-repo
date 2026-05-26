import {
  Controller,
  Get,
  Inject,
  Query,
  BadRequestException,
} from '@nestjs/common';
import type { IFinanceService } from '../../domain/input-ports/finance.service.interface';
import { FinanceService } from '../../application/finance.service';
import { UserId } from '@/common/decorators/user-id.decorator';
import { JsonApiSerializer } from '@/common/utils/json-api';
import { ApiTags } from '@nestjs/swagger';
import {
  ApplyGetDailySummaryDocs,
  ApplyGetMonthlySummaryDocs,
} from '../../../../../docs/api/v1/finance/finance.swagger';

@ApiTags('finance')
@Controller('finance')
export class FinanceController {
  constructor(
    @Inject(FinanceService)
    private readonly financeService: IFinanceService,
  ) {}

  @ApplyGetDailySummaryDocs()
  @Get('daily')
  async getDailySummary(
    @Query('date') dateString: string,
    @UserId() _userId: string,
  ) {
    if (!dateString) {
      throw new BadRequestException('Date query parameter is required (YYYY-MM-DD)');
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    const result = await this.financeService.getDailySummary(date);
    return JsonApiSerializer.serialize(result);
  }

  @ApplyGetMonthlySummaryDocs()
  @Get('monthly')
  async getMonthlySummary(
    @Query('year') yearStr: string,
    @Query('month') monthStr: string,
    @UserId() _userId: string,
  ) {
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      throw new BadRequestException('Invalid year or month');
    }
    const result = await this.financeService.getMonthlySummary(year, month);
    return JsonApiSerializer.serialize(result);
  }
}
