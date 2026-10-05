import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext.jsx';
import { useEnsureDishesSeeded } from '../hooks/useEnsureDishesSeeded.js';
import { selectDishById, selectDishesStatus } from '../admin/dishesSlice.js';
import { addItem } from '../cart/cartSlice.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import Spinner from '../ui/Spinner.jsx';
import './Dish.css';

function Dish() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useLanguage();

  useEnsureDishesSeeded();
  const dishStatus = useSelector(selectDishesStatus);
  const dish = useSelector(selectDishById(id));
  // If seeding finished but no dish with this id exists, treat it as an error.
  const status = dishStatus === 'ready' && !dish ? 'error' : dishStatus;

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  // Dish data now comes from the store, not a fetch — but quantity/note
  // are still local UI state and need resetting when the customer
  // navigates from one dish straight into another.
  useEffect(() => {
    setQuantity(1);
    setNote('');
  }, [id]);

  function handleAdd() {
    dispatch(addItem({ ...dish, quantity, note: note.trim() }));
    navigate('/cart');
  }

  if (status === 'loading') {
    return (
      <div className="container dish">
        <Spinner label={t('common.loading')} />
      </div>
    );
  }

  if (status === 'error' || !dish) {
    return (
      <div className="container dish">
        <p className="dish__status dish__status--error">{t('common.error')}</p>
        <Link to="/menu" className="dish__back-link">
          ← Back to menu
        </Link>
      </div>
    );
  }

  const isUnavailable = dish.available === false;

  return (
    <div className="container dish">
      <button
        type="button"
        className="dish__back"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="dish__media">
        <img src={dish.image} alt={dish.name} />
        {isUnavailable && <span className="dish__badge">Unavailable</span>}
      </div>

      <div className="dish__info">
        <div className="dish__title-row">
          <h1>{dish.name}</h1>
          <span className="dish__price">{formatCurrency(dish.price)}</span>
        </div>

        <p className="dish__description">{dish.description}</p>

        {Array.isArray(dish.ingredients) && dish.ingredients.length > 0 && (
          <div className="dish__section">
            <h2>Ingredients</h2>
            <p>{dish.ingredients.join(' · ')}</p>
          </div>
        )}

        <div className="dish__section">
          <label htmlFor="dish-note">Special instructions</label>
          <textarea
            id="dish-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Less spicy, no extra butter..."
            rows={2}
          />
        </div>
      </div>

      <div className="dish__action-bar">
        <div className="dish__stepper">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span aria-live="polite">{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
            <Plus size={16} />
          </button>
        </div>

        <button
          type="button"
          className="btn-primary dish__add-btn"
          disabled={isUnavailable}
          onClick={handleAdd}
        >
          {isUnavailable ? 'Unavailable' : `Add to Cart · ${formatCurrency(dish.price * quantity)}`}
        </button>
      </div>
    </div>
  );
}

export default Dish;