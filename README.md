# Kawaii Gym

Clon de [Strong](https://www.strong.app/): aplicación web y mobile para crear y compartir rutinas de entrenamiento, y llevar registro de pesos, repeticiones y progreso en cada sesión.

**MVP:** web + Android. Incluye ejercicios de fuerza y de cardio (tiempo/distancia), RPE y notas, calculadora de discos, login con email o Google, y registro de la sesión en curso sin conexión en mobile. iOS llega junto con el login con Apple.

**Estado:** requirements organizados por feature. En revisión la spec del walking skeleton (`specs/features/00-skeleton/`) y sus ADRs (`docs/adr/`). Todavía no hay código.

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

Cada feature tiene su carpeta en `specs/features/` y pasa por 3 documentos antes de escribir código:

1. **`requirements.md`** — Qué debe hacer el sistema (API, web y mobile en el mismo archivo), con historias de usuario y reglas con ids estables. EARS solo para la lógica delicada.
2. **`design.md`** — Cómo se va a construir: modelo de datos, arquitectura, contratos de API.
3. **`tasks.md`** — Desglose de tareas de implementación, en orden, basadas en el diseño.

Los features se especifican e implementan de a uno. Las reglas transversales están en `specs/engineering-standards.md`.

Las decisiones técnicas relevantes se documentan como ADRs (Architecture Decision Records) en `docs/adr/`.

Ver [`specs/README.md`](./specs/README.md) para el estado actual de cada documento.

## Stack

- **Backend:** NestJS, TypeScript, Prisma, PostgreSQL, JWT
- **Observabilidad:** logs estructurados con pino, health check con @nestjs/terminus
- **CI/CD e infraestructura:** GitHub Actions, Terraform
- **Web:** React
- **Mobile:** React Native (Android en el MVP, código compatible con iOS)
- **Monorepo:** pnpm workspaces
