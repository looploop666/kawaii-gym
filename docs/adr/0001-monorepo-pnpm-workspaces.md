# 0001 — Monorepo con pnpm workspaces

**Estado:** Aceptado · **Fecha:** 2026-10-21

## Contexto

API, web y mobile comparten el contrato de datos (`packages/shared`). Lo desarrolla una sola persona y los cambios de contrato tocan varias apps a la vez.

## Opciones

- **A. Repos separados + paquete publicado.** Cada cambio de contrato pide publicar una versión y actualizarla en tres lugares. Demasiada fricción para una persona.
- **B. pnpm workspaces solo.** Links locales entre paquetes, un lockfile, scripts recursivos (`pnpm -r`). Sin cache de tareas.
- **C. pnpm + Turborepo o Nx.** Suman cache y orquestación de tareas. Con 4 paquetes y CI de pocos minutos, todavía no compensan la configuración extra.

## Decisión

**B.** Ya estaba en el stack desde el inicio y alcanza para el tamaño del proyecto.

## Consecuencias

- Un solo PR puede cambiar el contrato y sus tres consumidores.
- Metro (Expo) necesita configuración para resolver los symlinks de pnpm (ver ADR 0003).
- Revisar si sumar Turborepo cuando el CI pase de ~10 minutos.
