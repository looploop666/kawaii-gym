# 00 — Walking skeleton: diseño

**Estado:** ✅ Aprobado

## Decisiones

| ADR | Decisión |
|---|---|
| [0001](../../../docs/adr/0001-monorepo-pnpm-workspaces.md) | Monorepo con pnpm workspaces, sin Turborepo ni Nx por ahora |
| [0002](../../../docs/adr/0002-contrato-compartido-con-zod.md) | Contrato y validación con Zod en `packages/shared`, usado por API, web y mobile |
| [0003](../../../docs/adr/0003-mobile-con-expo.md) | Mobile con Expo (React Native) |
| [0004](../../../docs/adr/0004-deploy-diferido.md) | Deploy diferido: solo local + CI |

## Estructura

```
kawaii-gym/
├── package.json            # scripts raíz: dev, lint, typecheck, test, build
├── project.config.json     # nombre, slug y id Android (SK-13)
├── pnpm-workspace.yaml     # apps/*, packages/*
├── tsconfig.base.json      # strict, compartido por todos
├── eslint.config.mjs       # flat config + Prettier
├── docker-compose.yml      # postgres (dev) + postgres (test, otro puerto)
├── .github/workflows/ci.yml
├── apps/
│   ├── api/                # NestJS + Prisma
│   ├── web/                # Vite + React
│   └── mobile/             # Expo
└── packages/
    └── shared/             # schemas Zod + tipos inferidos
```

## Tooling

- **Node 22 LTS**, fijado en `.nvmrc` y en `engines`.
- **pnpm** activado con `corepack enable` y fijado en `packageManager` del `package.json` raíz.
- **TypeScript strict** en todo el repo. Cada paquete extiende `tsconfig.base.json`.
- **ESLint (flat config) + Prettier** en la raíz.
- **Tests:** Jest en la API (lo que trae Nest), Vitest en `shared` y web.
- Versiones: la última estable de cada herramienta al momento de instalarla, fijadas en el lockfile.

## `packages/shared`

- Exporta schemas Zod y los tipos inferidos (`z.infer`). Primer schema: `HealthResponse { status: 'ok' | 'error', db: 'up' | 'down', version: string }`.
- Se consume como código TypeScript desde los workspaces (`"main": "src/index.ts"`), sin paso de build propio. Nest, Vite y Metro lo compilan como parte de cada app.
- `version` sale del `package.json` de `shared`, así web y mobile pueden mostrar con qué versión del contrato están hablando (SK-8).

## API (`apps/api`)

| Pieza | Elección |
|---|---|
| Config | `@nestjs/config` con un schema Zod que valida `process.env` al iniciar (SK-2) |
| Base | Prisma con PostgreSQL. `prisma migrate dev` en local, `prisma migrate deploy` en CI (SK-7) |
| Health | `@nestjs/terminus` con un indicador propio que hace `SELECT 1` vía Prisma (SK-4) |
| Logs | `nestjs-pino`. Request id desde el header `x-request-id` o generado con `randomUUID`, y devuelto en la respuesta. `pino-pretty` solo en desarrollo (SK-5) |
| Validación | `nestjs-zod`: DTOs creados desde los schemas de `shared` y documentados en Swagger |
| Docs | `@nestjs/swagger` en `/docs`, solo si `NODE_ENV !== 'production'` (SK-6) |
| CORS | Habilitado para el origen de la web de desarrollo (configurable por env) |

Variables de entorno: `DATABASE_URL`, `PORT` (default 3000), `NODE_ENV`, `CORS_ORIGIN`, `LOG_LEVEL`.

Módulos iniciales: `ConfigModule`, `LoggerModule`, `PrismaModule` (global, expone `PrismaService`) y `HealthModule`. El `schema.prisma` arranca sin modelos de negocio; la primera migración llega con 01-auth.

## Web (`apps/web`)

- Vite + React + TypeScript.
- Una sola pantalla: llama a `/health`, valida la respuesta con el schema de `shared` y muestra el estado de la API y de la base, y la versión del contrato.
- `VITE_API_URL` en `.env`.
- Router, estado global y librería de UI se eligen en 01-auth, que es cuando hay más de una pantalla.

## Mobile (`apps/mobile`)

- Expo con TypeScript, corriendo en **Expo Go** en un Android físico durante el skeleton. No hace falta Android Studio ni JDK 17.
- Misma pantalla que la web.
- `EXPO_PUBLIC_API_URL` apunta a la IP local de la máquina (el celular no ve `localhost`).
- Metro configurado para resolver workspaces de pnpm.
- Development build (que sí requiere Android SDK o EAS Build) recién cuando se necesiten módulos nativos: login con Google (AUTH-M4) y almacenamiento seguro (AUTH-M1). Ver ADR 0003.

## Base local (`docker-compose.yml`)

- `postgres` (dev, puerto 5432) y `postgres-test` (puerto 5433, con `tmpfs` para que sea rápida y descartable).
- Imagen `postgres` con versión mayor fijada (ej. `postgres:17`).

## CI (`.github/workflows/ci.yml`)

En cada push a un PR y a `main`:

1. Checkout, setup de Node desde `.nvmrc`, `corepack enable`, `pnpm install --frozen-lockfile` con cache.
2. `pnpm lint` y `pnpm typecheck` en todos los workspaces.
3. `pnpm test` (unitarios).
4. e2e de la API con un *service container* de PostgreSQL: `prisma migrate deploy` y `pnpm --filter api test:e2e`.
5. `pnpm build` de API y web. Mobile solo se valida con typecheck y lint; no se buildea en CI.

Protección de `main` (configurada a mano en GitHub): requiere que el job de CI pase antes de mergear.

## Reutilizable como template (SK-13)

- **Paquetes con scope genérico:** `@app/api`, `@app/web`, `@app/mobile`, `@app/shared`. Renombrar el scope en un proyecto nuevo es un buscar y reemplazar.
- **Identidad en un solo archivo:** `project.config.json` en la raíz, con `name` (nombre visible), `slug` y `androidPackage`. Lo leen:
  - la API, para el título de Swagger y el campo `service` de los logs;
  - la web, para el `<title>` (vía `vite.config.ts`);
  - mobile, para `name`, `slug` y `android.package` (vía `app.config.ts`, en vez de un `app.json` estático).
- **Sin dominio:** ni modelos de Prisma, ni pantallas, ni textos de Kawaii Gym. La pantalla de estado es genérica.
- **Piezas opcionales:** el README del template va a documentar cómo quitar `apps/web` o `apps/mobile` (borrar la carpeta y su paso en el CI).

## Tests del skeleton

- **Unitario (shared):** `HealthResponse` acepta una respuesta válida y rechaza una inválida.
- **e2e (api):** `GET /health` → `200` con `db: 'up'` contra la base de test, y la respuesta trae el header `x-request-id`.
