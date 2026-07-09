import { api } from './api.js';
import { el, openModal, closeModal, showToast, priorityBadge, loading, errorBox } from './ui.js';
import { createSelect, fieldLabel } from './select.js';
import { applySquadTheme, squadBadgeClass } from './squadTheme.js';
import { buildOrderIndex, displayOrder, sortStories } from './storyOrder.js';

const COLUMNS = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'todo', label: 'To do' },
  { key: 'in-progress', label: 'In progress' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' },
];

let stories = [];
let squads = [];
let teamMembers = [];

const squadById = (id) => squads.find((s) => s.id === id) || null;
const memberById = (id) => {
  if (id == null || id === '') return null;
  const key = String(id).toLowerCase();
  return teamMembers.find((m) => String(m.id).toLowerCase() === key) || null;
};
const memberName = (id) => memberById(id)?.name || id;
const squadLabel = (id) => squadById(id)?.name || squadById(id)?.label || id || null;
const squadClass = (id) => squadBadgeClass(id);

const getStory = (id) => stories.find((s) => String(s.id).toUpperCase() === String(id).toUpperCase()) || null;
const childrenOf = (id) => stories.filter((s) => String(s.parent || '').toUpperCase() === String(id).toUpperCase());

// Filtros globais do board (combináveis).
// tags: conjunto de tags; tagMode: 'any' | 'all'; scope: 'all' | 'roots' | 'children'
// squad / assignee / discipline: null = sem filtro
const filters = { tags: new Set(), tagMode: 'any', scope: 'all', squad: null, assignee: null, discipline: null };

/** Referências da barra de filtros (evita recriar selects a cada clique). */
const filterUi = {
  built: false,
  selects: {},
  tagWrap: null,
  modeBtn: null,
  clearBtn: null,
  countEl: null,
};

function filtersActive() {
  return filters.tags.size > 0
    || filters.tagMode !== 'any'
    || filters.scope !== 'all'
    || filters.squad != null
    || filters.assignee != null
    || filters.discipline != null;
}

function memberOptionLabel(m) {
  if (m.role === 'tech-lead') return `${m.name} (TL)`;
  if (m.role === 'designer' || m.discipline === 'design') return `${m.name} (Design)`;
  return m.name;
}

function normalizePersonId(id) {
  if (id == null || id === '') return null;
  return String(id).toLowerCase();
}

/** História visível para a pessoa: responsável explícito ou não atribuída no squad dela. */
function matchesAssigneeFilter(story, personId) {
  const pid = normalizePersonId(personId);
  if (!pid) return true;

  const member = memberById(pid) || memberById(personId);
  const assigned = (Array.isArray(story.assignees) ? story.assignees : [])
    .map((a) => String(a).toLowerCase());

  if (assigned.includes(pid)) return true;

  // Sem responsável → todo o squad enxerga (até alguém ser atribuído)
  if (assigned.length === 0 && member?.squad && (story.squad || null) === member.squad) {
    return true;
  }

  return false;
}

function matchesDisciplineFilter(story) {
  if (filters.discipline == null) return true;
  const tags = story.tags || [];
  if (filters.discipline === 'design') {
    return story.squad === 'design' || tags.includes('design');
  }
  if (filters.discipline === 'backend') {
    return tags.includes('back') || tags.includes('devops');
  }
  if (filters.discipline === 'frontend-web') {
    return tags.includes('web') || tags.includes('front');
  }
  if (filters.discipline === 'frontend-mobile') {
    return tags.includes('mobile');
  }
  return true;
}

function matchesFilters(s) {
  if (filters.scope === 'roots' && s.parent) return false;
  if (filters.scope === 'children' && !s.parent) return false;
  if (filters.squad != null && (s.squad || null) !== filters.squad) return false;
  if (filters.assignee != null && !matchesAssigneeFilter(s, filters.assignee)) return false;
  if (!matchesDisciplineFilter(s)) return false;
  if (filters.tags.size) {
    const st = new Set(s.tags || []);
    const sel = [...filters.tags];
    const ok = filters.tagMode === 'all'
      ? sel.every((t) => st.has(t))
      : sel.some((t) => st.has(t));
    if (!ok) return false;
  }
  return true;
}

const visibleStories = () => stories.filter(matchesFilters);

// Todas as tags conhecidas: presets + as que aparecem nos dados.
function allTags() {
  const set = new Set(TAG_PRESETS);
  stories.forEach((s) => (s.tags || []).forEach((t) => set.add(t)));
  return [...set];
}

const STATUS_LABEL = {
  backlog: 'Backlog', todo: 'To do', 'in-progress': 'In progress',
  review: 'Review', done: 'Done', cancelled: 'Cancelado',
};
const STATUS_DOT = {
  backlog: 'bg-slate-300', todo: 'bg-sky-400', 'in-progress': 'bg-amber-400',
  review: 'bg-violet-400', done: 'bg-emerald-500', cancelled: 'bg-slate-400',
};

// Tipo do card: pinta a borda superior (3px) e ganha um badge.
const KIND = {
  bug: { label: '🐞 Bug', border: 'border-t-[3px] border-t-red-500', badge: 'bg-red-100 text-red-700' },
  feature: { label: '✨ Feature', border: 'border-t-[3px] border-t-blue-500', badge: 'bg-blue-100 text-blue-700' },
  chore: { label: '🔧 Chore', border: 'border-t-[3px] border-t-slate-400', badge: 'bg-slate-200 text-slate-600' },
  planning: { label: '🗂️ Planejamento', border: 'border-t-[3px] border-t-amber-500', badge: 'bg-amber-100 text-amber-700' },
  docs: { label: '📄 Docs', border: 'border-t-[3px] border-t-teal-500', badge: 'bg-teal-100 text-teal-700' },
  spike: { label: '🔬 Spike', border: 'border-t-[3px] border-t-fuchsia-500', badge: 'bg-fuchsia-100 text-fuchsia-700' },
  design: { label: '🎨 Design', border: 'border-t-[3px] border-t-pink-500', badge: 'bg-pink-100 text-pink-700' },
};
const kindMeta = (k) => KIND[k] || null;

