/** Número do sufixo STORY-XXX (ex.: STORY-003 → 3). */
export function storyNum(id) {
  const m = String(id || '').match(/(\d+)$/);
  return m ? parseInt(m[1], 10) : 999999;
}

const normId = (id) => String(id || '').toUpperCase();

/** Sequência de execução para histórias raiz (sem parent). */
export function inferRootRank(story) {
  const n = storyNum(story.id);
  if (n >= 70 && n <= 73) {
    if (n === 70) return 2070;
    if (n === 71) return 2080;
    if (n === 72) return 8150;
    if (n === 73) return 8260;
  }
  if (n === 46) return 2050;
  if (n === 47) return 2060;
  return n * 1000;
}

function compareLabelStrings(a, b) {
  const pa = String(a || '').split('.').map(Number);
  const pb = String(b || '').split('.').map(Number);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** Camada de subtask: backend antes de web/mobile (ordem de execução). */
function childTagRank(story) {
  const tags = story.tags || [];
  if (tags.includes('back')) return 0;
  if (tags.includes('web')) return 1;
  if (tags.includes('mobile')) return 2;
  if (tags.includes('design')) return 3;
  return 4;
}

function compareChildStories(a, b) {
  const tagDiff = childTagRank(a) - childTagRank(b);
  if (tagDiff !== 0) return tagDiff;
  return storyNum(a.id) - storyNum(b.id);
}

/**
 * Índice automático: raiz → 1, 2, 3… · filha → 1.1, 1.2 · 2.1…
 * Recalculado sempre a partir do backlog — sem campo manual no frontmatter.
 */
export function buildOrderIndex(stories) {
  const index = new Map();
  const roots = stories
    .filter((s) => !s.parent)
    .sort((a, b) => {
      const diff = inferRootRank(a) - inferRootRank(b);
      if (diff !== 0) return diff;
      return storyNum(a.id) - storyNum(b.id);
    });

  const childrenOf = (parentId) => stories
    .filter((s) => normId(s.parent) === normId(parentId))
    .sort(compareChildStories);

  roots.forEach((root, i) => {
    const rootLabel = String(i + 1);
    index.set(normId(root.id), rootLabel);
    childrenOf(root.id).forEach((child, j) => {
      index.set(normId(child.id), `${rootLabel}.${j + 1}`);
    });
  });

  // Órfãs (parent ausente no backlog)
  stories.forEach((s) => {
    if (!index.has(normId(s.id))) {
      index.set(normId(s.id), String(storyNum(s.id)));
    }
  });

  return index;
}

export function displayOrder(story, index) {
  return index.get(normId(story.id)) || '?';
}

export function makeCompareStories(stories) {
  const index = buildOrderIndex(stories);
  return (a, b) => compareLabelStrings(
    index.get(normId(a.id)),
    index.get(normId(b.id)),
  );
}

export function sortStories(stories) {
  return [...stories].sort(makeCompareStories(stories));
}
