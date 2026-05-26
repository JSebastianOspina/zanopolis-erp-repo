# [Client] Crear cliente

## POST@/clients
`https://{domain}/clients`

Crea un nuevo cliente en el sistema. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.
* El nombre del cliente es obligatorio.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| body | CreateClientDto | Sí | Datos del cliente a crear |

### Solicitudes (body)
**Cliente completo (full-client)**
```json
{
  "name": "Cliente Frecuente",
  "phone": "+123456789",
  "address": "Calle 123",
  "notes": "Le gusta el chocolate"
}
```

**Solo campos obligatorios (minimal-client)**
```json
{
  "name": "Cliente Nuevo"
}
```

### Respuestas

#### 201 - Cliente creado (client-created)
```json
{
  "data": {
    "type": "client",
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "attributes": {
      "name": "Cliente Frecuente",
      "phone": "+123456789",
      "address": "Calle 123",
      "notes": "Le gusta el chocolate"
    }
  }
}
```

#### 400 - Invalid request body (bad-request)
```json
{
  "errors": [
    {
      "id": "BAD_REQUEST_ERROR-timestamp",
      "status": "400",
      "code": "BAD_REQUEST_ERROR",
      "title": "Bad Request",
      "detail": "Invalid request body",
      "meta": {
        "path": "/clients",
        "method": "POST",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.bad_request",
        "langInterpolation": {}
      }
    }
  ]
}
```

#### 401 - Invalid token (unauthorized)
```json
{
  "errors": [
    {
      "id": "UNAUTHORIZED_ERROR-timestamp",
      "status": "401",
      "code": "UNAUTHORIZED_ERROR",
      "title": "Unauthorized",
      "detail": "Invalid token in request",
      "meta": {
        "path": "/clients",
        "method": "POST",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.unauthorized",
        "langInterpolation": {}
      }
    }
  ]
}
```

---

# [Client] Buscar clientes

## GET@/clients
`https://{domain}/clients`

Obtiene una lista paginada de clientes. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.
* Soporta paginación a través de limit y offset.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| limit | Number | No | Número de ítems por página |
| offset | Number | No | Número de ítems a saltar |

### Respuestas

#### 200 - Colección con resultados (clients-collection)
```json
{
  "data": [
    {
      "type": "client",
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "attributes": {
        "name": "Cliente Frecuente",
        "phone": "+123456789",
        "address": "Calle 123",
        "notes": "Le gusta el chocolate"
      }
    }
  ],
  "meta": {
    "total": 1
  }
}
```

#### 200 - Colección vacía (empty-clients)
```json
{
  "data": [],
  "meta": {
    "total": 0
  }
}
```

#### 401 - Invalid token (unauthorized)
```json
{
  "errors": [
    {
      "id": "UNAUTHORIZED_ERROR-timestamp",
      "status": "401",
      "code": "UNAUTHORIZED_ERROR",
      "title": "Unauthorized",
      "detail": "Invalid token in request",
      "meta": {
        "path": "/clients",
        "method": "GET",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.unauthorized",
        "langInterpolation": {}
      }
    }
  ]
}
```

---

# [Client] Obtener cliente por ID

## GET@/clients/:id
`https://{domain}/clients/:id`

Obtiene los detalles de un cliente específico. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | String | Sí | ID único del cliente |

### Respuestas

#### 200 - Cliente encontrado (client-found)
```json
{
  "data": {
    "type": "client",
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "attributes": {
      "name": "Cliente Frecuente",
      "phone": "+123456789",
      "address": "Calle 123",
      "notes": "Le gusta el chocolate"
    }
  }
}
```

#### 404 - Resource not found (not-found)
```json
{
  "errors": [
    {
      "id": "NOT_FOUND_ERROR-timestamp",
      "status": "404",
      "code": "NOT_FOUND_ERROR",
      "title": "Not Found",
      "detail": "client not found",
      "meta": {
        "path": "/clients/:id",
        "method": "GET",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.not_found",
        "langInterpolation": {
          "model": "client"
        }
      }
    }
  ]
}
```

