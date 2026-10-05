import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext.jsx';
import { useEnsureDishesSeeded } from '../hooks/useEnsureDishesSeeded.js';
import { selectVisibleDishes, selectDishesStatus } from '../admin/dishesSlice.js';
import { addItem } from '../cart/cartSlice.js';
import { selectFavoriteIds, toggleFavorite } from './favoritesSlice.js';
import DishCard from '../menu/DishCard.jsx';
import Spinner from '../ui/Spinner.jsx';
import './Favorites.css';

function Favorites() {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const favoriteIds = useSelector(selectFavoriteIds);

  useEnsureDishesSeeded();
  const dishes = useSelector(selectVisibleDishes);
  const status = useSelector(selectDishesStatus);

  // Favorites re-derives the dish list from the shared store, then
  // filters by the stored favorite IDs — never a second copy of dish
  // data living in the favorites slice itself.
  const favoriteDishes = dishes.filter((d) => favoriteIds.includes(d.id));

  return (
    <div className="container favorites">
      {status === 'loading' && <Spinner label={t('common.loading')} />}

      {status === 'error' && (
        <p className="favorites__status favorites__status--error">{t('common.error')}</p>
      )}

      {status === 'ready' && favoriteDishes.length === 0 && (
        <div className="favorites__empty">
          <div className="favorites__empty-icon">
            <Heart size={28} />
          </div>
          <p className="favorites__empty-title">No favorites yet</p>
          <p className="favorites__empty-subtitle">Tap the heart on any dish to save it here.</p>
          <Link to="/menu" className="btn-primary">
            Browse the menu
          </Link>
        </div>
      )}

      {status === 'ready' && favoriteDishes.length > 0 && (
        <div className="favorites__grid">
          {favoriteDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              isFavorite
              onToggleFavorite={(id) => dispatch(toggleFavorite(id))}
              onAdd={(d) => dispatch(addItem(d))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;