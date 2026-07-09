import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import projectRouter from './routes/project.js';
import storiesRouter from './routes/stories.js';
import squadsRouter from './routes/squads.js';
import teamRouter from './routes/team.js';
import decisionsRouter from './routes/decisions.js';
import sprintsRouter from './routes/sprints.js';
import docsRouter from './routes/docs.js';
import oneOnOnesRouter from './routes/oneOnOnes.js';
import growthRouter from './routes/growth.js';
import okrsRouter from './routes/okrs.js';
import { DOCS, DIRS } from './lib/paths.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');
const PORT = process.env.PORT || 4001;

const app = express();
// Limite generoso: uploads de imagem chegam como data URL (base64) no corpo JSON.
app.use(express.json({ limit: '15mb' }));

// API
app.use('/api/project', projectRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/squads', squadsRouter);
app.use('/api/team', teamRouter);
app.use('/api/one-on-ones', oneOnOnesRouter);
app.use('/api/growth-goals', growthRouter);
app.use('/api/okrs', okrsRouter);
app.use('/api/decisions', decisionsRouter);
app.use('/api/sprints', sprintsRouter);
app.use('/api/docs', docsRouter);

app.get('/api/health', (req, res) => res.json({ ok: true, docs: DOCS }));

// Imagens anexadas às histórias (URLs tipo /attachments/STORY-XXX/arquivo.png)
app.use('/attachments', express.static(DIRS.attachments));

// Frontend estático
app.use(express.static(PUBLIC));

// Handler de erro central — sempre JSON. Respeita err.status/err.details
// quando o erro foi lançado deliberadamente (ex.: validação de frontmatter).
app.use((err, req, res, next) => {
  console.error(err);
  const payload = { error: err.message || 'erro interno' };
  if (err.details) payload.details = err.details;
  res.status(err.status || 500).json(payload);
});

app.listen(PORT, () => {
  console.log(`gerenciador-projetos rodando em http://localhost:${PORT}`);
  console.log(`lendo docs de: ${DOCS}`);
});
