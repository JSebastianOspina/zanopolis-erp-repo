import {
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import { SearchInventoryMovementDto } from './dto/search-inventory-movement.dto';
import type { IInventoryMovementService } from '../../domain/input-ports/inventory-movement.service.interface';
import { InventoryMovementService } from '../../application/inventory-movement.service';
import { UserId } from '@/common/decorators/user-id.decorator';
import { JsonApiSerializer } from '@/common/utils/json-api';
import { ApiTags } from '@nestjs/swagger';
import { ApplySearchInventoryMovementsDocs } from '../../../../../docs/api/v1/inventory/inventory.swagger';

@ApiTags('inventory-movements')
@Controller('inventory-movements')
export class InventoryMovementController {
  constructor(
    @Inject(InventoryMovementService)
    private readonly inventoryMovementService: IInventoryMovementService,
  ) {}

  @ApplySearchInventoryMovementsDocs()
  @Get()
  async search(
    @Query() searchParams: SearchInventoryMovementDto,
    @UserId() userId: string,
  ) {
    const paginationParams = {
      limit: searchParams.limit,
      offset: searchParams.offset,
    };
    const result = await this.inventoryMovementService.search(
      {},
      paginationParams,
      { userId },
    );
    return JsonApiSerializer.serializeMany(result);
  }
}
