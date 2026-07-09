import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

marked.setOptions({ mangle: false, headerIds: false });

/**
 * Infere o `type` de um arquivo a partir da pasta em que ele está.
 * Só é usado como fallback quando o frontmatter não traz `type`.
 */
function inferType(dir, filename) {
  const d = dir.toLowerCase();
  if (d.endsWith('backlog')) return 'story';
  if (d.endsWith('decisions')) return 'decision';
  if (d.endsWith('sprints')) return 'sprint';
  if (d.endsWith('personas')) return 'persona';
  return path.basename(filename, '.md');
}

/**
 * Infere um `id` a partir do nome do arquivo (TIPO-ID-slug.md -> TIPO-ID).
 */
function inferId(filename) {
  const base = path.basename(filename, '.md');
  const m = base.match(/^([A-Za-z]+-\d+)/);
  if (m) return m[1].toUpperCase();
  return base;
}

/**
 * Lê e parseia UM arquivo .md. Retorna null se não existir.
 * Sempre devolve um objeto normalizado — mesmo que o frontmatter esteja
 * ausente ou incompleto, para o app nunca quebrar silenciosamente.
 */
export async function readDoc(filePath) {
  let raw;
  try {
    raw = await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }

  const parsed = matter(raw);
  const data = parsed.data || {};
  const dir = path.dirname(filePath);
  const filename = path.basename(filePath);

  const type = data.type || inferType(dir, filename);
  const id = data.id || inferId(filename);

  return {
    ...data,
    id,
    type,
    file: filename,
    path: filePath,
    hasFrontmatter: Object.keys(data).length > 0,
    bodyRaw: parsed.content.trim(),
    bodyHtml: marked.parse(parsed.content.trim()),
  };
}

/**
 * Lê a pasta inteira e devolve os docs parseados.
 * Ignora arquivos que não são .md e ignora README.md (índice humano, sem frontmatter).
 */
export async function readDir(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }

  const files = entries
    .filter((f) => f.endsWith('.md'))
    .filter((f) => f.toLowerCase() !== 'readme.md');

  const docs = await Promise.all(files.map((f) => readDoc(path.join(dir, f))));
  return docs.filter(Boolean);
}
