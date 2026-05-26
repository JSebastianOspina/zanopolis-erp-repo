# [Recipe] Crear receta

## POST@/recipes
`https://{domain}/recipes`

Crea una nueva receta en el sistema. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.
* Nombre y al menos un ítem son obligatorios.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| body | CreateRecipeDto | Sí | Datos de la receta |

### Solicitudes (body)
**Receta completa (full-recipe)**
```json
{
  "name": "Torta de Chocolate",
  "laborCost": 5000,
  "marginPercentage": 30,
  "customSalePrice": 25000,
  "isActive": true,
  "items": [
    {
      "type": "INGREDIENT",
      "referenceId": "123e4567-e89b-12d3-a456-426614174000",
      "quantity": 1.5
    }
  ]
}
```

**Receta mínima (minimal-recipe)**
```json
{
  "name": "Masa Básica",
  "items": [
    {
      "type": "INGREDIENT",
      "referenceId": "123e4567-e89b-12d3-a456-426614174000",
      "quantity": 1.0
    }
  ]
}
```

### Respuestas

#### 201 - Receta creada (recipe-created)
```json
{
  "data": {
    "type": "recipe",
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "attributes": {
      "name": "Torta de Chocolate",
      "laborCost": 5000,
      "marginPercentage": 30,
      "customSalePrice": 25000,
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
        "path": "/recipes",
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
        "path": "/recipes",
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

# [Recipe] Duplicar receta

## POST@/recipes/:id/duplicate
`https://{domain}/recipes/:id/duplicate`

Crea una copia exacta de una receta existente. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | String | Sí | ID de la receta a duplicar |

### Respuestas

#### 201 - Receta duplicada (recipe-duplicated)
```json
{
  "data": {
    "type": "recipe",
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "attributes": {
      "name": "Torta de Chocolate (Copia)",
      "laborCost": 5000,
      "isActive": true
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
      "detail": "recipe not found",
      "meta": {
        "path": "/recipes/:id/duplicate",
        "method": "POST",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.not_found",
        "langInterpolation": {
          "model": "recipe"
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
        "path": "/recipes/:id/duplicate",
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

# [Recipe] Recalcular costo

## POST@/recipes/:id/recalculate-cost
`https://{domain}/recipes/:id/recalculate-cost`

Recalcula el costo total de la receta basado en los precios actuales de los ingredientes. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | String | Sí | ID de la receta a recalcular |

### Respuestas

#### 201 - Costo recalculado (cost-recalculated)
```json
{
  "data": {
    "type": "recipe",
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "attributes": {
      "name": "Torta de Chocolate",
      "totalCost": 15000
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
      "detail": "recipe not found",
      "meta": {
        "path": "/recipes/:id/recalculate-cost",
        "method": "POST",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.not_found",
        "langInterpolation": {
          "model": "recipe"
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
        "path": "/recipes/:id/recalculate-cost",
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

# [Recipe] Buscar recetas

## GET@/recipes
`https://{domain}/recipes`

Obtiene una lista paginada de recetas. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.
* Soporta paginación a través de limit y offset.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| limit | Number | No | Número de ítems por página |
| offset | Number | No | Número de ítems a saltar |

### Respuestas

#### 200 - Colección con resultados (recipes-collection)
```json
{
  "data": [
    {
      "type": "recipe",
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "attributes": {
        "name": "Torta de Chocolate"
      }
    }
  ],
  "meta": {
    "total": 1
  }
}
```

#### 200 - Colección vacía (empty-recipes)
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
        "path": "/recipes",
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

# [Recipe] Obtener receta por ID

## GET@/recipes/:id
`https://{domain}/recipes/:id`

Obtiene los detalles de una receta específica. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | String | Sí | ID único de la receta |

### Respuestas

#### 200 - Receta encontrada (recipe-found)
```json
{
  "data": {
    "type": "recipe",
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "attributes": {
      "name": "Torta de Chocolate"
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
      "detail": "recipe not found",
      "meta": {
        "path": "/recipes/:id",
        "method": "GET",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.not_found",
        "langInterpolation": {
          "model": "recipe"
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
        "path": "/recipes/:id",
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

# [Recipe] Actualizar receta

## PATCH@/recipes/:id
`https://{domain}/recipes/:id`

Actualiza los datos de una receta existente. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | String | Sí | ID único de la receta |
| body | UpdateRecipeDto | Sí | Datos de la receta a actualizar |

### Solicitudes (body)
**Actualizar varios campos (update-all)**
```json
{
  "name": "Torta de Vainilla",
  "laborCost": 6000
}
```

### Respuestas

#### 200 - Receta actualizada (recipe-updated)
```json
{
  "data": {
    "type": "recipe",
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "attributes": {
      "name": "Torta de Vainilla",
      "laborCost": 6000
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
      "detail": "recipe not found",
      "meta": {
        "path": "/recipes/:id",
        "method": "PATCH",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.not_found",
        "langInterpolation": {
          "model": "recipe"
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
        "path": "/recipes/:id",
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
        "path": "/recipes/:id",
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

# [Recipe] Eliminar receta

## DELETE@/recipes/:id
`https://{domain}/recipes/:id`

Elimina una receta del sistema. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | String | Sí | ID único de la receta |

### Respuestas

#### 200 - Receta eliminada (recipe-deleted)
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
      "detail": "recipe not found",
      "meta": {
        "path": "/recipes/:id",
        "method": "DELETE",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.not_found",
        "langInterpolation": {
          "model": "recipe"
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
        "path": "/recipes/:id",
        "method": "DELETE",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.unauthorized",
        "langInterpolation": {}
      }
    }
  ]
}
```