// Tags de disciplina. Presets com atalho; qualquer texto livre também é aceito.
const TAG_PRESETS = ['web', 'mobile', 'back', 'design', 'devops', 'test'];
const TAG_CLASS = {
  web: 'bg-sky-100 text-sky-700',
  front: 'bg-sky-100 text-sky-700',
  back: 'bg-emerald-100 text-emerald-700',
  mobile: 'bg-violet-100 text-violet-700',
  design: 'bg-pink-100 text-pink-700',
  devops: 'bg-amber-100 text-amber-700',
  test: 'bg-rose-100 text-rose-700',
  _: 'bg-slate-100 text-slate-600',
};
const tagClass = (t) => TAG_CLASS[t] || TAG_CLASS._;

const LINK_TYPE_META = {
  branch: { label: 'Branch', icon: '⎇', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  commit: { label: 'Commit', icon: '●', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  pr: { label: 'PR', icon: '⇄', badge: 'bg-violet-50 text-violet-700 border-violet-200' },
  repo: { label: 'Repo', icon: '◫', badge: 'bg-slate-100 text-slate-700 border-slate-200' },
  other: { label: 'Link', icon: '🔗', badge: 'bg-sky-50 text-sky-700 border-sky-200' },
};

function slugForBranch(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

/** Padrão canônico: feature/STORY-047-cadastro-mei */
function suggestBranchName(story) {
  const slug = slugForBranch(titleOf(story).replace(/\s*—\s*(web|mobile|frontend)\s*$/i, ''));
  return `feature/${story.id}${slug ? `-${slug}` : ''}`;
}

function suggestCommitPrefix(story) {
  return `${story.id}:`;
}

// Recarrega todas as histórias do servidor e redesenha o board.
// Usado após criar/remover tarefas-filhas, quando o parent de outras pode mudar.
async function reloadStories() {
  stories = await api.stories();
  rebuildFilterBar(document.getElementById('filterbar'));
  refreshBoard();
}

export async function render(container) {
  filterUi.built = false;
  container.replaceChildren(
    header(),
    el('div', { id: 'filterbar', class: 'mb-4' }),
    el('div', { id: 'board', class: 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4' }, loading())
  );
  try {
    const [storiesRes, theme, teamRes] = await Promise.all([
      api.stories(),
      fetch('/api/squads/full').then((r) => r.json()),
      api.team().catch(() => ({ members: [] })),
    ]);
    stories = storiesRes;
    squads = theme.squads || [];
    teamMembers = teamRes.members || [];
    applySquadTheme(theme.squads, theme.global);
    rebuildFilterBar(container.querySelector('#filterbar'));
    drawBoard(container.querySelector('#board'));
  } catch (err) {
    container.querySelector('#board').replaceChildren(errorBox(err.message));
  }
}

// Barra de filtros — montada uma vez; estado sincronizado sem destruir os selects.
function renderFilterBar(bar) {
  if (!bar) return;
  if (filterUi.built && bar.firstChild) {
    syncFilterBar();
    return;
  }
  filterUi.built = false;
  rebuildFilterBar(bar);
}

function rebuildFilterBar(bar) {
  if (!bar) return;
  filterUi.built = true;
  filterUi.selects = {};

  filterUi.tagWrap = el('div', { class: 'flex flex-wrap gap-1 items-center' });
  filterUi.modeBtn = el('button', {
    type: 'button',
    class: 'text-xs px-2 py-0.5 rounded-md border border-slate-300 text-slate-600 hover:border-slate-400',
    title: 'Alternar entre casar QUALQUER tag ou TODAS as tags selecionadas',
  });
  filterUi.modeBtn.addEventListener('click', () => {
    filters.tagMode = filters.tagMode === 'all' ? 'any' : 'all';
    syncFilterBar();
    refreshBoard();
  });

  filterUi.clearBtn = el('button', {
    type: 'button',
    class: 'text-xs px-2 py-0.5 rounded-md',
  }, 'limpar');
  filterUi.clearBtn.addEventListener('click', () => {
    if (!filtersActive()) return;
    filters.tags.clear();
    filters.tagMode = 'any';
    filters.scope = 'all';
    filters.squad = null;
    filters.assignee = null;
    filters.discipline = null;
    syncFilterBar();
    refreshBoard();
  });

  filterUi.countEl = el('span', { class: 'text-xs text-slate-400' });

  const scopeSel = createSelect({
    size: 'sm',
    className: 'w-auto min-w-[8.5rem]',
    value: filters.scope,
    options: [
      { value: 'all', label: 'Todas' },
      { value: 'roots', label: 'Só principais' },
      { value: 'children', label: 'Só subtasks' },
    ],
    onChange: (v) => { filters.scope = v || 'all'; syncFilterBar(); refreshBoard(); },
  });
  filterUi.selects.scope = scopeSel;

  const squadSel = createSelect({
    size: 'sm',
    className: 'w-auto min-w-[10rem]',
    value: filters.squad,
    allowEmpty: true,
    emptyLabel: 'Todos os squads',
    placeholder: 'Todos os squads',
    options: squads.map((sq) => ({ value: sq.id, label: sq.label })),
    onChange: (v) => { filters.squad = v; syncFilterBar(); refreshBoard(); },
  });
  filterUi.selects.squad = squadSel;

  const disciplineSel = createSelect({
    size: 'sm',
    className: 'w-auto min-w-[9rem]',
    value: filters.discipline,
    allowEmpty: true,
    emptyLabel: 'Todas disciplinas',
    placeholder: 'Todas disciplinas',
    options: [
      { value: 'design', label: 'Design (Claude Design)' },
      { value: 'backend', label: 'Backend' },
      { value: 'frontend-web', label: 'Frontend Web' },
      { value: 'frontend-mobile', label: 'Frontend Mobile' },
    ],
    onChange: (v) => { filters.discipline = v; syncFilterBar(); refreshBoard(); },
  });
  filterUi.selects.discipline = disciplineSel;

  const assigneeSel = createSelect({
    size: 'sm',
    className: 'w-auto min-w-[11rem]',
    value: filters.assignee,
    allowEmpty: true,
    emptyLabel: 'Todas as pessoas',
    placeholder: 'Todas as pessoas',
    options: [...teamMembers]
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      .map((m) => ({
        value: m.id,
        label: memberOptionLabel(m),
        hint: squadLabel(m.squad),
      })),
    onChange: (v) => {
      filters.assignee = normalizePersonId(v);
      syncFilterBar();
      refreshBoard();
    },
  });
  filterUi.selects.assignee = assigneeSel;

  bar.replaceChildren(el('div', { class: 'flex flex-col gap-2' }, [
    el('div', { class: 'flex items-center gap-2 flex-wrap' }, [
      el('span', { class: 'text-xs font-semibold text-slate-500 mr-1' }, 'Filtrar:'),
      squadSel.root,
      disciplineSel.root,
      assigneeSel.root,
      el('span', { class: 'text-slate-300 hidden sm:inline' }, '·'),
      filterUi.tagWrap,
      el('span', { class: 'text-slate-300 hidden sm:inline' }, '·'),
      filterUi.modeBtn,
      scopeSel.root,
      filterUi.countEl,
      filterUi.clearBtn,
    ]),
    teamMembers.length
      ? el('p', {
          class: 'text-[11px] text-slate-400',
          id: 'filter-assignee-hint',
        }, 'Pessoa: histórias atribuídas a ela ou sem responsável no squad dela.')
      : el('p', { class: 'text-[11px] text-amber-600' }, 'Time não carregado — reinicie o servidor do gerenciador.'),
  ]));

  syncFilterBar();
}

function renderTagChips() {
  if (!filterUi.tagWrap) return;
  filterUi.tagWrap.replaceChildren(...allTags().map((t) => {
    const on = filters.tags.has(t);
    const b = el('button', {
      type: 'button',
      class: `text-xs px-2 py-0.5 rounded-full border transition ${
        on ? `${tagClass(t)} border-transparent ring-2 ring-offset-1 ring-slate-400` : 'border-slate-300 text-slate-500 hover:border-slate-400'
      }`,
    }, t);
    b.addEventListener('click', () => {
      if (filters.tags.has(t)) filters.tags.delete(t);
      else filters.tags.add(t);
      syncFilterBar();
      refreshBoard();
    });
    return b;
  }));
}

function syncFilterBar() {
  filterUi.selects.scope?.setValue(filters.scope);
  filterUi.selects.squad?.setValue(filters.squad);
  filterUi.selects.discipline?.setValue(filters.discipline);
  filterUi.selects.assignee?.setValue(filters.assignee);
  renderTagChips();

  if (filterUi.modeBtn) {
    filterUi.modeBtn.textContent = filters.tagMode === 'all' ? 'todas as tags' : 'qualquer tag';
    filterUi.modeBtn.disabled = filters.tags.size < 2;
    filterUi.modeBtn.classList.toggle('opacity-40', filters.tags.size < 2);
    filterUi.modeBtn.classList.toggle('cursor-not-allowed', filters.tags.size < 2);
  }

  const active = filtersActive();
  if (filterUi.clearBtn) {
    filterUi.clearBtn.className = `text-xs px-2 py-0.5 rounded-md ${active ? 'text-indigo-600 hover:underline' : 'text-slate-300 cursor-default'}`;
    filterUi.clearBtn.disabled = !active;
  }

  const visible = visibleStories().length;
  const total = stories.length;
  if (filterUi.countEl) {
    if (active) {
      filterUi.countEl.textContent = `${visible} de ${total} história${total === 1 ? '' : 's'}`;
      if (visible === 0 && filters.assignee != null) {
        filterUi.countEl.title = 'Nenhuma história para essa pessoa com os filtros atuais.';
      } else {
        filterUi.countEl.removeAttribute('title');
      }
    } else {
      filterUi.countEl.textContent = '';
      filterUi.countEl.removeAttribute('title');
    }
  }
}

// Redesenha o board mantendo a barra de filtros estável.
function refreshBoard() {
  const board = document.getElementById('board');
  if (board) drawBoard(board);
  syncFilterBar();
}

function header() {
  return el('div', { class: 'flex items-center justify-between mb-6' }, [
    el('div', {}, [
      el('h1', { class: 'text-2xl font-bold text-slate-900' }, 'Kanban'),
      el('p', { class: 'text-sm text-slate-500' }, 'Histórias ordenadas por ordem de execução (menor = primeiro)'),
    ]),
    el('button', {
      class: 'bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md',
      onclick: openCreateModal,
    }, '+ Nova história'),
  ]);
}

function drawBoard(board) {
  const source = visibleStories();
  const filtered = filtersActive();
  const orderIndex = buildOrderIndex(stories);

  board.replaceChildren(...COLUMNS.map((col) => {
    const items = sortStories(source.filter((s) => s.status === col.key));
    // lista de cards com scroll próprio; o cabeçalho da coluna fica fixo
    const cardsWrap = el('div', {
      class: 'flex flex-col gap-3 overflow-y-auto flex-1 pr-1 mt-3 min-h-[60px]',
    }, items.length
      ? items.map((s) => cardEl(s, orderIndex))
      : [filtered && col.key === 'backlog'
          ? el('p', { class: 'text-xs text-slate-400 text-center px-2 py-4' }, 'Nenhuma história com esses filtros.')
          : null].filter(Boolean));

    const column = el('div', {
      class: 'bg-slate-100 rounded-lg p-3 flex flex-col min-h-[120px] max-h-[calc(100vh-9rem)]',
      'data-status': col.key,
    }, [
      el('div', { class: 'flex items-center justify-between px-1 shrink-0' }, [
        el('span', { class: 'text-sm font-semibold text-slate-700' }, col.label),
        el('span', { class: 'text-xs text-slate-500 bg-slate-200 rounded-full px-2 py-0.5' }, String(items.length)),
      ]),
      cardsWrap,
    ]);

    // drop zone
    column.addEventListener('dragover', (e) => { e.preventDefault(); column.classList.add('drop-target'); });
    column.addEventListener('dragleave', () => column.classList.remove('drop-target'));
    column.addEventListener('drop', (e) => {
      e.preventDefault();
      column.classList.remove('drop-target');
      const id = e.dataTransfer.getData('text/plain');
      moveStory(id, col.key, board);
    });

    return column;
  }));
}

function cardEl(story, orderIndex) {
  const kindBorder = KIND[story.kind]?.border || '';
  const ord = displayOrder(story, orderIndex);
  const card = el('div', {
    class: `bg-white rounded-md shadow-sm border border-slate-200 ${kindBorder} p-3 cursor-pointer hover:border-indigo-300`,
    draggable: 'true',
    'data-id': story.id,
    onclick: () => openDetail(story),
  }, [
    el('div', { class: 'flex items-center gap-1.5 mb-1' }, [
      el('span', {
        class: 'text-[10px] font-bold tabular-nums text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5 shrink-0',
        title: 'Ordem de execução (automática)',
      }, ord),
      el('span', { class: `inline-block w-2 h-2 rounded-full ${STATUS_DOT[story.status] || 'bg-slate-300'}` }),
      el('span', { class: 'text-[11px] text-slate-400' }, story.id),
      story.parent ? el('span', { class: 'text-[11px] text-indigo-400', title: `subtask de ${story.parent}` }, `↳ ${story.parent}`) : null,
    ]),
    el('div', { class: 'text-sm font-medium text-slate-800 leading-snug mb-2' }, titleOf(story)),
    el('div', { class: 'flex items-center gap-2 flex-wrap' }, [
      priorityBadge(story.priority),
      story.kind && kindMeta(story.kind)
        ? el('span', { class: `text-[10px] px-1.5 py-0.5 rounded-full ${kindMeta(story.kind).badge}` }, kindMeta(story.kind).label)
        : null,
      el('span', { class: 'text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full' }, `${story.points ?? '?'} pts`),
      story.epic ? el('span', { class: 'text-[11px] text-indigo-600' }, `#${story.epic}`) : null,
      story.squad ? el('span', { class: `text-[10px] px-1.5 py-0.5 rounded-full ${squadClass(story.squad)}`, title: story.squad }, squadLabel(story.squad)) : null,
    ]),
    (story.tags && story.tags.length)
      ? el('div', { class: 'flex flex-wrap gap-1 mt-2' }, story.tags.map((t) =>
          el('span', { class: `text-[10px] px-1.5 py-0.5 rounded-full ${tagClass(t)}` }, t)))
      : null,
    (story.assignees && story.assignees.length)
      ? el('div', { class: 'flex flex-wrap gap-1 mt-2' }, story.assignees.map((id) => {
          const m = memberById(id);
          const isDesigner = m?.role === 'designer' || m?.discipline === 'design';
          return el('span', {
            class: `text-[10px] px-1.5 py-0.5 rounded-full border ${
              isDesigner
                ? 'bg-pink-50 text-pink-700 border-pink-100'
                : 'bg-violet-50 text-violet-700 border-violet-100'
            }`,
            title: m?.squad ? squadLabel(m.squad) : id,
          }, memberName(id));
        }))
      : null,
    cardMeta(story),
  ]);

  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', story.id);
    card.classList.add('dragging');
  });
  card.addEventListener('dragend', () => card.classList.remove('dragging'));
  return card;
}

// Extrai o título do corpo (primeiro # …) ou cai no id.
function titleOf(story) {
  const m = (story.bodyRaw || '').match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : story.id;
}

async function moveStory(id, newStatus, board) {
  const story = stories.find((s) => s.id === id);
  if (!story || story.status === newStatus) return;

  const previous = story.status;
  story.status = newStatus; // otimista
  drawBoard(board);

  try {
    const updated = await api.patchStory(id, { status: newStatus });
    Object.assign(story, updated);
    showToast(`${id} → ${newStatus}`);
  } catch (err) {
    story.status = previous; // rollback visual
    drawBoard(board);
    showToast(err.message, 'error');
  }
}

// Indicadores compactos no rodapé do card: progresso das subtasks (filhas),
// nº de comentários e de anexos. Só aparece o que existir.
function cardMeta(story) {
  const kids = childrenOf(story.id);
  const comments = story.comments || [];
  const attachments = story.attachments || [];
  const chips = [];

  if (kids.length) {
    const done = kids.filter((k) => k.status === 'done').length;
    chips.push(el('span', {
      class: `text-[11px] px-1.5 py-0.5 rounded ${done === kids.length ? 'text-emerald-600' : 'text-slate-500'}`,
    }, `☑ ${done}/${kids.length}`));
  }
  if (comments.length) chips.push(el('span', { class: 'text-[11px] text-slate-500' }, `💬 ${comments.length}`));
  if ((story.links || []).length) chips.push(el('span', { class: 'text-[11px] text-slate-500' }, `🔗 ${story.links.length}`));
  if (attachments.length) chips.push(el('span', { class: 'text-[11px] text-slate-500' }, `📎 ${attachments.length}`));

  if (!chips.length) return null;
  return el('div', { class: 'flex items-center gap-3 mt-2 pt-2 border-t border-slate-100' }, chips);
}

// Substitui a história na lista local, redesenha o board e o modal (se aberto).
function applyUpdate(updated) {
  const i = stories.findIndex((s) => s.id === updated.id);
  if (i >= 0) stories[i] = updated;
  else stories.push(updated);
  refreshBoard();
  renderDetail(updated);
}

function openDetail(story) {
  renderDetail(getStory(story.id) || story);
}

function renderDetail(story) {
  const orderIndex = buildOrderIndex(stories);

  const statusSelect = createSelect({
    value: story.status,
    size: 'sm',
    options: Object.entries(STATUS_LABEL).map(([value, label]) => ({
      value,
      label,
      dot: STATUS_DOT[value],
    })),
    onChange: async (v) => {
      try { applyUpdate(await api.patchStory(story.id, { status: v })); }
      catch (err) { showToast(err.message, 'error'); }
    },
  }).root;

  const kindSelect = createSelect({
    value: story.kind,
    size: 'sm',
    allowEmpty: true,
    emptyLabel: 'Sem tipo',
    placeholder: 'Sem tipo',
    options: Object.entries(KIND).map(([value, meta]) => ({
      value,
      label: meta.label.replace(/^[^\s]+\s/, ''),
    })),
    onChange: async (v) => {
      try { applyUpdate(await api.patchStory(story.id, { kind: v })); }
      catch (err) { showToast(err.message, 'error'); }
    },
  }).root;

  const squadSelect = createSelect({
    value: story.squad,
    size: 'sm',
    allowEmpty: true,
    emptyLabel: 'Sem squad',
    placeholder: 'Sem squad',
    options: squads.map((sq) => ({
      value: sq.id,
      label: sq.name || sq.label,
      hint: sq.topology,
    })),
    onChange: async (v) => {
      try { applyUpdate(await api.patchStory(story.id, { squad: v })); }
      catch (err) { showToast(err.message, 'error'); }
    },
  }).root;

  const metaChips = [
    el('span', {
      class: 'text-xs font-bold tabular-nums text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full',
      title: 'Ordem automática',
    }, displayOrder(story, orderIndex)),
    story.kind && kindMeta(story.kind)
      ? el('span', { class: `text-xs px-2.5 py-1 rounded-full font-medium ${kindMeta(story.kind).badge}` }, kindMeta(story.kind).label)
      : null,
    story.epic ? el('span', { class: 'text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium' }, `#${story.epic}`) : null,
    story.sprint ? el('span', { class: 'text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full font-medium' }, story.sprint) : null,
    el('span', { class: 'text-xs bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full' }, `${story.points ?? '?'} pts`),
  ].filter(Boolean);

  const body = el('div', { class: 'space-y-5' }, [
    parentBanner(story),
    el('div', { class: 'task-modal__meta' }, [
      fieldLabel('Status', statusSelect),
      fieldLabel('Tipo', kindSelect),
      fieldLabel('Squad', squadSelect),
      fieldLabel('Prioridade', el('div', { class: 'flex items-center min-h-[2rem]' }, priorityBadge(story.priority))),
    ]),
    metaChips.length ? el('div', { class: 'task-modal__chips' }, metaChips) : null,
    el('div', { class: 'task-modal__section' }, [
      el('div', { class: 'task-modal__section-title' }, 'Responsáveis'),
      assigneesSection(story),
    ]),
    el('div', { class: 'task-modal__section' }, [
      el('div', { class: 'task-modal__section-title' }, 'Tags'),
      tagsSection(story),
    ]),
    el('div', { class: 'task-modal__section' }, [
      el('div', { class: 'task-modal__section-title' }, 'Descrição'),
      el('div', { class: 'task-modal__description' }, [
        el('div', { class: 'prose', html: story.bodyHtml || '<p class="text-slate-400">Sem descrição.</p>' }),
      ]),
    ]),
    el('div', { class: 'task-modal__section' }, subtasksSection(story, orderIndex)),
    el('div', { class: 'task-modal__section' }, linksSection(story)),
    el('div', { class: 'task-modal__section' }, attachmentsSection(story)),
    el('div', { class: 'task-modal__section' }, commentsSection(story)),
    dangerZone(story),
  ]);

  openModal(story.id, body, { subtitle: titleOf(story), size: 'lg' });
}

// Rodapé do detalhe: arquivar/restaurar e excluir.
function dangerZone(story) {
  const refresh = async () => {
    await reloadStories();
    const board = document.getElementById('board');
    if (board) drawBoard(board);
  };
  const archived = story.status === 'cancelled';

  const archiveBtn = el('button', {
    class: 'text-sm text-slate-500 hover:text-slate-800',
    onclick: async () => {
      try {
        await api.patchStory(story.id, { status: archived ? 'backlog' : 'cancelled' });
        await refresh();
        closeModal();
        showToast(archived ? `${story.id} restaurada` : `${story.id} arquivada`);
      } catch (err) { showToast(err.message, 'error'); }
    },
  }, archived ? '↩ Restaurar' : 'Arquivar');

  const deleteBtn = el('button', {
    class: 'text-sm text-red-600 hover:text-red-800',
    onclick: async () => {
      if (!confirm(`Excluir ${story.id}? Esta ação remove o arquivo da história.`)) return;
      try {
        await api.deleteStory(story.id);
        await refresh();
        closeModal();
        showToast(`${story.id} excluída`);
      } catch (err) { showToast(err.message, 'error'); }
    },
  }, 'Excluir');

  return el('div', { class: 'flex items-center justify-end gap-4 pt-4 mt-2 border-t border-slate-100' }, [archiveBtn, deleteBtn]);
}

// Banner no topo do detalhe de uma filha, com link de volta para a mãe.
function parentBanner(story) {
  if (!story.parent) return null;
  const parent = getStory(story.parent);
  if (!parent) {
    return el('div', { class: 'text-xs text-slate-500 bg-indigo-50/60 border border-indigo-100 rounded-lg px-3 py-2.5' },
      `↑ Subtask de ${story.parent} (tarefa-pai não encontrada)`);
  }
  const link = el('button', {
    class: 'text-sm text-indigo-700 hover:text-indigo-900 hover:underline text-left font-medium',
    onclick: () => openDetail(parent),
  }, `↑ Subtask de ${parent.id} — ${titleOf(parent)}`);
  return el('div', { class: 'bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2.5' }, link);
}

// ---- Tags ----
async function setAssignees(story, assignees) {
  try { applyUpdate(await api.patchStory(story.id, { assignees })); }
  catch (err) { showToast(err.message, 'error'); }
}

function sortedMembersForStory(story) {
  const squad = story.squad || null;
  const list = [...teamMembers];
  if (!squad) return list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  return list.sort((a, b) => {
    const aIn = a.squad === squad ? 0 : 1;
    const bIn = b.squad === squad ? 0 : 1;
    if (aIn !== bIn) return aIn - bIn;
    return a.name.localeCompare(b.name, 'pt-BR');
  });
}

function assigneesSection(story) {
  const assigned = new Set(story.assignees || []);
  const hint = story.squad
    ? el('p', { class: 'text-xs text-slate-400 mb-2' }, `Sugestão: membros do squad ${squadLabel(story.squad)} aparecem primeiro.`)
    : null;

  const chips = sortedMembersForStory(story).map((m) => {
    const on = assigned.has(m.id);
    const isLead = m.role === 'tech-lead';
    const isDesigner = m.role === 'designer' || m.discipline === 'design';
    const inSquad = story.squad && m.squad === story.squad;
    const btn = el('button', {
      type: 'button',
      class: `text-xs px-2.5 py-1 rounded-full border transition ${
        on
          ? isDesigner ? 'bg-pink-600 text-white border-pink-600' : 'bg-violet-600 text-white border-violet-600'
          : inSquad
            ? isDesigner
              ? 'bg-pink-50 text-pink-700 border-pink-200 hover:border-pink-400'
              : 'bg-violet-50 text-violet-700 border-violet-200 hover:border-violet-400'
            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
      }`,
      title: [squadLabel(m.squad), m.note, isLead ? 'Tech lead' : isDesigner ? 'Designer' : null].filter(Boolean).join(' · '),
    }, isLead ? `${m.name} · TL` : isDesigner ? `${m.name} · Design` : m.name);
    btn.addEventListener('click', () => {
      const next = new Set(assigned);
      if (on) next.delete(m.id); else next.add(m.id);
      setAssignees(story, [...next]);
    });
    return btn;
  });

  return el('div', {}, [
    hint,
    el('div', { class: 'flex flex-wrap gap-1.5' }, chips),
  ]);
}

async function setTags(story, tags) {
  try { applyUpdate(await api.patchStory(story.id, { tags })); }
  catch (err) { showToast(err.message, 'error'); }
}

function tagsSection(story) {
  const tags = story.tags || [];

  const chips = tags.map((t) => {
    const x = el('button', { class: 'ml-1 text-current opacity-50 hover:opacity-100', title: 'remover' }, '×');
    x.addEventListener('click', () => setTags(story, tags.filter((v) => v !== t)));
    return el('span', { class: `inline-flex items-center text-xs px-2 py-0.5 rounded-full ${tagClass(t)}` }, [t, x]);
  });

  // atalhos para os presets ainda não aplicados
  const presetBtns = TAG_PRESETS.filter((p) => !tags.includes(p)).map((p) => {
    const b = el('button', {
      class: 'text-xs px-2 py-0.5 rounded-full border border-dashed border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-600',
    }, `+ ${p}`);
    b.addEventListener('click', () => setTags(story, [...tags, p]));
    return b;
  });

  const input = el('input', {
    class: 'text-xs border border-slate-300 rounded-md px-2 py-0.5 w-28',
    placeholder: 'tag livre…',
  });
  const addFree = () => {
    const t = input.value.trim().toLowerCase();
    input.value = '';
    if (t && !tags.includes(t)) setTags(story, [...tags, t]);
  };
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addFree(); } });

  return el('div', { class: 'flex items-center gap-1.5 flex-wrap' }, [
    ...chips,
    ...presetBtns,
    input,
  ]);
}

