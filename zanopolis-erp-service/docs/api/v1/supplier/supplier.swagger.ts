import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateSupplierDto } from '@/modules/supplier/adapters/input/dto/create-supplier.dto';
import { UpdateSupplierDto } from '@/modules/supplier/adapters/input/dto/update-supplier.dto';
import { SearchSupplierDto } from '@/modules/supplier/adapters/input/dto/search-supplier.dto';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@/common/decorators/api-response.decorator';

export function ApplyCreateSupplierDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear proveedor',
      description: 'Crea un nuevo proveedor en el sistema. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiBody({
      type: CreateSupplierDto,
      description: 'Datos del proveedor a crear',
      examples: {
        'full-supplier': {
          summary: 'Proveedor completo',
          description: 'Ejemplo con todos los campos opcionales',
          value: {
            name: 'Proveedor S.A.',
            phone: '+123456789',
            notes: 'Entrega los lunes',
          },
        },
        'minimal-supplier': {
          summary: 'Solo campos obligatorios',
          description: 'Ejemplo con el mínimo requerido',
          value: {
            name: 'Proveedor B',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Proveedor creado exitosamente',
      content: {
        'application/json': {
          examples: {
            'supplier-created': {
              summary: 'Proveedor creado',
              description: 'Retorna el proveedor recién creado',
              value: {
                data: {
                  type: 'supplier',
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  attributes: {
                    name: 'Proveedor S.A.',
                    phone: '+123456789',
                    notes: 'Entrega los lunes',
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiBadRequestResponse('supplier'),
    ApiUnauthorizedResponse({ modelName: 'supplier', method: 'POST' }),
  );
}

export function ApplySearchSuppliersDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar proveedores',
      description: 'Obtiene una lista paginada de proveedores. Requiere autenticación.',
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
      description: 'Lista de proveedores obtenida exitosamente',
      content: {
        'application/json': {
          examples: {
            'suppliers-collection': {
              summary: 'Colección con resultados',
              description: 'Lista de proveedores encontrados',
              value: {
                data: [
                  {
                    type: 'supplier',
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    attributes: {
                      name: 'Proveedor S.A.',
                      phone: '+123456789',
                      notes: 'Entrega los lunes',
                    },
                  },
                ],
                meta: {
                  total: 1,
                },
              },
            },
            'empty-suppliers': {
              summary: 'Colección vacía',
              description: 'No se encontraron proveedores',
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
    ApiUnauthorizedResponse({ modelName: 'supplier', method: 'GET' }),
  );
}

export function ApplyGetSupplierByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener proveedor por ID',
      description: 'Obtiene los detalles de un proveedor específico. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del proveedor',
    }),
    ApiResponse({
      status: 200,
      description: 'Proveedor obtenido exitosamente',
      content: {
        'application/json': {
          examples: {
            'supplier-found': {
              summary: 'Proveedor encontrado',
              description: 'Retorna los detalles del proveedor',
              value: {
                data: {
                  type: 'supplier',
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  attributes: {
                    name: 'Proveedor S.A.',
                    phone: '+123456789',
                    notes: 'Entrega los lunes',
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse('supplier'),
    ApiUnauthorizedResponse({ modelName: 'supplier', method: 'GET' }),
  );
}

export function ApplyUpdateSupplierDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualizar proveedor',
      description: 'Actualiza los datos de un proveedor existente. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del proveedor',
    }),
    ApiBody({
      type: UpdateSupplierDto,
      description: 'Datos del proveedor a actualizar',
      examples: {
        'update-all': {
          summary: 'Actualizar todos los campos',
          description: 'Actualiza nombre y teléfono',
          value: {
            name: 'Proveedor Modificado',
            phone: '+987654321',
          },
        },
        'update-minimal': {
          summary: 'Actualizar solo un campo',
          description: 'Actualiza únicamente el nombre',
          value: {
            name: 'Nuevo Nombre',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Proveedor actualizado exitosamente',
      content: {
        'application/json': {
          examples: {
            'supplier-updated': {
              summary: 'Proveedor actualizado',
              description: 'Retorna el proveedor con los datos modificados',
              value: {
                data: {
                  type: 'supplier',
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  attributes: {
                    name: 'Proveedor Modificado',
                    phone: '+987654321',
                    notes: 'Entrega los lunes',
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse('supplier'),
    ApiBadRequestResponse('supplier'),
    ApiUnauthorizedResponse({ modelName: 'supplier', method: 'PATCH' }),
  );
}

export function ApplyDeleteSupplierDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Eliminar proveedor',
      description: 'Elimina un proveedor del sistema. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del proveedor',
    }),
    ApiResponse({
      status: 200,
      description: 'Proveedor eliminado exitosamente',
      content: {
        'application/json': {
          examples: {
            'supplier-deleted': {
              summary: 'Proveedor eliminado',
              description: 'Retorna un mensaje de éxito',
              value: {
                message: 'Entity deleted successfully',
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse('supplier'),
    ApiUnauthorizedResponse({ modelName: 'supplier', method: 'DELETE' }),
  );
}
