import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {
  ApiUnauthorizedResponse,
} from '@/common/decorators/api-response.decorator';

export function ApplySearchInventoryMovementsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar movimientos de inventario',
      description: 'Lista el historial de movimientos de inventario de ingredientes (IN, OUT, WASTE, ADJUSTMENT). Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'offset', required: false, type: Number }),
    ApiResponse({
      status: 200,
      description: 'Lista obtenida exitosamente',
    }),
    ApiUnauthorizedResponse({ modelName: 'inventory-movement', method: 'GET' }),
  );
}

export function ApplyCreateWasteRecordDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Registrar merma',
      description: 'Registra una pérdida. Si es INGREDIENT descuenta su stock y crea movimiento. Si es RECIPE descuenta el stock de producto terminado.',
    }),
    ApiBearerAuth('bearer'),
    ApiResponse({
      status: 201,
      description: 'Merma registrada exitosamente',
    }),
    ApiUnauthorizedResponse({ modelName: 'waste-record', method: 'POST' }),
  );
}

export function ApplySearchWasteRecordsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar registros de merma',
      description: 'Lista el historial de mermas.',
    }),
    ApiBearerAuth('bearer'),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'offset', required: false, type: Number }),
    ApiResponse({
      status: 200,
      description: 'Lista obtenida exitosamente',
    }),
    ApiUnauthorizedResponse({ modelName: 'waste-record', method: 'GET' }),
  );
}
