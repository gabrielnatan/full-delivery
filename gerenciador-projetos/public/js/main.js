import { api } from './api.js';
import * as kanban from './kanban.js';
import * as team from './team.js';
import * as squads from './squads.js';
import * as sprints from './sprints.js';
import * as roadmap from './roadmap.js';
import * as okrs from './okrs.js';
import * as personas from './personas.js';
import * as decisions from './decisions.js';
import * as docsViewer from './docs-viewer.js';
import * as onboarding from './onboarding.js';
import * as search from './search.js';

const view = document.getElementById('view');

// Popula o submenu de docs na sidebar uma única vez.
docsViewer.populateMenu(document.getElementById('docs-menu'));

// Nome do projeto (sidebar + título) vem de config/project.json.
(async function applyProject() {
  try {
    const p = await api.project();
    if (p && p.name) {
      const nameEl = document.getElementById('project-name');
      if (nameEl) nameEl.textContent = p.name;
      document.title = `${p.name} — Gerenciador de Projetos`;
    }
    // Primeiro acesso: leva para o onboarding se ainda não foi configurado.
    if (p && !p.onboarded && (!location.hash || location.hash === '#kanban')) {
      location.hash = '#onboarding';
    }
  } catch {
    /* mantém o placeholder se a config não existir */
  }
})();

const ROUTES = {
  kanban: () => kanban.render(view),
  team: () => team.render(view),
  squads: () => squads.render(view),
  sprints: () => sprints.render(view),
  roadmap: () => roadmap.render(view),
  okrs: () => okrs.render(view),
  personas: () => personas.render(view),
  decisions: () => decisions.render(view),
  onboarding: () => onboarding.render(view),
};

async function router() {
  const hash = (location.hash || '#kanban').slice(1);
  const [base, param] = hash.split('/');

  highlightNav(base, param);

  view.classList.toggle('view--roadmap', base === 'roadmap');

  if (base === 'docs' && param) {
    await docsViewer.render(view, param);
    return;
  }

  if (base === 'search') {
    await search.render(view, param ? decodeURIComponent(param) : '');
    return;
  }

  const handler = ROUTES[base] || ROUTES.kanban;
  await handler();
}

function highlightNav(base, param) {
  document.querySelectorAll('.nav-item').forEach((a) =>
    a.classList.toggle('active', a.dataset.view === base)
  );
  document.querySelectorAll('#docs-menu a').forEach((a) =>
    a.classList.toggle('text-white', base === 'docs' && a.dataset.doc === param)
  );
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
// DOMContentLoaded pode já ter disparado (script é module, adiado):
if (document.readyState !== 'loading') router();
