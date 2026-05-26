---
name: hexagonal-architecture
description: Guía para implementar módulos siguiendo arquitectura hexagonal en el Task Manager Backend Service (dominio, puertos, adaptadores, tests y documentación).
---

# Arquitectura Hexagonal — Guía de implementación

## Cuándo usar esta skill

Activa esta skill cuando:
- Vayas a **crear un nuevo módulo** en el proyecto (nueva entidad o caso de uso).
- Te pidan **refactorizar** código hacia arquitectura hexagonal.
- Necesites **revisar o corregir** la estructura de un módulo existente para que cumpla el patrón.
- Tengas dudas sobre **dónde colocar** un archivo, cómo nombrar interfaces o qué capa puede depender de cuál.

No la uses para tareas que no impliquen estructura de módulos (por ejemplo, solo cambiar un endpoint o un DTO sin tocar dominio/servicio/repositorio).

## Resumen ejecutivo

- **Dominio**: independiente de frameworks; solo modelos y contratos (interfaces).
- **Puertos**: interfaces en `domain/input-ports` (servicio) y `domain/output-ports` (repositorio).
- **Adaptadores**: controladores (input) y repositorios Prisma/memoria (output); implementan los puertos.
- **Regla de dependencias**: las capas internas no importan de las externas; solo las externas importan de las internas.
- **Excepciones**: Solo se lanzan excepciones que extiendan `DomainException`, desde `@/common/domain/exceptions/custom-exceptions`. Nunca importar excepciones de Nest.js (`@nestjs/common`). Si se necesita un tipo de error que no exista, crearlo en ese directorio.

## Convención de placeholders

Al seguir los patrones de esta skill, sustituye siempre:
- **`{module-name}`**: nombre del módulo en **kebab-case** (ej. `task-group`, `dashboard`).
- **`{ModuleName}`**: mismo nombre en **PascalCase** (ej. `TaskGroup`, `Dashboard`).
- **`{moduleName}`**: mismo nombre en **camelCase** (ej. `taskGroup`, `dashboard`).

Usa exactamente estas variantes en nombres de archivos, clases, interfaces y variables según el contexto del ejemplo.

## Orden de implementación recomendado

Sigue este orden al crear un módulo desde cero; no implementes adaptadores antes de tener el dominio y los puertos:

1. **Dominio**: Crear el modelo en `domain/{module-name}.model.ts` y validaciones en `create()`.
2. **Puertos**: Crear `domain/input-ports/{module-name}.service.interface.ts` y `domain/output-ports/{module-name}.repository.interface.ts`.
3. **Aplicación**: Crear el servicio en `application/{module-name}.service.ts` que implemente la interfaz del servicio e inyecte el repositorio.
4. **Adaptadores de entrada**: Crear controlador y DTOs en `adapters/input/`. Solo cuando el adaptador Prisma haga queries con muy pocos campos (optimización) y para el front sea otra entidad distinta, crear en dominio el modelo de respuesta mínimo (patrón 1b) y que el servicio devuelva instancias de ese modelo; en otros casos usar el modelo existente (Model o Partial&lt;Model&gt;). En duda, confirmar con el usuario antes de crear el modelo parcial.
5. **Adaptadores de salida**: Crear adaptador Prisma y (si aplica) repositorio en memoria.
6. **Módulo Nest**: Registrar en `{module-name}.module.ts` (providers, controllers, exports).
7. **Documentación**: Swagger en `docs/api/v1/{module-name}s/` y archivos `.md` de endpoints.
8. **Tests**: Especificaciones para controlador, servicio y adaptador de repositorio según los patrones indicados.

## Architecture Principles

### Core Principles
- **Domain Independence**: The domain layer must be completely independent of external frameworks and technologies
- **Interface Segregation**: Use interfaces (ports) to define contracts between layers
- **Dependency Inversion**: Depend on abstractions, not concrete implementations
- **Single Responsibility**: Each layer has a specific responsibility and clear boundaries

### Layer Dependencies
```
Controllers (Input Adapters) → Services (Input Ports) → Domain Models
                                    ↓
Repositories (Output Adapters) ← Services (Output Ports) ← Domain Models
```

**Regla obligatoria**: Las capas internas no pueden depender de las externas. Solo las capas externas importan desde las internas. Si el dominio o un puerto necesita algo de Nest, Prisma o HTTP, detente y mueve esa lógica a un adaptador o a la aplicación.

### Excepciones de dominio (DomainException)

**Todas las excepciones que se lancen en el proyecto deben ser subclases de `DomainException`**, definidas en `@/common/domain/exceptions/custom-exceptions`. El filtro global de la aplicación las traduce a respuestas HTTP y JSON API.

**Reglas obligatorias:**

- **Nunca importes excepciones de Nest.js** (`@nestjs/common`): no uses `NotFoundException`, `BadRequestException`, `ForbiddenException`, `UnauthorizedException`, etc. de Nest. Usa únicamente las del dominio.
- **Importa siempre desde** `@/common/domain/exceptions/custom-exceptions` (o desde `@/common/domain/exceptions` si usas la clase base `DomainException`). Ejemplos: `RepositoryNotFoundException`, `BadRequestException`, `ValidationException`, `ForbiddenException`, `UnauthorizedException`, `NotFoundException`.
- **Si necesitas un tipo de error que no exista** en ese directorio, **crea una nueva clase** en `src/common/domain/exceptions/custom-exceptions/` que extienda `DomainException`, asigne `code` (desde `@/common/domain/enums/error-codes.enum`) y `langKey`, y reciba el mensaje (y datos adicionales si aplica) en el constructor. No crees excepciones en módulos ni importes las de Nest.

