import { useState, useEffect } from 'react';
import { STATIONS, INITIAL_APPLIANCES } from './data/presets';
import AuthForm from './components/AuthForm';
import StationSettings from './components/StationSettings';
import ApplianceManager from './components/ApplianceManager';
import ResultDashboard from './components/ResultDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sim_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('simulator');

  const [selectedStation, setSelectedStation] = useState(STATIONS[0]);
  const [chargePercent, setChargePercent] = useState(100);

  const [appliances, setAppliances] = useState(() => {
    const saved = localStorage.getItem('sim_appliances');
    return saved ? JSON.parse(saved) : INITIAL_APPLIANCES;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('sim_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sim_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sim_appliances', JSON.stringify(appliances));
  }, [appliances]);

  const handleToggleAppliance = (id) => {
    setAppliances((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isOn: !item.isOn } : item))
    );
  };

  const handleAddAppliance = (newItem) => {
    setAppliances((prev) => [...prev, newItem]);
  };

  const handleDeleteAppliance = (id) => {
    setAppliances((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetAppliances = () => {
    setAppliances(INITIAL_APPLIANCES);
  };

  if (!user) {
    return <AuthForm onLogin={setUser} />;
  }

  const activeCount = appliances.filter((item) => item.isOn).length;

  return (
    <div className="app-wrapper">
      <header className="top-bar">
        <div className="brand-block">
          <h1>Energy Simulator</h1>
          <span className="user-info">
            {user.name} • {user.role}
          </span>
        </div>

        {/* Навігаційна панель */}
        <nav className="navbar">
          <button
            type="button"
            className={`nav-link ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            Симулятор
          </button>
          <button
            type="button"
            className={`nav-link ${activeTab === 'appliances' ? 'active' : ''}`}
            onClick={() => setActiveTab('appliances')}
          >
            Прилади ({activeCount})
          </button>
          <button
            type="button"
            className={`nav-link ${activeTab === 'guide' ? 'active' : ''}`}
            onClick={() => setActiveTab('guide')}
          >
            Інструкція
          </button>
        </nav>

        <button type="button" className="btn-logout" onClick={() => setUser(null)}>
          Вийти
        </button>
      </header>

      {/* Сторінка 1: Головний симулятор */}
      {activeTab === 'simulator' && (
        <main className="dashboard-grid animate-switch">
          <StationSettings
            stations={STATIONS}
            selectedStation={selectedStation}
            onSelectStation={setSelectedStation}
            chargePercent={chargePercent}
            onChangeCharge={setChargePercent}
          />
          <ResultDashboard
            user={user}
            station={selectedStation}
            chargePercent={chargePercent}
            appliances={appliances}
          />
        </main>
      )}

      {/* Сторінка 2: Керування споживачами */}
      {activeTab === 'appliances' && (
        <main className="single-column animate-switch">
          <ApplianceManager
            appliances={appliances}
            onToggle={handleToggleAppliance}
            onAdd={handleAddAppliance}
            onDelete={handleDeleteAppliance}
            onReset={handleResetAppliances}
          />
        </main>
      )}

      {/* Сторінка 3: Довідник користувача */}
      {activeTab === 'guide' && (
        <main className="single-column animate-switch">
          <section className="card">
            <h2>Керівництво користувача</h2>
            <p className="section-hint">
              Як користуватися системою моделювання автономності:
            </p>
            <div className="guide-steps">
              <div className="spec-box">
                <strong>Крок 1. Налаштування станції</strong>
                <span>На вкладці «Симулятор» оберіть модель зарядної станції та вкажіть поточний заряд батареї.</span>
              </div>
              <div className="spec-box">
                <strong>Крок 2. Вибір споживачів</strong>
                <span>Перейдіть на вкладку «Прилади», увімкніть потрібну техніку або додайте власний пристрій.</span>
              </div>
              <div className="spec-box">
                <strong>Крок 3. Аналіз та експорт</strong>
                <span>Поверніться у «Симулятор», перевірте статус навантаження та завантажте текстовий звіт (.txt).</span>
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default App;