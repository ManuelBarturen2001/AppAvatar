require('dotenv').config();

const env = {
  port: process.env.PORT || 4000,
  rickAndMortyBaseUrl: process.env.RICK_AND_MORTY_BASE_URL || 'https://rickandmortyapi.com/api',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = env;
