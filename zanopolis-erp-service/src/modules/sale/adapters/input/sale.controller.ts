import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Query,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SearchSaleDto } from './dto/search-sale.dto';
import type { ISaleService } from '../../domain/input-ports/sale.service.interface';
import { SaleService } from '../../application/sale.service';
import { UserId } from '@/common/decorators/user-id.decorator';
import { JsonApiSerializer } from '@/common/utils/json-api';
import { SaleModel } from '../../domain/sale.model';
import { ApiTags } from '@nestjs/swagger';
import {
  ApplyCreateSaleDocs,
  ApplySearchSalesDocs,
  ApplyGetSaleByIdDocs,
  ApplyDeleteSaleDocs,
} from '../../../../../docs/api/v1/sale/sale.swagger';

@ApiTags('sales')
@Controller('sales')
export class SaleController {
  constructor(
    @Inject(SaleService)
    private readonly saleService: ISaleService,
  ) {}

  @ApplyCreateSaleDocs()
  @Post()
  async create(
    @Body() createDto: CreateSaleDto,
    @Query('createProductionIfNeeded') createProductionIfNeeded: boolean,
    @UserId() userId: string,
  ) {
    const result = await this.saleService.create(
      createDto as unknown as Partial<SaleModel>,
      userId,
      { createProductionIfNeeded: String(createProductionIfNeeded) === 'true' }
    );
    return JsonApiSerializer.serialize(result);
  }

  @ApplySearchSalesDocs()
  @Get()
  async search(
    @Query() searchParams: SearchSaleDto,
    @UserId() userId: string,
  ) {
    const paginationParams = {
      limit: searchParams.limit,
      offset: searchParams.offset,
    };
    const result = await this.saleService.search(
      {},
      paginationParams,
      { userId },
    );
    return JsonApiSerializer.serializeMany(result);
  }

  @ApplyGetSaleByIdDocs()
  @Get(':id')
  async getById(@Param('id') id: string) {
    const result = await this.saleService.get(id);
    return JsonApiSerializer.serialize(result);
  }

  @ApplyDeleteSaleDocs()
  @Delete(':id')
  async delete(@Param('id') id: string, @UserId() userId: string) {
    await this.saleService.delete(id, userId);
    return { message: 'Entity deleted successfully' };
  }
}
