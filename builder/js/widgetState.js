/**
 * widgetState.js — Widget State Management Module
 * Owns the single source of truth for all widgets on the canvas.
 */

const DEFAULTS = {
  Button:      { text: 'Click Me', varName: 'btn',   width: 100, height: 32 },
  Label:       { text: 'Label',    varName: 'lbl',   width: 100, height: 28 },
  Entry:       { text: '',         varName: 'entry',  width: 140, height: 28 },
  Checkbutton: { text: 'Option',   varName: 'chk',   width: 120, height: 28 },
  Combobox:    { text: 'Select…',  varName: 'combo',  width: 140, height: 28 },
};

let _widgets = [];       // Array<WidgetModel>
let _nextId  = 1;
let _listeners = [];     // change callbacks

/** @typedef {{ id:string, type:string, x:number, y:number, width:number, height:number, text:string, varName:string }} WidgetModel */

export const WidgetState = {
  /** Subscribe to any state change */
  onChange(fn) { _listeners.push(fn); },

  _notify() { _listeners.forEach(fn => fn([..._widgets])); },

  /** Create and register a new widget */
  addWidget(type, x, y) {
    const d = DEFAULTS[type];
    if (!d) return null;
    // Auto-suffix varName to avoid Python name collisions
    const sameType = _widgets.filter(w => w.type === type).length;
    const varName = sameType === 0 ? d.varName : `${d.varName}${sameType + 1}`;
    const w = {
      id: `w${_nextId++}`,
      type,
      x: Math.round(x / 10) * 10,
      y: Math.round(y / 10) * 10,
      width:  d.width,
      height: d.height,
      text:   d.text,
      varName,
    };
    _widgets.push(w);
    this._notify();
    return w;
  },

  /** Update one or more properties of a widget by id */
  updateWidget(id, props) {
    const w = _widgets.find(w => w.id === id);
    if (!w) return;
    Object.assign(w, props);
    this._notify();
  },

  /** Remove a widget by id */
  removeWidget(id) {
    _widgets = _widgets.filter(w => w.id !== id);
    this._notify();
  },

  /** Replace position (used by drag handler) */
  moveWidget(id, x, y) {
    const w = _widgets.find(w => w.id === id);
    if (!w) return;
    w.x = Math.max(0, Math.round(x / 10) * 10);
    w.y = Math.max(0, Math.round(y / 10) * 10);
    this._notify();
  },

  /** Resize a widget */
  resizeWidget(id, width, height) {
    const w = _widgets.find(w => w.id === id);
    if (!w) return;
    w.width  = Math.max(40,  Math.round(width  / 10) * 10);
    w.height = Math.max(20,  Math.round(height / 10) * 10);
    this._notify();
  },

  getAll() { return [..._widgets]; },

  getById(id) { return _widgets.find(w => w.id === id) || null; },

  clear() { _widgets = []; _nextId = 1; this._notify(); },

  count() { return _widgets.length; },
};
