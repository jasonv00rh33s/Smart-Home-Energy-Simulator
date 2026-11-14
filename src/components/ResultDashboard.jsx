import {
  calculateTotalLoad,
  calculateAutonomyHours,
  getSystemStatus,
  INVERTER_EFFICIENCY
} from '../utils/calculations';

function ResultDashboard({ user, station, chargePercent, appliances }) {
  const totalLoad = calculateTotalLoad(appliances);
  const autonomyHours = calculateAutonomyHours(
    station.capacity,
    chargePercent,
    totalLoad,
    station.maxPower
  );
  const status = getSystemStatus(totalLoad, station.maxPower);
  const loadPercentage = Math.min(Math.round((totalLoad / station.maxPower) * 100), 100);

  const statusConfig = {
    idle: {
      label: 'Режим очікування (навантаження відсутнє)',
      description: 'Увімкніть хоча б один прилад зі списку для розрахунку часу роботи.',
      className: 'status-idle'
    },
    normal: {
      label: 'Нормальний режим роботи',
      description: 'Навантаження в межах оптимального діапазону інвертора.',
      className: 'status-normal'
    },
    warning: {
      label: 'Високе навантаження (>80% потужності)',
      description: 'Станція працює на межі. Не вмикайте потужні нагрівальні прилади.',
      className: 'status-warning'
    },
    overload: {
      label: 'КРИТИЧНЕ ПЕРЕВАНТАЖЕННЯ!',
      description: `Сумарна потужність (${totalLoad} Вт) перевищує ліміт станції (${station.maxPower} Вт). Спрацює захист інвертора!`,
      className: 'status-overload'
    }
  };

  const formatTime = (hoursFloat) => {
    if (hoursFloat <= 0) return '0 год 0 хв';
    const h = Math.floor(hoursFloat);
    const m = Math.round((hoursFloat - h) * 60);
    return `${h} год ${m} хв`;
  };

  const handleExportReport = () => {
    const activeItems = appliances.filter((a) => a.isOn);
    const lines = [
      '=== ЗВІТ СИМУЛЯЦІЇ ЕНЕРГОСПОЖИВАННЯ ===',
      `Дата формування: ${new Date().toLocaleString('uk-UA')}`,
      `Користувач: ${user.name} (${user.role})`,
      '',
      '--- ПАРАМЕТРИ ДЖЕРЕЛА ЖИВЛЕННЯ ---',
      `Станція: ${station.name} (${station.batteryType})`,
      `Номінальна ємність: ${station.capacity} Вт*год`,
      `Поточний заряд: ${chargePercent}%`,
      `Максимальна потужність: ${station.maxPower} Вт`,
      `Врахований ККД інвертора: ${INVERTER_EFFICIENCY * 100}%`,
      '',
      '--- УВІМКНЕНІ ПРИЛАДИ ---',
      ...(activeItems.length > 0
        ? activeItems.map((item, idx) => `${idx + 1}. ${item.name} — ${item.power} Вт`)
        : ['Немає увімкнених приладів']),
      '',
      '--- РЕЗУЛЬТАТИ РОЗРАХУНКУ ---',
      `Сумарне навантаження: ${totalLoad} Вт`,
      `Статус системи: ${statusConfig[status].label}`,
      `Прогнозований час автономної роботи: ${status === 'overload' ? 'Неможливо (перевантаження)' : formatTime(autonomyHours)}`
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `energy-report-${station.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const activeAppliances = appliances
    .filter((item) => item.isOn)
    .sort((a, b) => b.power - a.power);

  return (
    <section className="card result-card">
      <h2>Результати симуляції та аналітика</h2>

      <div className={`status-banner ${statusConfig[status].className}`}>
        <strong>{statusConfig[status].label}</strong>
        <p>{statusConfig[status].description}</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-box">
          <span>Поточне споживання</span>
          <strong className={status === 'overload' ? 'text-danger' : ''}>
            {totalLoad} Вт <small>/ {station.maxPower} Вт</small>
          </strong>
          <div className="progress-track">
            <div
              className={`progress-fill ${statusConfig[status].className}`}
              style={{ width: `${loadPercentage}%` }}
            />
          </div>
        </div>

        <div className="metric-box">
          <span>Прогноз автономності (ККД 85%)</span>
          <strong>
            {status === 'overload' ? 'Перевантаження' : formatTime(autonomyHours)}
          </strong>
          <small>
            Доступна енергія: {Math.round(station.capacity * (chargePercent / 100) * INVERTER_EFFICIENCY)} Вт·год
          </small>
        </div>
      </div>

      <div className="breakdown-section">
        <h3>Структура споживання ({activeAppliances.length} активних)</h3>
        
        {activeAppliances.length === 0 ? (
          <p className="empty-breakdown">Усі прилади вимкнено. Перейдіть у вкладку «Прилади», щоб увімкнути техніку.</p>
        ) : (
          <div className="breakdown-list">
            {activeAppliances.map((item) => {
              const sharePercent = totalLoad > 0 ? Math.round((item.power / totalLoad) * 100) : 0;
              return (
                <div key={item.id} className="breakdown-item">
                  <div className="breakdown-info">
                    <span>{item.name}</span>
                    <strong>{item.power} Вт ({sharePercent}%)</strong>
                  </div>
                  <div className="mini-track">
                    <div
                      className="mini-fill"
                      style={{ width: `${sharePercent}%`, backgroundColor: station.accentColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button type="button" className="btn-export" onClick={handleExportReport}>
        Завантажити звіт симуляції (.txt)
      </button>
    </section>
  );
}

export default ResultDashboard;
