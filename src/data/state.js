import { BY_ID, MUSCLES } from './catalog.js';

export const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
export const STORAGE_KEY = 'meuTreino.v5.state';
const normalizeLabel = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const dayNames = Object.fromEntries(DAYS.map(day => [normalizeLabel(day), day]));
const muscleNames = Object.fromEntries(MUSCLES.map(muscle => [normalizeLabel(muscle), muscle]));

export function defaultState() {
  return { version: 1, days: Object.fromEntries(DAYS.map(day => [day, { muscles: [], exercises: [] }])), history: [] };
}

export function validateState(value) {
  if (!value || typeof value !== 'object' || !value.days || typeof value.days !== 'object') throw new Error('Ficha inválida.');
  const result = defaultState();
  if (Number.isFinite(value.savedAt)) result.savedAt = value.savedAt;
  const inputDays = Object.entries(value.days).reduce((days, [name, entry]) => {
    const day = dayNames[normalizeLabel(name)];
    if (day && !days[day]) days[day] = entry;
    return days;
  }, {});
  for (const day of DAYS) {
    const entry = inputDays[day];
    if (!entry) continue;
    if (!Array.isArray(entry.muscles) || !Array.isArray(entry.exercises)) throw new Error('Dia inválido: ' + day);
    if (entry.exercises.length > 500) throw new Error('Excesso de exercícios.');
    const ids = new Set();
    result.days[day].muscles = [...new Set(entry.muscles.map(muscle => muscleNames[normalizeLabel(muscle)]).filter(Boolean))];
    result.days[day].exercises = entry.exercises.map(exercise => {
      if (!exercise || !Object.hasOwn(BY_ID, exercise.id)) throw new Error('Exercício desconhecido no backup.');
      if (ids.has(exercise.id)) throw new Error('Exercício duplicado no mesmo dia.');
      ids.add(exercise.id);
      const item = BY_ID[exercise.id];
      const requestedMuscle = muscleNames[normalizeLabel(exercise.muscle)];
      const muscle = (item.muscles || [item.muscle]).includes(requestedMuscle) ? requestedMuscle : item.muscle;
      if (!result.days[day].muscles.includes(muscle)) result.days[day].muscles.push(muscle);
      const out = { id: exercise.id, muscle, done: !!exercise.done };
      for (const key of ['sets', 'targetReps', 'weight', 'actualReps', 'rest', 'note', 'duration', 'distance', 'intensity']) {
        out[key] = String(exercise[key] ?? '').slice(0, key === 'note' ? 2000 : 100);
      }
      if (exercise.completedAt && Number.isFinite(Date.parse(exercise.completedAt))) out.completedAt = exercise.completedAt;
      return out;
    });
  }
  if (value.history !== undefined && !Array.isArray(value.history)) throw new Error('Histórico inválido.');
  result.history = (value.history || []).map(record => {
    const day = dayNames[normalizeLabel(record?.day)];
    if (!record || !Object.hasOwn(BY_ID, record.id) || !day || !Number.isFinite(Date.parse(record.completedAt))) throw new Error('Registro de histórico inválido.');
    const out = { id: record.id, day, completedAt: record.completedAt };
    for (const key of ['sets', 'targetReps', 'weight', 'actualReps', 'rest', 'note', 'duration', 'distance', 'intensity']) out[key] = String(record[key] ?? '').slice(0, key === 'note' ? 2000 : 100);
    return out;
  });
  return result;
}
