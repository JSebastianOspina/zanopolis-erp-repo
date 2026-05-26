import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateRecipeDto } from '@/modules/recipe/adapters/input/dto/create-recipe.dto';
import { UpdateRecipeDto } from '@/modules/recipe/adapters/input/dto/update-recipe.dto';
import { SearchRecipeDto } from '@/modules/recipe/adapters/input/dto/search-recipe.dto';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@/common/decorators/api-response.decorator';

export function ApplyCreateRecipeDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear receta',
      description: 'Crea una nueva receta en el sistema. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiBody({
      type: CreateRecipeDto,
      description: 'Datos de la receta',
      examples: {
        'full-recipe': {
          summary: 'Receta completa',
          description: 'Ejemplo de receta con múltiples ítems y costos',
          value: {
            name: 'Torta de Chocolate',
            laborCost: 5000,
            marginPercentage: 30,
            customSalePrice: 25000,
            isActive: true,
            items: [
              {
                type: 'INGREDIENT',
                referenceId: '123e4567-e89b-12d3-a456-426614174000',
                quantity: 1.5,
              },
            ],
          },
        },
        'minimal-recipe': {
          summary: 'Receta mínima',
          description: 'Ejemplo con solo los campos obligatorios',
          value: {
            name: 'Masa Básica',
            items: [
              {
                type: 'INGREDIENT',
                referenceId: '123e4567-e89b-12d3-a456-426614174000',
                quantity: 1.0,
              },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Receta creada exitosamente',
      content: {
        'application/json': {
          examples: {
            'recipe-created': {
              summary: 'Receta creada',
              description: 'Retorna la receta recién creada',
              value: {
                data: {
                  type: 'recipe',
                  id: '123e4567-e89b-12d3-a456-426614174001',
                  attributes: {
                    name: 'Torta de Chocolate',
                    laborCost: 5000,
                    marginPercentage: 30,
                    customSalePrice: 25000,
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiBadRequestResponse('recipe'),
    ApiUnauthorizedResponse({ modelName: 'recipe', method: 'POST' }),
  );
}

export function ApplyDuplicateRecipeDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Duplicar receta',
      description: 'Crea una copia exacta de una receta existente. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID de la receta a duplicar',
    }),
    ApiResponse({
      status: 201,
      description: 'Receta duplicada exitosamente',
      content: {
        'application/json': {
          examples: {
            'recipe-duplicated': {
              summary: 'Receta duplicada',
              description: 'Retorna la nueva receta generada a partir de la original',
              value: {
                data: {
                  type: 'recipe',
                  id: '123e4567-e89b-12d3-a456-426614174002',
                  attributes: {
                    name: 'Torta de Chocolate (Copia)',
                    laborCost: 5000,
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse('recipe'),
    ApiUnauthorizedResponse({ modelName: 'recipe', method: 'POST', endpoint: ':id/duplicate' }),
  );
}

export function ApplyRecalculateCostRecipeDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Recalcular costo',
      description: 'Recalcula el costo total de la receta basado en los precios actuales de los ingredientes. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID de la receta a recalcular',
    }),
    ApiResponse({
      status: 201,
      description: 'Costo recalculado exitosamente',
      content: {
        'application/json': {
          examples: {
            'cost-recalculated': {
              summary: 'Costo recalculado',
              description: 'Retorna la receta con el nuevo costo calculado',
              value: {
                data: {
                  type: 'recipe',
                  id: '123e4567-e89b-12d3-a456-426614174001',
                  attributes: {
                    name: 'Torta de Chocolate',
                    totalCost: 15000,
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse('recipe'),
    ApiUnauthorizedResponse({ modelName: 'recipe', method: 'POST', endpoint: ':id/recalculate-cost' }),
  );
}

export function ApplySearchRecipesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar recetas',
      description: 'Obtiene una lista paginada de recetas. Requiere autenticación.',
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
      description: 'Lista de recetas obtenida exitosamente',
      content: {
        'application/json': {
          examples: {
            'recipes-collection': {
              summary: 'Colección con resultados',
              description: 'Lista de recetas encontradas',
              value: {
                data: [
                  {
                    type: 'recipe',
                    id: '123e4567-e89b-12d3-a456-426614174001',
                    attributes: {
                      name: 'Torta de Chocolate',
                    },
                  },
                ],
                meta: {
                  total: 1,
                },
              },
            },
            'empty-recipes': {
              summary: 'Colección vacía',
              description: 'No se encontraron recetas',
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
    ApiUnauthorizedResponse({ modelName: 'recipe', method: 'GET' }),
  );
}

export function ApplyGetRecipeByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener receta por ID',
      description: 'Obtiene los detalles de una receta específica. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único de la receta',
    }),
    ApiResponse({
      status: 200,
      description: 'Receta obtenida exitosamente',
      content: {
        'application/json': {
          examples: {
            'recipe-found': {
              summary: 'Receta encontrada',
              description: 'Retorna los detalles de la receta',
              value: {
                data: {
                  type: 'recipe',
                  id: '123e4567-e89b-12d3-a456-426614174001',
                  attributes: {
                    name: 'Torta de Chocolate',
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse('recipe'),
    ApiUnauthorizedResponse({ modelName: 'recipe', method: 'GET' }),
  );
}

export function ApplyUpdateRecipeDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualizar receta',
      description: 'Actualiza los datos de una receta existente. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único de la receta',
    }),
    ApiBody({
      type: UpdateRecipeDto,
      description: 'Datos de la receta a actualizar',
      examples: {
        'update-all': {
          summary: 'Actualizar varios campos',
          description: 'Actualiza nombre y costo de mano de obra',
          value: {
            name: 'Torta de Vainilla',
            laborCost: 6000,
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Receta actualizada exitosamente',
      content: {
        'application/json': {
          examples: {
            'recipe-updated': {
              summary: 'Receta actualizada',
              description: 'Retorna la receta con los datos modificados',
              value: {
                data: {
                  type: 'recipe',
                  id: '123e4567-e89b-12d3-a456-426614174001',
                  attributes: {
                    name: 'Torta de Vainilla',
                    laborCost: 6000,
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse('recipe'),
    ApiBadRequestResponse('recipe'),
    ApiUnauthorizedResponse({ modelName: 'recipe', method: 'PATCH' }),
  );
}

export function ApplyDeleteRecipeDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Eliminar receta',
      description: 'Elimina una receta del sistema. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único de la receta',
    }),
    ApiResponse({
      status: 200,
      description: 'Receta eliminada exitosamente',
      content: {
        'application/json': {
          examples: {
            'recipe-deleted': {
              summary: 'Receta eliminada',
              description: 'Retorna un mensaje de éxito',
              value: {
                message: 'Entity deleted successfully',
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse('recipe'),
    ApiUnauthorizedResponse({ modelName: 'recipe', method: 'DELETE' }),
  );
}
