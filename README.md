# Zanopolis ERP Monorepo

Monorepo con [Turborepo](https://turborepo.dev) y npm workspaces. Contiene dos aplicaciones en `apps/`:

| Paquete | Carpeta | Stack |
|---------|---------|-------|
| `zanopolis-erp-front` | `apps/zanopolis-erp-front` | Next.js |
| `zanopolis-erp-service` | `apps/zanopolis-erp-service` | NestJS + Prisma |

## Estructura

```
zanopolis-erp-mono/
├── package.json          # workspaces + scripts que delegan a turbo run
├── turbo.json            # tareas base del pipeline
├── package-lock.json     # lockfile único del monorepo
├── .gitignore
└── apps/
    ├── zanopolis-erp-front/     (Next.js)
    │   └── turbo.json           # outputs .next + env vars del front
    └── zanopolis-erp-service/   (NestJS)
        └── turbo.json           # outputs dist + env de Prisma
```

## Requisitos

- Node.js >= 20
- npm 11+

## Primer uso

Instala dependencias **siempre desde la raíz** del monorepo:

```bash
npm install
```

No ejecutes `npm install` dentro de `apps/*`. El monorepo usa un solo `package-lock.json` en la raíz.

### Variables de entorno

Cada app gestiona sus propias variables:

- **Front:** copia `apps/zanopolis-erp-front/.env.example` a `.env.local`
- **Service:** configura `apps/zanopolis-erp-service/.env` (requiere `DATABASE_URL` y `DIRECT_URL` para Prisma)

## Comandos desde la raíz

| Comando | Qué hace |
|---------|----------|
| `npm install` | Instala dependencias de todo el workspace |
| `npm run dev` | Levanta Next y Nest en paralelo |
| `npm run build` | Build de ambos proyectos (con caché de Turbo) |
| `npm run lint` | ESLint en ambos |
| `npm run test` | Tests (solo Nest tiene script `test`) |
| `npm run start` | Inicia ambos en modo producción |

## Ejecutar un solo proyecto

Usa `--filter` para apuntar a un paquete concreto:

```bash
# Desarrollo
npx turbo run dev --filter=zanopolis-erp-front
npx turbo run dev --filter=zanopolis-erp-service

# Build
npx turbo run build --filter=zanopolis-erp-front
npx turbo run build --filter=zanopolis-erp-service

# Lint
npx turbo run lint --filter=zanopolis-erp-front
```

También puedes filtrar por directorio:

```bash
npx turbo run dev --filter=./apps/zanopolis-erp-front
```

## Solo paquetes afectados por cambios

Para CI o builds locales más rápidos, usa `--affected` (compara contra la rama base de git):

```bash
npx turbo run build --affected
npx turbo run lint --affected
```

## Tareas configuradas en Turbo

| Tarea | Comportamiento |
|-------|----------------|
| `build` | Respeta dependencias entre paquetes (`^build`). Cachea `.next/**` (front) y `dist/**` (service). |
| `dev` | Servidores persistentes, sin caché. |
| `start` | Modo producción, persistente, sin caché. |
| `lint` | Ejecución en paralelo con caché. |
| `test` | Depende de `build`. Cachea `coverage/**` en el service. |

Los scripts de cada app viven en su `package.json`. La raíz solo delega con `turbo run`.

## Scripts por app

### Front (`zanopolis-erp-front`)

- `dev` → `next dev`
- `build` → `next build`
- `start` → `next start`
- `lint` → `eslint`

### Service (`zanopolis-erp-service`)

- `dev` → `nest start --watch`
- `build` → `prisma generate && nest build`
- `start` → `nest start`
- `start:prod` → `node dist/main`
- `lint` → `eslint`
- `test` → `jest`

## Notas

- **Caché local:** Turbo guarda resultados en `.turbo/`. Si necesitas forzar re-ejecución: `npx turbo run build --force`.
- **Next.js + npm workspaces:** Next puede mostrar avisos sobre el lockfile y dependencias SWC. No bloquean el build; son un comportamiento conocido con npm workspaces.
- **Prisma:** el build del service ejecuta `prisma generate` automáticamente. Asegúrate de tener `.env` configurado antes de compilar.

## Próximos pasos opcionales

- GitHub Actions con `turbo run build --affected`
- Remote cache de Vercel para compartir caché entre CI y desarrolladores
