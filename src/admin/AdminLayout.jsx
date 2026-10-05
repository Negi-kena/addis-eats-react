import { Outlet, useLocation, Link } from 'react-router-dom';
import { LogOut, ExternalLink } from 'lucide-react';
import { useAdminAuth } from './useAdminAuth.jsx';
import ThemeToggle from '../theme/ThemeToggle.jsx';
import LogoMark from '../components/LogoMark.jsx';
import AdminNav from './AdminNav.jsx';
import './AdminLayout.css';
import NewOrderToasts from './NewOrderToasts.jsx';

const TITLES = {
  '/admin': 'Dashboard',
  '/admin/menu': 'Menu Management',
  '/admin/orders': 'Orders',
};

function AdminLayout() {
  const { logout } = useAdminAuth();
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? 'Admin';
  

  return (
      <div className="admin-shell">
          <NewOrderToasts />
        <header className="admin-header">
        <div className="admin-header__inner">
            <div className="admin-header__brand">
              <LogoMark size={44} />
              <div className="admin-header__brand-text">
                <span className="admin-header__brand-name">Addis Eats Admin</span>
                <span className="admin-header__page-title">{title}</span>
              </div>
            </div>

          <div className="admin-header__actions">
            <Link to="/" className="admin-header__storefront" title="View storefront">
              <ExternalLink size={16} />
              <span>Storefront</span>
            </Link>
            <ThemeToggle />
            <button type="button" className="admin-header__logout" onClick={logout} title="Log out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <AdminNav />

      <main className="admin-shell__content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;