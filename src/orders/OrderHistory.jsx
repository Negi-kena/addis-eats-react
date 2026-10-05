import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Receipt } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext.jsx';
import { selectOrders } from './ordersSlice.js';
import { addItem } from '../cart/cartSlice.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatOrderDate } from '../utils/formatOrderDate.js';
import './OrderHistory.css';

function OrderHistory() {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector(selectOrders); // already newest-first (ordersSlice unshifts)

  function handleReorder(order) {
    order.items.forEach((item) => {
      dispatch(addItem(item)); // carries the same quantity + note as the original order
    });
    navigate('/cart');
  }

  if (orders.length === 0) {
    return (
      <div className="container order-history">

        <div className="order-history__empty">
          <div className="order-history__empty-icon">
            <Receipt size={28} />
          </div>
          <p className="order-history__empty-title">No orders yet</p>
          <p className="order-history__empty-subtitle">
            Your past orders will appear here after your first delivery.
          </p>
          <Link to="/menu" className="btn-primary">
            Browse the menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container order-history">
            <p className="order-history__count">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </p>

      <ul className="order-history__list">
        {orders.map((order) => {
          const statusClass = `order-history__status--${order.status.toLowerCase()}`;

          return (
            <li key={order.id} className="order-history__card card">
              <div className="order-history__top-row">
                <div>
                  <span className="order-history__id">#{order.id}</span>
                  <span className="order-history__date">{formatOrderDate(order.createdAt)}</span>
                </div>
                <span className={`order-history__status ${statusClass}`}>{order.status}</span>
              </div>

              <ul className="order-history__items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    <span>
                      {item.quantity}× {item.name}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="order-history__bottom-row">
                <span className="order-history__total">{formatCurrency(order.total)}</span>
                <button
                  type="button"
                  className="order-history__reorder"
                  onClick={() => handleReorder(order)}
                >
                  Reorder
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default OrderHistory;