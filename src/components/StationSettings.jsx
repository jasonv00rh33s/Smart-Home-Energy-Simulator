function StationSettings({ stations, selectedStation, onSelectStation, chargePercent, onChangeCharge }) {
  return (
    <section className="card">
      <h2>Джерело резервного живлення</h2>
      <p className="section-hint">Оберіть модель зарядної станції та вкажіть поточний рівень заряду:</p>

      <div className="station-tabs">
        {stations.map((station) => (
          <button
            key={station.id}
            type="button"
            className={`station-tab ${selectedStation.id === station.id ? 'active' : ''}`}
            onClick={() => onSelectStation(station)}
          >
            {station.name}
          </button>
        ))}
      </div>

      <div
        key={selectedStation.id}
        className="station-preview animate-switch"
        style={{ borderColor: selectedStation.accentColor }}
      >

        <div className="station-visual">
          <img
            src={selectedStation.image}
            alt={selectedStation.name}
            className="station-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        <div className="station-header">
          <div>
            <h3>{selectedStation.name}</h3>
            <span className="station-tag" style={{ backgroundColor: selectedStation.accentColor }}>
              {selectedStation.badge}
            </span>
          </div>
          <div className="station-battery-type">{selectedStation.batteryType}</div>
        </div>


        <div className="station-specs">
          <div className="spec-box">
            <span>Номінальна ємність</span>
            <strong>{selectedStation.capacity} Вт·год</strong>
          </div>
          <div className="spec-box">
            <span>Макс. вихідна потужність</span>
            <strong>{selectedStation.maxPower} Вт</strong>
          </div>
        </div>
      </div>

      <div className="charge-control">
        <div className="charge-label">
          <span>Поточний рівень заряду акумулятора:</span>
          <strong>{chargePercent}% ({Math.round(selectedStation.capacity * (chargePercent / 100))} Вт·год)</strong>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={chargePercent}
          onChange={(e) => onChangeCharge(Number(e.target.value))}
          className="range-slider"
          style={{ accentColor: selectedStation.accentColor }}
        />
      </div>
    </section>
  );
}

export default StationSettings;