function sectionTitle(text, extra) {
  return el('div', { class: 'flex items-center justify-between mb-3' }, [
    el('h3', { class: 'task-modal__section-title !mb-0' }, text),
    extra || null,
  ]);
}

// ---- Subtasks (histórias-filhas) ----
function subtasksSection(story, orderIndex) {
  const kids = childrenOf(story.id);
  const done = kids.filter((k) => k.status === 'done').length;
  const pct = kids.length ? Math.round((done / kids.length) * 100) : 0;

  const list = el('div', { class: 'space-y-1' }, kids.map((kid) => {
    const open = el('button', {
      class: 'text-sm flex-1 text-left hover:text-indigo-600 flex items-center gap-2',
      onclick: () => openDetail(kid), // navega para a filha
    }, [
      el('span', {
        class: 'text-[10px] font-bold tabular-nums text-indigo-600 shrink-0',
        title: 'Ordem',
      }, displayOrder(kid, orderIndex)),
      el('span', { class: `inline-block w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[kid.status] || 'bg-slate-300'}` }),
      el('span', { class: kid.status === 'done' ? 'line-through text-slate-400' : 'text-slate-700' }, titleOf(kid)),
      el('span', { class: 'text-[11px] text-slate-400' }, kid.id),
    ]);

    const del = el('button', {
      class: 'text-slate-300 hover:text-red-500 text-sm px-1 opacity-0 group-hover:opacity-100 shrink-0',
      title: 'Excluir esta tarefa-filha',
    }, '✕');
    del.addEventListener('click', async () => {
      if (!confirm(`Excluir a tarefa ${kid.id}? Esta ação remove o arquivo dela.`)) return;
      try {
        await api.deleteStory(kid.id);
        await reloadStories();
        renderDetail(getStory(story.id) || story);
        showToast(`${kid.id} excluída`);
      } catch (err) { showToast(err.message, 'error'); }
    });

    return el('div', { class: 'group flex items-center gap-2 py-0.5' }, [open, del]);
  }));

  const input = el('input', {
    class: 'flex-1 border border-slate-300 rounded-md px-3 py-1.5 text-sm',
    placeholder: 'Nova subtask (vira uma tarefa própria) e Enter…',
  });
  const addSub = async () => {
    const title = input.value.trim();
    if (!title) return;
    input.value = '';
    try {
      const child = await api.addSubtask(story.id, { title });
      stories.push(child);
      const board = document.getElementById('board');
      if (board) drawBoard(board);
      renderDetail(getStory(story.id) || story);
      showToast(`${child.id} criada como subtask`);
    } catch (err) { showToast(err.message, 'error'); input.value = title; }
  };
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addSub(); } });
  const addBtn = el('button', { class: 'px-3 py-1.5 text-sm rounded-md bg-slate-800 text-white', onclick: addSub }, 'Add');

  return el('div', {}, [
    sectionTitle('Subtasks', kids.length
      ? el('span', { class: 'text-xs text-slate-500' }, `${done}/${kids.length}`)
      : null),
    kids.length
      ? el('div', { class: 'h-1.5 w-full bg-slate-100 rounded-full mb-3 overflow-hidden' }, [
          el('div', { class: 'h-full bg-indigo-500 rounded-full', style: `width:${pct}%` }),
        ])
      : null,
    kids.length ? list : el('p', { class: 'text-sm text-slate-400 mb-2' }, 'Nenhuma subtask ainda.'),
    el('div', { class: 'flex items-center gap-2 mt-2' }, [input, addBtn]),
  ]);
}

