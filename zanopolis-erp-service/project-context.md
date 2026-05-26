# Contexto Funcional Completo del Sistema ERP Pastelero

## Visión General del Sistema

El sistema nace de una necesidad muy específica:

pasar de manejar la pastelería “mentalmente” o en múltiples herramientas separadas, a tener una plataforma centralizada que permita:

* conocer costos reales
* entender ganancias reales
* controlar inventario
* planificar producción
* manejar flujo de caja
* reducir desperdicio
* escalar operaciones

La idea no es crear un ERP gigantesco tipo Odoo, sino un sistema especializado en producción pastelera/artesanal, enfocado en simplicidad operativa pero construido con arquitectura empresarial escalable.

---

# Filosofía Operativa del Sistema

El negocio tiene varias realidades importantes:

## Realidad 1 — Las recetas NO son solo ingredientes

Una torta realmente cuesta:

* harina
* huevos
* azúcar
* esencia
* frosting
* cajas
* stickers
* bolsas
* mano de obra
* energía implícita
* desperdicio implícito

Por eso el sistema no maneja únicamente “inventario”.

Maneja:

* costos de producción completos
* costos históricos
* utilidad real

---

## Realidad 2 — El precio de ingredientes cambia constantemente

Hoy:

* harina = 10 pesos por gramo

Mañana:

* harina = 14 pesos por gramo

Entonces:

* el costo de las recetas cambia
* el margen cambia
* la utilidad cambia

Por eso:

* las recetas recalculan automáticamente
* PERO las ventas históricas NO cambian

Esto es extremadamente importante contablemente.

---

## Realidad 3 — Producción y venta no siempre ocurren al mismo tiempo

El flujo deseado evolucionará hacia:

```txt
Producción semanal → stock disponible → ventas durante la semana
```

Pero actualmente también existe:

```txt
Pedido personalizado → producir → vender
```

Por eso el sistema soporta ambos modelos:

* Make To Order
* Make To Stock

---

# Arquitectura Conceptual del Negocio

El sistema se divide en módulos especializados que colaboran entre sí.

---

# 1. Módulo de Ingredientes

## Objetivo Humano

Representa todo lo físico consumible que entra al negocio.

Ejemplos:

* harina
* azúcar
* mantequilla
* huevos
* vainilla
* chocolate
* cajas
* stickers
* bolsas

El sistema trata TODO como “ingrediente” porque todos generan:

* costo
* inventario
* consumo

---

# Qué problema resuelve

Antes:

* “más o menos” se sabe cuánto cuesta algo

Ahora:

* el sistema conoce el costo exacto por unidad base

Ejemplo:

```txt
Compré 1000 gramos de harina por 8.000
→ costo por gramo = 8
```

Eso permite calcular costos reales de recetas.

---

# Responsabilidades

## Maneja

* stock actual
* costo promedio
* stock mínimo
* alertas
* unidad base

---

# Cómo se comunica

## Con Compras

Las compras:

* aumentan stock
* recalculan costos

---

## Con Recetas

Las recetas:

* consumen ingredientes
* leen costo unitario

---

## Con Producción

La producción:

* descuenta ingredientes reales

---

## Con Merma

La merma:

* reduce stock

---

# 2. Módulo de Compras

## Objetivo Humano

Registrar TODO lo que el negocio compra.

No es simplemente inventario.

También es:

* salida de dinero
* actualización de costos
* trazabilidad financiera

---

# Flujo Humano

```txt
Voy al proveedor
↓
Compro varias cosas
↓
Registro factura/compra
↓
El sistema:
- aumenta stock
- recalcula costos
- registra egreso
```

---

# Problema que resuelve

Antes:

* no se sabe cuánto dinero se ha invertido realmente

Ahora:

* el sistema conoce:

  * cuánto costó
  * dónde se compró
  * cuándo
  * cómo afectó inventario

---

# Comunicación entre módulos

## Hacia Inventario

Incrementa stock.

---

## Hacia Finanzas

Genera:

* egreso
* movimiento contable

---

## Hacia Recetas

Puede modificar:

* costo promedio ingredientes

Eso desencadena:

* recalcular recetas

---

# 3. Módulo de Recetas

## Objetivo Humano

Es el núcleo intelectual del negocio.

Aquí realmente se define:

