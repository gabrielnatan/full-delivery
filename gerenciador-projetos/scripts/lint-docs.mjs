#!/usr/bin/env node
// Valida os docs: frontmatter contra schema + integridade de referências cruzadas.
// Uso: npm run lint:docs   (sai com código 1 se houver erros)
import fs from 'node:fs/promises';
import { DIRS } from '../server/lib/paths.js';
import { readDir } from '../server/lib/docsReader.js';
import { validate } from '../server/lib/validator.js';

const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf-8'));
  } catch (e) {
    if (e.code === 'ENOENT') return fallback;
    throw e;
  }
}

async function main() {
  const [stories, decisions, sprints, personas, okrs, oneOnOnes, growth] = await Promise.all([
    readDir(DIRS.backlog),
    readDir(DIRS.decisions),
    readDir(DIRS.sprints),
    readDir(DIRS.personas),
    readDir(DIRS.okrs),
    readDir(DIRS.oneOnOnes),
    readDir(DIRS.growth),
  ]);
  const team = await readJson(DIRS.team, { members: [] });
  const squadsData = await readJson(DIRS.squads, { squads: [] });

  const memberIds = new Set((team.members || []).map((m) => m.id));
  const squadIds = new Set((squadsData.squads || []).map((s) => s.id));
  const storyIds = new Set(stories.map((s) => s.id));
  const sprintIds = new Set(sprints.map((s) => s.id));
  const decisionIds = new Set(decisions.map((d) => d.id));

  const collections = [
    ['story', stories],
    ['decision', decisions],
    ['sprint', sprints],
    ['persona', personas],
    ['okr', okrs],
    ['one-on-one', oneOnOnes],
    ['growth-goal', growth],
  ];

  // 1) Validação de schema por tipo
  for (const [type, docs] of collections) {
    for (const doc of docs) {
      const { valid, errors: errs } = await validate(type, doc);
      if (!valid) for (const e of errs) fail(doc.file, e);
    }
  }

  // 2) Referências cruzadas
  for (const s of stories) {
    if (s.parent && !storyIds.has(s.parent)) fail(s.file, `parent inexistente: ${s.parent}`);
    if (s.sprint && !sprintIds.has(s.sprint)) fail(s.file, `sprint inexistente: ${s.sprint}`);
    if (s.squad && !squadIds.has(s.squad)) fail(s.file, `squad inexistente: ${s.squad}`);
    for (const a of s.assignees || []) if (!memberIds.has(a)) fail(s.file, `assignee inexistente: ${a}`);
  }
  for (const d of decisions) {
    if (d.supersedes && !decisionIds.has(d.supersedes)) fail(d.file, `supersedes inexistente: ${d.supersedes}`);
  }
  for (const o of okrs) {
    if (o.owner && !memberIds.has(o.owner)) fail(o.file, `owner inexistente: ${o.owner}`);
  }
  for (const o of oneOnOnes) {
    if (o.member && !memberIds.has(o.member)) fail(o.file, `member inexistente: ${o.member}`);
  }
  for (const g of growth) {
    if (g.member && !memberIds.has(g.member)) fail(g.file, `member inexistente: ${g.member}`);
  }

  const totalDocs = collections.reduce((n, [, d]) => n + d.length, 0);
  if (errors.length) {
    console.error(`✖ ${errors.length} problema(s) em ${totalDocs} doc(s):\n`);
    for (const e of errors) console.error('  - ' + e);
    process.exit(1);
  }
  console.log(`✓ docs OK (${totalDocs} documentos validados, referências íntegras).`);
}

main().catch((err) => {
  console.error('Erro ao rodar o linter:', err);
  process.exit(1);
});
