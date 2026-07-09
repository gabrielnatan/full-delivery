import { api } from './api.js';
import { el, loading, errorBox } from './ui.js';

const LABELS = {
  vision: 'Visão',
  'business-model': 'Modelo de negócio',
  'lean-canvas': 'Lean Canvas',
  concorrentes: 'Concorrentes',
  metricas: 'Métricas',
  riscos: 'Riscos',
  roadmap: 'Roadmap',
  'tech-stack': 'Tech stack',
  'system-architecture': 'Arquitetura do sistema',
  integrations: 'Integrações',
  'data-model': 'Modelo de dados',
  environments: 'Ambientes',
  runbook: 'Runbook',
  'vinculo-git-tasks': 'Git ↔ tasks',
  'setup-ambiente-local': 'Setup local',
};

// Popula a sub-lista de docs na sidebar (chamado uma vez no boot).
export async function populateMenu(menuEl) {
  try {
    const docs = await api.docsList();
    menuEl.replaceChildren(...docs.filter((d) => d.exists).map((d) =>
      el('a', {
        href: `#docs/${d.name}`,
        class: 'block pl-9 pr-5 py-1.5 text-sm text-slate-400 hover:text-white',
        'data-doc': d.name,
      }, LABELS[d.name] || d.name)
    ));
  } catch {
    menuEl.replaceChildren(el('div', { class: 'pl-9 text-xs text-slate-500' }, 'erro ao listar docs'));
  }
}

export async function render(container, name) {
  container.replaceChildren(
    el('h1', { class: 'text-2xl font-bold text-slate-900 mb-1' }, LABELS[name] || name),
    el('p', { class: 'text-sm text-slate-500 mb-6' }, `docs/ • ${name}.md`),
    el('div', { id: 'doc-content' }, loading())
  );
  const content = container.querySelector('#doc-content');
  try {
    const doc = await api.doc(name);
    content.replaceChildren(
      el('div', { class: 'bg-white border border-slate-200 rounded-lg p-6 shadow-sm prose', html: doc.bodyHtml })
    );
  } catch (err) {
    content.replaceChildren(errorBox(err.message));
  }
}
