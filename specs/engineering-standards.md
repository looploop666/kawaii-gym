# Estándares de ingeniería

Reglas que valen para todo el proyecto, no para un feature. Cada feature las cumple sin repetirlas en sus requirements.

## Seguridad

- **STD-1.** HTTPS en todos los ambientes salvo desarrollo local.
- **STD-2.** Todo input de la API se valida en los DTOs de entrada.
- **STD-3.** Autorización por recurso: un usuario nunca accede a datos de otro, salvo lo que se comparte explícitamente (05-compartir).
- **STD-4.** Los logs nunca incluyen datos sensibles (contraseñas, tokens).

## API

- **STD-5.** Documentación OpenAPI/Swagger autogenerada, navegable en desarrollo.
- **STD-6.** Todo endpoint de listado es paginado.

## Datos

- **STD-7.** Las reglas críticas del dominio se refuerzan en la base con constraints, además de la validación en los DTOs (ej. valores obligatorios por tipo de métrica, rango del RPE, unicidad del id de set generado por el cliente).
- **STD-8.** Las queries de historial y progreso usan índices, comprobado con `EXPLAIN ANALYZE` sobre un seed de volumen realista (ej. 2 años de sesiones de varios usuarios).

## Testing

- **STD-9.** Tests unitarios para la lógica de dominio: PRs por tipo de métrica, 1RM, validación de sets, importación de rutinas, calculadora de discos.
- **STD-10.** Tests e2e para los flujos críticos: registro/login, crear rutina, registrar sesión, compartir/importar.

## Observabilidad

- **STD-11.** Logs estructurados en JSON con nivel, timestamp y contexto.
- **STD-12.** Cada request tiene un request id (o reutiliza el que manda el cliente), presente en sus logs y en la respuesta.
- **STD-13.** `/health` verifica la conexión a la base.

## CI/CD e infraestructura

- **STD-14.** Cada PR corre lint, tipos, tests unitarios y e2e (contra un PostgreSQL efímero) y build. Si algo falla, no se mergea.
- **STD-15.** La infraestructura de los ambientes desplegados se define como código.
- **STD-16.** Las migraciones se aplican automáticamente y versionadas en el deploy, nunca a mano.
- **STD-17.** Cada decisión técnica relevante se documenta como ADR en `docs/adr/` (contexto, opciones, decisión, consecuencias).

## Frontends

- **STD-18.** Web usable en desktop y en viewport mobile (la experiencia "en el gym" es de la app mobile).
- **STD-19.** Si una request falla, feedback claro (toast o inline) sin perder lo que el usuario ya escribió.
- **STD-20.** Formularios operables por teclado y con labels asociados.
- **STD-21.** Mobile es un único código base de React Native, compatible con iOS y sin lógica de negocio duplicada entre plataformas.

## Stack y prácticas elegidas (2026-10-20)

| Práctica | Cómo se aplica |
|---|---|
| ADRs | `docs/adr/`, una por cada punto de [design-backlog.md](./design-backlog.md) |
| PostgreSQL a fondo | Constraints `CHECK` por tipo de métrica, índices validados con `EXPLAIN ANALYZE`, transacción al finalizar/corregir sesión + PRs |
| Resiliencia | Sets idempotentes y cola offline con backoff en mobile |
| Observabilidad | `pino`, request id, `@nestjs/terminus` |
| CI/CD e IaC | GitHub Actions, Terraform, Prisma Migrate |
| Eventos de dominio | En proceso con `@nestjs/event-emitter`; BullMQ + Redis solo si hace falta trabajo en background |

**Fuera del MVP:** Kafka/RabbitMQ, Kubernetes, OpenTelemetry, durable execution, streaming en tiempo real, IA (pgvector, AI gateway). No se justifican para una sola API.
