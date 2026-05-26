import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateProductionOrderDto } from '@/modules/production/adapters/input/dto/create-production-order.dto';
import { UpdateProductionOrderDto } from '@/modules/production/adapters/input/dto/update-production-order.dto';
import { SearchProductionOrderDto } from '@/modules/production/adapters/input/dto/search-production-order.dto';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@/common/decorators/api-response.decorator';

export function ApplyCreateProductionOrderDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear orden de producción',
      description: 'Crea una nueva orden de producción. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiBody({
      type: CreateProductionOrderDto,
      description: 'Datos de la orden',
      examples: {
        'planned': {
          summary: 'Orden planificada',
          value: {
            recipeId: '123e4567-e89b-12d3-a456-426614174000',
            quantity: 10,
            scheduledDate: '2023-10-31T00:00:00.000Z',
            notes: 'Para el fin de semana'
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Orden creada',
    }),
    ApiBadRequestResponse('production-order'),
    ApiUnauthorizedResponse({ modelName: 'production-order', method: 'POST' }),
  );
}

export function ApplySearchProductionOrdersDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar ordenes de producción',
      description: 'Obtiene una lista paginada de ordenes. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'offset', required: false, type: Number }),
    ApiResponse({
      status: 200,
      description: 'Lista de ordenes',
    }),
    ApiUnauthorizedResponse({ modelName: 'production-order', method: 'GET' }),
  );
}

export function ApplyGetProductionOrderUpcomingDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener próximas órdenes',
      description: 'Retorna las ordenes en estado PLANNED y scheduledDate a futuro. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiResponse({
      status: 200,
      description: 'Lista de próximas ordenes',
    }),
    ApiUnauthorizedResponse({ modelName: 'production-order', method: 'GET', endpoint: 'upcoming' }),
  );
}

export function ApplyGetProductionOrderByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener orden por ID',
      description: 'Obtiene los detalles de una orden específica. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({ name: 'id', type: String }),
    ApiResponse({
      status: 200,
      description: 'Orden encontrada',
    }),
    ApiNotFoundResponse('production-order'),
    ApiUnauthorizedResponse({ modelName: 'production-order', method: 'GET' }),
  );
}

export function ApplyUpdateProductionOrderDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualizar orden de producción',
      description: 'Actualiza los datos de una orden. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({ name: 'id', type: String }),
    ApiBody({ type: UpdateProductionOrderDto }),
    ApiResponse({
      status: 200,
      description: 'Orden actualizada exitosamente',
    }),
    ApiNotFoundResponse('production-order'),
    ApiBadRequestResponse('production-order'),
    ApiUnauthorizedResponse({ modelName: 'production-order', method: 'PATCH' }),
  );
}

export function ApplyCompleteProductionOrderDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Completar orden de producción',
      description: 'Marca la orden como completada, descuenta inventario de ingredientes y genera producto terminado. Guarda snapshot de costos.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({ name: 'id', type: String }),
    ApiResponse({
      status: 200,
      description: 'Orden completada y costos generados exitosamente',
    }),
    ApiNotFoundResponse('production-order'),
    ApiBadRequestResponse('production-order'),
    ApiUnauthorizedResponse({ modelName: 'production-order', method: 'POST', endpoint: ':id/complete' }),
  );
}

export function ApplyDeleteProductionOrderDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Eliminar orden de producción',
      description: 'Elimina una orden del sistema. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({ name: 'id', type: String }),
    ApiResponse({
      status: 200,
      description: 'Orden eliminada exitosamente',
    }),
    ApiNotFoundResponse('production-order'),
    ApiUnauthorizedResponse({ modelName: 'production-order', method: 'DELETE' }),
  );
}
