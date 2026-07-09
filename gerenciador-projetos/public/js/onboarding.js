import { api } from './api.js';
import { el, showToast } from './ui.js';

const INPUT =
  'mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none';

const state = {
  name: '', org: '', description: '',
  problem: '', solution: '', audience: '', valueProp: '',
  okrObjective: '', okrKRs: '',
  stackBackend: '', stackFrontend: '', db: '', stackRationale: '',
  squads: [], members: [],
  sprintGoal: '', stories: '',
};
let current = 0;

function field(label, control, hint) {
  return el('label', { class: 'block' }, [
    el('span', { class: 'text-[11px] font-semibold uppercase tracking-wide text-slate-500' }, label),
    control,
    hint ? el('span', { class: 'block text-xs text-slate-400 mt-1' }, hint) : null,
  ]);
}
function text(key, attrs = {}) {
  const node = el('input', { class: INPUT, value: state[key] || '', oninput: (e) => { state[key] = e.target.value; }, ...attrs });
  return node;
}
function area(key, attrs = {}) {
  const node = el('textarea', { class: INPUT, rows: '3', oninput: (e) => { state[key] = e.target.value; }, ...attrs });
  node.value = state[key] || '';
  return node;
}

const STEPS = [
  {
    title: 'Identidade',
    subtitle: 'Como o projeto se chama e de quem é.',
    build: () => el('div', { class: 'space-y-4' }, [
      field('Nome do projeto', text('name', { placeholder: 'Ex.: DiademaEntregas', required: 'true' })),
      field('Organização (GitHub)', text('org', { placeholder: 'sua-org' })),
      field('Descrição', area('description', { placeholder: 'Uma frase sobre o produto' })),
    ]),
  },
  {
    title: 'Negócio',
    subtitle: 'Idealize: que dor você resolve e para quem.',
    build: () => el('div', { class: 'space-y-4' }, [
      field('Problema', area('problem', { placeholder: 'Qual dor real, em 2-3 frases' })),
      field('Solução', area('solution', { placeholder: 'O que o produto faz, em alto nível' })),
      field('Público-alvo', text('audience', { placeholder: 'Quem é o cliente' })),
      field('Proposta de valor', area('valueProp', { placeholder: 'Por que escolheriam você e não o concorrente' })),
    ]),
  },
  {
    title: 'OKRs',
    subtitle: 'O topo da estratégia: um objetivo e seus resultados-chave.',
    build: () => el('div', { class: 'space-y-4' }, [
      field('Objetivo (opcional)', text('okrObjective', { placeholder: 'Ex.: Validar o MVP com os primeiros clientes' })),
      field('Resultados-chave', area('okrKRs', { rows: '4', placeholder: 'Um por linha' })),
    ]),
  },
  {
    title: 'Técnico',
    subtitle: 'A stack é decisão sua — vira um ADR e o tech-stack.',
    build: () => el('div', { class: 'space-y-4' }, [
      el('div', { class: 'grid grid-cols-2 gap-4' }, [
        field('Backend', text('stackBackend', { placeholder: 'Node, Go, Rails…' })),
        field('Frontend', text('stackFrontend', { placeholder: 'React, Angular, Flutter…' })),
      ]),
      field('Banco de dados', text('db', { placeholder: 'PostgreSQL, Mongo…' })),
      field('Por quê', area('stackRationale', { placeholder: 'O racional da escolha' })),
    ]),
  },
  {
    title: 'Time',
    subtitle: 'Monte squads e adicione as primeiras pessoas.',
    build: buildTeamStep,
  },
  {
    title: 'Primeira sprint',
    subtitle: 'Um objetivo e as histórias iniciais para começar.',
    build: () => el('div', { class: 'space-y-4' }, [
      field('Objetivo da sprint', text('sprintGoal', { placeholder: 'O que precisa estar pronto no final' })),
      field('Histórias iniciais', area('stories', { rows: '5', placeholder: 'Um título por linha' }), 'Cada linha vira um card no backlog, já ligado à SPRINT-01.'),
    ]),
  },
];

