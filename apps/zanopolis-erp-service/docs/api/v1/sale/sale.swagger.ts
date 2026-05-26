import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateSaleDto } from '@/modules/sale/adapters/input/dto/create-sale.dto';
import { SearchSaleDto } from '@/modules/sale/adapters/input/dto/search-sale.dto';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@/common/decorators/api-response.decorator';

export function ApplyCreateSaleDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear venta',
      description: 'Registra una nueva venta. Descuenta inventario, registra ingresos financieros y calcula la utilidad real de forma atómica. Si createProductionIfNeeded es true, producirá automáticamente si falta stock.',
    }),
    ApiBearerAuth('bearer'),
    ApiQuery({ name: 'createProductionIfNeeded', required: false, type: Boolean, description: 'Producir automáticamente si falta stock' }),
    ApiBody({
      type: CreateSaleDto,
    }),
    ApiResponse({
      status: 201,
      description: 'Venta creada exitosamente',
    }),
    ApiBadRequestResponse('sale'),
    ApiUnauthorizedResponse({ modelName: 'sale', method: 'POST' }),
  );
}

export function ApplySearchSalesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar ventas',
      description: 'Obtiene una lista paginada de ventas. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'offset', required: false, type: Number }),
    ApiResponse({
      status: 200,
      description: 'Lista de ventas obtenida',
    }),
    ApiUnauthorizedResponse({ modelName: 'sale', method: 'GET' }),
  );
}

export function ApplyGetSaleByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener venta por ID',
      description: 'Obtiene detalles de una venta específica.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({ name: 'id', type: String }),
    ApiResponse({
      status: 200,
      description: 'Venta encontrada',
    }),
    ApiNotFoundResponse('sale'),
    ApiUnauthorizedResponse({ modelName: 'sale', method: 'GET' }),
  );
}

export function ApplyDeleteSaleDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Eliminar venta',
      description: 'Elimina una venta.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({ name: 'id', type: String }),
    ApiResponse({
      status: 200,
      description: 'Venta eliminada',
    }),
    ApiNotFoundResponse('sale'),
    ApiUnauthorizedResponse({ modelName: 'sale', method: 'DELETE' }),
  );
}
