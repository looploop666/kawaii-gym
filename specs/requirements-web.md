# Requirements — Web

Stack: React (SPA). Consume la API definida en `requirements-backend.md`.

Rol de la web frente a mobile: la web es el lugar cómodo para **planificar** (armar rutinas con teclado/mouse, ver catálogo de ejercicios) y **analizar** (historial, gráficos de progreso). También debe poder **registrar una sesión completa**, para no obligar a usar el celular, pero el modo "entrenando en el gimnasio" optimizado es responsabilidad de mobile (ver `requirements-mobile.md`).

## 1. Autenticación

### Requirement 1.1 — Registro / Login / Logout
**User Story:** Como usuario, quiero crear una cuenta e iniciar sesión desde el navegador, para acceder a mis datos.

**Acceptance Criteria:**
1. WHEN un visitante completa el formulario de registro con datos válidos THEN el sistema SHALL crear la cuenta y redirigir al dashboard autenticado.
2. WHEN un usuario envía credenciales inválidas THEN el sistema SHALL mostrar un mensaje de error claro sin revelar si falló el email o la contraseña.
3. WHEN un usuario hace logout THEN el sistema SHALL invalidar la sesión local (tokens) y redirigir a la pantalla de login.
4. WHEN un usuario autenticado recarga la página THEN el sistema SHALL mantener la sesión iniciada usando el refresh token almacenado, sin pedir login de nuevo.

### Requirement 1.2 — Login con Google
**User Story:** Como usuario, quiero entrar con mi cuenta de Google desde el navegador, sin tener que crear una contraseña.

**Acceptance Criteria:**
1. WHEN un visitante abre las pantallas de login o de registro THEN el sistema SHALL mostrar el botón "Continuar con Google", respetando las guías de marca de Google.
2. WHEN un usuario completa el flujo del proveedor THEN el sistema SHALL enviar el ID token obtenido a la API (backend Req. 1.5) y, si es válido, redirigir al dashboard autenticado.
3. WHEN el usuario cancela el flujo del proveedor o este falla THEN el sistema SHALL volver a la pantalla de login con un mensaje claro, sin perder la ruta a la que intentaba ir (ej. un link de rutina compartida).
4. WHEN un usuario abre su perfil THEN el sistema SHALL mostrar qué métodos de login tiene vinculados y permitir vincular o desvincular Google (respetando backend Req. 1.5.6).

---

## 2. Catálogo de ejercicios

### Requirement 2.1 — Explorar y buscar ejercicios
**User Story:** Como usuario, quiero buscar y filtrar ejercicios por nombre, grupo muscular y equipamiento, para encontrar el que necesito al armar una rutina.

**Acceptance Criteria:**
1. WHEN un usuario abre el buscador de ejercicios THEN el sistema SHALL mostrar una lista paginada/con scroll infinito de ejercicios (globales + propios).
2. WHEN un usuario escribe en el buscador THEN el sistema SHALL filtrar resultados en tiempo real (debounced) contra la API.
3. WHEN un usuario aplica filtros de grupo muscular o equipamiento THEN el sistema SHALL combinar filtros con el texto de búsqueda.

### Requirement 2.2 — Crear ejercicio propio
**User Story:** Como usuario, quiero crear un ejercicio personalizado desde la web, para usarlo en mis rutinas.

**Acceptance Criteria:**
1. WHEN un usuario completa el formulario de nuevo ejercicio (nombre, grupo muscular, equipamiento, tipo de métrica) THEN el sistema SHALL crearlo y mostrarlo disponible inmediatamente en el buscador.
2. WHEN un usuario intenta editar/eliminar un ejercicio que no es suyo (global o de otro usuario) THEN la UI SHALL NOT ofrecer esas acciones.

---

## 3. Rutinas

### Requirement 3.1 — Listado de rutinas (dashboard)
**User Story:** Como usuario, quiero ver todas mis rutinas al entrar a la app, para elegir rápido qué hacer.

