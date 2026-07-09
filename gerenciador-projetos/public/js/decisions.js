import { api } from './api.js';
import { el, openModal, closeModal, showToast, statusBadge, loading, errorBox } from './ui.js';

let decisions = [];

export async function render(container) {
  container.replaceChildren(
    el('div', { class: 'flex items-center justify-between mb-6' }, [
      el('div', {}, [
        el('h1', { class: 'text-2xl font-bold text-slate-900' }, 'Decisões (ADR)'),
        el('p', { class: 'text-sm text-slate-500' }, 'Architecture Decision Records — mais recente primeiro'),
      ]),
      el('button', {
        class: 'bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md',
        onclick: openCreateModal,
      }, '+ Novo ADR'),
    ]),
    el('div', { id: 'adr-list', class: 'space-y-3' }, loading())
  );
  await reload(container);
}

async function reload(container) {
  const list = container.querySelector('#adr-list');
  try {
    decisions = await api.decisions();
    if (!decisions.length) return list.replaceChildren(el('p', { class: 'text-slate-500' }, 'Nenhum ADR registrado.'));
    list.replaceChildren(...decisions.map(rowEl));
  } catch (err) {
    list.replaceChildren(errorBox(err.message));
  }
}

function rowEl(adr) {
  const superseded = adr.status === 'superseded';
  return el('div', {
    class: `bg-white border border-slate-200 rounded-lg p-4 shadow-sm cursor-pointer hover:border-indigo-300 ${superseded ? 'opacity-60' : ''}`,
    onclick: () => openModal(adr.id, el('div', { class: 'prose', html: adr.bodyHtml })),
  }, [
    el('div', { class: 'flex items-center gap-3' }, [
      el('span', { class: 'text-xs text-slate-400 w-20 shrink-0' }, adr.id),
      el('span', { class: 'text-sm font-medium text-slate-800 flex-1' }, titleOf(adr)),
      statusBadge(adr.status),
      el('span', { class: 'text-xs text-slate-400' }, adr.updated || adr.created || ''),
    ]),
    adr.supersedes ? el('div', { class: 'text-xs text-slate-500 mt-1 pl-[5.75rem]' }, `substitui ${adr.supersedes}`) : null,
  ]);
}

function titleOf(adr) {
  const m = (adr.bodyRaw || '').match(/^#\s+(.+)$/m);
  return m ? m[1].replace(/^ADR-\d+\s*[—-]\s*/, '').trim() : adr.id;
}

function openCreateModal() {
  const form = el('form', { class: 'space-y-4' });
  form.innerHTML = `
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Título</span>
      <input name="title" required class="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="Ex: Escolha do banco de dados" />
    </label>
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Contexto</span>
      <textarea name="context" rows="2" class="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm"></textarea>
    </label>
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Decisão</span>
      <textarea name="decision" rows="2" class="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm"></textarea>
    </label>
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Consequências</span>
      <textarea name="consequences" rows="2" class="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm"></textarea>
    </label>
    <div class="flex justify-end gap-2 pt-2">
      <button type="button" data-cancel class="px-4 py-2 text-sm rounded-md border border-slate-300">Cancelar</button>
      <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md">Criar</button>
    </div>
  `;
  form.querySelector('[data-cancel]').addEventListener('click', closeModal);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    try {
      const created = await api.createDecision({
        title: fd.get('title'),
        context: fd.get('context'),
        decision: fd.get('decision'),
        consequences: fd.get('consequences'),
      });
      closeModal();
      showToast(`${created.id} criado`);
      await reload(document.getElementById('view'));
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
  openModal('Novo ADR', form);
}
