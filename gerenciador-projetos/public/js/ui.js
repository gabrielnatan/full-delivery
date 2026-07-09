// Helpers de UI compartilhados: criação de elementos, modal, toast, badges.

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, v);
  }
  const appendChild = (node, child) => {
    if (child == null) return;
    if (Array.isArray(child)) {
      child.forEach((c) => appendChild(node, c));
      return;
    }
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  };
  for (const child of [].concat(children)) appendChild(node, child);
  return node;
}

// ---- Modal reutilizável ----
const overlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalBody = document.getElementById('modal-body');

export function openModal(title, bodyNode, { subtitle = null, size = 'md' } = {}) {
  const modal = document.getElementById('modal');
  modal.classList.remove('max-w-3xl', 'max-w-4xl');
  modal.classList.add(size === 'lg' ? 'max-w-4xl' : 'max-w-3xl');

  modalTitle.textContent = title;
  if (subtitle) {
    modalSubtitle.textContent = subtitle;
    modalSubtitle.classList.remove('hidden');
  } else {
    modalSubtitle.textContent = '';
    modalSubtitle.classList.add('hidden');
  }
  modalBody.replaceChildren(bodyNode);
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
  modalBody.replaceChildren();
  modalSubtitle.classList.add('hidden');
  document.body.style.overflow = '';
}

document.getElementById('modal-close').addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeModal();
});

// ---- Toast ----
const toast = document.getElementById('toast');
let toastTimer;
export function showToast(message, kind = 'ok') {
  toast.textContent = message;
  toast.className = `fixed bottom-5 right-5 px-4 py-2 rounded-md shadow-lg text-sm text-white z-50 ${
    kind === 'error' ? 'bg-red-600' : 'bg-slate-800'
  }`;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2600);
}

// ---- Badges ----
const PRIORITY_CLASS = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
};
export function priorityBadge(priority) {
  const label = { high: 'alta', medium: 'média', low: 'baixa' }[priority] || priority || '—';
  return el('span', { class: `text-[11px] px-2 py-0.5 rounded-full font-medium ${PRIORITY_CLASS[priority] || 'bg-slate-100 text-slate-600'}` }, label);
}

const ADR_STATUS_CLASS = {
  proposed: 'bg-sky-100 text-sky-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  deprecated: 'bg-slate-200 text-slate-600',
  superseded: 'bg-slate-200 text-slate-500',
};
export function statusBadge(status, map = ADR_STATUS_CLASS) {
  return el('span', { class: `text-[11px] px-2 py-0.5 rounded-full font-medium ${map[status] || 'bg-slate-100 text-slate-600'}` }, status || '—');
}

export function loading() {
  return el('div', { class: 'text-slate-400 text-sm' }, 'carregando…');
}

export function errorBox(message) {
  return el('div', { class: 'bg-red-50 border border-red-200 text-red-700 rounded-md p-4 text-sm' }, message);
}
