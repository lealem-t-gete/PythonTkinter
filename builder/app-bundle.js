/* ── Widget State ── */
const DEFAULTS={
  Button:      {text:'Click Me', varName:'btn',   width:100,height:32},
  Label:       {text:'Label',    varName:'lbl',   width:100,height:28},
  Entry:       {text:'',         varName:'entry', width:140,height:28},
  Checkbutton: {text:'Option',   varName:'chk',   width:130,height:28},
  Combobox:    {text:'Select…',  varName:'combo', width:140,height:28, options:'Option 1,Option 2,Option 3'},
  Radiobutton: {text:'Male',     varName:'rb',    width:90, height:28, group:'gender_var', value:'Male'},
};
let _widgets=[],_nextId=1,_listeners=[];
const WidgetState={
  onChange(fn){_listeners.push(fn);},
  _notify(){_listeners.forEach(fn=>fn());},
  addWidget(type,x,y){
    const d=DEFAULTS[type];if(!d)return null;
    const same=_widgets.filter(w=>w.type===type).length;
    const varName=same===0?d.varName:`${d.varName}${same+1}`;
    const w={id:`w${_nextId++}`,type,x:snap(x),y:snap(y),width:d.width,height:d.height,...d,varName};
    _widgets.push(w);this._notify();return w;
  },
  updateWidget(id,props){const w=_widgets.find(w=>w.id===id);if(w){Object.assign(w,props);this._notify();}},
  moveWidget(id,x,y){const w=_widgets.find(w=>w.id===id);if(w){w.x=Math.max(0,snap(x));w.y=Math.max(0,snap(y));this._notify();}},
  resizeWidget(id,nw,nh){const w=_widgets.find(w=>w.id===id);if(w){w.width=Math.max(40,snap(nw));w.height=Math.max(20,snap(nh));this._notify();}},
  removeWidget(id){_widgets=_widgets.filter(w=>w.id!==id);this._notify();},
  getAll(){return[..._widgets];},getById(id){return _widgets.find(w=>w.id===id)||null;},
  clear(){_widgets=[];_nextId=1;this._notify();},count(){return _widgets.length;}
};

/* ── Code Generator (procedural style) ── */
const CodeGenerator={generate(){
  const ws=WidgetState.getAll();
  const lines=[];
  lines.push('import tkinter as tk');
  lines.push('from tkinter import ttk');
  lines.push('');
  lines.push('root = tk.Tk()');
  lines.push('root.geometry("800x600")');
  lines.push('root.title("My Tkinter App")');
  lines.push('');

  // Variable declarations
  const chks=ws.filter(w=>w.type==='Checkbutton');
  const rbs=ws.filter(w=>w.type==='Radiobutton');
  // unique StringVar groups
  const rbGroups=[...new Set(rbs.map(w=>w.group))];
  if(chks.length||rbs.length){
    lines.push('# Variable declarations');
    rbGroups.forEach(g=>lines.push(`${g} = tk.StringVar()`));
    chks.forEach(w=>lines.push(`${w.varName}_var = tk.BooleanVar()`));
    lines.push('');
  }

  if(ws.length===0){
    lines.push('# Drop widgets onto the canvas to generate code');
    lines.push('');
  } else {
    lines.push('# Widget creation & placement');
    ws.forEach(w=>{
      let ctor='';
      if(w.type==='Button')   ctor=`ttk.Button(root, text="${w.text}")`;
      else if(w.type==='Label')  ctor=`tk.Label(root, text="${w.text}")`;
      else if(w.type==='Entry')  ctor=`ttk.Entry(root, width=${Math.floor(w.width/7)})`;
      else if(w.type==='Checkbutton') ctor=`tk.Checkbutton(root, text="${w.text}", variable=${w.varName}_var)`;
      else if(w.type==='Combobox'){
        const opts=(w.options||'Option 1,Option 2').split(',').map(o=>`"${o.trim()}"`).join(', ');
        ctor=`ttk.Combobox(root, values=(${opts}), width=${Math.floor(w.width/7)})`;
      }
      else if(w.type==='Radiobutton') ctor=`tk.Radiobutton(root, text="${w.text}", variable=${w.group}, value="${w.value}")`;
      if(!ctor)return;
      lines.push(`${w.varName} = ${ctor}`);
      lines.push(`${w.varName}.place(x=${w.x}, y=${w.y}, width=${w.width}, height=${w.height})`);
    });
    lines.push('');
  }

  lines.push('root.mainloop()');
  return lines.join('\n');
}};

