import { useEffect, useState } from 'react';
import { useDebounce } from './hooks/useDebounce';
import { searchCharacters, getCharacterById } from './services/characterService';
import { SearchBar } from './components/SearchBar/SearchBar';
import { CharacterList } from './components/CharacterList/CharacterList';
import { Pagination } from './components/Pagination/Pagination';
import { CharacterDetail } from './components/CharacterDetail/CharacterDetail';
import './App.css';

function mapDetailForView(data) {
  return {
    id: data.id,
    name: data.name,
    image: data.image,
    status: data.status,
    species: data.species,
    gender: data.gender,
    originName: data.origin?.name ?? 'unknown',
    locationName: data.location?.name ?? 'unknown',
    episodeCount: data.episodeCount,
  };
}

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(query, 300);

  const [listState, setListState] = useState({
    status: 'loading', // 'loading' | 'success' | 'error'
    characters: [],
    info: null,
    error: null,
  });

  const [selectedId, setSelectedId] = useState(null);
  const [detailState, setDetailState] = useState({ status: 'idle', character: null, error: null });

  // Al cambiar la búsqueda (ya debounced), volvemos siempre a la página 1.
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  // Carga de la lista paginada. Se re-ejecuta con cada cambio de búsqueda o página.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setListState((prev) => ({ ...prev, status: 'loading', error: null }));
      try {
        const data = await searchCharacters({ name: debouncedQuery, page });
        if (cancelled) return;
        setListState({ status: 'success', characters: data.results, info: data.info, error: null });
      } catch (error) {
        if (cancelled) return;
        setListState({ status: 'error', characters: [], info: null, error: error.message });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, page]);

  // Carga del detalle al seleccionar un personaje.
  useEffect(() => {
    if (selectedId == null) return undefined;
    let cancelled = false;

    async function load() {
      setDetailState({ status: 'loading', character: null, error: null });
      try {
        const data = await getCharacterById(selectedId);
        if (cancelled) return;
        setDetailState({ status: 'success', character: mapDetailForView(data), error: null });
      } catch (error) {
        if (cancelled) return;
        setDetailState({ status: 'error', character: null, error: error.message });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const isDetailView = selectedId != null;

  return (
    <div className="app">
      <header className="app__header">
        {/* <p className="app__eyebrow mono-tag">Citadel Roster // v1.0</p> */}
        <h1 className="app__title" style={{ textAlign: 'center' }}>The Rick and Morty</h1>
        <br />
        <p className="app__subtitle">Busca personajes a través del multiverso de Rick and Morty.</p>
      </header>

      <main className="app__main">
        {!isDetailView && (
          <>
            <SearchBar value={query} onChange={setQuery} isSearching={listState.status === 'loading'} />

            <CharacterList
              status={listState.status}
              characters={listState.characters}
              errorMessage={listState.error}
              onSelect={setSelectedId}
            />

            {listState.status === 'success' && listState.info && (
              <Pagination
                currentPage={listState.info.currentPage}
                totalPages={listState.info.totalPages}
                hasNextPage={listState.info.hasNextPage}
                hasPrevPage={listState.info.hasPrevPage}
                onPageChange={setPage}
              />
            )}
          </>
        )}

        {isDetailView && (
          <CharacterDetail
            status={detailState.status}
            character={detailState.character}
            errorMessage={detailState.error}
            onBack={() => setSelectedId(null)}
          />
        )}
      </main>
    </div>
  );
}
