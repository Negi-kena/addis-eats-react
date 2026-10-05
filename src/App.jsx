import { Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from './menu/Home.jsx';
import Menu from './menu/Menu.jsx';
import Dish from './menu/Dish.jsx';
import Cart from './cart/Cart.jsx';
import RequireAuth from './auth/RequireAuth.jsx';
import Checkout from './checkout/Checkout.jsx';
import Favorites from './favorites/Favorites.jsx';
import OrderHistory from './orders/OrderHistory.jsx';
import AdminLogin from './admin/AdminLogin.jsx';
import RequireAdmin from './admin/RequireAdmin.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import AdminOrders from './admin/AdminOrders.jsx';
import DishManager from './admin/DishManager.jsx';
import { useEnsureDishesSeeded } from './hooks/useEnsureDishesSeeded.js';

const Placeholder = ({ label }) => (
  <div style={{ padding: '2rem' }}>
    <h2>{label}</h2>
    <p>This screen hasn't been built yet.</p>
  </div>
);

function App() {
  useEnsureDishesSeeded();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<Dish />} />
        <Route path="/cart" element={<Cart />} />

        <Route element={<RequireAuth />}>
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        <Route path="/favorites" element={<Favorites />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="*" element={<Placeholder label="404 — Not Found" />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/menu" element={<DishManager />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;