// ---- Links Git ----
function linksSection(story) {
  const links = story.links || [];

  const list = el('div', { class: 'space-y-2 mb-3' }, links.map((link) => {
    const meta = LINK_TYPE_META[link.type] || LINK_TYPE_META.other;
    const del = el('button', {
      class: 'text-slate-300 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 shrink-0',
      title: 'Remover link',
    }, '✕');
    del.addEventListener('click', async (e) => {
      e.preventDefault();
      try { applyUpdate(await api.deleteLink(story.id, link.id)); }
      catch (err) { showToast(err.message, 'error'); }
    });
    const anchor = el('a', {
      href: link.url,
      target: '_blank',
      rel: 'noopener noreferrer',
      class: 'text-sm text-indigo-700 hover:text-indigo-900 hover:underline truncate',
      title: link.url,
    }, link.label || link.url);
    return el('div', { class: 'group flex items-center gap-2 py-1.5 px-2 rounded-md border border-slate-100 bg-slate-50/80' }, [
      el('span', {
        class: `text-[10px] font-semibold px-1.5 py-0.5 rounded border shrink-0 ${meta.badge}`,
        title: meta.label,
      }, `${meta.icon} ${meta.label}`),
      anchor,
      del,
    ]);
  }));

  let typeVal = 'branch';
  const typeSelect = createSelect({
    size: 'sm',
    value: typeVal,
    options: Object.entries(LINK_TYPE_META).map(([value, m]) => ({ value, label: m.label })),
    onChange: (v) => { typeVal = v || 'branch'; },
  }).root;

  const labelInput = el('input', {
    class: 'flex-1 min-w-0 border border-slate-300 rounded-md px-2.5 py-1.5 text-sm',
    placeholder: suggestBranchName(story),
  });
  const urlInput = el('input', {
    class: 'flex-1 min-w-0 border border-slate-300 rounded-md px-2.5 py-1.5 text-sm',
    placeholder: 'https://github.com/SUA-ORG/SEU-REPO/tree/feature/...',
  });

  const fillBranch = el('button', {
    type: 'button',
    class: 'text-xs px-2 py-1 rounded-md border border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-700 whitespace-nowrap',
    title: 'Preenche o nome sugerido da branch (padrão STORY-XXX)',
  }, 'Sugerir branch');
  fillBranch.addEventListener('click', () => {
    labelInput.value = suggestBranchName(story);
    if (typeSelect.querySelector) typeVal = 'branch';
  });

  const addLink = async () => {
    const label = labelInput.value.trim() || suggestBranchName(story);
    const url = urlInput.value.trim();
    if (!url) { showToast('cole a URL do GitHub', 'error'); return; }
    try {
      applyUpdate(await api.addLink(story.id, { type: typeVal, label, url }));
      labelInput.value = '';
      urlInput.value = '';
      showToast('link adicionado');
    } catch (err) { showToast(err.message, 'error'); }
  };

  labelInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); urlInput.focus(); } });
  urlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addLink(); } });

  const addBtn = el('button', {
    class: 'px-3 py-1.5 text-sm rounded-md bg-slate-800 text-white shrink-0',
    onclick: addLink,
  }, 'Add');

  const hint = el('p', { class: 'text-[11px] text-slate-400 mb-2 leading-relaxed' }, [
    'Padrão: branch ',
    el('code', { class: 'text-[10px] bg-slate-100 px-1 rounded' }, suggestBranchName(story)),
    ' · commit ',
    el('code', { class: 'text-[10px] bg-slate-100 px-1 rounded' }, `${suggestCommitPrefix(story)} descrição`),
    ' · doc: ',
    el('a', {
      href: '#docs/vinculo-git-tasks',
      class: 'text-indigo-600 hover:underline',
    }, 'vinculo-git-tasks'),
  ]);

  return el('div', {}, [
    sectionTitle('Links Git', links.length ? el('span', { class: 'text-xs text-slate-500' }, String(links.length)) : null),
    hint,
    links.length ? list : el('p', { class: 'text-sm text-slate-400 mb-2' }, 'Nenhum link ainda.'),
    el('div', { class: 'flex flex-col sm:flex-row gap-2 mb-2' }, [
      el('div', { class: 'w-full sm:w-28 shrink-0' }, typeSelect),
      labelInput,
    ]),
    el('div', { class: 'flex flex-col sm:flex-row gap-2' }, [
      urlInput,
      el('div', { class: 'flex gap-2 shrink-0' }, [fillBranch, addBtn]),
    ]),
  ]);
}

