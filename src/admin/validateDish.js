export function validateDish({ name, description, category, price, image }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Enter a dish name.';
  if (!description || description.trim().length < 10) {
    errors.description = 'Add a short description (10+ characters).';
  }
  if (!category) errors.category = 'Select a category.';
  if (!price || Number(price) <= 0) errors.price = 'Enter a price greater than 0.';
  if (!image || !image.trim()) errors.image = 'Enter an image path.';
  return errors;
}