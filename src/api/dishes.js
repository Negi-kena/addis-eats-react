const BASE_DELAY_MS = 500; // simulated network latency, so Loading states are actually visible

/**
 * Fetches the full dish list from the seed data.
 * Throws on network/parse failure so callers can drive Error states (feature 14).
 */
export async function fetchDishes() {
  await simulateDelay();

  let response;
  try {
    response = await fetch('/menu-data.json');
  } catch {
    throw new Error('Network error: could not reach the menu service.');
  }

  if (!response.ok) {
    throw new Error(`Failed to load menu (status ${response.status}).`);
  }

  return response.json();
}

/**
 * Fetches a single dish by id.
 * Reuses fetchDishes rather than a second network shape, since our
 * "API" is one static file — a real backend would have a /dishes/:id
 * endpoint instead, and only this function would change.
 */
export async function fetchDishById(id) {
  const dishes = await fetchDishes();
  const dish = dishes.find((d) => String(d.id) === String(id));

  if (!dish) {
    throw new Error(`Dish ${id} not found.`);
  }

  return dish;
}

function simulateDelay(ms = BASE_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}