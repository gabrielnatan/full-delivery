import { api } from './api.js';
import { el, loading, errorBox } from './ui.js';

let indexCache = null;

function firstLine(doc) {
  return (doc.bodyRaw || '').split('\n')[0].replace(/^#+\s*/, '').trim();
}

async function buildIndex() {
  const [stories, decisions, okrs, personas, docsList] = await Promise.all([
    api.stories(), api.decisions(), api.okrs(), api.personas(), api.docsList(),
  ]);
  const simpleDocs = await Promise.all(
    docsList.filter((d) => d.exists).map(async (d) => {
      const doc = await api.doc(d.name).catch(() => null);
      return doc ? { kind: 'Doc', id: d.name, title: doc.id || d.name, text: doc.bodyRaw || '', hash: `#docs/${d.name}` } : null;
    })
  );
  return [
    ...stories.map((s) => ({ kind: 'História', id: s.id, title: firstLine(s) || s.id, text: s.bodyRaw || '', hash: '#kanban' })),
    ...okrs.map((o) => ({ kind: 'OKR', id: o.id, title: o.objective || firstLine(o), text: o.bodyRaw || '', hash: '#okrs' })),
    ...decisions.map((d) => ({ kind: 'ADR', id: d.id, title: firstLine(d) || d.id, text: d.bodyRaw || '', hash: '#decisions' })),
    ...personas.map((p) => ({ kind: 'Persona', id: p.id, title: firstLine(p) || p.id, text: p.bodyRaw || '', hash: '#personas' })),
    ...simpleDocs.filter(Boolean),
  ];
}

const KIND_CLASS = {
  'História': 'bg-indigo-100 text-indigo-700',
  OKR: 'bg-emerald-100 text-emerald-700',
  ADR: 'bg-sky-100 text-sky-700',
  Persona: 'bg-violet-100 text-violet-700',
  Doc: 'bg-slate-100 text-slate-600',
};

function snippet(text, q) {
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return text.slice(0, 120);
  const start = Math.max(0, i - 40);
  return (start > 0 ? '…' : '') + text.slice(start, i + q.length + 60).replace(/\n/g, ' ') + '…';
}

export async function render(container, initial = '') {
  container.replaceChildren(
    el('div', { class: 'mb-4' }, [
      el('h1', { class: 'text-2xl font-bold text-slate-900' }, 'Buscar'),
      el('p', { class: 'text-sm text-slate-500 mt-1' }, 'Busca em histórias, OKRs, ADRs, personas e docs.'),
    ]),
    el('input', {
      id: 'search-input', type: 'search', autocomplete: 'off',
      class: 'w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none',
      placeholder: 'Digite para buscar…', value: initial,
      oninput: (e) => schedule(e.target.value),
    }),
    el('div', { id: 'search-results', class: 'mt-4' }, el('p', { class: 'text-sm text-slate-400' }, 'Carregando índice…'))
  );

  const input = document.getElementById('search-input');
  try {
    if (!indexCache) indexCache = await buildIndex();
    input.focus();
    run(initial);
  } catch (err) {
    document.getElementById('search-results').replaceChildren(errorBox(err.message));
  }
}

let timer;
function schedule(q) {
  clearTimeout(timer);
  timer = setTimeout(() => run(q), 150);
}

function run(query) {
  const out = document.getElementById('search-results');
  if (!out || !indexCache) return;
  const q = query.trim().toLowerCase();
  if (!q) {
    out.replaceChildren(el('p', { class: 'text-sm text-slate-400' }, `${indexCache.length} itens indexados. Comece a digitar.`));
    return;
  }
  const hits = indexCache.filter((it) =>
    it.id.toLowerCase().includes(q) || (it.title || '').toLowerCase().includes(q) || it.text.toLowerCase().includes(q)
  ).slice(0, 50);

  if (!hits.length) {
    out.replaceChildren(el('p', { class: 'text-sm text-slate-400' }, `Nenhum resultado para "${query}".`));
    return;
  }
  out.replaceChildren(
    el('p', { class: 'text-xs text-slate-400 mb-2' }, `${hits.length} resultado(s)`),
    el('div', { class: 'space-y-2' }, hits.map((it) =>
      el('a', { href: it.hash, class: 'block bg-white border border-slate-200 rounded-lg p-3 hover:border-indigo-300 hover:shadow-sm transition' }, [
        el('div', { class: 'flex items-center gap-2 mb-1' }, [
          el('span', { class: `text-[10px] px-1.5 py-0.5 rounded font-medium ${KIND_CLASS[it.kind] || 'bg-slate-100 text-slate-600'}` }, it.kind),
          el('span', { class: 'text-xs text-slate-400' }, it.id),
        ]),
        el('div', { class: 'text-sm font-medium text-slate-800' }, it.title || it.id),
        el('div', { class: 'text-xs text-slate-500 mt-0.5' }, snippet(it.text, q)),
      ])
    ))
  );
}

export function clearIndex() { indexCache = null; }
