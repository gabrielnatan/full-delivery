import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { DIRS } from '../lib/paths.js';
import { readDir, readDoc } from '../lib/docsReader.js';
import { createDoc, patchDoc } from '../lib/docsWriter.js';
import { validate } from '../lib/validator.js';
import { nextId, slugify } from '../lib/idGenerator.js';
import { isValidMember } from '../lib/team.js';
import { withLock } from '../lib/lock.js';

const router = Router();
const DIR = DIRS.growth;

const PATCHABLE = new Set(['member', 'status', 'targetDate', 'tags']);

async function findFile(id) {
  const docs = await readDir(DIR);
  const doc = docs.find((d) => String(d.id).toUpperCase() === String(id).toUpperCase());
  return doc ? doc.path : null;
}

// GET /api/growth-goals?member=beatriz — lista metas de crescimento
router.get('/', async (req, res, next) => {
  try {
    let docs = await readDir(DIR);
    if (req.query.member) docs = docs.filter((d) => d.member === req.query.member);
    docs.sort((a, b) => String(a.id).localeCompare(String(b.id)));
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

// POST /api/growth-goals — cria meta de crescimento de uma pessoa
router.post('/', async (req, res, next) => {
  try {
    const b = req.body || {};
    if (!b.member || !(await isValidMember(b.member))) {
      return res.status(400).json({ error: `member desconhecido: "${b.member || ''}"` });
    }
    if (!b.title || !b.title.trim()) return res.status(400).json({ error: 'title é obrigatório' });

    const created = await withLock(DIR, async () => {
      await fs.mkdir(DIR, { recursive: true });
      const id = await nextId(DIR, 'GROWTH', 3);
      const data = {
        id,
        type: 'growth-goal',
        member: b.member,
        status: b.status || 'todo',
        targetDate: b.targetDate || null,
        tags: Array.isArray(b.tags) ? b.tags : [],
      };
      const { valid, errors } = await validate('growth-goal', data);
      if (!valid) {
        const e = new Error('frontmatter inválido');
        e.status = 400;
        e.details = errors;
        throw e;
      }
      const body = `# ${b.title}\n\n## Objetivo\n${b.description || '_(o que a pessoa quer desenvolver e por quê)_'}\n\n## Como vamos apoiar\n${b.support || '_(ações, mentoria, projetos)_'}\n`;
      const filePath = path.join(DIR, `${id}-${slugify(b.member + '-' + b.title)}.md`);
      await createDoc(filePath, data, body);
      return readDoc(filePath);
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/growth-goals/:id — atualiza frontmatter (ex.: status)
router.patch('/:id', async (req, res, next) => {
  try {
    const filePath = await findFile(req.params.id);
    if (!filePath) return res.status(404).json({ error: `meta "${req.params.id}" não encontrada` });
    const changes = {};
    for (const [k, v] of Object.entries(req.body || {})) if (PATCHABLE.has(k)) changes[k] = v;
    await patchDoc(filePath, changes);
    res.json(await readDoc(filePath));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/growth-goals/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const filePath = await findFile(req.params.id);
    if (!filePath) return res.status(404).json({ error: `meta "${req.params.id}" não encontrada` });
    await fs.rm(filePath);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
