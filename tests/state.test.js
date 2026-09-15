import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOG, BY_ID } from '../src/data/catalog.js';
import { defaultState, validateState } from '../src/data/state.js';
import { createAppServer } from '../server/dev.mjs';
import { MEDIA_OVERRIDES } from '../src/data/media-overrides.js';

test('catálogo preserva IDs únicos e referências válidas', () => {
  assert.equal(Object.keys(BY_ID).length, CATALOG.length);
  assert.ok(CATALOG.length >= 100);
  for (const exercise of CATALOG) assert.ok(['www.hipertrofia.org','github.com'].includes(new URL(exercise.source).hostname));
});
test('todo exercício tem demonstração e as novas mídias registram a fonte', () => {
  for (const exercise of CATALOG) assert.ok(exercise.gif, exercise.name);
  assert.equal(Object.keys(MEDIA_OVERRIDES).length, 54);
  for (const [id, media] of Object.entries(MEDIA_OVERRIDES)) {
    assert.ok(Object.hasOwn(BY_ID, id));
    assert.equal(new URL(media.mediaSource).protocol, 'https:');
    assert.match(media.gif, /\.gif$/);
  }
  assert.match(CATALOG.find(x => x.name === 'Prancha abdominal').mediaSource, /fitnessprogramer/);
});
test('migra ficha v5 e inclui músculo de exercício adicionado pela biblioteca', () => {
  const state = defaultState();
  delete state.history;
  state.days.Segunda.exercises.push({ id: CATALOG[0].id, weight: '22.5', sets: '4' });
  const result = validateState(state);
  assert.deepEqual(result.days.Segunda.muscles, [CATALOG[0].muscle]);
  assert.equal(result.days.Segunda.exercises[0].weight, '22.5');
  assert.deepEqual(result.history, []);
});
test('rejeita backup inválido sem alterar a ficha original', () => {
  const state = defaultState();
  state.days.Terça.exercises.push({ id: 'invalid' });
  assert.throws(() => validateState(state), /desconhecido/);
  assert.equal(state.days.Terça.exercises[0].id, 'invalid');
  assert.throws(() => validateState({ days: { Segunda: {} } }), /inválido/);
  state.days.Terça.exercises[0].id = '__proto__';
  assert.throws(() => validateState(state), /desconhecido/);
});
test('histórico sobrevive à exportação e importação', () => {
  const state = defaultState();
  state.history.push({ day: 'Terça', id: CATALOG[0].id, weight: '30', actualReps: '12', completedAt: new Date().toISOString() });
  const result = validateState(JSON.parse(JSON.stringify(state)));
  assert.equal(result.history[0].weight, '30');
  assert.equal(result.history[0].actualReps, '12');
});
test('servidor entrega módulos e não expõe arquivos internos', async () => {
  const server = createAppServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    const html = await fetch(base);
    assert.equal(html.status, 200);
    assert.match(await html.text(), /type="module"/);
    const js = await fetch(base + '/src/app.js');
    assert.match(js.headers.get('content-type'), /javascript/);
    for (const path of ['/package.json', '/server/dev.mjs', '/.git/config', '/src/%2e%2e/server/dev.mjs']) assert.equal((await fetch(base + path)).status, 404);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