function buildTeamStep() {
  const wrap = el('div', { class: 'space-y-6' });
  function rerender() {
    wrap.replaceChildren(
      el('div', {}, [
        el('div', { class: 'flex items-center justify-between mb-2' }, [
          el('span', { class: 'text-[11px] font-semibold uppercase tracking-wide text-slate-500' }, 'Squads'),
          el('button', { type: 'button', class: 'text-xs text-indigo-600 hover:underline', onclick: () => { state.squads.push({ name: '' }); rerender(); } }, '+ squad'),
        ]),
        state.squads.length ? el('div', { class: 'space-y-2' }, state.squads.map((s, i) =>
          el('div', { class: 'flex gap-2' }, [
            el('input', { class: INPUT, value: s.name, placeholder: 'Nome do squad', oninput: (e) => { state.squads[i].name = e.target.value; } }),
            el('button', { type: 'button', class: 'px-2 text-slate-400 hover:text-red-600', onclick: () => { state.squads.splice(i, 1); rerender(); } }, '✕'),
          ])
        )) : el('p', { class: 'text-xs text-slate-400 italic' }, 'Nenhum squad (opcional).'),
      ]),
      el('div', {}, [
        el('div', { class: 'flex items-center justify-between mb-2' }, [
          el('span', { class: 'text-[11px] font-semibold uppercase tracking-wide text-slate-500' }, 'Pessoas'),
          el('button', { type: 'button', class: 'text-xs text-indigo-600 hover:underline', onclick: () => { state.members.push({ name: '', role: 'developer' }); rerender(); } }, '+ pessoa'),
        ]),
        state.members.length ? el('div', { class: 'space-y-2' }, state.members.map((m, i) => {
          const roleSel = el('select', { class: 'border border-slate-300 rounded-lg px-2 py-2 text-sm', onchange: (e) => { state.members[i].role = e.target.value; } });
          for (const [v, l] of [['tech-lead', 'Tech lead'], ['developer', 'Dev'], ['designer', 'Designer'], ['product', 'Produto'], ['other', 'Outro']]) {
            const o = el('option', { value: v }, l);
            if (v === m.role) o.selected = true;
            roleSel.append(o);
          }
          return el('div', { class: 'flex gap-2' }, [
            el('input', { class: INPUT, value: m.name, placeholder: 'Nome', oninput: (e) => { state.members[i].name = e.target.value; } }),
            roleSel,
            el('button', { type: 'button', class: 'px-2 text-slate-400 hover:text-red-600', onclick: () => { state.members.splice(i, 1); rerender(); } }, '✕'),
          ]);
        })) : el('p', { class: 'text-xs text-slate-400 italic' }, 'Nenhuma pessoa (opcional).'),
      ])
    );
  }
  rerender();
  return wrap;
}

export async function render(container) {
  // Pré-preenche com o que já existir na config.
  try {
    const p = await api.project();
    if (p.name && p.name !== 'Meu Projeto') state.name = p.name;
    state.org = p.org || '';
    state.description = p.description || '';
  } catch { /* segue com defaults */ }
  current = 0;
  container.replaceChildren(shell());
  renderStep();
}

function shell() {
  return el('div', { class: 'wizard-shell py-6' }, [
    el('div', { class: 'text-center mb-6' }, [
      el('h1', { class: 'text-2xl font-bold text-slate-900' }, 'Vamos configurar seu projeto'),
      el('p', { class: 'text-sm text-slate-500 mt-1' }, 'Idealize o negócio, estruture o técnico e monte o time — como um líder.'),
    ]),
    el('div', { class: 'wizard-progress mb-1' }, [el('div', { id: 'wiz-bar', class: 'wizard-progress__bar', style: 'width:0%' })]),
    el('div', { class: 'flex items-center justify-between mb-6' }, [
      el('div', { id: 'wiz-dots', class: 'wizard-dots' }),
      el('span', { id: 'wiz-count', class: 'text-xs text-slate-400' }),
    ]),
    el('div', { class: 'bg-white border border-slate-200 rounded-2xl shadow-sm p-6 min-h-[18rem]' }, [
      el('div', { class: 'mb-4' }, [
        el('h2', { id: 'wiz-title', class: 'text-lg font-bold text-slate-900' }),
        el('p', { id: 'wiz-subtitle', class: 'text-sm text-slate-500' }),
      ]),
      el('div', { id: 'wiz-content' }),
    ]),
    el('div', { class: 'flex items-center justify-between mt-5' }, [
      el('button', { id: 'wiz-back', type: 'button', class: 'px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-50', onclick: back }, '← Voltar'),
      el('button', { id: 'wiz-next', type: 'button', class: 'bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-md', onclick: next }, 'Próximo →'),
    ]),
  ]);
}

function renderStep() {
  const step = STEPS[current];
  const total = STEPS.length;
  document.getElementById('wiz-bar').style.width = `${Math.round(((current) / (total - 1)) * 100)}%`;
  document.getElementById('wiz-title').textContent = step.title;
  document.getElementById('wiz-subtitle').textContent = step.subtitle;
  document.getElementById('wiz-count').textContent = `Passo ${current + 1} de ${total}`;

  const dots = document.getElementById('wiz-dots');
  dots.replaceChildren(...STEPS.map((_, i) =>
    el('span', { class: `wizard-dot ${i === current ? 'wizard-dot--active' : i < current ? 'wizard-dot--done' : ''}` })));

  const content = document.getElementById('wiz-content');
  const node = step.build();
  node.classList.add('wizard-step');
  content.replaceChildren(node);

  document.getElementById('wiz-back').style.visibility = current === 0 ? 'hidden' : 'visible';
  document.getElementById('wiz-next').textContent = current === total - 1 ? 'Concluir ✓' : 'Próximo →';
}

