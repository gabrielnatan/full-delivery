import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { slugify, nextId } from '../server/lib/idGenerator.js';
import { validate } from '../server/lib/validator.js';
import { createDoc, patchDoc } from '../server/lib/docsWriter.js';
import { readDoc } from '../server/lib/docsReader.js';

async function tmpDir() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'kickoff-test-'));
}

test('slugify: acentos, espaços e limite', () => {
  assert.equal(slugify('Cadastro de MEI'), 'cadastro-de-mei');
  assert.equal(slugify('Ação   e Reação!'), 'acao-e-reacao');
  assert.equal(slugify('  ---trim--- '), 'trim');
});

test('nextId: pega o maior + 1 com padding', async () => {
  const dir = await tmpDir();
  await createDoc(path.join(dir, 'STORY-001-a.md'), { id: 'STORY-001', type: 'story' }, '# a');
  await createDoc(path.join(dir, 'STORY-003-b.md'), { id: 'STORY-003', type: 'story' }, '# b');
  assert.equal(await nextId(dir, 'STORY', 3), 'STORY-004');
  assert.equal(await nextId(dir, 'ADR', 3), 'ADR-001'); // pasta sem ADRs
});

test('validate: story válida passa, inválida acusa', async () => {
  const ok = await validate('story', { id: 'STORY-001', type: 'story', status: 'backlog', priority: 'high', points: 3, epic: 'x' });
  assert.equal(ok.valid, true);

  const bad = await validate('story', { id: 'story-1', type: 'story', status: 'invalido', priority: 'urgente', points: 4, epic: 'x' });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.length >= 3); // id pattern, status enum, priority enum, points enum
});

test('validate: schemas novos (okr, one-on-one, growth-goal)', async () => {
  assert.equal((await validate('okr', { id: 'OKR-001', type: 'okr', status: 'active', objective: 'X' })).valid, true);
  assert.equal((await validate('okr', { id: 'OKR-001', type: 'okr', status: 'zzz', objective: 'X' })).valid, false);
  assert.equal((await validate('one-on-one', { id: '1ON1-001', type: 'one-on-one', member: 'ana', date: '2026-07-09' })).valid, true);
  assert.equal((await validate('growth-goal', { id: 'GROWTH-001', type: 'growth-goal', member: 'ana', status: 'todo' })).valid, true);
});

test('createDoc + readDoc round-trip preserva frontmatter e corpo', async () => {
  const dir = await tmpDir();
  const fp = path.join(dir, 'STORY-001-teste.md');
  await createDoc(fp, { id: 'STORY-001', type: 'story', status: 'backlog', priority: 'medium', points: 2, epic: 'e' }, '# Título\n\ncorpo');
  const doc = await readDoc(fp);
  assert.equal(doc.id, 'STORY-001');
  assert.equal(doc.status, 'backlog');
  assert.equal(doc.bodyRaw, '# Título\n\ncorpo');
  assert.ok(doc.created && doc.updated);
});

test('patchDoc altera frontmatter sem tocar no corpo', async () => {
  const dir = await tmpDir();
  const fp = path.join(dir, 'STORY-001-x.md');
  await createDoc(fp, { id: 'STORY-001', type: 'story', status: 'backlog' }, '# corpo intacto');
  await patchDoc(fp, { status: 'done' });
  const doc = await readDoc(fp);
  assert.equal(doc.status, 'done');
  assert.equal(doc.bodyRaw, '# corpo intacto');
});
