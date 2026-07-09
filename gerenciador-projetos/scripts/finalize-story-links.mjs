#!/usr/bin/env node
/**
 * Atualiza links Git e status de uma história após branch/PR.
 * Uso: node scripts/finalize-story-links.mjs STORY-060 branch pr
 */
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { updateDoc } from '../server/lib/docsWriter.js';
import { DIRS } from '../server/lib/paths.js';
import fs from 'node:fs/promises';

const shortId = () => randomUUID().slice(0, 8);

const [storyId, branchLabel, prUrl] = process.argv.slice(2);
if (!storyId || !branchLabel) {
  console.error('Uso: finalize-story-links.mjs STORY-XXX branch-label [pr-url]');
  process.exit(1);
}

const REPO = 'https://github.com/gabrielnatan/full-delivery';
const branchUrl = `${REPO}/tree/${branchLabel}`;

const files = await fs.readdir(DIRS.backlog);
const file = files.find((f) => f.startsWith(`${storyId}-`));
if (!file) {
  console.error(`História ${storyId} não encontrada em backlog/`);
  process.exit(1);
}
const storyPath = path.join(DIRS.backlog, file);

await updateDoc(storyPath, ({ data, content }) => {
  const links = Array.isArray(data.links) ? [...data.links] : [];
  const without = links.filter(
    (l) => !(l.type === 'branch' && l.label === branchLabel) && !(l.type === 'pr' && prUrl && l.url === prUrl),
  );
  without.push({
    id: shortId(),
    type: 'branch',
    label: branchLabel,
    url: branchUrl,
    at: new Date().toISOString(),
  });
  if (prUrl) {
    without.push({
      id: shortId(),
      type: 'pr',
      label: prUrl.split('/').pop(),
      url: prUrl,
      at: new Date().toISOString(),
    });
  }
  return {
    data: {
      ...data,
      status: prUrl ? 'review' : data.status,
      links: without,
    },
    content,
  };
});

console.log(`Links atualizados em ${file}`);
if (prUrl) console.log(`PR: ${prUrl}`);
