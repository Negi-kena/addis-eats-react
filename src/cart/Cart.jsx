import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext.jsx';
import {
  selectCartItems,
  selectCartSubtotal,
  incrementQuantity,
  decrementQuantity,
  removeItem,
} from './cartSlice.js';
import { getDeliveryEstimate, DEFAULT_DELIVERY_AREA } from '../utils/deliveryEstimate.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import './Cart.css';

function Cart() {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  // No delivery area is chosen yet at this stage (that happens at Checkout),
  // so this is an estimate using the default area — not stored, just derived.
  const { fee: deliveryFee } = getDeliveryEstimate(DEFAULT_DELIVERY_AREA);
  const total = subtotal + (items.length > 0 ? deliveryFee : 0);

  if (items.length === 0) {
    return (
      <div className="container cart">

        <div className="cart__empty">
          <div className="cart__empty-icon">
            <ShoppingBag size={28} />
          </div>
          <p className="cart__empty-title">Your cart is empty</p>
          <p className="cart__empty-subtitle">
            Add something delicious from the menu to get started.
          </p>
          <Link to="/menu" className="btn-primary">
            Browse the menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart">
            <p className="cart__count">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>

      <ul className="cart__list">
        {items.map((item) => (
          <li key={item.id} className="cart__line">
            <img src={item.image} alt={item.name} className="cart__line-image" />

            <div className="cart__line-info">
              <span className="cart__line-name">{item.name}</span>
              <span className="cart__line-price">{formatCurrency(item.price)}</span>
              {item.note && <span className="cart__line-note">"{item.note}"</span>}

              <div className="cart__line-actions">
                <div className="cart__stepper">
                  <button
                    type="button"
                    aria-label={`Decrease ${item.name} quantity`}
                    onClick={() => dispatch(decrementQuantity(item.id))}
                  >
                    <Minus size={14} />
                  </button>
                  <span aria-live="polite">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${item.name} quantity`}
                    onClick={() => dispatch(incrementQuantity(item.id))}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  className="cart__remove"
                  aria-label={`Remove ${item.name} from cart`}
                  onClick={() => dispatch(removeItem(item.id))}
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart__summary card">
        <div className="cart__summary-row">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="cart__summary-row">
          <span>Delivery fee</span>
          <span>{formatCurrency(deliveryFee)}</span>
        </div>
        <div className="cart__summary-row cart__summary-row--total">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <button type="button" className="btn-primary cart__checkout-btn" onClick={() => navigate('/checkout')}>
        Proceed to Checkout
      </button>
    </div>
  );
}

export default Cart;