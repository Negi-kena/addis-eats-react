import { Outlet } from 'react-router-dom';
import AppHeader from './components/AppHeader.jsx';
import BottomNav from './components/BottomNav.jsx';
import Footer from './components/Footer.jsx';
import './Layout.css';

function Layout() {
  return (
    <div className="app-shell">
      <main className="app-shell__content">
        <AppHeader />
        <Outlet />
        <Footer />
      </main>
      <BottomNav />
    </div>
  );
}

export default Layout;