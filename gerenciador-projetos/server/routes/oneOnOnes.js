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
const DIR = DIRS.oneOnOnes;

const PATCHABLE = new Set(['member', 'date', 'sentiment', 'tags']);

async function findFile(id) {
  const docs = await readDir(DIR);
  const doc = docs.find((d) => String(d.id).toUpperCase() === String(id).toUpperCase());
  return doc ? doc.path : null;
}

// GET /api/one-on-ones?member=beatriz — lista 1:1s (mais recente primeiro)
router.get('/', async (req, res, next) => {
  try {
    let docs = await readDir(DIR);
    if (req.query.member) docs = docs.filter((d) => d.member === req.query.member);
    docs.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

// POST /api/one-on-ones — registra um 1:1
router.post('/', async (req, res, next) => {
  try {
    const b = req.body || {};
    if (!b.member || !(await isValidMember(b.member))) {
      return res.status(400).json({ error: `member desconhecido: "${b.member || ''}"` });
    }
    const date = b.date || new Date().toISOString().slice(0, 10);

    const created = await withLock(DIR, async () => {
      await fs.mkdir(DIR, { recursive: true });
      const id = await nextId(DIR, '1ON1', 3);
      const data = {
        id,
        type: 'one-on-one',
        member: b.member,
        date,
        sentiment: b.sentiment || null,
        tags: Array.isArray(b.tags) ? b.tags : [],
      };
      const { valid, errors } = await validate('one-on-one', data);
      if (!valid) {
        const e = new Error('frontmatter inválido');
        e.status = 400;
        e.details = errors;
        throw e;
      }
      const body = `# 1:1 — ${b.member} (${date})\n\n## Notas\n${b.notes || '_(notas da conversa)_'}\n\n## Ações\n${b.actions || '_(itens de ação combinados)_'}\n`;
      const filePath = path.join(DIR, `${id}-${slugify(b.member + '-' + date)}.md`);
      await createDoc(filePath, data, body);
      return readDoc(filePath);
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/one-on-ones/:id — atualiza frontmatter
router.patch('/:id', async (req, res, next) => {
  try {
    const filePath = await findFile(req.params.id);
    if (!filePath) return res.status(404).json({ error: `1:1 "${req.params.id}" não encontrado` });
    const changes = {};
    for (const [k, v] of Object.entries(req.body || {})) if (PATCHABLE.has(k)) changes[k] = v;
    await patchDoc(filePath, changes);
    res.json(await readDoc(filePath));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/one-on-ones/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const filePath = await findFile(req.params.id);
    if (!filePath) return res.status(404).json({ error: `1:1 "${req.params.id}" não encontrado` });
    await fs.rm(filePath);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
