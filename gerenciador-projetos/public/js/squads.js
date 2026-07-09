import { api } from './api.js';
import { el, loading, errorBox } from './ui.js';
import { applySquadTheme, squadPillStyle, squadSectionStyle } from './squadTheme.js';

const TOPOLOGY_LABEL = {
  'stream-aligned': 'Stream-aligned',
  platform: 'Plataforma',
  enabling: 'Enabling',
};

const ROLE_LABEL = {
  'tech-lead': 'Tech lead',
  developer: 'Dev pleno',
  designer: 'Designer',
};

function squadTeamHeading(squadId, members) {
  if (!members.length) return null;
  if (squadId === 'design') return 'Time design';
  if (squadId === 'experiencia-web') return 'Time frontend web';
  if (squadId === 'experiencia-mobile') return 'Time frontend mobile';
  return 'Time';
}

function memberOptionLabel(m) {
  if (m.role === 'tech-lead') return `${m.name} · TL`;
  if (m.role === 'designer' || m.discipline === 'design') return `${m.name} · Design`;
  return m.name;
}

export async function render(container) {
  container.replaceChildren(
    el('div', { class: 'mb-6' }, [
      el('h1', { class: 'text-2xl font-bold text-slate-900' }, 'Squads'),
      el('p', { class: 'text-sm text-slate-500 mt-1' },
        'Squads em squads.json · time em team.json (backend + design)'),
    ]),
    el('div', { id: 'squads-list' }, loading())
  );

  try {
    const [theme, team] = await Promise.all([
      fetch('/api/squads/full').then((r) => r.json()),
      api.team(),
    ]);
    applySquadTheme(theme.squads, theme.global);
    const squads = theme.squads || [];
    const members = team.members || [];

    const membersBySquad = new Map();
    members.forEach((m) => {
      const list = membersBySquad.get(m.squad) || [];
      list.push(m);
      membersBySquad.set(m.squad, list);
    });

    const byTopology = { 'stream-aligned': [], platform: [], enabling: [] };
    squads.forEach((sq) => (byTopology[sq.topology] || byTopology.enabling).push(sq));

    const sections = ['stream-aligned', 'platform', 'enabling'].map((topo) => {
      const items = byTopology[topo];
      if (!items.length) return null;
      return el('section', { class: 'mb-8' }, [
        el('h2', { class: 'text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3' }, TOPOLOGY_LABEL[topo]),
        el('div', { class: 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3' },
          items.map((sq) => {
            const c = sq.color || {};
            const squadMembers = membersBySquad.get(sq.id) || [];
            const teamHeading = squadTeamHeading(sq.id, squadMembers);
            return el('div', {
              class: 'rounded-xl border overflow-hidden shadow-sm',
              style: `border-color:${c.border || '#e2e8f0'};${squadSectionStyle(sq.id)}`,
            }, [
              el('div', { class: 'p-4' }, [
                el('div', { class: 'flex items-start justify-between gap-2 mb-2' }, [
                  el('span', {
                    class: 'text-xs font-semibold px-2.5 py-0.5 rounded-full',
                    style: squadPillStyle(sq.id),
                  }, sq.name || sq.label),
                  el('code', { class: 'text-[10px] text-slate-400' }, sq.id),
                ]),
                el('p', { class: 'text-sm text-slate-600 leading-snug mb-3' }, sq.mission || ''),
                squadMembers.length
                  ? el('div', { class: 'mb-3' }, [
                      el('div', { class: 'text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5' }, teamHeading),
                      el('ul', { class: 'space-y-1' }, squadMembers.map((m) =>
                        el('li', { class: 'text-sm text-slate-700 flex items-center justify-between gap-2' }, [
                          el('span', {}, m.name),
                          el('span', { class: 'text-[10px] text-slate-400' }, ROLE_LABEL[m.role] || m.level),
                        ])
                      )),
                    ])
                  : el('p', { class: 'text-xs text-slate-400 mb-3 italic' }, 'Sem membros alocados'),
                el('div', { class: 'flex gap-1.5 mt-3' },
                  ['bg', 'text', 'border', 'accent'].map((k) => el('span', {
                    class: 'w-6 h-6 rounded-md border border-white shadow-sm',
                    style: `background:${c[k] || '#ccc'}`,
                    title: k,
                  })),
                ),
              ]),
            ]);
          })
        ),
      ]);
    }).filter(Boolean);

    const unassigned = members.filter((m) => !squads.some((sq) => sq.id === m.squad));
    if (unassigned.length) {
      sections.push(el('section', { class: 'mb-8' }, [
        el('h2', { class: 'text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3' }, 'Outros'),
        el('div', { class: 'text-sm text-slate-600' }, unassigned.map((m) => m.name).join(', ')),
      ]));
    }

    container.querySelector('#squads-list').replaceChildren(...sections);
  } catch (err) {
    container.querySelector('#squads-list').replaceChildren(errorBox(err.message));
  }
}

export { memberOptionLabel, ROLE_LABEL };
