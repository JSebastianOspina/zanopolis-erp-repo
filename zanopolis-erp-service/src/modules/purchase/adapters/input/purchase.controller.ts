import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Query,
} from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { SearchPurchaseDto } from './dto/search-purchase.dto';
import type { IPurchaseService } from '../../domain/input-ports/purchase.service.interface';
import { PurchaseService } from '../../application/purchase.service';
import { UserId } from '@/common/decorators/user-id.decorator';
import { JsonApiSerializer } from '@/common/utils/json-api';
import { PurchaseModel } from '../../domain/purchase.model';
import {
  ApplyCreatePurchaseDocs,
  ApplySearchPurchasesDocs,
  ApplyGetPurchaseByIdDocs,
} from '../../../../../docs/api/v1/purchase/purchase.swagger';

@Controller('purchases')
export class PurchaseController {
  constructor(
    @Inject(PurchaseService)
    private readonly purchaseService: IPurchaseService,
  ) {}

  @ApplyCreatePurchaseDocs()
  @Post()
  async create(
    @Body() createPurchaseDto: CreatePurchaseDto,
    @UserId() userId: string,
  ) {
    const result = await this.purchaseService.create(
      createPurchaseDto as unknown as Partial<PurchaseModel>,
      userId,
    );
    return JsonApiSerializer.serialize(result);
  }

  @ApplySearchPurchasesDocs()
  @Get()
  async search(
    @Query() searchParams: SearchPurchaseDto,
    @UserId() userId: string,
  ) {
    const paginationParams = {
      limit: searchParams.limit,
      offset: searchParams.offset,
    };
    const result = await this.purchaseService.search({}, paginationParams, {
      userId,
    });
    return JsonApiSerializer.serializeMany(result);
  }

  @ApplyGetPurchaseByIdDocs()
  @Get(':id')
  async getById(@Param('id') id: string) {
    const result = await this.purchaseService.get(id);
    return JsonApiSerializer.serialize(result);
  }
}
