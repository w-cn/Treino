import { BY_ID, MUSCLES } from './catalog.js';

export const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
export const STORAGE_KEY = 'meuTreino.v5.state';

export function defaultState() {
  return { version: 1, days: Object.fromEntries(DAYS.map(day => [day, { muscles: [], exercises: [] }])), history: [] };
}

export function validateState(value) {
  if (!value || typeof value !== 'object' || !value.days || typeof value.days !== 'object') throw new Error('Ficha inválida.');
  const result = defaultState();
  if (Number.isFinite(value.savedAt)) result.savedAt = value.savedAt;
  for (const day of DAYS) {
    const entry = value.days[day];
    if (!entry) continue;
    if (!Array.isArray(entry.muscles) || !Array.isArray(entry.exercises)) throw new Error('Dia inválido: ' + day);
    if (entry.exercises.length > 500) throw new Error('Excesso de exercícios.');
    const ids = new Set();
    result.days[day].muscles = [...new Set(entry.muscles.filter(m => MUSCLES.includes(m)))];
    result.days[day].exercises = entry.exercises.map(exercise => {
      if (!exercise || !Object.hasOwn(BY_ID, exercise.id)) throw new Error('Exercício desconhecido no backup.');
      if (ids.has(exercise.id)) throw new Error('Exercício duplicado no mesmo dia.');
      ids.add(exercise.id);
      const item = BY_ID[exercise.id];
      const muscle = (item.muscles || [item.muscle]).includes(exercise.muscle) ? exercise.muscle : item.muscle;
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
    if (!record || !Object.hasOwn(BY_ID, record.id) || !DAYS.includes(record.day) || !Number.isFinite(Date.parse(record.completedAt))) throw new Error('Registro de histórico inválido.');
    const out = { id: record.id, day: record.day, completedAt: record.completedAt };
    for (const key of ['sets', 'targetReps', 'weight', 'actualReps', 'rest', 'note', 'duration', 'distance', 'intensity']) out[key] = String(record[key] ?? '').slice(0, key === 'note' ? 2000 : 100);
    return out;
  });
  return result;
}