/* ── Helpers ── */
function snapVal(){return document.getElementById('toggle-snap')?.checked?10:1;}
function snap(v){const s=snapVal();return Math.round(v/s)*s;}
function syncEl(el,w){
  el.style.left=w.x+'px';el.style.top=w.y+'px';
  el.style.width=w.width+'px';el.style.height=w.height+'px';
  let t=el.childNodes[0];if(t&&t.nodeType===3)t.remove();
  const label=w.type==='Radiobutton'?`◉ ${w.text}`:w.type==='Checkbutton'?`☐ ${w.text}`:(w.text||w.varName);
  el.insertBefore(document.createTextNode(label),el.firstChild);
}
function makeEl(w){
  const el=document.createElement('div');
  el.className='cv-widget';el.dataset.id=w.id;el.dataset.type=w.type;el.tabIndex=0;
  const badge=document.createElement('span');badge.className='cv-badge';badge.textContent=w.type;el.appendChild(badge);
  const rh=document.createElement('div');rh.className='cv-resize';el.appendChild(rh);
  syncEl(el,w);return el;
}

/* ── Ghost drag from palette → canvas ── */
let _dragType=null,_ghost=null;
function initPaletteDrag(canvas,onSelect){
  document.querySelectorAll('.palette-item').forEach(item=>{
    interact(item).draggable({inertia:false,listeners:{
      start(e){
        _dragType=item.dataset.widgetType;
        _ghost=document.createElement('div');
        _ghost.textContent=_dragType;
        _ghost.style.cssText='position:fixed;padding:5px 12px;border-radius:6px;background:#4fffb0;color:#0a0f0a;font-weight:700;font-size:.78rem;pointer-events:none;z-index:9999;opacity:.9;';
        document.body.appendChild(_ghost);
        _ghost._x=e.clientX;_ghost._y=e.clientY;
        _ghost.style.left=e.clientX+'px';_ghost.style.top=e.clientY+'px';
      },
      move(e){
        if(!_ghost)return;
        _ghost._x+=e.dx;_ghost._y+=e.dy;
        _ghost.style.left=_ghost._x+'px';_ghost.style.top=_ghost._y+'px';
        const r=canvas.getBoundingClientRect();
        canvas.classList.toggle('drag-over',_ghost._x>=r.left&&_ghost._x<=r.right&&_ghost._y>=r.top&&_ghost._y<=r.bottom);
      },
      end(e){
        if(_ghost){_ghost.remove();_ghost=null;}
        canvas.classList.remove('drag-over');
        if(!_dragType)return;
        const r=canvas.getBoundingClientRect();
        if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){
          const x=Math.max(0,Math.min(snap(e.clientX-r.left),canvas.offsetWidth-80));
          const y=Math.max(0,Math.min(snap(e.clientY-r.top),canvas.offsetHeight-28));
          const w=WidgetState.addWidget(_dragType,x,y);
          if(w){mountWidget(canvas,w);selectWidget(w.id);}
        }
        _dragType=null;
      }
    }});
  });
  canvas.addEventListener('click',e=>{
    if(e.target===canvas||e.target.classList.contains('cv-grid')||e.target.classList.contains('cv-empty'))selectWidget(null);
  });
}

