import { api } from './api.js';
import { el, loading, errorBox } from './ui.js';
import { applySquadTheme, squadColor } from './squadTheme.js';
import { buildOrderIndex, displayOrder, sortStories } from './storyOrder.js';

const TOPOLOGY_ORDER = ['stream-aligned', 'platform', 'enabling'];
const TOPOLOGY_META = {
  'stream-aligned': { label: 'Stream-aligned', desc: 'Valor direto ao MEI' },
  platform: { label: 'Plataforma', desc: 'Infra e experiência compartilhada' },
  enabling: { label: 'Enabling', desc: 'Segurança, qualidade e processo' },
};

const STATUS_CLASS = {
  done: 'roadmap-status--done',
  'in-progress': 'roadmap-status--progress',
  review: 'roadmap-status--review',
  todo: 'roadmap-status--todo',
  backlog: 'roadmap-status--backlog',
  cancelled: 'roadmap-status--muted',
};

const PRIORITY_CLASS = {
  high: 'roadmap-priority--high',
  medium: 'roadmap-priority--medium',
  low: 'roadmap-priority--low',
};

const GLOBAL_STORY_IDS = new Set(['STORY-001', 'STORY-002']);

let activeFilter = null;

function titleOf(story) {
  const m = (story.bodyRaw || '').match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : story.id;
}

function numId(story) {
  return parseInt(String(story.id).replace(/\D/g, ''), 10) || 0;
}

function progressBar(done, total, accent) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return el('div', { class: 'roadmap-progress' }, [
    el('div', { class: 'roadmap-progress__track' }, [
      el('div', {
        class: 'roadmap-progress__fill',
        style: `width:${pct}%;background:${accent}`,
      }),
    ]),
    el('span', { class: 'roadmap-progress__label' }, `${done}/${total} · ${pct}%`),
  ]);
}

function statCard(label, value, sub, accent) {
  return el('div', { class: 'roadmap-stat' }, [
    el('div', {
      class: 'roadmap-stat__accent',
      style: accent ? `background:${accent}` : '',
    }),
    el('div', { class: 'roadmap-stat__body' }, [
      el('div', { class: 'roadmap-stat__value' }, value),
      el('div', { class: 'roadmap-stat__label' }, label),
      sub ? el('div', { class: 'roadmap-stat__sub' }, sub) : null,
    ]),
  ]);
}

function storyItem(story, squadId, orderIndex) {
  const c = squadId ? squadColor(squadId) : squadColor('plataforma');
  const status = story.status || 'backlog';
  const pri = story.priority || 'medium';

  return el('div', { class: 'roadmap-story' }, [
    el('div', {
      class: 'roadmap-story__accent',
      style: `background:${c.accent}`,
    }),
    el('div', { class: 'roadmap-story__main' }, [
      el('div', { class: 'roadmap-story__top' }, [
        el('span', { class: 'roadmap-story__order', title: 'Ordem de execução' }, displayOrder(story, orderIndex)),
        el('span', { class: 'roadmap-story__id' }, String(story.id).toUpperCase()),
        el('span', { class: `roadmap-priority ${PRIORITY_CLASS[pri] || ''}` }, pri),
      ]),
      el('div', { class: 'roadmap-story__title' }, titleOf(story)),
    ]),
    el('div', { class: 'roadmap-story__meta' }, [
      el('span', { class: `roadmap-status ${STATUS_CLASS[status] || ''}` },
        ({ done: 'Concluído', 'in-progress': 'Em progresso', review: 'Review', todo: 'To do', backlog: 'Backlog' })[status] || status),
      story.sprint
        ? el('span', { class: 'roadmap-story__sprint' }, story.sprint)
        : null,
    ]),
  ]);
}

function storyList(stories, squadId, orderIndex) {
  const sorted = sortStories(stories);
  return el('div', { class: 'roadmap-story-list' }, sorted.map((s) => storyItem(s, squadId, orderIndex)));
}

function squadCard(squad, stories, orderIndex) {
  if (!stories.length) return null;
  if (activeFilter && activeFilter !== squad.id) return null;

  const done = stories.filter((s) => s.status === 'done').length;
  const c = squadColor(squad.id);

  return el('article', {
    class: 'roadmap-squad-card',
    style: `--squad-accent:${c.accent};--squad-bg:${c.bg};--squad-border:${c.border}`,
    'data-squad': squad.id,
  }, [
    el('header', { class: 'roadmap-squad-card__header' }, [
      el('div', { class: 'roadmap-squad-card__title-row' }, [
        el('span', {
          class: 'roadmap-squad-card__dot',
          style: `background:${c.accent}`,
        }),
        el('h3', { class: 'roadmap-squad-card__title' }, squad.label),
      ]),
      el('p', { class: 'roadmap-squad-card__mission' }, squad.mission),
      progressBar(done, stories.length, c.accent),
    ]),
    storyList(stories, squad.id, orderIndex),
  ]);
}

