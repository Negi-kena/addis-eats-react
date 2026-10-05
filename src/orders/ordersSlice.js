import { createSlice } from '@reduxjs/toolkit';
import { loadOrders } from './ordersStorage.js';

const initialState = {
  orders: loadOrders(), // newest first
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder(state, action) {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus(state, action) {
      const { id, status } = action.payload;
      const order = state.orders.find((o) => o.id === id);
      if (order) order.status = status;
    },
    deleteOrder(state, action) {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
    },
    syncOrdersFromStorage(state) {
      state.orders = loadOrders();
    },
  },
});

export const { placeOrder, updateOrderStatus, deleteOrder, syncOrdersFromStorage } = ordersSlice.actions;

export const selectOrders = (state) => state.orders.orders;
export const selectOrderById = (id) => (state) => state.orders.orders.find((o) => o.id === id);
export const selectPendingOrderCount = (state) =>
  state.orders.orders.filter((o) => o.status === 'Pending').length;

export default ordersSlice.reducer;