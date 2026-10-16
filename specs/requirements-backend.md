# Requirements — Backend (API)

Stack: NestJS + TypeScript + Prisma + PostgreSQL + JWT.

Este documento define el comportamiento de la API. Es la fuente de verdad del dominio: web y mobile son clientes de este contrato.

## Glosario

- **Ejercicio**: entidad del catálogo (ej. "Press de banca"). Puede ser global (seed) o creado por un usuario.
- **Rutina**: plantilla reutilizable con una lista ordenada de ejercicios y, para cada uno, series objetivo (peso/reps sugeridos).
- **Sesión de entrenamiento (Workout)**: instancia real de haber entrenado, generada a partir de una rutina (o vacía/libre), con los sets realmente ejecutados.
- **Tipo de métrica**: qué se registra en cada set de un ejercicio. Valores: `peso_reps` (ej. press de banca), `reps` (ej. dominadas sin lastre), `tiempo` (ej. plancha), `distancia_tiempo` (ej. correr, remo).
- **Set**: una serie dentro de un ejercicio, dentro de una sesión. Guarda los valores que pide el tipo de métrica del ejercicio, un RPE opcional y flags (warmup, completado).
- **RPE (Rate of Perceived Exertion)**: esfuerzo percibido de un set, en escala de 1 a 10.
- **PR (Personal Record)**: mejor marca histórica de un usuario en un ejercicio. Qué cuenta como PR depende del tipo de métrica (ver Requirement 6.3).

---

## 1. Autenticación y cuenta de usuario

### Requirement 1.1 — Registro
**User Story:** Como visitante, quiero registrarme con email y contraseña, para tener mi propia cuenta y guardar mis rutinas y entrenamientos.

**Acceptance Criteria:**
1. WHEN un visitante envía email, contraseña y nombre válidos THEN el sistema SHALL crear el usuario con la contraseña hasheada (bcrypt/argon2) y SHALL nunca almacenar la contraseña en texto plano.
2. WHEN el email ya está registrado THEN el sistema SHALL rechazar la operación con un error 409 sin revelar más información que "el email ya existe".
3. WHEN la contraseña no cumple la política mínima (≥ 8 caracteres) THEN el sistema SHALL rechazar la operación con un error 400 detallando la validación fallida.
4. WHEN el registro es exitoso THEN el sistema SHALL devolver un access token y un refresh token.

### Requirement 1.2 — Login
**User Story:** Como usuario registrado, quiero iniciar sesión con email y contraseña, para acceder a mis datos.

**Acceptance Criteria:**
1. WHEN las credenciales son correctas THEN el sistema SHALL devolver un access token (JWT, corta duración) y un refresh token (larga duración).
2. WHEN las credenciales son incorrectas THEN el sistema SHALL devolver 401 sin indicar si falló el email o la contraseña.
3. WHEN se superan N intentos fallidos en una ventana de tiempo para el mismo email/IP THEN el sistema SHALL aplicar rate limiting.

### Requirement 1.3 — Refresh de sesión
**User Story:** Como usuario con sesión iniciada, quiero que mi sesión se renueve sin tener que loguearme de nuevo constantemente.

**Acceptance Criteria:**
1. WHEN el access token expira y el cliente envía un refresh token válido THEN el sistema SHALL emitir un nuevo access token.
2. WHEN el refresh token es inválido, expiró, o fue revocado THEN el sistema SHALL devolver 401 y exigir login nuevamente.
3. WHEN un usuario cierra sesión (logout) THEN el sistema SHALL revocar el refresh token correspondiente.

### Requirement 1.4 — Perfil de usuario
**User Story:** Como usuario, quiero configurar mi perfil y mis preferencias de entrenamiento, para que la app se adapte a mí en web y en mobile por igual.

