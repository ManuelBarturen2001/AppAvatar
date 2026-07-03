const app = require('./app');
const env = require('./config/env');

app.listen(env.port, () => {
  console.log(`Backend listening on http://localhost:${env.port}`);
  console.log(`Proxying Rick and Morty API at: ${env.rickAndMortyBaseUrl}`);
});
