/**
 * Shared validation — used by both the inline sign-in gate (name + phone)
 * and the full Checkout form (name + phone + area). One set of rules,
 * not duplicated logic in two places.
 */
export function validateName(name) {
  return name.trim().length >= 2;
}

export function validatePhone(phone) {
  // Ethiopian mobile: 09XXXXXXXX / 07XXXXXXXX, or +2519XXXXXXXX / +2517XXXXXXXX
  const cleaned = phone.replace(/\s+/g, '');
  return /^(?:\+251|0)[97]\d{8}$/.test(cleaned);
}

export function validateArea(area) {
  return Boolean(area);
}

export function validateCheckoutForm({ name, phone, area }) {
  const errors = {};
  if (!validateName(name)) errors.name = 'Please enter your full name.';
  if (!validatePhone(phone)) errors.phone = 'Enter a valid Ethiopian phone number (e.g. 0910********).';
  if (!validateArea(area)) errors.area = 'Please select a delivery area.';
  return errors; // empty object = valid
}