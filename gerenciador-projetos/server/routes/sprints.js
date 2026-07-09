import { Router } from 'express';
import path from 'node:path';
import { DIRS } from '../lib/paths.js';
import { readDir, readDoc } from '../lib/docsReader.js';
import { createDoc } from '../lib/docsWriter.js';
import { validate } from '../lib/validator.js';
import { nextId, slugify } from '../lib/idGenerator.js';
import { withLock } from '../lib/lock.js';
import { makeCompareStories } from '../lib/storyOrder.js';

const router = Router();

// GET /api/sprints — lista sprints
router.get('/', async (req, res, next) => {
  try {
    const docs = await readDir(DIRS.sprints);
    docs.sort((a, b) => String(a.id).localeCompare(String(b.id)));
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

// POST /api/sprints — cria uma sprint
router.post('/', async (req, res, next) => {
  try {
    const b = req.body || {};
    const created = await withLock(DIRS.sprints, async () => {
      const id = await nextId(DIRS.sprints, 'SPRINT', 2);
      const data = {
        id,
        type: 'sprint',
        status: b.status || 'planned',
        start_date: b.start_date || null,
        end_date: b.end_date || null,
        tags: Array.isArray(b.tags) ? b.tags : [],
      };
      const { valid, errors } = await validate('sprint', data);
      if (!valid) {
        const e = new Error('frontmatter inválido');
        e.status = 400;
        e.details = errors;
        throw e;
      }
      const title = b.title || id;
      const body = `# ${title}\n\n## Objetivo da sprint\n${b.goal || '_(uma frase — o que precisa estar pronto no final)_'}\n\n## Retrospectiva\n_(preenchida ao final)_\n`;
      const filePath = path.join(DIRS.sprints, `${id}.md`);
      await createDoc(filePath, data, body);
      return readDoc(filePath);
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// GET /api/sprints/:id — sprint + histórias vinculadas (join em memória pelo campo sprint:)
router.get('/:id', async (req, res, next) => {
  try {
    const [sprints, stories] = await Promise.all([
      readDir(DIRS.sprints),
      readDir(DIRS.backlog),
    ]);

    const sprint = sprints.find((s) => String(s.id).toUpperCase() === String(req.params.id).toUpperCase());
    if (!sprint) return res.status(404).json({ error: `Sprint ${req.params.id} não encontrada` });

    const linked = stories
      .filter((st) => String(st.sprint || '').toUpperCase() === String(sprint.id).toUpperCase())
      .sort(makeCompareStories(stories));

    const totalPoints = linked.reduce((sum, st) => sum + (Number(st.points) || 0), 0);
    const donePoints = linked
      .filter((st) => st.status === 'done')
      .reduce((sum, st) => sum + (Number(st.points) || 0), 0);

    res.json({
      ...sprint,
      stories: linked,
      progress: { totalPoints, donePoints, count: linked.length },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
