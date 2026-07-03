const axios = require('axios');
const env = require('../config/env');

/**
 * Cliente axios preconfigurado apuntando a la API externa.
 * Esta es la ÚNICA capa del backend que conoce la URL de rickandmortyapi.com
 */
const httpClient = axios.create({
  baseURL: env.rickAndMortyBaseUrl,
  timeout: 8000,
});

/**
 * Error propio para distinguir "no encontrado / sin resultados" de
 * otros fallos (red, 500 del upstream, etc.)
 */
class UpstreamNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UpstreamNotFoundError';
  }
}

class UpstreamError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'UpstreamError';
    this.originalError = originalError;
  }
}

/**
 * Busca personajes en la API externa con nombre y página.
 * Traduce el 404 "sin resultados" de la API externa en un valor manejable
 * en vez de dejar que explote como error genérico.
 *
 * @param {Object} params
 * @param {string} [params.name]
 * @param {number} params.page
 * @returns {Promise<{results: Array, info: Object}>}
 */
async function fetchCharacters({ name, page }) {
  try {
    const response = await httpClient.get('/character', {
      params: {
        ...(name ? { name } : {}),
        page,
      },
    });
    return response.data; // { info: {...}, results: [...] }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // La API externa responde 404 cuando la búsqueda no tiene coincidencias.
      // Lo traducimos a "sin resultados" en vez de propagar un error.
      throw new UpstreamNotFoundError('No characters matched the given filters');
    }
    throw new UpstreamError('Failed to fetch characters from upstream API', error);
  }
}

/**
 * Obtiene el detalle de un personaje por id.
 * @param {string|number} id
 */
async function fetchCharacterById(id) {
  try {
    const response = await httpClient.get(`/character/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new UpstreamNotFoundError(`Character with id ${id} not found`);
    }
    throw new UpstreamError('Failed to fetch character detail from upstream API', error);
  }
}

module.exports = {
  fetchCharacters,
  fetchCharacterById,
  UpstreamNotFoundError,
  UpstreamError,
};
