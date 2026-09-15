import { defaultState, validateState, STORAGE_KEY } from '../data/state.js';

const DB_NAME = 'meu-treino';
const STORE = 'workout';
const RECORD = 'current';
let db;
let pending;
let saving = false;
let timer;
export let storageStatus = 'Conectando ao banco do navegador…';

function status(message) {
  storageStatus = message;
  window.dispatchEvent(new CustomEvent('storage-status', { detail: message }));
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => database.close();
      resolve(database);
    };
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Feche outras abas para atualizar o banco.'));
  });
}

function readDB() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).get(RECORD);
    tx.oncomplete = () => resolve(request.result);
    tx.onabort = () => reject(tx.error);
    tx.onerror = () => reject(tx.error);
  });
}

function writeDB(snapshot) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(snapshot, RECORD);
    tx.oncomplete = resolve;
    tx.onabort = () => reject(tx.error);
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadState() {
  let raw;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch { /* IndexedDB may still work. */ }
  let cached;
  if (raw) {
    try { cached = validateState(JSON.parse(raw)); }
    catch { status('Backup local inválido. O conteúdo original foi preservado.'); }
  }
  try {
    db = await openDB();
    const stored = await readDB();
    // localStorage is the synchronous journal, including unsaved changes after a tab closes.
    const persisted = stored ? validateState(stored) : undefined;
    const state = cached && (!persisted || (cached.savedAt || 0) >= (persisted.savedAt || 0))
      ? cached : persisted || defaultState();
    await writeDB(state);
    status('Salvo neste navegador · IndexedDB');
    return state;
  } catch {
    status('IndexedDB indisponível · cópia no navegador');
    return cached || defaultState();
  }
}

export function persistState(state) {
  state.savedAt = Date.now();
  pending = structuredClone(state);
  let journalSaved = false;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pending)); journalSaved = true; } catch { /* DB write below reports failure. */ }
  status(journalSaved ? 'Salvo no navegador · sincronizando IndexedDB…' : 'Salvando no navegador…');
  clearTimeout(timer);
  timer = setTimeout(flushState, 100);
}

export async function flushState() {
  if (saving || !pending) return;
  saving = true;
  while (pending) {
    const snapshot = pending;
    pending = undefined;
    try {
      db ||= await openDB();
      await writeDB(snapshot);
      status('Salvo neste navegador · IndexedDB');
    } catch {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
        status('Salvo neste navegador · localStorage');
      } catch {
        status('Falha ao salvar · exporte um backup agora');
      }
    }
  }
  saving = false;
}

document.addEventListener('visibilitychange', () => { if (document.hidden) flushState(); });
