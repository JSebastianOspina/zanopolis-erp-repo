import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateIngredientDto } from '@/modules/ingredient/adapters/input/dto/create-ingredient.dto';
import { UpdateIngredientDto } from '@/modules/ingredient/adapters/input/dto/update-ingredient.dto';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@/common/decorators/api-response.decorator';

export function ApplyCreateIngredientDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear ingrediente',
      description: 'Crea un nuevo ingrediente en el inventario. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiBody({
      type: CreateIngredientDto,
      description: 'Datos del ingrediente a crear',
      examples: {
        'full-ingredient': {
          summary: 'Ingrediente completo',
          description: 'Ejemplo con todos los campos opcionales',
          value: {
            name: 'Harina de Trigo',
            unit: 'kg',
            currentStock: 10.5,
            minimumStock: 2.0,
            averageCostPerUnit: 5.5,
            category: 'RAW_MATERIAL',
            isActive: true,
          },
        },
        'minimal-ingredient': {
          summary: 'Solo campos obligatorios',
          description: 'Ejemplo con el mínimo requerido',
          value: {
            name: 'Azúcar',
            unit: 'kg',
            category: 'RAW_MATERIAL',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Ingrediente creado exitosamente',
      content: {
        'application/json': {
          examples: {
            'ingredient-created': {
              summary: 'Ingrediente creado',
              description: 'Retorna el ingrediente recién creado',
              value: {
                data: {
                  type: 'ingredient',
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  attributes: {
                    name: 'Harina de Trigo',
                    unit: 'kg',
                    currentStock: 10.5,
                    minimumStock: 2.0,
                    averageCostPerUnit: 5.5,
                    category: 'RAW_MATERIAL',
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiBadRequestResponse('ingredient'),
    ApiUnauthorizedResponse({ modelName: 'ingredient', method: 'POST' }),
  );
}

export function ApplyGetLowStockIngredientsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener ingredientes con stock bajo',
      description: 'Obtiene una lista de ingredientes cuyo stock actual es menor o igual al stock mínimo. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiResponse({
      status: 200,
      description: 'Lista de ingredientes con stock bajo obtenida exitosamente',
      content: {
        'application/json': {
          examples: {
            'low-stock-collection': {
              summary: 'Colección con resultados',
              description: 'Lista de ingredientes con stock bajo',
              value: {
                data: [
                  {
                    type: 'ingredient',
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    attributes: {
                      name: 'Harina de Trigo',
                      unit: 'kg',
                      currentStock: 1.5,
                      minimumStock: 2.0,
                      category: 'RAW_MATERIAL',
                    },
                  },
                ],
              },
            },
            'empty-low-stock': {
              summary: 'Sin stock bajo',
              description: 'No hay ingredientes con stock bajo',
              value: {
                data: [],
              },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({ modelName: 'ingredient', method: 'GET', endpoint: 'low-stock' }),
  );
}

export function ApplySearchIngredientsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar ingredientes',
      description: 'Obtiene una lista paginada de ingredientes. Requiere autenticación.',
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
      description: 'Lista de ingredientes obtenida exitosamente',
      content: {
        'application/json': {
          examples: {
            'ingredients-collection': {
              summary: 'Colección con resultados',
              description: 'Lista de ingredientes encontrados',
              value: {
                data: [
                  {
                    type: 'ingredient',
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    attributes: {
                      name: 'Harina de Trigo',
                      unit: 'kg',
                      category: 'RAW_MATERIAL',
                    },
                  },
                ],
                meta: {
                  total: 1,
                },
              },
            },
            'empty-ingredients': {
              summary: 'Colección vacía',
              description: 'No se encontraron ingredientes',
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
    ApiUnauthorizedResponse({ modelName: 'ingredient', method: 'GET' }),
  );
}

export function ApplyGetIngredientByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener ingrediente por ID',
      description: 'Obtiene los detalles de un ingrediente específico. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del ingrediente',
    }),
    ApiResponse({
      status: 200,
      description: 'Ingrediente obtenido exitosamente',
      content: {
        'application/json': {
          examples: {
            'ingredient-found': {
              summary: 'Ingrediente encontrado',
              description: 'Retorna los detalles del ingrediente',
              value: {
                data: {
                  type: 'ingredient',
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  attributes: {
                    name: 'Harina de Trigo',
                    unit: 'kg',
                    category: 'RAW_MATERIAL',
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse('ingredient'),
    ApiUnauthorizedResponse({ modelName: 'ingredient', method: 'GET' }),
  );
}

export function ApplyUpdateIngredientDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualizar ingrediente',
      description: 'Actualiza los datos de un ingrediente existente. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del ingrediente',
    }),
    ApiBody({
      type: UpdateIngredientDto,
      description: 'Datos del ingrediente a actualizar',
      examples: {
        'update-all': {
          summary: 'Actualizar varios campos',
          description: 'Actualiza nombre y stock mínimo',
          value: {
            name: 'Harina Integral',
            minimumStock: 3.0,
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Ingrediente actualizado exitosamente',
      content: {
        'application/json': {
          examples: {
            'ingredient-updated': {
              summary: 'Ingrediente actualizado',
              description: 'Retorna el ingrediente con los datos modificados',
              value: {
                data: {
                  type: 'ingredient',
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  attributes: {
                    name: 'Harina Integral',
                    unit: 'kg',
                    category: 'RAW_MATERIAL',
                    minimumStock: 3.0,
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse('ingredient'),
    ApiBadRequestResponse('ingredient'),
    ApiUnauthorizedResponse({ modelName: 'ingredient', method: 'PATCH' }),
  );
}

export function ApplyDeleteIngredientDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Eliminar ingrediente',
      description: 'Elimina un ingrediente del sistema. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del ingrediente',
    }),
    ApiResponse({
      status: 200,
      description: 'Ingrediente eliminado exitosamente',
      content: {
        'application/json': {
          examples: {
            'ingredient-deleted': {
              summary: 'Ingrediente eliminado',
              description: 'Retorna un mensaje de éxito',
              value: {
                message: 'Entity deleted successfully',
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse('ingredient'),
    ApiUnauthorizedResponse({ modelName: 'ingredient', method: 'DELETE' }),
  );
}