**Ejemplo de excepción existente (servicio):**
```typescript
import { RepositoryNotFoundException } from '@/common/domain/exceptions/custom-exceptions/repository-not-found-exception';

if (!entity) {
  throw new RepositoryNotFoundException('Entity not found', 'EntityName');
}
```

**Ejemplo de excepción en modelo (validación en `create()`):**
```typescript
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';

static create(params: Partial<Model>): Model {
  if (!params.requiredField) {
    throw new BadRequestException('Required field is missing');
  }
  return new Model(params);
}
```

**Crear una excepción nueva:** en `src/common/domain/exceptions/custom-exceptions/nombre-excepcion.exception.ts`, extender `DomainException`, importar `ErrorCodes` desde `@/common/domain/enums/error-codes.enum`, y asignar `protected code` y `protected langKey` (y constructor si hace falta).

### Instrucciones accionables por capa

- **Dominio**: Define solo modelos y interfaces. No importes `@nestjs/*`, `Prisma`, ni DTOs de entrada/salida. La creación de entidades se hace con un método estático `create()` que valida y devuelve el modelo. Si la validación falla, lanza una excepción que extienda `DomainException` desde `@/common/domain/exceptions/custom-exceptions` (p. ej. `BadRequestException`, `ValidationException`); nunca `throw new Error()` ni excepciones de Nest.
- **Input ports (servicio)**: Declara los métodos que el caso de uso debe exponer (get, search, create, update, delete y métodos de negocio). Usa tipos del dominio y de `@/common/domain/interfaces`.
- **Output ports (repositorio)**: Extiende `ICrudRepository<Model, Id>` y añade solo métodos de persistencia/consulta que el servicio necesite. El modelo es el del dominio.
- **Application (servicio concreto)**: Implementa la interfaz del servicio; inyecta el repositorio por token (ej. `I{ModuleName}Repository`). Delega en el repositorio para persistencia y aplica reglas de negocio aquí. Para errores (entidad no encontrada, permisos, validaciones), lanza solo excepciones de `@/common/domain/exceptions/custom-exceptions`; nunca excepciones de Nest.js.
- **Adapters input**: El controlador recibe DTOs, llama al servicio (inyectado por interfaz) y serializa la respuesta con `JsonApiSerializer.serialize()` o `JsonApiSerializer.serializeMany()`. **Lo que se pasa al serializador debe ser siempre un modelo de dominio** (clase que extiende `BaseModel` con `getType()`, `getId()`, `getRelationships()`, `getBlacklistedProperties()` implementados). **No pongas lógica de negocio ni validaciones de permisos en el controlador**; solo obtén datos de la petición (incluido `CompanyPermissions` si aplica) y pásalos al servicio.
- **Adapters output**: El adaptador Prisma implementa la interfaz del repositorio, mapea entre modelo de dominio y esquema de BD en `toModel()`/`toDto()`, y usa `getTable()` para la tabla de Prisma.

### Controlador: sin lógica de negocio ni validación de permisos

El controlador es un **adaptador de entrada**: traduce HTTP a llamadas al servicio y serializa respuestas. Toda decisión de negocio y toda validación de permisos debe vivir en el **servicio**.

**En el controlador NO hagas:**
- Llamar a `CompanyPermissions.validateHasPermission()`, `validateHasPermissions()` o `validateHasOneOf()`.
- Usar `companyPermissions.hasPermission()`, `hasPermissions()` o `hasOneOf()` para condicionar flujo o lanzar errores.
- Cualquier otra validación de reglas de negocio (comprobar estado, ownership, límites, etc.).

**En el controlador SÍ haz:**
- Obtener `CompanyPermissions` con el decorador `@GetCompanyPermissions()` y pasarlo como argumento al servicio.
- Pasar al servicio solo los datos necesarios (DTOs, userId, companyId, query params, etc.); el servicio decidirá si hay permiso o no.

**Ejemplo correcto (controlador):**
```typescript
@Get('users')
async getDashboardUsers(
  @CompanyId() companyId: number,
  @UserId() userId: number,
  @Query() queryParams: GetDashboardUsersDto,
  @GetCompanyPermissions() companyPermissions: CompanyPermissions,
) {
  const items = await this.dashboardService.getDashboardUsers({
    companyId,
    userId,
    name: queryParams.name,
    limit: queryParams.limit ?? 50,
    companyPermissions,
  });
  return JsonApiSerializer.serializeMany(items);
}
```

**Ejemplo correcto (servicio):** la validación de permisos se hace en el servicio usando `CompanyPermissions` recibido por parámetro, por ejemplo `companyPermissions.validateHasPermission(CompanyPermissionEnum.SomePermission)`.

Referencia del modelo de permisos: `@/common/domain/models/company-permissions/company-permissions.ts`.

### JsonApiSerializer y modelos de dominio

Cuando un endpoint serializa su respuesta con `JsonApiSerializer.serialize()` o `JsonApiSerializer.serializeMany()`, **asegúrate de que el valor pasado sea siempre un modelo de dominio** (instancia de una clase que extiende `BaseModel`), para que el serializador pueda generar correctamente `type`, `id` y `attributes` en formato JSON API.

**Cuándo crear un modelo parcial nuevo (no a rajatabla):** Crea un **modelo de dominio mínimo** nuevo solo cuando se cumplan **ambas** condiciones:

- El adaptador Prisma hace **queries que traen muy pocos campos** (por optimización) y no devuelve la entidad completa.
- Para el front es **claramente otra "entidad"** que no existe como recurso en la API (ej. un "usuario de dashboard" con solo `id`, `name`, `photoUrl`).

En el resto de casos —por ejemplo cuando el contrato del endpoint ya establece que devuelve un **Model** o **Partial&lt;Model&gt;** existente— **usa el modelo que ya existe**; no crees un modelo nuevo.  
**Si tienes duda** sobre si hace falta un modelo parcial nuevo, **verifica con el usuario** antes de crearlo.

