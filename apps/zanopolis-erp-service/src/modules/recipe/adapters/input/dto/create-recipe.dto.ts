import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { RecipeItemType } from '../../../domain/recipe-item.model';
import { Type } from 'class-transformer';

export class CreateRecipeItemDto {
  @ApiProperty({ enum: RecipeItemType, example: RecipeItemType.INGREDIENT })
  @IsNotEmpty()
  @IsEnum(RecipeItemType)
  type!: RecipeItemType;

  @ApiProperty({ example: 'uuid-reference' })
  @IsNotEmpty()
  @IsString()
  referenceId!: string;

  @ApiProperty({ example: 1.5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  quantity!: number;
}

export class CreateRecipeDto {
  @ApiProperty({ example: 'Torta de Chocolate' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  laborCost?: number;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  marginPercentage?: number;

  @ApiPropertyOptional({ example: 25000 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customSalePrice?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: [CreateRecipeItemDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeItemDto)
  @ArrayMinSize(1)
  items!: CreateRecipeItemDto[];
}
