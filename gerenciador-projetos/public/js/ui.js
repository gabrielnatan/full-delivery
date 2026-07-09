// Helpers de UI compartilhados: criação de elementos, modal/drawer, toast, badges.

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

// ---- Modal / drawer reutilizável ----
const overlay = document.getElementById('modal-overlay');
const modal = document.getElementById('modal');
const modalHeader = modal.querySelector('[data-modal-header]');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalBody = document.getElementById('modal-body');

const VARIANT = {
  modal: {
    overlay: ['flex', 'items-start', 'justify-center', 'p-4', 'sm:p-6', 'overflow-y-auto'],
    panel: ['w-full', 'rounded-2xl', 'my-4', 'sm:my-8', 'max-h-[calc(100vh-2rem)]'],
    header: ['rounded-t-2xl'],
    size: { md: 'max-w-3xl', lg: 'max-w-4xl' },
  },
  drawer: {
    overlay: ['flex', 'items-stretch', 'justify-end', 'overflow-hidden'],
    panel: [
      'h-full',
      'w-[80vw]',
      'max-w-[2400px]',
      'min-w-[min(100%,20rem)]',
      'rounded-none',
      'rounded-l-2xl',
      'transition-transform',
      'duration-300',
      'ease-out',
    ],
    header: ['rounded-tl-2xl'],
    size: { md: '', lg: '' },
  },
};

const OVERLAY_CLASSES = [...new Set([
  ...VARIANT.modal.overlay,
  ...VARIANT.drawer.overlay,
])];
const PANEL_CLASSES = [...new Set([
  ...VARIANT.modal.panel,
  ...VARIANT.drawer.panel,
  'max-w-3xl',
  'max-w-4xl',
  'translate-x-full',
  'translate-x-0',
])];
const HEADER_CLASSES = [...new Set([
  ...VARIANT.modal.header,
  ...VARIANT.drawer.header,
])];

let currentVariant = 'modal';
let closeTimer = null;

function applyVariant(variant, size = 'md') {
  currentVariant = variant;
  const v = VARIANT[variant];

  overlay.classList.remove(...OVERLAY_CLASSES);
  overlay.classList.add(...v.overlay);

  modal.classList.remove(...PANEL_CLASSES);
  modal.classList.add(...v.panel);
  const sizeClass = v.size[size] || v.size.md;
  if (sizeClass) modal.classList.add(sizeClass);

  modalHeader.classList.remove(...HEADER_CLASSES);
  modalHeader.classList.add(...v.header);
}

function finishClose() {
  overlay.classList.add('hidden');
  modalBody.replaceChildren();
  modalSubtitle.classList.add('hidden');
  document.body.style.overflow = '';
  modal.classList.remove('translate-x-full', 'translate-x-0');
}

export function openModal(title, bodyNode, { subtitle = null, size = 'md', variant = 'modal' } = {}) {
  clearTimeout(closeTimer);
  applyVariant(variant, size);

  modalTitle.textContent = title;
  if (subtitle) {
    modalSubtitle.textContent = subtitle;
    modalSubtitle.classList.remove('hidden');
  } else {
    modalSubtitle.textContent = '';
    modalSubtitle.classList.add('hidden');
  }
  modalBody.replaceChildren(bodyNode);

  const wasHidden = overlay.classList.contains('hidden');

  if (variant === 'drawer') {
    if (wasHidden) {
      modal.classList.add('translate-x-full');
      overlay.classList.remove('hidden');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          modal.classList.remove('translate-x-full');
          modal.classList.add('translate-x-0');
        });
      });
    } else {
      overlay.classList.remove('hidden');
    }
  } else {
    overlay.classList.remove('hidden');
  }

  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  if (currentVariant === 'drawer' && !overlay.classList.contains('hidden')) {
    modal.classList.remove('translate-x-0');
    modal.classList.add('translate-x-full');
    closeTimer = setTimeout(finishClose, 280);
    return;
  }
  finishClose();
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
