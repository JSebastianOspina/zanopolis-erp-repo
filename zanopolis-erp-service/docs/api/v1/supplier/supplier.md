# [Supplier] Crear proveedor

## POST@/suppliers
`https://{domain}/suppliers`

Crea un nuevo proveedor en el sistema. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.
* El nombre del proveedor es obligatorio.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| body | CreateSupplierDto | Sí | Datos del proveedor a crear |

### Solicitudes (body)
**Proveedor completo (full-supplier)**
```json
{
  "name": "Proveedor S.A.",
  "phone": "+123456789",
  "notes": "Entrega los lunes"
}
```

**Solo campos obligatorios (minimal-supplier)**
```json
{
  "name": "Proveedor B"
}
```

### Respuestas

#### 201 - Proveedor creado (supplier-created)
```json
{
  "data": {
    "type": "supplier",
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "attributes": {
      "name": "Proveedor S.A.",
      "phone": "+123456789",
      "notes": "Entrega los lunes"
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
        "path": "/suppliers",
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
        "path": "/suppliers",
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

# [Supplier] Buscar proveedores

## GET@/suppliers
`https://{domain}/suppliers`

Obtiene una lista paginada de proveedores. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.
* Soporta paginación a través de limit y offset.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| limit | Number | No | Número de ítems por página |
| offset | Number | No | Número de ítems a saltar |

### Respuestas

#### 200 - Colección con resultados (suppliers-collection)
```json
{
  "data": [
    {
      "type": "supplier",
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "attributes": {
        "name": "Proveedor S.A.",
        "phone": "+123456789",
        "notes": "Entrega los lunes"
      }
    }
  ],
  "meta": {
    "total": 1
  }
}
```

#### 200 - Colección vacía (empty-suppliers)
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
        "path": "/suppliers",
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

# [Supplier] Obtener proveedor por ID

## GET@/suppliers/:id
`https://{domain}/suppliers/:id`

Obtiene los detalles de un proveedor específico. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | String | Sí | ID único del proveedor |

### Respuestas

#### 200 - Proveedor encontrado (supplier-found)
```json
{
  "data": {
    "type": "supplier",
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "attributes": {
      "name": "Proveedor S.A.",
      "phone": "+123456789",
      "notes": "Entrega los lunes"
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
      "detail": "supplier not found",
      "meta": {
        "path": "/suppliers/:id",
        "method": "GET",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.not_found",
        "langInterpolation": {
          "model": "supplier"
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
        "path": "/suppliers/:id",
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

# [Supplier] Actualizar proveedor

## PATCH@/suppliers/:id
`https://{domain}/suppliers/:id`

Actualiza los datos de un proveedor existente. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | String | Sí | ID único del proveedor |
| body | UpdateSupplierDto | Sí | Datos del proveedor a actualizar |

### Solicitudes (body)
**Actualizar todos los campos (update-all)**
```json
{
  "name": "Proveedor Modificado",
  "phone": "+987654321"
}
```

**Actualizar solo un campo (update-minimal)**
```json
{
  "name": "Nuevo Nombre"
}
```

### Respuestas

#### 200 - Proveedor actualizado (supplier-updated)
```json
{
  "data": {
    "type": "supplier",
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "attributes": {
      "name": "Proveedor Modificado",
      "phone": "+987654321",
      "notes": "Entrega los lunes"
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
      "detail": "supplier not found",
      "meta": {
        "path": "/suppliers/:id",
        "method": "PATCH",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.not_found",
        "langInterpolation": {
          "model": "supplier"
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
        "path": "/suppliers/:id",
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
        "path": "/suppliers/:id",
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

# [Supplier] Eliminar proveedor

## DELETE@/suppliers/:id
`https://{domain}/suppliers/:id`

Elimina un proveedor del sistema. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | String | Sí | ID único del proveedor |

### Respuestas

#### 200 - Proveedor eliminado (supplier-deleted)
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
      "detail": "supplier not found",
      "meta": {
        "path": "/suppliers/:id",
        "method": "DELETE",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.not_found",
        "langInterpolation": {
          "model": "supplier"
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
        "path": "/suppliers/:id",
        "method": "DELETE",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.unauthorized",
        "langInterpolation": {}
      }
    }
  ]
}
```
