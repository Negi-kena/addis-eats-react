import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { addDish, updateDish } from './dishesSlice.js';
import { validateDish } from './validateDish.js';
import './DishForm.css';
import { normalizeImagePath } from '../utils/normalizeImagePath.js';

const CATEGORIES = ['ethiopian', 'pizza', 'burgers', 'drinks'];

function DishForm({ dish, onClose }) {
  const dispatch = useDispatch();
  const isEditing = Boolean(dish);

  const [name, setName] = useState(dish?.name ?? '');
  const [description, setDescription] = useState(dish?.description ?? '');
  const [category, setCategory] = useState(dish?.category ?? CATEGORIES[0]);
  const [price, setPrice] = useState(dish?.price ?? '');
  const [image, setImage] = useState(dish?.image ?? '');
  const [ingredientsText, setIngredientsText] = useState((dish?.ingredients ?? []).join(', '));
  const [available, setAvailable] = useState(dish?.available ?? true);
  const [errors, setErrors] = useState({});

  function handleFileChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => setImage(reader.result); // becomes a data: URL
  reader.readAsDataURL(file);
}

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validateDish({ name, description, category, price, image });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      name: name.trim(),
      description: description.trim(),
      category,
      price: Number(price),
      image: image.trim(),
      ingredients: ingredientsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      available,
    };

    if (isEditing) {
      dispatch(updateDish({ id: dish.id, changes: payload }));
    } else {
      dispatch(addDish(payload));
    }
    onClose();
  }

  return (
    <div className="dish-form__overlay" onClick={onClose}>
      <div className="dish-form__panel card" onClick={(e) => e.stopPropagation()}>
        <div className="dish-form__header">
          <h2>{isEditing ? 'Edit dish' : 'Add new dish'}</h2>
          <button type="button" className="dish-form__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="dish-form__body">
          <label htmlFor="dish-name">Name</label>
          <input id="dish-name" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <span className="dish-form__error">{errors.name}</span>}

          <label htmlFor="dish-description">Description</label>
          <textarea
            id="dish-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What makes this dish worth ordering..."
          />
          {errors.description && <span className="dish-form__error">{errors.description}</span>}

          <div className="dish-form__row">
            <div className="dish-form__field">
              <label htmlFor="dish-category">Category</label>
              <select id="dish-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="dish-form__field">
              <label htmlFor="dish-price">Price (ETB)</label>
              <input
                id="dish-price"
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {errors.price && <span className="dish-form__error">{errors.price}</span>}
            </div>
          </div>

                   <label htmlFor="dish-image-upload">Photo</label>
          <div className="dish-form__image-row">
            {image && (
              <img
                src={normalizeImagePath(image)}
                alt=""
                className="dish-form__image-preview"
              />
            )}
            <div className="dish-form__image-inputs">
              <input
                id="dish-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <span className="dish-form__image-or">or enter a path</span>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="images/your-dish.png"
              />
            </div>
          </div>
          <p className="dish-form__hint">
            Uploaded photos are stored in this browser only — no server here to sync them
            elsewhere. Use a path instead if the file already exists in your project's
            public/images folder.
          </p>
          {errors.image && <span className="dish-form__error">{errors.image}</span>}

          <label htmlFor="dish-ingredients">Ingredients (comma-separated)</label>
          <input
            id="dish-ingredients"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="Chicken, Berbere, Onions..."
          />

          <label className="dish-form__checkbox">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            Available to order
          </label>

          <div className="dish-form__actions">
            <button type="button" className="dish-form__cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEditing ? 'Save changes' : 'Add dish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DishForm;