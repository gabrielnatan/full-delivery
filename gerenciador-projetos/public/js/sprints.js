import { api } from './api.js';
import { el, loading, errorBox } from './ui.js';
import { buildOrderIndex, displayOrder, sortStories } from './storyOrder.js';

const STORY_STATUS = {
  backlog: 'bg-slate-100 text-slate-600',
  todo: 'bg-sky-100 text-sky-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  review: 'bg-violet-100 text-violet-700',
  done: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-200 text-slate-400 line-through',
};

export async function render(container) {
  container.replaceChildren(
    el('h1', { class: 'text-2xl font-bold text-slate-900 mb-1' }, 'Sprints'),
    el('p', { class: 'text-sm text-slate-500 mb-6' }, 'Progresso por sprint (join pelo campo sprint: de cada história)'),
    el('div', { id: 'sprint-content' }, loading())
  );
  const content = container.querySelector('#sprint-content');
  try {
    const sprints = await api.sprints();
    if (!sprints.length) return content.replaceChildren(el('p', { class: 'text-slate-500' }, 'Nenhuma sprint encontrada.'));

    const selector = el('select', { class: 'border border-slate-300 rounded-md px-3 py-2 text-sm mb-6' },
      sprints.map((s) => el('option', { value: s.id }, `${s.id} — ${s.status}`))
    );
    const detail = el('div', {});
    selector.addEventListener('change', () => loadSprint(selector.value, detail));

    content.replaceChildren(selector, detail);
    await loadSprint(sprints[0].id, detail);
  } catch (err) {
    content.replaceChildren(errorBox(err.message));
  }
}

async function loadSprint(id, target) {
  target.replaceChildren(loading());
  try {
    const [sprint, allStories] = await Promise.all([api.sprint(id), api.stories()]);
    const orderIndex = buildOrderIndex(allStories);
    const { totalPoints, donePoints, count } = sprint.progress;
    const pct = totalPoints ? Math.round((donePoints / totalPoints) * 100) : 0;
    const objetivo = objectiveOf(sprint.bodyRaw);

    target.replaceChildren(
      el('div', { class: 'bg-white border border-slate-200 rounded-lg p-5 shadow-sm' }, [
        el('div', { class: 'flex items-center justify-between mb-1' }, [
          el('h2', { class: 'text-lg font-semibold text-slate-900' }, sprint.id),
          el('span', { class: 'text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full' }, sprint.status),
        ]),
        el('p', { class: 'text-sm text-slate-500 mb-1' }, `${sprint.start_date || '—'} → ${sprint.end_date || '—'}`),
        objetivo ? el('p', { class: 'text-sm text-slate-700 mb-4' }, objetivo) : el('div', { class: 'mb-4' }),

        // Barra de progresso
        el('div', { class: 'mb-1 flex justify-between text-xs text-slate-500' }, [
          el('span', {}, `${donePoints} de ${totalPoints} pontos concluídos (${count} histórias)`),
          el('span', {}, `${pct}%`),
        ]),
        el('div', { class: 'w-full bg-slate-100 rounded-full h-2.5 mb-5' }, [
          el('div', { class: 'bg-emerald-500 h-2.5 rounded-full', style: `width:${pct}%` }),
        ]),

        // Lista de histórias
        sprint.stories.length
          ? el('ul', { class: 'divide-y divide-slate-100' },
            sortStories(sprint.stories).map((st) => storyRow(st, orderIndex)))
          : el('p', { class: 'text-sm text-slate-400' }, 'Nenhuma história alocada nesta sprint.'),
      ])
    );
  } catch (err) {
    target.replaceChildren(errorBox(err.message));
  }
}

function storyRow(st, orderIndex) {
  const done = st.status === 'done';
  return el('li', { class: 'flex items-center gap-3 py-2' }, [
    el('span', {
      class: 'text-[10px] font-bold tabular-nums text-indigo-600 bg-indigo-50 rounded px-1.5 py-0.5 min-w-[2rem] text-center shrink-0',
      title: 'Ordem de execução',
    }, displayOrder(st, orderIndex)),
    el('input', { type: 'checkbox', disabled: 'true', ...(done ? { checked: 'true' } : {}) }),
    el('span', { class: 'text-xs text-slate-400 w-20 shrink-0' }, st.id),
    el('span', { class: `text-sm flex-1 ${done ? 'text-slate-400 line-through' : 'text-slate-700'}` }, titleOf(st)),
    el('span', { class: `text-[11px] px-2 py-0.5 rounded-full ${STORY_STATUS[st.status] || 'bg-slate-100'}` }, st.status),
    el('span', { class: 'text-[11px] text-slate-500 w-12 text-right' }, `${st.points ?? '?'} pts`),
  ]);
}

function titleOf(story) {
  const m = (story.bodyRaw || '').match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : story.id;
}

function objectiveOf(body = '') {
  const m = body.match(/Objetivo da sprint[:*_\s]*([^\n]+)/i);
  return m ? m[1].replace(/[_*]/g, '').trim() : '';
}
