# 03 — Catálogo de ejercicios

**Estado:** 📝 En revisión · **Depende de:** 01-auth

Catálogo global (seed) más ejercicios propios de cada usuario.

## Historias

- Como usuario, quiero buscar ejercicios por nombre, grupo muscular o equipamiento, para armar mis rutinas rápido.
- Como usuario, quiero crear mis propios ejercicios, para registrar movimientos que no están en el catálogo.

## API

- **EJ-1.** El listado devuelve los ejercicios globales más los propios del usuario, paginado.
- **EJ-2.** Se puede filtrar por texto, grupo muscular y equipamiento, combinados.
- **EJ-3.** Cada ejercicio tiene nombre, grupo muscular primario y secundarios, equipamiento y [tipo de métrica](../../README.md#glosario).
- **EJ-4.** Un ejercicio propio lo ve, edita y elimina solo su dueño. Los ejercicios globales no se editan ni eliminan → `403`.
- **EJ-5.** IF un ejercicio propio ya se usó en sesiones THEN no se borra físicamente: se oculta para rutinas nuevas (soft delete) sin romper el historial.
- **EJ-6.** IF un ejercicio ya tiene sets registrados THEN no se puede cambiar su tipo de métrica → `409`.

## Web

- **EJ-W1.** Buscador paginado o con scroll infinito, que filtra mientras se escribe (con debounce) y combina texto con filtros.
- **EJ-W2.** Formulario de ejercicio nuevo (nombre, grupo muscular, equipamiento, tipo de métrica); aparece al instante en el buscador.
- **EJ-W3.** No se ofrece editar ni eliminar ejercicios ajenos.

## Mobile

- **EJ-M1.** La búsqueda filtra localmente si la lista ya está cacheada, y si no, contra la API. Mismos filtros que web.
- **EJ-M2.** Se puede crear un ejercicio propio desde el celular.
