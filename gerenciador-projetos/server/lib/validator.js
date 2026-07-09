import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = path.join(__dirname, '..', 'schemas');

const cache = new Map();

async function loadSchema(type) {
  if (cache.has(type)) return cache.get(type);
  try {
    const raw = await fs.readFile(path.join(SCHEMA_DIR, `${type}.schema.json`), 'utf-8');
    const schema = JSON.parse(raw);
    cache.set(type, schema);
    return schema;
  } catch {
    cache.set(type, null);
    return null;
  }
}

function checkType(value, spec) {
  const allowed = Array.isArray(spec) ? spec : [spec];
  for (const t of allowed) {
    if (t === 'null' && value === null) return true;
    if (t === 'array' && Array.isArray(value)) return true;
    if (t === 'string' && typeof value === 'string') return true;
    if (t === 'number' && typeof value === 'number') return true;
    if (t === 'boolean' && typeof value === 'boolean') return true;
  }
  return false;
}

/**
 * Valida um objeto de frontmatter contra o schema do seu `type`.
 * Retorna { valid, errors: [] }. Se não houver schema para o tipo, aceita.
 */
export async function validate(type, data) {
  const schema = await loadSchema(type);
  if (!schema) return { valid: true, errors: [] };

  const errors = [];

  for (const field of schema.required || []) {
    if (data[field] === undefined) {
      errors.push(`campo obrigatório ausente: "${field}"`);
    }
  }

  for (const [field, spec] of Object.entries(schema.fields || {})) {
    const value = data[field];
    if (value === undefined) continue; // ausência já tratada em required

    if (spec.type && !checkType(value, spec.type)) {
      errors.push(`campo "${field}" tem tipo inválido`);
      continue;
    }
    if (spec.enum && !spec.enum.includes(value)) {
      errors.push(`campo "${field}" deve ser um de: ${spec.enum.join(', ')}`);
    }
    if (spec.pattern && typeof value === 'string' && !new RegExp(spec.pattern).test(value)) {
      errors.push(`campo "${field}" não bate com o padrão esperado (${spec.pattern})`);
    }
  }

  return { valid: errors.length === 0, errors };
}
