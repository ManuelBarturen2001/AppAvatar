const request = require('supertest');

// Mockeamos el cliente HTTP hacia la API externa: los tests no deben
// depender de la red ni de la disponibilidad de rickandmortyapi.com.
jest.mock('../src/database/rickAndMortyClient', () => {
  const actual = jest.requireActual('../src/database/rickAndMortyClient');

  return {
    ...actual,
    fetchCharacters: jest.fn(),
    fetchCharacterById: jest.fn(),
  };
});

const app = require('../src/app');
const rickAndMortyClient = require('../src/database/rickAndMortyClient');

describe('GET /health', () => {
  it('responds 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /characters', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when page is not a positive integer', async () => {
    const res = await request(app).get('/characters?page=abc');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/page/i);
    expect(rickAndMortyClient.fetchCharacters).not.toHaveBeenCalled();
  });

  it('returns mapped results and pagination info on success', async () => {
    rickAndMortyClient.fetchCharacters.mockResolvedValue({
      info: { count: 2, pages: 1, next: null, prev: null },
      results: [
        { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: 'img1' },
        { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', image: 'img2' },
      ],
    });

    const res = await request(app).get('/characters?name=r&page=1');

    expect(res.status).toBe(200);
    expect(res.body.results).toHaveLength(2);
    expect(res.body.results[0]).toEqual({
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      image: 'img1',
    });
    expect(res.body.info).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
      hasNextPage: false,
      hasPrevPage: false,
    });
  });

  it('translates an upstream "not found" (no matches) into an empty list with 200', async () => {
    rickAndMortyClient.fetchCharacters.mockRejectedValue(
      new rickAndMortyClient.UpstreamNotFoundError('no matches')
    );

    const res = await request(app).get('/characters?name=zzznoexiste&page=1');

    expect(res.status).toBe(200);
    expect(res.body.results).toEqual([]);
    expect(res.body.info.totalPages).toBe(0);
  });

  it('returns 500 without leaking internal error details on upstream failure', async () => {
    rickAndMortyClient.fetchCharacters.mockRejectedValue(
      new rickAndMortyClient.UpstreamError('boom', new Error('raw internal detail'))
    );

    const res = await request(app).get('/characters?page=1');

    expect(res.status).toBe(500);
    expect(res.body.error).not.toMatch(/raw internal detail/);
  });
});

describe('GET /characters/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the mapped character detail on success', async () => {
    rickAndMortyClient.fetchCharacterById.mockResolvedValue({
      id: 1,
      name: 'Rick Sanchez',
      image: 'img1',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      origin: { name: 'Earth (C-137)' },
      location: { name: 'Citadel of Ricks' },
      episode: ['e1', 'e2', 'e3'],
    });

    const res = await request(app).get('/characters/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      name: 'Rick Sanchez',
      image: 'img1',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      origin: { name: 'Earth (C-137)' },
      location: { name: 'Citadel of Ricks' },
      episodeCount: 3,
    });
  });

  it('returns 404 when the character does not exist', async () => {
    rickAndMortyClient.fetchCharacterById.mockRejectedValue(
      new rickAndMortyClient.UpstreamNotFoundError('Character with id 999999 not found')
    );

    const res = await request(app).get('/characters/999999');

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/999999/);
  });
});

describe('Unknown routes', () => {
  it('returns 404 for a route that does not exist', async () => {
    const res = await request(app).get('/not-a-real-route');
    expect(res.status).toBe(404);
  });
});