* cuánto cuesta producir algo
* cuánto debería venderse
* cuánto gana el negocio

---

# Qué representa

Una receta NO es solo cocina.

Es:

* estructura productiva
* fórmula financiera
* plantilla de producción

---

# Qué contiene

## Ingredientes

Ejemplo:

```txt
Harina → 300g
Azúcar → 200g
```

---

## Subrecetas

Ejemplo:

```txt
Frosting de vainilla
Relleno chocolate
```

---

## Mano de obra

Ejemplo:

```txt
1 hora → 10.000
```

---

## Empaques

Ejemplo:

```txt
Caja
Sticker
Bolsa
```

---

## Margen

Ejemplo:

```txt
40%
```

---

# Qué calcula

## Costos reales

```txt
Ingredientes
+
subrecetas
+
mano obra
+
empaques
```

---

## Precio sugerido

Usando margen.

---

## Utilidad esperada

```txt
precioVenta - costoProduccion
```

---

# Comunicación entre módulos

## Lee Ingredientes

Para calcular costos.

---

## Alimenta Producción

Producción usa recetas como blueprint.

---

## Alimenta Ventas

Ventas usan:

* precio sugerido
* snapshots costos

---

# 4. Módulo de Producción

## Objetivo Humano

Representa el acto REAL de fabricar productos.

Esto es extremadamente importante porque:

una receta es teórica,
pero producción es ejecución real.

---

# Diferencia clave

## Receta

```txt
Cómo debería hacerse
```

---

## Producción

```txt
Qué realmente se fabricó
```

---

# Problema que resuelve

Sin producción:

* el sistema no sabe qué se cocinó
* el inventario sería incorrecto
* las ganancias serían irreales

---

# Qué ocurre al producir

## El sistema:

### 1. descuenta ingredientes

```txt
Harina -500g
Azúcar -200g
```

---

### 2. crea movimientos inventario

Para trazabilidad.

---

### 3. aumenta stock producto terminado

Ejemplo:

```txt
Torta zanahoria +5
```

---

# Producción programada

El sistema soporta:

```txt
Hornear el domingo toda la semana
```

Entonces se puede:

* programar producción futura
* prever consumo inventario

---

# Producción automática desde venta

Si olvidaste registrar producción:

la venta puede:

* producir automáticamente
* vender inmediatamente

---

# Comunicación entre módulos

## Consume Recetas

Lee blueprint.

---

## Consume Ingredientes

Descuenta stock.

---

## Alimenta Ventas

Genera stock vendible.

---

# 5. Módulo de Producto Terminado

## Objetivo Humano

Separar:

* ingredientes
  de
* productos listos para vender

Porque:

* una torta no es un ingrediente
* una torta es inventario vendible

---

# Qué maneja

```txt
Torta zanahoria grande
Disponible: 4
```

---

# Problema que resuelve

Permite:

* vender stock ya producido
* manejar horneadas semanales
* saber qué hay listo

---

# Comunicación

## Producción incrementa stock

---

## Ventas descuenta stock

---

# 6. Módulo de Ventas

## Objetivo Humano

Registrar ingresos reales del negocio.

Pero además:

* controlar utilidad
* mantener trazabilidad histórica

---

# Flujo humano

```txt
Cliente compra
↓
Selecciono producto
↓
Puedo modificar precio
↓
Registro pago
↓
El sistema:
- descuenta stock
- registra ingreso
- calcula utilidad
```

---

# Qué problema resuelve

Antes:

* solo entra dinero

Ahora:

* se sabe:

  * cuánto ingresó
  * cuánto costó producir
  * cuánto se ganó realmente

---

# Concepto CRÍTICO — Snapshot Histórico

Cuando vendes:

el sistema guarda:

* costo producción momento exacto
* precio venta exacto

Aunque mañana cambien costos:

* la venta histórica NO cambia

Esto es fundamental.

---

# Comunicación entre módulos

## Consume Producto Terminado

Reduce stock.

---

## Alimenta Finanzas

Genera ingresos.

---

## Usa Producción

Puede producir automáticamente.

---

## Usa Clientes

Asocia ventas.

---

# 7. Módulo de Clientes

## Objetivo Humano

Mantener historial básico comercial.

---

# Qué contiene

* nombre
* teléfono
* dirección
* observaciones

---

# Futuro

Permite:

