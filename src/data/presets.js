export const STATIONS = [
  {
    id: 'ecoflow-delta-2',
    name: 'EcoFlow DELTA 2',
    capacity: 1024, // Вт·год
    maxPower: 1800, // Вт
    batteryType: 'LiFePO4',
    accentColor: '#10b981',
    badge: 'Оптимальний для квартири',
    image: '/images/ecoflow.png'
  },
  {
    id: 'bluetti-ac200p',
    name: 'Bluetti AC200P',
    capacity: 2000,
    maxPower: 2000,
    batteryType: 'LiFePO4',
    accentColor: '#3b82f6',
    badge: 'Висока автономність',
    image: '/images/bluetti.png'
  },
  {
    id: 'jackery-500',
    name: 'Jackery Explorer 500',
    capacity: 518,
    maxPower: 500,
    batteryType: 'Li-Ion',
    accentColor: '#f59e0b',
    badge: 'Компактний для базових задач',
    image: '/images/jackery.png'
  }
];

export const INITIAL_APPLIANCES = [
  { id: 1, name: 'Wi-Fi роутер та термінал GPON', power: 18, category: 'Звʼязок', isOn: true },
  { id: 2, name: 'Ноутбук (робочий режим)', power: 65, category: 'Робота', isOn: true },
  { id: 3, name: 'LED-освітлення (2 кімнати)', power: 30, category: 'Освітлення', isOn: true },
  { id: 4, name: 'Холодильник', power: 140, category: 'Кухня', isOn: false },
  { id: 5, name: 'Газовий котел', power: 110, category: 'Опалення', isOn: false },
  { id: 6, name: 'Електрочайник', power: 2000, category: 'Кухня', isOn: false }
];