**Acceptance Criteria:**
1. WHEN un usuario autenticado consulta su perfil THEN el sistema SHALL devolver nombre, email, fecha de creación de cuenta y sus preferencias: unidad de peso (kg/lb), unidad de distancia (km/mi), incremento de peso por defecto (ej. 2.5 kg), duración del descanso por defecto (en segundos), y la configuración de la calculadora de discos (peso de la barra y discos disponibles).
2. WHEN un usuario actualiza su nombre o alguna preferencia THEN el sistema SHALL persistir el cambio y devolver el perfil actualizado.
3. WHEN un usuario intenta cambiar su email o contraseña THEN el sistema SHALL requerir confirmación de la contraseña actual.
4. IF el usuario no tiene contraseña (cuenta creada solo con Google, ver Requirement 1.5) THEN el sistema SHALL permitirle definir una contraseña sin pedir la actual, previa re-autenticación con su proveedor.
5. WHEN se crea un usuario THEN el sistema SHALL asignarle preferencias por defecto (propuesta: kg, km, incremento 2.5 kg, descanso 90 s, barra de 20 kg, discos de 25/20/15/10/5/2.5/1.25 kg).

### Requirement 1.5 — Login con Google
**User Story:** Como visitante o usuario, quiero registrarme e iniciar sesión con mi cuenta de Google, para no tener que crear ni recordar otra contraseña.

> Apple queda fuera del MVP (ver "Fuera de alcance"). El diseño SHALL ser agnóstico del proveedor (`provider` como parámetro), para sumar Apple después sin rehacer el modelo.

**Acceptance Criteria:**
1. WHEN un cliente envía un ID token emitido por Google THEN el sistema SHALL verificar su firma contra las claves públicas de Google, y SHALL validar el `aud` (client ID de la app), el `iss` y la expiración antes de confiar en su contenido.
2. WHEN el ID token es válido y la identidad del proveedor (`provider` + `sub`) ya está vinculada a un usuario THEN el sistema SHALL iniciar sesión y devolver access token y refresh token, igual que en el Requirement 1.2.
3. WHEN el ID token es válido, la identidad no está vinculada y no existe un usuario con ese email THEN el sistema SHALL crear un usuario nuevo sin contraseña, vincular la identidad y devolver los tokens.
4. IF el ID token es válido, la identidad no está vinculada y ya existe un usuario con ese email THEN el sistema SHALL vincular la identidad a la cuenta existente solo si el proveedor indica el email como verificado (`email_verified`); en caso contrario SHALL rechazar la operación sin revelar que el email existe.
5. WHEN el ID token es inválido, expiró o tiene un `aud` que no corresponde THEN el sistema SHALL devolver 401.
6. WHEN un usuario autenticado vincula o desvincula Google desde su perfil THEN el sistema SHALL permitirlo, pero SHALL impedir desvincular el último método de login que le quede (sin contraseña y sin otro proveedor).

---

## 2. Catálogo de ejercicios

### Requirement 2.1 — Listado y búsqueda de ejercicios
**User Story:** Como usuario, quiero buscar ejercicios por nombre, grupo muscular o equipamiento, para armar mis rutinas rápido.

**Acceptance Criteria:**
1. WHEN un usuario autenticado lista ejercicios THEN el sistema SHALL devolver los ejercicios globales (seed) más los ejercicios propios del usuario.
2. WHEN un usuario filtra por texto, grupo muscular o equipamiento THEN el sistema SHALL devolver solo los ejercicios que matchean, paginados.
3. WHEN se lista un ejercicio THEN el sistema SHALL incluir: nombre, grupo(s) muscular(es) primario/secundario, equipamiento y tipo de métrica (`peso_reps`, `reps`, `tiempo`, `distancia_tiempo`; ver Glosario).

### Requirement 2.2 — Ejercicios personalizados
**User Story:** Como usuario, quiero crear mis propios ejercicios, para registrar movimientos que no están en el catálogo global.

**Acceptance Criteria:**
1. WHEN un usuario crea un ejercicio propio THEN el sistema SHALL asociarlo a su usuario y no mostrarlo a otros usuarios.
2. WHEN un usuario edita o elimina un ejercicio propio THEN el sistema SHALL permitirlo solo si es el dueño.
3. WHEN un usuario intenta editar o eliminar un ejercicio global (seed) THEN el sistema SHALL rechazarlo con 403.
4. IF un ejercicio propio ya fue usado en sesiones registradas AND el usuario intenta eliminarlo THEN el sistema SHALL impedir el borrado físico y SHALL ofrecer un borrado lógico (soft delete) que lo oculta de futuras rutinas sin romper el historial.
5. IF un ejercicio propio ya tiene sets registrados AND el usuario intenta cambiar su tipo de métrica THEN el sistema SHALL rechazarlo con 409, porque los sets existentes quedarían con datos que no corresponden.