Cuando sí corresponda crear el modelo mínimo:

1. Crea el archivo en el dominio del módulo, por ejemplo `domain/{context}-{entity}.model.ts` (ej. `dashboard-user.model.ts`).
2. Define una clase que extienda `BaseModel`, con solo las propiedades que expone el endpoint (pueden incluir campos calculados, ej. contadores).
3. Implementa el constructor privado, `create(params)` y los **métodos abstractos obligatorios**: `getType()`, `getId()`, `getRelationships()`, `getBlacklistedProperties()`.
4. El servicio construye y devuelve instancias con `Model.create(...)`; el controlador solo pasa ese resultado al serializador.

**Ejemplo (modelo mínimo cuando aplica):**

```typescript
// src/modules/dashboard/domain/dashboard-user.model.ts
import { BaseModel } from '@/common/domain/models/base.model';

export class DashboardUserModel extends BaseModel {
  id: number;
  name: string;
  photoUrl: string | null;

  private constructor(params: Partial<DashboardUserModel>) {
    super(params);
    this.id = params.id!;
    this.name = params.name!;
    this.photoUrl = params.photoUrl ?? null;
  }

  static create(params: Partial<DashboardUserModel>): DashboardUserModel {
    return new DashboardUserModel(params);
  }

  getRelationships(): string[] {
    return [];
  }
  getId(): string {
    return 'id';
  }
  getBlacklistedProperties(): string[] {
    return ['createdAt', 'updatedAt'];
  }
  getType(): string {
    return 'dashboard-user';
  }
}
```

**Endpoints ya existentes que no usan modelo:** Si el endpoint **ya existe** y no devuelve un modelo (objetos planos u otra estructura), **no crees de forma automática** una clase nueva ni cambies la respuesta al serializador. **Solicita la confirmación explícita del usuario** antes de crear el modelo y pasar la respuesta por el serializador.

## Directory Structure

### Module Structure
Each module must follow this exact structure:

```
src/modules/{module-name}/
├── adapters/
│   ├── input/
│   │   ├── {module-name}.controller.ts
│   │   └── dto/
│   │       ├── create-{module-name}.dto.ts
│   │       ├── update-{module-name}.dto.ts
│   │       └── search-{module-name}.dto.ts
│   └── output/
│       ├── prisma/
│       │   └── {module-name}-prisma-repository.adapter.ts
│       └── memory/
│           └── {module-name}-memory.repository.ts
├── application/
│   └── {module-name}.service.ts
├── domain/
│   ├── {module-name}.model.ts
│   ├── input-ports/
│   │   └── {module-name}.service.interface.ts
│   └── output-ports/
│       └── {module-name}.repository.interface.ts
└── {module-name}.module.ts
```

### Documentation Structure
```
docs/api/v1/{module-name}/
├── {action}-{module-name}.md
└── {module-name}.swagger.ts
```

### Test Structure
```
test/src/modules/{module-name}/
├── {module-name}.controller.spec.ts
├── {module-name}.service.spec.ts
└── adapters/
    └── output/
        └── {module-name}-prisma-repository.adapter.spec.ts
```

## Implementation Patterns

Aplica los patrones en el orden indicado en "Orden de implementación recomendado". Sustituye `{module-name}`, `{ModuleName}` y `{moduleName}` según la convención de placeholders.

### 1. Domain Model Pattern

**File**: `src/modules/{module-name}/domain/{module-name}.model.ts`

```typescript
import { BaseModel } from '@/common/domain/models/base.model';
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';

export enum {ModuleName}Status {
  Active = 'active',
  Inactive = 'inactive',
  Deleted = 'deleted',
}

export class {ModuleName}Model extends BaseModel {
  // Properties
  public readonly property1: string;
  public readonly property2: number | null;
  public status: {ModuleName}Status;

  // Relationships
  public relatedEntity?: RelatedModel[] = [];

  private constructor(params: Partial<{ModuleName}Model>) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
    this.property1 = params.property1!;
    this.property2 = params.property2 ?? null;
    this.status = params.status!;
    this.relatedEntity = params.relatedEntity ?? [];
  }

  static create(params: Partial<{ModuleName}Model>): {ModuleName}Model {
    // Validation logic: use domain exceptions only (from @/common/domain/exceptions/custom-exceptions)
    if (!params.property1) {
      throw new BadRequestException('Property1 is required');
    }
    
    return new {ModuleName}Model(params);
  }

  // JSON API methods
  getRelationships(): string[] {
    return ['relatedEntity'];
  }

  getId(): string {
    return 'id';
  }

  getBlacklistedProperties(): string[] {
    return [];
  }

  getType(): string {
    return '{module-name}';
  }
}
```

### 1b. Response model (partial / variant) pattern

**No aplicar a rajatabla.** Usa este patrón **solo** cuando:

- El adaptador Prisma hace **queries que traen muy pocos campos** (optimización) y no devuelve la entidad completa, y
- Para el front es **otra entidad** que no existe como recurso (ej. "usuario de dashboard" con pocos campos).

Si el return del endpoint ya es un **Model** o **Partial&lt;Model&gt;** existente, **usa ese modelo**; no crees uno nuevo.  
**Si dudas** si hace falta un modelo parcial, **verifica con el usuario** antes de crearlo. Para endpoints ya existentes que no usan modelo, pide confirmación explícita antes de introducir este patrón.

**File**: `src/modules/{module-name}/domain/{context}-{entity}.model.ts` (ej. `dashboard-user.model.ts`)

