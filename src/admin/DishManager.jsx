import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { selectAllDishes, deleteDish, toggleAvailable, toggleHidden } from './dishesSlice.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import DishForm from './DishForm.jsx';
import './DishManager.css';

function DishManager() {
  const dispatch = useDispatch();
  const dishes = useSelector(selectAllDishes);
  const [search, setSearch] = useState('');
  const [editingDish, setEditingDish] = useState(null); // null = closed, {} = adding, dish = editing
  const [showFormFor, setShowFormFor] = useState(null); // mirrors editingDish, drives the modal

  const filteredDishes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return dishes;
    return dishes.filter(
      (d) => d.name.toLowerCase().includes(term) || d.category.toLowerCase().includes(term)
    );
  }, [dishes, search]);

  function openAddForm() {
    setEditingDish(null);
    setShowFormFor('new');
  }

  function openEditForm(dish) {
    setEditingDish(dish);
    setShowFormFor(dish.id);
  }

  function closeForm() {
    setEditingDish(null);
    setShowFormFor(null);
  }

  function handleDelete(dish) {
    const confirmed = window.confirm(`Delete "${dish.name}"? This can't be undone.`);
    if (confirmed) dispatch(deleteDish(dish.id));
  }

  return (
    <div className="dish-manager">
      <div className="dish-manager__toolbar">
        <div className="dish-manager__search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes by name or category..."
            aria-label="Search dishes"
          />
        </div>
        <button type="button" className="btn-primary dish-manager__add-btn" onClick={openAddForm}>
          <Plus size={16} />
          Add dish
        </button>
      </div>

      <p className="dish-manager__count">
        {filteredDishes.length} of {dishes.length} dishes
      </p>

      <ul className="dish-manager__list">
        {filteredDishes.map((dish) => (
          <li key={dish.id} className={`dish-row card${dish.hidden ? ' dish-row--hidden' : ''}`}>
            <img src={dish.image} alt={dish.name} className="dish-row__image" />

            <div className="dish-row__info">
              <span className="dish-row__name">{dish.name}</span>
              <span className="dish-row__meta">
                <span className="dish-row__description">{dish.description}</span>
                {dish.category} · {formatCurrency(dish.price)}
              </span>
              <div className="dish-row__badges">
                {dish.hidden && <span className="dish-row__badge dish-row__badge--hidden">Hidden</span>}
                {dish.available === false && (
                  <span className="dish-row__badge dish-row__badge--unavailable">Unavailable</span>
                )}
              </div>
            </div>

            <div className="dish-row__actions">
              <button
                type="button"
                className="dish-row__toggle"
                onClick={() => dispatch(toggleAvailable(dish.id))}
                title={dish.available === false ? 'Mark available' : 'Mark unavailable'}
              >
                {dish.available === false ? 'Unavailable' : 'Available'}
              </button>

              <button
                type="button"
                className="dish-row__icon-btn"
                onClick={() => dispatch(toggleHidden(dish.id))}
                title={dish.hidden ? 'Show to customers' : 'Hide from customers'}
              >
                {dish.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>

              <button
                type="button"
                className="dish-row__icon-btn"
                onClick={() => openEditForm(dish)}
                title="Edit"
              >
                <Pencil size={16} />
              </button>

              <button
                type="button"
                className="dish-row__icon-btn dish-row__icon-btn--danger"
                onClick={() => handleDelete(dish)}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showFormFor && <DishForm dish={editingDish} onClose={closeForm} />}
    </div>
  );
}

export default DishManager;