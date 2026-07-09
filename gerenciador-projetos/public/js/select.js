import { el } from './ui.js';

let openSelect = null;

function closeOpenSelect() {
  if (openSelect) {
    openSelect._close();
    openSelect = null;
  }
}

document.addEventListener('click', () => closeOpenSelect());
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeOpenSelect();
});

/**
 * Select customizado (dropdown) — substitui <select> nativo.
 *
 * @param {object} opts
 * @param {string|null} opts.value
 * @param {{ value: string, label: string, hint?: string, dot?: string, icon?: string }[]} opts.options
 * @param {(value: string|null) => void} [opts.onChange]
 * @param {string} [opts.placeholder]
 * @param {'sm'|'md'} [opts.size]
 * @param {boolean} [opts.allowEmpty] — opção vazia no topo
 * @param {string} [opts.emptyLabel]
 * @param {string} [opts.className]
 * @returns {HTMLElement}
 */
export function createSelect({
  value = null,
  options = [],
  onChange,
  placeholder = 'Selecionar…',
  size = 'md',
  allowEmpty = false,
  emptyLabel = '— nenhum —',
  className = '',
}) {
  let current = value ?? null;

  const root = el('div', {
    class: `ui-select ui-select--${size} ${className}`.trim(),
    onclick: (e) => e.stopPropagation(),
  });

  const trigger = el('button', {
    type: 'button',
    class: 'ui-select__trigger',
    'aria-haspopup': 'listbox',
    'aria-expanded': 'false',
  });

  const labelEl = el('span', { class: 'ui-select__label' });
  const chevron = el('span', { class: 'ui-select__chevron', 'aria-hidden': 'true' }, '▾');

  const menu = el('div', {
    class: 'ui-select__menu hidden',
    role: 'listbox',
  });

  trigger.append(labelEl, chevron);
  root.append(trigger, menu);

  function findOption(v) {
    if (v === null || v === '') return null;
    return options.find((o) => o.value === v) || null;
  }

  function renderTrigger() {
    const opt = findOption(current);
    labelEl.replaceChildren();
    if (!opt) {
      labelEl.append(el('span', { class: 'ui-select__placeholder' }, placeholder));
      return;
    }
    if (opt.dot) {
      labelEl.append(el('span', { class: `ui-select__dot ${opt.dot}` }));
    }
    labelEl.append(el('span', { class: 'ui-select__text' }, opt.label));
  }

  function renderMenu() {
    menu.replaceChildren();
    const items = allowEmpty
      ? [{ value: null, label: emptyLabel }, ...options]
      : options;

    items.forEach((opt) => {
      const isSelected = (opt.value ?? null) === (current ?? null);
      const item = el('button', {
        type: 'button',
        class: `ui-select__option${isSelected ? ' is-selected' : ''}`,
        role: 'option',
        'aria-selected': isSelected ? 'true' : 'false',
      });
      if (opt.dot) item.append(el('span', { class: `ui-select__dot ${opt.dot}` }));
      const textWrap = el('span', { class: 'ui-select__option-text' }, [
        el('span', {}, opt.label),
        opt.hint ? el('span', { class: 'ui-select__hint' }, opt.hint) : null,
      ]);
      item.append(textWrap);
      if (isSelected) item.append(el('span', { class: 'ui-select__check' }, '✓'));

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const next = opt.value ?? null;
        if (next !== current) {
          current = next;
          close();
          onChange?.(next);
          return;
        }
        close();
      });
      menu.append(item);
    });
  }

  function open() {
    closeOpenSelect();
    openSelect = api;
    renderMenu();
    menu.classList.remove('hidden');
    root.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function close() {
    menu.classList.add('hidden');
    root.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (openSelect === api) openSelect = null;
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.classList.contains('hidden')) open();
    else close();
  });

  const api = {
    root,
    _close: close,
    getValue: () => current,
    setValue: (v) => {
      current = (v === '' || v == null) ? null : v;
      renderTrigger();
    },
  };

  renderTrigger();
  return { root, setValue: api.setValue, getValue: api.getValue };
}

/** Campo com rótulo — útil em formulários e meta do modal. */
export function fieldLabel(label, control, { className = '' } = {}) {
  return el('div', { class: `ui-field ${className}`.trim() }, [
    el('span', { class: 'ui-field__label' }, label),
    control,
  ]);
}
