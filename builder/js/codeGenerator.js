/**
 * codeGenerator.js — Python OOP Code Template Module
 * Generates a Python class that inherits from tk.Tk using .place() layout.
 */

import { WidgetState } from './widgetState.js';

/** Map widget type → Python constructor call */
const WIDGET_CONSTRUCTORS = {
  Button:      (w) => `ttk.Button(self, text="${w.text}")`,
  Label:       (w) => `tk.Label(self, text="${w.text}")`,
  Entry:       (w) => `ttk.Entry(self, width=${Math.floor(w.width / 7)})`,
  Checkbutton: (w) => `ttk.Checkbutton(self, text="${w.text}", variable=self.${w.varName}_var)`,
  Combobox:    (w) => `ttk.Combobox(self, values=["Option 1", "Option 2"], width=${Math.floor(w.width / 7)})`,
};

/** Extra setup lines needed before .place() for some widgets */
const WIDGET_SETUP = {
  Checkbutton: (w) => `        self.${w.varName}_var = tk.BooleanVar()`,
};

function generateImports() {
  return `import tkinter as tk\nfrom tkinter import ttk`;
}

function generateClassHeader() {
  return `\n\nclass App(tk.Tk):\n    def __init__(self):\n        super().__init__()\n        self.title("My Tkinter App")\n        self.geometry("800x600")\n        self.resizable(False, False)\n        self._build_ui()\n`;
}

function generateBuildUI(widgets) {
  if (widgets.length === 0) {
    return `\n    def _build_ui(self):\n        pass  # Drag widgets onto the canvas to generate code\n`;
  }

  const lines = [];
  lines.push(`\n    def _build_ui(self):`);

  // Pre-setup (e.g. BooleanVar for Checkbutton)
  const setupLines = widgets
    .filter(w => WIDGET_SETUP[w.type])
    .map(w => WIDGET_SETUP[w.type](w));
  if (setupLines.length > 0) {
    lines.push('        # Variable declarations');
    setupLines.forEach(l => lines.push(l));
    lines.push('');
  }

  lines.push('        # Widget creation & placement');
  widgets.forEach(w => {
    const ctor = WIDGET_CONSTRUCTORS[w.type];
    if (!ctor) return;
    lines.push(`        self.${w.varName} = ${ctor(w)}`);
    lines.push(`        self.${w.varName}.place(x=${w.x}, y=${w.y}, width=${w.width}, height=${w.height})`);
  });

  return lines.join('\n');
}

function generateMain() {
  return `\n\nif __name__ == "__main__":\n    app = App()\n    app.mainloop()\n`;
}

export const CodeGenerator = {
  /**
   * Generate the full Python source string from current widget state.
   * @returns {string}
   */
  generate() {
    const widgets = WidgetState.getAll();
    return [
      generateImports(),
      generateClassHeader(),
      generateBuildUI(widgets),
      generateMain(),
    ].join('');
  },

  /** Count total lines in generated output */
  lineCount() {
    return this.generate().split('\n').length;
  },
};
