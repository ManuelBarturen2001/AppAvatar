const rickAndMortyClient = require('../database/rickAndMortyClient');
const characterModel = require('../models/characterModel');

/**
 * Busca personajes paginados, filtrando opcionalmente por nombre.
 * Si la API externa no tiene coincidencias (404), devolvemos una lista
 * vacía en vez de propagar un error: es una decisión de diseño explícita.
 *
 * @param {Object} params
 * @param {string} [params.name]
 * @param {number} params.page
 */
async function searchCharacters({ name, page }) {
  try {
    const raw = await rickAndMortyClient.fetchCharacters({ name, page });
    return {
      results: raw.results.map(characterModel.toCharacterSummary),
      info: characterModel.toPaginationInfo(raw.info, page),
    };
  } catch (error) {
    if (error instanceof rickAndMortyClient.UpstreamNotFoundError) {
      return {
        results: [],
        info: characterModel.toPaginationInfo(
          { pages: 0, count: 0, next: null, prev: null },
          page
        ),
      };
    }
    // Cualquier otro error (red, 500 upstream, etc.) se propaga tal cual
    // para que el controller/middleware lo traduzca a un 500.
    throw error;
  }
}

/**
 * Obtiene el detalle de un personaje por id.
 * Si no existe, propaga UpstreamNotFoundError para que el controller
 * lo traduzca a un 404 real (a diferencia de la búsqueda, aquí SÍ es
 * un error: pedir un id específico que no existe).
 */
async function getCharacterById(id) {
  const raw = await rickAndMortyClient.fetchCharacterById(id);
  return characterModel.toCharacterDetail(raw);
}

module.exports = {
  searchCharacters,
  getCharacterById,
};
