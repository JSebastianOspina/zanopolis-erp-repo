---
name: endpoint-docs-creator
description: Crear o actualizar la documentación del endpoint actual (Swagger .swagger.ts y MD .md), con ejemplos de solicitudes derivados del DTO y de respuestas derivados del servicio.
---

# Documentación de endpoints (Swagger + MD)

Aplicar esta habilidad cuando el usuario solicite **crear** o **actualizar** la documentación del endpoint actual. La documentación incluye: archivo Swagger (`.swagger.ts`), archivo Markdown (`.md`) y sincronización entre ambos. Incluir siempre **ejemplos de solicitudes** (desde el DTO) y **ejemplos de respuestas** (desde el comportamiento del servicio).

---

## 1. Flujo de trabajo obligatorio

1. **Identificar el endpoint**: Controller + método (ruta, verbo HTTP, DTO si aplica).
2. **Solicitudes (body/query)**  
   - Si el endpoint recibe body: leer el DTO, distinguir campos obligatorios vs opcionales, y generar al menos dos ejemplos en `ApiBody`: uno **completo** (todos los campos) y uno **mínimo** (solo obligatorios). Incluir variantes relevantes (ej. un ejemplo intermedio) si aportan valor.
3. **Respuestas**  
   - Revisar la implementación del servicio (qué retorna en éxito, listas vacías, errores). Generar variantes en `ApiResponse` con `examples`. **Nombrar cada ejemplo** con una clave que describa el escenario real (véase §3.4); no repetir por costumbre `with-results` / `empty-results` si el endpoint es otro tipo de operación (p. ej. bulk update).
4. **Swagger primero**: Crear o actualizar la función `Apply*Docs()` en el `.swagger.ts` correspondiente.
5. **MD sincronizado**: Inmediatamente después, crear o actualizar el `.md` en la misma carpeta para que sea copia fiel del Swagger (mismos ejemplos, códigos, descripciones). Los JSON del MD deben coincidir con el `value` de cada `example` del Swagger.
6. **Respuestas de error**: Preferir los **helpers** de `@/common/decorators/api-response.decorator.ts` cuando la respuesta coincida con lo que generan. Solo definir una **respuesta explícita** (ApiResponse manual) cuando el error no se ajuste a ningún helper (véase sección 3.2.1). En el MD, documentar las respuestas de error según lo que genera cada decorador o el contenido de la respuesta explícita.

---

## 2. Lo que NO se usa en este proyecto

- No usar `ApiExtraModels`, `getSchemaPath`, `$ref`, ni importar schemas compartidos.
- No usar `schema` en `ApiResponse`; solo `examples` (plural).
- No usar `example` (singular); siempre `examples` (plural) con claves nombradas.
- No usar `ApiCommonHeaders()`.

---

## 3. Swagger (.swagger.ts)

### 3.1 Convenciones

- Archivo: `docs/api/v1/{módulo}/{controller-name}.swagger.ts`.
- Función: `Apply{Action}{Entity}Docs()` (PascalCase, termina en `Docs`). Ejemplos: `ApplyCreateUserDocs`, `ApplySearchTasksDocs`, `ApplyGetPublicTaskGroupsDocs`.

### 3.2 Estructura de la función

- Usar `applyDecorators(...)`.
- Incluir siempre:
  - `ApiOperation({ summary, description, operationId?, tags? })`.
  - Para endpoints autenticados: `ApiBearerAuth('bearer')`.
  - Respuestas de éxito con `ApiResponse` y `examples` (plural).
  - Respuestas de error: **usar los helpers de `api-response.decorator.ts` cuando apliquen** (véase 3.2.1). Solo añadir `ApiResponse` manual para errores que no cubran los helpers.

### 3.2.1 Helpers de respuestas de error (`api-response.decorator.ts`)

En `src/common/decorators/api-response.decorator.ts` existen **cinco helpers** (y un util para filtros) que generan respuestas de error en estándar JSON API. Existen para **evitar duplicar** el mismo formato en cada endpoint.

**Regla:** Usar **solo los helpers** cuando la respuesta de error que el endpoint puede devolver **se ajuste exactamente** a lo que genera el helper (mismo status, mismo tipo de error). Si la respuesta requerida tiene otro código, otro `detail`, path distinto o campos extra (p. ej. `source`), **no** usar el helper para ese caso y definir la respuesta **explícita** con `ApiResponse`; si además el endpoint puede devolver el error genérico, mantener también el helper correspondiente.

#### Contrato de cada helper (referencia)

