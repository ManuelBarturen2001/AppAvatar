import { StatusDot } from '../StatusDot/StatusDot';
import './CharacterDetail.css';

const FIELDS = [
  { key: 'species', label: 'Especie' },
  { key: 'gender', label: 'Género' },
  { key: 'originName', label: 'Origen' },
  { key: 'locationName', label: 'Ubicación' },
  { key: 'episodeCount', label: 'Episodios' },
];

export function CharacterDetail({ status, character, errorMessage, onBack }) {
  return (
    <div className="character-detail">
      <button type="button" className="character-detail__back" onClick={onBack}>
        ‹ Volver al listado
      </button>

      {status === 'loading' && (
        <div className="character-detail__state" role="status" aria-live="polite">
          <span className="character-list__spinner" aria-hidden="true" />
          <p>Cargando ficha…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="character-detail__state character-detail__state--error" role="alert">
          <p className="character-detail__state-title">No se pudo abrir la ficha</p>
          <p className="character-detail__state-detail">{errorMessage || 'Personaje no encontrado.'}</p>
        </div>
      )}

      {status === 'success' && character && (
        <div className="character-detail__card">
          <div className="character-detail__image-wrap">
            <img src={character.image} alt={character.name} className="character-detail__image" />
            <span className="character-detail__id mono-tag">
              #{String(character.id).padStart(3, '0')}
            </span>
          </div>

          <div className="character-detail__info">
            <h2 className="character-detail__name">{character.name}</h2>
            <StatusDot status={character.status} />

            <dl className="character-detail__fields">
              {FIELDS.map(({ key, label }) => (
                <div key={key} className="character-detail__field">
                  <dt className="mono-tag">{label}</dt>
                  <dd>{character[key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
