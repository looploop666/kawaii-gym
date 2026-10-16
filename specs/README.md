# Specs — Kawaii Gym

Índice de la documentación de spec-driven development. Orden de trabajo: **requirements → design → tasks**.

## Estado

| Documento | Descripción | Estado |
|---|---|---|
| [requirements-backend.md](./requirements-backend.md) | Requerimientos de la API (NestJS) | 📝 En revisión |
| [requirements-web.md](./requirements-web.md) | Requerimientos del frontend web | 📝 En revisión |
| [requirements-mobile.md](./requirements-mobile.md) | Requerimientos del frontend mobile | 📝 En revisión |
| `design.md` | Modelo de datos, arquitectura, contratos de API | ⏳ Pendiente (después de aprobar requirements) |
| `tasks.md` | Desglose de tareas de implementación | ⏳ Pendiente (después de aprobar design) |

## Alcance general del producto

Kawaii Gym permite a un usuario:

1. Crear **rutinas de entrenamiento** (plantillas) compuestas por ejercicios con series/repeticiones/peso objetivo.
2. **Compartir** esas rutinas con otros usuarios, que pueden importarlas a su propia cuenta.
3. Iniciar una **sesión de entrenamiento** a partir de una rutina y **registrar** lo realmente hecho en cada serie: peso y repeticiones, tiempo o distancia según el ejercicio, más RPE y notas opcionales.
4. Ver el **historial y progreso** por ejercicio a lo largo del tiempo (PRs, gráficos).
5. Calcular qué **discos** poner en la barra para el peso de un set.

**Plataformas del MVP:** web + Android. iOS llega junto con el login con Apple.

Backend y ambos frontends comparten el mismo contrato de datos (definido en `packages/shared` en la fase de diseño).

## Decisiones de alcance (2026-10-16)

| Tema | Decisión | Dónde quedó |
|---|---|---|
| Dominio de Strong | Entran al MVP: cardio (tiempo/distancia), notas por ejercicio y por sesión, RPE por set y calculadora de discos. | Backend Glosario, Req. 1.4, 2.1.3, 2.2.5, 3.1.2, 5.2, 5.3.3, 6.2, 6.3. Mobile Req. 4.2, 4.6. Web Req. 5.1, 5.3. |
| Tipos de métrica | `peso_reps`, `reps`, `tiempo`, `distancia_tiempo`. No se puede cambiar el tipo de un ejercicio que ya tiene sets. | Backend Glosario, Req. 2.1.3, 2.2.5, 5.2.1–5.2.2 |
| Offline en mobile | Simplificado: solo la sesión en curso funciona sin conexión, con reintento automático e idempotente. El offline completo queda fuera del MVP. | Mobile Req. 3.1.2, 4.4. Backend Req. 5.2.8. |
| iOS | Fuera del MVP. MVP = web + Android. El código RN sigue siendo compatible con iOS. | Mobile Req. 7.3 y "Fuera de alcance" |
| Preferencias | Se guardan en el perfil del backend (compartidas entre web y mobile): unidades, incremento de peso, descanso por defecto, barra y discos. | Backend Req. 1.4.1, 1.4.5. Web Req. 7.1. |
| Resto del alcance | Sin cambios. | — |

## Pendientes para aprobar los requirements

_Última actualización: 2026-10-16._ Las preguntas de alcance y las inconsistencias quedaron resueltas (ver tabla de arriba). Falta:

- [ ] **Revisión final** de los 3 requirements por la usuaria y pasarlos a ✅ Aprobado.
- [ ] Hacer el primer commit (ver "Repo").

