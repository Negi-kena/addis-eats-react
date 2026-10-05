import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart/cartSlice.js';
import ordersReducer, { syncOrdersFromStorage } from './orders/ordersSlice.js';
import favoritesReducer from './favorites/favoritesSlice.js';
import dishesReducer from './admin/dishesSlice.js';
import { saveCart } from './cart/cartStorage.js';
import { saveOrders } from './orders/ordersStorage.js';
import { saveFavoriteIds } from './favorites/favoritesStorage.js';
import { saveDishes } from './admin/dishesStorage.js';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: ordersReducer,
    favorites: favoritesReducer,
    dishes: dishesReducer,
  },
});

let previousCartItems = store.getState().cart.items;
let previousOrders = store.getState().orders.orders;
let previousFavoriteIds = store.getState().favorites.ids;
let previousDishes = store.getState().dishes.items;

store.subscribe(() => {
  const state = store.getState();

  if (state.cart.items !== previousCartItems) {
    saveCart(state.cart.items);
    previousCartItems = state.cart.items;
  }

  if (state.orders.orders !== previousOrders) {
    saveOrders(state.orders.orders);
    previousOrders = state.orders.orders;
  }

  if (state.favorites.ids !== previousFavoriteIds) {
    saveFavoriteIds(state.favorites.ids);
    previousFavoriteIds = state.favorites.ids;
  }

  if (state.dishes.items !== previousDishes) {
    saveDishes(state.dishes.items);
    previousDishes = state.dishes.items;
  }
});

// Keeps EVERY tab's orders in sync with localStorage, not just admin's.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'addisEats.orders') {
      store.dispatch(syncOrdersFromStorage());
    }
  });
}

export default store;