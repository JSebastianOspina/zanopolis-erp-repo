import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreatePurchaseDto } from '@/modules/purchase/adapters/input/dto/create-purchase.dto';
import { SearchPurchaseDto } from '@/modules/purchase/adapters/input/dto/search-purchase.dto';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@/common/decorators/api-response.decorator';

export function ApplyCreatePurchaseDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Registrar compra',
      description: 'Registra una nueva compra de ingredientes a un proveedor. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiBody({
      type: CreatePurchaseDto,
      description: 'Datos de la compra',
      examples: {
        'full-purchase': {
          summary: 'Compra con varios ítems',
          description: 'Ejemplo de compra con múltiples ingredientes',
          value: {
            supplierId: '123e4567-e89b-12d3-a456-426614174000',
            paymentMethod: 'TRANSFER',
            items: [
              {
                ingredientId: '123e4567-e89b-12d3-a456-426614174001',
                quantity: 1000,
                totalCost: 12000,
              },
              {
                ingredientId: '123e4567-e89b-12d3-a456-426614174002',
                quantity: 500,
                totalCost: 5000,
              },
            ],
          },
        },
        'minimal-purchase': {
          summary: 'Compra mínima',
          description: 'Ejemplo con un solo ítem',
          value: {
            supplierId: '123e4567-e89b-12d3-a456-426614174000',
            paymentMethod: 'CASH',
            items: [
              {
                ingredientId: '123e4567-e89b-12d3-a456-426614174001',
                quantity: 1000,
                totalCost: 12000,
              },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Compra registrada exitosamente',
      content: {
        'application/json': {
          examples: {
            'purchase-created': {
              summary: 'Compra creada',
              description: 'Retorna la compra registrada',
              value: {
                data: {
                  type: 'purchase',
                  id: '123e4567-e89b-12d3-a456-426614174003',
                  attributes: {
                    supplierId: '123e4567-e89b-12d3-a456-426614174000',
                    paymentMethod: 'TRANSFER',
                    totalCost: 17000,
                    purchaseDate: '2026-05-17T18:00:00.000Z',
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiBadRequestResponse('purchase'),
    ApiUnauthorizedResponse({ modelName: 'purchase', method: 'POST' }),
  );
}

export function ApplySearchPurchasesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar compras',
      description: 'Obtiene una lista paginada de compras registradas. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Número de ítems por página',
    }),
    ApiQuery({
      name: 'offset',
      required: false,
      type: Number,
      description: 'Número de ítems a saltar',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de compras obtenida exitosamente',
      content: {
        'application/json': {
          examples: {
            'purchases-collection': {
              summary: 'Colección con resultados',
              description: 'Lista de compras encontradas',
              value: {
                data: [
                  {
                    type: 'purchase',
                    id: '123e4567-e89b-12d3-a456-426614174003',
                    attributes: {
                      supplierId: '123e4567-e89b-12d3-a456-426614174000',
                      paymentMethod: 'TRANSFER',
                      totalCost: 17000,
                      purchaseDate: '2026-05-17T18:00:00.000Z',
                    },
                  },
                ],
                meta: {
                  total: 1,
                },
              },
            },
            'empty-purchases': {
              summary: 'Colección vacía',
              description: 'No se encontraron compras',
              value: {
                data: [],
                meta: {
                  total: 0,
                },
              },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({ modelName: 'purchase', method: 'GET' }),
  );
}

export function ApplyGetPurchaseByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener compra por ID',
      description: 'Obtiene los detalles de una compra específica. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único de la compra',
    }),
    ApiResponse({
      status: 200,
      description: 'Compra obtenida exitosamente',
      content: {
        'application/json': {
          examples: {
            'purchase-found': {
              summary: 'Compra encontrada',
              description: 'Retorna los detalles de la compra',
              value: {
                data: {
                  type: 'purchase',
                  id: '123e4567-e89b-12d3-a456-426614174003',
                  attributes: {
                    supplierId: '123e4567-e89b-12d3-a456-426614174000',
                    paymentMethod: 'TRANSFER',
                    totalCost: 17000,
                    purchaseDate: '2026-05-17T18:00:00.000Z',
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse('purchase'),
    ApiUnauthorizedResponse({ modelName: 'purchase', method: 'GET' }),
  );
}
