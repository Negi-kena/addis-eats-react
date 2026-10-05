import { createSlice } from '@reduxjs/toolkit';
import { loadFavoriteIds } from './favoritesStorage.js';

// Per the rubric's state table: store just the dish IDs, not full dish
// objects — DishCard hearts and this list both already have (or can
// fetch) the full dish data; duplicating it here would risk it going stale.
const initialState = {
  ids: loadFavoriteIds(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action) {
      const id = action.payload;
      state.ids = state.ids.includes(id)
        ? state.ids.filter((existingId) => existingId !== id)
        : [...state.ids, id];
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;

export const selectFavoriteIds = (state) => state.favorites.ids;
export const selectIsFavorite = (id) => (state) => state.favorites.ids.includes(id);
export const selectFavoriteCount = (state) => state.favorites.ids.length;

export default favoritesSlice.reducer;
