import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency.js';
import './DishCard.css';

function DishCard({ dish, isFavorite = false, onToggleFavorite, onAdd }) {
  const { id, name, price, image, available } = dish;

  return (
    <div className={`dish-card card${available === false ? ' dish-card--unavailable' : ''}`}>
      <Link to={`/menu/${id}`} className="dish-card__media" aria-label={`View details for ${name}`}>
        <img src={image} alt={name} loading="lazy" />
        {available === false && <span className="dish-card__badge">Unavailable</span>}
      </Link>

      {onToggleFavorite && (
        <button
          type="button"
          className={`dish-card__heart${isFavorite ? ' dish-card__heart--active' : ''}`}
          aria-label={isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(id)}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      )}

      <Link to={`/menu/${id}`} className="dish-card__body" aria-label={`View details for ${name}`}>
        <span className="dish-card__name">{name}</span>
      </Link>

      <div className="dish-card__footer">
        <span className="dish-card__price">{formatCurrency(price)}</span>

        {onAdd && (
          <button
            type="button"
            className="dish-card__add"
            aria-label={`Add ${name} to cart`}
            disabled={available === false}
            onClick={() => onAdd(dish)}
          >
            <Plus size={14} />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default DishCard;