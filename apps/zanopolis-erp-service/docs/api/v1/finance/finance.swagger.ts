import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@/common/decorators/api-response.decorator';

export function ApplyGetDailySummaryDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Resumen financiero diario',
      description: 'Obtiene el resumen financiero de un día específico. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiQuery({ name: 'date', required: true, type: String, description: 'Fecha en formato YYYY-MM-DD' }),
    ApiResponse({
      status: 200,
      description: 'Resumen financiero obtenido exitosamente',
    }),
    ApiBadRequestResponse('finance'),
    ApiUnauthorizedResponse({ modelName: 'finance', method: 'GET', endpoint: 'daily' }),
  );
}

export function ApplyGetMonthlySummaryDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Resumen financiero mensual',
      description: 'Obtiene el resumen financiero de un mes específico. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiQuery({ name: 'year', required: true, type: Number }),
    ApiQuery({ name: 'month', required: true, type: Number, description: '1-12' }),
    ApiResponse({
      status: 200,
      description: 'Resumen financiero obtenido exitosamente',
    }),
    ApiBadRequestResponse('finance'),
    ApiUnauthorizedResponse({ modelName: 'finance', method: 'GET', endpoint: 'monthly' }),
  );
}
