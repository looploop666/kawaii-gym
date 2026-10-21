# Requirements — Mobile

Stack: React Native. Consume la API definida en `requirements-backend.md`.

Rol de mobile frente a web: mobile es la app **primaria para entrenar en el gimnasio en vivo** — igual que en Strong, esta es la experiencia core del producto. Debe funcionar rápido, con una mano, con mala conectividad, y sin fricción entre series.

## 1. Autenticación

### Requirement 1.1 — Registro / Login / Logout
**User Story:** Como usuario, quiero crear una cuenta o iniciar sesión desde el celular.

**Acceptance Criteria:**
1. WHEN un visitante se registra o inicia sesión con datos válidos THEN el sistema SHALL guardar los tokens de forma segura (secure storage / keychain, no AsyncStorage plano) y navegar al home.
2. WHEN un usuario abre la app y ya tiene sesión válida (o refresh token válido) THEN el sistema SHALL loguearlo automáticamente sin pedir credenciales.
3. WHEN un usuario hace logout THEN el sistema SHALL borrar los tokens locales y cualquier dato de sesión en progreso no sincronizado (con confirmación si hay datos sin sincronizar).

### Requirement 1.2 — Login con Google
**User Story:** Como usuario de Android, quiero entrar con mi cuenta de Google desde el celular con un par de taps.

**Acceptance Criteria:**
1. WHEN la app corre en Android y un visitante abre las pantallas de login o de registro THEN el sistema SHALL mostrar "Continuar con Google" usando el selector de cuentas nativo de Android.
2. WHEN la app corre en iOS THEN el sistema SHALL NOT mostrar login con Google hasta que se incorpore Sign in with Apple (la App Store exige ofrecer Apple si se ofrece cualquier login de terceros). En iOS el MVP usa solo email y contraseña.
3. WHEN el usuario completa el flujo del proveedor THEN el sistema SHALL enviar el ID token a la API (backend Req. 1.5) y guardar los tokens resultantes igual que en el Requirement 1.1.1.
4. WHEN el usuario cancela el flujo del proveedor THEN el sistema SHALL volver a la pantalla de login sin mostrar un error.

---

## 2. Catálogo de ejercicios

### Requirement 2.1 — Buscar ejercicios
**User Story:** Como usuario, quiero buscar un ejercicio rápido desde el celular mientras entreno.

**Acceptance Criteria:**
1. WHEN un usuario busca un ejercicio por nombre THEN el sistema SHALL filtrar la lista localmente si ya está cacheada, o contra la API si no.
2. WHEN un usuario filtra por grupo muscular/equipamiento THEN el sistema SHALL aplicar el filtro igual que en la web (mismo contrato de API).

### Requirement 2.2 — Crear ejercicio propio
**User Story:** Como usuario, quiero poder crear un ejercicio personalizado desde el celular, sin tener que ir a la web.

**Acceptance Criteria:**
1. WHEN un usuario crea un ejercicio propio desde mobile THEN el sistema SHALL sincronizarlo con el backend y estar disponible también en web.

---

## 3. Rutinas

### Requirement 3.1 — Ver y elegir rutina
**User Story:** Como usuario, quiero ver mis rutinas y elegir una para entrenar hoy, con pocos taps.

**Acceptance Criteria:**
1. WHEN un usuario abre la pantalla principal THEN el sistema SHALL mostrar sus rutinas con un botón directo de "Empezar" en cada una.
2. WHEN un usuario no tiene conexión y no hay una sesión en progreso THEN el sistema SHALL mostrar un estado "sin conexión" claro con opción de reintentar (ver alcance offline en el Requirement 4.4).

### Requirement 3.2 — Crear/editar rutina (táctil)
**User Story:** Como usuario, quiero poder armar o ajustar una rutina desde el celular, aunque sea más cómodo en la web.

**Acceptance Criteria:**
1. WHEN un usuario crea o edita una rutina desde mobile THEN el sistema SHALL ofrecer los mismos campos que la web (nombre, ejercicios, series objetivo según el tipo de métrica de cada ejercicio) con controles táctiles (steppers +/-, no solo teclado numérico).
2. WHEN un usuario reordena ejercicios en mobile THEN el sistema SHALL soportar reordenar por long-press + drag o por botones subir/bajar.

---

## 4. Modo entrenamiento activo (feature core)

### Requirement 4.1 — Iniciar y navegar la sesión
**User Story:** Como usuario en el gimnasio, quiero una pantalla de "entrenando ahora" que me muestre el ejercicio actual y me deje avanzar rápido entre ejercicios y series.

