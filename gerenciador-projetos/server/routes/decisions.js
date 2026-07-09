import { Router } from 'express';
import path from 'node:path';
import { DIRS } from '../lib/paths.js';
import { readDir, readDoc } from '../lib/docsReader.js';
import { createDoc } from '../lib/docsWriter.js';
import { validate } from '../lib/validator.js';
import { nextId, slugify } from '../lib/idGenerator.js';

const router = Router();

// GET /api/decisions — lista ADRs (mais recente primeiro)
router.get('/', async (req, res, next) => {
  try {
    const docs = await readDir(DIRS.decisions);
    docs.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

// POST /api/decisions — cria novo ADR
router.post('/', async (req, res, next) => {
  try {
    const { title, context = '', decision = '', consequences = '', supersedes = null, tags = [] } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title é obrigatório' });
    }

    const id = await nextId(DIRS.decisions, 'ADR', 3);
    const data = {
      id,
      type: 'decision',
      status: 'proposed',
      supersedes: supersedes || null,
      tags: Array.isArray(tags) ? tags : [],
    };

    const { valid, errors } = await validate('decision', data);
    if (!valid) return res.status(400).json({ error: 'frontmatter inválido', details: errors });

    const body = `# ${id} — ${title}\n\n## Contexto\n${context || '_(qual problema motivou a decisão)_'}\n\n## Decisão\n${decision || '_(o que foi decidido)_'}\n\n## Consequências\n${consequences || '_(trade-offs)_'}\n`;
    const filename = `${id}-${slugify(title)}.md`;
    const filePath = path.join(DIRS.decisions, filename);
    await createDoc(filePath, data, body);

    const created = await readDoc(filePath);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

export default router;