/* ── Canvas widget interact ── */
function mountWidget(canvas,w){
  const el=makeEl(w);canvas.appendChild(el);
  el.addEventListener('click',e=>{e.stopPropagation();selectWidget(w.id);});
  el.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();selectWidget(w.id);}
    if(e.key==='Delete'||e.key==='Backspace'){el.dispatchEvent(new CustomEvent('widget:delete',{bubbles:true,detail:{id:w.id}}));}
  });
  interact(el).draggable({inertia:false,
    modifiers:[interact.modifiers.restrictRect({restriction:'parent'})],
    listeners:{move(ev){
      const nx=snap((parseFloat(el.style.left)||0)+ev.dx);
      const ny=snap((parseFloat(el.style.top)||0)+ev.dy);
      el.style.left=nx+'px';el.style.top=ny+'px';
      WidgetState.moveWidget(w.id,nx,ny);
    }}
  }).resizable({
    edges:{right:true,bottom:true,bottomRight:'.cv-resize'},
    modifiers:[interact.modifiers.restrictSize({min:{width:40,height:20}})],
    listeners:{move(ev){
      const nw=snap(ev.rect.width),nh=snap(ev.rect.height);
      el.style.width=nw+'px';el.style.height=nh+'px';
      WidgetState.resizeWidget(w.id,nw,nh);
    }}
  });
  return el;
}
function unmountWidget(id){document.querySelector(`.cv-widget[data-id="${id}"]`)?.remove();}

/* ── Properties form ── */
function buildForm(w){
  const showText=['Button','Label','Checkbutton','Radiobutton'].includes(w.type);
  let html=`<div class="pf-group"><label class="pf-label">Variable Name</label><input class="pf-input" id="pf-var" value="${w.varName}" autocomplete="off"/></div>`;
  if(showText) html+=`<div class="pf-group"><label class="pf-label">Text / Label</label><input class="pf-input" id="pf-text" value="${w.text||''}"/></div>`;
  if(w.type==='Combobox') html+=`<div class="pf-group"><label class="pf-label">Options (comma-separated)</label><input class="pf-input" id="pf-options" value="${w.options||'Option 1,Option 2'}" placeholder="e.g. Apple,Banana,Cherry"/></div>`;
  if(w.type==='Radiobutton') html+=`
    <div class="pf-group"><label class="pf-label">Group Variable</label><input class="pf-input" id="pf-group" value="${w.group||'gender_var'}"/></div>
    <div class="pf-group"><label class="pf-label">Value (when selected)</label><input class="pf-input" id="pf-value" value="${w.value||'Male'}"/></div>`;
  html+=`<div class="pf-row">
    <div class="pf-group"><label class="pf-label">X</label><input class="pf-input" id="pf-x" type="number" min="0" step="10" value="${w.x}"/></div>
    <div class="pf-group"><label class="pf-label">Y</label><input class="pf-input" id="pf-y" type="number" min="0" step="10" value="${w.y}"/></div>
  </div><div class="pf-row">
    <div class="pf-group"><label class="pf-label">Width</label><input class="pf-input" id="pf-w" type="number" min="40" step="10" value="${w.width}"/></div>
    <div class="pf-group"><label class="pf-label">Height</label><input class="pf-input" id="pf-h" type="number" min="20" step="10" value="${w.height}"/></div>
  </div><button class="pf-del" id="pf-delete">🗑 Delete Widget</button>`;
  return html;
}

