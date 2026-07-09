/** Tipos de link Git/código vinculados a histórias (frontmatter `links`). */
export const LINK_TYPES = new Set(['branch', 'commit', 'pr', 'repo', 'other']);

const URL_RE = /^https?:\/\/.+/i;

/**
 * Valida um item de `links` antes de persistir.
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateLink(item) {
  const errors = [];
  const type = String(item?.type || '').toLowerCase();
  const label = String(item?.label || '').trim();
  const url = String(item?.url || '').trim();

  if (!LINK_TYPES.has(type)) {
    errors.push(`type deve ser um de: ${[...LINK_TYPES].join(', ')}`);
  }
  if (!label) errors.push('label é obrigatório');
  if (label.length > 200) errors.push('label deve ter no máximo 200 caracteres');
  if (!URL_RE.test(url)) errors.push('url deve começar com http:// ou https://');

  return { valid: errors.length === 0, errors };
}

export function normalizeLink(item, id, at) {
  return {
    id,
    type: String(item.type).toLowerCase(),
    label: String(item.label).trim(),
    url: String(item.url).trim(),
    at: at || new Date().toISOString(),
  };
}
