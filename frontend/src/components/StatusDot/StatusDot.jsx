import './StatusDot.css';

const STATUS_LABEL = {
  Alive: 'Alive',
  Dead: 'Dead',
  unknown: 'Unknown',
};

export function StatusDot({ status, showLabel = true }) {
  const normalizedStatus = STATUS_LABEL[status] ? status : 'unknown';

  return (
    <span className={`status-dot status-dot--${normalizedStatus.toLowerCase()}`}>
      <span className="status-dot__pulse" aria-hidden="true" />
      {showLabel && <span className="status-dot__label">{STATUS_LABEL[normalizedStatus]}</span>}
    </span>
  );
}