// ---- Anexos de imagem ----
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

async function uploadImages(story, files) {
  for (const file of files) {
    if (!file.type || !file.type.startsWith('image/')) { showToast('só imagens são aceitas', 'error'); continue; }
    try {
      const dataUrl = await fileToDataUrl(file);
      applyUpdate(await api.addAttachment(story.id, { name: file.name || 'colado.png', dataUrl }));
      showToast('imagem anexada');
    } catch (err) { showToast(err.message, 'error'); }
  }
}

function attachmentsSection(story) {
  const atts = story.attachments || [];

  const thumbs = el('div', { class: 'grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3' }, atts.map((att) => {
    const del = el('button', {
      class: 'absolute top-1 right-1 bg-black/60 text-white text-xs rounded w-5 h-5 leading-none opacity-0 group-hover:opacity-100',
      title: 'Remover anexo',
    }, '✕');
    del.addEventListener('click', async (e) => {
      e.stopPropagation();
      try { applyUpdate(await api.deleteAttachment(story.id, att.id)); }
      catch (err) { showToast(err.message, 'error'); }
    });
    const img = el('img', {
      src: att.url,
      alt: att.name,
      class: 'w-full h-24 object-cover rounded-md border border-slate-200',
    });
    return el('a', { href: att.url, target: '_blank', class: 'group relative block', title: att.name }, [img, del]);
  }));

  const fileInput = el('input', { type: 'file', accept: 'image/*', multiple: 'true', class: 'hidden' });
  fileInput.addEventListener('change', () => { uploadImages(story, [...fileInput.files]); fileInput.value = ''; });

  const dropzone = el('div', {
    class: 'border-2 border-dashed border-slate-300 rounded-md p-4 text-center text-sm text-slate-500 cursor-pointer hover:border-indigo-400',
    onclick: () => fileInput.click(),
  }, 'Clique para escolher, arraste ou cole (Ctrl+V) uma imagem aqui');

  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('border-indigo-400'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('border-indigo-400'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-indigo-400');
    uploadImages(story, [...(e.dataTransfer?.files || [])]);
  });
  // colar imagem do clipboard enquanto a zona está no DOM
  dropzone.addEventListener('paste', (e) => {
    const files = [...(e.clipboardData?.items || [])]
      .filter((it) => it.kind === 'file')
      .map((it) => it.getAsFile())
      .filter(Boolean);
    if (files.length) { e.preventDefault(); uploadImages(story, files); }
  });
  dropzone.setAttribute('tabindex', '0');

  return el('div', {}, [
    sectionTitle('Anexos', atts.length ? el('span', { class: 'text-xs text-slate-500' }, String(atts.length)) : null),
    atts.length ? thumbs : null,
    dropzone,
    fileInput,
  ]);
}

