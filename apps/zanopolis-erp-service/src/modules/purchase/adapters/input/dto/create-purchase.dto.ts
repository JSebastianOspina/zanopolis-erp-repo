import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { PaymentMethod } from '../../../domain/purchase.model';
import { Type } from 'class-transformer';

export class CreatePurchaseItemDto {
  @ApiProperty({ example: 'uuid-ingredient' })
  @IsNotEmpty()
  @IsString()
  ingredientId!: string;

  @ApiProperty({ example: 1000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  quantity!: number;

  @ApiProperty({ example: 12000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  totalCost!: number;
}

export class CreatePurchaseDto {
  @ApiProperty({ example: 'uuid-supplier' })
  @IsNotEmpty()
  @IsString()
  supplierId!: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.TRANSFER })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @ApiProperty({ type: [CreatePurchaseItemDto] })
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemDto)
  @ArrayMinSize(1)
  items!: CreatePurchaseItemDto[];
}
