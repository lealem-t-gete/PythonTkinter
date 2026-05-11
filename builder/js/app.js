/**
 * app.js — Main Application Entry Point
 * Wires together WidgetState, DragDrop, and CodeGenerator.
 */

import { WidgetState }   from './widgetState.js';
import { CodeGenerator } from './codeGenerator.js';
import { initDragDrop, mountWidget, unmountWidget, updateWidgetElContent, applyWidgetElGeometry } from './dragDrop.js';

// ── DOM refs ──────────────────────────────────────────────────────────────────
const canvas         = document.getElementById('canvas');
const emptyState     = document.getElementById('canvas-empty-state');
const codeOutput     = document.getElementById('code-output');
const widgetCountEl  = document.getElementById('widget-count');
const codeSummaryEl  = document.getElementById('code-widget-summary');
const propsHeader    = document.getElementById('props-widget-label');
const propsBody      = document.getElementById('props-body');
const modalOverlay   = document.getElementById('modal-overlay');
const modalBody      = document.getElementById('modal-body');
const modalConfirm   = document.getElementById('modal-confirm');
const modalCancel    = document.getElementById('modal-cancel');
const toast          = document.getElementById('toast');

let _selectedId      = null;
let _deleteTargetId  = null;
let _toastTimer      = null;

// ── Helpers ───────────────────────────────────────────────────────────────────
function showToast(msg, type = '') {
  toast.textContent = msg;
  toast.className = `toast ${type ? 'toast--' + type : ''} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function selectWidget(id) {
  // Deselect previous
  document.querySelectorAll('.canvas-widget.selected')
    .forEach(el => el.classList.remove('selected'));

  _selectedId = id;

  if (!id) {
    propsHeader.textContent = 'No widget selected';
    propsBody.innerHTML = `
      <div class="props-empty-state">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
        </svg>
        <p>Select a widget on the canvas to edit its properties</p>
      </div>`;
    return;
  }

  const w = WidgetState.getById(id);
  if (!w) return;

  // Mark selected
  const el = document.querySelector(`.canvas-widget[data-id="${id}"]`);
  if (el) el.classList.add('selected');

  // Render props form
  propsHeader.textContent = `${w.type} — ${w.varName}`;
  propsBody.innerHTML = buildPropsForm(w);
  bindPropsEvents(w);
}

function buildPropsForm(w) {
  const showText = !['Entry'].includes(w.type);
  return `
    <div class="prop-group">
      <label class="prop-label" for="prop-varname">Variable Name</label>
      <input class="prop-input" id="prop-varname" type="text" value="${w.varName}" autocomplete="off" spellcheck="false"/>
    </div>
    ${showText ? `
    <div class="prop-group">
      <label class="prop-label" for="prop-text">Text / Label</label>
      <input class="prop-input" id="prop-text" type="text" value="${w.text}" autocomplete="off"/>
    </div>` : ''}
    <div class="prop-row">
      <div class="prop-group">
        <label class="prop-label" for="prop-x">X Position</label>
        <input class="prop-input" id="prop-x" type="number" min="0" value="${w.x}" step="10"/>
      </div>
      <div class="prop-group">
        <label class="prop-label" for="prop-y">Y Position</label>
        <input class="prop-input" id="prop-y" type="number" min="0" value="${w.y}" step="10"/>
      </div>
    </div>
    <div class="prop-row">
      <div class="prop-group">
        <label class="prop-label" for="prop-w">Width (px)</label>
        <input class="prop-input" id="prop-w" type="number" min="40" value="${w.width}" step="10"/>
      </div>
      <div class="prop-group">
        <label class="prop-label" for="prop-h">Height (px)</label>
        <input class="prop-input" id="prop-h" type="number" min="20" value="${w.height}" step="10"/>
      </div>
    </div>
    <button class="prop-delete-btn" id="prop-delete" aria-label="Delete widget">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
      </svg>
      Delete Widget
    </button>`;
}

function bindPropsEvents(w) {
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  const updateProp = debounce((key, val) => {
    WidgetState.updateWidget(w.id, { [key]: val });
    // Re-sync DOM text for visual widgets
    const el = document.querySelector(`.canvas-widget[data-id="${w.id}"]`);
    const updated = WidgetState.getById(w.id);
    if (el && updated) {
      updateWidgetElContent(el, updated);
      applyWidgetElGeometry(el, updated);
    }
    propsHeader.textContent = `${w.type} — ${WidgetState.getById(w.id)?.varName}`;
  }, 160);

  const bind = (id, key, transform = v => v) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => updateProp(key, transform(el.value)));
  };

  bind('prop-varname', 'varName', v => v.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || w.varName);
  bind('prop-text',    'text');
  bind('prop-x',       'x',      v => Math.max(0, Math.round(Number(v) / 10) * 10));
  bind('prop-y',       'y',      v => Math.max(0, Math.round(Number(v) / 10) * 10));
  bind('prop-w',       'width',  v => Math.max(40, Number(v)));
  bind('prop-h',       'height', v => Math.max(20, Number(v)));

  document.getElementById('prop-delete')?.addEventListener('click', () => confirmDelete(w.id));
}

// ── Code output renderer ──────────────────────────────────────────────────────
function refreshCode() {
  const code = CodeGenerator.generate();
  codeOutput.textContent = code;
  if (window.hljs) hljs.highlightElement(codeOutput);
  const wc = WidgetState.count();
  const lc = code.split('\n').length;
  codeSummaryEl.textContent = `${wc} widget${wc !== 1 ? 's' : ''} • ${lc} lines`;
  widgetCountEl.textContent = wc;
  emptyState.classList.toggle('hidden', wc > 0);
}

// ── Delete flow ───────────────────────────────────────────────────────────────
function confirmDelete(id) {
  const w = WidgetState.getById(id);
  if (!w) return;
  _deleteTargetId = id;
  modalBody.textContent = `Delete "${w.varName}" (${w.type})? This cannot be undone.`;
  modalOverlay.removeAttribute('hidden');
}

modalConfirm.addEventListener('click', () => {
  if (!_deleteTargetId) return;
  unmountWidget(_deleteTargetId);
  WidgetState.removeWidget(_deleteTargetId);
  if (_selectedId === _deleteTargetId) selectWidget(null);
  _deleteTargetId = null;
  modalOverlay.setAttribute('hidden', '');
  showToast('Widget deleted', 'error');
});

modalCancel.addEventListener('click', () => {
  _deleteTargetId = null;
  modalOverlay.setAttribute('hidden', '');
});
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) modalCancel.click(); });

// ── Canvas keyboard delete ────────────────────────────────────────────────────
canvas.addEventListener('widget:delete', e => confirmDelete(e.detail.id));

// ── Toolbar buttons ───────────────────────────────────────────────────────────
document.getElementById('btn-clear').addEventListener('click', () => {
  if (WidgetState.count() === 0) return;
  _deleteTargetId = '__all__';
  modalBody.textContent = 'Remove ALL widgets from the canvas? This cannot be undone.';
  modalOverlay.removeAttribute('hidden');
  // Override confirm to clear all
  modalConfirm.onclick = () => {
    document.querySelectorAll('.canvas-widget').forEach(el => el.remove());
    WidgetState.clear();
    selectWidget(null);
    modalOverlay.setAttribute('hidden', '');
    showToast('Canvas cleared');
    // Restore normal delete behaviour
    modalConfirm.onclick = null;
    modalConfirm.addEventListener('click', handleNormalDelete);
  };
});

function handleNormalDelete() {
  if (!_deleteTargetId || _deleteTargetId === '__all__') return;
  unmountWidget(_deleteTargetId);
  WidgetState.removeWidget(_deleteTargetId);
  if (_selectedId === _deleteTargetId) selectWidget(null);
  _deleteTargetId = null;
  modalOverlay.setAttribute('hidden', '');
  showToast('Widget deleted', 'error');
}
modalConfirm.addEventListener('click', handleNormalDelete);

async function copyCode() {
  try {
    await navigator.clipboard.writeText(CodeGenerator.generate());
    showToast('Code copied to clipboard!', 'success');
  } catch {
    showToast('Copy failed — try selecting the code manually.', 'error');
  }
}

document.getElementById('btn-copy').addEventListener('click', copyCode);
document.getElementById('btn-copy-inline').addEventListener('click', copyCode);

document.getElementById('btn-download').addEventListener('click', () => {
  const code = CodeGenerator.generate();
  const blob = new Blob([code], { type: 'text/x-python' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'app.py'; a.click();
  URL.revokeObjectURL(url);
  showToast('app.py downloaded!', 'success');
});

// ── State subscription → re-render code on every change ──────────────────────
WidgetState.onChange(() => refreshCode());

// ── Bootstrap ─────────────────────────────────────────────────────────────────
initDragDrop(canvas, selectWidget);
refreshCode();
