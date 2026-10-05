import { createSlice } from '@reduxjs/toolkit';
import { loadCart } from './cartStorage.js';

const initialState = {
  items: loadCart(), // [{ id, name, price, image, quantity }]
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
        const { quantity = 1, note = '', ...dish } = action.payload;
        const existing = state.items.find((i) => i.id === dish.id);
        if (existing) {
            existing.quantity += quantity;
            if (note) existing.note = note;
        } else {
            state.items.push({
            id: dish.id,
            name: dish.name,
            price: dish.price,
            image: dish.image,
            quantity,
            note,
            });
        }
    },
    incrementQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, incrementQuantity, decrementQuantity, removeItem, clearCart } =
  cartSlice.actions;

// --- Selectors: components read cart state through these, never state.cart directly ---
export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default cartSlice.reducer;