// ---- Comentários ----
function fmtDate(iso) {
  try { return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }); }
  catch { return iso || ''; }
}

function commentsSection(story) {
  const comments = story.comments || [];

  const list = el('div', { class: 'space-y-3 mb-3' }, comments.map((c) => {
    const del = el('button', {
      class: 'text-slate-300 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100',
      title: 'Remover comentário',
    }, '✕');
    del.addEventListener('click', async () => {
      try { applyUpdate(await api.deleteComment(story.id, c.id)); }
      catch (err) { showToast(err.message, 'error'); }
    });
    return el('div', { class: 'group bg-slate-50 rounded-md p-3' }, [
      el('div', { class: 'flex items-center justify-between mb-1' }, [
        el('div', { class: 'flex items-center gap-2' }, [
          el('span', { class: 'text-xs font-semibold text-slate-700' }, c.author || 'eu'),
          el('span', { class: 'text-[11px] text-slate-400' }, fmtDate(c.at)),
        ]),
        del,
      ]),
      el('div', { class: 'text-sm text-slate-700 whitespace-pre-wrap' }, c.text),
    ]);
  }));

  const textarea = el('textarea', {
    rows: '2',
    class: 'w-full border border-slate-300 rounded-md px-3 py-2 text-sm',
    placeholder: 'Escreva um comentário… (Ctrl+Enter para enviar)',
  });
  const send = async () => {
    const text = textarea.value.trim();
    if (!text) return;
    textarea.value = '';
    try { applyUpdate(await api.addComment(story.id, { text })); }
    catch (err) { showToast(err.message, 'error'); textarea.value = text; }
  };
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send(); }
  });
  const sendBtn = el('button', { class: 'px-4 py-1.5 text-sm rounded-md bg-indigo-600 text-white', onclick: send }, 'Comentar');

  return el('div', {}, [
    sectionTitle('Comentários', comments.length ? el('span', { class: 'text-xs text-slate-500' }, String(comments.length)) : null),
    comments.length ? list : el('p', { class: 'text-sm text-slate-400 mb-3' }, 'Nenhum comentário ainda.'),
    textarea,
    el('div', { class: 'flex justify-end mt-2' }, sendBtn),
  ]);
}

