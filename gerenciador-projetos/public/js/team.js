import { api } from './api.js';
import { el, loading, errorBox, openModal, closeModal, showToast, statusBadge } from './ui.js';
import { applySquadTheme, squadPillStyle, squadSectionStyle } from './squadTheme.js';

const ROLE_LABEL = {
  'tech-lead': 'Tech lead',
  developer: 'Desenvolvedor(a)',
  designer: 'Designer',
  product: 'Produto',
  other: 'Outro',
};
const ROLE_OPTIONS = Object.keys(ROLE_LABEL);
const SENIORITY_OPTIONS = ['', 'junior', 'pleno', 'senior', 'staff', 'principal'];
const GROWTH_STATUS = { todo: 'A fazer', 'in-progress': 'Em andamento', done: 'Concluída' };
const GROWTH_STATUS_CLASS = {
  todo: 'bg-slate-100 text-slate-600',
  'in-progress': 'bg-amber-100 text-amber-700',
  done: 'bg-emerald-100 text-emerald-700',
};
const SENTIMENT = { positivo: '🟢 Positivo', neutro: '🟡 Neutro', negativo: '🔴 Negativo' };

const INPUT_CLASS =
  'mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none';

function field(label, control) {
  return el('label', { class: 'block' }, [
    el('span', { class: 'text-[11px] font-semibold uppercase tracking-wide text-slate-500' }, label),
    control,
  ]);
}
function input(attrs = {}) {
  return el('input', { class: INPUT_CLASS, ...attrs });
}
function select(options, value, attrs = {}) {
  const node = el('select', { class: INPUT_CLASS, ...attrs });
  for (const opt of options) {
    const o = typeof opt === 'string' ? { value: opt, label: opt || '—' } : opt;
    const optNode = el('option', { value: o.value }, o.label);
    if (o.value === (value ?? '')) optNode.selected = true;
    node.append(optNode);
  }
  return node;
}
function initials(name) {
  return String(name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}
function primaryBtn(label, onclick) {
  return el('button', {
    type: 'button',
    class: 'bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md',
    onclick,
  }, label);
}
function ghostBtn(label, onclick) {
  return el('button', { type: 'button', class: 'px-3 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-50', onclick }, label);
}

let sprintFilter = null;

export async function render(container) {
  container.replaceChildren(
    el('div', { class: 'flex items-start justify-between gap-4 mb-6' }, [
      el('div', {}, [
        el('h1', { class: 'text-2xl font-bold text-slate-900' }, 'Time'),
        el('p', { class: 'text-sm text-slate-500 mt-1' }, 'Roster, capacidade, ownership, 1:1s e metas de pessoas.'),
      ]),
      el('div', { class: 'flex gap-2' }, [
        primaryBtn('+ Pessoa', () => openMemberForm()),
        ghostBtn('+ Squad', () => openSquadForm()),
      ]),
    ]),
    el('div', { id: 'team-body' }, loading())
  );
  await reload();
}

async function reload() {
  const body = document.getElementById('team-body');
  if (!body) return;
  try {
    const [team, theme, sprints] = await Promise.all([api.team(), api.squadsFull(), api.sprints()]);
    applySquadTheme(theme.squads, theme.global);
    const squads = theme.squads || [];
    const members = team.members || [];
    const capacity = await api.teamCapacity(sprintFilter);
    const capById = new Map(capacity.members.map((m) => [m.id, m]));

    if (!members.length && !squads.length) {
      body.replaceChildren(
        el('div', { class: 'bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500' }, [
          el('p', { class: 'mb-3' }, 'Nenhuma pessoa ou squad ainda.'),
          primaryBtn('Adicionar a primeira pessoa', () => openMemberForm()),
        ])
      );
      return;
    }

    body.replaceChildren(
      capacitySection(capacity, sprints),
      rosterSection(members, squads, capById),
      ownershipSection(squads, members)
    );
  } catch (err) {
    body.replaceChildren(errorBox(err.message));
  }
}

// ---- Capacidade ----
function capacitySection(capacity, sprints) {
  const sprintSel = select(
    [{ value: '', label: 'Todas as sprints' }, ...sprints.map((s) => ({ value: s.id, label: s.id }))],
    sprintFilter || '',
    { onchange: (e) => { sprintFilter = e.target.value || null; reload(); } }
  );
  sprintSel.className = 'border border-slate-300 rounded-md px-2 py-1 text-sm';

  const rows = capacity.members.map((m) => {
    const cap = m.capacity || 0;
    const pct = cap > 0 ? Math.round((m.allocated / cap) * 100) : 0;
    const over = cap > 0 && m.allocated > cap;
    const barColor = over ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500';
    return el('div', { class: 'flex items-center gap-3' }, [
      el('div', { class: 'w-40 shrink-0 text-sm text-slate-700 truncate' }, m.name),
      el('div', { class: 'flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden' }, [
        el('div', { class: `h-full ${barColor}`, style: `width:${cap > 0 ? Math.min(100, pct) : 0}%` }),
      ]),
      el('div', { class: `w-24 shrink-0 text-right text-xs ${over ? 'text-red-600 font-semibold' : 'text-slate-500'}` },
        cap > 0 ? `${m.allocated}/${cap} pts` : `${m.allocated} pts`),
    ]);
  });

  return el('section', { class: 'mb-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm' }, [
    el('div', { class: 'flex items-center justify-between mb-4' }, [
      el('h2', { class: 'text-sm font-semibold uppercase tracking-wide text-slate-500' }, 'Capacidade & alocação'),
      sprintSel,
    ]),
    rows.length ? el('div', { class: 'space-y-2.5' }, rows) : el('p', { class: 'text-sm text-slate-400 italic' }, 'Sem pessoas no roster.'),
  ]);
}

// ---- Roster ----
function rosterSection(members, squads, capById) {
  const bySquad = new Map();
  members.forEach((m) => {
    const key = m.squad || '__none';
    (bySquad.get(key) || bySquad.set(key, []).get(key)).push(m);
  });
  const squadName = (id) => squads.find((s) => s.id === id)?.name || (id === '__none' ? 'Sem squad' : id);

  const groups = [...bySquad.entries()].map(([squadId, list]) =>
    el('section', { class: 'mb-6' }, [
      el('h3', { class: 'text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2' }, [
        squadId !== '__none'
          ? el('span', { class: 'text-xs font-semibold px-2 py-0.5 rounded-full', style: squadPillStyle(squadId) }, squadName(squadId))
          : el('span', { class: 'text-slate-500' }, 'Sem squad'),
        el('span', { class: 'text-xs text-slate-400' }, `(${list.length})`),
      ]),
      el('div', { class: 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3' }, list.map((m) => memberCard(m, capById.get(m.id)))),
    ])
  );

  return el('div', {}, [
    el('h2', { class: 'text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3' }, 'Roster'),
    ...groups,
  ]);
}

function memberCard(m, cap) {
  const skills = (m.skills || []).slice(0, 5);
  return el('button', {
    type: 'button',
    class: 'text-left bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition',
    onclick: () => openMember(m.id),
  }, [
    el('div', { class: 'flex items-center gap-3 mb-2' }, [
      el('div', { class: 'w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold shrink-0' }, initials(m.name)),
      el('div', { class: 'min-w-0' }, [
        el('div', { class: 'font-medium text-slate-800 truncate' }, m.name),
        el('div', { class: 'text-xs text-slate-500' }, [ROLE_LABEL[m.role] || m.role, m.seniority ? ` · ${m.seniority}` : ''].join('')),
      ]),
    ]),
    skills.length ? el('div', { class: 'flex flex-wrap gap-1 mb-2' }, skills.map((s) =>
      el('span', { class: 'text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600' }, s))) : null,
    cap ? el('div', { class: 'text-[11px] text-slate-400' }, `capacidade: ${cap.allocated}/${cap.capacity || 0} pts`) : null,
  ]);
}

// ---- Ownership ----
function ownershipSection(squads, members) {
  if (!squads.length) return el('div', {});
  const countBy = (id) => members.filter((m) => m.squad === id).length;
  return el('section', { class: 'mt-8' }, [
    el('h2', { class: 'text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3' }, 'Ownership (squads)'),
    el('div', { class: 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3' }, squads.map((sq) =>
      el('div', {
        class: 'rounded-xl border overflow-hidden shadow-sm',
        style: `border-color:${sq.color?.border || '#e2e8f0'};${squadSectionStyle(sq.id)}`,
      }, [
        el('div', { class: 'p-4' }, [
          el('div', { class: 'flex items-start justify-between gap-2 mb-1' }, [
            el('span', { class: 'text-xs font-semibold px-2.5 py-0.5 rounded-full', style: squadPillStyle(sq.id) }, sq.name || sq.label),
            el('button', { type: 'button', class: 'text-[10px] text-slate-400 hover:text-red-600', onclick: () => removeSquad(sq.id) }, 'remover'),
          ]),
          el('p', { class: 'text-sm text-slate-600 leading-snug' }, sq.mission || el('span', { class: 'italic text-slate-400' }, 'sem missão definida')),
          el('div', { class: 'text-[11px] text-slate-400 mt-2' }, `${countBy(sq.id)} pessoa(s)`),
        ]),
      ])
    )),
  ]);
}

// ---- Forms: pessoa ----
function openMemberForm() {
  const name = input({ placeholder: 'Nome', required: 'true' });
  const roleSel = select(ROLE_OPTIONS.map((r) => ({ value: r, label: ROLE_LABEL[r] })), 'developer');
  const senioritySel = select(SENIORITY_OPTIONS.map((s) => ({ value: s, label: s || '—' })), '');
  const capacity = input({ type: 'number', min: '0', value: '0' });
  const skills = input({ placeholder: 'node, sql, liderança (separe por vírgula)' });
  const squadSel = squadSelectEl();

  const form = el('div', { class: 'space-y-4' }, [
    field('Nome', name),
    el('div', { class: 'grid grid-cols-2 gap-4' }, [field('Papel', roleSel), field('Senioridade', senioritySel)]),
    el('div', { class: 'grid grid-cols-2 gap-4' }, [field('Capacidade (pts/sprint)', capacity), field('Squad', squadSel)]),
    field('Skills', skills),
    el('div', { class: 'flex justify-end gap-2 pt-2' }, [
      ghostBtn('Cancelar', closeModal),
      primaryBtn('Adicionar', async () => {
        if (!name.value.trim()) return showToast('Nome é obrigatório', 'error');
        try {
          await api.createMember({
            name: name.value.trim(),
            role: roleSel.value,
            seniority: senioritySel.value || null,
            capacityPoints: Number(capacity.value) || 0,
            squad: squadSel.value || null,
            skills: skills.value.split(',').map((s) => s.trim()).filter(Boolean),
          });
          closeModal();
          showToast('Pessoa adicionada');
          reload();
        } catch (e) { showToast(e.message, 'error'); }
      }),
    ]),
  ]);
  openModal('Nova pessoa', form);
}

function squadSelectEl(value = '') {
  const node = select([{ value: '', label: '— sem squad —' }], value);
  // popula async
  api.squads().then((squads) => {
    for (const sq of squads) {
      const o = el('option', { value: sq.id }, sq.name || sq.label || sq.id);
      if (sq.id === value) o.selected = true;
      node.append(o);
    }
  });
  return node;
}

async function openMember(id) {
  try {
    const [team, oneOnOnes, goals] = await Promise.all([api.team(), api.oneOnOnes(id), api.growthGoals(id)]);
    const m = (team.members || []).find((x) => x.id === id);
    if (!m) return showToast('Pessoa não encontrada', 'error');

    const name = input({ value: m.name });
    const roleSel = select(ROLE_OPTIONS.map((r) => ({ value: r, label: ROLE_LABEL[r] })), m.role);
    const senioritySel = select(SENIORITY_OPTIONS.map((s) => ({ value: s, label: s || '—' })), m.seniority || '');
    const capacity = input({ type: 'number', min: '0', value: String(m.capacityPoints || 0) });
    const skills = input({ value: (m.skills || []).join(', ') });
    const squadSel = squadSelectEl(m.squad || '');

    const editForm = el('div', { class: 'space-y-4' }, [
      field('Nome', name),
      el('div', { class: 'grid grid-cols-2 gap-4' }, [field('Papel', roleSel), field('Senioridade', senioritySel)]),
      el('div', { class: 'grid grid-cols-2 gap-4' }, [field('Capacidade (pts/sprint)', capacity), field('Squad', squadSel)]),
      field('Skills', skills),
      el('div', { class: 'flex justify-between gap-2 pt-1' }, [
        el('button', { type: 'button', class: 'text-sm text-red-600 hover:underline', onclick: async () => {
          if (!confirm(`Remover ${m.name} do time?`)) return;
          try { await api.deleteMember(id); closeModal(); showToast('Pessoa removida'); reload(); }
          catch (e) { showToast(e.message, 'error'); }
        } }, 'Remover pessoa'),
        primaryBtn('Salvar', async () => {
          try {
            await api.patchMember(id, {
              name: name.value.trim(),
              role: roleSel.value,
              seniority: senioritySel.value || null,
              capacityPoints: Number(capacity.value) || 0,
              squad: squadSel.value || null,
              skills: skills.value.split(',').map((s) => s.trim()).filter(Boolean),
            });
            showToast('Salvo');
            reload();
          } catch (e) { showToast(e.message, 'error'); }
        }),
      ]),
    ]);

    const body = el('div', { class: 'space-y-6' }, [
      editForm,
      sectionBlock('1:1s', oneOnOneBlock(id, oneOnOnes)),
      sectionBlock('Metas de crescimento', growthBlock(id, goals)),
    ]);
    openModal(m.name, body, { subtitle: `${ROLE_LABEL[m.role] || m.role}${m.seniority ? ' · ' + m.seniority : ''}`, size: 'lg' });
  } catch (e) { showToast(e.message, 'error'); }
}

function sectionBlock(title, node) {
  return el('div', { class: 'border-t border-slate-100 pt-4' }, [
    el('h3', { class: 'text-sm font-semibold text-slate-700 mb-3' }, title),
    node,
  ]);
}

function oneOnOneBlock(memberId, list) {
  const notes = el('textarea', { class: INPUT_CLASS, rows: '2', placeholder: 'Notas da conversa' });
  const actions = input({ placeholder: 'Ações combinadas' });
  const sentSel = select([{ value: '', label: 'Sentimento' }, ...Object.entries(SENTIMENT).map(([v, l]) => ({ value: v, label: l }))], '');
  const listEl = el('div', { class: 'space-y-2 mb-3' }, list.length ? list.map((o) =>
    el('div', { class: 'text-sm border border-slate-200 rounded-lg p-3' }, [
      el('div', { class: 'flex items-center justify-between mb-1' }, [
        el('span', { class: 'text-xs text-slate-500' }, `${o.date}${o.sentiment ? ' · ' + (SENTIMENT[o.sentiment] || o.sentiment) : ''}`),
        el('button', { type: 'button', class: 'text-[10px] text-slate-400 hover:text-red-600', onclick: async () => {
          try { await api.deleteOneOnOne(o.id); openMember(memberId); } catch (e) { showToast(e.message, 'error'); }
        } }, 'excluir'),
      ]),
      el('div', { class: 'prose prose-sm max-w-none', html: o.bodyHtml }),
    ])
  ) : el('p', { class: 'text-xs text-slate-400 italic' }, 'Nenhum 1:1 registrado.'));

  return el('div', {}, [
    listEl,
    el('div', { class: 'space-y-2 bg-slate-50 rounded-lg p-3' }, [
      notes,
      el('div', { class: 'grid grid-cols-2 gap-2' }, [actions, sentSel]),
      el('div', { class: 'flex justify-end' }, [
        primaryBtn('Registrar 1:1', async () => {
          try {
            await api.createOneOnOne({ member: memberId, notes: notes.value, actions: actions.value, sentiment: sentSel.value || null });
            showToast('1:1 registrado');
            openMember(memberId);
          } catch (e) { showToast(e.message, 'error'); }
        }),
      ]),
    ]),
  ]);
}

function growthBlock(memberId, list) {
  const title = input({ placeholder: 'Meta de crescimento' });
  const desc = input({ placeholder: 'Descrição (opcional)' });
  const listEl = el('div', { class: 'space-y-2 mb-3' }, list.length ? list.map((g) => {
    const statusSel = select(Object.entries(GROWTH_STATUS).map(([v, l]) => ({ value: v, label: l })), g.status, {
      onchange: async (e) => { try { await api.patchGrowthGoal(g.id, { status: e.target.value }); showToast('Atualizada'); } catch (err) { showToast(err.message, 'error'); } },
    });
    statusSel.className = 'text-xs border border-slate-300 rounded px-1.5 py-0.5';
    return el('div', { class: 'text-sm border border-slate-200 rounded-lg p-3' }, [
      el('div', { class: 'flex items-center justify-between gap-2 mb-1' }, [
        el('span', { class: 'font-medium text-slate-700' }, (g.bodyRaw || '').split('\n')[0].replace(/^#\s*/, '') || g.id),
        el('div', { class: 'flex items-center gap-2' }, [
          statusBadge(GROWTH_STATUS[g.status] || g.status, GROWTH_STATUS_CLASS[g.status] ? { [GROWTH_STATUS[g.status]]: GROWTH_STATUS_CLASS[g.status] } : {}),
          statusSel,
          el('button', { type: 'button', class: 'text-[10px] text-slate-400 hover:text-red-600', onclick: async () => {
            try { await api.deleteGrowthGoal(g.id); openMember(memberId); } catch (e) { showToast(e.message, 'error'); }
          } }, 'excluir'),
        ]),
      ]),
    ]);
  }) : el('p', { class: 'text-xs text-slate-400 italic' }, 'Nenhuma meta ainda.'));

  return el('div', {}, [
    listEl,
    el('div', { class: 'space-y-2 bg-slate-50 rounded-lg p-3' }, [
      title,
      desc,
      el('div', { class: 'flex justify-end' }, [
        primaryBtn('Adicionar meta', async () => {
          if (!title.value.trim()) return showToast('Título é obrigatório', 'error');
          try {
            await api.createGrowthGoal({ member: memberId, title: title.value.trim(), description: desc.value });
            showToast('Meta adicionada');
            openMember(memberId);
          } catch (e) { showToast(e.message, 'error'); }
        }),
      ]),
    ]),
  ]);
}

// ---- Forms: squad ----
function openSquadForm() {
  const name = input({ placeholder: 'Nome do squad' });
  const mission = input({ placeholder: 'Missão (o que esse squad é dono)' });
  const topoSel = select([
    { value: 'stream-aligned', label: 'Stream-aligned' },
    { value: 'platform', label: 'Plataforma' },
    { value: 'enabling', label: 'Enabling' },
  ], 'stream-aligned');
  const form = el('div', { class: 'space-y-4' }, [
    field('Nome', name),
    field('Missão', mission),
    field('Topologia', topoSel),
    el('div', { class: 'flex justify-end gap-2 pt-2' }, [
      ghostBtn('Cancelar', closeModal),
      primaryBtn('Criar squad', async () => {
        if (!name.value.trim()) return showToast('Nome é obrigatório', 'error');
        try {
          await api.createSquad({ name: name.value.trim(), mission: mission.value.trim() || null, topology: topoSel.value });
          closeModal();
          showToast('Squad criado');
          reload();
        } catch (e) { showToast(e.message, 'error'); }
      }),
    ]),
  ]);
  openModal('Novo squad', form);
}

async function removeSquad(id) {
  if (!confirm(`Remover o squad "${id}"?`)) return;
  try { await api.deleteSquad(id); showToast('Squad removido'); reload(); }
  catch (e) { showToast(e.message, 'error'); }
}

export { ROLE_LABEL };