- **`ApiBadRequestResponse(modelName: string)`**  
  - Status 400. Path: `/task-manager/api/v1/${modelName}s`. Method: `'POST'`.  
  - Detail: `'Invalid request body'`. Code: `BAD_REQUEST_ERROR`.  
  - Úsalo cuando el error sea “body inválido” genérico.

- **`ApiFilterValidationErrorResponse(params: ApiResponseParams)`**  
  - Parámetros: `{ modelName, endpoint?, method? }` (mismo estilo que ApiUnauthorizedResponse).  
  - Status 400. Path: `buildApiPath(modelName, endpoint)`. Method: `params.method ?? 'GET'`.  
  - Detail: `'Filtering by field "names" is not allowed'` (ejemplo). Code: `FILTERVALIDATION_ERROR`.  
  - Title: `'FilterValidation Error'`. **langKey: `backend_exception.filter-validation`** (no inventar `invalid_filter` ni otros).  
  - Úsalo cuando el endpoint reciba query param `filter` y pueda lanzar `FilterValidationException`.  
  - **Util reutilizable:** `buildFilterValidationErrorExample({ path, method?, detail? })` devuelve el objeto `{ errors: [...] }` para usar en Swagger (value del example) o en MD. En el MD usar path = ruta completa del endpoint documentado.

- **`ApiNotFoundResponse(modelName: string)`**  
  - Status 404. Path: `/task-manager/api/v1/${modelName}s`. Method: `'GET'`.  
  - Detail: `` `${modelName} not found` ``. Code: `NOT_FOUND_ERROR`.  
  - `meta.langInterpolation`: `{ model: modelName }`.  
  - Úsalo cuando el error sea “recurso no encontrado” genérico.

- **`ApiUnauthorizedResponse(params: ApiResponseParams)`**  
  - Parámetros: `{ modelName, endpoint?, detail?, method? }`.  
  - Status 401. Path: lo construye `buildApiPath(modelName, endpoint)` en el decorator (ver `api-response.decorator.ts`: `/task-manager/api/v1/${modelName}s/${endpoint ?? ''}`).  
  - Method: `params.method ?? 'GET'`. Detail: `params.detail ?? 'Invalid token in request'`. Code: `UNAUTHORIZED_ERROR`.  
  - Úsalo cuando el error sea “token inválido / no autenticado”.

- **`ApiForbiddenResponse(params: ApiResponseParams)`**  
  - Mismos parámetros que `ApiUnauthorizedResponse`.  
  - Status 403. Mismo path vía `buildApiPath`.  
  - Method: `params.method ?? 'POST'`. Detail: `params.detail ?? 'You do not have permission to perform this action'`. Code: `FORBIDDEN_ERROR`.  
  - Úsalo cuando el error sea “sin permisos para la acción”.

Para path/method/detail exactos en el **Swagger**, leer `api-response.decorator.ts` (y `buildApiPath`). En el **MD**, usar siempre la ruta completa del endpoint documentado y el verbo HTTP del endpoint (véase 4.2).

#### Cuándo usar respuesta explícita en lugar del helper

- El mismo status (p. ej. 400) pero **código distinto** (ej. `FILTER_VALIDATION_ERROR` en lugar de `BAD_REQUEST_ERROR`), **detail distinto** o **campos extra** (ej. `source: { parameter: 'filter' }`). Para filtros inválidos usar el helper `ApiFilterValidationErrorResponse` (no inventar langKey/code). Para otros casos: definir un `ApiResponse({ status: 400, description: '...', content: { 'application/json': { example: { errors: [...] } } } })` con la estructura real.
  - Si el endpoint además puede devolver el 400 genérico “Invalid request body”, mantener también `ApiBadRequestResponse('entity')` (ej. en `dashboard.swagger.ts` se usa el helper para bad request y además un `ApiResponse` 400 para “Invalid filter parameters”).
- Path que no sigue el patrón del helper (ej. subrutas como `/dashboards/tasks`): en la respuesta explícita usar el path real del endpoint.

**Resumen:** Preferir siempre los helpers cuando la respuesta encaje; crear respuesta explícita solo cuando no se ajuste a ninguno de los cinco métodos.

### 3.3 Ejemplos de SOLICITUD (ApiBody) desde el DTO

Cuando el endpoint recibe body (POST/PATCH/PUT):

1. **Leer el DTO** del controlador (ej. `CreateUserDto`, `CreateContactDto`). Identificar en cada propiedad:
   - Si es obligatoria (`@IsNotEmpty()`, `required: true` en `@ApiProperty`, etc.) o opcional (`@IsOptional()`, `required: false`).
