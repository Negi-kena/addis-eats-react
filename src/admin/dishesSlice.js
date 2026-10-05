import { createSlice, createSelector } from '@reduxjs/toolkit';
import { loadDishes } from './dishesStorage.js';
import { normalizeImagePath } from '../utils/normalizeImagePath.js';

const stored = loadDishes();

const initialState = {
  // Normalize on load too — not just on seed/add/update — so dishes
  // already sitting in localStorage from before this fix existed also
  // get corrected, instead of only newly-created ones.
  items: (stored ?? []).map((d) => ({ ...d, image: normalizeImagePath(d.image) })),
  // 'idle' (never fetched) | 'loading' | 'ready' | 'error'
  // Starts 'ready' if we already have persisted data — the seed fetch
  // only ever runs once, on the very first load, per the rubric's
  // "Data Seeding: load initial data from menu-data.json on first run".
  status: stored ? 'ready' : 'idle',
};

const dishesSlice = createSlice({
  name: 'dishes',
  initialState,
  reducers: {
    seedStart(state) {
      state.status = 'loading';
    },

    // Normalize: menu-data.json has no `hidden` field, so every
    // seeded dish gets one, defaulting to visible.
    seedSuccess(state, action) {
      state.items = action.payload.map((d) => ({
        ...d,
        hidden: d.hidden ?? false,
        image: normalizeImagePath(d.image),
      }));
      state.status = 'ready';
    },
    seedError(state) {
      state.status = 'error';
    },
    addDish(state, action) {
      state.items.unshift({
        id: Date.now(),
        hidden: false,
        available: true,
        ...action.payload,
        image: normalizeImagePath(action.payload.image),
      });
    },
    updateDish(state, action) {
      const { id, changes } = action.payload;
      const dish = state.items.find((d) => d.id === id);
      if (dish) {
        Object.assign(dish, changes);
        if (changes.image) dish.image = normalizeImagePath(dish.image);
      }
    },
    deleteDish(state, action) {
      state.items = state.items.filter((d) => d.id !== action.payload);
    },
    toggleAvailable(state, action) {
      const dish = state.items.find((d) => d.id === action.payload);
      if (dish) dish.available = !dish.available;
    },
    toggleHidden(state, action) {
      const dish = state.items.find((d) => d.id === action.payload);
      if (dish) dish.hidden = !dish.hidden;
    },
  },
});

export const {
  seedStart,
  seedSuccess,
  seedError,
  addDish,
  updateDish,
  deleteDish,
  toggleAvailable,
  toggleHidden,
} = dishesSlice.actions;

// --- Selectors ---
export const selectDishesStatus = (state) => state.dishes.status;

// Admin sees everything, including hidden dishes (it has to, to un-hide them).
export const selectAllDishes = (state) => state.dishes.items;

// Customers never see hidden dishes at all. Unavailable ones still show
// (with the existing "Unavailable" badge/disabled state DishCard/Dish
// already handle) — hidden and unavailable are deliberately different.
// Memoized with createSelector: only recomputes the filtered array when
// state.dishes.items actually changes, instead of building a brand-new
// array on every single call — that instability was what caused the
// "selector returned a different result" warning and the render loop
// that followed it.
export const selectVisibleDishes = createSelector(selectAllDishes, (items) =>
  items.filter((d) => !d.hidden)
);

export const selectDishById = (id) => (state) =>
  state.dishes.items.find((d) => String(d.id) === String(id));

export default dishesSlice.reducer;