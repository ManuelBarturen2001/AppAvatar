const characterService = require('../services/characterService');
const rickAndMortyClient = require('../database/rickAndMortyClient');
const { ValidationError, NotFoundError } = require('../utils/errors');

/**
 * Valida y normaliza el parámetro "page".
 * Debe ser un entero >= 1. Si no viene, default = 1.
 */
function parsePage(rawPage) {
  if (rawPage === undefined) return 1;

  const page = Number(rawPage);
  if (!Number.isInteger(page) || page < 1) {
    throw new ValidationError(`Invalid "page" parameter: "${rawPage}". Must be a positive integer.`);
  }
  return page;
}

/**
 * GET /characters?name=<texto>&page=<n>
 */
async function getCharacters(req, res, next) {
  try {
    const { name } = req.query;
    const page = parsePage(req.query.page);

    const data = await characterService.searchCharacters({ name, page });
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /characters/:id
 */
async function getCharacterById(req, res, next) {
  try {
    const { id } = req.params;
    const character = await characterService.getCharacterById(id);
    return res.status(200).json(character);
  } catch (error) {
    if (error instanceof rickAndMortyClient.UpstreamNotFoundError) {
      return next(new NotFoundError(error.message));
    }
    return next(error);
  }
}

module.exports = {
  getCharacters,
  getCharacterById,
};
