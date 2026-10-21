# Backlog de diseño

Decisiones de "cómo" que salieron al escribir los requirements. Cada una se resuelve en el `design.md` del feature correspondiente y queda como ADR en `docs/adr/`.

## Transversales

- **Unidades canónicas:** guardar siempre en una unidad fija (propuesta: kg, metros, segundos) y convertir en el cliente según las preferencias, vs. guardar el valor con su unidad original. Afecta a PRs y gráficos.
- **Eventos de dominio:** qué efectos secundarios disparan eventos (`SessionFinished`, `SetCompleted`) vs. llamadas directas entre servicios.
- **Hosting y deploy:** diferido (ADR 0004). Revisar antes de 06-sesiones: proveedor, ambientes (dev/prod) y qué se gestiona con Terraform.
- ~~**Validación:** class-validator vs. Zod~~ → Zod en `packages/shared` (ADR 0002).

## 01 — Autenticación

- **Hash de contraseñas:** bcrypt vs. argon2.
- **Duración de tokens:** propuesta 15 min el access y 30 días el refresh.
- **Refresh token:** guardado hasheado en la base (ej. `RefreshToken { id, userId, tokenHash, expiresAt, revokedAt }`). Rotación en cada `/auth/refresh`; si se reutiliza uno ya rotado, revocar todos los del usuario (detección de robo).
- **Almacenamiento en web:** cookie `httpOnly` + `Secure` + `SameSite` (y entonces protección CSRF) vs. header `Authorization` con el token en memoria.
- **Rate limiting:** propuesta 5 intentos fallidos por email+IP cada 15 min. Contadores en memoria con `@nestjs/throttler` alcanzan para una instancia; Redis si se escala horizontalmente.
- **Flujo de Google:** propuesta: el cliente obtiene el ID token (SDK nativo en Android, Google Identity Services en web) y un solo endpoint `POST /auth/oauth/:provider` lo verifica con `google-auth-library`. Alternativa: OAuth server-side con redirect (`passport-google-oauth20`).
- **Modelo:** `User.passwordHash` opcional + `AuthIdentity { id, userId, provider, providerUserId, email, createdAt }` con unique en `(provider, providerUserId)`.
- **Client IDs** por plataforma (el `aud` cambia en web, Android e iOS) y proyecto en Google Cloud Console con la pantalla de consentimiento.
- **Vinculación por email:** confirmar que alcanza con `email_verified` (AUTH-10) o si se pide siempre login con contraseña antes de vincular.
- **Librerías:** `@nestjs/jwt`, `@nestjs/passport` (`JwtStrategy`, `JwtAuthGuard`), `@nestjs/throttler`.
- **Apple (post-MVP):** JWKS de `https://appleid.apple.com/auth/keys` (ej. con `jose`). Requiere cuenta de Apple Developer (USD 99/año) y dominio verificado para web.

## 04 — Rutinas

- **Guardado del builder web:** autosave vs. botón explícito (RUT-W4).

## 06 — Sesiones

- **Sesión en progreso duplicada (SES-2):** reanudar la existente vs. exigir cerrarla.
- **Modelado del set por tipo de métrica:** propuesta: una tabla `Set` con columnas opcionales (`weight`, `reps`, `durationSec`, `distanceM`) + validación en el DTO y un `CHECK` en la base. Alternativas: JSON o una tabla por tipo.
- **Idempotencia de sets (SES-7):** UUID generado en el cliente como id del set (upsert) vs. header `Idempotency-Key`.
- **Calculadora de discos:** lógica en `packages/shared`.

## 07 — Offline

- **Cola local:** MMKV vs. SQLite, y cómo se ordenan los reintentos.

## 08 — Historial

- **Recálculo de PRs (HIST-6):** dentro de la transacción vs. como handler del evento `SessionFinished`.
