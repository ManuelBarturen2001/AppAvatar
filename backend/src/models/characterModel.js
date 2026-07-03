/**
 * Mapea un personaje "crudo" de la API externa a nuestro modelo de dominio.
 * Se usa tanto en el listado como en el detalle.
 */
function toCharacterSummary(raw) {
  return {
    id: raw.id,
    name: raw.name,
    status: raw.status, // Alive | Dead | unknown
    species: raw.species,
    image: raw.image,
  };
}

function toCharacterDetail(raw) {
  return {
    id: raw.id,
    name: raw.name,
    image: raw.image,
    status: raw.status,
    species: raw.species,
    gender: raw.gender,
    origin: {
      name: raw.origin?.name || 'unknown',
    },
    location: {
      name: raw.location?.name || 'unknown',
    },
    episodeCount: Array.isArray(raw.episode) ? raw.episode.length : 0,
  };
}

/**
 * Mapea el objeto "info" de paginación de la API externa a nuestro
 * propio formato de metadatos.
 */
function toPaginationInfo(rawInfo, currentPage) {
  return {
    currentPage,
    totalPages: rawInfo?.pages ?? 0,
    totalItems: rawInfo?.count ?? 0,
    hasNextPage: Boolean(rawInfo?.next),
    hasPrevPage: Boolean(rawInfo?.prev),
  };
}

module.exports = {
  toCharacterSummary,
  toCharacterDetail,
  toPaginationInfo,
};
