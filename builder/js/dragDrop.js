/**
 * dragDrop.js — Drag & Drop Module
 * Handles:
 *  1. Dragging from the sidebar palette onto the canvas (native HTML5 DnD)
 *  2. Moving and resizing widgets already on the canvas (interact.js)
 */

import { WidgetState } from './widgetState.js';

const SNAP = 10; // px grid increment

/** Build the visible DOM element for a widget model */
export function createWidgetEl(w) {
  const el = document.createElement('div');
  el.className = 'canvas-widget';
  el.dataset.id   = w.id;
  el.dataset.type = w.type;
  el.setAttribute('tabindex', '0');
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', `${w.type} widget: ${w.text || w.varName}`);

  // Type badge
  const badge = document.createElement('span');
  badge.className = 'widget-type-badge';
  badge.textContent = w.type;
  el.appendChild(badge);

  // Resize handle
  const handle = document.createElement('div');
  handle.className = 'resize-handle';
  handle.setAttribute('aria-hidden', 'true');
  el.appendChild(handle);

  updateWidgetElContent(el, w);
  applyWidgetElGeometry(el, w);
  return el;
}

/** Sync the text label visible inside a canvas widget */
export function updateWidgetElContent(el, w) {
  // Remove any existing text node (first child that is text)
  [...el.childNodes].forEach(n => {
    if (n.nodeType === Node.TEXT_NODE) n.remove();
  });
  const label = document.createTextNode(w.text || w.varName);
  el.insertBefore(label, el.firstChild);
}

export function applyWidgetElGeometry(el, w) {
  el.style.left   = `${w.x}px`;
  el.style.top    = `${w.y}px`;
  el.style.width  = `${w.width}px`;
  el.style.height = `${w.height}px`;
}

/**
 * Initialise all drag/drop behaviours.
 * @param {HTMLElement} canvas  - The drop target
 * @param {Function}    onSelect - Called with widgetId when a widget is clicked
 */
export function initDragDrop(canvas, onSelect) {
  // ── 1. PALETTE → CANVAS (HTML5 native dragstart / drop) ──────────────
  document.querySelectorAll('.palette-item').forEach(item => {
    item.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', item.dataset.widgetType);
      e.dataTransfer.effectAllowed = 'copy';
    });
  });

  canvas.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    canvas.classList.add('drag-over');
  });
  canvas.addEventListener('dragleave', () => canvas.classList.remove('drag-over'));

  canvas.addEventListener('drop', e => {
    e.preventDefault();
    canvas.classList.remove('drag-over');
    const type = e.dataTransfer.getData('text/plain');
    if (!type) return;

    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    const x = Math.max(0, Math.min(Math.round(rawX / SNAP) * SNAP, canvas.offsetWidth  - 80));
    const y = Math.max(0, Math.min(Math.round(rawY / SNAP) * SNAP, canvas.offsetHeight - 28));

    const w = WidgetState.addWidget(type, x, y);
    if (w) {
      const el = mountWidget(canvas, w, onSelect);
      el.click(); // auto-select newly dropped widget
    }
  });

  // Keyboard accessibility: drop on canvas focus + Enter not needed,
  // but allow deselecting by clicking empty canvas space
  canvas.addEventListener('click', e => {
    if (e.target === canvas || e.target.classList.contains('canvas__grid-overlay') || e.target.classList.contains('canvas__empty-state')) {
      onSelect(null);
    }
  });
}

/**
 * Mount a widget element onto the canvas and wire interact.js
 * for drag-move and resize.
 */
export function mountWidget(canvas, w, onSelect) {
  const el = createWidgetEl(w);
  canvas.appendChild(el);

  // Click to select
  el.addEventListener('click', e => {
    e.stopPropagation();
    onSelect(w.id);
  });
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(w.id); }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Fire a custom event the app can listen to
      el.dispatchEvent(new CustomEvent('widget:delete', { bubbles: true, detail: { id: w.id } }));
    }
  });

  // ── 2. interact.js: DRAG-MOVE within canvas ───────────────────────────
  interact(el).draggable({
    listeners: {
      move(event) {
        const snapVal = document.getElementById('toggle-snap')?.checked ? SNAP : 1;
        let nx = (parseFloat(el.style.left) || 0) + event.dx;
        let ny = (parseFloat(el.style.top)  || 0) + event.dy;
        // Clamp to canvas bounds
        nx = Math.max(0, Math.min(nx, canvas.offsetWidth  - w.width));
        ny = Math.max(0, Math.min(ny, canvas.offsetHeight - w.height));
        // Snap
        nx = Math.round(nx / snapVal) * snapVal;
        ny = Math.round(ny / snapVal) * snapVal;
        el.style.left = `${nx}px`;
        el.style.top  = `${ny}px`;
        WidgetState.moveWidget(w.id, nx, ny);
      },
    },
    modifiers: [],
    inertia: false,
  });

  // ── 3. interact.js: RESIZE ────────────────────────────────────────────
  interact(el).resizable({
    edges: { right: true, bottom: true, bottomRight: '.resize-handle' },
    listeners: {
      move(event) {
        const snapVal = document.getElementById('toggle-snap')?.checked ? SNAP : 1;
        let nw = Math.max(40,  Math.round(event.rect.width  / snapVal) * snapVal);
        let nh = Math.max(20,  Math.round(event.rect.height / snapVal) * snapVal);
        el.style.width  = `${nw}px`;
        el.style.height = `${nh}px`;
        WidgetState.resizeWidget(w.id, nw, nh);
      },
    },
    modifiers: [
      interact.modifiers.restrictSize({ min: { width: 40, height: 20 } }),
    ],
  });

  return el;
}

/** Remove a widget element from the DOM */
export function unmountWidget(id) {
  const el = document.querySelector(`.canvas-widget[data-id="${id}"]`);
  if (el) el.remove();
}
