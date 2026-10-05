import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, UtensilsCrossed, ClipboardList } from 'lucide-react';
import { selectPendingOrderCount } from '../orders/ordersSlice.js';
import './AdminNav.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/admin/menu', label: 'Menu', Icon: UtensilsCrossed },
  { to: '/admin/orders', label: 'Orders', Icon: ClipboardList },
];

function AdminNav() {
  const pendingCount = useSelector(selectPendingOrderCount);

  return (
    <nav className="admin-nav" aria-label="Admin sections">
      <div className="admin-nav__inner">
        {NAV_ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `admin-nav__item${isActive ? ' admin-nav__item--active' : ''}`}
          >
            <span className="admin-nav__icon-wrap">
              <Icon size={20} />
              {to === '/admin/orders' && pendingCount > 0 && (
                <span className="admin-nav__badge" aria-label={`${pendingCount} pending orders`}>
                  {pendingCount > 99 ? '99+' : pendingCount}
                </span>
              )}
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default AdminNav;