**Acceptance Criteria:**
1. WHEN un usuario inicia una sesión desde una rutina THEN el sistema SHALL abrir el modo entrenamiento con el primer ejercicio y sus series objetivo precargadas.
2. WHEN un usuario completa todas las series de un ejercicio THEN el sistema SHALL sugerir avanzar al siguiente ejercicio sin forzarlo (el usuario puede saltar de ejercicio libremente).
3. WHEN un usuario quiere agregar una serie extra no planeada THEN el sistema SHALL permitirlo con un tap ("+ agregar serie").
4. WHEN el usuario minimiza la app o se le apaga la pantalla durante el entrenamiento THEN el sistema SHALL mantener el estado de la sesión en progreso al volver.

### Requirement 4.2 — Registrar un set con fricción mínima
**User Story:** Como usuario, quiero cargar cada serie (peso y reps, tiempo o distancia) con muy pocos taps, idealmente con una mano, entre series de esfuerzo físico.

**Acceptance Criteria:**
1. WHEN un usuario abre un set para cargar THEN el sistema SHALL mostrar los campos del tipo de métrica del ejercicio (backend Req. 5.2.1) y SHALL prellenarlos con el valor de la serie anterior (misma sesión) o del objetivo de la rutina, lo que sea más relevante.
2. WHEN un usuario ajusta peso o reps THEN el sistema SHALL ofrecer steppers grandes (+/- según el incremento de peso de las preferencias del perfil, backend Req. 1.4.1) además de entrada numérica directa. Para tiempo y distancia SHALL ofrecer entrada numérica directa (ej. mm:ss para la duración).
3. WHEN un usuario marca un set como completado THEN el sistema SHALL dar feedback inmediato (visual, y opcionalmente háptico) y SHALL guardar el registro localmente al instante (ver Requirement 4.4 sobre offline).
4. WHEN un usuario marca un set como "warmup" THEN el sistema SHALL excluirlo del cálculo de volumen total y de PRs.
5. WHEN un usuario quiere indicar el RPE de un set THEN el sistema SHALL ofrecer un selector rápido opcional (1 a 10, en pasos de 0.5) que no se interponga en el flujo de completar el set.
6. WHEN un usuario quiere anotar algo sobre un ejercicio (ej. "agarre más cerrado") THEN el sistema SHALL permitir agregar una nota a ese ejercicio dentro de la sesión.

### Requirement 4.3 — Timer de descanso
**User Story:** Como usuario, quiero un cronómetro de descanso entre series que me avise cuándo volver a entrenar.

**Acceptance Criteria:**
1. WHEN un usuario completa un set THEN el sistema SHALL ofrecer iniciar automáticamente (o con un tap) un timer de descanso con la duración por defecto de las preferencias del perfil (backend Req. 1.4.1).
2. WHEN el timer de descanso termina THEN el sistema SHALL notificar al usuario (sonido/vibración/notificación local) incluso si la app está en background.
3. WHEN un usuario quiere ajustar el timer en curso (sumar/restar tiempo, saltarlo) THEN el sistema SHALL permitirlo con un tap.

### Requirement 4.4 — Funcionamiento offline
**User Story:** Como usuario, quiero que no se pierda lo que registro si me quedo sin señal en medio del entrenamiento (sótano, WiFi caído), y que se envíe solo cuando vuelva la conexión.

> **Alcance MVP (decidido 2026-10-16):** offline simplificado. Solo la sesión **en curso** funciona sin conexión. Iniciar una sesión, ver rutinas o ver historial requiere conexión. El offline completo queda fuera del MVP.

**Acceptance Criteria:**
1. WHEN un usuario registra, edita o elimina un set de la sesión en curso sin conexión THEN el sistema SHALL guardar el cambio localmente y SHALL permitir seguir entrenando con normalidad.
2. WHEN la conexión se restablece THEN el sistema SHALL reintentar automáticamente el envío de los cambios pendientes, en orden, usando identificadores generados en el cliente para no duplicar datos (backend Req. 5.2.8).
3. IF el envío falla (error del servidor o conflicto) THEN el sistema SHALL mantener los datos locales intactos, SHALL indicar que hay cambios pendientes de enviar y SHALL seguir reintentando con backoff exponencial (intervalos crecientes con un tope), sin bloquear el entrenamiento.
4. WHEN un usuario finaliza la sesión sin conexión THEN el sistema SHALL guardar la finalización como pendiente y enviarla cuando vuelva la conexión, después de los sets pendientes.
5. WHEN la app se cierra o se reinicia con cambios pendientes THEN el sistema SHALL conservarlos en almacenamiento persistente del dispositivo y retomar el reintento al volver a abrirla.