function back() {
  if (current > 0) { current--; renderStep(); }
}
function next() {
  if (current === 0 && !state.name.trim()) return showToast('Dê um nome ao projeto', 'error');
  if (current < STEPS.length - 1) { current++; renderStep(); return; }
  finish();
}

async function finish() {
  const content = document.getElementById('wiz-content');
  document.getElementById('wiz-title').textContent = 'Criando seu projeto…';
  document.getElementById('wiz-subtitle').textContent = 'Gravando docs, OKRs, time e a primeira sprint.';
  document.getElementById('wiz-back').style.visibility = 'hidden';
  document.getElementById('wiz-next').style.visibility = 'hidden';
  const log = el('div', { class: 'space-y-2' });
  content.replaceChildren(log);
  const step = (msg) => log.append(el('div', { class: 'wizard-status-line text-sm text-slate-600 flex items-center gap-2' }, [el('span', {}, '✓'), el('span', {}, msg)]));

  try {
    await api.updateProject({
      name: state.name.trim(), org: state.org.trim(), description: state.description.trim(),
      slug: slugify(state.name), stack: stackSummary() || null,
      createdAt: new Date().toISOString().slice(0, 10), onboarded: true,
    });
    step('Identidade salva');

    await api.updateDoc('vision', { body: visionBody(), data: { status: 'active' } });
    if (state.problem || state.solution) await api.updateDoc('lean-canvas', { body: leanBody() });
    step('Visão e negócio documentados');

    if (state.okrObjective.trim()) {
      await api.createOkr({
        objective: state.okrObjective.trim(),
        keyResults: state.okrKRs.split('\n').map((s) => s.trim()).filter(Boolean),
      });
      step('OKR criado');
    }

    if (stackSummary()) {
      await api.updateDoc('tech-stack', { body: techBody(), data: { status: 'active' } });
      await api.createDecision({
        title: 'Escolha de stack do projeto',
        context: 'Definição inicial da stack no onboarding.',
        decision: stackSummary(),
        consequences: state.stackRationale || '_(a detalhar)_',
      });
      step('Stack registrada (tech-stack + ADR)');
    }

    for (const s of state.squads.filter((x) => x.name.trim())) await api.createSquad({ name: s.name.trim() });
    for (const m of state.members.filter((x) => x.name.trim())) await api.createMember({ name: m.name.trim(), role: m.role });
    if (state.squads.length || state.members.length) step('Time montado');

    const titles = state.stories.split('\n').map((s) => s.trim()).filter(Boolean);
    if (state.sprintGoal.trim() || titles.length) {
      const sprint = await api.createSprint({ title: 'Sprint 01', goal: state.sprintGoal.trim(), status: 'active' });
      for (const t of titles) {
        const story = await api.createStory({ title: t, status: 'todo', priority: 'medium', points: 3, epic: 'mvp' });
        await api.patchStory(story.id, { sprint: sprint.id });
      }
      step(`Sprint criada${titles.length ? ` com ${titles.length} história(s)` : ''}`);
    }

    step('Pronto! Redirecionando…');
    setTimeout(() => { location.hash = '#kanban'; }, 900);
  } catch (err) {
    log.append(el('div', { class: 'text-sm text-red-600' }, `Erro: ${err.message}`));
    const retry = el('button', { type: 'button', class: 'mt-3 bg-indigo-600 text-white text-sm px-4 py-2 rounded-md', onclick: finish }, 'Tentar de novo');
    content.append(retry);
  }
}

// ---- helpers de composição ----
function slugify(t) {
  return String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}
function stackSummary() {
  const parts = [];
  if (state.stackBackend.trim()) parts.push(`Backend: ${state.stackBackend.trim()}`);
  if (state.stackFrontend.trim()) parts.push(`Frontend: ${state.stackFrontend.trim()}`);
  if (state.db.trim()) parts.push(`Banco: ${state.db.trim()}`);
  return parts.join(' · ');
}
function visionBody() {
  return `# Visão do Produto\n\n## Problema\n${state.problem || '_(a preencher)_'}\n\n## Solução\n${state.solution || '_(a preencher)_'}\n\n## Público-alvo\n${state.audience || '_(a preencher)_'}\n\n## Proposta de valor\n${state.valueProp || '_(a preencher)_'}\n\n## Não-objetivos\n_(o que a gente NÃO vai fazer nesta fase)_\n`;
}
function leanBody() {
  return `# Lean Canvas\n\n## Problema\n${state.problem || ''}\n\n## Solução\n${state.solution || ''}\n\n## Proposta de valor única\n${state.valueProp || ''}\n\n## Segmentos de clientes\n${state.audience || ''}\n`;
}
function techBody() {
  return `# Stack Tecnológica\n\n## Backend\n${state.stackBackend || '_(a definir)_'}\n\n## Frontend\n${state.stackFrontend || '_(a definir)_'}\n\n## Banco de dados\n${state.db || '_(a definir)_'}\n\n## Por quê\n${state.stackRationale || '_(a definir)_'}\n\n> Decisão registrada em decisions/ (ADR).\n`;
}
