import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOG, BY_ID } from '../src/data/catalog.js';
import { createExercise, reserveGroups, replaceExercise } from '../src/data/workout.js';
import { defaultState, validateState } from '../src/data/state.js';

const id = name => CATALOG.find(x => x.name === name).id;
test('reservas oferecem três opções de cada grupo sem o antigo limite total de seis', () => {
  const day = { muscles: ['Peito','Bíceps','Costas','Glúteos'], exercises: ['Supino reto','Rosca concentrada','Remada baixa','Passada'].map(name=>createExercise(id(name))) };
  const groups = reserveGroups(day);
  assert.equal(groups.length, 4);
  for(const group of groups){
    assert.equal(group.exercises.length, 3, group.muscle);
    assert.ok(group.exercises.every(x => !day.exercises.some(e => e.id === x.id)));
  }
});
test('troca mantém posição e plano, limpa carga e deixa o original disponível como reserva', () => {
  const original = {...createExercise(id('Supino reto')),sets:'4',targetReps:'12',weight:'80',note:'Nota do supino'};
  const day = {muscles:['Peito'],exercises:[original,createExercise(id('Crucifixo'))]};
  replaceExercise(day, original.id, id('Supino inclinado'), 'Peito');
  assert.equal(day.exercises.length,2);
  assert.equal(day.exercises[0].id,id('Supino inclinado'));
  assert.equal(day.exercises[0].sets,'4');
  assert.equal(day.exercises[0].targetReps,'12');
  assert.equal(day.exercises[0].weight,'');
  assert.equal(day.exercises[0].note,'');
  assert.ok(reserveGroups(day)[0].exercises.some(x=>x.id===original.id));
});
test('troca recusa duplicação, outro músculo e exercício concluído', () => {
  const original=createExercise(id('Supino reto'));
  const day={muscles:['Peito'],exercises:[original,createExercise(id('Crucifixo'))]};
  assert.throws(()=>replaceExercise(day,original.id,id('Crucifixo'),'Peito'));
  assert.throws(()=>replaceExercise(day,original.id,id('Rosca concentrada'),'Peito'));
  original.done=true;
  assert.throws(()=>replaceExercise(day,original.id,id('Supino inclinado'),'Peito'));
  assert.equal(day.exercises[0],original);
});
test('grupo compartilhado e dados de cardio sobrevivem ao backup', () => {
  const state=defaultState();
  state.days.Segunda.muscles=['Glúteos','Cardio'];
  state.days.Segunda.exercises=[createExercise(id('Agachamento livre'),'Glúteos'),{...createExercise(id('Bicicleta ergométrica')),duration:'20',distance:'5.5',intensity:'Nível 3'}];
  const restored=validateState(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.days.Segunda.exercises[0].muscle,'Glúteos');
  assert.equal(restored.days.Segunda.exercises[1].duration,'20');
  assert.equal(restored.days.Segunda.exercises[1].distance,'5.5');
  assert.equal(restored.days.Segunda.exercises[1].intensity,'Nível 3');
  assert.equal(CATALOG.filter(x=>x.kind==='cardio').length,6);
  assert.equal(BY_ID[id('Remada na máquina (articulada)')].gif,'https://c.tenor.com/ft6FHrqty-8AAAAd/tenor.gif');
});