- La clase extiende `BaseModel`, tiene constructor privado y `static create(params)`.
- Incluye solo las propiedades que expone el endpoint (pueden ser de otra entidad más campos calculados).
- Implementa los métodos abstractos: `getType()`, `getId()`, `getRelationships()`, `getBlacklistedProperties()` (por ejemplo excluir `createdAt`/`updatedAt` si no se exponen).

```typescript
import { BaseModel } from '@/common/domain/models/base.model';

export class {Context}{Entity}Model extends BaseModel {
  id: number;
  name: string;
  photoUrl: string | null;
  // Opcional: campos calculados, ej. taskCount: number;

  private constructor(params: Partial<{Context}{Entity}Model>) {
    super(params);
    this.id = params.id!;
    this.name = params.name!;
    this.photoUrl = params.photoUrl ?? null;
  }

  static create(params: Partial<{Context}{Entity}Model>): {Context}{Entity}Model {
    return new {Context}{Entity}Model(params);
  }

  getRelationships(): string[] {
    return [];
  }
  getId(): string {
    return 'id';
  }
  getBlacklistedProperties(): string[] {
    return ['createdAt', 'updatedAt'];
  }
  getType(): string {
    return '{context}-{entity}'; // ej. 'dashboard-user'
  }
}
```

El servicio debe mapear los datos (desde repositorio o cálculos) a instancias de este modelo con `Model.create(...)` y devolverlas; el controlador solo pasa ese resultado a `JsonApiSerializer.serialize()` o `serializeMany()`.

### 2. Input Port (Service Interface) Pattern

**File**: `src/modules/{module-name}/domain/input-ports/{module-name}.service.interface.ts`

```typescript
import {
  PaginatedResult,
  PaginationParams,
} from '@/common/domain/interfaces/crud.repository.interface';
import { {ModuleName}Model } from '../{module-name}.model';
import { IUbitsFilter } from '@/common/domain/interfaces/filter/filter.interface';

export interface I{ModuleName}Service {
  // CRUD Operations
  get(id: number): Promise<{ModuleName}Model>;
  
  search(
    filter: IUbitsFilter,
    paginationParams: PaginationParams,
    userData: { userId: number },
  ): Promise<PaginatedResult<{ModuleName}Model>>;

  create(
    partialModel: Partial<{ModuleName}Model>,
    userId: number,
  ): Promise<{ModuleName}Model>;

  update(
    id: number,
    updatedPartialModel: Partial<{ModuleName}Model>,
  ): Promise<{ModuleName}Model>;

  delete(id: number, userId: number): Promise<void>;

  // Business-specific methods
  customBusinessMethod(
    param1: string,
    param2: number,
  ): Promise<{ModuleName}Model>;
}
```

### 3. Output Port (Repository Interface) Pattern

**File**: `src/modules/{module-name}/domain/output-ports/{module-name}.repository.interface.ts`

```typescript
import { ICrudRepository } from '@/common/domain/interfaces/crud.repository.interface';
import { {ModuleName}Model } from '../{module-name}.model';

export interface I{ModuleName}Repository
  extends ICrudRepository<{ModuleName}Model, number> {
  
  // Custom repository methods
  findByCustomField(field: string): Promise<{ModuleName}Model[]>;
  
  customQueryMethod(
    param1: string,
    param2: number,
  ): Promise<{ModuleName}Model | null>;
}
```

### 4. Service Implementation Pattern

**File**: `src/modules/{module-name}/application/{module-name}.service.ts`

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { I{ModuleName}Service } from '../domain/input-ports/{module-name}.service.interface';
import { I{ModuleName}Repository } from '../domain/output-ports/{module-name}.repository.interface';
import { {ModuleName}Model } from '../domain/{module-name}.model';
import { CrudService } from '@/common/application/crud.service';
import { FilterValidator } from '@/common/application/filter-validator';
import { {ModuleName}FilterSchema, {ModuleName}UserData } from '../domain/{module-name}-filter.schema';
import { IUbitsFilter } from '@ubits/talent-360-library-commons';
import {
  PaginatedResult,
  PaginationParams,
} from '@/common/domain/interfaces/crud.repository.interface';
import { RepositoryNotFoundException } from '@/common/domain/exceptions/custom-exceptions/repository-not-found-exception';

@Injectable()
export class {ModuleName}Service
  extends CrudService<{ModuleName}Model, number>
  implements I{ModuleName}Service
{
  constructor(
    @Inject('I{ModuleName}Repository')
    private {moduleName}Repository: I{ModuleName}Repository,
    // Inject other dependencies as needed
  ) {
    super({moduleName}Repository);
  }

  async customBusinessMethod(
    param1: string,
    param2: number,
  ): Promise<{ModuleName}Model> {
    // Business logic implementation
    const result = await this.{moduleName}Repository.customQueryMethod(param1, param2);
    
    if (!result) {
      throw new RepositoryNotFoundException('Entity not found', '{ModuleName}');
    }
    
    return result;
  }
}
```

### 5. Controller Pattern

**File**: `src/modules/{module-name}/adapters/input/{module-name}.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { {ModuleName}Service } from '../../application/{module-name}.service';
import { Create{ModuleName}Dto } from './dto/create-{module-name}.dto';
import { Update{ModuleName}Dto } from './dto/update-{module-name}.dto';
import { Search{ModuleName}Dto } from './dto/search-{module-name}.dto';
import { I{ModuleName}Service } from '../../domain/input-ports/{module-name}.service.interface';
import { PaginationParams } from '@/common/domain/interfaces/crud.repository.interface';
import { ParseUbitsFilterPipe } from '@/common/pipes/parse-filter.pipe';
import { IUbitsFilter } from '@ubits/talent-360-library-commons';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApplyCreate{ModuleName}Docs,
  ApplySearch{ModuleName}Docs,
  ApplyGet{ModuleName}ByIdDocs,
  ApplyUpdate{ModuleName}Docs,
  ApplyDelete{ModuleName}Docs,
} from '../../../../../docs/api/v1/{module-name}s/{module-name}.swagger';
import { ApiAuthGuard } from '@/config/auth/api-auth-guard/api-auth.guard';
import { UserId } from '@/common/decorators/user-id.decorator';
import { createPaginationParams } from '@/common/utils/objects';
import { JsonApiSerializer } from '@/common/utils/json-api';

