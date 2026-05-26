import { PartialType } from '@nestjs/swagger';
import { CreateProductionOrderDto } from './create-production-order.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { ProductionOrderStatus } from '@prisma/client';

export class UpdateProductionOrderDto extends PartialType(
  CreateProductionOrderDto,
) {
  @ApiProperty({
    description: 'The status of the production order',
    enum: ProductionOrderStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductionOrderStatus)
  status?: ProductionOrderStatus;
}
