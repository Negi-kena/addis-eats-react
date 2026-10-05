import { Loader2 } from 'lucide-react';
import './Spinner.css';

/**
 * Generic loading indicator — belongs in ui/, not a feature folder,
 * because it doesn't know or care what's loading. Every screen that
 * fetches data renders this the same way: <Spinner label={t('common.loading')} />
 */
function Spinner({ label }) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <Loader2 className="spinner__icon" size={28} aria-hidden="true" />
      {label && <span className="spinner__label">{label}</span>}
    </div>
  );
}

export default Spinner;