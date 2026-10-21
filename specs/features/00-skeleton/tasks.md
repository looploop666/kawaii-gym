# 00 — Walking skeleton: tareas

**Estado:** 📝 En revisión

Cada tarea es un commit (o un PR chico) y deja el repo funcionando.

- [ ] **T1. Monorepo base.** `package.json` raíz con `packageManager`, `pnpm-workspace.yaml`, `.nvmrc`, `tsconfig.base.json`, ESLint + Prettier, `.gitignore`, `.editorconfig`. Scripts raíz que corren en todos los workspaces. _(ADR 0001)_
- [ ] **T2. `packages/shared`.** Zod, schema `HealthResponse`, export de `version`, Vitest con el test unitario. _(SK-10)_
- [ ] **T3. Base local.** `docker-compose.yml` con `postgres` y `postgres-test`. _(SK-1)_
- [ ] **T4. API: scaffold y config.** Nest con TS strict, `ConfigModule` validado con Zod, `.env.example`. _(SK-2, SK-3)_
- [ ] **T5. API: Prisma.** `schema.prisma` vacío, `PrismaModule`, scripts de migración. _(SK-7)_
- [ ] **T6. API: logs.** `nestjs-pino` con request id y `pino-pretty` en dev. _(SK-5)_
- [ ] **T7. API: health + Swagger.** `HealthModule` con terminus y el indicador de Prisma, respuesta según `HealthResponse`, `nestjs-zod`, Swagger en `/docs`, CORS. _(SK-4, SK-6)_
- [ ] **T8. API: e2e.** Test de `/health` contra `postgres-test`. _(SK-12)_
- [ ] **T9. Web.** Vite + React, pantalla de estado, `.env.example`. _(SK-8)_
- [ ] **T10. Mobile.** Expo, Metro con workspaces, pantalla de estado, `.env.example`, probado en Expo Go. _(SK-9, ADR 0003)_
- [ ] **T11. CI.** Workflow de GitHub Actions y protección de `main`. _(SK-11)_
- [ ] **T12. Documentación y tag.** README raíz con "Cómo correrlo" (prerrequisitos, comandos) y estado actualizado. Verificar que no quede nada específico de Kawaii Gym fuera de `project.config.json` y crear el tag `skeleton-v1`. _(SK-13)_

## Después de 01-auth

- [ ] **T13. Extraer el template.** Crear un repo nuevo (ej. `looploop666/node-fullstack-template`) desde `skeleton-v1` más los ajustes de infraestructura que hayan salido en 01-auth (sin el feature), marcarlo como *Template repository* en GitHub y documentar en su README cómo arrancar un proyecto y cómo quitar web o mobile. _(SK-13)_
