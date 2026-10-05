/**
 * Formats a number as Ethiopian Birr, consistently across the app.
 * Feature 26 — every price on every screen goes through this,
 * never a raw template string like `${price} ETB`.
 */
export function formatCurrency(amount) {
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    return "— ETB";
  }

  return `${amount.toLocaleString("en-US")} ETB`;
}
