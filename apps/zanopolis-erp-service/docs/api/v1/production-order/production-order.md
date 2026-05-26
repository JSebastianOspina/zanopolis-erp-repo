# Production Order API

Este módulo maneja las órdenes de producción del ERP. Provee el registro de lo que se va a fabricar o de lo que se ha fabricado.

Las órdenes de producción son importantes porque transforman inventario de ingredientes (disminuyéndolo) en inventario de producto terminado (aumentándolo).

## Endpoints

### 1. Crear Orden de Producción
Crea una orden en estado `PLANNED`. No genera descuentos de inventario hasta que se complete.
- **URL**: `/production-orders`
- **Method**: `POST`
- **Auth required**: Sí

### 2. Buscar Órdenes
Lista de forma paginada las órdenes.
- **URL**: `/production-orders`
- **Method**: `GET`
- **Auth required**: Sí

### 3. Próximas Órdenes
Obtiene las órdenes que están en estado `PLANNED` y cuya fecha de programación (`scheduledDate`) es mayor o igual a la fecha actual. Útil para dashboards.
- **URL**: `/production-orders/upcoming`
- **Method**: `GET`
- **Auth required**: Sí

### 4. Obtener Orden por ID
- **URL**: `/production-orders/:id`
- **Method**: `GET`
- **Auth required**: Sí

### 5. Actualizar Orden
- **URL**: `/production-orders/:id`
- **Method**: `PATCH`
- **Auth required**: Sí

### 6. Completar Orden
Marca la orden como `COMPLETED`.  
**Flujo crítico:**
- Valida que haya inventario de los ingredientes involucrados en la receta.
- Descuenta los ingredientes (`Ingredient.currentStock`) y crea `InventoryMovement OUT` para cada uno.
- Acumula el costo en base al promedio (`averageCostPerUnit`) de los ingredientes utilizados más la mano de obra.
- Aumenta el `ProductStock` asociado a esa receta.
- Guarda un snapshot histórico de los costos para garantizar trazabilidad.
- **URL**: `/production-orders/:id/complete`
- **Method**: `POST`
- **Auth required**: Sí

### 7. Eliminar Orden
- **URL**: `/production-orders/:id`
- **Method**: `DELETE`
- **Auth required**: Sí
