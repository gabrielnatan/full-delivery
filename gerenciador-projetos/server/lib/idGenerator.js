import { readDir } from './docsReader.js';

/**
 * Escaneia uma pasta, encontra o maior número de ID no padrão PREFIX-N e
 * devolve o próximo (PREFIX-N+1), com padding de zeros.
 * IDs nunca são reutilizados — mesmo itens cancelados contam para o máximo.
 */
export async function nextId(dir, prefix, pad = 3) {
  const docs = await readDir(dir);
  const re = new RegExp(`^${prefix}-(\\d+)$`, 'i');

  let max = 0;
  for (const doc of docs) {
    const m = String(doc.id || '').match(re);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }

  const n = max + 1;
  return `${prefix}-${String(n).padStart(pad, '0')}`;
}

export function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