---

## 3. Rutinas

### Requirement 3.1 — Crear y editar rutinas
**User Story:** Como usuario, quiero crear una rutina con una lista ordenada de ejercicios y series objetivo, para tener una plantilla que seguir en el gimnasio.

**Acceptance Criteria:**
1. WHEN un usuario crea una rutina THEN el sistema SHALL requerir un nombre y SHALL permitir una lista vacía de ejercicios inicialmente.
2. WHEN un usuario agrega un ejercicio a una rutina THEN el sistema SHALL permitir definir N series objetivo, con los valores que pide el tipo de métrica del ejercicio, todos opcionales: peso sugerido y repeticiones objetivo (puede ser un rango) para `peso_reps` y `reps`, duración para `tiempo`, distancia y/o duración para `distancia_tiempo`.
3. WHEN un usuario reordena los ejercicios de una rutina THEN el sistema SHALL persistir el nuevo orden.
4. WHEN un usuario elimina un ejercicio de una rutina THEN el sistema SHALL quitarlo de la plantilla sin afectar sesiones ya registradas que lo referenciaban.
5. IF el usuario no es el dueño de la rutina THEN el sistema SHALL rechazar cualquier edición con 403.

### Requirement 3.2 — Listar y ver rutinas propias
**User Story:** Como usuario, quiero ver todas mis rutinas, para elegir cuál entrenar hoy.

**Acceptance Criteria:**
1. WHEN un usuario lista sus rutinas THEN el sistema SHALL devolver únicamente las rutinas de las que es dueño o que importó.
2. WHEN un usuario consulta el detalle de una rutina THEN el sistema SHALL devolver la lista completa de ejercicios con sus series objetivo, en orden.

### Requirement 3.3 — Eliminar rutina
**User Story:** Como usuario, quiero borrar una rutina que ya no uso.

**Acceptance Criteria:**
1. WHEN un usuario elimina una rutina de la que es dueño THEN el sistema SHALL eliminarla (soft delete) sin afectar las sesiones de entrenamiento históricas que se generaron a partir de ella.

---

## 4. Compartir rutinas (sharing)

### Requirement 4.1 — Generar link para compartir
**User Story:** Como usuario, quiero generar un link o código para compartir una rutina mía, para que otra persona la pueda importar.

**Acceptance Criteria:**
1. WHEN un usuario solicita compartir una rutina propia THEN el sistema SHALL generar un código/token único de solo lectura asociado a esa rutina.
2. WHEN el dueño revoca el compartido THEN el sistema SHALL invalidar ese token de forma que ya no permita importaciones nuevas.
3. WHEN alguien consulta una rutina vía el token de compartido (sin estar autenticado) THEN el sistema SHALL devolver una vista de solo lectura (nombre, ejercicios, series objetivo) sin datos personales del dueño más allá de su nombre público.

### Requirement 4.2 — Importar rutina compartida
**User Story:** Como usuario autenticado, quiero importar una rutina que me compartieron, para tenerla en mi propia lista y poder editarla sin afectar la original.

**Acceptance Criteria:**
1. WHEN un usuario autenticado importa una rutina vía token válido THEN el sistema SHALL crear una copia independiente de la rutina asociada a su cuenta (mismo contenido, nuevo dueño).
2. WHEN el token es inválido, expirado o fue revocado THEN el sistema SHALL devolver 404/410 según corresponda.
3. WHEN un usuario edita su copia importada THEN el sistema SHALL NOT propagar el cambio a la rutina original ni a otras copias.

---

## 5. Sesiones de entrenamiento (workouts)

### Requirement 5.1 — Iniciar una sesión
**User Story:** Como usuario, quiero iniciar una sesión de entrenamiento a partir de una rutina (o vacía), para empezar a registrar lo que hago hoy.

