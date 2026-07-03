import './SearchBar.css';

export function SearchBar({ value, onChange, isSearching }) {
  return (
    <div className="search-bar">
      <svg className="search-bar__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <line x1="15.3" y1="15.3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Buscar personaje por nombre…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar personaje por nombre"
      />
      <span
        className={`search-bar__scan ${isSearching ? 'search-bar__scan--active' : ''}`}
        aria-hidden="true"
      />
    </div>
  );
}
