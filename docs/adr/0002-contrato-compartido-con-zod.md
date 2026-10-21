# 0002 — Contrato y validación compartidos con Zod

**Estado:** Propuesto · **Fecha:** 2026-10-21

## Contexto

Web y mobile validan formularios con las mismas reglas que la API (ej. valores obligatorios por tipo de métrica, rango del RPE). STD-2 pide validar todo input de la API. Si las reglas se escriben dos veces, se desincronizan.

## Opciones

- **A. class-validator en la API + tipos a mano en `shared`.** Es lo idiomático en Nest y lo que trae la documentación oficial. Pero los decoradores no corren en el cliente, así que la validación de formularios se duplica.
- **B. Zod en `shared`, usado por los tres.** Un schema genera el tipo (`z.infer`), valida en el cliente y valida en la API vía `nestjs-zod`, que también lo documenta en Swagger. Se aleja un poco del Nest "de manual".
- **C. OpenAPI primero + generar clientes.** Más robusto entre lenguajes, pero suma un paso de generación que no hace falta con todo en TypeScript.

## Decisión

**B.** Una sola definición de cada regla. Encaja con `packages/shared`, que ya era la fuente del contrato.

## Consecuencias

- Los DTOs de la API se crean con `createZodDto(schema)` en vez de clases decoradas.
- Swagger sale de los schemas Zod. Hay que verificar que los casos complejos (uniones por tipo de métrica) se documenten bien.
- Las validaciones que dependen de la base (ej. "el ejercicio existe") siguen en los servicios, no en el schema.
