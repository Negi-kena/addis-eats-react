const STORAGE_KEY = 'addisEats.adminDishes';

export function loadDishes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null; // null = never seeded yet
  } catch {
    return null;
  }
}

export function saveDishes(dishes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
  } catch {
    // storage unavailable — edits just won't persist across refresh
  }
}