function openCreateModal() {
  const form = el('form', { class: 'space-y-5' });

  const titleInput = el('input', {
    name: 'title',
    required: 'true',
    class: 'mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400',
    placeholder: 'Ex: Exportar extrato em PDF',
  });

  const epicInput = el('input', {
    name: 'epic',
    value: 'geral',
    class: 'mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400',
  });

  const bodyInput = el('textarea', {
    name: 'body',
    rows: '3',
    class: 'mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400',
    placeholder: 'Como MEI, eu quero…',
  });

  let priorityVal = 'medium';
  let pointsVal = '3';
  let squadVal = null;
  let kindVal = null;

  const prioritySelect = createSelect({
    value: priorityVal,
    options: [
      { value: 'high', label: 'Alta' },
      { value: 'medium', label: 'Média' },
      { value: 'low', label: 'Baixa' },
    ],
    onChange: (v) => { priorityVal = v; },
  }).root;

  const pointsSelect = createSelect({
    value: pointsVal,
    options: ['1', '2', '3', '5', '8', '13'].map((v) => ({ value: v, label: `${v} pts` })),
    onChange: (v) => { pointsVal = v; },
  }).root;

  const squadSelect = createSelect({
    value: squadVal,
    allowEmpty: true,
    emptyLabel: '— nenhum —',
    placeholder: '— nenhum —',
    options: squads.map((sq) => ({ value: sq.id, label: sq.label })),
    onChange: (v) => { squadVal = v; },
  }).root;

  const kindSelect = createSelect({
    value: kindVal,
    allowEmpty: true,
    emptyLabel: '— nenhum —',
    placeholder: '— nenhum —',
    options: Object.entries(KIND).map(([value, meta]) => ({
      value,
      label: meta.label,
    })),
    onChange: (v) => { kindVal = v; },
  }).root;

  form.append(
    fieldLabel('Título', titleInput),
    el('div', { class: 'grid grid-cols-1 sm:grid-cols-2 gap-4' }, [
      fieldLabel('Prioridade', prioritySelect),
      fieldLabel('Pontos', pointsSelect),
      fieldLabel('Squad', squadSelect),
      fieldLabel('Tipo', kindSelect),
      fieldLabel('Epic', epicInput, { className: 'sm:col-span-2' }),
    ]),
    el('div', {}, [
      el('span', { class: 'ui-field__label' }, 'Tags'),
      el('div', { class: 'mt-1 flex flex-wrap gap-3' },
        TAG_PRESETS.map((t) => {
          const cb = el('input', { type: 'checkbox', name: 'tags', value: t, class: 'accent-indigo-600' });
          return el('label', { class: 'inline-flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer' }, [cb, t]);
        })
      ),
    ]),
    fieldLabel('Descrição (opcional)', bodyInput),
    el('div', { class: 'flex justify-end gap-2 pt-2 border-t border-slate-100' }, [
      el('button', {
        type: 'button',
        class: 'px-4 py-2 text-sm rounded-lg border border-slate-300 hover:bg-slate-50',
        onclick: closeModal,
      }, 'Cancelar'),
      el('button', {
        type: 'submit',
        class: 'bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg',
      }, 'Criar história'),
    ])
  );

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tags = [...form.querySelectorAll('input[name="tags"]:checked')].map((i) => i.value);
    try {
      const created = await api.createStory({
        title: titleInput.value.trim(),
        priority: priorityVal,
        points: Number(pointsVal),
        epic: epicInput.value.trim() || 'geral',
        squad: squadVal,
        kind: kindVal,
        tags,
        body: bodyInput.value,
      });
      stories.push(created);
      closeModal();
      showToast(`${created.id} criada`);
      drawBoard(document.getElementById('board'));
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  openModal('Nova história', form, { subtitle: 'Adicionar ao backlog' });
}