@UseGuards(ApiAuthGuard)
@ApiBearerAuth()
@ApiTags('{module-name}s')
@Controller('{module-name}s')
export class {ModuleName}Controller {
  constructor(
    @Inject({ModuleName}Service)
    private readonly {moduleName}Service: I{ModuleName}Service,
  ) {}

  @ApplyCreate{ModuleName}Docs()
  @Post()
  async create(
    @Body() create{ModuleName}Dto: Create{ModuleName}Dto,
    @UserId() userId: number,
  ) {
    const result = await this.{moduleName}Service.create(
      create{ModuleName}Dto,
      userId,
    );
    return JsonApiSerializer.serialize(result);
  }

  @ApplySearch{ModuleName}Docs()
  @Get()
  async search(
    @Query('filter', new ParseUbitsFilterPipe())
    filter: IUbitsFilter,
    @Query() searchParams: Search{ModuleName}Dto,
    @UserId() userId: number,
  ) {
    const paginationParams = createPaginationParams(searchParams);
    const result = await this.{moduleName}Service.search(
      filter,
      paginationParams,
      { userId },
    );
    return JsonApiSerializer.serialize(result);
  }

  @ApplyGet{ModuleName}ByIdDocs()
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
  ) {
    const result = await this.{moduleName}Service.get(id);
    return JsonApiSerializer.serialize(result);
  }

  @ApplyUpdate{ModuleName}Docs()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() update{ModuleName}Dto: Update{ModuleName}Dto,
    @UserId() userId: number,
  ) {
    const result = await this.{moduleName}Service.update(
      id,
      update{ModuleName}Dto,
    );
    return JsonApiSerializer.serialize(result);
  }

  @ApplyDelete{ModuleName}Docs()
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
  ) {
    await this.{moduleName}Service.delete(id, userId);
    return { message: 'Entity deleted successfully' };
  }
}
```

### 6. DTO Pattern

**File**: `src/modules/{module-name}/adapters/input/dto/create-{module-name}.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsNumber,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { IsISOString } from '@/common/validators/iso-string.validator';

