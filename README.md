# Kawaii Gym

Clon de [Strong](https://www.strong.app/): aplicación web y mobile para crear y compartir rutinas de entrenamiento, y llevar registro de pesos, repeticiones y progreso en cada sesión.

**MVP:** web + Android. Incluye ejercicios de fuerza y de cardio (tiempo/distancia), RPE y notas, calculadora de discos, login con email o Google, y registro de la sesión en curso sin conexión en mobile. iOS llega junto con el login con Apple.

**Estado:** requirements con el alcance cerrado, a la espera de la aprobación final antes de escribir `design.md`. Todavía no hay código.

## Estructura del repo

```
kawaii-gym/
├── apps/
│   ├── api/       # Backend NestJS + Prisma + PostgreSQL
│   ├── web/        # Frontend web (React)
│   └── mobile/      # Frontend mobile (React Native, Android en el MVP)
├── packages/
│   └── shared/     # Tipos, DTOs y validaciones (Zod) compartidos entre api/web/mobile
└── specs/         # Documentación de spec-driven development
```

## Metodología: Spec-Driven Development

Antes de escribir código, cada feature (o el proyecto completo en sus primeras fases) pasa por 3 documentos en `specs/`:

1. **`requirements-*.md`** — Qué debe hacer el sistema, en formato historia de usuario + criterios de aceptación (EARS).
2. **`design.md`** — Cómo se va a construir: modelo de datos, arquitectura, contratos de API.
3. **`tasks.md`** — Desglose de tareas de implementación, en orden, basadas en el diseño.

Ver [`specs/README.md`](./specs/README.md) para el estado actual de cada documento.

## Stack

- **Backend:** NestJS, TypeScript, Prisma, PostgreSQL, JWT
- **Web:** React
- **Mobile:** React Native (Android en el MVP, código compatible con iOS)
- **Monorepo:** pnpm workspaces
