const STORAGE_KEY = 'addisEats.cart';

/**
 * Thin persistence layer — cartSlice never touches localStorage directly.
 * Keeps the same separation of concerns as api/dishes.js: one file
 * owns "how we talk to this storage", everything else just calls it.
 */
export function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable (private browsing) — fail silently,
    // cart just won't persist across refresh, not worth crashing over.
  }
}