### Requirement 4.5 — Finalizar sesión
**User Story:** Como usuario, quiero cerrar mi entrenamiento y ver un resumen antes de guardarlo.

**Acceptance Criteria:**
1. WHEN un usuario finaliza la sesión THEN el sistema SHALL mostrar duración total, volumen total y PRs logrados, con opción de agregar una nota general de la sesión (backend Req. 5.3.3).
2. WHEN un usuario finaliza una sesión sin haber completado ningún set THEN el sistema SHALL preguntar si desea descartarla en vez de guardarla vacía.

### Requirement 4.6 — Calculadora de discos
**User Story:** Como usuario, quiero saber qué discos poner de cada lado de la barra para llegar al peso del set, sin hacer la cuenta mental entre series.

**Acceptance Criteria:**
1. WHEN un usuario abre la calculadora desde un set de un ejercicio `peso_reps` THEN el sistema SHALL mostrar los discos por lado necesarios para llegar al peso del set, usando el peso de la barra y los discos disponibles de las preferencias del perfil (backend Req. 1.4.1).
2. IF el peso no se puede armar exacto con los discos disponibles THEN el sistema SHALL mostrar la combinación más cercana por debajo e indicar la diferencia.
3. WHEN un usuario cambia el peso de la barra desde la calculadora THEN el sistema SHALL recalcular al instante sin guardar el cambio en el perfil, salvo que lo pida explícitamente.
4. El cálculo SHALL vivir en `packages/shared`, para que web y mobile usen la misma lógica, y SHALL funcionar sin conexión.

---

## 5. Compartir e importar rutinas

### Requirement 5.1 — Compartir e importar desde mobile
**User Story:** Como usuario, quiero compartir una rutina o importar una que me compartieron, directamente desde el celular (ej. por WhatsApp).

**Acceptance Criteria:**
1. WHEN un usuario comparte una rutina desde mobile THEN el sistema SHALL usar el share sheet nativo del sistema operativo con el link generado.
2. WHEN un usuario abre un link de rutina compartida (deep link) y tiene la app instalada THEN el sistema SHALL abrir la app directamente en la vista previa de esa rutina.

---

## 6. Historial y progreso

### Requirement 6.1 — Historial y progreso por ejercicio
**User Story:** Como usuario, quiero revisar mi historial y ver mi progreso en un ejercicio desde el celular.

**Acceptance Criteria:**
1. WHEN un usuario abre "Historial" THEN el sistema SHALL mostrar sesiones pasadas en una lista, con detalle al tocar cada una, incluidos RPE y notas (mismo contrato que web).
2. WHEN un usuario abre el detalle de un ejercicio THEN el sistema SHALL mostrar el gráfico de progreso según su tipo de métrica (backend Req. 6.2.1), adaptado a pantalla chica (scroll/zoom táctil).

---

## 7. No funcionales

### Requirement 7.1 — Rendimiento percibido
1. La pantalla de entrenamiento activo (Requirement 4.x) SHALL responder a cada tap de registro de set en menos de 100ms percibidos (optimismo de UI: se guarda local primero, se sincroniza después).

### Requirement 7.2 — Notificaciones locales
1. El sistema SHALL solicitar permiso de notificaciones solo cuando el usuario use por primera vez el timer de descanso (no al abrir la app por primera vez).

### Requirement 7.3 — Plataformas
1. El MVP SHALL publicarse solo en Android (decidido 2026-10-16). iOS se suma junto con el login con Apple.
2. El código SHALL seguir siendo un único código base de React Native, compatible con iOS y sin lógica de negocio duplicada entre plataformas, para que sumar iOS no requiera reescribir nada.

---

## Fuera de alcance del MVP

- Publicación en iOS / App Store (requiere cuenta de Apple Developer, USD 99/año).
- Login con Apple, y con él login con Google en iOS (ver "Fuera de alcance" en requirements-backend.md).
- Offline completo: iniciar sesiones, ver rutinas o ver historial sin conexión, y sincronizar rutinas editadas offline.
- Apple Watch / Wear OS companion.
- Widgets de home screen.
- Integración con Apple Health / Google Fit.
- Reconocimiento de voz para registrar sets manos-libres.
