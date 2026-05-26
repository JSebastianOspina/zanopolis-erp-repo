import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

export class CreateSaleItemDto {
  @ApiProperty({ description: 'Recipe ID' })
  @IsNotEmpty()
  @IsString()
  recipeId!: string;

  @ApiProperty({ description: 'Quantity to sell' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity!: number;

  @ApiProperty({ description: 'Custom sale price (overrides recipe suggested price)' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  customSalePrice!: number;
}

export class CreateSaleDto {
  @ApiProperty({ required: false, description: 'Client ID' })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiProperty({ enum: PaymentMethod, description: 'Payment method' })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @ApiProperty({ type: [CreateSaleItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items!: CreateSaleItemDto[];
}
