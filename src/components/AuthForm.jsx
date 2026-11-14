import { useState } from 'react';

function AuthForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Власник будинку');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed.length < 2 || trimmed.length > 30) {
      setError('Введіть імʼя користувача (від 2 до 30 символів).');
      return;
    }
    if (/[<>]/.test(trimmed)) {
      setError('Недопустимі символи у полі імені.');
      return;
    }
    setError('');
    onLogin({ name: trimmed, role });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Smart Home Energy Simulator</h1>
        <p className="auth-subtitle">
          Система моделювання енергоспоживання та розрахунку автономності резервного живлення
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="username">Імʼя користувача:</label>
          <input
            id="username"
            type="text"
            placeholder="Наприклад: Василь"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="role">Обʼєкт:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Власник квартири">Квартира</option>
            <option value="Приватний будинок">Приватний будинок</option>
            <option value="Домашній офіс">Домашній офіс</option>
          </select>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary">
            Увійти до панелі керування
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;
