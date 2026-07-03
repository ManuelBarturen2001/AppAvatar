const { AppError } = require('../utils/errors');
const rickAndMortyClient = require('../database/rickAndMortyClient');

/**
 * Middleware centralizado de manejo de errores.
 * Debe registrarse SIEMPRE al final, después de todas las rutas.
 *
 * Reglas:
 *  - Nunca se envía el stack trace ni el error crudo al cliente.
 *  - El detalle completo se loguea en el servidor (consola aquí,
 *    en producción iría a un logger real: winston, pino, etc.)
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ->`, err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof rickAndMortyClient.UpstreamError || err instanceof rickAndMortyClient.UpstreamNotFoundError) {
    return res.status(500).json({ error: 'Upstream service failed. Please try again later.' });
  }

  // Error inesperado no tipado
  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorHandler;
