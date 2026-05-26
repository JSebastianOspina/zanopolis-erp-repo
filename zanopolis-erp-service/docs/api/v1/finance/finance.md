# Finance API

El módulo financiero consolida la información de ingresos (`INCOME`), egresos (`EXPENSE`) y la utilidad real (`netProfit`) basada en los snapshots de venta de la pastelería.

## Endpoints

### 1. Resumen Diario
Consolida los movimientos de una fecha dada.
- **URL**: `/finance/daily`
- **Method**: `GET`
- **Query Params**: `date=YYYY-MM-DD`

### 2. Resumen Mensual
Consolida los movimientos de un mes y año dados.
- **URL**: `/finance/monthly`
- **Method**: `GET`
- **Query Params**: `year=YYYY&month=MM`
