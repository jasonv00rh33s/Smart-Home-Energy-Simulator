import { useState } from 'react';
import { validateApplianceInput } from '../utils/calculations';

function ApplianceManager({ appliances, onToggle, onAdd, onDelete, onReset }) {
  const [name, setName] = useState('');
  const [power, setPower] = useState('');
  const [category, setCategory] = useState('Побут');
  const [filterOnlyOn, setFilterOnlyOn] = useState(false);
  const [formError, setFormError] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    const validation = validateApplianceInput(name, power);
    if (!validation.valid) {
      setFormError(validation.error);
      return;
    }

    onAdd({
      id: Date.now(),
      name: validation.cleanName,
      power: validation.numericPower,
      category,
      isOn: true
    });

    setName('');
    setPower('');
    setFormError('');
  };

  const visibleAppliances = filterOnlyOn
    ? appliances.filter((item) => item.isOn)
    : appliances;

  return (
    <section className="card">
      <div className="card-top-row">
        <h2>Прилади</h2>
        <div className="filter-actions">
          <button
            type="button"
            className={`btn-small ${filterOnlyOn ? 'active' : ''}`}
            onClick={() => setFilterOnlyOn(!filterOnlyOn)}
          >
            {filterOnlyOn ? 'Показати всі' : 'Тільки увімкнені'}
          </button>
          <button type="button" className="btn-small btn-ghost" onClick={onReset}>
            Скинути
          </button>
        </div>
      </div>

      <div className="appliance-list">
        {visibleAppliances.length === 0 ? (
          <p className="empty-text">Немає приладів для відображення за обраним фільтром.</p>
        ) : (
          visibleAppliances.map((item) => (
            <div key={item.id} className={`appliance-item ${item.isOn ? 'is-on' : ''}`}>
              <div className="appliance-meta">
                <span className="appliance-title">{item.name}</span>
                <span className="appliance-sub">
                  {item.category} • <strong>{item.power} Вт</strong>
                </span>
              </div>

              <div className="appliance-controls">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={item.isOn}
                    onChange={() => onToggle(item.id)}
                  />
                  <span className="slider"></span>
                </label>
                <button
                  type="button"
                  className="btn-delete"
                  title="Видалити прилад"
                  onClick={() => onDelete(item.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleCreate} className="add-form">
        <h3>Додати власний прилад</h3>
        <div className="add-form-grid">
          <input
            type="text"
            placeholder="Назва (напр. Монітор)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Потужність (Вт)"
            value={power}
            onChange={(e) => setPower(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Робота">Робота</option>
            <option value="Кухня">Кухня</option>
            <option value="Освітлення">Освітлення</option>
            <option value="Побут">Побут</option>
          </select>
          <button type="submit" className="btn-primary">
            + Додати
          </button>
        </div>
        {formError && <p className="error-text">{formError}</p>}
      </form>
    </section>
  );
}

export default ApplianceManager;
