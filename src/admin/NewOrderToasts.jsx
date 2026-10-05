import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Bell, X } from 'lucide-react';
import { selectOrders } from '../orders/ordersSlice.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import './NewOrderToasts.css';

const TOAST_DURATION_MS = 6000;

function NewOrderToasts() {
  const orders = useSelector(selectOrders);
  const seenIds = useRef(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (seenIds.current === null) {
      seenIds.current = new Set(orders.map((o) => o.id));
      return;
    }

    const newOnes = orders.filter((o) => !seenIds.current.has(o.id));
    if (newOnes.length > 0) {
      setToasts((prev) => [...newOnes.map((o) => ({ id: o.id, order: o })), ...prev]);
    }
    seenIds.current = new Set(orders.map((o) => o.id));
  }, [orders]);

  function dismiss(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  useEffect(() => {
    if (toasts.length === 0) return undefined;
    const timers = toasts.map((t) => setTimeout(() => dismiss(t.id), TOAST_DURATION_MS));
    return () => timers.forEach(clearTimeout);
  }, [toasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="new-order-toasts">
      {toasts.map(({ id, order }) => (
        <div key={id} className="new-order-toast">
          <div className="new-order-toast__icon">
            <Bell size={16} />
          </div>
          <div className="new-order-toast__body">
            <span className="new-order-toast__title">New order — {order.customer.name}</span>
            <span className="new-order-toast__meta">
              #{order.id} · {formatCurrency(order.total)}
            </span>
          </div>
          <button
            type="button"
            className="new-order-toast__close"
            onClick={() => dismiss(id)}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default NewOrderToasts;