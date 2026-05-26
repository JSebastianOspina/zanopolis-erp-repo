# Inventory API

Este módulo gestiona el historial de movimientos de inventario (`InventoryMovement`) y el registro de mermas (`WasteRecord`).

## Endpoints

### 1. Buscar Movimientos de Inventario
Los movimientos son de solo lectura porque se generan automáticamente a partir de compras, producción, ventas o mermas.
- **URL**: `/inventory-movements`
- **Method**: `GET`

### 2. Registrar Merma (WasteRecord)
Permite registrar pérdidas. Tiene un comportamiento dual dependiendo del `referenceType`:
- **Si es `INGREDIENT`**: Descuenta el inventario del ingrediente (`currentStock`) y genera un movimiento `WASTE`.
- **Si es `RECIPE`**: Descuenta el inventario del producto terminado (`ProductStock.availableQuantity`). El costo de los ingredientes ya fue asumido durante la producción, por lo que no se generan movimientos retroactivos de ingredientes.
- **URL**: `/waste-records`
- **Method**: `POST`

### 3. Buscar Registros de Merma
- **URL**: `/waste-records`
- **Method**: `GET`
