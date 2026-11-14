import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTotalLoad,
  calculateAutonomyHours,
  getSystemStatus,
  validateApplianceInput
} from './calculations.js';

test('Підрахунок сумарної потужності лише увімкнених приладів', () => {
  const list = [
    { id: 1, name: 'Роутер', power: 20, isOn: true },
    { id: 2, name: 'Чайник', power: 2000, isOn: false },
    { id: 3, name: 'Лампа', power: 30, isOn: true }
  ];
  assert.equal(calculateTotalLoad(list), 50);
});

test('Розрахунок автономності з урахуванням ККД 85%', () => {
  // 1000 Вт*год * 100% * 0.85 / 100 Вт = 8.5 год
  const hours = calculateAutonomyHours(1000, 100, 100, 1500);
  assert.equal(hours, 8.5);
});

test('Визначення станів навантаження для діаграми станів', () => {
  assert.equal(getSystemStatus(0, 1000), 'idle');
  assert.equal(getSystemStatus(500, 1000), 'normal');
  assert.equal(getSystemStatus(850, 1000), 'warning');
  assert.equal(getSystemStatus(1200, 1000), 'overload');
});

test('Валідація форми додавання приладу блокує некоректні дані', () => {
  assert.equal(validateApplianceInput('', 100).valid, false);
  assert.equal(validateApplianceInput('<script>alert(1)</script>', 100).valid, false);
  assert.equal(validateApplianceInput('Холодильник', -50).valid, false);
  assert.equal(validateApplianceInput('Телевізор', 120).valid, true);
});
