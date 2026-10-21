# 01 — Autenticación

**Estado:** 📝 En revisión · **Depende de:** —

Registro, login, refresh y logout con email y contraseña, y login con Google en web y Android.

## Historias

- Como visitante, quiero registrarme con email y contraseña, para guardar mis rutinas y entrenamientos.
- Como usuario, quiero entrar con mi cuenta de Google, para no crear ni recordar otra contraseña.
- Como usuario, quiero que mi sesión se renueve sola, para no tener que loguearme a cada rato.

## API

**Email y contraseña**

- **AUTH-1.** El registro pide email, contraseña y nombre. La contraseña nunca se guarda en texto plano.
- **AUTH-2.** Contraseña de menos de 8 caracteres → `400` con el detalle de la validación.
- **AUTH-3.** Email ya registrado → `409` ("el email ya existe"), sin más información.
- **AUTH-4.** Registro y login exitosos devuelven un access token de corta duración y un refresh token de larga duración.
- **AUTH-5.** Credenciales incorrectas → `401`, sin indicar si falló el email o la contraseña.
- **AUTH-6.** Demasiados intentos fallidos para el mismo email/IP en una ventana de tiempo → `429`. Aplica también al login con Google.
- **AUTH-7.** Un refresh token válido emite un access token nuevo. Si es inválido, venció o fue revocado → `401`.
- **AUTH-8.** El logout revoca el refresh token.

**Login con Google**

- **AUTH-9.** La API SHALL confiar en un ID token de Google solo después de verificar su firma, el emisor, que fue emitido para nuestra app y que no venció. Si algo falla → `401`.
- **AUTH-10.** WHEN el ID token es válido:
  - IF la identidad de Google ya está vinculada a un usuario THEN inicia sesión.
  - IF no está vinculada y no existe un usuario con ese email THEN crea un usuario sin contraseña y la vincula.
  - IF no está vinculada y ya existe un usuario con ese email THEN la vincula solo si Google marca el email como verificado; si no, rechaza sin revelar que el email existe.
- **AUTH-11.** El usuario puede vincular y desvincular Google desde su perfil, pero SHALL NOT quedarse sin ningún método de login.
- **AUTH-12.** El modelo no depende del proveedor, para sumar Apple sin rehacerlo.

## Web

- **AUTH-W1.** Registro o login exitoso → dashboard. Si falla, mensaje claro (sin revelar si falló el email o la contraseña).
- **AUTH-W2.** Recargar la página mantiene la sesión. Si el access token vence durante el uso, se refresca sin interrumpir; si el refresh también es inválido, va al login.
- **AUTH-W3.** "Continuar con Google" en login y registro, siguiendo las guías de marca de Google.
- **AUTH-W4.** Si el flujo de Google se cancela o falla, vuelve al login con un mensaje y conserva la ruta a la que se intentaba ir (ej. un link de rutina compartida).
- **AUTH-W5.** El logout borra la sesión local y va al login.

## Mobile

- **AUTH-M1.** Los tokens se guardan en el almacenamiento seguro del sistema (Keystore/Keychain), nunca en almacenamiento plano.
- **AUTH-M2.** Si al abrir la app hay una sesión o un refresh token válido, entra sin pedir credenciales.
- **AUTH-M3.** El logout borra los tokens y los datos de la sesión en progreso; si hay cambios sin enviar, pide confirmación.
- **AUTH-M4.** En Android, "Continuar con Google" usa el selector de cuentas nativo. Cancelar vuelve al login sin mostrar error.
- **AUTH-M5.** En iOS no se muestra Google hasta sumar Apple (la App Store exige ofrecer Apple si hay login de terceros).

## Fuera de alcance

- **Login con Apple.** Cuando se sume: aceptar emails de relay privado (`@privaterelay.appleid.com`), guardar el nombre en el primer login (Apple lo manda una sola vez) y revocar el token de Apple al eliminar la cuenta.

Decisiones para el diseño: ver [design-backlog.md](../../design-backlog.md#01--autenticación).
