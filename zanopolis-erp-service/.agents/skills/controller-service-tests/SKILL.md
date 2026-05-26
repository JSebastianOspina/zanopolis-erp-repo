---
name: controller-service-tests
description: Crear tests de controladores y servicios siguiendo la estructura, dependencias, mocking y cobertura definidas en las guías del proyecto. Usa esta skill cuando pidan tests de controlador o servicio, expect/rejectWithException, o alinear tests con arquitectura hexagonal y manejo de errores.
---

# Tests de Controladores y Servicios

Aplica esta habilidad **siempre que el usuario solicite crear los tests de un controlador o de un servicio**. Sigue las reglas siguientes sin excepción.

---

## 1. Estructura y organización

- La estructura de carpetas de tests **debe reflejar** la de `src`.
- Cada archivo fuente debe tener un archivo de test asociado.
- **Ejemplo**: `src/modules/users/user.controller.ts` → `test/modules/users/user.controller.spec.ts`.

---

## 2. Si el objetivo es un CONTROLADOR

### Antes de escribir tests del controlador

1. **Validar la cadena de dependencias**: Comprobar que todos los métodos de servicio que usa el controlador tienen sus propios tests.
2. Para cada método de servicio usado: confirmar que existe suite de tests, cubre lógica de negocio, variaciones de entrada, manejo de errores e integración con dependencias.
3. **No avanzar** con los tests del controlador hasta que las dependencias (servicios y, si aplica, repositorios usados por esos servicios) tengan tests suficientes.

### Contenido de los tests del controlador

- Cada método del controlador debe tener su propia suite de tests.
- Verificar que el controlador:
  - Llama a los métodos de servicio correctos con los parámetros esperados.
  - Maneja correctamente respuestas de éxito y de error del servicio.
  - Devuelve los códigos HTTP adecuados.
  - Formatea la respuesta según la especificación de la API.
  - Valida los datos de entrada antes de pasarlos al servicio.

### Mocking en tests de controlador

- Mockear **todas** las dependencias de tipo servicio.
- Simular respuestas de éxito y de error del servicio según los casos de uso.

---

## 3. Si el objetivo es un SERVICIO

### Antes de escribir tests del servicio

1. Para cada método de repositorio o servicio externo que use el servicio: confirmar que ese método tiene su propia suite de tests (repositorio: CRUD, excepciones, transformación de datos, construcción de queries).
2. Asegurar cobertura suficiente en la cadena: Controlador → Servicio → Repositorio antes de dar por cerrados los tests del servicio.

### Contenido de los tests del servicio

- Cada método público del servicio debe tener su suite de tests.
- Cubrir: lógica de negocio, variaciones de entrada, manejo de errores e integración con repositorios y servicios externos.

### Excepciones en tests de servicio (solo dominio)

La skill de arquitectura hexagonal del proyecto exige que **los servicios solo lancen** subclases de `DomainException` definidas en `@/common/domain/exceptions/custom-exceptions` (base en `domain-exception.ts`). Los tests de servicio **deben reflejar ese contrato**, no el código incorrecto que aún importe excepciones de Nest.

- **En aserciones de error** (`rejects.toThrow`, `rejects.toMatchObject`, instancias esperadas, etc.) usa **únicamente** excepciones de `@/common/domain/exceptions/custom-exceptions` (o la clase base `DomainException` desde `@/common/domain/exceptions` cuando aplique comparar por tipo base).
- **No importes ni esperes** excepciones de `@nestjs/common` (`NotFoundException`, `BadRequestException`, `ForbiddenException`, `UnauthorizedException`, etc.) en tests de servicio, **aunque el método del servicio las use hoy por error**.
- **Mapeo mental**: el nombre suele coincidir con el equivalente de dominio (ej. recurso no encontrado → `NotFoundException` de `custom-exceptions/not-found-exception.ts`, no el de Nest). Si no existe la excepción de dominio adecuada, **créala** en `custom-exceptions` según la guía hexagonal; no uses Nest en el test para “hacer pasar” el suite.
- **Si el test falla** porque el servicio lanza una excepción de Nest mientras el test espera la de dominio: **corrige el servicio** para que lance solo excepciones de dominio. **No** cambies el test para esperar Nest ni para encajar con una violación de la regla del proyecto.

#### Cuando el fallo del test revela servicio o controlador mal alineados

