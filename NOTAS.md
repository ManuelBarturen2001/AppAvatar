# Notas

**Decisiones de diseño**
- El backend expone `/characters` y `/characters/:id` en la raíz (sin prefijo
  `/api`), siguiendo el contrato literal del enunciado.
- El 404 de "sin resultados" de la API externa se traduce explícitamente a
  `200 { results: [] }` en el backend — es una decisión de diseño, no un
  error: buscar y no encontrar nada es un resultado válido.
- La navegación lista ↔ detalle usa estado local de React (sin `react-router`)
  para no sumar dependencias; búsqueda y página se conservan al volver.
- `database/` contiene el único cliente HTTP que conoce la URL de la API
  externa; `services/` tiene la lógica de negocio; `models/` mapea el shape
  crudo a nuestro propio dominio.

**Supuestos**
- `page` inválido (no entero positivo) responde `400`; si no se envía,
  default `1`.
- El id de personaje se pasa tal cual a la API externa (no se valida formato
  en el backend); un id inexistente responde `404`.

**Qué mejoraría con más tiempo**
- Cachear resultados de páginas ya visitadas (evitar refetch al paginar hacia
  atrás).
- Agregar `react-router` con rutas reales (`/characters/:id`) si se necesita
  deep-linking o compartir URLs de un personaje puntual.
- Tests e2e con Playwright cubriendo el flujo completo (buscar → paginar →
  ver detalle → volver).
- Rate limiting / caché en el backend para no golpear la API externa en cada
  keystroke, aunque el debounce ya mitiga bastante esto.
