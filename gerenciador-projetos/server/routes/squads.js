import { Router } from 'express';
import fs from 'node:fs/promises';
import { DIRS } from '../lib/paths.js';
import { loadSquads, mutateSquads } from '../lib/squads.js';
import { slugify } from '../lib/idGenerator.js';

const router = Router();
const SQUADS_FILE = DIRS.squads;

// Paleta rotativa para novos squads (mantém o tema visual coerente).
const PALETTE = [
  { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE', accent: '#6366F1' },
  { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', accent: '#10B981' },
  { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE', accent: '#8B5CF6' },
  { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', accent: '#F97316' },
  { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD', accent: '#0EA5E9' },
  { bg: '#FDF2F8', text: '#BE185D', border: '#FBCFE8', accent: '#EC4899' },
];

// GET /api/squads — lista canônica (sem metadados extras)
router.get('/', async (req, res, next) => {
  try {
    res.json(await loadSquads());
  } catch (err) {
    next(err);
  }
});

// GET /api/squads/full — squads + global + cores (fonte para tema visual)
router.get('/full', async (req, res, next) => {
  try {
    const raw = await fs.readFile(SQUADS_FILE, 'utf-8');
    res.json(JSON.parse(raw));
  } catch (err) {
    if (err.code === 'ENOENT') return res.json({ squads: [] });
    next(err);
  }
});

// POST /api/squads — cria um squad
router.post('/', async (req, res, next) => {
  try {
    const b = req.body || {};
    if (!b.name || !b.name.trim()) return res.status(400).json({ error: 'name é obrigatório' });

    const out = await mutateSquads((squads) => {
      const existing = new Set(squads.map((s) => s.id));
      let id = b.id && b.id.trim() ? slugify(b.id) : slugify(b.name);
      if (!id) id = 'squad';
      let unique = id;
      let n = 2;
      while (existing.has(unique)) unique = `${id}-${n++}`;

      const squad = {
        id: unique,
        name: b.name.trim(),
        mission: b.mission || null,
        topology: b.topology || 'stream-aligned',
        services: Array.isArray(b.services) ? b.services : [],
        color: b.color || PALETTE[squads.length % PALETTE.length],
      };
      return [...squads, squad];
    });
    res.status(201).json(out);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/squads/:id — atualiza um squad
router.patch('/:id', async (req, res, next) => {
  try {
    let found = false;
    const out = await mutateSquads((squads) =>
      squads.map((s) => {
        if (s.id !== req.params.id) return s;
        found = true;
        const { id, ...rest } = req.body || {};
        return { ...s, ...rest };
      })
    );
    if (!found) return res.status(404).json({ error: `squad "${req.params.id}" não encontrado` });
    res.json(out);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/squads/:id — remove um squad
router.delete('/:id', async (req, res, next) => {
  try {
    let found = false;
    const out = await mutateSquads((squads) =>
      squads.filter((s) => {
        if (s.id === req.params.id) found = true;
        return s.id !== req.params.id;
      })
    );
    if (!found) return res.status(404).json({ error: `squad "${req.params.id}" não encontrado` });
    res.json(out);
  } catch (err) {
    next(err);
  }
});

export default router;
