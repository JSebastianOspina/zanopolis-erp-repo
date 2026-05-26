import { ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

// Interfaz para los parámetros de entrada de las funciones de respuesta API
export interface ApiResponseParams {
  modelName: string;
  endpoint?: string;
  detail?: string;
  method?: string;
}

// Método para construir la URL final
export function buildApiPath(modelName: string, endpoint?: string): string {
  return `/task-manager/api/v1/${modelName}s/${endpoint ?? ''}`;
}

/** Parámetros para el ejemplo de error de validación de filtro (FilterValidationException) */
export interface FilterValidationErrorExampleParams {
  /** Ruta completa del endpoint (sin query string). Ej: /task-manager/api/v1/dashboards/tasks */
  path: string;
  /** Verbo HTTP del endpoint. Por defecto GET */
  method?: string;
  /** Mensaje de detalle. Por defecto ejemplo genérico de campo no permitido */
  detail?: string;
}

/**
 * Construye el objeto value para documentar una respuesta 400 de validación de filtro
 * (FilterValidationException). Coincide con backend_exception.filter-validation.
 * Usar en Swagger (ApiResponse examples) y en MD para respuestas de error de filtro.
 */
export function buildFilterValidationErrorExample(
  params: FilterValidationErrorExampleParams,
): { errors: Array<Record<string, unknown>> } {
  const {
    path,
    method = 'GET',
    detail = 'Filtering by field "names" is not allowed',
  } = params;
  return {
    errors: [
      {
        id: 'FilterValidationException-1773257932153-v9aynl4xv',
        status: '400',
        code: 'FILTERVALIDATION_ERROR',
        title: 'FilterValidation Error',
        detail,
        source: { parameter: 'filter' },
        meta: {
          path,
          method,
          timestamp: '2026-03-11T19:38:52.153Z',
          langKey: 'backend_exception.filter-validation',
          langInterpolation: {},
        },
      },
    ],
  };
}

/**
 * Decorator que añade la respuesta 400 para error de validación de filtro.
 * Usar en endpoints que reciben query param filter y pueden lanzar FilterValidationException.
 */
export function ApiFilterValidationErrorResponse(params: ApiResponseParams) {
  const path = buildApiPath(params.modelName, params.endpoint);
  const method = params.method ?? 'GET';
  const value = buildFilterValidationErrorExample({ path, method });
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Invalid filter parameters (FilterValidationException)',
      content: {
        'application/json': {
          examples: {
            'filter-error': {
              summary: 'Filter validation error',
              description:
                'Filter invalid or field not allowed (FILTERVALIDATION_ERROR).',
              value,
            },
          },
        },
      },
    }),
  );
}

export function ApiBadRequestResponse(modelName: string) {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad request error',
      content: {
        'application/json': {
          example: {
            errors: [
              {
                id: 'BadRequestException-1702755998770-abc123def',
                status: '400',
                code: 'BAD_REQUEST_ERROR',
                title: 'Bad Request Error',
                detail: 'Invalid request body',
                meta: {
                  path: `/task-manager/api/v1/${modelName}s`,
                  method: 'POST',
                  timestamp: '2024-10-16T17:26:38.770Z',
                  langKey: 'backend_exception.invalid_request',
                  langInterpolation: {},
                },
              },
            ],
          },
        },
      },
    }),
  );
}

export function ApiNotFoundResponse(modelName: string) {
  return applyDecorators(
    ApiResponse({
      status: 404,
      description: 'Error: Not Found',
      content: {
        'application/json': {
          example: {
            errors: [
              {
                id: 'NotFoundException-1702756457427-uvw456rst',
                status: '404',
                code: 'NOT_FOUND_ERROR',
                title: 'Not Found Error',
                detail: `${modelName} not found`,
                meta: {
                  path: `/task-manager/api/v1/${modelName}s`,
                  method: 'GET',
                  timestamp: '2024-10-16T16:54:17.427Z',
                  langKey: 'backend_exception.not_found',
                  langInterpolation: {
                    model: modelName,
                  },
                },
              },
            ],
          },
        },
      },
    }),
  );
}

export function ApiUnauthorizedResponse(params: ApiResponseParams) {
  const { modelName, endpoint, detail, method } = params;
  const finalPath = buildApiPath(modelName, endpoint);
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Error: Unauthorized. Invalid token in request',
      content: {
        'application/json': {
          example: {
            errors: [
              {
                id: 'UnauthorizedException-1702755494723-xyz789ghi',
                status: '401',
                code: 'UNAUTHORIZED_ERROR',
                title: 'Unauthorized Error',
                detail: detail ?? 'Invalid token in request',
                meta: {
                  path: finalPath,
                  method: method ?? 'GET',
                  timestamp: '2024-10-16T15:18:14.723Z',
                  langKey: 'backend_exception.unauthorized',
                  langInterpolation: {},
                },
              },
            ],
          },
        },
      },
    }),
  );
}

export function ApiForbiddenResponse(params: ApiResponseParams) {
  const { modelName, endpoint, detail, method } = params;
  const finalPath = buildApiPath(modelName, endpoint);
  return applyDecorators(
    ApiResponse({
      status: 403,
      description: 'Error: Forbidden. Insufficient permissions',
      content: {
        'application/json': {
          example: {
            errors: [
              {
                id: 'ForbiddenException-1702755494723-abc123def',
                status: '403',
                code: 'FORBIDDEN_ERROR',
                title: 'Forbidden Error',
                detail:
                  detail ?? 'You do not have permission to perform this action',
                meta: {
                  path: finalPath,
                  method: method ?? 'POST',
                  timestamp: '2024-10-16T16:54:17.427Z',
                  langKey: 'backend_exception.forbidden',
                  langInterpolation: {},
                },
              },
            ],
          },
        },
      },
    }),
  );
}