**Acceptance Criteria:**
1. WHEN un usuario entra al dashboard THEN el sistema SHALL listar sus rutinas con nombre y cantidad de ejercicios.
2. WHEN un usuario no tiene rutinas THEN el sistema SHALL mostrar un estado vacío con un call-to-action para crear la primera o importar una compartida.

### Requirement 3.2 — Builder de rutinas
**User Story:** Como usuario, quiero armar una rutina agregando ejercicios y definiendo series/reps/peso objetivo, con una interfaz cómoda de arrastrar y soltar.

**Acceptance Criteria:**
1. WHEN un usuario crea una nueva rutina THEN el sistema SHALL pedir un nombre y permitir agregar ejercicios desde el buscador del Requirement 2.1.
2. WHEN un usuario agrega un ejercicio a la rutina THEN el sistema SHALL permitir definir N series con los campos objetivo de su tipo de métrica (backend Req. 3.1.2), todos opcionales.
3. WHEN un usuario arrastra un ejercicio para reordenarlo THEN el sistema SHALL reflejar el nuevo orden visualmente y persistirlo al soltar.
4. WHEN un usuario elimina un ejercicio o una serie de la rutina THEN el sistema SHALL pedir confirmación solo si ya hay sets registrados que dependen de esa rutina (no bloqueante, informativo).
5. WHEN un usuario guarda cambios en una rutina THEN el sistema SHALL mostrar un estado de guardado (guardando/guardado/error) — autosave o guardado explícito, a definir en diseño.

### Requirement 3.3 — Editar / eliminar rutina
**User Story:** Como usuario, quiero editar o borrar una rutina existente.

**Acceptance Criteria:**
1. WHEN un usuario edita una rutina propia THEN el sistema SHALL precargar el builder con sus datos actuales.
2. WHEN un usuario elimina una rutina THEN el sistema SHALL pedir confirmación explícita (modal) antes de ejecutar el borrado.

---

## 4. Compartir e importar rutinas

### Requirement 4.1 — Compartir
**User Story:** Como usuario, quiero generar un link para compartir mi rutina con otra persona (por WhatsApp, etc.).

**Acceptance Criteria:**
1. WHEN un usuario hace clic en "Compartir" sobre una rutina propia THEN el sistema SHALL generar (o reutilizar) un link público y ofrecer copiarlo al portapapeles.
2. WHEN un usuario revoca el compartido THEN el sistema SHALL invalidar el link existente y, si se vuelve a compartir, generar uno nuevo.

### Requirement 4.2 — Importar
**User Story:** Como usuario, quiero abrir un link de rutina compartida y agregarla a mi cuenta.

**Acceptance Criteria:**
1. WHEN un visitante no autenticado abre un link de rutina compartida THEN el sistema SHALL mostrar una vista previa de solo lectura y ofrecer login/registro para importarla.
2. WHEN un usuario autenticado abre un link de rutina compartida y confirma importar THEN el sistema SHALL crear una copia en su lista de rutinas y navegar a ella.

---

## 5. Registrar una sesión de entrenamiento

### Requirement 5.1 — Iniciar sesión desde una rutina
**User Story:** Como usuario, quiero iniciar un entrenamiento a partir de una rutina, para ir registrando cada serie que hago.

**Acceptance Criteria:**
1. WHEN un usuario elige "Empezar entrenamiento" en una rutina THEN el sistema SHALL abrir una vista de sesión activa precargada con los ejercicios y series objetivo.
2. WHEN un usuario marca un set como completado, ingresando los valores reales de su tipo de métrica (peso y reps, reps, duración, o distancia y duración) THEN el sistema SHALL guardar el set asociado a la sesión en curso.
3. WHEN un usuario agrega un ejercicio o serie extra no planeada THEN el sistema SHALL permitirlo sin salir de la vista de sesión activa.
4. WHEN un usuario cierra el navegador con una sesión en progreso THEN el sistema SHALL permitir retomarla al volver a entrar (la sesión vive en el backend, no solo en memoria del cliente).
5. WHEN un usuario carga un set THEN el sistema SHALL permitir indicar un RPE opcional (1 a 10, en pasos de 0.5) y agregar una nota por ejercicio dentro de la sesión.

