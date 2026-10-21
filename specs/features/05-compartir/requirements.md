# 05 — Compartir e importar rutinas

**Estado:** 📝 En revisión · **Depende de:** 04-rutinas

Un link de solo lectura que otra persona puede abrir e importar como copia propia.

## Historias

- Como usuario, quiero compartir una rutina por link (ej. por WhatsApp), para que otra persona la pueda usar.
- Como usuario, quiero importar una rutina que me compartieron, para tenerla en mi lista y editarla sin afectar la original.

## API

- **COMP-1.** El dueño genera un token de compartido único y de solo lectura para una rutina propia. Si ya hay uno activo, se reutiliza.
- **COMP-2.** Con el token, cualquiera (sin login) ve la rutina: nombre, ejercicios y series objetivo. Del dueño solo se muestra su nombre público.
- **COMP-3.** Importar requiere login y crea una copia independiente con el usuario como dueño. Los cambios en la copia no afectan la original ni otras copias.
- **COMP-4.** El dueño puede revocar el compartido: el token deja de permitir importaciones. Si vuelve a compartir, se genera uno nuevo.
- **COMP-5.** Token inexistente → `404`. Token revocado → `410`.

## Web

- **COMP-W1.** "Compartir" en una rutina propia genera (o reutiliza) el link y ofrece copiarlo.
- **COMP-W2.** Al abrir un link sin login se ve la vista previa con la opción de loguearse o registrarse para importar, volviendo al link después (AUTH-W4). Con login, confirmar la importación crea la copia y navega a ella.

## Mobile

- **COMP-M1.** "Compartir" usa el share sheet nativo con el link.
- **COMP-M2.** Si la app está instalada, el link (deep link) abre la vista previa de la rutina en la app.

## Fuera de alcance

- Feed social, seguir usuarios o explorar rutinas públicas.
