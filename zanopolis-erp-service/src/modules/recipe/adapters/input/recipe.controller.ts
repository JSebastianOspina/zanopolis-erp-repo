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
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { SearchRecipeDto } from './dto/search-recipe.dto';
import type { IRecipeService } from '../../domain/input-ports/recipe.service.interface';
import { RecipeService } from '../../application/recipe.service';
import { UserId } from '@/common/decorators/user-id.decorator';
import { JsonApiSerializer } from '@/common/utils/json-api';
import { RecipeModel } from '../../domain/recipe.model';
import {
  ApplyCreateRecipeDocs,
  ApplyDuplicateRecipeDocs,
  ApplyRecalculateCostRecipeDocs,
  ApplySearchRecipesDocs,
  ApplyGetRecipeByIdDocs,
  ApplyUpdateRecipeDocs,
  ApplyDeleteRecipeDocs,
} from '../../../../../docs/api/v1/recipe/recipe.swagger';

@Controller('recipes')
export class RecipeController {
  constructor(
    @Inject(RecipeService)
    private readonly recipeService: IRecipeService,
  ) {}

  @ApplyCreateRecipeDocs()
  @Post()
  async create(
    @Body() createRecipeDto: CreateRecipeDto,
    @UserId() userId: string,
  ) {
    const result = await this.recipeService.create(
      createRecipeDto as unknown as Partial<RecipeModel>,
      userId,
    );
    return JsonApiSerializer.serialize(result);
  }

  @ApplyDuplicateRecipeDocs()
  @Post(':id/duplicate')
  async duplicate(@Param('id') id: string, @UserId() userId: string) {
    const result = await this.recipeService.duplicate(id, userId);
    return JsonApiSerializer.serialize(result);
  }

  @ApplyRecalculateCostRecipeDocs()
  @Post(':id/recalculate-cost')
  async recalculateCost(@Param('id') id: string) {
    const result = await this.recipeService.recalculateCost(id);
    return JsonApiSerializer.serialize(result);
  }

  @ApplySearchRecipesDocs()
  @Get()
  async search(
    @Query() searchParams: SearchRecipeDto,
    @UserId() userId: string,
  ) {
    const paginationParams = {
      limit: searchParams.limit,
      offset: searchParams.offset,
    };
    const result = await this.recipeService.search({}, paginationParams, {
      userId,
    });
    return JsonApiSerializer.serializeMany(result);
  }

  @ApplyGetRecipeByIdDocs()
  @Get(':id')
  async getById(@Param('id') id: string) {
    const result = await this.recipeService.get(id);
    return JsonApiSerializer.serialize(result);
  }

  @ApplyUpdateRecipeDocs()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    const result = await this.recipeService.update(
      id,
      updateRecipeDto as unknown as Partial<RecipeModel>,
    );
    return JsonApiSerializer.serialize(result);
  }

  @ApplyDeleteRecipeDocs()
  @Delete(':id')
  async delete(@Param('id') id: string, @UserId() userId: string) {
    await this.recipeService.delete(id, userId);
    return { message: 'Entity deleted successfully' };
  }
}
