/**
 * Tema visual dos squads — cores canônicas em docs/04-time/squads.json.
 * Cache preenchido após loadSquadTheme().
 */

const FALLBACK = {
  bg: '#F1F5F9',
  text: '#475569',
  border: '#CBD5E1',
  accent: '#64748B',
};

let byId = new Map();
let globalTheme = { label: 'Global', ...FALLBACK };

export function applySquadTheme(squads, globalCfg) {
  byId = new Map();
  (squads || []).forEach((s) => byId.set(s.id, s));
  if (globalCfg?.color) {
    globalTheme = { label: globalCfg.label || 'Global', ...globalCfg.color };
  }
}

export async function loadSquadTheme(api) {
  const raw = await fetch('/api/squads/full').then((r) => r.json()).catch(() => null);
  if (raw?.squads) {
    applySquadTheme(raw.squads, raw.global);
    return raw;
  }
  const squads = await api.squads();
  applySquadTheme(squads, null);
  return { squads, global: null };
}

export function getSquad(id) {
  return byId.get(id) || null;
}

export function squadColor(id) {
  return getSquad(id)?.color || FALLBACK;
}

export function squadPillStyle(id) {
  const c = id ? squadColor(id) : globalTheme;
  return `background:${c.bg};color:${c.text};border:1px solid ${c.border}`;
}

export function globalPillStyle() {
  return `background:${globalTheme.bg};color:${globalTheme.text};border:1px solid ${globalTheme.border}`;
}

export function squadSectionStyle(id) {
  const c = id ? squadColor(id) : globalTheme;
  return `border-left:4px solid ${c.accent};background:linear-gradient(90deg, ${c.bg} 0%, #fff 14rem)`;
}

const TAILWIND_MAP = {
  'onboarding-identidade': 'bg-indigo-100 text-indigo-700',
  recebimentos: 'bg-emerald-100 text-emerald-700',
  'gestao-financeira': 'bg-violet-100 text-violet-700',
  'contas-a-pagar': 'bg-orange-100 text-orange-700',
  'fiscal-mei': 'bg-amber-100 text-amber-800',
  plataforma: 'bg-slate-200 text-slate-700',
  'experiencia-web': 'bg-sky-100 text-sky-700',
  'experiencia-mobile': 'bg-violet-100 text-violet-700',
  design: 'bg-pink-100 text-pink-700',
  'seguranca-compliance': 'bg-rose-100 text-rose-700',
  qualidade: 'bg-teal-100 text-teal-700',
  organizacao: 'bg-fuchsia-100 text-fuchsia-700',
};

export function squadBadgeClass(id) {
  return TAILWIND_MAP[id] || 'bg-slate-100 text-slate-600';
}
