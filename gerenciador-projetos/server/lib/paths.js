import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// server/lib -> server -> gerenciador-projetos -> raiz do projeto
export const ROOT = path.resolve(__dirname, '..', '..', '..');

// Raiz dos docs. Pode ser sobrescrita por env (KICKOFF_DOCS) para isolar testes.
export const DOCS = process.env.KICKOFF_DOCS
  ? path.resolve(process.env.KICKOFF_DOCS)
  : path.join(ROOT, 'docs');

// Config central do projeto (nome, org, descrição, stack). Lido/escrito por /api/project.
export const CONFIG_FILE = path.join(ROOT, 'config', 'project.json');

// Estrutura em 3 pilares (+ entrega + ops). Fonte única de caminhos.
export const DIRS = {
  // Pilar Negócio
  negocio: path.join(DOCS, '01-negocio'),
  personas: path.join(DOCS, '01-negocio', 'personas'),
  okrs: path.join(DOCS, '01-negocio', 'okrs'),
  // Pilar Técnico
  tecnico: path.join(DOCS, '02-tecnico'),
  decisions: path.join(DOCS, '02-tecnico', 'decisions'),
  // Entrega (liga os pilares)
  entrega: path.join(DOCS, '03-entrega'),
  backlog: path.join(DOCS, '03-entrega', 'backlog'),
  // Imagens anexadas às histórias. Fica DENTRO do backlog, em subpasta por
  // história (_attachments/STORY-XXX/…). Como readDir só lista .md do topo,
  // essa pasta é ignorada pela leitura das histórias.
  attachments: path.join(DOCS, '03-entrega', 'backlog', '_attachments'),
  sprints: path.join(DOCS, '03-entrega', 'sprints'),
  // Pilar Time
  time: path.join(DOCS, '04-time'),
  squads: path.join(DOCS, '04-time', 'squads.json'),
  team: path.join(DOCS, '04-time', 'team.json'),
  oneOnOnes: path.join(DOCS, '04-time', '1on1'),
  growth: path.join(DOCS, '04-time', 'metas-pessoas'),
  // Operações
  ops: path.join(DOCS, '05-ops'),
};

// Docs "simples" (arquivo único) acessíveis por :filename na rota /api/docs
export const SIMPLE_DOCS = {
  vision: path.join(DIRS.negocio, 'vision.md'),
  'business-model': path.join(DIRS.negocio, 'business-model.md'),
  'lean-canvas': path.join(DIRS.negocio, 'lean-canvas.md'),
  concorrentes: path.join(DIRS.negocio, 'concorrentes.md'),
  metricas: path.join(DIRS.negocio, 'metricas.md'),
  riscos: path.join(DIRS.negocio, 'riscos.md'),
  roadmap: path.join(DIRS.negocio, 'roadmap.md'),
  'tech-stack': path.join(DIRS.tecnico, 'tech-stack.md'),
  'system-architecture': path.join(DIRS.tecnico, 'system-architecture.md'),
  integrations: path.join(DIRS.tecnico, 'integrations.md'),
  'data-model': path.join(DIRS.tecnico, 'data-model.md'),
  squads: path.join(DIRS.time, 'squads.md'),
  environments: path.join(DIRS.ops, 'environments.md'),
  runbook: path.join(DIRS.ops, 'runbook.md'),
  'vinculo-git-tasks': path.join(DIRS.ops, 'vinculo-git-tasks.md'),
  'setup-ambiente-local': path.join(DIRS.ops, 'setup-ambiente-local.md'),
};