Si al ejecutar o proponer tests de servicio queda claro que el código bajo prueba **sigue importando o lanzando** excepciones desde `@nestjs/common` en capas donde el proyecto exige dominio (`custom-exceptions`), **en tu respuesta al usuario** debes incluir un bloque muy visible con este encabezado exacto:

> **REQUIERE ATENCION INMEDIATA**

Debajo de ese encabezado, explica de forma breve que el test está bien al esperar `DomainException` / `custom-exceptions` y que el fallo indica **deuda en el código de aplicación**, no en el test. Sugiere de forma concreta:

- Sustituir el import y el `throw` en el **servicio** (u otra capa que corresponda según la skill hexagonal) por la clase equivalente en `@/common/domain/exceptions/custom-exceptions`.
- Si el problema está en el **controlador** (import o `throw` de Nest en lugar de dominio), indica corregir allí el import y usar la excepción de dominio adecuada, o delegar el error al servicio sin lanzar Nest desde el adaptador de entrada.

**No** uses ese bloque para fallos genéricos de test; solo cuando el diagnóstico sea: implementación que viola la regla de excepciones de dominio frente a tests que ya cumplen la regla.

Los tests de **controlador** pueden seguir verificando que, ante un error del servicio mockeado, se propaga o se traduce según el contrato HTTP del endpoint; la regla anterior se aplica de forma estricta a **tests del servicio** (código real del servicio bajo prueba).

### Mocking en tests de servicio

- Mockear repositorios y servicios externos.
- Simular respuestas de repositorio y comportamientos de servicios externos (éxito, error, edge cases).

---

## 4. Clases de lógica crítica: NO mockear

- **TaskPermissions**, **TaskGroupPermissions** y **CompanyPermissions** deben usarse **siempre con su implementación real**.
- **No mockear ni espiar** estas clases ni sus métodos en ningún test.
- Instanciarlas con datos reales para que la lógica de permisos se pruebe de forma fiable.

---

## 5. Cobertura de casos de uso

Incluir tests para:

- Casos felices (operaciones exitosas).
- Fallos de validación.
- Violaciones de reglas de negocio.
- Escenarios de autenticación/autorización.
- Operaciones concurrentes (si aplica).
- Límites de recursos.
- Fallos de dependencias externas.

---

## 6. Evitar tests redundantes

- **No crear tests** que repitan el mismo comportamiento ya cubierto en otro test.
- **Propagación de errores**: Si ya existe un test que verifica que los errores se propagan de forma genérica (ej. "should propagate error when service fails"), no añadir tests extra que solo repitan esa propagación para otro tipo de error, salvo que ejerciten otra rama de código o lógica distinta.
- **Éxito**: Si un test ya verifica una operación exitosa con todos sus efectos (ej. "should create task and send email successfully"), no crear otro test que solo verifique en aislamiento los mismos efectos de éxito.
- **Organización**:
  - Primer test: camino feliz completo con todos los efectos.
  - Siguientes: variaciones, edge cases y errores.
  - No duplicar aserciones de tests anteriores salvo que se pruebe otra rama de código.
- **Crear tests separados** cuando: haya otra rama/condicional, otra variación de entrada que cambie la lógica, otro tipo de error con manejo distinto, o otro punto de integración no cubierto.
- **No crear tests separados** para: repetir el mismo flujo de éxito, la misma propagación de errores o los mismos efectos ya verificados en un test amplio.

---

## 7. Repositorios (si se crean tests de repositorio)

- Mockear conexión y operaciones de base de datos.
- Probar en aislamiento la transformación de datos y la construcción de queries.

---

## 8. Checklist antes de dar por terminado

Comprobar:

- Existen tests del controlador/servicio y pasan.
- Todos los servicios usados por el controlador tienen tests suficientes.
- Todos los repositorios usados por esos servicios tienen tests suficientes.
- Los flujos de negocio están cubiertos en toda la cadena de dependencias.
- No quedan ramas de código sin cubrir en esa cadena.
- Los mocks reflejan de forma fiel el comportamiento real de los componentes.
- En tests de **servicio**, las excepciones esperadas son solo de `custom-exceptions` / `DomainException`, nunca de `@nestjs/common`.

---

[!TIP] Redacta los tests en lenguaje claro y accionable; prioriza un test de camino feliz completo y luego variaciones y errores, sin duplicar aserciones.
