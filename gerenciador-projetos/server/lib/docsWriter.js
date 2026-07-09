import fs from 'node:fs/promises';
import matter from 'gray-matter';
import { withLock } from './lock.js';

function today() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Atualiza um arquivo EXISTENTE de forma ATÔMICA por arquivo.
 * Todo o ciclo ler -> modificar -> gravar roda dentro de um lock por caminho,
 * então requisições concorrentes ao mesmo arquivo não se sobrescrevem.
 *
 * `mutate({ data, content })` recebe o frontmatter e o corpo FRESCOS (lidos
 * dentro do lock) e deve devolver `{ data?, content? }`. O que não for devolvido
 * é mantido. `updated` é sempre carimbado com a data atual.
 */
export async function updateDoc(filePath, mutate) {
  return withLock(filePath, async () => {
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = matter(raw);
    const current = { data: parsed.data || {}, content: parsed.content };

    const next = (await mutate(current)) || {};
    const data = { ...(next.data ?? current.data), updated: today() };
    const content = next.content ?? current.content;

    const output = matter.stringify(content, data);
    await fs.writeFile(filePath, output, 'utf-8');
    return { data, content };
  });
}

/**
 * Atualiza campos de frontmatter de um arquivo EXISTENTE sem tocar no corpo.
 * Mescla `changes` sobre o frontmatter lido dentro do lock (atômico).
 *
 * ATENÇÃO: para coleções (arrays), calcule o novo array a partir da leitura
 * FRESCA usando `updateDoc` diretamente — passar um array pré-calculado aqui
 * ainda estaria sujeito a lost update entre a sua leitura e este patch.
 */
export async function patchDoc(filePath, changes) {
  return updateDoc(filePath, ({ data }) => ({ data: { ...data, ...changes } }));
}

/**
 * Cria um arquivo NOVO com frontmatter + corpo.
 * `data` já deve conter created/updated se desejado; aqui garantimos ambos.
 */
export async function createDoc(filePath, data, body = '') {
  const now = today();
  const fullData = { created: now, updated: now, ...data };
  const output = matter.stringify(body, fullData);
  await fs.writeFile(filePath, output, 'utf-8');
  return { path: filePath, data: fullData };
}