#### 401 - Invalid token (unauthorized)
```json
{
  "errors": [
    {
      "id": "UNAUTHORIZED_ERROR-timestamp",
      "status": "401",
      "code": "UNAUTHORIZED_ERROR",
      "title": "Unauthorized",
      "detail": "Invalid token in request",
      "meta": {
        "path": "/clients/:id",
        "method": "GET",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.unauthorized",
        "langInterpolation": {}
      }
    }
  ]
}
```

---

# [Client] Actualizar cliente

## PATCH@/clients/:id
`https://{domain}/clients/:id`

Actualiza los datos de un cliente existente. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | String | Sí | ID único del cliente |
| body | UpdateClientDto | Sí | Datos del cliente a actualizar |

### Solicitudes (body)
**Actualizar todos los campos (update-all)**
```json
{
  "name": "Cliente Modificado",
  "phone": "+987654321",
  "address": "Avenida 456"
}
```

**Actualizar solo un campo (update-minimal)**
```json
{
  "name": "Nuevo Nombre"
}
```

### Respuestas

#### 200 - Cliente actualizado (client-updated)
```json
{
  "data": {
    "type": "client",
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "attributes": {
      "name": "Cliente Modificado",
      "phone": "+987654321",
      "address": "Avenida 456",
      "notes": "Le gusta el chocolate"
    }
  }
}
```

#### 404 - Resource not found (not-found)
```json
{
  "errors": [
    {
      "id": "NOT_FOUND_ERROR-timestamp",
      "status": "404",
      "code": "NOT_FOUND_ERROR",
      "title": "Not Found",
      "detail": "client not found",
      "meta": {
        "path": "/clients/:id",
        "method": "PATCH",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.not_found",
        "langInterpolation": {
          "model": "client"
        }
      }
    }
  ]
}
```

#### 400 - Invalid request body (bad-request)
```json
{
  "errors": [
    {
      "id": "BAD_REQUEST_ERROR-timestamp",
      "status": "400",
      "code": "BAD_REQUEST_ERROR",
      "title": "Bad Request",
      "detail": "Invalid request body",
      "meta": {
        "path": "/clients/:id",
        "method": "PATCH",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.bad_request",
        "langInterpolation": {}
      }
    }
  ]
}
```

#### 401 - Invalid token (unauthorized)
```json
{
  "errors": [
    {
      "id": "UNAUTHORIZED_ERROR-timestamp",
      "status": "401",
      "code": "UNAUTHORIZED_ERROR",
      "title": "Unauthorized",
      "detail": "Invalid token in request",
      "meta": {
        "path": "/clients/:id",
        "method": "PATCH",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.unauthorized",
        "langInterpolation": {}
      }
    }
  ]
}
```

---

# [Client] Eliminar cliente

## DELETE@/clients/:id
`https://{domain}/clients/:id`

Elimina un cliente del sistema. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | String | Sí | ID único del cliente |

### Respuestas

#### 200 - Cliente eliminado (client-deleted)
```json
{
  "message": "Entity deleted successfully"
}
```

#### 404 - Resource not found (not-found)
```json
{
  "errors": [
    {
      "id": "NOT_FOUND_ERROR-timestamp",
      "status": "404",
      "code": "NOT_FOUND_ERROR",
      "title": "Not Found",
      "detail": "client not found",
      "meta": {
        "path": "/clients/:id",
        "method": "DELETE",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.not_found",
        "langInterpolation": {
          "model": "client"
        }
      }
    }
  ]
}
```

#### 401 - Invalid token (unauthorized)
```json
{
  "errors": [
    {
      "id": "UNAUTHORIZED_ERROR-timestamp",
      "status": "401",
      "code": "UNAUTHORIZED_ERROR",
      "title": "Unauthorized",
      "detail": "Invalid token in request",
      "meta": {
        "path": "/clients/:id",
        "method": "DELETE",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.unauthorized",
        "langInterpolation": {}
      }
    }
  ]
}
```
