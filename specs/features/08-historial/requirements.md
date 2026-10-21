# 08 — Historial, progreso y PRs

**Estado:** 📝 En revisión · **Depende de:** 06-sesiones

## Historias

- Como usuario, quiero ver mis entrenamientos pasados, para revisar qué hice y cuándo.
- Como usuario, quiero ver cómo evolucionan mis marcas en un ejercicio, para saber si estoy progresando.
- Como usuario, quiero que la app detecte cuándo bato un récord personal.

## API

- **HIST-1.** El historial devuelve las sesiones completadas, de la más reciente a la más vieja, paginadas y filtrables por rango de fechas y por rutina.
- **HIST-2.** El progreso de un ejercicio es la serie temporal de sus sets, con las métricas de su tipo:

  | Tipo de métrica | Métricas | PRs |
  |---|---|---|
  | `peso_reps` | fecha, peso, reps, volumen, 1RM estimado por sesión (Epley u otra fórmula estándar) | peso máximo, reps máximas a un peso, 1RM estimado máximo, volumen máximo en una sesión |
  | `reps` | reps | reps máximas en un set |
  | `tiempo` | duración | duración máxima en un set |
  | `distancia_tiempo` | distancia, duración, ritmo | distancia máxima en un set, mejor ritmo |

- **HIST-3.** Los sets warmup no cuentan para el volumen ni para los PRs.
- **HIST-4.** WHEN se registra o se edita un set completado THEN se evalúa si es un PR nuevo para ese usuario y ejercicio (columna "PRs").
- **HIST-5.** Los PRs se guardan y se exponen para que el cliente los muestre.
- **HIST-6.** Finalizar o corregir una sesión y recalcular sus PRs ocurre todo junto o nada.

## Web

- **HIST-W1.** "Historial" lista las sesiones con filtros por fechas y por rutina.
- **HIST-W2.** El detalle de una sesión muestra ejercicios, sets con sus valores, RPE, notas por ejercicio, nota general y duración.
- **HIST-W3.** El detalle de un ejercicio muestra un gráfico de progreso según su tipo: peso máximo o 1RM estimado (`peso_reps`), reps, duración, distancia o ritmo. Los PRs se destacan visualmente.

## Mobile

- **HIST-M1.** Mismo historial y detalle de sesión que web, en lista.
- **HIST-M2.** El gráfico de progreso se adapta a pantalla chica (scroll y zoom táctil).

## Fuera de alcance

- Peso corporal y medidas.
- Integración con Google Fit / Apple Health.