**Acceptance Criteria:**
1. WHEN un usuario inicia una sesión a partir de una rutina THEN el sistema SHALL crear una sesión en estado "en progreso" pre-cargada con los ejercicios y series objetivo de la rutina (como sugerencia, editable).
2. WHEN un usuario inicia una sesión libre (sin rutina) THEN el sistema SHALL crear una sesión vacía donde puede agregar ejercicios sobre la marcha.
3. IF el usuario ya tiene una sesión en progreso THEN el sistema SHALL permitir reanudarla en vez de forzar crear una nueva (o SHALL exigir cerrarla antes de iniciar otra — a decidir en diseño).

### Requirement 5.2 — Registrar sets durante la sesión
**User Story:** Como usuario entrenando, quiero registrar lo que hago en cada serie (peso y repeticiones, tiempo o distancia), para llevar un historial preciso.

**Acceptance Criteria:**
1. WHEN un usuario registra un set de un ejercicio THEN el sistema SHALL guardar los valores que pide el tipo de métrica del ejercicio (`peso_reps`: peso, unidad y reps; `reps`: reps; `tiempo`: duración; `distancia_tiempo`: distancia, unidad y duración) y si es warmup o no.
2. IF un set no trae los valores obligatorios de su tipo de métrica, o trae valores de otro tipo THEN el sistema SHALL rechazarlo con 400.
3. WHEN un usuario marca un set como completado THEN el sistema SHALL registrar el timestamp de finalización.
4. WHEN un usuario agrega, edita o elimina un set dentro de una sesión en progreso THEN el sistema SHALL permitirlo libremente hasta que la sesión se finalice.
5. WHEN un usuario agrega un ejercicio no planeado a una sesión en curso THEN el sistema SHALL permitirlo y SHALL incorporarlo al registro de esa sesión.
6. WHEN un usuario indica el RPE de un set THEN el sistema SHALL guardarlo como valor opcional entre 1 y 10 (en pasos de 0.5) y SHALL rechazar con 400 valores fuera de ese rango.
7. WHEN un usuario escribe una nota sobre un ejercicio dentro de una sesión THEN el sistema SHALL guardarla como texto libre opcional asociado a ese ejercicio en esa sesión.
8. WHEN el cliente reenvía un set que ya fue guardado (reintento por falta de conexión, ver mobile Req. 4.4) THEN el sistema SHALL NOT duplicarlo; el cliente SHALL enviar un identificador generado de su lado para que la operación sea idempotente.

### Requirement 5.3 — Finalizar sesión
**User Story:** Como usuario, quiero finalizar mi sesión de entrenamiento, para cerrarla y que pase a mi historial.

**Acceptance Criteria:**
1. WHEN un usuario finaliza una sesión THEN el sistema SHALL registrar la duración total (timestamp de inicio y fin) y SHALL marcarla como completada (ya no editable salvo corrección manual explícita).
2. WHEN una sesión finaliza sin ningún set completado THEN el sistema SHALL permitir descartarla en vez de guardarla vacía.
3. WHEN un usuario agrega una nota general a la sesión (al finalizarla o mientras está en progreso) THEN el sistema SHALL guardarla como texto libre opcional.

### Requirement 5.4 — Editar/eliminar sesión pasada
**User Story:** Como usuario, quiero poder corregir un entrenamiento que ya cerré, por si me equivoqué al cargar un dato.

**Acceptance Criteria:**
1. WHEN un usuario edita una sesión finalizada de la que es dueño THEN el sistema SHALL permitir la corrección y SHALL recalcular PRs si corresponde.
2. IF el usuario no es el dueño de la sesión THEN el sistema SHALL rechazar con 403.

---

## 6. Historial y progreso

### Requirement 6.1 — Historial de sesiones
**User Story:** Como usuario, quiero ver mi historial de entrenamientos pasados, para revisar qué hice y cuándo.

**Acceptance Criteria:**
1. WHEN un usuario consulta su historial THEN el sistema SHALL devolver las sesiones completadas ordenadas por fecha descendente, paginadas.
2. WHEN un usuario filtra el historial por rango de fechas o por rutina THEN el sistema SHALL devolver solo las sesiones que matchean.