### Requirement 5.2 — Finalizar sesión
**User Story:** Como usuario, quiero finalizar mi entrenamiento y ver un resumen.

**Acceptance Criteria:**
1. WHEN un usuario finaliza la sesión THEN el sistema SHALL mostrar un resumen (duración, volumen total, PRs logrados si los hubo) con opción de agregar una nota general de la sesión (backend Req. 5.3.3).

### Requirement 5.3 — Calculadora de discos
**User Story:** Como usuario, quiero ver qué discos poner en la barra para el peso de un set.

**Acceptance Criteria:**
1. WHEN un usuario abre la calculadora desde un set de un ejercicio `peso_reps` THEN el sistema SHALL mostrar los discos por lado con la misma lógica y reglas que mobile (mobile Req. 4.6, cálculo en `packages/shared`).

---

## 6. Historial y progreso

### Requirement 6.1 — Historial de sesiones
**User Story:** Como usuario, quiero ver una lista/calendario de mis entrenamientos pasados.

**Acceptance Criteria:**
1. WHEN un usuario abre "Historial" THEN el sistema SHALL listar sesiones completadas ordenadas por fecha descendente, con filtro por rango de fechas y por rutina.
2. WHEN un usuario selecciona una sesión pasada THEN el sistema SHALL mostrar el detalle completo (ejercicios, sets con los valores de su tipo de métrica, RPE, notas por ejercicio, nota de la sesión y duración).

### Requirement 6.2 — Progreso por ejercicio
**User Story:** Como usuario, quiero ver un gráfico de cómo evolucionó mi peso/volumen en un ejercicio específico.

**Acceptance Criteria:**
1. WHEN un usuario abre el detalle de un ejercicio THEN el sistema SHALL mostrar un gráfico de progreso a lo largo del tiempo según su tipo de métrica (backend Req. 6.2.1): peso máximo o 1RM estimado por sesión para `peso_reps`, reps para `reps`, duración para `tiempo`, distancia o ritmo para `distancia_tiempo`.
2. WHEN un usuario logró un PR en una sesión THEN el sistema SHALL destacarlo visualmente en el gráfico o en el historial.

---

## 7. Configuración

### Requirement 7.1 — Perfil y preferencias
**User Story:** Como usuario, quiero configurar mi nombre y mis preferencias de entrenamiento (unidades, incremento de peso, descanso por defecto, barra y discos).

**Acceptance Criteria:**
1. WHEN un usuario cambia la unidad de peso o de distancia preferida THEN el sistema SHALL reflejar esa unidad en toda la app (builder, sesión activa, historial) sin requerir recargar.
2. WHEN un usuario abre sus preferencias THEN el sistema SHALL permitir editar todas las del perfil (backend Req. 1.4.1). Los cambios SHALL aplicarse también en mobile, porque se guardan en el backend.

---

## 8. No funcionales

### Requirement 8.1 — Responsive
1. El sistema SHALL ser usable en desktop y en viewport mobile-web (breakpoints razonables), aunque la experiencia optimizada "en el gym" se delega a la app mobile.

### Requirement 8.2 — Manejo de sesión y errores
1. WHEN el access token expira durante el uso THEN el sistema SHALL refrescarlo automáticamente sin interrumpir al usuario, salvo que el refresh también sea inválido (ahí SHALL redirigir a login).
2. WHEN una request a la API falla THEN el sistema SHALL mostrar feedback claro (toast/inline) y SHALL NOT perder los datos ya ingresados por el usuario en el formulario activo.

### Requirement 8.3 — Accesibilidad básica
1. Los formularios (builder de rutina, registro de sets) SHALL ser operables por teclado y SHALL tener labels asociados a sus inputs.

---

## Fuera de alcance del MVP

- Modo offline en web.
- Login con Apple (ver "Fuera de alcance" en requirements-backend.md).
- Drag-and-drop avanzado entre rutinas distintas.
- Exploración de rutinas públicas/feed social.
