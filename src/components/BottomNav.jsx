import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home as HomeIcon, UtensilsCrossed, ShoppingCart, Heart, Receipt } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext.jsx';
import { selectCartCount } from '../cart/cartSlice.js';
import { selectFavoriteCount } from '../favorites/favoritesSlice.js';
import ThemeToggle from '../theme/ThemeToggle.jsx';
import LanguageToggle from '../language/LanguageToggle.jsx';
import LogoMark from './LogoMark.jsx';
import './BottomNav.css';

const NAV_ITEMS = [
  { to: '/', labelKey: 'nav.home', Icon: HomeIcon, end: true },
  { to: '/menu', labelKey: 'nav.menu', Icon: UtensilsCrossed },
  { to: '/cart', labelKey: 'nav.cart', Icon: ShoppingCart },
  { to: '/favorites', labelKey: 'nav.favorites', Icon: Heart },
  { to: '/orders', labelKey: 'nav.orders', Icon: Receipt },
];

/**
 * Mobile: bottom tab bar, icons only, no brand/utility icons (no room).
 * Desktop (>=1024px): becomes a top bar — logo left, tabs centered,
 * theme/language icons right — the one persistent place those controls
 * live at that breakpoint, instead of being repeated per-page.
 */
function BottomNav() {
  const { t } = useLanguage();
  const cartCount = useSelector(selectCartCount);
  const favoriteCount = useSelector(selectFavoriteCount);

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <Link to="/" className="bottom-nav__brand" aria-label="Addis Eats home">
        <LogoMark size={52} />
        <span>Addis Eats</span>
      </Link>

      <div className="bottom-nav__items">
        {NAV_ITEMS.map(({ to, labelKey, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`
            }
          >
            <span className="bottom-nav__icon-wrap">
              <Icon size={20} />
              {to === '/cart' && cartCount > 0 && (
                <span className="bottom-nav__badge" aria-label={`${cartCount} items in cart`}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
              {to === '/favorites' && favoriteCount > 0 && (
                <span className="bottom-nav__badge" aria-label={`${favoriteCount} favorites`}>
                  {favoriteCount > 99 ? '99+' : favoriteCount}
                </span>
              )}
            </span>
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
      </div>

      <div className="bottom-nav__utility">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </nav>
  );
}

export default BottomNav;