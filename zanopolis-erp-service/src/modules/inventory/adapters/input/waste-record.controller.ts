import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  Query,
} from '@nestjs/common';
import { CreateWasteRecordDto } from './dto/create-waste-record.dto';
import { SearchWasteRecordDto } from './dto/search-waste-record.dto';
import type { IWasteRecordService } from '../../domain/input-ports/waste-record.service.interface';
import { WasteRecordService } from '../../application/waste-record.service';
import { UserId } from '@/common/decorators/user-id.decorator';
import { JsonApiSerializer } from '@/common/utils/json-api';
import { WasteRecordModel } from '../../domain/waste-record.model';
import { ApiTags } from '@nestjs/swagger';
import {
  ApplyCreateWasteRecordDocs,
  ApplySearchWasteRecordsDocs,
} from '../../../../../docs/api/v1/inventory/inventory.swagger';

@ApiTags('waste-records')
@Controller('waste-records')
export class WasteRecordController {
  constructor(
    @Inject(WasteRecordService)
    private readonly wasteRecordService: IWasteRecordService,
  ) {}

  @ApplyCreateWasteRecordDocs()
  @Post()
  async create(
    @Body() createDto: CreateWasteRecordDto,
    @UserId() userId: string,
  ) {
    const result = await this.wasteRecordService.create(
      createDto as unknown as Partial<WasteRecordModel>,
      userId,
    );
    return JsonApiSerializer.serialize(result);
  }

  @ApplySearchWasteRecordsDocs()
  @Get()
  async search(
    @Query() searchParams: SearchWasteRecordDto,
    @UserId() userId: string,
  ) {
    const paginationParams = {
      limit: searchParams.limit,
      offset: searchParams.offset,
    };
    const result = await this.wasteRecordService.search(
      {},
      paginationParams,
      { userId },
    );
    return JsonApiSerializer.serializeMany(result);
  }
}
