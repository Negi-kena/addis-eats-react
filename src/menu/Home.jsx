import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { useEnsureDishesSeeded } from '../hooks/useEnsureDishesSeeded.js';
import { selectVisibleDishes, selectDishesStatus } from '../admin/dishesSlice.js';
import { addItem } from '../cart/cartSlice.js';
import { selectFavoriteIds, toggleFavorite } from '../favorites/favoritesSlice.js';
import { getGreeting } from '../utils/getGreeting.js';
import DishCard from './DishCard.jsx';
import Spinner from '../ui/Spinner.jsx';
import ThemeToggle from '../theme/ThemeToggle.jsx';
import LanguageToggle from '../language/LanguageToggle.jsx';
import './Home.css';

const SPOTLIGHT_CATEGORIES = ['ethiopian', 'pizza', 'burgers', 'drinks'];
const ROTATE_INTERVAL_MS = 5000;

function Home() {
  const { t } = useLanguage();
  const { session } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favoriteIds = useSelector(selectFavoriteIds);

  useEnsureDishesSeeded();
  const dishes = useSelector(selectVisibleDishes);
  const status = useSelector(selectDishesStatus);

  const [searchInput, setSearchInput] = useState('');
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSpotlightIndex((i) => (i + 1) % SPOTLIGHT_CATEGORIES.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const spotlightCategory = SPOTLIGHT_CATEGORIES[spotlightIndex];
  const specials = dishes.filter((d) => d.popular);
  const spotlightImage = dishes.find((d) => d.category === spotlightCategory)?.image;

  function handleSearchSubmit(e) {
    e.preventDefault();
    const query = searchInput.trim();
    navigate(query ? `/menu?q=${encodeURIComponent(query)}` : '/menu');
  }

  return (
    <div className="container home">
      <header className="home__header">
        <div>
          <h1>{t('home.headline')}</h1>
          <p className="home__greeting">
            {getGreeting()}
            {session?.name ? `, ${session.name.split(' ')[0]}` : ''}
          </p>
        </div>
        <div className="home__top-actions">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </header>

      <form className="home__search" onSubmit={handleSearchSubmit} role="search">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search dishes, restaurants..."
          aria-label="Search dishes"
        />
      </form>

      {/* Rotating spotlight: dish photo on the left, solid brand-color
          panel with the copy on the right — text never sits on top of
          the photo, so legibility isn't a tradeoff against how bright
          or busy the image is. */}
      <Link
        key={spotlightCategory}
        to={`/menu?category=${spotlightCategory}`}
        className="home__spotlight"
        aria-live="polite"
      >
        <div className="home__spotlight-media">
          {spotlightImage ? (
            <img src={spotlightImage} alt="" className="home__spotlight-image" />
          ) : (
            <div className="home__spotlight-image-fallback" />
          )}
        </div>
        <div className="home__spotlight-content">
          <span className="home__spotlight-eyebrow">Trending now</span>
          <span className="home__spotlight-category">{t(`categories.${spotlightCategory}`)}</span>
          <span className="home__spotlight-label">{t('home.tagline')}</span>
          <span className="home__spotlight-cta">{t('home.exploreMenu')}</span>
        </div>
      </Link>

      <section className="home__specials">
        <div className="home__section-heading">
          <h2>{t('home.todaysSpecials')}</h2>
          <Link to="/menu">{t('home.viewMenu')}</Link>
        </div>

        {status === 'loading' && <Spinner label={t('common.loading')} />}
        {status === 'error' && (
          <p className="home__status home__status--error">{t('common.error')}</p>
        )}
        {status === 'ready' && specials.length === 0 && (
          <p className="home__status">No specials right now — check the full menu.</p>
        )}
        {status === 'ready' && specials.length > 0 && (
          <div className="home__specials-grid">
            {specials.slice(0, 6).map((dish) => (
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
      </section>
    </div>
  );
}

export default Home;