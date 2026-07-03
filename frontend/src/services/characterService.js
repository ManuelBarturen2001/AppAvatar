const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

/**
 * Error propio para distinguir fallos de red/parsing de errores HTTP
 * con información útil ya extraída del backend.
 */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function handleResponse(response) {
  let body = null;
  try {
    body = await response.json();
  } catch {
    // Respuesta sin body JSON (poco probable dado nuestro backend, pero cubrimos el caso)
  }

  if (!response.ok) {
    const message = body?.error || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return body;
}

/**
 * Busca personajes paginados en el backend propio.
 * @param {Object} params
 * @param {string} [params.name]
 * @param {number} params.page
 */
export async function searchCharacters({ name, page }) {
  const url = new URL('/characters', API_BASE_URL);
  if (name) url.searchParams.set('name', name);
  url.searchParams.set('page', String(page));

  const response = await fetch(url);
  return handleResponse(response);
}

/**
 * Obtiene el detalle de un personaje por id desde el backend propio.
 * @param {string|number} id
 */
export async function getCharacterById(id) {
  const url = new URL(`/characters/${id}`, API_BASE_URL);
  const response = await fetch(url);
  return handleResponse(response);
}
