import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Package, Receipt, Clock } from 'lucide-react';
import { selectOrders } from '../orders/ordersSlice.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatOrderDate } from '../utils/formatOrderDate.js';
import './AdminDashboard.css';

const STATUS_COLORS = {
  Pending: '#9a8f86',
  Preparing: '#e08a3c',
  Delivering: '#4a7fc2',
  Delivered: '#3fa864',
};

function StatCard({ icon: Icon, label, value, sublabel }) {
  return (
    <div className="stat-card card">
      <div className="stat-card__icon">
        <Icon size={18} />
      </div>
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">{value}</span>
      {sublabel && <span className="stat-card__sublabel">{sublabel}</span>}
    </div>
  );
}

function AdminDashboard() {
  const orders = useSelector(selectOrders); // newest-first, real placed orders

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const orderCount = orders.length;
    const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
    const inProgress = orders.filter((o) => o.status !== 'Delivered').length;
    return { totalRevenue, orderCount, avgOrderValue, inProgress };
  }, [orders]);

  const statusData = useMemo(() => {
    const counts = { Pending: 0, Preparing: 0, Delivering: 0, Delivered: 0 };
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) counts[o.status] += 1;
    });
    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [orders]);

  const topDishes = useMemo(() => {
    const tally = new Map();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = tally.get(item.id) ?? { name: item.name, quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
        tally.set(item.id, existing);
      });
    });
    return [...tally.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  }, [orders]);

  const recentOrders = orders.slice(0, 5);

  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days.map((day) => {
      const dayStart = day.getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const dayOrders = orders.filter((o) => {
        const t = new Date(o.createdAt).getTime();
        return t >= dayStart && t < dayEnd;
      });
      return {
        label: day.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
        orders: dayOrders.length,
      };
    });
  }, [orders]);

  const weekTotal = weeklyData.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__stats">
        <StatCard icon={TrendingUp} label="Revenue" value={formatCurrency(stats.totalRevenue)} />
        <StatCard icon={Receipt} label="Orders" value={stats.orderCount} />
        <StatCard
          icon={Package}
          label="Avg order value"
          value={formatCurrency(Math.round(stats.avgOrderValue))}
        />
        <StatCard icon={Clock} label="In progress" value={stats.inProgress} sublabel="not yet delivered" />
      </div>

      {/* Order status + top dishes render first, side by side, so status
          is visible at a glance right under the stat cards. */}
      <div className="admin-dashboard__grid">
        <section className="admin-dashboard__panel card">
          <h2>Order status</h2>
          {statusData.length === 0 ? (
            <p className="admin-dashboard__empty">No orders placed yet.</p>
          ) : (
            <div className="admin-dashboard__chart">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} order${value === 1 ? '' : 's'}`, name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="admin-dashboard__panel card">
          <h2>Top selling dishes</h2>
          {topDishes.length === 0 ? (
            <p className="admin-dashboard__empty">No sales data yet.</p>
          ) : (
            <ul className="admin-dashboard__top-dishes">
              {topDishes.map((dish, i) => (
                <li key={dish.name}>
                  <span className="admin-dashboard__rank">#{i + 1}</span>
                  <span className="admin-dashboard__dish-name">{dish.name}</span>
                  <span className="admin-dashboard__dish-meta">
                    {dish.quantity} sold · {formatCurrency(dish.revenue)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Weekly sales is its own full-width row, below the grid —
          not a third item squeezed into the 2-column layout above. */}
      <section className="admin-dashboard__panel card">
        <div className="admin-dashboard__panel-heading">
          <h2>Sales this week</h2>
          <span className="admin-dashboard__week-total">{formatCurrency(weekTotal)}</span>
        </div>
        <div className="admin-dashboard__chart">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} width={40} />
              <Tooltip
                formatter={(value, name) =>
                  name === 'revenue' ? [formatCurrency(value), 'Revenue'] : [value, 'Orders']
                }
              />
              <Bar dataKey="revenue" fill="#d85b32" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="admin-dashboard__panel card admin-dashboard__recent">
        <div className="admin-dashboard__panel-heading">
          <h2>Recent orders</h2>
          <Link to="/admin/orders">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="admin-dashboard__empty">Orders will show up here as customers check out.</p>
        ) : (
          <ul className="admin-dashboard__recent-list">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <div>
                  <span className="admin-dashboard__customer">{order.customer.name}</span>
                  <span className="admin-dashboard__order-meta">
                    #{order.id} · {formatOrderDate(order.createdAt)}
                  </span>
                </div>
                <div className="admin-dashboard__recent-right">
                  <span
                    className="admin-dashboard__status-dot"
                    style={{ background: STATUS_COLORS[order.status] }}
                  />
                  <span>{order.status}</span>
                  <strong>{formatCurrency(order.total)}</strong>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;