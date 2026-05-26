import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
} from '@nestjs/common';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { UpdateProductionOrderDto } from './dto/update-production-order.dto';
import { SearchProductionOrderDto } from './dto/search-production-order.dto';
import type { IProductionOrderService } from '../../domain/input-ports/production-order.service.interface';
import { ProductionOrderService } from '../../application/production-order.service';
import { UserId } from '@/common/decorators/user-id.decorator';
import { JsonApiSerializer } from '@/common/utils/json-api';
import { ProductionOrderModel } from '../../domain/production-order.model';
import { ApiTags } from '@nestjs/swagger';
import {
  ApplyCreateProductionOrderDocs,
  ApplySearchProductionOrdersDocs,
  ApplyGetProductionOrderUpcomingDocs,
  ApplyGetProductionOrderByIdDocs,
  ApplyUpdateProductionOrderDocs,
  ApplyCompleteProductionOrderDocs,
  ApplyDeleteProductionOrderDocs,
} from '../../../../../docs/api/v1/production-order/production-order.swagger';

@ApiTags('production-orders')
@Controller('production-orders')
export class ProductionOrderController {
  constructor(
    @Inject(ProductionOrderService)
    private readonly productionOrderService: IProductionOrderService,
  ) {}

  @ApplyCreateProductionOrderDocs()
  @Post()
  async create(
    @Body() createDto: CreateProductionOrderDto,
    @UserId() userId: string,
  ) {
    const result = await this.productionOrderService.create(
      createDto as unknown as Partial<ProductionOrderModel>,
      userId,
    );
    return JsonApiSerializer.serialize(result);
  }

  @ApplySearchProductionOrdersDocs()
  @Get()
  async search(
    @Query() searchParams: SearchProductionOrderDto,
    @UserId() userId: string,
  ) {
    const paginationParams = {
      limit: searchParams.limit,
      offset: searchParams.offset,
    };
    const result = await this.productionOrderService.search(
      {},
      paginationParams,
      {
        userId,
      },
    );
    return JsonApiSerializer.serializeMany(result);
  }

  @ApplyGetProductionOrderUpcomingDocs()
  @Get('upcoming')
  async getUpcoming() {
    const result = await this.productionOrderService.getUpcoming();
    return JsonApiSerializer.serializeMany({ data: result, total: result.length });
  }

  @ApplyGetProductionOrderByIdDocs()
  @Get(':id')
  async getById(@Param('id') id: string) {
    const result = await this.productionOrderService.get(id);
    return JsonApiSerializer.serialize(result);
  }

  @ApplyUpdateProductionOrderDocs()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductionOrderDto,
  ) {
    const result = await this.productionOrderService.update(
      id,
      updateDto as unknown as Partial<ProductionOrderModel>,
    );
    return JsonApiSerializer.serialize(result);
  }

  @ApplyCompleteProductionOrderDocs()
  @Post(':id/complete')
  async complete(@Param('id') id: string) {
    const result = await this.productionOrderService.complete(id);
    return JsonApiSerializer.serialize(result);
  }

  @ApplyDeleteProductionOrderDocs()
  @Delete(':id')
  async delete(@Param('id') id: string, @UserId() userId: string) {
    await this.productionOrderService.delete(id, userId);
    return { message: 'Entity deleted successfully' };
  }
}