function globalHero(globalCfg, stories, ideas, orderIndex) {
  const transversal = stories.filter((s) => GLOBAL_STORY_IDS.has(String(s.id).toUpperCase()));
  const mvpStories = stories.filter((s) => numId(s) >= 3 && numId(s) <= 14);
  const mvpDone = mvpStories.filter((s) => s.status === 'done').length;
  const totalDone = stories.filter((s) => s.status === 'done').length;
  const gc = globalCfg?.color || squadColor('plataforma');

  if (activeFilter && activeFilter !== '__global__') return null;

  return el('section', {
    class: 'roadmap-global',
    style: `--squad-accent:${gc.accent}`,
  }, [
    el('div', { class: 'roadmap-global__inner' }, [
      el('div', { class: 'roadmap-global__content' }, [
        el('span', { class: 'roadmap-global__eyebrow' }, 'Horizonte do produto'),
        el('h2', { class: 'roadmap-global__title' }, 'Meta do MVP'),
        el('p', { class: 'roadmap-global__text' },
          'MEI cadastra, abre conta, recebe por Pix/cartão/boleto/link, vê extrato unificado, painel "quanto sobrou" e alerta de teto MEI.'),
        progressBar(mvpDone, mvpStories.length, gc.accent),
        el('div', { class: 'roadmap-global__stats' }, [
          el('div', {}, [
            el('span', { class: 'roadmap-global__stat-n' }, String(totalDone)),
            el('span', { class: 'roadmap-global__stat-l' }, 'concluídas no total'),
          ]),
          el('div', {}, [
            el('span', { class: 'roadmap-global__stat-n' }, String(mvpStories.length)),
            el('span', { class: 'roadmap-global__stat-l' }, 'histórias no MVP'),
          ]),
        ]),
      ]),
      transversal.length ? el('div', { class: 'roadmap-global__block' }, [
        el('h3', { class: 'roadmap-global__block-title' }, 'Fundação transversal'),
        storyList(transversal, 'plataforma', orderIndex),
      ]) : el('div', {}),
      el('div', { class: 'roadmap-global__block' }, [
        el('h3', { class: 'roadmap-global__block-title' }, 'Depois — sem história ainda'),
        el('ul', { class: 'roadmap-ideas' },
          ideas.map((t) => el('li', { class: 'roadmap-ideas__item' }, t))),
      ]),
    ]),
  ]);
}

function syncRoadmapFilterChips() {
  document.querySelectorAll('.roadmap-filter-chip').forEach((btn) => {
    const id = btn.dataset.filterId === '' ? null : btn.dataset.filterId;
    const active = activeFilter === id || (!activeFilter && id === null);
    btn.classList.toggle('is-active', active);
  });
}

function filterBar(squads, globalCfg, onFilter) {
  const chips = [
    { id: null, label: 'Todos' },
    { id: '__global__', label: globalCfg?.label || 'Global' },
    ...squads.map((s) => ({ id: s.id, label: s.label, squad: s })),
  ];

  return el('div', { class: 'roadmap-filters' }, [
    el('span', { class: 'roadmap-filters__label' }, 'Filtrar por squad'),
    el('div', { class: 'roadmap-filters__chips' },
      chips.map(({ id, label, squad }) => {
        const active = activeFilter === id || (!activeFilter && id === null);
        const filterKey = id === null ? '' : String(id);
        const btn = el('button', {
          type: 'button',
          class: `roadmap-filter-chip${active ? ' is-active' : ''}`,
          'data-filter-id': filterKey,
        }, label);
        if (squad) {
          const c = squadColor(squad.id);
          btn.style.setProperty('--chip-bg', c.bg);
          btn.style.setProperty('--chip-text', c.text);
          btn.style.setProperty('--chip-border', c.border);
          btn.style.setProperty('--chip-accent', c.accent);
        } else if (id === '__global__' && globalCfg?.color) {
          const c = globalCfg.color;
          btn.style.setProperty('--chip-bg', c.bg);
          btn.style.setProperty('--chip-text', c.text);
          btn.style.setProperty('--chip-border', c.border);
          btn.style.setProperty('--chip-accent', c.accent);
        }
        btn.addEventListener('click', () => {
          if (id !== null && activeFilter === id) onFilter(null);
          else onFilter(id);
          syncRoadmapFilterChips();
        });
        return btn;
      })),
  ]);
}