2. **Generar al menos dos ejemplos** en `ApiBody`:
   - **Completo** (ej. `'full-{entity}'` o `'complete'`): todos los campos del DTO con valores de ejemplo coherentes. Summary/description en español o inglés, p. ej. "Contacto completo" / "Ejemplo con todos los campos opcionales".
   - **Mínimo** (ej. `'minimal-{entity}'` o `'minimal'`): solo campos obligatorios. Summary/description p. ej. "Solo campos obligatorios" / "Ejemplo con el mínimo requerido".
3. Opcional: un tercer ejemplo intermedio si hay muchos opcionales y ayuda al consumidor.

Formato:

```typescript
ApiBody({
  type: CreateContactDto,
  description: 'Contact data to create',
  examples: {
    'full-contact': {
      summary: 'Contacto completo',
      description: 'Ejemplo con todos los campos opcionales',
      value: {
        name: 'Laura',
        lastName: 'Oseguera Santos',
        enrichmentRequestId: 1,
        email: 'laura@example.com',
        phoneNumber: '+573001234567',
        // ... todos los campos
      },
    },
    'minimal-contact': {
      summary: 'Solo campos obligatorios',
      description: 'Ejemplo con el mínimo requerido',
      value: {
        name: 'Carlos',
        lastName: 'Mendoza',
        enrichmentRequestId: 1,
      },
    },
  },
}),
```

Los nombres de las claves (`'full-contact'`, `'minimal-contact'`) pueden adaptarse al dominio (ej. `'full-user'`, `'minimal-user'`).

**Claves descriptivas en ApiBody:** además de “completo / mínimo”, cuando haya variantes de negocio (p. ej. actualizar estado vs desasignar), usar claves que lo digan (`'update-status'`, `'unassign-tasks'`), no `example-a` / `example-b` ni un único genérico que no distinga el caso.

### 3.4 Ejemplos de RESPUESTA (ApiResponse) desde el servicio

1. **Revisar el servicio** que usa el controlador: qué retorna en éxito (objeto, lista, paginación, cursor), y en qué casos devuelve listas vacías, contadores en cero, etc.
2. **Definir variantes** con `examples` (plural), cada una con `summary`, `description` y `value`.

#### 3.4.1 Claves (`examples`) que coincidan con el ejemplo

Antes de escribir las claves, **razonar qué representa cada `value`**: operación, entidad y situación (éxito con datos, colección vacía, primer página, error de negocio documentado como 200 alternativo si aplica, etc.).

- **Regla:** la clave de cada entrada en `examples` debe ser **explícita para ese endpoint** (kebab-case), de modo que al leerla en Swagger se entienda el caso sin abrir el JSON. Debe estar alineada con el `summary` / `description` del mismo bloque (misma historia).
- **Evitar plantillas ciegas:** no usar `with-results` y `empty-results` por defecto. Solo son adecuados cuando el contrato es genuinamente “colección con ítems” vs “colección vacía” en un **listado o búsqueda genérica** y no hay un matiz más preciso.
- **Preferir nombres según el dominio**, por ejemplo:
  - PATCH masivo que devuelve tareas actualizadas en JSON API → `'updated-tasks-collection'` y `'no-tasks-returned'` (o `'empty-after-bulk-update'`), no `with-results` / `empty-results`.
  - Contadores de dashboard → `'counters-with-values'` / `'counters-all-zero'` en lugar de `with-counters` vago si el payload es específico.
  - GET de grupos públicos → `'public-task-groups-non-empty'` / `'public-task-groups-empty'` (o equivalente claro).
  - Recurso único: si hay dos formas de éxito → `'resource-created'` / `'resource-updated'`.

Si tras razonar el caso **sí** es solo “hay filas / no hay filas” en un listado, `with-results` / `empty-results` son válidos.

Formato (múltiples ejemplos de respuesta; claves alineadas al dominio):

```typescript
ApiResponse({
  status: 200,
  description: 'Public task groups retrieved successfully',
  content: {
    'application/json': {
      examples: {
        'public-task-groups-non-empty': {
          summary: 'With matching groups',
          description: 'List of public task groups (JSON API collection)',
          value: {
            data: [
              {
                type: 'object',
                id: 'plain',
                attributes: { id: 40, name: ' Juank 1' },
              },
            ],
          },
        },
        'public-task-groups-empty': {
          summary: 'No groups match',
          description: 'Empty JSON API collection when no public groups match',
          value: { data: [] },
        },
      },
    },
  },
}),
```

- El `value` debe reflejar exactamente la forma del JSON que devuelve la API (incl. `data`, `meta`, `items`, `nextCursor`, etc.) según el servicio.
- No usar `example` (singular); siempre `examples` con claves nombradas.

