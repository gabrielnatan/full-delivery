import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { DIRS } from '../lib/paths.js';
import { readDir, readDoc } from '../lib/docsReader.js';
import { patchDoc, createDoc, updateDoc } from '../lib/docsWriter.js';
import { validate } from '../lib/validator.js';
import { nextId, slugify } from '../lib/idGenerator.js';
import { withLock } from '../lib/lock.js';
import { isValidSquad } from '../lib/squads.js';
import { validateAssignees } from '../lib/team.js';
import { validateLink, normalizeLink } from '../lib/links.js';
import { makeCompareStories } from '../lib/storyOrder.js';

const router = Router();

// Campos do frontmatter que a UI pode editar via PATCH.
const PATCHABLE = new Set(['status', 'priority', 'points', 'epic', 'sprint', 'tags', 'parent', 'kind', 'squad', 'assignees']);

// Tipos de card válidos (o schema também valida; aqui normalizamos na criação).
const KINDS = new Set(['bug', 'feature', 'chore', 'planning', 'docs', 'spike', 'design']);

/**
 * Cria o arquivo de uma nova história e devolve o doc lido.
 * Usado tanto por POST /stories (raiz) quanto por POST /stories/:id/subtasks
 * (que passa `parent` para virar uma tarefa-filha).
 */
async function createStoryFile({
  title,
  priority = 'medium',
  points = 3,
  epic = 'geral',
  tags = [],
  body,
  parent = null,
  status = 'backlog',
  sprint = null,
  kind = null,
  squad = null,
  assignees = [],
}) {
  // Serializa alocação de ID + escrita para dois POST concorrentes não gerarem
  // o mesmo STORY-XXX (nextId escaneia a pasta — corrida clássica).
  const filePath = await withLock(DIRS.backlog, async () => {
    const id = await nextId(DIRS.backlog, 'STORY', 3);
    const data = {
      id,
      type: 'story',
      status,
      priority,
      points: Number(points),
      epic,
      sprint,
      parent,
      kind: KINDS.has(kind) ? kind : null,
      squad: squad || null,
      tags: Array.isArray(tags) ? tags : [],
      assignees: Array.isArray(assignees) ? assignees : [],
    };

    const { valid, errors } = await validate('story', data);
    if (!valid) {
      const err = new Error('frontmatter inválido');
      err.status = 400;
      err.details = errors;
      throw err;
    }
    if (data.squad && !(await isValidSquad(data.squad))) {
      const err = new Error('frontmatter inválido');
      err.status = 400;
      err.details = [`squad desconhecido: "${data.squad}"`];
      throw err;
    }
    if (data.assignees.length) {
      const av = await validateAssignees(data.assignees);
      if (!av.valid) {
        const err = new Error('frontmatter inválido');
        err.status = 400;
        err.details = av.errors;
        throw err;
      }
    }

    const defaultBody = `# ${title}\n\n## História\n${body || '_(descreva a história)_'}\n\n## Critérios de aceite\n- [ ] …\n`;
    const fp = path.join(DIRS.backlog, `${id}-${slugify(title)}.md`);
    await createDoc(fp, data, body ? `# ${title}\n\n${body}\n` : defaultBody);
    return fp;
  });

  return readDoc(filePath);
}

// Extensões de imagem aceitas em anexos (mapeadas a partir do mime).
const IMAGE_EXT = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

async function findStoryFile(id) {
  const docs = await readDir(DIRS.backlog);
  return docs.find((d) => String(d.id).toUpperCase() === String(id).toUpperCase()) || null;
}

function shortId() {
  return randomUUID().slice(0, 8);
}

/**
 * Localiza a história e aplica um mutador sobre suas coleções (comments/
 * attachments) de forma ATÔMICA: o mutador recebe o frontmatter FRESCO (lido
 * dentro do lock do arquivo) e deve devolver o objeto de `changes`. Isso evita
 * lost update quando duas requisições anexam ao mesmo array em paralelo.
 * Responde 404 sozinho quando a história não existe (retorna null).
 */
async function mutateStory(id, res, mutator) {
  const doc = await findStoryFile(id);
  if (!doc) {
    res.status(404).json({ error: `História ${id} não encontrada` });
    return null;
  }
  await updateDoc(doc.path, async ({ data }) => ({ data: { ...data, ...(await mutator(data)) } }));
  return readDoc(doc.path);
}

