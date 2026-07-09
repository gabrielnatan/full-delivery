import { Router } from 'express';
import { SIMPLE_DOCS, DIRS } from '../lib/paths.js';
import { readDoc, readDir } from '../lib/docsReader.js';
import { updateDoc, createDoc } from '../lib/docsWriter.js';

const router = Router();

// GET /api/docs — lista os docs simples disponíveis (para montar o menu)
router.get('/', async (req, res, next) => {
  try {
    const names = Object.keys(SIMPLE_DOCS);
    const docs = await Promise.all(
      names.map(async (name) => {
        const doc = await readDoc(SIMPLE_DOCS[name]);
        return { name, exists: !!doc, type: doc?.type || null, status: doc?.status || null };
      })
    );
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

// GET /api/docs/personas — lista de personas (pasta)
router.get('/personas', async (req, res, next) => {
  try {
    const docs = await readDir(DIRS.personas);
    docs.sort((a, b) => String(a.id).localeCompare(String(b.id)));
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

// GET /api/docs/:filename — conteúdo renderizado de um doc simples
router.get('/:filename', async (req, res, next) => {
  try {
    const filePath = SIMPLE_DOCS[req.params.filename];
    if (!filePath) return res.status(404).json({ error: `Doc "${req.params.filename}" não é um doc conhecido` });

    const doc = await readDoc(filePath);
    if (!doc) return res.status(404).json({ error: `Arquivo de "${req.params.filename}" não existe em docs/` });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/docs/:filename — edita frontmatter e/ou corpo de um doc simples.
// Body: { data?: {...campos de frontmatter}, body?: "markdown" }.
router.patch('/:filename', async (req, res, next) => {
  try {
    const filePath = SIMPLE_DOCS[req.params.filename];
    if (!filePath) return res.status(404).json({ error: `Doc "${req.params.filename}" não é um doc conhecido` });

    const { data, body } = req.body || {};
    try {
      await updateDoc(filePath, ({ data: cur, content }) => ({
        data: data ? { ...cur, ...data } : cur,
        content: typeof body === 'string' ? body : content,
      }));
    } catch (err) {
      if (err.code === 'ENOENT') {
        await createDoc(filePath, data || {}, typeof body === 'string' ? body : '');
      } else {
        throw err;
      }
    }
    res.json(await readDoc(filePath));
  } catch (err) {
    next(err);
  }
});

export default router;
