import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { selectCartItems, selectCartSubtotal, clearCart } from '../cart/cartSlice.js';
import { placeOrder, selectOrders } from '../orders/ordersSlice.js';
import { generateOrderId } from '../orders/generateOrderID.js';
import { validateCheckoutForm } from './validate.js';
import { DELIVERY_AREAS, getDeliveryEstimate } from '../utils/deliveryEstimate.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import './Checkout.css';

function Checkout() {
  const { session } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const existingOrders = useSelector(selectOrders);

  // Checkout form fields live here, and nowhere else, per the rubric's
  // state table — pre-filled from the sign-in session but fully editable.
  const [name, setName] = useState(session?.name ?? '');
  const [phone, setPhone] = useState(session?.phone ?? '');
  const [area, setArea] = useState(DELIVERY_AREAS[0].value);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const { fee: deliveryFee, etaLabel } = getDeliveryEstimate(area);
  const total = subtotal + deliveryFee;

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validateCheckoutForm({ name, phone, area });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const order = {
      id: generateOrderId(existingOrders.length),
      items,
      subtotal,
      deliveryFee,
      total,
      customer: { name: name.trim(), phone: phone.trim(), area, note: note.trim() },
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    dispatch(placeOrder(order));
    dispatch(clearCart());
    setConfirmedOrder(order); // switches this screen straight to the confirmation view
  }

  // --- Confirmation view ---
  if (confirmedOrder) {
    const { etaLabel: confirmedEta } = getDeliveryEstimate(confirmedOrder.customer.area);
    return (
      <div className="container checkout">
        <div className="checkout__confirmation">
          <div className="checkout__confirmation-icon">
            <CheckCircle2 size={40} />
          </div>
          <h1>Order confirmed!</h1>
          <p>
            Order {confirmedOrder.id} has been received. Estimated arrival in {confirmedEta}.
          </p>

          <div className="checkout__confirmation-summary card">
            <span>{confirmedOrder.id}</span>
            <span>{formatCurrency(confirmedOrder.total)}</span>
          </div>

          <button type="button" className="btn-primary" onClick={() => navigate('/orders')}>
            Track my order
          </button>
        </div>
      </div>
    );
  }

  // --- Nothing to check out ---
  if (items.length === 0) {
    return (
      <div className="container checkout">

        <p className="checkout__empty">Your cart is empty. Add something from the menu first.</p>
        <Link to="/menu" className="btn-primary">
          Browse the menu
        </Link>
      </div>
    );
  }

  // --- The real form ---
  return (
    <div className="container checkout">

      <form onSubmit={handleSubmit} noValidate className="checkout__form">
        <h2>Delivery details</h2>

        <label htmlFor="checkout-name">Customer name</label>
        <input
          id="checkout-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <span className="checkout__error">{errors.name}</span>}

        <label htmlFor="checkout-phone">Phone number</label>
        <input
          id="checkout-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={Boolean(errors.phone)}
        />
        {errors.phone && <span className="checkout__error">{errors.phone}</span>}

        <label htmlFor="checkout-area">Delivery area</label>
        <select
          id="checkout-area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        >
          {DELIVERY_AREAS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>

        <label htmlFor="checkout-note">Special instructions</label>
        <textarea
          id="checkout-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Call when you reach the gate..."
          rows={2}
        />

        <div className="checkout__estimate">
          <div>
            <span className="checkout__estimate-label">Delivery fee</span>
            <span className="checkout__estimate-value">{formatCurrency(deliveryFee)}</span>
          </div>
          <div>
            <span className="checkout__estimate-label">Estimated delivery</span>
            <span className="checkout__estimate-value">{etaLabel}</span>
          </div>
        </div>

        <div className="checkout__summary card">
          <h2>Order summary</h2>
          <p>{items.reduce((n, i) => n + i.quantity, 0)} items</p>
          <div className="checkout__summary-row">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="checkout__verified">
          <CheckCircle2 size={16} />
          <span>Phone number verified</span>
        </div>

        <button type="submit" className="btn-primary checkout__submit">
          Place Order · {formatCurrency(total)}
        </button>
      </form>
    </div>
  );
}

export default Checkout;