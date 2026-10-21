# Specs — Kawaii Gym

Spec-driven development **por feature**: cada feature pasa por `requirements.md → design.md → tasks.md` y se implementa antes de especificar en detalle el siguiente. Así cada revisión es corta y lo que se aprende al construir uno alimenta a los demás.

## Features del MVP

| # | Feature | Requirements | Design | Tasks |
|---|---|---|---|---|
| 00 | [Walking skeleton](./features/00-skeleton/requirements.md) | ✅ Aprobado | ✅ Aprobado | 🚧 En curso |
| 01 | [Autenticación](./features/01-auth/requirements.md) | 📝 En revisión | ⏳ | ⏳ |
| 02 | [Perfil y preferencias](./features/02-perfil/requirements.md) | 📝 En revisión | ⏳ | ⏳ |
| 03 | [Catálogo de ejercicios](./features/03-ejercicios/requirements.md) | 📝 En revisión | ⏳ | ⏳ |
| 04 | [Rutinas](./features/04-rutinas/requirements.md) | 📝 En revisión | ⏳ | ⏳ |
| 05 | [Compartir e importar](./features/05-compartir/requirements.md) | 📝 En revisión | ⏳ | ⏳ |
| 06 | [Sesiones de entrenamiento](./features/06-sesiones/requirements.md) | 📝 En revisión | ⏳ | ⏳ |
| 07 | [Sesión sin conexión (mobile)](./features/07-offline/requirements.md) | 📝 En revisión | ⏳ | ⏳ |
| 08 | [Historial, progreso y PRs](./features/08-historial/requirements.md) | 📝 En revisión | ⏳ | ⏳ |

Además:

- [engineering-standards.md](./engineering-standards.md): reglas que valen para todo el proyecto (seguridad, datos, testing, observabilidad, CI/CD).
- [design-backlog.md](./design-backlog.md): decisiones de "cómo" pendientes, agrupadas por feature.

## Cómo se escribe un `requirements.md`

- **Solo comportamiento observable** (qué hace el sistema). Librerías, algoritmos y modelado van en `design.md` o en el backlog.
- **Una sección por plataforma** dentro del mismo archivo: API, Web, Mobile. Los clientes no repiten las reglas de la API; las referencian por id.
- **Ids estables** (`AUTH-3`, `SES-W2`) para referenciarlos desde design, tasks y tests.
- **EARS (WHEN/IF … THEN … SHALL) solo donde hay lógica que puede salir mal.** Para lo simple alcanza una regla corta.

## Producto

Clon de [Strong](https://www.strong.app/). Un usuario puede:

1. Crear **rutinas** (plantillas) con ejercicios y series objetivo.
2. **Compartirlas** por link para que otros las importen.
3. **Registrar sesiones** a partir de una rutina: peso y reps, tiempo o distancia según el ejercicio, más RPE y notas.
4. Ver **historial y progreso** por ejercicio (PRs, gráficos).
5. Calcular qué **discos** poner en la barra.

**Plataformas del MVP:** web + Android. iOS llega junto con el login con Apple. Web es el lugar cómodo para **planificar y analizar**; mobile es la app **primaria para entrenar** en el gimnasio.

## Glosario

- **Ejercicio:** entidad del catálogo (ej. "Press de banca"). Global (seed) o creado por un usuario.
- **Rutina:** plantilla con una lista ordenada de ejercicios y series objetivo.
- **Sesión (workout):** entrenamiento real, a partir de una rutina o libre, con los sets ejecutados.
- **Set:** una serie de un ejercicio dentro de una sesión.
- **Tipo de métrica:** qué se registra en cada set. `peso_reps` (press de banca), `reps` (dominadas sin lastre), `tiempo` (plancha), `distancia_tiempo` (correr, remo).
- **RPE:** esfuerzo percibido de un set, de 1 a 10.
- **PR:** mejor marca histórica de un usuario en un ejercicio. Qué cuenta como PR depende del tipo de métrica (HIST-2).

## Decisiones de alcance

| Fecha | Decisión |
|---|---|
| 2026-10-15 | Login con Google en web y Android. Apple fuera del MVP; en iOS no se muestra Google hasta sumar Apple. |
| 2026-10-16 | Entran al MVP: cardio (4 tipos de métrica), notas por ejercicio y por sesión, RPE y calculadora de discos. |
| 2026-10-16 | Offline simplificado en mobile: solo la sesión en curso (07-offline). |
| 2026-10-16 | MVP = web + Android. El código RN sigue compatible con iOS. |
| 2026-10-16 | Preferencias en el perfil del backend, compartidas entre web y mobile. |
| 2026-10-20 | Prácticas técnicas: ADRs, Postgres con constraints e índices, observabilidad básica, CI/CD + IaC, eventos en proceso (ver engineering-standards.md). |
| 2026-10-21 | Specs reorganizadas por feature en vez de por plataforma. |
| 2026-10-21 | Walking skeleton (00) antes que los features. Deploy diferido: solo local + CI (ADR 0004). |

## Fuera de alcance del MVP

- iOS / App Store y login con Apple.
- Social: feed, seguir usuarios, rutinas públicas.
- Notificaciones push (el timer de descanso usa notificaciones locales).
- Offline completo y offline en web.
- IA (sugerencia de rutinas, búsqueda semántica).
- Peso corporal, medidas e integraciones de salud.
- Kafka/RabbitMQ, Kubernetes, OpenTelemetry.

El fuera de alcance propio de cada feature está en su archivo.
