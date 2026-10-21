# 00 — Walking skeleton

**Estado:** ✅ Aprobado · **Depende de:** —

Un esqueleto que funciona de punta a punta, sin features: API, base, web y mobile conectados, con CI. Sirve para que el riesgo técnico aparezca al principio y cada feature se construya sobre algo que ya anda.

**Alcance (decidido 2026-10-21):** solo local + CI. El deploy se decide más adelante (ADR 0004).

## Historias

- Como desarrolladora, quiero levantar todo el proyecto con pocos comandos, para empezar cada feature sin pelearme con la infraestructura.
- Como desarrolladora, quiero que cada PR se valide solo, para no romper `main`.

## Reglas

**Entorno local**

- **SK-1.** Con Docker y Node instalados, levantar todo pide como mucho tres comandos: instalar dependencias, levantar la base y correr las apps.
- **SK-2.** La API arranca solo si sus variables de entorno son válidas; si falta una, falla al inicio con un mensaje que dice cuál.
- **SK-3.** Hay un `.env.example` por app y ningún secreto en el repo.

**API**

- **SK-4.** `GET /health` responde `200` si la base está accesible y `503` si no (STD-13).
- **SK-5.** Los logs salen en JSON con request id (STD-11, STD-12), y en desarrollo se pueden leer formateados.
- **SK-6.** La documentación OpenAPI se puede navegar en desarrollo (STD-5).
- **SK-7.** Las migraciones de la base se aplican con un comando y quedan versionadas en el repo.

**Clientes**

- **SK-8.** La web muestra el estado de la API (`/health`) y la versión del contrato compartido.
- **SK-9.** La app mobile corre en un celular Android y muestra lo mismo que la web.
- **SK-10.** Web, mobile y API importan el mismo schema de `packages/shared` para la respuesta de `/health`.

**CI**

- **SK-11.** Cada PR corre lint, tipos, tests unitarios, e2e de la API contra un PostgreSQL efímero y build (STD-14).
- **SK-12.** Hay al menos un test unitario y un test e2e (`/health`) corriendo en CI.

**Reutilizable**

- **SK-13.** El skeleton no contiene nada específico de Kawaii Gym. El nombre del proyecto y los identificadores (nombre visible, scope de los paquetes, id de la app Android) se configuran en un solo lugar, para poder extraerlo como template. El estado final queda marcado con el tag `skeleton-v1`.

## Fuera de alcance

- Deploy, Terraform y ambientes remotos (ADR 0004).
- Autenticación y cualquier feature de negocio.
- Build de release de Android (APK firmado, Play Store).
