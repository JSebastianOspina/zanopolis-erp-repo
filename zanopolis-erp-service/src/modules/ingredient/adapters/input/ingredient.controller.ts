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
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { SearchIngredientDto } from './dto/search-ingredient.dto';
import type { IIngredientService } from '../../domain/input-ports/ingredient.service.interface';
import { IngredientService } from '../../application/ingredient.service';
import { UserId } from '@/common/decorators/user-id.decorator';
import { JsonApiSerializer } from '@/common/utils/json-api';
import {
  ApplyCreateIngredientDocs,
  ApplySearchIngredientsDocs,
  ApplyGetIngredientByIdDocs,
  ApplyUpdateIngredientDocs,
  ApplyDeleteIngredientDocs,
  ApplyGetLowStockIngredientsDocs,
} from '../../../../../docs/api/v1/ingredient/ingredient.swagger';

@Controller('ingredients')
export class IngredientController {
  constructor(
    @Inject(IngredientService)
    private readonly ingredientService: IIngredientService,
  ) {}

  @ApplyCreateIngredientDocs()
  @Post()
  async create(
    @Body() createIngredientDto: CreateIngredientDto,
    @UserId() userId: string,
  ) {
    const result = await this.ingredientService.create(
      createIngredientDto,
      userId,
    );
    return JsonApiSerializer.serialize(result);
  }

  @ApplyGetLowStockIngredientsDocs()
  @Get('low-stock')
  async getLowStock() {
    const results = await this.ingredientService.getLowStockIngredients();
    return JsonApiSerializer.serializeMany(results);
  }

  @ApplySearchIngredientsDocs()
  @Get()
  async search(
    @Query() searchParams: SearchIngredientDto,
    @UserId() userId: string,
  ) {
    const paginationParams = {
      limit: searchParams.limit,
      offset: searchParams.offset,
    };
    const result = await this.ingredientService.search({}, paginationParams, {
      userId,
    });
    return JsonApiSerializer.serializeMany(result);
  }

  @ApplyGetIngredientByIdDocs()
  @Get(':id')
  async getById(@Param('id') id: string) {
    const result = await this.ingredientService.get(id);
    return JsonApiSerializer.serialize(result);
  }

  @ApplyUpdateIngredientDocs()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    const result = await this.ingredientService.update(id, updateIngredientDto);
    return JsonApiSerializer.serialize(result);
  }

  @ApplyDeleteIngredientDocs()
  @Delete(':id')
  async delete(@Param('id') id: string, @UserId() userId: string) {
    await this.ingredientService.delete(id, userId);
    return { message: 'Entity deleted successfully' };
  }
}