function topologyBlock(topo, squads, bySquad, orderIndex) {
  const cards = squads
    .map((sq) => squadCard(sq, bySquad.get(sq.id) || [], orderIndex))
    .filter(Boolean);
  if (!cards.length) return null;

  const meta = TOPOLOGY_META[topo];
  return el('section', { class: 'roadmap-topology' }, [
    el('header', { class: 'roadmap-topology__header' }, [
      el('h2', { class: 'roadmap-topology__title' }, meta.label),
      el('p', { class: 'roadmap-topology__desc' }, meta.desc),
    ]),
    el('div', {
      class: activeFilter && activeFilter !== '__global__'
        ? 'roadmap-grid roadmap-grid--focused'
        : 'roadmap-grid',
    }, cards),
  ]);
}

function pageHeader(stories, squadCount) {
  const total = stories.length;
  const done = stories.filter((s) => s.status === 'done').length;
  const mvp = stories.filter((s) => numId(s) >= 3 && numId(s) <= 14);
  const mvpDone = mvp.filter((s) => s.status === 'done').length;

  return el('header', { class: 'roadmap-page-header' }, [
    el('div', {}, [
      el('h1', { class: 'roadmap-page-header__title' }, 'Roadmap'),
      el('p', { class: 'roadmap-page-header__sub' },
        'Prioridade por squad · dados ao vivo do backlog'),
    ]),
    el('div', { class: 'roadmap-stats-row' }, [
      statCard('Histórias', String(total), 'no backlog', '#6366F1'),
      statCard('Concluídas', String(done), `${total ? Math.round((done / total) * 100) : 0}% do total`, '#10B981'),
      statCard('MVP', `${mvpDone}/${mvp.length}`, 'STORY-003 a 014', '#8B5CF6'),
      statCard('Squads', String(squadCount), '+ global', '#64748B'),
    ]),
  ]);
}

function renderRoadmapBody(theme, stories) {
  const orderIndex = buildOrderIndex(stories);
  const bySquad = new Map();
  theme.squads.forEach((s) => bySquad.set(s.id, []));
  const unassigned = [];

  stories.forEach((s) => {
    if (GLOBAL_STORY_IDS.has(String(s.id).toUpperCase())) return;
    const sq = s.squad;
    if (sq && bySquad.has(sq)) bySquad.get(sq).push(s);
    else unassigned.push(s);
  });

  const ideas = [
    'Crédito acessível para MEI (antecipação de recebíveis)',
    'Atendimento humano dedicado',
    'Segmentação por nicho (ex.: MEI de beleza, delivery)',
  ];

  const root = el('div', { class: 'roadmap-layout' });
  root.append(globalHero(theme.global, stories, ideas, orderIndex));

  TOPOLOGY_ORDER.forEach((topo) => {
    const group = theme.squads.filter((s) => s.topology === topo);
    const block = topologyBlock(topo, group, bySquad, orderIndex);
    if (block) root.append(block);
  });

  if (unassigned.length && !activeFilter) {
    root.append(el('section', { class: 'roadmap-topology' }, [
      el('header', { class: 'roadmap-topology__header' }, [
        el('h2', { class: 'roadmap-topology__title' }, 'Sem squad'),
      ]),
      el('div', { class: 'roadmap-squad-card' }, storyList(unassigned, null, orderIndex)),
    ]));
  }

  return root;
}

export async function render(container) {
  container.replaceChildren(el('div', { id: 'roadmap-content' }, loading()));

  const content = container.querySelector('#roadmap-content');
  try {
    const [theme, stories] = await Promise.all([
      fetch('/api/squads/full').then((r) => r.json()),
      api.stories(),
    ]);
    applySquadTheme(theme.squads, theme.global);

    const bodyHost = el('div', { id: 'roadmap-body' });
    const updateBody = () => {
      bodyHost.replaceChildren(renderRoadmapBody(theme, stories));
    };

    const filtersEl = filterBar(theme.squads, theme.global, (id) => {
      activeFilter = id;
      updateBody();
    });

    updateBody();

    container.replaceChildren(
      el('div', { class: 'roadmap-page' }, [
        pageHeader(stories, theme.squads?.length ?? 0),
        filtersEl,
        bodyHost,
      ])
    );
  } catch (err) {
    content.replaceChildren(errorBox(err.message));
  }
}