/* ── App bootstrap ── */
let selectWidget;
document.addEventListener('DOMContentLoaded',()=>{
  const canvas=document.getElementById('canvas');
  const emptyState=document.getElementById('cv-empty');
  const codeOut=document.getElementById('code-output');
  const widgetCount=document.getElementById('widget-count');
  const codeSummary=document.getElementById('code-summary');
  const propsLabel=document.getElementById('props-label');
  const propsBody=document.getElementById('props-body');
  const modalOverlay=document.getElementById('modal-overlay');
  const modalBody=document.getElementById('modal-body');
  const modalConfirm=document.getElementById('modal-confirm');
  const modalCancel=document.getElementById('modal-cancel');
  const toast=document.getElementById('toast');
  let selectedId=null,deleteTargetId=null,toastTimer=null;

  function showToast(msg,type=''){
    toast.textContent=msg;toast.className='toast show'+(type?' toast--'+type:'');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400);
  }

  selectWidget=function(id){
    document.querySelectorAll('.cv-widget.selected').forEach(el=>el.classList.remove('selected'));
    selectedId=id;
    if(!id){
      propsLabel.textContent='No widget selected';
      propsBody.innerHTML='<div class="props-empty"><p>Click a widget on the canvas to edit its properties</p></div>';
      return;
    }
    const w=WidgetState.getById(id);if(!w)return;
    document.querySelector(`.cv-widget[data-id="${id}"]`)?.classList.add('selected');
    propsLabel.textContent=`${w.type} — ${w.varName}`;
    propsBody.innerHTML=buildForm(w);
    bindForm(w);
  };

  function bindForm(w){
    const db=(fn,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms);};};
    const up=db((key,val)=>{
      WidgetState.updateWidget(w.id,{[key]:val});
      const el=document.querySelector(`.cv-widget[data-id="${w.id}"]`);
      const uw=WidgetState.getById(w.id);if(el&&uw)syncEl(el,uw);
      propsLabel.textContent=`${w.type} — ${WidgetState.getById(w.id)?.varName}`;
    },200);
    const b=(elId,key,t=v=>v)=>{const el=document.getElementById(elId);if(el)el.addEventListener('input',()=>up(key,t(el.value)));};
    b('pf-var','varName',v=>v.trim().replace(/\W+/g,'_')||w.varName);
    b('pf-text','text');
    b('pf-options','options');
    b('pf-group','group',v=>v.trim().replace(/\W+/g,'_')||'gender_var');
    b('pf-value','value');
    b('pf-x','x',v=>Math.max(0,snap(+v)));
    b('pf-y','y',v=>Math.max(0,snap(+v)));
    b('pf-w','width',v=>Math.max(40,+v));
    b('pf-h','height',v=>Math.max(20,+v));
    document.getElementById('pf-delete')?.addEventListener('click',()=>confirmDelete(w.id));
  }

  function refreshCode(){
    const code=CodeGenerator.generate();
    codeOut.textContent=code;
    if(window.hljs)hljs.highlightElement(codeOut);
    const wc=WidgetState.count();
    widgetCount.textContent=wc;
    codeSummary.textContent=`${wc} widget${wc!==1?'s':''} • ${code.split('\n').length} lines`;
    emptyState.classList.toggle('hidden',wc>0);
  }

  function confirmDelete(id){
    const w=WidgetState.getById(id);
    if(!w&&id!=='__all__')return;
    deleteTargetId=id;
    modalBody.textContent=id==='__all__'?'Remove ALL widgets from the canvas?':`Delete "${w.varName}" (${w.type})?`;
    modalOverlay.removeAttribute('hidden');
  }

  modalConfirm.addEventListener('click',()=>{
    if(deleteTargetId==='__all__'){
      document.querySelectorAll('.cv-widget').forEach(el=>el.remove());
      WidgetState.clear();selectWidget(null);showToast('Canvas cleared');
    } else if(deleteTargetId){
      unmountWidget(deleteTargetId);WidgetState.removeWidget(deleteTargetId);
      if(selectedId===deleteTargetId)selectWidget(null);
      showToast('Widget deleted','error');
    }
    deleteTargetId=null;modalOverlay.setAttribute('hidden','');
  });
  modalCancel.addEventListener('click',()=>{deleteTargetId=null;modalOverlay.setAttribute('hidden','');});
  modalOverlay.addEventListener('click',e=>{if(e.target===modalOverlay)modalCancel.click();});
  canvas.addEventListener('widget:delete',e=>confirmDelete(e.detail.id));
  document.getElementById('btn-clear').addEventListener('click',()=>{if(WidgetState.count()>0)confirmDelete('__all__');});

  async function copyCode(){
    try{await navigator.clipboard.writeText(CodeGenerator.generate());showToast('Copied!','success');}
    catch{showToast('Copy failed','error');}
  }
  document.getElementById('btn-copy').addEventListener('click',copyCode);
  document.getElementById('btn-copy-inline').addEventListener('click',copyCode);
  document.getElementById('btn-download').addEventListener('click',()=>{
    const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(new Blob([CodeGenerator.generate()],{type:'text/x-python'})),download:'app.py'});
    a.click();URL.revokeObjectURL(a.href);showToast('app.py downloaded!','success');
  });

  WidgetState.onChange(()=>refreshCode());
  initPaletteDrag(canvas,selectWidget);
  refreshCode();
});
