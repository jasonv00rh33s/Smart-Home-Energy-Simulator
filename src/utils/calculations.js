export const INVERTER_EFFICIENCY = 0.85;

/**
 * Розрахунок сумарного навантаження увімкнених приладів (Вт)
 */
export function calculateTotalLoad(appliances) {
  return appliances
    .filter((item) => item.isOn)
    .reduce((sum, item) => sum + Number(item.power), 0);
}

/**
 * Розрахунок часу автономної роботи (у годинах)
 */
export function calculateAutonomyHours(capacityWh, chargePercent, totalLoadWatts, maxPowerWatts) {
  if (totalLoadWatts <= 0 || totalLoadWatts > maxPowerWatts) {
    return 0;
  }
  const availableEnergy = capacityWh * (chargePercent / 100) * INVERTER_EFFICIENCY;
  return Number((availableEnergy / totalLoadWatts).toFixed(2));
}

/**
 * Визначення стану системи 
 * Можливі стани: 'idle' | 'normal' | 'warning' | 'overload'
 */
export function getSystemStatus(totalLoadWatts, maxPowerWatts) {
  if (totalLoadWatts === 0) return 'idle';
  const loadRatio = totalLoadWatts / maxPowerWatts;
  if (loadRatio > 1) return 'overload';
  if (loadRatio >= 0.8) return 'warning';
  return 'normal';
}

/**
 * Валідація введення нового приладу (захист від некоректних даних та XSS)
 */
export function validateApplianceInput(name, power) {
  const cleanName = String(name || '').trim();
  const numericPower = Number(power);

  if (cleanName.length < 2 || cleanName.length > 50) {
    return { valid: false, error: 'Назва приладу має містити від 2 до 50 символів.' };
  }
  if (/[<>]/.test(cleanName)) {
    return { valid: false, error: 'Назва містить недопустимі символи (< або >).' };
  }
  if (!Number.isFinite(numericPower) || numericPower < 1 || numericPower > 10000) {
    return { valid: false, error: 'Потужність має бути числом від 1 до 10 000 Вт.' };
  }
  return { valid: true, cleanName, numericPower: Math.round(numericPower) };
}
