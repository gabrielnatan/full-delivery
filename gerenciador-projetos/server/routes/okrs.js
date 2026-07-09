import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { DIRS } from '../lib/paths.js';
import { readDir, readDoc } from '../lib/docsReader.js';
import { createDoc, patchDoc } from '../lib/docsWriter.js';
import { validate } from '../lib/validator.js';
import { nextId, slugify } from '../lib/idGenerator.js';
import { withLock } from '../lib/lock.js';

const router = Router();
const DIR = DIRS.okrs;

const PATCHABLE = new Set(['status', 'objective', 'period', 'owner', 'progress', 'tags']);

async function findFile(id) {
  const docs = await readDir(DIR);
  const doc = docs.find((d) => String(d.id).toUpperCase() === String(id).toUpperCase());
  return doc ? doc.path : null;
}

// GET /api/okrs — lista OKRs
router.get('/', async (req, res, next) => {
  try {
    const docs = await readDir(DIR);
    docs.sort((a, b) => String(a.id).localeCompare(String(b.id)));
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

// GET /api/okrs/:id
router.get('/:id', async (req, res, next) => {
  try {
    const filePath = await findFile(req.params.id);
    if (!filePath) return res.status(404).json({ error: `OKR "${req.params.id}" não encontrado` });
    res.json(await readDoc(filePath));
  } catch (err) {
    next(err);
  }
});

// POST /api/okrs — cria um OKR
router.post('/', async (req, res, next) => {
  try {
    const b = req.body || {};
    if (!b.objective || !b.objective.trim()) return res.status(400).json({ error: 'objective é obrigatório' });

    const created = await withLock(DIR, async () => {
      await fs.mkdir(DIR, { recursive: true });
      const id = await nextId(DIR, 'OKR', 3);
      const data = {
        id,
        type: 'okr',
        status: b.status || 'active',
        objective: b.objective.trim(),
        period: b.period || null,
        owner: b.owner || null,
        progress: Number(b.progress) || 0,
        tags: Array.isArray(b.tags) ? b.tags : [],
      };
      const { valid, errors } = await validate('okr', data);
      if (!valid) {
        const e = new Error('frontmatter inválido');
        e.status = 400;
        e.details = errors;
        throw e;
      }
      const krs = Array.isArray(b.keyResults) ? b.keyResults.filter((k) => String(k).trim()) : [];
      const krList = krs.length ? krs.map((k) => `- [ ] ${k}`).join('\n') : '- [ ] (resultado-chave 1)';
      const body = `# ${b.objective.trim()}\n\n## Resultados-chave\n${krList}\n`;
      const filePath = path.join(DIR, `${id}-${slugify(b.objective)}.md`);
      await createDoc(filePath, data, body);
      return readDoc(filePath);
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/okrs/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const filePath = await findFile(req.params.id);
    if (!filePath) return res.status(404).json({ error: `OKR "${req.params.id}" não encontrado` });
    const changes = {};
    for (const [k, v] of Object.entries(req.body || {})) if (PATCHABLE.has(k)) changes[k] = v;
    await patchDoc(filePath, changes);
    res.json(await readDoc(filePath));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/okrs/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const filePath = await findFile(req.params.id);
    if (!filePath) return res.status(404).json({ error: `OKR "${req.params.id}" não encontrado` });
    await fs.rm(filePath);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