### 3.5 Mapeo método HTTP ↔ decoradores de error

- `ApiUnauthorizedResponse` y `ApiForbiddenResponse` usan **objeto**: `{ modelName: 'entity', method: 'HTTP_METHOD' }`.
- Método según el tipo de operación:
  - `ApplyCreate*Docs` / `ApplyUpsert*Docs` → `method: 'POST'`
  - `ApplySearch*Docs`, `ApplyGet*ByIdDocs`, `ApplyGet*...Docs` → `method: 'GET'`
  - `ApplyUpdate*Docs` → `method: 'PATCH'`
  - `ApplyDelete*Docs` → `method: 'DELETE'`

Ejemplo: `ApiUnauthorizedResponse({ modelName: 'user', method: 'POST' })`, `ApiForbiddenResponse({ modelName: 'user', method: 'POST' })`.

### 3.6 Respuestas de error de filtro (FilterValidationException)

Para endpoints que reciben query param `filter` y pueden devolver 400 por validación de filtro:
- **En Swagger:** usar `ApiFilterValidationErrorResponse({ modelName, endpoint, method })` (ej. `modelName: 'dashboard'`, `endpoint: 'tasks/counters'`, `method: 'GET'`). No definir a mano el 400 de filtro ni inventar `langKey` o `code`; el backend usa `backend_exception.filter-validation` y `FILTERVALIDATION_ERROR`.
- **En MD:** usar el mismo valor que genera el decorator (path = ruta completa del endpoint) o construir el JSON con `buildFilterValidationErrorExample({ path: '/task-manager/api/v1/...', method: 'GET' })`. Path sin query string; no incluir `queryParams` en el ejemplo (simplificado).

---

## 4. Documentación Markdown (.md)

- Ubicación: mismo directorio que el Swagger, mismo nombre base: `docs/api/v1/{módulo}/{controller-name}.md`.

### 4.1 Estructura obligatoria del MD

1. **Título**  
   `# [TIPO][ROLE] nombre del endpoint`  
   - TIPO: módulo (User, Task, Dashboard, etc.).  
   - ROLE si aplica (Admin, Colaborator).  
   - Nombre en minúsculas, descriptivo. Debe coincidir con el `summary` del Swagger.

2. **Endpoint y URL**  
   `## MÉTODO@/task-manager/api/v1/ruta`  
   Línea siguiente: `` `https://{domain}/task-manager/api/v1/ruta` ``  
   - MÉTODO en mayúsculas (GET, POST, PATCH, DELETE).  
   - Ruta debe coincidir con el controlador.

3. **Descripción**  
   Una línea clara (pública/privada, autenticación). Debe coincidir con la descripción del Swagger.

4. **Consideraciones**  
   Sección `### Consideraciones` con viñetas en español (autenticación, permisos, límites, comportamientos especiales), alineadas con la operación en Swagger.

5. **Parámetros**  
   `### Parámetros`  
   Tabla: | Nombre | Tipo | Obligatorio | Descripción |  
   - Incluir query, path y, si se documenta body por sección, body. Para estructuras complejas (filter, body), subtabla o filas anidadas. Debe coincidir con los parámetros del Swagger (ApiQuery, ApiParam, y con el DTO en caso de body).

6. **Solicitudes (body)**  
   Si el endpoint tiene body, opcionalmente añadir una subsección con los mismos ejemplos que en Swagger (completo y mínimo), en formato JSON, para que el MD sea autocontenido.

7. **Respuestas**  
   `### Respuestas`  
   Para cada código (200, 201, 400, 401, 403, 404, 500):
   - Encabezado: `#### CÓDIGO - Descripción`  
   - Si hay varios ejemplos para el mismo código, documentar **todos** con títulos que reflejen la **misma clave descriptiva** que en Swagger (p. ej. `#### 200 - ... (updated-tasks-collection)` y `#### 200 - ... (no-tasks-returned)`), no solo “with results / empty results” genéricos salvo que esas sean las claves elegidas tras razonar (§3.4.1).  
   - El JSON debe ser **idéntico** al `value` del `examples` del Swagger. No cambiar campos ni valores.

### 4.2 Formato de errores (JSON API)

Estructura estándar para errores en el MD (y en Swagger cuando se definen a mano):

```json
{
  "errors": [
    {
      "id": "ExceptionName-timestamp-uniqueId",
      "status": "400",
      "code": "ERROR_CODE",
      "title": "Error Title",
      "detail": "Detailed error message",
      "meta": {
        "path": "/task-manager/api/v1/entity",
        "method": "HTTP_METHOD",
        "timestamp": "ISO-8601",
        "langKey": "backend_exception.error_type",
        "langInterpolation": {}
      }
    }
  ]
}
```

