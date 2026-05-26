# [Ingredient] Crear ingrediente

## POST@/ingredients
`https://{domain}/ingredients`

Crea un nuevo ingrediente en el inventario. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.
* Nombre, unidad y categoría son obligatorios.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| body | CreateIngredientDto | Sí | Datos del ingrediente a crear |

### Solicitudes (body)
**Ingrediente completo (full-ingredient)**
```json
{
  "name": "Harina de Trigo",
  "unit": "kg",
  "currentStock": 10.5,
  "minimumStock": 2.0,
  "averageCostPerUnit": 5.5,
  "category": "RAW_MATERIAL",
  "isActive": true
}
```

**Solo campos obligatorios (minimal-ingredient)**
```json
{
  "name": "Azúcar",
  "unit": "kg",
  "category": "RAW_MATERIAL"
}
```

### Respuestas

#### 201 - Ingrediente creado (ingredient-created)
```json
{
  "data": {
    "type": "ingredient",
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "attributes": {
      "name": "Harina de Trigo",
      "unit": "kg",
      "currentStock": 10.5,
      "minimumStock": 2.0,
      "averageCostPerUnit": 5.5,
      "category": "RAW_MATERIAL",
      "isActive": true
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
        "path": "/ingredients",
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
        "path": "/ingredients",
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

# [Ingredient] Obtener ingredientes con stock bajo

## GET@/ingredients/low-stock
`https://{domain}/ingredients/low-stock`

Obtiene una lista de ingredientes cuyo stock actual es menor o igual al stock mínimo. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
Ninguno

### Respuestas

#### 200 - Colección con resultados (low-stock-collection)
```json
{
  "data": [
    {
      "type": "ingredient",
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "attributes": {
        "name": "Harina de Trigo",
        "unit": "kg",
        "currentStock": 1.5,
        "minimumStock": 2.0,
        "category": "RAW_MATERIAL"
      }
    }
  ]
}
```

#### 200 - Sin stock bajo (empty-low-stock)
```json
{
  "data": []
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
        "path": "/ingredients/low-stock",
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

# [Ingredient] Buscar ingredientes

## GET@/ingredients
`https://{domain}/ingredients`

Obtiene una lista paginada de ingredientes. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.
* Soporta paginación a través de limit y offset.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| limit | Number | No | Número de ítems por página |
| offset | Number | No | Número de ítems a saltar |

### Respuestas

#### 200 - Colección con resultados (ingredients-collection)
```json
{
  "data": [
    {
      "type": "ingredient",
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "attributes": {
        "name": "Harina de Trigo",
        "unit": "kg",
        "category": "RAW_MATERIAL"
      }
    }
  ],
  "meta": {
    "total": 1
  }
}
```

#### 200 - Colección vacía (empty-ingredients)
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
        "path": "/ingredients",
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

# [Ingredient] Obtener ingrediente por ID

## GET@/ingredients/:id
`https://{domain}/ingredients/:id`

Obtiene los detalles de un ingrediente específico. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | String | Sí | ID único del ingrediente |

### Respuestas

#### 200 - Ingrediente encontrado (ingredient-found)
```json
{
  "data": {
    "type": "ingredient",
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "attributes": {
      "name": "Harina de Trigo",
      "unit": "kg",
      "category": "RAW_MATERIAL"
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
      "detail": "ingredient not found",
      "meta": {
        "path": "/ingredients/:id",
        "method": "GET",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.not_found",
        "langInterpolation": {
          "model": "ingredient"
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
        "path": "/ingredients/:id",
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

# [Ingredient] Actualizar ingrediente

## PATCH@/ingredients/:id
`https://{domain}/ingredients/:id`

Actualiza los datos de un ingrediente existente. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | String | Sí | ID único del ingrediente |
| body | UpdateIngredientDto | Sí | Datos del ingrediente a actualizar |

### Solicitudes (body)
**Actualizar varios campos (update-all)**
```json
{
  "name": "Harina Integral",
  "minimumStock": 3.0
}
```

### Respuestas

#### 200 - Ingrediente actualizado (ingredient-updated)
```json
{
  "data": {
    "type": "ingredient",
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "attributes": {
      "name": "Harina Integral",
      "unit": "kg",
      "category": "RAW_MATERIAL",
      "minimumStock": 3.0
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
      "detail": "ingredient not found",
      "meta": {
        "path": "/ingredients/:id",
        "method": "PATCH",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.not_found",
        "langInterpolation": {
          "model": "ingredient"
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
        "path": "/ingredients/:id",
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
        "path": "/ingredients/:id",
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

# [Ingredient] Eliminar ingrediente

## DELETE@/ingredients/:id
`https://{domain}/ingredients/:id`

Elimina un ingrediente del sistema. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | String | Sí | ID único del ingrediente |

### Respuestas

#### 200 - Ingrediente eliminado (ingredient-deleted)
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
      "detail": "ingredient not found",
      "meta": {
        "path": "/ingredients/:id",
        "method": "DELETE",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.not_found",
        "langInterpolation": {
          "model": "ingredient"
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
        "path": "/ingredients/:id",
        "method": "DELETE",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.unauthorized",
        "langInterpolation": {}
      }
    }
  ]
}
```
