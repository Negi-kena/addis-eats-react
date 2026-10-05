/**
 * Order IDs in the design follow "#AE-2048" style. Generated from the
 * current order count so it's deterministic and collision-free for a
 * single-session class demo — a real backend would issue this instead.
 */
export function generateOrderId(existingCount) {
  return `AE-${2048 + existingCount}`;
}