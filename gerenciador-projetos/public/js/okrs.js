import { api } from './api.js';
import { el, loading, errorBox, openModal, closeModal, showToast, statusBadge } from './ui.js';

const STATUS = { draft: 'Rascunho', active: 'Ativo', done: 'Concluído', dropped: 'Descartado' };
const STATUS_CLASS = {
  draft: 'bg-slate-100 text-slate-600',
  active: 'bg-sky-100 text-sky-700',
  done: 'bg-emerald-100 text-emerald-700',
  dropped: 'bg-slate-200 text-slate-500',
};
const INPUT_CLASS =
  'mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none';

function field(label, control) {
  return el('label', { class: 'block' }, [
    el('span', { class: 'text-[11px] font-semibold uppercase tracking-wide text-slate-500' }, label),
    control,
  ]);
}
function primaryBtn(label, onclick) {
  return el('button', { type: 'button', class: 'bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md', onclick }, label);
}
function ghostBtn(label, onclick) {
  return el('button', { type: 'button', class: 'px-3 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-50', onclick }, label);
}

export async function render(container) {
  container.replaceChildren(
    el('div', { class: 'flex items-start justify-between gap-4 mb-6' }, [
      el('div', {}, [
        el('h1', { class: 'text-2xl font-bold text-slate-900' }, 'OKRs'),
        el('p', { class: 'text-sm text-slate-500 mt-1' }, 'Objetivos e resultados-chave — o topo da cadeia estratégica.'),
      ]),
      primaryBtn('+ OKR', () => openForm()),
    ]),
    el('div', { id: 'okrs-list' }, loading())
  );
  await reload();
}

async function reload() {
  const list = document.getElementById('okrs-list');
  if (!list) return;
  try {
    const okrs = await api.okrs();
    if (!okrs.length) {
      list.replaceChildren(el('div', { class: 'bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500' }, [
        el('p', { class: 'mb-3' }, 'Nenhum OKR ainda.'),
        primaryBtn('Criar o primeiro OKR', () => openForm()),
      ]));
      return;
    }
    list.replaceChildren(el('div', { class: 'grid gap-4 lg:grid-cols-2' }, okrs.map(card)));
  } catch (err) {
    list.replaceChildren(errorBox(err.message));
  }
}

function card(o) {
  const progress = Number(o.progress) || 0;
  const progInput = el('input', {
    type: 'range', min: '0', max: '100', value: String(progress), class: 'flex-1',
    onchange: async (e) => {
      try { await api.patchOkr(o.id, { progress: Number(e.target.value) }); showToast('Progresso salvo'); reload(); }
      catch (err) { showToast(err.message, 'error'); }
    },
  });
  return el('div', { class: 'bg-white border border-slate-200 rounded-xl p-5 shadow-sm' }, [
    el('div', { class: 'flex items-start justify-between gap-2 mb-2' }, [
      el('h2', { class: 'font-semibold text-slate-800 leading-snug' }, o.objective || o.id),
      statusBadge(STATUS[o.status] || o.status, { [STATUS[o.status]]: STATUS_CLASS[o.status] || 'bg-slate-100 text-slate-600' }),
    ]),
    el('div', { class: 'text-xs text-slate-400 mb-3' }, [
      o.owner ? `dono: ${o.owner}` : 'sem dono',
      o.period ? ` · ${o.period}` : '',
      ` · ${o.id}`,
    ].join('')),
    el('div', { class: 'prose prose-sm max-w-none mb-3', html: o.bodyHtml }),
    el('div', { class: 'flex items-center gap-3' }, [
      progInput,
      el('span', { class: 'text-sm font-medium text-slate-600 w-10 text-right' }, `${progress}%`),
    ]),
    el('div', { class: 'flex justify-end gap-3 mt-3 pt-3 border-t border-slate-100' }, [
      el('button', { type: 'button', class: 'text-xs text-slate-400 hover:text-red-600', onclick: async () => {
        if (!confirm('Excluir este OKR?')) return;
        try { await api.deleteOkr(o.id); showToast('OKR excluído'); reload(); } catch (e) { showToast(e.message, 'error'); }
      } }, 'excluir'),
      el('button', { type: 'button', class: 'text-xs text-indigo-600 hover:underline', onclick: () => openStatus(o) }, 'mudar status'),
    ]),
  ]);
}

function openStatus(o) {
  const sel = el('select', { class: INPUT_CLASS });
  for (const [v, l] of Object.entries(STATUS)) {
    const opt = el('option', { value: v }, l);
    if (v === o.status) opt.selected = true;
    sel.append(opt);
  }
  const form = el('div', { class: 'space-y-4' }, [
    field('Status', sel),
    el('div', { class: 'flex justify-end gap-2' }, [
      ghostBtn('Cancelar', closeModal),
      primaryBtn('Salvar', async () => {
        try { await api.patchOkr(o.id, { status: sel.value }); closeModal(); showToast('Status atualizado'); reload(); }
        catch (e) { showToast(e.message, 'error'); }
      }),
    ]),
  ]);
  openModal(`Status — ${o.id}`, form);
}

async function openForm() {
  let members = [];
  try { members = (await api.team()).members || []; } catch { /* segue sem donos */ }

  const objective = el('input', { class: INPUT_CLASS, placeholder: 'Ex.: Validar o produto com os primeiros clientes' });
  const period = el('input', { class: INPUT_CLASS, placeholder: 'Ex.: 2026-T3' });
  const owner = el('select', { class: INPUT_CLASS });
  owner.append(el('option', { value: '' }, '— sem dono —'));
  for (const m of members) owner.append(el('option', { value: m.id }, m.name));
  const krs = el('textarea', { class: INPUT_CLASS, rows: '4', placeholder: 'Um resultado-chave por linha' });

  const form = el('div', { class: 'space-y-4' }, [
    field('Objetivo', objective),
    el('div', { class: 'grid grid-cols-2 gap-4' }, [field('Período', period), field('Dono', owner)]),
    field('Resultados-chave (um por linha)', krs),
    el('div', { class: 'flex justify-end gap-2 pt-2' }, [
      ghostBtn('Cancelar', closeModal),
      primaryBtn('Criar OKR', async () => {
        if (!objective.value.trim()) return showToast('Objetivo é obrigatório', 'error');
        try {
          await api.createOkr({
            objective: objective.value.trim(),
            period: period.value.trim() || null,
            owner: owner.value || null,
            keyResults: krs.value.split('\n').map((s) => s.trim()).filter(Boolean),
          });
          closeModal();
          showToast('OKR criado');
          reload();
        } catch (e) { showToast(e.message, 'error'); }
      }),
    ]),
  ]);
  openModal('Novo OKR', form);
}