Las respuestas de error en el MD deben ser **idénticas** en estructura (code, detail, title, etc.) a lo que documenta el Swagger; **pero** el campo `meta.path` (y `meta.method` si aplica) debe reflejar **siempre la ruta completa del endpoint documentado**, no la ruta genérica del helper.

**Regla obligatoria para path y method en el MD:**
- **`meta.path`**: usar la **ruta completa del endpoint** que se está documentando (la misma que aparece en el encabezado del MD: `## MÉTODO@/task-manager/api/v1/ruta`). Ejemplo: para el endpoint `GET@/task-manager/api/v1/dashboards/tasks/counters`, todas las respuestas de error (400, 401, etc.) deben tener `"path": "/task-manager/api/v1/dashboards/tasks/counters"`, no `/task-manager/api/v1/dashboards`.
- **`meta.method`**: usar el **verbo HTTP del endpoint** documentado (GET, POST, PATCH, DELETE). Así el lector identifica qué endpoint devolvió el error.

Esto aplica tanto a errores documentados por **helpers** (ApiBadRequestResponse, ApiUnauthorizedResponse, etc.) como a **respuestas explícitas** (ApiResponse manual). En el Swagger los helpers siguen usando su path genérico; en el MD se sobreescribe con la ruta real del endpoint.

Tabla de referencia rápida (helpers; en el MD usar path completo del endpoint y method del endpoint):

| Decorador                    | Status | Code               | Detail (por defecto)           |
|-----------------------------|--------|--------------------|-------------------------------|
| ApiBadRequestResponse       | 400    | BAD_REQUEST_ERROR  | Invalid request body          |
| ApiFilterValidationErrorResponse | 400 | FILTERVALIDATION_ERROR | Filtering by field "names" is not allowed (langKey: backend_exception.filter-validation) |
| ApiUnauthorizedResponse     | 401    | UNAUTHORIZED_ERROR | Invalid token in request      |
| ApiForbiddenResponse        | 403    | FORBIDDEN_ERROR    | You do not have permission... |
| ApiNotFoundResponse         | 404    | NOT_FOUND_ERROR    | {modelName} not found         |

---

## 5. Sincronización Swagger ↔ MD (regla obligatoria)

- Cada vez que se **cree o modifique** una función `Apply*Docs()` en un `.swagger.ts`, se debe **actualizar en el mismo cambio** el `.md` correspondiente.
- El MD es una **copia fiel** del Swagger: mismos status codes, mismos ejemplos (el JSON del MD = `value` del example en Swagger), mismas descripciones.
- Comprobar antes de dar por cerrado: mismos ejemplos de solicitud (si aplica), mismos ejemplos de respuesta (mismas **claves** y `value` que en Swagger), y respuestas de error con **path = ruta completa del endpoint** y **method = verbo HTTP del endpoint** (no la ruta genérica del helper).

---

## 6. Resumen de checklist

- [ ] Endpoint identificado (controller, método, ruta, DTO si hay body).
- [ ] DTO leído: campos obligatorios vs opcionales.
- [ ] ApiBody con al menos 2 ejemplos: completo y mínimo (y opcional intermedio).
- [ ] Servicio revisado para variantes de respuesta (con datos, vacío, contadores, etc.).
- [ ] ApiResponse con `examples` (plural): variantes relevantes; **claves descriptivas** por caso (§3.4.1), no plantillas genéricas sin razonar.
- [ ] Sin uso de schema/$ref/example singular; solo `examples` con claves nombradas.
- [ ] **Respuestas de error:** usar helpers de `api-response.decorator.ts` cuando la respuesta coincida (400 genérico, 401, 403, 404 genérico). Solo definir `ApiResponse` manual cuando el error no se ajuste (ej. errores no cubiertos por los cinco helpers). Para filtros inválidos usar siempre `ApiFilterValidationErrorResponse`/`buildFilterValidationErrorExample`.
- [ ] ApiUnauthorizedResponse / ApiForbiddenResponse con formato `{ modelName, method }`; método HTTP coherente con la operación.
- [ ] Archivo .md actualizado con la misma información y mismos JSON que el Swagger.
- [ ] Respuestas de error en MD: mismo contenido que los helpers o la respuesta explícita (code, detail, title, etc.), pero **meta.path = ruta completa del endpoint documentado** y **meta.method = verbo HTTP del endpoint** (ej. GET), no la ruta/método genérico del helper.
