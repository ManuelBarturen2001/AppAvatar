# AppAvatar — Frontend

App en React + Vite para buscar y explorar personajes de Rick and Morty,
consumiendo siempre el backend propio (nunca la API externa directamente).

## Arquitectura

```
src/
├── components/
│   ├── SearchBar/         # Input de búsqueda controlado
│   ├── CharacterList/      # Grid de resultados + estados (loading/empty/error)
│   ├── CharacterCard/      # Tarjeta individual de personaje
│   ├── Pagination/         # Controles de paginación
│   ├── CharacterDetail/    # Vista de detalle
│   └── StatusDot/          # Indicador de estado (Alive/Dead/unknown)
├── hooks/
│   └── useDebounce.js      # Hook personalizado de debounce (300ms)
├── services/
│   └── characterService.js # Único módulo con llamadas fetch al backend
├── styles/
│   └── theme.css            # Variables de diseño (tokens) y reset global
├── App.jsx                  # Orquesta estado: búsqueda, página, navegación
└── main.jsx
```

## Requisitos

- Node.js 18+
- El backend corriendo (ver `../backend/README.md`)

## Instalación y ejecución

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Se abre en `http://localhost:5173`. Asegúrate de que el backend esté
corriendo en `http://localhost:4000` (o ajusta `VITE_API_BASE_URL` en `.env`).

## Tests

```bash
npm run test
```

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_BASE_URL` | URL base del backend propio | `http://localhost:4000` |

## Decisiones de diseño

- **Sin `react-router`**: la navegación lista ↔ detalle se maneja con estado
  local en `App.jsx` (`selectedId`). Como el ejercicio no pide deep-linking
  por URL, esto evita una dependencia innecesaria y conserva búsqueda/página
  al volver, sin perder contexto.
- **`useDebounce` propio**: hook mínimo basado en `useEffect` + `setTimeout`,
  sin librerías externas, tal como pide el enunciado.
- **Un solo módulo de servicios**: todos los `fetch` viven en
  `services/characterService.js`; los componentes nunca llaman a `fetch`
  directamente.