### Requirement 6.2 — Progreso por ejercicio
**User Story:** Como usuario, quiero ver la evolución de mis marcas en un ejercicio específico, para saber si estoy progresando.

**Acceptance Criteria:**
1. WHEN un usuario consulta el historial de un ejercicio THEN el sistema SHALL devolver la serie temporal de sets registrados de ese ejercicio, con las métricas de su tipo: fecha, peso, reps y volumen calculado para `peso_reps`; reps para `reps`; duración para `tiempo`; distancia, duración y ritmo calculado para `distancia_tiempo`.
2. WHEN se solicita para un ejercicio `peso_reps` THEN el sistema SHALL calcular y exponer el 1RM estimado (fórmula Epley u otra estándar) por sesión.
3. WHEN un set es warmup THEN el sistema SHALL excluirlo del volumen y del cálculo de PRs.

### Requirement 6.3 — Records personales (PRs)
**User Story:** Como usuario, quiero que la app detecte automáticamente cuándo bato un récord personal, para sentir progreso.

**Acceptance Criteria:**
1. WHEN se registra o edita un set completado THEN el sistema SHALL evaluar si es un nuevo PR para ese ejercicio y ese usuario, según el tipo de métrica:
   - `peso_reps`: peso máximo, reps máximas a un peso, 1RM estimado máximo y volumen máximo en una sesión.
   - `reps`: reps máximas en un set.
   - `tiempo`: duración máxima en un set.
   - `distancia_tiempo`: distancia máxima en un set y mejor ritmo.
2. WHEN se detecta un nuevo PR THEN el sistema SHALL persistirlo y exponerlo para que el cliente pueda notificarlo.

---

## 7. No funcionales

### Requirement 7.1 — Seguridad
1. El sistema SHALL usar HTTPS en todos los ambientes salvo desarrollo local.
2. El sistema SHALL validar y sanitizar todo input (class-validator o Zod) en los DTOs de entrada.
3. El sistema SHALL aplicar autorización a nivel de recurso (un usuario nunca accede a datos de otro usuario salvo lo explícitamente público vía sharing).

### Requirement 7.2 — Documentación de API
1. El sistema SHALL exponer documentación OpenAPI/Swagger autogenerada y navegable en un entorno de desarrollo.

### Requirement 7.3 — Testing
1. El sistema SHALL tener tests unitarios para la lógica de dominio (cálculo de PRs por tipo de métrica, 1RM, validación de sets por tipo de métrica, importación de rutinas).
2. El sistema SHALL tener tests e2e para los flujos críticos: registro/login, crear rutina, registrar sesión, compartir/importar rutina.

### Requirement 7.4 — Rendimiento y paginación
1. Todo endpoint de listado (ejercicios, rutinas, historial) SHALL soportar paginación para evitar respuestas ilimitadas.

---

## Fuera de alcance del MVP (a revisar más adelante)

- Seguimiento de peso corporal / medidas antropométricas.
- Feed social / seguir a otros usuarios / explorar rutinas públicas.
- Notificaciones push.
- Superseries / circuitos como estructura de primera clase (se puede registrar como ejercicios consecutivos sin modelado especial).
- Sincronización offline completa. En el MVP la API solo garantiza que reenviar un set no lo duplique (Requirement 5.2.8); el resto se define en requirements-mobile.md.
- Calculadora de discos como lógica de servidor: es un cálculo de cliente (vive en `packages/shared`). La API solo guarda su configuración en el perfil (Requirement 1.4.1).
- **Login con Apple** (se suma cuando se publique en iOS; requiere cuenta de Apple Developer). Al incorporarlo, extender el Requirement 1.5 con:
  - Aceptar emails de relay privado (`@privaterelay.appleid.com`) como email válido.
  - Persistir el nombre del usuario en el primer login (Apple solo lo envía esa vez); si no llega, usar un nombre por defecto editable.
  - Revocar el token de Apple cuando el usuario elimina su cuenta (requisito de Apple).
