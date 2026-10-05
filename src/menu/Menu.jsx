import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext.jsx';
import { useEnsureDishesSeeded } from '../hooks/useEnsureDishesSeeded.js';
import { selectVisibleDishes, selectDishesStatus } from '../admin/dishesSlice.js';
import { addItem } from '../cart/cartSlice.js';
import { selectFavoriteIds, toggleFavorite } from '../favorites/favoritesSlice.js';
import DishCard from './DishCard.jsx';
import Spinner from '../ui/Spinner.jsx';
import './Menu.css';

const CATEGORIES = ['ethiopian', 'pizza', 'burgers', 'drinks'];

function Menu() {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const favoriteIds = useSelector(selectFavoriteIds);
  const [searchParams, setSearchParams] = useSearchParams();

  useEnsureDishesSeeded();
  const dishes = useSelector(selectVisibleDishes);
  const status = useSelector(selectDishesStatus);

  // Search text is NOT kept in the URL (only category is, per rubric) —
  // initialized once from ?q= so a link from Home still works, but typing
  // afterward only updates local state, not the address bar.
  const [searchInput, setSearchInput] = useState(() => searchParams.get('q') ?? '');

  // Category IS kept in the URL — this is the source of truth for it.
  const activeCategory = searchParams.get('category');

  function handleCategoryClick(category) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (category) {
        next.set('category', category);
      } else {
        next.delete('category');
      }
      next.delete('q'); // switching category clears the one-time deep-linked search
      return next;
    });
  }

  const filteredDishes = useMemo(() => {
    const term = searchInput.trim().toLowerCase();

    return dishes
      .filter((d) => !activeCategory || d.category === activeCategory)
      .filter((d) => !term || d.name.toLowerCase().includes(term))
      .sort((a, b) => Number(b.popular === true) - Number(a.popular === true));
  }, [dishes, activeCategory, searchInput]);

  return (
    <div className="container menu">
      <div className="menu__search">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search the menu..."
          aria-label="Search dishes"
        />
      </div>

      <div className="menu__categories" role="tablist" aria-label="Filter by category">
        <button
          type="button"
          role="tab"
          aria-selected={!activeCategory}
          className={`menu__category-pill${!activeCategory ? ' menu__category-pill--active' : ''}`}
          onClick={() => handleCategoryClick(null)}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat}
            className={`menu__category-pill${activeCategory === cat ? ' menu__category-pill--active' : ''}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {t(`categories.${cat}`)}
          </button>
        ))}
      </div>

      <div className="menu__section-heading">
        <h2>Popular dishes</h2>
        {status === 'ready' && <span>{filteredDishes.length} dishes</span>}
      </div>

      {status === 'loading' && <Spinner label={t('common.loading')} />}
      {status === 'error' && (
        <p className="menu__status menu__status--error">{t('common.error')}</p>
      )}

      {status === 'ready' && filteredDishes.length === 0 && (
        <p className="menu__status">
          No dishes found. Try another search or clear your category filters.
        </p>
      )}

      {status === 'ready' && filteredDishes.length > 0 && (
        <div className="menu__grid">
          {filteredDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              isFavorite={favoriteIds.includes(dish.id)}
              onToggleFavorite={(id) => dispatch(toggleFavorite(id))}
              onAdd={(d) => dispatch(addItem(d))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Menu;