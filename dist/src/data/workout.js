import { CATALOG, BY_ID } from './catalog.js';

export function belongsTo(exercise, muscle) {
  return (exercise.muscles || [exercise.muscle]).includes(muscle);
}

export function createExercise(id, muscle = BY_ID[id]?.muscle) {
  const item = BY_ID[id];
  if (!item || !belongsTo(item, muscle)) throw new Error('Exercício ou grupo inválido.');
  const large = ['Peito', 'Costas', 'Pernas'].includes(muscle);
  return { id, muscle, sets: item.kind === 'cardio' ? '' : '3', targetReps: item.kind === 'cardio' ? '' : large ? '8–12' : '10–15', weight: '', rest: large ? '90' : '60', note: '', done: false, duration: '', distance: '', intensity: '' };
}

export function reserveGroups(day, count = 3) {
  const selected = new Set(day.exercises.map(e => e.id));
  return day.muscles.map(muscle => ({
    muscle,
    exercises: CATALOG.filter(x => belongsTo(x, muscle) && !selected.has(x.id)).slice(0, count)
  }));
}

export function replacementTargets(day, reserveId, muscle) {
  const reserve = BY_ID[reserveId];
  if (!reserve || !belongsTo(reserve, muscle) || day.exercises.some(e => e.id === reserveId)) return [];
  return day.exercises.filter(e => !e.done && e.muscle === muscle);
}

export function replaceExercise(day, oldId, newId, muscle) {
  const old = replacementTargets(day, newId, muscle).find(e => e.id === oldId);
  if (!old) throw new Error('Escolha um exercício não concluído do mesmo grupo.');
  const next = createExercise(newId, muscle);
  // Preserve the plan, but never reuse load, completion or notes from a different exercise.
  for (const key of ['sets', 'targetReps', 'rest', 'duration']) next[key] = old[key] ?? next[key];
  day.exercises.splice(day.exercises.indexOf(old), 1, next);
  return next;
}