export class Create{ModuleName}Dto {
  @ApiProperty({
    description: 'The name of the entity',
    example: 'Example name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  @MinLength(3)
  name!: string;

  @ApiProperty({
    description: 'The description of the entity',
    example: 'Example description',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  @MinLength(3)
  description?: string;

  @ApiProperty({
    description: 'The end date of the entity',
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsISOString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    description: 'The status of the entity',
    example: 'active',
    enum: ['active', 'inactive'],
    required: false,
  })
  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: string;
}
```

### 7. Repository Adapter Pattern

**File**: `src/modules/{module-name}/adapters/output/prisma/{module-name}-prisma-repository.adapter.ts`

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { I{ModuleName}Repository } from '../../../domain/output-ports/{module-name}.repository.interface';
import { {ModuleName}Model } from '../../../domain/{module-name}.model';
import { PrismaService } from '@/common/adapters/database/prisma.service';
import { camelToSnakeObject, snakeToCamelObject } from '@/common/utils/objects';
import { CrudRepositoryPrismaAdapter } from '@/common/adapters/database/crud-repository-prisma.adapter';

@Injectable()
export class {ModuleName}PrismaRepositoryAdapter
  extends CrudRepositoryPrismaAdapter<{ModuleName}Model, number>
  implements I{ModuleName}Repository
{
  constructor(
    @Inject(PrismaService)
    private prismaService: PrismaService,
  ) {
    super(prismaService);
  }

  protected getTable() {
    return this.prismaService.{moduleName};
  }

  public toModel(data: any): {ModuleName}Model {
    return {ModuleName}Model.create({
      id: data.id,
      name: data.name,
      description: data.description,
      endDate: data.end_date ? new Date(data.end_date) : null,
      status: data.status,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    });
  }

  public toDto(data: Partial<{ModuleName}Model>): any {
    return {
      name: data.name,
      description: data.description,
      end_date: data.endDate,
      status: data.status,
    };
  }

  async findByCustomField(field: string): Promise<{ModuleName}Model[]> {
    const results = await this.prismaService.{moduleName}.findMany({
      where: { custom_field: field },
    });
    return results.map((result) => this.toModel(result));
  }

  async customQueryMethod(
    param1: string,
    param2: number,
  ): Promise<{ModuleName}Model | null> {
    const result = await this.prismaService.{moduleName}.findFirst({
      where: {
        field1: param1,
        field2: param2,
      },
    });
    return result ? this.toModel(result) : null;
  }
}
```

### 8. Module Pattern

**File**: `src/modules/{module-name}/{module-name}.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { {ModuleName}Controller } from './adapters/input/{module-name}.controller';
import factoryProvider from '@/common/providers/factory-provider';
import { {ModuleName}MemoryRepository } from './adapters/output/memory/{module-name}-memory.repository';
import { DatabaseModule } from '@/common/adapters/database/database.module';
import { {ModuleName}PrismaRepositoryAdapter } from './adapters/output/prisma/{module-name}-prisma-repository.adapter';
import { {ModuleName}Service } from './application/{module-name}.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    factoryProvider(
      'I{ModuleName}Repository',
      {ModuleName}PrismaRepositoryAdapter,
      {ModuleName}MemoryRepository,
    ),
    {ModuleName}Service,
  ],
  controllers: [{ModuleName}Controller],
  exports: [{ModuleName}Service],
})
export class {ModuleName}Module {}
```

## Testing Patterns

### 1. Controller Test Pattern

**File**: `test/src/modules/{module-name}/{module-name}.controller.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { {ModuleName}Controller } from '../../../../src/modules/{module-name}/adapters/input/{module-name}.controller';
import { {ModuleName}Service } from '../../../../src/modules/{module-name}/application/{module-name}.service';
import { I{ModuleName}Service } from '../../../../src/modules/{module-name}/domain/input-ports/{module-name}.service.interface';
import { {ModuleName}Model } from '../../../../src/modules/{module-name}/domain/{module-name}.model';
import { Create{ModuleName}Dto } from '../../../../src/modules/{module-name}/adapters/input/dto/create-{module-name}.dto';
import { JsonApiSerializer } from '@/common/utils/json-api';

describe('{ModuleName}Controller', () => {
  let controller: {ModuleName}Controller;
  let mock{ModuleName}Service: jest.Mocked<I{ModuleName}Service>;

  const mock{ModuleName}: {ModuleName}Model = {ModuleName}Model.create({
    id: 1,
    name: 'test',
    description: 'test description',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    mock{ModuleName}Service = {
      get: jest.fn(),
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [{ModuleName}Controller],
      providers: [
        {
          provide: {ModuleName}Service,
          useValue: mock{ModuleName}Service,
        },
      ],
    }).compile();

    controller = module.get<{ModuleName}Controller>({ModuleName}Controller);
  });

  describe('create', () => {
    it('should create a {module-name}', async () => {
      const create{ModuleName}Dto: Create{ModuleName}Dto = {
        name: 'test {module-name}',
        description: 'test description',
      };
      const userId = 1;

      mock{ModuleName}Service.create.mockResolvedValue(mock{ModuleName});

      const result = await controller.create(create{ModuleName}Dto, userId);

      expect(mock{ModuleName}Service.create).toHaveBeenCalledWith(
        create{ModuleName}Dto,
        userId,
      );
      expect(result).toEqual(JsonApiSerializer.serialize(mock{ModuleName}));
    });
  });

  // Add more test cases for other methods
});
```

### 2. Service Test Pattern

**File**: `test/src/modules/{module-name}/{module-name}.service.spec.ts`

```typescript
import { {ModuleName}Service } from '../../../../src/modules/{module-name}/application/{module-name}.service';
import { I{ModuleName}Repository } from '../../../../src/modules/{module-name}/domain/output-ports/{module-name}.repository.interface';
import { {ModuleName}Model } from '../../../../src/modules/{module-name}/domain/{module-name}.model';

describe('{ModuleName}Service', () => {
  let {moduleName}Service: {ModuleName}Service;
  let mock{ModuleName}Repository: jest.Mocked<I{ModuleName}Repository>;

  const mock{ModuleName}: {ModuleName}Model = {ModuleName}Model.create({
    id: 1,
    name: 'test',
    description: 'test description',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    mock{ModuleName}Repository = {
      get: jest.fn(),
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCustomField: jest.fn(),
      customQueryMethod: jest.fn(),
    };

    {moduleName}Service = new {ModuleName}Service(
      mock{ModuleName}Repository,
    );
  });

  describe('get', () => {
    it('should return a {module-name} by id', async () => {
      mock{ModuleName}Repository.get.mockResolvedValue(mock{ModuleName});

      const result = await {moduleName}Service.get(1);

      expect(mock{ModuleName}Repository.get).toHaveBeenCalledWith(1);
      expect(result).toEqual(mock{ModuleName});
    });
  });

  // Add more test cases for other methods
});
```

## Documentation Patterns

### 1. Swagger Documentation Pattern

**File**: `docs/api/v1/{module-name}s/{module-name}.swagger.ts`

```typescript
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@/common/decorators/api-response.decorator';
import { Create{ModuleName}Dto } from '@/modules/{module-name}/adapters/input/dto/create-{module-name}.dto';

export function ApplyCreate{ModuleName}Docs() {
  return applyDecorators(
    ApiOperation({
      summary: '[User] Create a {module-name}',
      description: 'Create a {module-name} providing the required fields',
    }),

    ApiBody({
      description: '{ModuleName} data',
      type: Create{ModuleName}Dto,
    }),

    ApiResponse({
      status: 201,
      description: '{ModuleName} created successfully',
      content: {
        'application/json': {
          example: {
            data: {
              type: '{module-name}',
              id: 1,
              attributes: {
                name: 'Example {module-name}',
                description: 'Example description',
                status: 'active',
                createdAt: '2024-01-15T10:30:00.000Z',
                updatedAt: '2024-01-15T10:30:00.000Z',
              },
            },
          },
        },
      },
    }),

    ApiBadRequestResponse('{module-name}'),
    ApiUnauthorizedResponse('{module-name}'),
    ApiNotFoundResponse('{module-name}'),
  );
}
```

### 2. Markdown Documentation Pattern

**File**: `docs/api/v1/{module-name}s/create-{module-name}.md`

```markdown
# [User] Create a {module-name}

## POST@/task-manager/api/v1/{module-name}s
`https://{domain}/task-manager/api/v1/{module-name}s`

Create a {module-name} providing the required fields

### Consideraciones

- El usuario debe estar autenticado
- Se requieren permisos de usuario
- Los campos requeridos deben ser proporcionados
- La respuesta incluirá todos los datos del {module-name} creado
- El formato de respuesta es JSON
- La fecha debe estar en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)

### Parámetros

| Nombre | Tipo | Obligatorio | Descripción |
| --- | ---- | ----- | ----- |
| name | string | Sí | Nombre del {module-name} (3-250 caracteres) |
| description | string | No | Descripción del {module-name} (3-500 caracteres) |
| endDate | string | No | Fecha de finalización en formato ISO 8601 |

### Respuestas

#### 201 - {ModuleName} created successfully
```json
{
  "data": {
    "type": "{module-name}",
    "id": 1,
    "attributes": {
      "name": "Example {module-name}",
      "description": "Example description",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### 400 - Bad request error
```json
{
  "errors": [
    {
      "id": "BadRequestException-1702755998770-abc123def",
      "status": "400",
      "code": "BAD_REQUEST_ERROR",
      "title": "Bad Request Error",
      "detail": "Invalid request body",
      "meta": {
        "path": "/task-manager/api/v1/{module-name}s",
        "method": "POST",
        "timestamp": "2024-10-16T17:26:38.770Z",
        "langKey": "backend_exception.invalid_request",
        "langInterpolation": {}
      }
    }
  ]
}
```
```

## Naming Conventions

### Files and Directories
- **Modules**: `kebab-case` (e.g., `task-group`, `user-profile`)
- **Classes**: `PascalCase` (e.g., `TaskGroupModel`, `UserService`)
- **Interfaces**: `I` + `PascalCase` (e.g., `ITaskGroupService`, `IUserRepository`)
- **Files**: `kebab-case` (e.g., `task-group.service.ts`, `user-repository.interface.ts`)
- **DTOs**: `{action}-{entity}.dto.ts` (e.g., `create-task-group.dto.ts`)

### Methods and Properties
- **Methods**: `camelCase` (e.g., `createTaskGroup`, `getUserById`)
- **Properties**: `camelCase` (e.g., `taskGroupId`, `createdAt`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_NAME_LENGTH`, `DEFAULT_STATUS`)

## Errores frecuentes a evitar

- **Importar frameworks en el dominio**: En `domain/` no debe haber imports de `@nestjs/*`, `prisma`, ni DTOs de adapters. Si hace falta, la dependencia va en un puerto (interfaz) y la implementación en un adaptador.
- **Usar excepciones de Nest.js**: Nunca importes ni lances excepciones de `@nestjs/common` (p. ej. `NotFoundException`, `BadRequestException`, `ForbiddenException`). Usa siempre excepciones que extiendan `DomainException` desde `@/common/domain/exceptions/custom-exceptions`. Si no existe la excepción necesaria, créala en ese directorio (extendiendo `DomainException`, con `code` y `langKey`).
- **Inyectar implementaciones concretas en el servicio**: El servicio debe recibir `I{ModuleName}Repository` (token de string), no la clase `{ModuleName}PrismaRepositoryAdapter` directamente.
- **Poner lógica de negocio en el controlador**: El controlador solo traduce HTTP ↔ servicio y serializa; las reglas van en el servicio. No valides permisos ni reglas de negocio en el controlador.
- **Validar permisos en el controlador**: No uses `CompanyPermissions` (`@/common/domain/models/company-permissions/company-permissions.ts`) en el controlador para validar. No llames a `validateHasPermission()`, `validateHasPermissions()`, `validateHasOneOf()`, ni uses `hasPermission()`/`hasPermissions()`/`hasOneOf()` para condicionar o lanzar errores. Obtén `CompanyPermissions` con `@GetCompanyPermissions()` y pásalo al servicio; el servicio debe hacer todas las validaciones de permisos.
- **Olvidar `getTable()` en el adaptador Prisma**: El adaptador debe definir `protected getTable()` devolviendo `this.prismaService.{moduleName}` (o el cliente de la tabla correcta).
- **Inconsistencia de nombres**: Usar PascalCase para el modelo (`{ModuleName}Model`), `I{ModuleName}Service` / `I{ModuleName}Repository` para interfaces, y kebab-case para archivos y rutas.
- **Tests que dependen de la BD real**: En tests unitarios de servicio y controlador, usa mocks del repositorio/servicio; reserva Prisma/BD para tests del adaptador o integración.
- **Pasar objetos planos al JsonApiSerializer cuando se quiere JSON API**: Si el endpoint usa `JsonApiSerializer.serialize()` o `serializeMany()`, el dato debe ser una instancia de un modelo (clase que extiende `BaseModel`). Usa el modelo existente (o Partial del mismo) cuando el contrato sea ese; solo crea un modelo mínimo nuevo cuando Prisma traiga muy pocos campos por optimización y para el front sea otra entidad. No pases objetos literales si quieres `type` e `id` correctos.
- **Crear modelos parciales sin criterio o sin preguntar**: No crees un modelo parcial nuevo por defecto. Solo cuando la query de Prisma trae muy pocos campos y el front trata la respuesta como otra entidad; en el resto de casos usa el Model/Partial&lt;Model&gt; existente. Para endpoints ya existentes sin modelo, pide **confirmación explícita** antes de añadir la clase y pasar por el serializador. **En duda, pregunta al usuario** antes de crear.

## Implementation Checklist

Antes de dar por terminado un módulo, comprueba:

### ✅ Domain Layer
- [ ] Domain model extends `BaseModel`
- [ ] Model has proper validation in `create()` method; validation failures throw DomainException subclasses (e.g. BadRequestException), not Error or Nest exceptions
- [ ] Model implements JSON API methods (`getType()`, `getId()`, etc.)
- [ ] Input port interface defines all business operations
- [ ] Output port interface extends `ICrudRepository`
- [ ] No external dependencies in domain layer (except `@/common/domain/*`, e.g. exceptions)

### ✅ Application Layer
- [ ] Service extends `CrudService`
- [ ] Service implements input port interface
- [ ] Service uses dependency injection for repositories
- [ ] Business logic is properly encapsulated
- [ ] Exceptions thrown are DomainException subclasses from `@/common/domain/exceptions/custom-exceptions` (never Nest.js exceptions)

### ✅ Adapters Layer
- [ ] Controller uses proper decorators and guards
- [ ] Controller does not contain business logic nor permission validation (no `CompanyPermissions.validateHasPermission` etc.; pass `companyPermissions` to the service)
- [ ] Any endpoint using `JsonApiSerializer.serialize()` or `serializeMany()` receives a domain model (class extending `BaseModel`); when a dedicated partial model is used (Prisma query with few fields + distinct entity for front), it exists in domain and is instantiated in the service; otherwise the existing Model or Partial&lt;Model&gt; is used
- [ ] DTOs have proper validation decorators
- [ ] Repository adapter extends `CrudRepositoryPrismaAdapter`
- [ ] Memory repository for testing
- [ ] Proper error handling and logging

### ✅ Module Configuration
- [ ] Module imports required dependencies
- [ ] Factory provider for repository injection
- [ ] Proper exports for other modules
- [ ] Controller registration

### ✅ Documentation
- [ ] Swagger decorators for all endpoints
- [ ] Markdown documentation following template
- [ ] Examples match actual API responses
- [ ] Error responses follow JSON API standard

### ✅ Testing
- [ ] Controller tests with mocked services
- [ ] Service tests with mocked repositories
- [ ] Repository tests with mocked database
- [ ] Test coverage for all business logic
- [ ] Integration tests for critical flows

## Common Patterns

### Error Handling
Todas las excepciones deben ser subclases de `DomainException` desde `@/common/domain/exceptions/custom-exceptions`. No uses excepciones de Nest.js.
```typescript
// In services: use only DomainException subclasses
import { RepositoryNotFoundException } from '@/common/domain/exceptions/custom-exceptions/repository-not-found-exception';

if (!entity) {
  throw new RepositoryNotFoundException('Entity not found', 'EntityName');
}

// In controllers: do not catch to rethrow; let global exception filter handle DomainException
const result = await this.service.method();
return JsonApiSerializer.serialize(result);
```

### Validation
```typescript
// In DTOs
@IsNotEmpty()
@IsString()
@MaxLength(250)
@MinLength(3)
name!: string;

// In domain models: use domain exceptions (e.g. BadRequestException, ValidationException)
import { BadRequestException } from '@/common/domain/exceptions/custom-exceptions/bad-request-exception';

static create(params: Partial<Model>): Model {
  if (!params.requiredField) {
    throw new BadRequestException('Required field is missing');
  }
  return new Model(params);
}
```

### Dependency Injection
```typescript
// In services
constructor(
  @Inject('IRepositoryInterface')
  private repository: IRepositoryInterface,
) {}

// In modules
providers: [
  factoryProvider(
    'IRepositoryInterface',
    ConcreteRepositoryAdapter,
    MemoryRepository,
  ),
]
```

## Best Practices

1. **Empieza siempre por el modelo de dominio**: Define la entidad y sus validaciones en `create()` antes de puertos y adaptadores.
2. **Define interfaces antes que implementaciones**: Crea los puertos (service y repository) y luego el servicio y los adaptadores que los implementen.
3. **Usa inyección de dependencias**: No instancies repositorios ni servicios dentro de clases; inyéctalos por constructor con el token correcto.
4. **Una responsabilidad por clase**: Controlador = HTTP; Servicio = negocio; Repositorio = persistencia; Modelo = datos y validación básica.
5. **Permisos y controlador**: Las validaciones con `CompanyPermissions` (validateHasPermission, validateHasPermissions, validateHasOneOf) se hacen siempre en el servicio. El controlador solo obtiene `CompanyPermissions` con `@GetCompanyPermissions()` y lo pasa al servicio; no decidas ni valides permisos en el controlador.
6. **Manejo de errores**: Lanza siempre excepciones que extiendan `DomainException` desde `@/common/domain/exceptions/custom-exceptions` (ej. `RepositoryNotFoundException`, `BadRequestException`, `ForbiddenException`). **Nunca importes excepciones de Nest.js**. Si necesitas un tipo de error que no exista, crea una nueva clase en ese directorio que extienda `DomainException`. En controladores deja que el filtro global transforme las excepciones.
7. **Tests**: Escribe tests del controlador (mock del servicio), del servicio (mock del repositorio) y del adaptador Prisma según los patrones de esta skill.
8. **Documentación**: Aplica los decoradores Swagger indicados y mantén los `.md` de API alineados con la skill `endpoint-docs-creator`.
9. **Nomenclatura**: Respeta kebab-case en archivos y rutas, PascalCase en clases e interfaces, camelCase en métodos y propiedades.
10. **Validación**: Valida en DTOs (class-validator) y en el modelo (en `create()`); no confíes solo en una capa.
11. **Casos límite**: Considera entidad no encontrada, paginación vacía, filtros inválidos y permisos de usuario cuando aplique.

## Integración con otras skills

Esta skill se usa junto con:
- **endpoint-docs-creator** — Para documentación de API (Swagger `.swagger.ts` y Markdown `.md`), con ejemplos de solicitudes y respuestas.
- **controller-service-tests** — Para tests de controladores y servicios (estructura, mocking y cobertura).

Cuando implementes un nuevo caso de uso, aplica esta skill junto con las anteriores para mantener la implementación completa y coherente.

---

[!TIP] Redacta las instrucciones que des a otros (o a ti mismo en tareas siguientes) en lenguaje claro y accionable: usa verbos en imperativo ("Crea el archivo...", "Verifica que...", "No importes...") y especifica archivos y rutas concretas para evitar ambigüedades.
