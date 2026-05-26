import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateClientDto } from '@/modules/client/adapters/input/dto/create-client.dto';
import { UpdateClientDto } from '@/modules/client/adapters/input/dto/update-client.dto';
import { SearchClientDto } from '@/modules/client/adapters/input/dto/search-client.dto';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@/common/decorators/api-response.decorator';

export function ApplyCreateClientDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear cliente',
      description: 'Crea un nuevo cliente en el sistema. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiBody({
      type: CreateClientDto,
      description: 'Datos del cliente a crear',
      examples: {
        'full-client': {
          summary: 'Cliente completo',
          description: 'Ejemplo con todos los campos opcionales',
          value: {
            name: 'Cliente Frecuente',
            phone: '+123456789',
            address: 'Calle 123',
            notes: 'Le gusta el chocolate',
          },
        },
        'minimal-client': {
          summary: 'Solo campos obligatorios',
          description: 'Ejemplo con el mínimo requerido',
          value: {
            name: 'Cliente Nuevo',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Cliente creado exitosamente',
      content: {
        'application/json': {
          examples: {
            'client-created': {
              summary: 'Cliente creado',
              description: 'Retorna el cliente recién creado',
              value: {
                data: {
                  type: 'client',
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  attributes: {
                    name: 'Cliente Frecuente',
                    phone: '+123456789',
                    address: 'Calle 123',
                    notes: 'Le gusta el chocolate',
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiBadRequestResponse('client'),
    ApiUnauthorizedResponse({ modelName: 'client', method: 'POST' }),
  );
}

export function ApplySearchClientsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar clientes',
      description: 'Obtiene una lista paginada de clientes. Requiere autenticación.',
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
      description: 'Lista de clientes obtenida exitosamente',
      content: {
        'application/json': {
          examples: {
            'clients-collection': {
              summary: 'Colección con resultados',
              description: 'Lista de clientes encontrados',
              value: {
                data: [
                  {
                    type: 'client',
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    attributes: {
                      name: 'Cliente Frecuente',
                      phone: '+123456789',
                      address: 'Calle 123',
                      notes: 'Le gusta el chocolate',
                    },
                  },
                ],
                meta: {
                  total: 1,
                },
              },
            },
            'empty-clients': {
              summary: 'Colección vacía',
              description: 'No se encontraron clientes',
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
    ApiUnauthorizedResponse({ modelName: 'client', method: 'GET' }),
  );
}

export function ApplyGetClientByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener cliente por ID',
      description: 'Obtiene los detalles de un cliente específico. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del cliente',
    }),
    ApiResponse({
      status: 200,
      description: 'Cliente obtenido exitosamente',
      content: {
        'application/json': {
          examples: {
            'client-found': {
              summary: 'Cliente encontrado',
              description: 'Retorna los detalles del cliente',
              value: {
                data: {
                  type: 'client',
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  attributes: {
                    name: 'Cliente Frecuente',
                    phone: '+123456789',
                    address: 'Calle 123',
                    notes: 'Le gusta el chocolate',
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse('client'),
    ApiUnauthorizedResponse({ modelName: 'client', method: 'GET' }),
  );
}

export function ApplyUpdateClientDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualizar cliente',
      description: 'Actualiza los datos de un cliente existente. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del cliente',
    }),
    ApiBody({
      type: UpdateClientDto,
      description: 'Datos del cliente a actualizar',
      examples: {
        'update-all': {
          summary: 'Actualizar todos los campos',
          description: 'Actualiza nombre, teléfono y dirección',
          value: {
            name: 'Cliente Modificado',
            phone: '+987654321',
            address: 'Avenida 456',
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
      description: 'Cliente actualizado exitosamente',
      content: {
        'application/json': {
          examples: {
            'client-updated': {
              summary: 'Cliente actualizado',
              description: 'Retorna el cliente con los datos modificados',
              value: {
                data: {
                  type: 'client',
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  attributes: {
                    name: 'Cliente Modificado',
                    phone: '+987654321',
                    address: 'Avenida 456',
                    notes: 'Le gusta el chocolate',
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse('client'),
    ApiBadRequestResponse('client'),
    ApiUnauthorizedResponse({ modelName: 'client', method: 'PATCH' }),
  );
}

export function ApplyDeleteClientDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Eliminar cliente',
      description: 'Elimina un cliente del sistema. Requiere autenticación.',
    }),
    ApiBearerAuth('bearer'),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del cliente',
    }),
    ApiResponse({
      status: 200,
      description: 'Cliente eliminado exitosamente',
      content: {
        'application/json': {
          examples: {
            'client-deleted': {
              summary: 'Cliente eliminado',
              description: 'Retorna un mensaje de éxito',
              value: {
                message: 'Entity deleted successfully',
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse('client'),
    ApiUnauthorizedResponse({ modelName: 'client', method: 'DELETE' }),
  );
}
