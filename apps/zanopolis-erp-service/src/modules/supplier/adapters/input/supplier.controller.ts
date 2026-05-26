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
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SearchSupplierDto } from './dto/search-supplier.dto';
import type { ISupplierService } from '../../domain/input-ports/supplier.service.interface';
import { SupplierService } from '../../application/supplier.service';
import { UserId } from '@/common/decorators/user-id.decorator';
import { JsonApiSerializer } from '@/common/utils/json-api';
import {
  ApplyCreateSupplierDocs,
  ApplySearchSuppliersDocs,
  ApplyGetSupplierByIdDocs,
  ApplyUpdateSupplierDocs,
  ApplyDeleteSupplierDocs,
} from '../../../../../docs/api/v1/supplier/supplier.swagger';

@Controller('suppliers')
export class SupplierController {
  constructor(
    @Inject(SupplierService)
    private readonly supplierService: ISupplierService,
  ) {}

  @ApplyCreateSupplierDocs()
  @Post()
  async create(
    @Body() createSupplierDto: CreateSupplierDto,
    @UserId() userId: string,
  ) {
    const result = await this.supplierService.create(createSupplierDto, userId);
    return JsonApiSerializer.serialize(result);
  }

  @ApplySearchSuppliersDocs()
  @Get()
  async search(
    @Query() searchParams: SearchSupplierDto,
    @UserId() userId: string,
  ) {
    const paginationParams = {
      limit: searchParams.limit,
      offset: searchParams.offset,
    };
    const result = await this.supplierService.search({}, paginationParams, {
      userId,
    });
    return JsonApiSerializer.serializeMany(result);
  }

  @ApplyGetSupplierByIdDocs()
  @Get(':id')
  async getById(@Param('id') id: string) {
    const result = await this.supplierService.get(id);
    return JsonApiSerializer.serialize(result);
  }

  @ApplyUpdateSupplierDocs()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    const result = await this.supplierService.update(id, updateSupplierDto);
    return JsonApiSerializer.serialize(result);
  }

  @ApplyDeleteSupplierDocs()
  @Delete(':id')
  async delete(@Param('id') id: string, @UserId() userId: string) {
    await this.supplierService.delete(id, userId);
    return { message: 'Entity deleted successfully' };
  }
}
