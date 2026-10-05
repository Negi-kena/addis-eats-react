import { useLocation } from 'react-router-dom';
import { useLanguage } from '../language/LanguageContext.jsx';
import ThemeToggle from '../theme/ThemeToggle.jsx';
import LanguageToggle from '../language/LanguageToggle.jsx';
import './AppHeader.css';

const TITLES = {
  '/': null,
  '/menu': 'nav.menu',
  '/cart': 'nav.cart',
  '/favorites': 'nav.favorites',
  '/orders': 'nav.orders',
  '/checkout': 'nav.checkout', // was the hardcoded string 'Checkout'
};

function AppHeader() {
  const { t } = useLanguage();
  const { pathname } = useLocation();

  // Don't show a second title on Home (it already has the big hero)
  // or on dish detail (it has its own back + title)
  const isHome = pathname === '/';
  const isDish = pathname.startsWith('/menu/') && pathname !== '/menu';
  if (isHome || isDish) return null;

  const titleKey = TITLES[pathname];
  const title = titleKey ? t(titleKey) : null;

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <h1 className="app-header__title">{title ?? 'Addis Eats'}</h1>
        <div className="app-header__actions">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}

export default AppHeader;