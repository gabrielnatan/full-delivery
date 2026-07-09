import fs from 'node:fs/promises';
import { DIRS } from './paths.js';
import { withLock } from './lock.js';

const TEAM_FILE = DIRS.team;

let cache = null;
let cacheMtime = 0;

/** Carrega team.json (com cache por mtime). */
export async function loadTeam() {
  const stat = await fs.stat(TEAM_FILE);
  if (cache && stat.mtimeMs === cacheMtime) return cache;
  const raw = await fs.readFile(TEAM_FILE, 'utf-8');
  cache = JSON.parse(raw);
  cacheMtime = stat.mtimeMs;
  return cache;
}

export async function getMemberIds() {
  const team = await loadTeam();
  return new Set((team.members || []).map((m) => m.id));
}

export async function isValidMember(id) {
  if (!id || typeof id !== 'string') return false;
  return (await getMemberIds()).has(id);
}

/**
 * Lê team.json FRESCO dentro de um lock, aplica `fn(members)` (que devolve o novo
 * array de membros) e grava. O cache é invalidado naturalmente pela mudança de mtime.
 */
export async function mutateTeam(fn) {
  return withLock(TEAM_FILE, async () => {
    let raw = { members: [] };
    try {
      raw = JSON.parse(await fs.readFile(TEAM_FILE, 'utf-8'));
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    const nextMembers = await fn(raw.members || []);
    const out = { ...raw, members: nextMembers };
    await fs.writeFile(TEAM_FILE, JSON.stringify(out, null, 2) + '\n', 'utf-8');
    return out;
  });
}

/** Valida array de assignees; devolve { valid, errors }. */
export async function validateAssignees(assignees) {
  if (!Array.isArray(assignees)) {
    return { valid: false, errors: ['assignees deve ser um array'] };
  }
  const ids = await getMemberIds();
  const errors = [];
  for (const a of assignees) {
    if (typeof a !== 'string' || !ids.has(a)) {
      errors.push(`assignee desconhecido: "${a}"`);
    }
  }
  const unique = new Set(assignees);
  if (unique.size !== assignees.length) {
    errors.push('assignees contém IDs duplicados');
  }
  return { valid: errors.length === 0, errors };
}
