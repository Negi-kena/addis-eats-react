import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { selectOrders, updateOrderStatus, deleteOrder } from '../orders/ordersSlice.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatOrderDate } from '../utils/formatOrderDate.js';
import './AdminOrders.css';

const STATUSES = ['Pending', 'Preparing', 'Delivering', 'Delivered'];

function AdminOrders() {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  function handleDelete(order) {
    const confirmed = window.confirm(
      `Delete order ${order.id} for ${order.customer.name}? This can't be undone.`
    );
    if (confirmed) dispatch(deleteOrder(order.id));
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders__filters" role="tablist" aria-label="Filter by status">
        <button
          type="button"
          className={`admin-orders__filter${statusFilter === 'all' ? ' admin-orders__filter--active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All ({orders.length})
        </button>
        {STATUSES.map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <button
              key={status}
              type="button"
              className={`admin-orders__filter${statusFilter === status ? ' admin-orders__filter--active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="admin-orders__empty">No orders match this filter.</p>
      ) : (
        <ul className="admin-orders__list">
          {filteredOrders.map((order) => {
            const isExpanded = expandedId === order.id;
            return (
              <li key={order.id} className="admin-order card">
                <button
                  type="button"
                  className="admin-order__summary"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="admin-order__summary-left">
                    <span className="admin-order__customer">{order.customer.name}</span>
                    <span className="admin-order__meta">
                      #{order.id} · {formatOrderDate(order.createdAt)} · {order.customer.phone}
                    </span>
                  </div>
                  <div className="admin-order__summary-right">
                    <span className="admin-order__total">{formatCurrency(order.total)}</span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="admin-order__details">
                    <div className="admin-order__items">
                      {order.items.map((item) => (
                        <div key={item.id} className="admin-order__item-row">
                          <span>
                            {item.quantity}× {item.name}
                          </span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      {order.customer.note && (
                        <p className="admin-order__note">Note: "{order.customer.note}"</p>
                      )}
                      <p className="admin-order__address">
                        Delivering to: {order.customer.area}
                      </p>
                    </div>

                    <div className="admin-order__actions">
                      <label htmlFor={`status-${order.id}`}>Status</label>
                      <select
                        id={`status-${order.id}`}
                        value={order.status}
                        onChange={(e) =>
                          dispatch(updateOrderStatus({ id: order.id, status: e.target.value }))
                        }
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        className="admin-order__delete"
                        onClick={() => handleDelete(order)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default AdminOrders;