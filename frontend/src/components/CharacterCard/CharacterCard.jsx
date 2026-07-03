import { StatusDot } from '../StatusDot/StatusDot';
import './CharacterCard.css';

export function CharacterCard({ character, onSelect }) {
  return (
    <button
      type="button"
      className="character-card"
      onClick={() => onSelect(character.id)}
      aria-label={`Ver detalle de ${character.name}`}
    >
      <div className="character-card__image-wrap">
        <img src={character.image} alt={character.name} loading="lazy" className="character-card__image" />
        <span className="character-card__id mono-tag">#{String(character.id).padStart(3, '0')}</span>
        <span className="character-card__scan" aria-hidden="true" />
      </div>
      <div className="character-card__body">
        <h3 className="character-card__name">{character.name}</h3>
        <div className="character-card__meta">
          <StatusDot status={character.status} />
          <span className="character-card__species mono-tag">{character.species}</span>
        </div>
      </div>
    </button>
  );
}
