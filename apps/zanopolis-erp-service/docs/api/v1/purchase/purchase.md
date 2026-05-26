# [Purchase] Registrar compra

## POST@/purchases
`https://{domain}/purchases`

Registra una nueva compra de ingredientes a un proveedor. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.
* Al menos un ítem debe estar presente en la lista de items.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| body | CreatePurchaseDto | Sí | Datos de la compra |

### Solicitudes (body)
**Compra con varios ítems (full-purchase)**
```json
{
  "supplierId": "123e4567-e89b-12d3-a456-426614174000",
  "paymentMethod": "TRANSFER",
  "items": [
    {
      "ingredientId": "123e4567-e89b-12d3-a456-426614174001",
      "quantity": 1000,
      "totalCost": 12000
    },
    {
      "ingredientId": "123e4567-e89b-12d3-a456-426614174002",
      "quantity": 500,
      "totalCost": 5000
    }
  ]
}
```

**Compra mínima (minimal-purchase)**
```json
{
  "supplierId": "123e4567-e89b-12d3-a456-426614174000",
  "paymentMethod": "CASH",
  "items": [
    {
      "ingredientId": "123e4567-e89b-12d3-a456-426614174001",
      "quantity": 1000,
      "totalCost": 12000
    }
  ]
}
```

### Respuestas

#### 201 - Compra creada (purchase-created)
```json
{
  "data": {
    "type": "purchase",
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "attributes": {
      "supplierId": "123e4567-e89b-12d3-a456-426614174000",
      "paymentMethod": "TRANSFER",
      "totalCost": 17000,
      "purchaseDate": "2026-05-17T18:00:00.000Z"
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
        "path": "/purchases",
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
        "path": "/purchases",
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

# [Purchase] Buscar compras

## GET@/purchases
`https://{domain}/purchases`

Obtiene una lista paginada de compras registradas. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.
* Soporta paginación a través de limit y offset.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| limit | Number | No | Número de ítems por página |
| offset | Number | No | Número de ítems a saltar |

### Respuestas

#### 200 - Colección con resultados (purchases-collection)
```json
{
  "data": [
    {
      "type": "purchase",
      "id": "123e4567-e89b-12d3-a456-426614174003",
      "attributes": {
        "supplierId": "123e4567-e89b-12d3-a456-426614174000",
        "paymentMethod": "TRANSFER",
        "totalCost": 17000,
        "purchaseDate": "2026-05-17T18:00:00.000Z"
      }
    }
  ],
  "meta": {
    "total": 1
  }
}
```

#### 200 - Colección vacía (empty-purchases)
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
        "path": "/purchases",
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

# [Purchase] Obtener compra por ID

## GET@/purchases/:id
`https://{domain}/purchases/:id`

Obtiene los detalles de una compra específica. Requiere autenticación.

### Consideraciones
* Requiere estar autenticado en el sistema.

### Parámetros
| Nombre | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | String | Sí | ID único de la compra |

### Respuestas

#### 200 - Compra encontrada (purchase-found)
```json
{
  "data": {
    "type": "purchase",
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "attributes": {
      "supplierId": "123e4567-e89b-12d3-a456-426614174000",
      "paymentMethod": "TRANSFER",
      "totalCost": 17000,
      "purchaseDate": "2026-05-17T18:00:00.000Z"
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
      "detail": "purchase not found",
      "meta": {
        "path": "/purchases/:id",
        "method": "GET",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.not_found",
        "langInterpolation": {
          "model": "purchase"
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
        "path": "/purchases/:id",
        "method": "GET",
        "timestamp": "2026-05-17T18:00:00.000Z",
        "langKey": "backend_exception.unauthorized",
        "langInterpolation": {}
      }
    }
  ]
}
```
