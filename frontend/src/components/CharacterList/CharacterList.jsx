import { CharacterCard } from '../CharacterCard/CharacterCard';
import './CharacterList.css';

export function CharacterList({ status, characters, errorMessage, onSelect }) {
  if (status === 'loading') {
    return (
      <div className="character-list__state" role="status" aria-live="polite">
        <span className="character-list__spinner" aria-hidden="true" />
        <p>Escaneando dimensiones…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="character-list__state character-list__state--error" role="alert">
        <p className="character-list__state-title">La señal se perdió</p>
        <p className="character-list__state-detail">{errorMessage || 'No se pudo contactar al backend.'}</p>
      </div>
    );
  }

  if (status === 'success' && characters.length === 0) {
    return (
      <div className="character-list__state" role="status">
        <p className="character-list__state-title">Sin coincidencias en esta dimensión</p>
        <p className="character-list__state-detail">Prueba con otro nombre.</p>
      </div>
    );
  }

  return (
    <div className="character-list__grid">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} onSelect={onSelect} />
      ))}
    </div>
  );
}
