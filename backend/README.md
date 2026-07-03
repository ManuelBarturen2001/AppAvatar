# AppAvatar — Backend

Proxy en Node.js + Express hacia la [Rick and Morty API](https://rickandmortyapi.com/).
El frontend nunca habla directamente con la API externa: solo con este backend.

## Arquitectura

```
src/
├── config/         # Variables de entorno centralizadas
├── database/        # Único punto que conoce la URL de la API externa (axios client)
├── models/          # Mapeo del shape crudo de la API externa a nuestro dominio
├── services/         # Lógica de negocio (orquesta database + models)
├── controllers/      # Validación de input y armado de la respuesta HTTP
├── routes/           # Mapeo endpoint -> controller
├── middlewares/       # Manejo centralizado de errores y 404 de rutas
├── utils/            # Errores tipados (ValidationError, NotFoundError)
├── app.js            # Configuración de Express (middlewares + rutas)
└── server.js          # Punto de entrada, solo levanta el servidor
```

## Requisitos

- Node.js 18+

## Instalación y ejecución

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

El servidor queda escuchando en `http://localhost:4000` (configurable vía `.env`).

## Endpoints

### `GET /characters?name=<texto>&page=<n>`
Lista paginada de personajes. `name` es opcional (filtro parcial), `page` es opcional (default `1`).

```json
{
  "results": [
    { "id": 1, "name": "Rick Sanchez", "status": "Alive", "species": "Human", "image": "..." }
  ],
  "info": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

Si la búsqueda no tiene coincidencias, devuelve `results: []` con `200 OK` (no un error).

### `GET /characters/:id`
Detalle de un personaje.

```json
{
  "id": 1,
  "name": "Rick Sanchez",
  "image": "...",
  "status": "Alive",
  "species": "Human",
  "gender": "Male",
  "origin": { "name": "Earth (C-137)" },
  "location": { "name": "Citadel of Ricks" },
  "episodeCount": 51
}
```

### Códigos de error
- `400` — parámetro `page` inválido (no es entero positivo)
- `404` — personaje con ese `id` no existe
- `500` — fallo del upstream o error inesperado (nunca se filtra el stack)

## Variables de entorno

Ver `.env.example`:

| Variable | Descripción | Default |
|---|---|---|
| `PORT` | Puerto del servidor | `4000` |
| `RICK_AND_MORTY_BASE_URL` | Base URL de la API externa | `https://rickandmortyapi.com/api` |
| `CORS_ORIGIN` | Origen permitido para CORS (URL del frontend) | `http://localhost:5173` |
| `NODE_ENV` | Entorno | `development` |
