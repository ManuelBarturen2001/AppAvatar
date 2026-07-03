import './Pagination.css';

export function Pagination({ currentPage, totalPages, hasNextPage, hasPrevPage, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Paginación de resultados">
      <button
        type="button"
        className="pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
      >
        ‹ Anterior
      </button>

      <span className="pagination__status mono-tag">
        Página <strong>{String(currentPage).padStart(2, '0')}</strong> / {String(totalPages).padStart(2, '0')}
      </span>

      <button
        type="button"
        className="pagination__btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
      >
        Siguiente ›
      </button>
    </nav>
  );
}
