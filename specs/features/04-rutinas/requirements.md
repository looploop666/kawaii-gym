# 04 — Rutinas

**Estado:** 📝 En revisión · **Depende de:** 03-ejercicios

Plantillas de entrenamiento: lista ordenada de ejercicios con series objetivo.

## Historias

- Como usuario, quiero armar una rutina con ejercicios y series objetivo, para tener una plantilla que seguir en el gimnasio.
- Como usuario, quiero ver mis rutinas, para elegir cuál entrenar hoy.

## API

- **RUT-1.** Una rutina requiere nombre y puede arrancar sin ejercicios.
- **RUT-2.** Cada ejercicio de la rutina tiene N series objetivo con los campos de su tipo de métrica, todos opcionales:

  | Tipo de métrica | Campos objetivo |
  |---|---|
  | `peso_reps` | peso y reps (o rango de reps) |
  | `reps` | reps (o rango) |
  | `tiempo` | duración |
  | `distancia_tiempo` | distancia y/o duración |

- **RUT-3.** El orden de los ejercicios se guarda.
- **RUT-4.** El detalle devuelve los ejercicios con sus series objetivo, en orden.
- **RUT-5.** Solo el dueño ve, edita y elimina sus rutinas → `403` si no. Una rutina importada es de quien la importó.
- **RUT-6.** Quitar ejercicios de una rutina o eliminarla (soft delete) no afecta las sesiones ya registradas.

## Web

- **RUT-W1.** El dashboard lista las rutinas con nombre y cantidad de ejercicios. Sin rutinas, muestra un estado vacío con la opción de crear la primera o importar una compartida.
- **RUT-W2.** Builder para crear y editar: nombre, ejercicios desde el buscador (EJ-W1), series según el tipo de métrica y reordenar con drag-and-drop (se guarda al soltar).
- **RUT-W3.** Quitar un ejercicio o una serie muestra un aviso informativo (no bloqueante) solo si ya hay sesiones registradas desde esa rutina. Eliminar la rutina pide confirmación en un modal.
- **RUT-W4.** Se ve el estado de guardado (guardando / guardado / error).

## Mobile

- **RUT-M1.** La pantalla principal muestra las rutinas con un botón "Empezar" en cada una. Sin conexión y sin sesión en progreso, muestra "sin conexión" con opción de reintentar.
- **RUT-M2.** Crear y editar con los mismos campos que web, con steppers +/- además del teclado. Reordenar con long-press + drag o con botones subir/bajar.

## Fuera de alcance

- Drag-and-drop de ejercicios entre rutinas distintas.
