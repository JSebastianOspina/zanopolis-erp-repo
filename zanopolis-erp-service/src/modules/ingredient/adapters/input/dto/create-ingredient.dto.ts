import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { IngredientCategory } from '../../../domain/ingredient.model';
import Decimal from 'decimal.js';
import { Type } from 'class-transformer';

export class CreateIngredientDto {
  @ApiProperty({ example: 'Harina de Trigo' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'kg' })
  @IsNotEmpty()
  @IsString()
  unit!: string;

  @ApiPropertyOptional({ example: 10.5 })
  @IsOptional()
  @Type(() => Number)
  currentStock?: Decimal;

  @ApiPropertyOptional({ example: 2.0 })
  @IsOptional()
  @Type(() => Number)
  minimumStock?: Decimal;

  @ApiPropertyOptional({ example: 5.5 })
  @IsOptional()
  @Type(() => Number)
  averageCostPerUnit?: Decimal;

  @ApiProperty({
    enum: IngredientCategory,
    example: IngredientCategory.RAW_MATERIAL,
  })
  @IsEnum(IngredientCategory)
  @IsNotEmpty()
  category!: IngredientCategory;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
