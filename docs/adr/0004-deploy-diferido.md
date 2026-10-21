# 0004 — Deploy diferido: solo local + CI

**Estado:** Aceptado · **Fecha:** 2026-10-21

## Contexto

El walking skeleton idealmente incluye deploy, para que el riesgo de infraestructura aparezca temprano. Se evaluaron GCP (Cloud Run + Neon), AWS (App Runner/ECS + RDS) y Render, todos con Terraform (STD-15).

## Decisión

Por ahora, **solo local + CI**. El skeleton corre con Docker Compose y se valida en GitHub Actions. Proveedor, ambientes y Terraform se deciden en un ADR nuevo.

## Consecuencias

- STD-15 (infra como código) y STD-16 (migraciones en el deploy) quedan pendientes hasta ese ADR. En CI las migraciones ya corren con `prisma migrate deploy`, así que el mecanismo queda probado.
- La API se configura solo por variables de entorno y `/health` ya existe: deployarla después no debería pedir cambios de código.
- Revisar antes de 06-sesiones. Probar en el celular contra una API remota es lo que hace realista el modo entrenamiento y el offline.
