import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class CreateWasteRecordDto {
  @ApiProperty({ description: 'Reference type (INGREDIENT or RECIPE)' })
  @IsNotEmpty()
  @IsEnum(['INGREDIENT', 'RECIPE'])
  referenceType!: 'INGREDIENT' | 'RECIPE';

  @ApiProperty({ description: 'ID of the ingredient or recipe' })
  @IsNotEmpty()
  @IsString()
  referenceId!: string;

  @ApiProperty({ description: 'Quantity wasted' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity!: number;

  @ApiProperty({ description: 'Notes for waste', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
