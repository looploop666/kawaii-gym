# 02 — Perfil y preferencias

**Estado:** 📝 En revisión · **Depende de:** 01-auth

Datos de la cuenta y preferencias de entrenamiento, guardadas en el backend y compartidas entre web y mobile.

## Historias

- Como usuario, quiero configurar mis unidades, incremento de peso, descanso y discos una sola vez, para que la app se adapte a mí en web y en mobile por igual.

## API

- **PERF-1.** El perfil devuelve nombre, email, fecha de alta y preferencias:

  | Preferencia | Default |
  |---|---|
  | Unidad de peso (kg/lb) | kg |
  | Unidad de distancia (km/mi) | km |
  | Incremento de peso | 2.5 kg |
  | Descanso por defecto | 90 s |
  | Peso de la barra | 20 kg |
  | Discos disponibles | 25 / 20 / 15 / 10 / 5 / 2.5 / 1.25 kg |

- **PERF-2.** Al crear un usuario se le asignan los defaults.
- **PERF-3.** Cambiar el nombre o una preferencia la guarda y devuelve el perfil actualizado.
- **PERF-4.** Cambiar email o contraseña pide la contraseña actual. IF la cuenta no tiene contraseña (solo Google) THEN puede definir una después de volver a autenticarse con Google.

## Web

- **PERF-W1.** Se pueden editar todas las preferencias.
- **PERF-W2.** Cambiar una unidad se refleja en toda la app (builder, sesión activa, historial) sin recargar.
- **PERF-W3.** Se ven los métodos de login vinculados y se puede vincular o desvincular Google (AUTH-11).

## Mobile

- **PERF-M1.** El modo entrenamiento usa el incremento, el descanso y la configuración de discos del perfil (ver 06-sesiones).