* clientes frecuentes
* métricas
* recordatorios
* fidelización

---

# Comunicación

## Ventas referencia clientes

---

# 8. Módulo Financiero

## Objetivo Humano

Entender:

* cuánto dinero entra
* cuánto sale
* cuánto realmente gana el negocio

---

# Diferencia importante

## Ingreso

```txt
Entró dinero
```

---

## Ganancia

```txt
Ingresó - costos reales
```

---

# Qué registra

## Ingresos

Desde:

* ventas

---

## Egresos

Desde:

* compras

---

# Qué calcula

## Flujo caja

```txt
Ingresos - egresos
```

---

## Utilidad

```txt
Ventas - costos producción
```

---

# Comunicación

## Compras generan egresos

---

## Ventas generan ingresos

---

## Dashboard consume métricas

---

# 9. Módulo de Inventario

## Objetivo Humano

Mantener consistencia absoluta del stock.

---

# Importante

Inventario NO es una tabla.

Es el resultado de:

* compras
* producción
* ventas
* merma

---

# Concepto clave

## InventoryMovement

Toda modificación inventario genera movimiento:

```txt
IN
OUT
WASTE
ADJUSTMENT
```

---

# Beneficio

Permite:

* auditoría
* trazabilidad
* debugging
* historial

---

# Comunicación

## Compras suman

---

## Producción resta

---

## Ventas restan producto terminado

---

## Merma resta

---

# 10. Módulo de Merma

## Objetivo Humano

Registrar pérdidas reales.

---

# Qué representa

Ejemplos:

* torta dañada
* ingrediente vencido
* prueba fallida
* error cocina

---

# Problema que resuelve

Sin merma:

* ganancias serían irreales
* inventario sería falso

---

# Comunicación

## Reduce inventario

---

## Puede afectar análisis financiero futuro

---

# 11. Dashboard

## Objetivo Humano

Tener una visión ejecutiva rápida del negocio.

---

# Qué muestra

## Ventas

* hoy
* semana
* mes

---

## Utilidad

* hoy
* semana
* mes

---

## Producción

* pendientes
* programadas

---

## Inventario crítico

* ingredientes bajos

---

# Problema que resuelve

Evita:

* entrar módulo por módulo

---

# Flujo Global Real del Sistema

# Escenario completo

---

## Paso 1 — Comprar ingredientes

```txt
Compra harina
↓
Aumenta stock
↓
Registra egreso
↓
Actualiza costos promedio
```

---

## Paso 2 — Recetas recalculan

```txt
Harina cambió costo
↓
Torta recalcula costo
↓
Precio sugerido cambia
```

---

## Paso 3 — Producción

```txt
Produzco 10 tortas
↓
Descuento ingredientes
↓
Incremento stock productos terminados
```

---

## Paso 4 — Venta

```txt
Vendo 2 tortas
↓
Descuento producto terminado
↓
Registro ingreso
↓
Calculo utilidad real
```

---

# Filosofía Técnica del Proyecto

Aunque inicia como:

* MVP
* sistema interno

La arquitectura está diseñada para:

* crecer sin romper módulos
* soportar multiusuario futuro
* soportar automatizaciones
* soportar eventos dominio
* soportar analytics
* soportar microservicios futuros

---

# Filosofía Arquitectónica

## Arquitectura Hexagonal

Porque permite:

* desacoplar negocio de frameworks
* cambiar BD sin romper dominio
* agregar APIs futuras
* agregar workers/eventos
* mantener testabilidad alta

---

# Filosofía Frontend

La aplicación debe sentirse:

* rápida
* limpia
* minimalista
* moderna
* extremadamente intuitiva

Inspiración:

* Notion
* Linear
* Stripe Dashboard
* ERP minimalistas modernos

---

# Filosofía UX

El usuario NO debe sentir:

* complejidad ERP tradicional
* formularios gigantes
* procesos pesados

Debe sentirse:

* casi como una app móvil
* rápida
* enfocada
* productiva

---

# Filosofía Escalabilidad

Aunque inicialmente:

* solo existe 1 usuario

El sistema debe quedar listo para:

* empleados
* roles
* permisos
* múltiples sedes
* múltiples cocinas
* múltiples marcas
* analytics avanzados
* automatizaciones WhatsApp
* IA futura
* forecasting inventario
* producción predictiva
