# 06 — Sesiones de entrenamiento

**Estado:** 📝 En revisión · **Depende de:** 02-perfil, 04-rutinas

Registrar un entrenamiento: iniciarlo, cargar sets, descansar, calcular discos y finalizarlo. En mobile es la experiencia core del producto: rápida, con una mano y con mala conexión (ver 07-offline).

## Historias

- Como usuario, quiero iniciar un entrenamiento desde una rutina (o vacío), para registrar lo que hago hoy.
- Como usuario en el gimnasio, quiero cargar cada serie con muy pocos taps entre series de esfuerzo.
- Como usuario, quiero un timer de descanso que me avise cuándo volver a entrenar.
- Como usuario, quiero saber qué discos poner de cada lado de la barra, sin hacer la cuenta mental.
- Como usuario, quiero cerrar el entrenamiento con un resumen y poder corregirlo después si me equivoqué.

## API

**Inicio**

- **SES-1.** Iniciar desde una rutina crea una sesión "en progreso" precargada con sus ejercicios y series objetivo, como sugerencia editable. También se puede iniciar una sesión vacía.
- **SES-2.** IF ya hay una sesión en progreso THEN se reanuda o se exige cerrarla (a decidir en diseño).

**Sets**

- **SES-3.** Cada set guarda los valores de su tipo de métrica, si es warmup y un RPE opcional (1 a 10, en pasos de 0.5):

  | Tipo de métrica | Valores obligatorios |
  |---|---|
  | `peso_reps` | peso, unidad, reps |
  | `reps` | reps |
  | `tiempo` | duración |
  | `distancia_tiempo` | distancia, unidad, duración |

- **SES-4.** Un set sin sus valores obligatorios, con valores de otro tipo o con un RPE fuera de rango → `400`.
- **SES-5.** Marcar un set como completado guarda el momento en que se completó.
- **SES-6.** Mientras la sesión está en progreso se pueden agregar, editar y eliminar sets libremente, y agregar ejercicios no planeados.
- **SES-7.** Reenviar un set ya guardado SHALL NOT duplicarlo: el cliente manda un id generado de su lado (ver 07-offline).
- **SES-8.** Notas opcionales de texto libre: una por ejercicio dentro de la sesión y una general de la sesión.

**Fin y corrección**

- **SES-9.** Finalizar guarda inicio y fin y marca la sesión como completada.
- **SES-10.** Una sesión sin sets completados se puede descartar en vez de guardarse vacía.
- **SES-11.** El dueño puede corregir una sesión finalizada y los PRs se recalculan (HIST-6). Otro usuario → `403`.

## Calculadora de discos (web y mobile)

- **DISC-1.** Desde un set `peso_reps`, muestra los discos por lado para llegar al peso, según la barra y los discos del perfil.
- **DISC-2.** IF el peso no se puede armar exacto THEN muestra la combinación más cercana por debajo y la diferencia.
- **DISC-3.** Cambiar la barra desde la calculadora recalcula al instante sin tocar el perfil, salvo que se pida guardarlo.
- **DISC-4.** Web y mobile usan la misma lógica, y funciona sin conexión. No hay cálculo del lado del servidor.

## Web

- **SES-W1.** "Empezar entrenamiento" abre la sesión activa precargada. Se pueden agregar ejercicios o series extra sin salir de esa vista.
- **SES-W2.** Cada set se carga con los valores reales de su tipo, RPE opcional y nota por ejercicio.
- **SES-W3.** Si se cierra el navegador, la sesión se retoma al volver (vive en el backend).
- **SES-W4.** Al finalizar, resumen con duración, volumen total y PRs logrados, y la opción de agregar una nota general.

## Mobile

**Navegación**

- **SES-M1.** El modo entrenamiento abre en el primer ejercicio. Al completar sus series sugiere el siguiente sin forzarlo, se puede saltar de ejercicio libremente y "+ agregar serie" funciona con un tap.
- **SES-M2.** El estado se mantiene si se minimiza la app o se apaga la pantalla.

**Cargar un set**

- **SES-M3.** Los campos se prellenan con la serie anterior de la misma sesión o con el objetivo de la rutina.
- **SES-M4.** Peso y reps tienen steppers grandes (+/- según el incremento del perfil) y entrada directa. Tiempo y distancia, entrada directa (ej. mm:ss).
- **SES-M5.** Completar un set da feedback inmediato (visual y opcionalmente háptico), se guarda local al instante y responde en menos de 100 ms percibidos.
- **SES-M6.** El RPE tiene un selector rápido opcional que no frena el flujo. Se puede agregar una nota por ejercicio.

**Timer de descanso**

- **SES-M7.** Al completar un set ofrece iniciar el timer (automático o con un tap) con el descanso del perfil. Se puede sumar o restar tiempo, o saltarlo, con un tap.
- **SES-M8.** Al terminar avisa con sonido, vibración o notificación local, aunque la app esté en background. El permiso de notificaciones se pide la primera vez que se usa el timer, no al abrir la app.

**Finalizar**

- **SES-M9.** Mismo resumen que web (SES-W4). Si no hay sets completados, pregunta si descartar la sesión.

## Fuera de alcance

- Superseries y circuitos como estructura propia (se registran como ejercicios consecutivos).
- Registrar sets por voz, Apple Watch / Wear OS, widgets.
