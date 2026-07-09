import fs from 'node:fs/promises';
import { DIRS } from './paths.js';
import { withLock } from './lock.js';

const SQUADS_FILE = DIRS.squads;

let cache = null;

/**
 * Lista canônica de squads (docs/04-time/squads.json).
 * Usada pela API e para validar o campo `squad` nas histórias.
 */
export async function loadSquads() {
  if (cache) return cache;
  const raw = await fs.readFile(SQUADS_FILE, 'utf-8');
  const data = JSON.parse(raw);
  cache = data.squads || [];
  return cache;
}

export async function squadIds() {
  const squads = await loadSquads();
  return squads.map((s) => s.id);
}

export async function isValidSquad(id) {
  if (id === null || id === undefined || id === '') return true;
  const ids = await squadIds();
  return ids.includes(id);
}

export function clearSquadsCache() {
  cache = null;
}

/**
 * Lê squads.json FRESCO dentro de um lock, aplica `fn(squads)` (que devolve o
 * novo array) e grava, preservando outras chaves (ex.: `global`). Invalida o cache.
 */
export async function mutateSquads(fn) {
  return withLock(SQUADS_FILE, async () => {
    let raw = { squads: [] };
    try {
      raw = JSON.parse(await fs.readFile(SQUADS_FILE, 'utf-8'));
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    const nextSquads = await fn(raw.squads || []);
    const out = { ...raw, squads: nextSquads };
    await fs.writeFile(SQUADS_FILE, JSON.stringify(out, null, 2) + '\n', 'utf-8');
    clearSquadsCache();
    return out;
  });
}