### Para resolver directamente en `design.md`
- Sesión en progreso duplicada (backend Req. 5.1.3): ¿se reanuda la existente o se exige cerrarla antes?
- Decisiones técnicas de auth y login con Google (ver sección siguiente).
- **Modelado del set por tipo de métrica:** columnas opcionales en una sola tabla `Set` (`weight`, `reps`, `durationSec`, `distanceM`) + validación por tipo, vs. JSON, vs. una tabla por tipo. Propuesta: columnas opcionales + validación en el DTO y un `CHECK` en la base.
- **Unidades canónicas:** guardar siempre en una unidad fija (propuesta: kg, metros, segundos) y convertir en el cliente según las preferencias, vs. guardar el valor con su unidad original. Afecta a PRs y gráficos.
- **Idempotencia de sets (backend Req. 5.2.8):** UUID generado en el cliente como id del set (upsert) vs. header `Idempotency-Key`.
- **Cola offline en mobile (mobile Req. 4.4):** dónde se guarda (MMKV vs SQLite) y cómo se ordenan los reintentos.

### Repo
- [ ] Hacer el primer commit (el repo todavía no tiene commits; `README.md` y `specs/` están sin trackear).

## Decisiones pendientes para `design.md`

Puntos abiertos detectados durante la revisión de requirements, a resolver al escribir el diseño.

### Autenticación (backend Req. 1.2 / 1.3, web Req. 8.2, mobile Req. 1.1)

- **Duración de tokens:** access token corto (propuesta: 15 min) y refresh token largo (propuesta: 30 días).
- **Persistencia del refresh token:** guardarlo hasheado en DB (ej. `RefreshToken { id, userId, tokenHash, expiresAt, revokedAt }`), nunca en texto plano.
- **Rotación de refresh tokens:** cada `/auth/refresh` emite un refresh token nuevo e invalida el anterior; si se reutiliza uno ya rotado, revocar todos los tokens del usuario (detección de robo).
- **Almacenamiento en el cliente:**
  - Web: cookie `httpOnly` + `Secure` + `SameSite` (vs. header `Authorization` con token en memoria). Si se usa cookie, definir protección CSRF.
  - Mobile: Keychain / Keystore vía secure storage (ya definido en mobile Req. 1.1.1).
- **Rate limiting del login:** definir límite y ventana (propuesta: 5 intentos fallidos por email+IP cada 15 min → `429`), si se limita por IP, por email o ambos, y storage de contadores (memoria con `@nestjs/throttler` alcanza para una instancia; Redis si se escala horizontalmente).
- **Librerías:** `@nestjs/jwt` + `@nestjs/passport` (`JwtStrategy`, `JwtAuthGuard`) y `@nestjs/throttler`.

### Login con Google (backend Req. 1.5, web Req. 1.2, mobile Req. 1.2)

**Decisión (2026-10-15):** el MVP sale solo con Google en web y Android. Apple queda fuera del MVP. En iOS no se muestra Google hasta sumar Apple (regla de la App Store). Las notas de Apple de abajo quedan como referencia para cuando se incorpore.

- **Flujo:** el cliente obtiene el ID token del proveedor (SDK nativo en Android, Google Identity Services en web) y la API lo verifica y emite sus propios tokens. Alternativa: flujo OAuth server-side con redirect (`passport-google-oauth20`). Propuesta: ID token desde el cliente, porque un solo endpoint (`POST /auth/oauth/:provider`) sirve para web y mobile, y Apple se suma después como otro `:provider`.
- **Modelo de datos:** `User.passwordHash` pasa a ser opcional + tabla `AuthIdentity { id, userId, provider, providerUserId, email, createdAt }` con unique en `(provider, providerUserId)`.
- **Vinculación por email:** confirmar la regla de auto-vincular solo con `email_verified = true` (backend Req. 1.5.4), o pedir siempre login con contraseña antes de vincular.
- **Verificación de tokens:** `google-auth-library` para Google; para Apple, JWKS de `https://appleid.apple.com/auth/keys` (ej. con `jose`). Definir los client IDs por plataforma (web, iOS, Android), porque el `aud` cambia según la plataforma.
- **Cuentas de desarrollador:** Sign in with Apple requiere una cuenta paga de Apple Developer (USD 99/año) y un dominio verificado para el flujo web. Google requiere un proyecto en Google Cloud Console con la pantalla de consentimiento OAuth configurada.
- **Rate limiting:** aplicar también a `POST /auth/oauth/:provider`.
