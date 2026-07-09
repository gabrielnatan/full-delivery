import { api } from './api.js';
import { el, openModal, loading, errorBox } from './ui.js';

export async function render(container) {
  container.replaceChildren(
    el('h1', { class: 'text-2xl font-bold text-slate-900 mb-1' }, 'Personas'),
    el('p', { class: 'text-sm text-slate-500 mb-6' }, 'Perfis-alvo e suas dores'),
    el('div', { id: 'personas-grid', class: 'grid grid-cols-1 md:grid-cols-2 gap-4' }, loading())
  );
  const grid = container.querySelector('#personas-grid');
  try {
    const personas = await api.personas();
    if (!personas.length) return grid.replaceChildren(el('p', { class: 'text-slate-500' }, 'Nenhuma persona encontrada.'));
    grid.replaceChildren(...personas.map(cardEl));
  } catch (err) {
    grid.replaceChildren(errorBox(err.message));
  }
}

function cardEl(p) {
  return el('div', {
    class: 'bg-white border border-slate-200 rounded-lg p-5 shadow-sm cursor-pointer hover:border-indigo-300',
    onclick: () => openModal(p.id, el('div', { class: 'prose', html: p.bodyHtml })),
  }, [
    el('div', { class: 'text-[11px] text-slate-400 mb-1' }, p.id),
    el('h2', { class: 'text-base font-semibold text-slate-900 mb-2' }, titleOf(p)),
    el('div', { class: 'flex gap-1 flex-wrap' }, (p.tags || []).map((t) =>
      el('span', { class: 'text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full' }, `#${t}`)
    )),
    el('p', { class: 'text-xs text-indigo-600 mt-3' }, 'ver detalhes →'),
  ]);
}

function titleOf(p) {
  const m = (p.bodyRaw || '').match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : p.id;
}
