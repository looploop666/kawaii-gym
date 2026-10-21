# Architecture Decision Records

Una decisión por archivo, numeradas y nunca borradas. Si una decisión cambia, se escribe un ADR nuevo que reemplaza al anterior y se marca el viejo como "Reemplazado por NNNN".

| # | Decisión | Estado |
|---|---|---|
| [0001](./0001-monorepo-pnpm-workspaces.md) | Monorepo con pnpm workspaces | Aceptado |
| [0002](./0002-contrato-compartido-con-zod.md) | Contrato y validación compartidos con Zod | Aceptado |
| [0003](./0003-mobile-con-expo.md) | Mobile con Expo | Aceptado |
| [0004](./0004-deploy-diferido.md) | Deploy diferido: solo local + CI | Aceptado |

## Plantilla

```markdown
# NNNN — Título

**Estado:** Propuesto | Aceptado | Reemplazado por NNNN · **Fecha:** AAAA-MM-DD

## Contexto
Qué problema hay y qué restricciones importan.

## Opciones
- **A.** … (a favor / en contra)
- **B.** …

## Decisión
Qué elegimos y por qué.

## Consecuencias
Qué se vuelve más fácil, qué más difícil y qué hay que revisar más adelante.
```
