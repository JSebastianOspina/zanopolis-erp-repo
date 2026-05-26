# Sale API

Este módulo gestiona las ventas, que son ingresos reales para la pastelería.

## Endpoints

### 1. Crear Venta
Este es un endpoint crítico. Realiza múltiples operaciones de forma atómica:
- Valida si hay `ProductStock` suficiente para vender.
- Si no hay suficiente stock y se pasa `createProductionIfNeeded=true`, generará automáticamente una `ProductionOrder` y la completará al instante (descontando ingredientes).
- Descuenta el producto terminado de `ProductStock`.
- Guarda en el `SaleItem` un snapshot del costo de producción en ese momento exacto y calcula la utilidad real (`unitProfitSnapshot`). Esto garantiza que los cambios futuros de precios no afecten el historial.
- Genera un `FinancialMovement` de tipo `INCOME`.
- **URL**: `/sales`
- **Method**: `POST`
- **Query params**: `?createProductionIfNeeded=true` (opcional)

### 2. Buscar Ventas
- **URL**: `/sales`
- **Method**: `GET`

### 3. Obtener Venta
- **URL**: `/sales/:id`
- **Method**: `GET`

### 4. Eliminar Venta
- **URL**: `/sales/:id`
- **Method**: `DELETE`
