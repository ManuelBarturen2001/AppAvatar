# AppAvatar

App de búsqueda y exploración de personajes de Rick and Morty. React (Vite)
en el frontend, Node.js + Express como backend/proxy hacia la
[Rick and Morty API](https://rickandmortyapi.com/).

```
AppAvatar/
├── backend/    # Proxy Express (arquitectura Controllers/Database/Models/Routes)
├── frontend/   # App React + Vite
└── NOTAS.md    # Decisiones de diseño, supuestos y mejoras futuras
```

## Quick start

1. Backend (en una terminal):

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Queda escuchando en `http://localhost:4000`.

2. Frontend (en otra terminal):

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Se abre en `http://localhost:5173`.

Detalles completos, endpoints, variables de entorno y tests en el `README.md`
de cada carpeta.

## Tests

```bash
cd backend && npm test
cd frontend && npm test
```
