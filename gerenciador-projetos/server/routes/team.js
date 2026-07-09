import { Router } from 'express';
import { loadTeam, mutateTeam } from '../lib/team.js';
import { isValidSquad } from '../lib/squads.js';
import { readDir } from '../lib/docsReader.js';
import { slugify } from '../lib/idGenerator.js';
import { DIRS } from '../lib/paths.js';

const router = Router();

const ROLES = ['tech-lead', 'developer', 'designer', 'product', 'other'];

// GET /api/team — roster completo (team.json)
router.get('/', async (req, res, next) => {
  try {
    res.json(await loadTeam());
  } catch (err) {
    next(err);
  }
});

// GET /api/team/capacity?sprint=SPRINT-01 — carga por pessoa (alocado vs capacidade)
router.get('/capacity', async (req, res, next) => {
  try {
    const sprint = req.query.sprint || null;
    const team = await loadTeam();
    const stories = await readDir(DIRS.backlog);
    const relevant = sprint ? stories.filter((s) => s.sprint === sprint) : stories;

    const load = {};
    for (const s of relevant) {
      if (s.status === 'cancelled') continue;
      const pts = Number(s.points) || 0;
      for (const a of s.assignees || []) load[a] = (load[a] || 0) + pts;
    }

    const members = (team.members || []).map((m) => ({
      id: m.id,
      name: m.name,
      squad: m.squad || null,
      capacity: Number(m.capacityPoints) || 0,
      allocated: load[m.id] || 0,
    }));
    res.json({ sprint, members });
  } catch (err) {
    next(err);
  }
});

// POST /api/team/members — adiciona pessoa ao roster
router.post('/members', async (req, res, next) => {
  try {
    const b = req.body || {};
    if (!b.name || !b.name.trim()) return res.status(400).json({ error: 'name é obrigatório' });
    if (b.role && !ROLES.includes(b.role)) {
      return res.status(400).json({ error: `role inválido (use: ${ROLES.join(', ')})` });
    }
    if (b.squad && !(await isValidSquad(b.squad))) {
      return res.status(400).json({ error: `squad desconhecido: "${b.squad}"` });
    }

    const out = await mutateTeam((members) => {
      const existing = new Set(members.map((m) => m.id));
      let id = b.id && b.id.trim() ? slugify(b.id) : slugify(b.name);
      if (!id) id = 'membro';
      let unique = id;
      let n = 2;
      while (existing.has(unique)) unique = `${id}-${n++}`;

      const member = {
        id: unique,
        name: b.name.trim(),
        role: b.role || 'developer',
        seniority: b.seniority || null,
        discipline: b.discipline || null,
        squad: b.squad || null,
        skills: Array.isArray(b.skills) ? b.skills : [],
        capacityPoints: Number(b.capacityPoints) || 0,
        avatar: b.avatar || null,
        note: b.note || null,
      };
      return [...members, member];
    });
    res.status(201).json(out);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/team/members/:id — atualiza campos de uma pessoa
router.patch('/members/:id', async (req, res, next) => {
  try {
    const changes = req.body || {};
    if (changes.role && !ROLES.includes(changes.role)) {
      return res.status(400).json({ error: `role inválido (use: ${ROLES.join(', ')})` });
    }
    if (changes.squad && !(await isValidSquad(changes.squad))) {
      return res.status(400).json({ error: `squad desconhecido: "${changes.squad}"` });
    }

    let found = false;
    const out = await mutateTeam((members) =>
      members.map((m) => {
        if (m.id !== req.params.id) return m;
        found = true;
        const { id, ...rest } = changes; // id é imutável
        return { ...m, ...rest };
      })
    );
    if (!found) return res.status(404).json({ error: `membro "${req.params.id}" não encontrado` });
    res.json(out);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/team/members/:id — remove pessoa do roster
router.delete('/members/:id', async (req, res, next) => {
  try {
    let found = false;
    const out = await mutateTeam((members) =>
      members.filter((m) => {
        if (m.id === req.params.id) found = true;
        return m.id !== req.params.id;
      })
    );
    if (!found) return res.status(404).json({ error: `membro "${req.params.id}" não encontrado` });
    res.json(out);
  } catch (err) {
    next(err);
  }
});

export default router;
