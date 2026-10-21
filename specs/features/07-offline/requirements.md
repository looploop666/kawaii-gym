# 07 — Sesión en curso sin conexión (mobile)

**Estado:** 📝 En revisión · **Depende de:** 06-sesiones

**Alcance (decidido 2026-10-16):** solo la sesión **en curso** funciona sin conexión. Iniciar una sesión, ver rutinas o ver el historial requiere conexión.

## Historias

- Como usuario, quiero que no se pierda lo que registro si me quedo sin señal en medio del entrenamiento, y que se envíe solo cuando vuelva la conexión.

## Mobile

- **OFF-1.** Registrar, editar o eliminar sets sin conexión se guarda localmente y se puede seguir entrenando con normalidad.
- **OFF-2.** WHEN vuelve la conexión THEN los cambios pendientes se reenvían solos, en orden y sin duplicar (SES-7).
- **OFF-3.** IF el envío falla (error del servidor o conflicto) THEN los datos locales quedan intactos, se indica que hay cambios pendientes y se sigue reintentando con backoff exponencial (con tope), sin bloquear el entrenamiento.
- **OFF-4.** Finalizar sin conexión queda pendiente y se envía después de los sets pendientes.
- **OFF-5.** Los cambios pendientes sobreviven a cerrar o reiniciar la app, y el reintento se retoma al abrirla.

## API

- Solo garantiza la idempotencia de SES-7. No hay endpoints de sincronización.

## Fuera de alcance

- Offline completo: iniciar sesiones, ver rutinas o historial sin conexión, y editar rutinas offline.
- Offline en web.