// GET /api/stories — lista todas
router.get('/', async (req, res, next) => {
  try {
    const docs = await readDir(DIRS.backlog);
    docs.sort(makeCompareStories(docs));
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

// GET /api/stories/:id — uma história
router.get('/:id', async (req, res, next) => {
  try {
    const doc = await findStoryFile(req.params.id);
    if (!doc) return res.status(404).json({ error: `História ${req.params.id} não encontrada` });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

// POST /api/stories — cria nova história (gera ID + arquivo)
router.post('/', async (req, res, next) => {
  try {
    const { title, priority, points, epic, tags, body, kind, squad } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title é obrigatório' });
    }
    const created = await createStoryFile({ title, priority, points, epic, tags, body, kind, squad });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/stories/:id — atualiza campos do frontmatter
router.patch('/:id', async (req, res, next) => {
  try {
    const doc = await findStoryFile(req.params.id);
    if (!doc) return res.status(404).json({ error: `História ${req.params.id} não encontrada` });

    const changes = {};
    for (const [k, v] of Object.entries(req.body)) {
      if (PATCHABLE.has(k)) changes[k] = v;
    }
    if (Object.keys(changes).length === 0) {
      return res.status(400).json({ error: 'nenhum campo editável enviado' });
    }
    if (changes.points !== undefined) changes.points = Number(changes.points);
    if (changes.squad === '') changes.squad = null;
    if (changes.assignees !== undefined) {
      changes.assignees = Array.isArray(changes.assignees) ? changes.assignees : [];
      const av = await validateAssignees(changes.assignees);
      if (!av.valid) {
        return res.status(400).json({ error: 'assignees inválidos', details: av.errors });
      }
    }

    if (changes.squad !== undefined && changes.squad !== null && !(await isValidSquad(changes.squad))) {
      return res.status(400).json({ error: 'squad inválido', details: [`"${changes.squad}" não está em squads.json`] });
    }

    // valida o estado resultante antes de gravar
    const merged = { ...doc, ...changes };
    const { valid, errors } = await validate('story', merged);
    if (!valid) return res.status(400).json({ error: 'frontmatter inválido', details: errors });

    await patchDoc(doc.path, changes);
    const updated = await readDoc(doc.path);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/stories/:id — remove a história (arquivo + anexos).
// Filhas que apontavam para ela ficam órfãs: limpamos o campo `parent`.
router.delete('/:id', async (req, res, next) => {
  try {
    const doc = await findStoryFile(req.params.id);
    if (!doc) return res.status(404).json({ error: `História ${req.params.id} não encontrada` });
    const storyId = String(doc.id).toUpperCase();

    await fs.rm(doc.path, { force: true });
    await fs.rm(path.join(DIRS.attachments, storyId), { recursive: true, force: true });

    const all = await readDir(DIRS.backlog);
    for (const child of all) {
      if (String(child.parent || '').toUpperCase() === storyId) {
        await patchDoc(child.path, { parent: null });
      }
    }

    res.json({ ok: true, id: doc.id });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// SUBTASKS — cada subtask é uma HISTÓRIA-FILHA real (STORY próprio) ligada à
// mãe pelo campo `parent`. Assim ela tem card, status e página próprios, e dá
// para navegar mãe <-> filha nos dois sentidos.
// ---------------------------------------------------------------------------

// POST /api/stories/:id/subtasks — cria uma história-filha e devolve a filha criada
router.post('/:id/subtasks', async (req, res, next) => {
  try {
    const parent = await findStoryFile(req.params.id);
    if (!parent) return res.status(404).json({ error: `História ${req.params.id} não encontrada` });

    const title = String(req.body.title || '').trim();
    if (!title) return res.status(400).json({ error: 'title da subtask é obrigatório' });

    const child = await createStoryFile({
      title,
      body: req.body.body,
      priority: req.body.priority || parent.priority || 'medium',
      points: req.body.points || 3,
      epic: parent.epic || 'geral',
      sprint: parent.sprint ?? null, // herda o sprint da mãe para ficar agrupada
      squad: req.body.squad ?? parent.squad ?? null,
      parent: String(parent.id).toUpperCase(),
      status: 'todo',
      kind: req.body.kind,
    });

    res.status(201).json(child);
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// COMENTÁRIOS
// item: { id, author, text, at }
// ---------------------------------------------------------------------------

// POST /api/stories/:id/comments
router.post('/:id/comments', async (req, res, next) => {
  try {
    const text = String(req.body.text || '').trim();
    if (!text) return res.status(400).json({ error: 'text do comentário é obrigatório' });
    const author = String(req.body.author || 'eu').trim() || 'eu';

    const updated = await mutateStory(req.params.id, res, (doc) => {
      const comments = Array.isArray(doc.comments) ? doc.comments : [];
      comments.push({ id: shortId(), author, text, at: new Date().toISOString() });
      return { comments };
    });
    if (updated) res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/stories/:id/comments/:commentId
router.delete('/:id/comments/:commentId', async (req, res, next) => {
  try {
    const updated = await mutateStory(req.params.id, res, (doc) => {
      const comments = (Array.isArray(doc.comments) ? doc.comments : []).filter(
        (c) => c.id !== req.params.commentId
      );
      return { comments };
    });
    if (updated) res.json(updated);
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// ANEXOS DE IMAGEM
// Upload via data URL (base64) no corpo JSON. Grava o arquivo em
// _attachments/<STORY-ID>/ e registra { id, name, file, url, mime, size, at }.
// ---------------------------------------------------------------------------

// POST /api/stories/:id/attachments  body: { name, dataUrl }
router.post('/:id/attachments', async (req, res, next) => {
  try {
    const { name = 'imagem', dataUrl } = req.body;
    const m = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/s);
    if (!m) return res.status(400).json({ error: 'dataUrl (base64) de imagem é obrigatório' });

    const mime = m[1].toLowerCase();
    const ext = IMAGE_EXT[mime];
    if (!ext) return res.status(400).json({ error: `tipo de imagem não suportado: ${mime}` });

    const buffer = Buffer.from(m[2], 'base64');

    // valida a existência da história antes de escrever qualquer arquivo
    const story = await findStoryFile(req.params.id);
    if (!story) return res.status(404).json({ error: `História ${req.params.id} não encontrada` });
    const storyId = story.id.toUpperCase();

    const attId = shortId();
    const base = slugify(path.basename(String(name), path.extname(String(name)))) || 'imagem';
    const filename = `${attId}-${base}.${ext}`;

    const dir = path.join(DIRS.attachments, storyId);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), buffer);

    const record = {
      id: attId,
      name: String(name),
      file: filename,
      url: `/attachments/${storyId}/${filename}`,
      mime,
      size: buffer.length,
      at: new Date().toISOString(),
    };

    await updateDoc(story.path, ({ data }) => {
      const attachments = Array.isArray(data.attachments) ? data.attachments : [];
      attachments.push(record);
      return { data: { ...data, attachments } };
    });

    res.status(201).json(await readDoc(story.path));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/stories/:id/attachments/:attId
router.delete('/:id/attachments/:attId', async (req, res, next) => {
  try {
    const story = await findStoryFile(req.params.id);
    if (!story) return res.status(404).json({ error: `História ${req.params.id} não encontrada` });

    // remove o registro do frontmatter de forma atômica (leitura fresca no lock)
    let removed;
    await updateDoc(story.path, ({ data }) => {
      const attachments = Array.isArray(data.attachments) ? data.attachments : [];
      removed = attachments.find((a) => a.id === req.params.attId);
      return { data: { ...data, attachments: attachments.filter((a) => a.id !== req.params.attId) } };
    });
    if (!removed) return res.status(404).json({ error: 'anexo não encontrado' });

    // remove o arquivo do disco (best-effort — não falha se já sumiu)
    try {
      await fs.unlink(path.join(DIRS.attachments, story.id.toUpperCase(), removed.file));
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }

    res.json(await readDoc(story.path));
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// LINKS (GitHub — branch, commit, PR, repo)
// item: { id, type, label, url, at }
// ---------------------------------------------------------------------------

// POST /api/stories/:id/links  body: { type, label, url }
router.post('/:id/links', async (req, res, next) => {
  try {
    const { valid, errors } = validateLink(req.body);
    if (!valid) return res.status(400).json({ error: 'link inválido', details: errors });

    const updated = await mutateStory(req.params.id, res, (doc) => {
      const links = Array.isArray(doc.links) ? doc.links : [];
      links.push(normalizeLink(req.body, shortId()));
      return { links };
    });
    if (updated) res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/stories/:id/links/:linkId
router.delete('/:id/links/:linkId', async (req, res, next) => {
  try {
    const updated = await mutateStory(req.params.id, res, (doc) => {
      const links = (Array.isArray(doc.links) ? doc.links : []).filter(
        (l) => l.id !== req.params.linkId
      );
      return { links };
    });
    if (updated) res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
