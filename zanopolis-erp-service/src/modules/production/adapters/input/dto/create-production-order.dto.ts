import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  IsPositive,
} from 'class-validator';

export class CreateProductionOrderDto {
  @ApiProperty({
    description: 'The ID of the recipe to produce',
    example: 'uuid-recipe-id',
  })
  @IsNotEmpty()
  @IsString()
  recipeId!: string;

  @ApiProperty({
    description: 'The quantity to produce',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity!: number;

  @ApiProperty({
    description: 'The scheduled date for production',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @ApiProperty({
    description: 'Notes for the production order',
    example: 'Special order for weekend',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
