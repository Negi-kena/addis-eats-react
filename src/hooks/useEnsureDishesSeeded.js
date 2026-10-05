import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDishes } from '../api/dishes.js';
import { seedStart, seedSuccess, seedError, selectDishesStatus } from '../admin/dishesSlice.js';

/**
 * Call once, high in the tree (App.jsx). Runs the seed fetch only if
 * status is still 'idle' — meaning no persisted dishes exist yet.
 * Every screen that needs dish data just reads the store; only this
 * hook ever touches the network for it.
 */
export function useEnsureDishesSeeded() {
  const dispatch = useDispatch();
  const status = useSelector(selectDishesStatus);

  useEffect(() => {
    if (status !== 'idle') return;
    dispatch(seedStart());
    fetchDishes()
      .then((data) => dispatch(seedSuccess(data)))
      .catch(() => dispatch(seedError()));
  }, [status, dispatch]);
}