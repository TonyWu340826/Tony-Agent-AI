(() => {
  const { useState, useEffect } = React;

  const loadOnce = (src) => new Promise((resolve, reject) => {
    if ([...document.scripts].some(s => (s.src||'').endsWith(src))) { resolve(); return; }
    const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag);
  });

  const IconPlus = (window.LucideReact && window.LucideReact.Plus) || ((props)=>React.createElement('span',{className:props.className}));
  const IconUser = (window.LucideReact && window.LucideReact.User) || ((props)=>React.createElement('span',{className:props.className}, '👤'));
  const IconBot = (window.LucideReact && window.LucideReact.Bot) || ((props)=>React.createElement('span',{className:props.className}, '🤖'));
  const IconRobot = (window.LucideReact && window.LucideReact.Bot) || ((props)=>React.createElement('span',{className:props.className}, '🤖'));
  const IconSettings = (window.LucideReact && window.LucideReact.Settings) || ((props)=>React.createElement('span',{className:props.className}, '⚙️'));
  const IconGlobe = (window.LucideReact && window.LucideReact.Globe) || ((props)=>React.createElement('span',{className:props.className}, '🌐'));
  const IconMessageSquare = (window.LucideReact && window.LucideReact.MessageSquare) || ((props)=>React.createElement('span',{className:props.className}, '💬'));
  const IconArrowLeft = (window.LucideReact && window.LucideReact.ArrowLeft) || ((props)=>React.createElement('span',{className:props.className}, '←'));
  const Portal = ({ children }) => (window.ReactDOM && window.ReactDOM.createPortal ? window.ReactDOM.createPortal(children, document.body) : children);

  const SceneCard = ({ scene, onClick }) => (
    React.createElement('button', { className:'group text-left bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition transform hover:-translate-y-0.5 p-5 w-full space-y-3', onClick },
      React.createElement('div', { className:'flex items-center justify-between' },
        React.createElement('div', { className:'inline-flex items-center gap-3' },
          React.createElement('div', { className:'w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold shadow' }, (String(scene.sceneName||scene.scene_name||'').charAt(0)||'S')),
          React.createElement('div', { className:'text-lg font-semibold text-slate-900' }, scene.sceneName || scene.scene_name || '-')
        ),
        React.createElement('span', { className:'px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-mono border border-slate-200' }, scene.sceneCode || scene.scene_code || '-')
      ),
      React.createElement('div', { className:'text-sm text-slate-600 whitespace-normal break-words max-h-14 overflow-hidden' }, scene.description || '-'),
      React.createElement('div', { className:'opacity-0 group-hover:opacity-100 transition text-xs text-blue-600 font-medium inline-flex items-center gap-1' }, '查看模板 →')
    )
  );

  const TemplateCard = ({ tpl }) => {
    const { useState, useEffect } = React; const [open, setOpen] = useState(false);
    const copy = () => {
      try {
        const c = tpl.templateContent || tpl.template_content || '';
        if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(c); return; }
        const ta = document.createElement('textarea'); ta.value = c; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.focus(); ta.select(); try{ document.execCommand('copy'); }catch(_){ } document.body.removeChild(ta);
      } catch(_) {}
    };
    return React.createElement('div', { className:'group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-300 transition transform hover:-translate-y-0.5 p-5 space-y-3' },
      React.createElement('div', { className:'h-1.5 w-16 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500' }),
      React.createElement('div', { className:'flex items-start justify-between' },
        React.createElement('div', { className:'text-lg font-semibold text-slate-900' }, tpl.templateName || tpl.template_name || '-'),
        React.createElement('div', { className:'flex items-center gap-2' },
          React.createElement('span', { className:'px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs border border-slate-200' }, tpl.modelType || tpl.model_type || ''),
          React.createElement('span', { className:'px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs border border-slate-200' }, tpl.roleType || tpl.role_type || ''),
          React.createElement('span', { className:'px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs border border-slate-200' }, 'v', tpl.version || 1)
        )
      ),
      React.createElement('div', { className:'text-xs text-slate-500 font-mono' }, tpl.code || '-'),
      React.createElement('div', { className:'flex items-center justify-between' },
        React.createElement('span', { className:'text-xs text-slate-500' }, '提示词内容'),
        React.createElement('div', { className:'inline-flex items-center gap-2' },
          React.createElement('button', { className:'px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200', onClick:()=>setOpen(true) }, '展开'),
          React.createElement('button', { className:'px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200', onClick:copy }, '复制')
        )
      ),
      open ? React.createElement(Portal, null,
        React.createElement('div', { className:'fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4', onClick:()=>setOpen(false) },
        React.createElement('div', { className:'relative bg-white rounded-2xl shadow-2xl w-[88vw] max-w-[1000px] min-w-[680px] max-h-[68vh] overflow-hidden flex flex-col', onClick:(e)=>e.stopPropagation() },
          React.createElement('button', { className:'absolute top-3 right-3 px-3 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200', onClick:()=>setOpen(false) }, '关闭'),
          React.createElement('div', { className:'sticky top-0 z-10 flex items-center justify-between p-4 md:p-5 border-b bg-white' },
            React.createElement('div', { className:'text-lg font-semibold text-slate-900' }, tpl.templateName || tpl.template_name || '-'),
            React.createElement('div', { className:'inline-flex items-center gap-2' },
              React.createElement('button', { className:'px-3 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200', onClick:()=>setOpen(false) }, '关闭')
            )
          ),
          React.createElement('div', { className:'p-4 md:p-6 overflow-auto' },
            React.createElement('pre', { className:'bg-slate-50 border border-slate-200 rounded-xl p-4 text-base leading-7 whitespace-pre-wrap break-words text-slate-900 max-h-[52vh] overflow-auto' }, tpl.templateContent || tpl.template_content || '')
          ),
          React.createElement('div', { className:'p-3 border-t bg-white flex items-center justify-center' },
            React.createElement('button', { className:'px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200', onClick:()=>setOpen(false) }, '关闭')
          )
        ))
      ) : null,
      React.createElement('div', { className:'absolute inset-x-0 bottom-0 h-0.5 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 transition' })
    );
  };

  const PromptEngineeringPage = (props={}) => {
    const currentUser = props.currentUser || (window.__currentUser||null);
    const requireLogin = props.requireLogin || (()=>{ try{ alert('请先登录'); }catch(_){ } });
    const isVip99 = !!(currentUser && Number(currentUser.vipLevel)===99);
    const requireVip = () => { if(!currentUser){ requireLogin(); return false; } if(!isVip99){ alert('该功能仅限VIP可用'); return false; } return true; };
    const [view, setView] = useState('list');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [scenes, setScenes] = useState([]);
    const [scenesPage, setScenesPage] = useState(0);
    const [scenesTotal, setScenesTotal] = useState(1);
    const [sceneSearch, setSceneSearch] = useState('');
    const [editorReady, setEditorReady] = useState(!!(window.Components && window.Components.PromptTemplateEdit));
    const [currentScene, setCurrentScene] = useState(null);
    const [tpls, setTpls] = useState([]);
    const [tplLoading, setTplLoading] = useState(false);
    const [tplPage, setTplPage] = useState(0);
    const [tplTotal, setTplTotal] = useState(1);
    const [appOpen, setAppOpen] = useState(false);
    const [appLoading, setAppLoading] = useState(false);
    const [appError, setAppError] = useState('');
    const [appInput, setAppInput] = useState('');
    const [appTpls, setAppTpls] = useState([]);
    const [appTplId, setAppTplId] = useState('');
    const [appFields, setAppFields] = useState([]);
    const [appParams, setAppParams] = useState({});
    const [appLaunchOpen, setAppLaunchOpen] = useState(false);
    const [appToast, setAppToast] = useState('');
    const [appChat, setAppChat] = useState([]);
    const [appThinking, setAppThinking] = useState(false);
    const [appTplMenuOpen, setAppTplMenuOpen] = useState(false);
    const [appTplQuery, setAppTplQuery] = useState('');
    const [appShowPromptModal, setAppShowPromptModal] = useState(false);

    const fetchScenes = async (page=0) => {
      setLoading(true); setError('');
      try {
        const p = new URLSearchParams(); p.set('page', page); p.set('size', 10); p.set('status', 0); if(sceneSearch) p.set('keyword', sceneSearch.trim());
        const resp = await fetch(`/api/prompt/admin/scenes?${p.toString()}`, { credentials:'same-origin' });
        const t = await resp.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
        const arr = Array.isArray(d) ? d : (Array.isArray(d.content) ? d.content : []);
        setScenes((arr||[]).filter(s => String(s.status)==='0'));
        const totalPages = Number.isFinite(d.totalPages) ? d.totalPages : 1;
        const number = Number.isFinite(d.number) ? d.number : page;
        setScenesTotal(Math.max(1, totalPages)); setScenesPage(Math.max(0, number));
      } catch(e){ setError(e.message || '加载失败'); setScenes([]); setScenesTotal(1); setScenesPage(0); }
      setLoading(false);
    };
    useEffect(() => { fetchScenes(0); }, []);

    useEffect(() => {
      try {
        const p = String(window.location.pathname||'');
        const m = p.match(/^\/prompt-engineering\/scene\/(\w[\w-]*)$/);
        if (m && m[1]) { const code = m[1]; const sc = (scenes||[]).find(s=> (s.sceneCode||s.scene_code)===code ); openScene(code, sc); return; }
        if (/^\/prompt-engineering\/scene\/new$/.test(p)) { openCreateScene(); return; }
      } catch(_) {}
    }, [scenes]);

    const ensureEditorLoaded = async () => {
      try {
        await loadOnce('/js/prompt-template-edit.js');
        setEditorReady(!!(window.Components && window.Components.PromptTemplateEdit));
      } catch (_) {}
    };

    const openCreate = async (opts={}) => {
      if (!requireVip()) return;
      const pushHistory = opts.pushHistory !== false;
      await ensureEditorLoaded();
      setView('create');
      if (pushHistory) {
        try { history.pushState({ page:'prompt-engineering-create' }, '', '/prompt-engineering/create'); } catch(_) {}
      }
    };

    const backToList = (opts={}) => {
      const pushHistory = opts.pushHistory !== false;
      setView('list');
      setCurrentScene(null); setTpls([]);
      if (pushHistory) {
        try { history.pushState({ page:'prompt-engineering' }, '', '/prompt-engineering'); } catch(_) {}
      }
    };

    const openScene = async (code, sceneObj, opts={}) => {
      const pushHistory = opts.pushHistory !== false;
      const sc = sceneObj || (scenes||[]).find(s => (s.sceneCode||s.scene_code)===code);
      setCurrentScene(sc || { sceneCode: code, sceneName: '-', description: '' });
      setView('scene'); setTpls([]); setTplLoading(true); setError(''); setTplPage(0); setTplTotal(1);
      if (pushHistory) {
        try { history.pushState({ page:'prompt-engineering-scene', sceneCode: code }, '', `/prompt-engineering/scene/${code}`); } catch(_) {}
      }
      await fetchTemplates(code, 0);
    };

    const fetchTemplates = async (code, page=0) => {
      setTplLoading(true);
      try {
        const p = new URLSearchParams(); p.set('page', page); p.set('size', 10); p.set('scene_code', code);
        const resp = await fetch(`/api/prompt/admin/templates?${p.toString()}`, { credentials:'same-origin' });
        const t = await resp.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
        const arr = Array.isArray(d) ? d : (Array.isArray(d.content) ? d.content : []);
        const list = (arr||[]).filter(x=> String(x.status)==='0' || x.status===0 || x.status===undefined);
        setTpls(list);
        const totalPages = Number.isFinite(d.totalPages) ? d.totalPages : 1; const number = Number.isFinite(d.number) ? d.number : page;
        setTplTotal(Math.max(1,totalPages)); setTplPage(Math.max(0,number));
      } catch(e){ setTpls([]); setTplTotal(1); setTplPage(0); setError(e.message||'加载失败'); }
      setTplLoading(false);
    };

    const openCreateScene = (opts={}) => {
      if (!requireVip()) return;
      const pushHistory = opts.pushHistory !== false;
      setView('createScene');
      if (pushHistory) {
        try { history.pushState({ page:'prompt-engineering-scene-new' }, '', '/prompt-engineering/scene/new'); } catch(_) {}
      }
    };

    useEffect(() => {
      // Keep React view in sync when users navigate via browser back/forward.
      const onPopState = () => {
        try {
          const p = String(window.location.pathname || '');
          const sceneMatch = p.match(/^\/prompt-engineering\/scene\/(\w[\w-]*)$/);
          if (sceneMatch && sceneMatch[1]) {
            const code = sceneMatch[1];
            const sc = (scenes || []).find(s => (s.sceneCode || s.scene_code) === code);
            openScene(code, sc, { pushHistory:false });
            return;
          }
          if (/^\/prompt-engineering\/scene\/new$/.test(p)) {
            openCreateScene({ pushHistory:false });
            return;
          }
          if (/^\/prompt-engineering\/create$/.test(p)) {
            ensureEditorLoaded().then(() => openCreate({ pushHistory:false }));
            return;
          }
          if (/^\/prompt-engineering\/?$/.test(p)) {
            backToList({ pushHistory:false });
            return;
          }
        } catch (_) {}
      };

      try { window.addEventListener('popstate', onPopState); } catch (_) {}
      return () => { try { window.removeEventListener('popstate', onPopState); } catch (_) {} };
    }, [scenes]);

    const parseFieldsFromContent = (text) => {
      const s = String(text||'');
      const re = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}|\{\s*([a-zA-Z0-9_.-]+)\s*\}/g;
      const names = []; let m; const seen={};
      while((m=re.exec(s))){ const key = m[1]||m[2]; const nm=String(key||'').trim(); if(nm && !seen[nm]){ seen[nm]=1; names.push(nm); } }
      return names.map(n=>({ name:n, label:n }));
    };
    const buildLabelMap = (schemaRaw) => {
      const map = {};
      try {
        const val = typeof schemaRaw === 'string' ? JSON.parse(schemaRaw||'[]') : (schemaRaw||[]);
        if (Array.isArray(val)) {
          val.forEach(it => { const nm = (it && (it.name||it.key)) || ''; if (nm) map[nm] = it.label || nm; });
        } else if (val && typeof val === 'object') {
          Object.keys(val||{}).forEach(k => { const v = val[k]; map[k] = (v && v.label) || k; });
        }
      } catch(_) {}
      return map;
    };
    const buildLabelToNameMap = (schemaRaw) => {
      const map = {};
      try {
        const val = typeof schemaRaw === 'string' ? JSON.parse(schemaRaw||'[]') : (schemaRaw||[]);
        if (Array.isArray(val)) {
          val.forEach(it => { const nm = (it && (it.name||it.key)) || ''; const lb = (it && it.label) || nm; if (nm) map[lb] = nm; });
        } else if (val && typeof val === 'object') {
          Object.keys(val||{}).forEach(k => { const v = val[k]; const lb = (v && v.label) || k; map[lb] = k; });
        }
      } catch(_) {}
      return map;
    };
    const renderPrompt = (tpl, params) => {
      const s = String(tpl||'');
      const re = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}|\{\s*([a-zA-Z0-9_.-]+)\s*\}/g;
      return s.replace(re, (_,a,b)=>{ const key = a||b; const val = params && Object.prototype.hasOwnProperty.call(params,key) ? params[key] : ''; return String(val??''); });
    };
    const renderMarkdownHTML = (text) => {
      let raw = String(text||'');
      try {
        if (window.marked && typeof window.marked.parse === 'function') {
          raw = window.marked.parse(raw);
        } else {
          const parts = raw.split(/\n\n+/).map(p=>`<p>${p.replace(/[&<>]/g, s=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[s]))}</p>`);
          raw = parts.join('');
        }
      } catch(_) {}
      try {
        if (window.DOMPurify && typeof window.DOMPurify.sanitize === 'function') {
          raw = window.DOMPurify.sanitize(raw);
        }
      } catch(_) {}
      return `<div style="line-height:1.75; color:#1f2937; font-size:14px;">${raw}</div>`;
    };
    const openPromptApp = async () => {
      setAppOpen(true); setAppLoading(true); setAppError(''); setAppTpls([]); setAppTplId(''); setAppFields([]); setAppParams({});
      try {
        const p = new URLSearchParams(); p.set('page', 0); p.set('size', 1000); p.set('status', 0);
        const r = await fetch(`/api/prompt/admin/templates?${p.toString()}`, { credentials:'same-origin' });
        const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ }
        const arr = Array.isArray(d) ? d : (Array.isArray(d.content) ? d.content : []);
        setAppTpls((arr||[]).filter(x=>String(x.status)==='0'));
      } catch(e){ setAppError(e.message||'加载模板失败'); setAppTpls([]); }
      setAppLoading(false);
    };
    const openAppLauncher = () => {
      if (!(currentUser && Number(currentUser.vipLevel)===99)) {
        try { requireLogin(); } catch(_) {}
        setAppToast('该功能仅限VIP可用');
        try { setTimeout(()=>{ setAppToast(''); }, 1800); } catch(_) {}
        return;
      }
      setAppLaunchOpen(true); setAppToast('');
    };
    const launchOption = (key) => {
      if (key==='chat') {
        if (!(currentUser && Number(currentUser.vipLevel)===99)) {
          setAppToast('该功能仅限VIP可用');
          try { setTimeout(()=>{ setAppToast(''); }, 1800); } catch(_) {}
          return;
        }
        setAppLaunchOpen(false); openPromptApp(); return;
      }
      setAppToast('该功能即将上线！');
      try { setTimeout(()=>{ setAppToast(''); }, 1800); } catch(_) { }
    };
    useEffect(()=>{
      if (!appOpen) return;
      Promise.all([
        loadOnce('https://cdn.jsdelivr.net/npm/marked/marked.min.js').catch(()=>{}),
        loadOnce('https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js').catch(()=>{})
      ]).catch(()=>{});
    }, [appOpen]);
    const onPickTpl = (id) => {
      setAppTplId(id);
      const tpl = (appTpls||[]).find(t=> String(t.id)===String(id));
      const txt = tpl ? (tpl.template_content || tpl.templateContent || '') : '';
      const labelMap = buildLabelMap(tpl ? (tpl.param_schema !== undefined ? tpl.param_schema : tpl.paramSchema) : undefined);
      const fields = parseFieldsFromContent(txt).map(f => ({ name:f.name, label: (labelMap[f.name] || f.label || f.name) }));
      const init = {}; fields.forEach(f=>{ init[f.name]=''; });
      setAppFields(fields); setAppParams(init);
      try { const lines = fields.map(f => `${f.label}：`); lines.push('你的问题：'); setAppInput(lines.join('\n')); } catch(_){}
      setAppTplMenuOpen(false); setAppTplQuery('');
      try { const name = tpl ? (tpl.templateName || tpl.template_name || '-') : '-'; setAppChat(ch => (ch && ch.length>0 && ch[0] && ch[0].kind==='template') ? ch : [{ kind:'template', text: String(name||'-') }]); } catch(_){}
    };
    const setParam = (name, val) => { setAppParams(prev=>({ ...prev, [name]: val })); };
    const parseParamsFromInput = () => {
      const tpl = (appTpls||[]).find(t=> String(t.id)===String(appTplId));
      const labelToName = buildLabelToNameMap(tpl ? (tpl.param_schema !== undefined ? tpl.param_schema : tpl.paramSchema) : undefined);
      const result = {};
      try {
        const lines = String(appInput||'').split(/\r?\n/);
        lines.forEach(line => { const m = line.match(/^(.*?)\s*[：:]\s*(.*)$/); if(!m) return; const lb = String((m[1]||'').trim()); const val = (m[2]||'').trim(); const nm = labelToName[lb]; if(nm) result[nm] = val; });
      } catch(_){}
      return result;
    };
    const extractUserQuestion = () => {
      try {
        const lines = String(appInput||'').split(/\r?\n/);
        const qLine = lines.find(l => /^\s*你的问题\s*[：:]\s*/.test(l));
        if (qLine) return qLine.replace(/^\s*你的问题\s*[：:]\s*/, '').trim();
        const tpl = (appTpls||[]).find(t=> String(t.id)===String(appTplId));
        const labelMap = buildLabelMap(tpl ? (tpl.param_schema !== undefined ? tpl.param_schema : tpl.paramSchema) : undefined);
        const labels = Object.values(labelMap||{});
        const others = lines.filter(l => { const m = l.match(/^(.*?)\s*[：:]\s*(.*)$/); if(!m) return true; const lb = String((m[1]||'').trim()); return !labels.includes(lb); });
        return others.join(' ').trim();
      } catch(_) { return ''; }
    };
    const getLastAssistantReply = () => {
      try {
        const list = appChat || [];
        for (let i = list.length - 1; i >= 0; i--) {
          const m = list[i];
          if (m && m.role === 'assistant' && !m.thinking) return String(m.text || '');
        }
      } catch(_){}
      return '';
    };
    const confirmAndSend = async () => {
      const tpl = (appTpls||[]).find(t=> String(t.id)===String(appTplId));
      const question = extractUserQuestion();
      if (!question) { setAppError('请输入问题'); return; }
      let finalText = question;
      let intro = null;
      if (tpl) {
        const txt = tpl ? (tpl.template_content || tpl.templateContent || '') : '';
        const params = parseParamsFromInput();
        finalText = renderPrompt(txt, params);
        intro = String(tpl.templateName || tpl.template_name || '-');
      }
      try {
        setAppLoading(true); setAppError(''); setAppThinking(true);
        setAppChat(ch => {
          const base = (intro && (ch && ch.length>0 && ch[0] && ch[0].kind==='template')) ? ch : (intro ? [{ kind:'template', text: intro }] : []);
          return [...base, { role:'user', text: question }, { role:'assistant', text: '🌀 正在思考中…', thinking:true }];
        });
        const last = getLastAssistantReply();
        const combinedPrompt = last ? last : (tpl ? finalText : null);
        const payload = { message: question, prompt: combinedPrompt };
        const r = await fetch('/api/open/deeoSeekChat/model', { method:'POST', headers:{ 'Content-Type': 'application/json' }, credentials:'same-origin', body: JSON.stringify(payload) });
        const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ }
        if(!r.ok) throw new Error(d.message || '调用失败');
        const reply = d.message || d.data || t || '';
        setAppChat(ch => ch.map(m => (m && m.thinking) ? { role:'assistant', text: reply } : m));
      } catch(e){ setAppError(e.message||'调用失败'); setAppChat(ch => ch.map(m => (m && m.thinking) ? { role:'assistant', text: '调用失败' } : m)); }
      setAppLoading(false); setAppThinking(false);
    };

    if (view === 'create') {
      return React.createElement('section', { className:'py-10 md:py-12 px-4 md:px-8 max-w-[1600px] mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm' },
        React.createElement('div', { className:'flex items-start justify-between gap-4 mb-6' },
          React.createElement('div', { className:'space-y-1' },
            React.createElement('button', { className:'inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200', onClick: () => backToList() },
              React.createElement(IconArrowLeft, { className:'w-5 h-5' }),
              '返回 Prompt 工程'
            ),
            React.createElement('h2', { className:'text-3xl font-extrabold text-slate-900' }, '我要开发'),
            React.createElement('div', { className:'text-sm text-slate-500' }, '新增提示词模板')
          )
        ),
        (window.Components && window.Components.PromptTemplateEdit && editorReady)
          ? React.createElement(window.Components.PromptTemplateEdit, { initialData: null, onClose: backToList, onSaved: backToList })
          : React.createElement('div', { className:'p-6 text-slate-600' }, '编辑器组件加载中...')
      );
    }

    if (view === 'scene') {
      // 暴露分页操作到全局，供子视图按钮调用
      try { window.__prompt_tpl_page = tplPage; window.__prompt_tpl_total = tplTotal; window.__prompt_fetch_tpl_prev = ()=>fetchTemplates((currentScene||{}).sceneCode||(currentScene||{}).scene_code, Math.max(0, (tplPage||0)-1)); window.__prompt_fetch_tpl_next = ()=>fetchTemplates((currentScene||{}).sceneCode||(currentScene||{}).scene_code, (tplPage||0)+1); } catch(_) {}
      return React.createElement(SceneTemplatesView, { scene: currentScene||{}, tpls, loading: tplLoading, onBack: backToList });
    }
    if (view === 'createScene') {
      return React.createElement(SceneCreatePage, { onBack: backToList, onSaved: ()=>{ try{ /* reload scenes */ }catch(_){ } } });
    }

    return React.createElement('section', { className:'py-12 px-6 max-w-[1400px] mx-auto bg-white rounded-2xl' },
      React.createElement('div', { className:'flex items-center justify-between mb-6' },
        React.createElement('h2', { className:'text-2xl font-extrabold text-slate-900' }, 'Prompt 工程'),
        React.createElement('div', { className:'flex items-center gap-2' },
          React.createElement('input', { className:'hidden md:block border border-slate-300 rounded-lg px-3 py-2 w-64', placeholder:'按场景名称搜索', value:sceneSearch, onChange:e=>setSceneSearch(e.target.value), onKeyDown:e=>{ if(e.key==='Enter') fetchScenes(0); } }),
          React.createElement('button', { className:'hidden md:inline-block px-3 py-2 rounded-md bg-slate-100 text-slate-700', onClick:()=>fetchScenes(0) }, '搜索'),
          React.createElement('button', { className:'inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700', onClick: ()=>openCreateScene() }, '+ 新增场景'),
          React.createElement('button', { className:'inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700', onClick: openAppLauncher }, '提示词应用'),
          React.createElement('button', { className:'inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick: openCreate }, React.createElement(IconPlus,{className:'w-5 h-5'}), '我要开发')
        )
      ),
      error && React.createElement('div', { className:'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md mb-4' }, error),
      loading ? React.createElement('div', { className:'grid md:grid-cols-3 lg:grid-cols-4 gap-6' }, [1,2,3,4,5,6,7,8].map(i=>React.createElement('div',{key:i,className:'h-32 bg-slate-100 rounded-xl animate-pulse'})))
      : React.createElement(React.Fragment,null,
          React.createElement('div', { className:'grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' }, (scenes||[]).map(sc => React.createElement(SceneCard, { key: sc.id || sc.sceneCode || sc.scene_code, scene: sc, onClick: ()=>openScene(sc.sceneCode||sc.scene_code, sc) }))),
          React.createElement('div', { className:'flex items-center justify-end gap-2 mt-6' },
            React.createElement('button', { className:'px-3 py-1 rounded-md bg-slate-100 text-slate-700 disabled:opacity-50', disabled: scenesPage<=0, onClick:()=>fetchScenes(Math.max(0, scenesPage-1)) }, '上一页'),
          React.createElement('span', { className:'text-xs text-slate-500' }, `第 ${scenesPage+1} / ${scenesTotal} 页`),
          React.createElement('button', { className:'px-3 py-1 rounded-md bg-slate-100 text-slate-700 disabled:opacity-50', disabled: (scenesPage+1)>=scenesTotal, onClick:()=>fetchScenes(scenesPage+1) }, '下一页')
          )
        ),
        appToast ? React.createElement(Portal, null,
          React.createElement('div', { className:'fixed inset-0 z-[970] pointer-events-none' },
            React.createElement('div', { className:'absolute top-6 right-6 px-3 py-2 rounded-lg bg-black/70 text-white text-sm shadow pointer-events-auto' }, appToast)
          )
        ) : null,
        appOpen ? React.createElement(Portal, null,
          React.createElement('div', { className:'fixed inset-0 z-[950] bg黑 bg-black/50 flex items-center justify-center p-4', onClick:()=>setAppOpen(false) },
            React.createElement('div', { className:'bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden', onClick:(e)=>e.stopPropagation() },
              React.createElement('div', { className:'flex items-center justify-between p-4 border-b' },
                React.createElement('div', { className:'text-lg font-semibold text-slate-900' }, '提示词应用'),
                React.createElement('button', { className:'px-3 py-1 rounded-md bg-slate-100 text-slate-700', onClick:()=>setAppOpen(false) }, '关闭')
              ),
              appError ? React.createElement('div',{className:'p-3 text-sm text-red-600'}, appError) : null,
              React.createElement('div', { className:'p-4 space-y-4' },
                React.createElement('div', { className:'space-y-2' },
                  React.createElement('div', { className:'text-sm text-slate-700' }, '聊天记录'),
                  React.createElement('div', { className:'border border-slate-200 rounded-xl p-3 h-[38vh] overflow-auto bg-white' },
                    (appChat||[]).length===0 ? React.createElement('div',{className:'text-xs text-slate-500'},'尚未开始对话，输入 # 选择模板') : (appChat||[]).map((m,idx)=>{
                      if (m && m.kind==='template') {
                        return React.createElement('div',{key:idx,className:'mb-2'}, React.createElement('div',{className:'inline-flex items-center gap-2 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium'}, '#', m.text));
                      }
                      const isUser = m && m.role==='user';
                      const containerClass = isUser ? 'flex items-start gap-3 justify-end mb-2' : 'flex items-start gap-3 mb-2';
                      const avatar = React.createElement('div',{className:(isUser?'order-2 ':'')+'w-8 h-8 rounded-full flex items-center justify-center '+(isUser?'bg-blue-600 text-white':'bg-emerald-600 text-white')}, React.createElement(isUser?IconUser:IconBot,{className:'w-5 h-5'}));
                      const bubbleClass = (isUser ? 'order-1 ' : '') + (isUser ? 'max-w-[70%] px-3 py-2 rounded-2xl bg-blue-50 border border-blue-200 text-slate-900 font-sans' : 'max-w-[70%] px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-900 font-serif');
                      const bubble = isUser
                        ? React.createElement('div',{className:bubbleClass}, m.text)
                        : React.createElement('div',{className:bubbleClass, dangerouslySetInnerHTML:{ __html: renderMarkdownHTML(m.text) }});
                      return React.createElement('div',{key:idx,className:containerClass}, avatar, bubble);
                    })
                  )
                ),
                React.createElement('div', { className:'space-y-2 relative' },
                  React.createElement('div', { className:'text-sm text-slate-700' }, '对话输入'),
                  React.createElement('textarea', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', rows:6, style:{ maxHeight:'32vh' }, placeholder:'输入 # 选择模板；选择后按指引填写参数与问题…', value:appInput, onChange:e=>{ const v=e.target.value; setAppInput(v); const m=v.match(/#([\u4e00-\u9fa5\w-]*)$/); if(m){ setAppTplMenuOpen(true); setAppTplQuery(m[1]||''); } else { const hasHash = /#/.test(v); setAppTplMenuOpen(!!hasHash); setAppTplQuery(''); } } }),
                  appTplMenuOpen ? React.createElement('div',{className:'absolute bottom-2 left-2 right-2 bg-white border border-slate-200 rounded-lg shadow max-h-48 overflow-auto'},
                    (appTpls||[]).filter(t=>{ const nm = t.templateName || t.template_name || ''; if(!appTplQuery) return true; return String(nm).toLowerCase().includes(String(appTplQuery).toLowerCase()); }).map(t=>
                      React.createElement('button',{key:t.id,className:'block w-full text-left px-3 py-2 hover:bg-slate-100', onClick:()=>onPickTpl(t.id)}, (t.templateName || t.template_name || '-'))
                    )
                  ) : null,
                  React.createElement('div',{className:'flex items-center justify-end gap-2'},
                    React.createElement('button',{className:'px-3 py-2 text-gray-600 hover:text-gray-800', onClick:()=>{ setAppChat([]); setAppInput(''); setAppError(''); }}, '清空聊天记录'),
                    React.createElement('button',{className:'px-3 py-2 rounded-md bg-gray-100 text-gray-700', onClick:()=>{ const tpl=(appTpls||[]).find(t=>String(t.id)===String(appTplId)); if(!tpl){ setAppError('请先选择模板'); return; } const txt=tpl.template_content||tpl.templateContent||''; const params=parseParamsFromInput(); const finalText=renderPrompt(txt, params); setAppShowPromptModal(true); }}, '查看完整提示词'),
                    React.createElement('button',{className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50', disabled:appLoading||!extractUserQuestion(), onClick:confirmAndSend}, appLoading ? '发送中…' : '确认并发送')
                  )
                )
              )
            )
          )
        ) : null,
        appLaunchOpen ? React.createElement(Portal, null,
          React.createElement('div', { className:'fixed inset-0 z-[940] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6', onClick:()=>setAppLaunchOpen(false) },
            React.createElement('div', { className:'relative w-full max-w-4xl rounded-3xl overflow-hidden', onClick:(e)=>e.stopPropagation() },
              React.createElement('div', { className:'absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 opacity-80' }),
              React.createElement('div', { className:'relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30' },
                React.createElement('div', { className:'px-6 py-5 border-b border-white/20 flex items-center justify-between' },
                  React.createElement('div', { className:'text-xl font-bold text-white drop-shadow' }, '选择应用场景'),
                  React.createElement('button', { className:'px-3 py-1 rounded-md bg-white/40 text-white hover:bg-white/50', onClick:()=>setAppLaunchOpen(false) }, '关闭')
                ),
                React.createElement('div', { className:'p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4' },
                  React.createElement('button', { className:'group rounded-2xl p-5 bg-white/90 hover:bg-white shadow-lg hover:shadow-2xl transition transform hover:-translate-y-0.5 text-left', onClick:()=>launchOption('agent') },
                    React.createElement('div', { className:'inline-flex items-center gap-3 mb-2' }, React.createElement(IconRobot,{className:'w-6 h-6 text-indigo-600'}), React.createElement('span',{className:'text-lg font-semibold text-slate-900'}, '应用到 Agent')),
                    React.createElement('div', { className:'text-sm text-slate-600' }, '将提示词能力注入 Agent，构建智能体')
                  ),
                  React.createElement('button', { className:'group rounded-2xl p-5 bg-white/90 hover:bg-white shadow-lg hover:shadow-2xl transition transform hover:-translate-y-0.5 text左 text-left', onClick:()=>launchOption('workflow') },
                    React.createElement('div', { className:'inline-flex items-center gap-3 mb-2' }, React.createElement(IconSettings,{className:'w-6 h-6 text-purple-600'}), React.createElement('span',{className:'text-lg font-semibold text-slate-900'}, '应用到工作流')),
                    React.createElement('div', { className:'text-sm text-slate-600' }, '将提示词编排进自动化流程')
                  ),
                  React.createElement('button', { className:'group rounded-2xl p-5 bg-white/90 hover:bg白 hover:bg-white shadow-lg hover:shadow-2xl transition transform hover:-translate-y-0.5 text-left', onClick:()=>launchOption('api') },
                    React.createElement('div', { className:'inline-flex items-center gap-3 mb-2' }, React.createElement(IconGlobe,{className:'w-6 h-6 text-emerald-600'}), React.createElement('span',{className:'text-lg font-semibold text-slate-900'}, '应用到 API')),
                    React.createElement('div', { className:'text-sm text-slate-600' }, '封装为 API 接口供系统调用')
                  ),
                  React.createElement('button', { className:'group rounded-2xl p-5 bg-white ring-2 ring-blue-200 shadow-2xl hover:shadow-3xl transition transform hover:-translate-y-0.5 text-left', onClick:()=>launchOption('chat') },
                    React.createElement('div', { className:'inline-flex items-center gap-3 mb-2' }, React.createElement(IconMessageSquare,{className:'w-6 h-6 text-blue-600'}), React.createElement('span',{className:'text-lg font-semibold text-slate-900'}, '应用到聊天对话')),
                    React.createElement('div', { className:'text-sm text-slate-600' }, '打开对话面板，与模型自然交流')
                  )
                ),
                appToast ? React.createElement('div', { className:'absolute top-4 right-6 px-3 py-2 rounded-lg bg-black/70 text-white text-sm shadow' }, appToast) : null
              )
            )
          )
        ) : null,
        (appShowPromptModal ? React.createElement(Portal,null,
          React.createElement('div',{className:'fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4', onClick:()=>setAppShowPromptModal(false)},
            React.createElement('div',{className:'bg-white rounded-2xl shadow-2xl w-[88vw] max-w-[1000px] min-w-[680px] max-h-[68vh] overflow-hidden flex flex-col', onClick:(e)=>e.stopPropagation()},
              React.createElement('div',{className:'flex items-center justify-between p-4 border-b'},
                React.createElement('div',{className:'text-lg font-semibold text-slate-900'}, '完整提示词'),
                React.createElement('button',{className:'px-3 py-1 rounded-md bg-slate-100 text-slate-700', onClick:()=>setAppShowPromptModal(false)}, '关闭')
              ),
              (function(){ const tpl=(appTpls||[]).find(t=>String(t.id)===String(appTplId)); const txt=tpl?(tpl.template_content||tpl.templateContent||''):''; const params=parseParamsFromInput(); const finalText=renderPrompt(txt, params); return React.createElement('pre',{className:'p-4 text-base bg-slate-50 border border-slate-200 rounded-xl whitespace-pre-wrap break-words overflow-auto'}, finalText); })()
            )
          )
        ) : null)
      );
  };

  const SceneTemplatesView = ({ scene, tpls, loading, onBack }) => (
    React.createElement('section', { className:'py-12 px-6 max-w-[1200px] mx-auto bg-white rounded-2xl' },
      React.createElement('div', { className:'flex items-center justify-between mb-6' },
        React.createElement('div', null,
          React.createElement('h2', { className:'text-2xl font-extrabold text-slate-900' }, '场景：', (scene.sceneName||scene.scene_name||'-')),
          React.createElement('div', { className:'text-xs text-slate-500 mt-1' }, '编码：', (scene.sceneCode||scene.scene_code||'-'))
        ),
        React.createElement('button', { className:'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick: onBack }, '返回')
      ),
      loading ? React.createElement('div', { className:'grid md:grid-cols-2 lg:grid-cols-3 gap-6' }, [1,2,3,4,5,6].map(i=>React.createElement('div',{key:i,className:'h-48 bg-slate-100 rounded-2xl animate-pulse'})))
      : (tpls && tpls.length>0 ? React.createElement(React.Fragment,null,
            React.createElement('div', { className:'grid md:grid-cols-2 lg:grid-cols-3 gap-6' }, tpls.map(t=>React.createElement(TemplateCard,{ key:t.id||t.code, tpl:t }))),
            React.createElement('div', { className:'flex items-center justify-end gap-2 mt-6' },
              React.createElement('button', { className:'px-3 py-1 rounded-md bg-slate-100 text-slate-700 disabled:opacity-50', onClick:()=>window.__prompt_fetch_tpl_prev && window.__prompt_fetch_tpl_prev(), disabled: (window.__prompt_tpl_page||0)<=0 }, '上一页'),
              React.createElement('span', { className:'text-xs text-slate-500' }, `第 ${((window.__prompt_tpl_page||0)+1)} / ${(window.__prompt_tpl_total||1)} 页`),
              React.createElement('button', { className:'px-3 py-1 rounded-md bg-slate-100 text-slate-700 disabled:opacity-50', onClick:()=>window.__prompt_fetch_tpl_next && window.__prompt_fetch_tpl_next(), disabled: (((window.__prompt_tpl_page||0)+1) >= (window.__prompt_tpl_total||1)) }, '下一页')
            )
          ) : React.createElement('div',{className:'text-slate-600 text-sm'}, '暂无模板'))
    )
  );

  const SceneCreatePage = ({ onBack, onSaved }) => {
    const { useState } = React; const [form, setForm] = useState({ scene_name:'', description:'', status:0 }); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState('');
    const save = async () => {
      const name = String(form.scene_name||'').trim(); if(!name){ setMsg('请输入场景名称'); return; }
      setSaving(true); setMsg('');
      try {
        const payload = { sceneName: name, description: form.description||'', status: Number(form.status||0) };
        const resp = await fetch('/api/prompt/admin/scenes', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify(payload) });
        const t = await resp.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
        if (!resp.ok || d.success===false) throw new Error(d.message||'保存失败');
        onSaved && onSaved(); onBack && onBack();
      } catch(e){ setMsg(e.message||'保存失败'); }
      setSaving(false);
    };
    return React.createElement('section', { className:'py-12 px-6 max-w-[900px] mx-auto bg白 rounded-2xl' },
      React.createElement('div', { className:'flex items-center justify-between mb-6' },
        React.createElement('h2', { className:'text-2xl font-extrabold text-slate-900' }, '新增场景'),
        React.createElement('button', { className:'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick:onBack }, '返回')
      ),
      msg && React.createElement('div',{className:'mb-4 text-sm text-red-600'}, msg),
      React.createElement('div', { className:'space-y-4 bg白 rounded-xl border p-6 shadow' },
        React.createElement('div', null,
          React.createElement('label',{className:'block text-sm text-slate-700 mb-1'}, '场景名称'),
          React.createElement('input',{className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:form.scene_name, onChange:e=>setForm({...form, scene_name:e.target.value}), placeholder:'请输入场景名称'})
        ),
        React.createElement('div', null,
          React.createElement('label',{className:'block text-sm text-slate-700 mb-1'}, '场景描述'),
          React.createElement('textarea',{className:'border border-slate-300 rounded-lg px-3 py-2 w-full', rows:4, value:form.description, onChange:e=>setForm({...form, description:e.target.value}), placeholder:'请输入场景描述（可选）'})
        ),
        React.createElement('div', null,
          React.createElement('label',{className:'block text-sm text-slate-700 mb-1'}, '启用状态'),
          React.createElement('div',{className:'flex items-center gap-4'},
            React.createElement('label',{className:'inline-flex items-center gap-2'}, React.createElement('input',{type:'radio', name:'scene-status', checked:Number(form.status)===0, onChange:()=>setForm({...form, status:0})}), React.createElement('span', null, '启用')),
            React.createElement('label',{className:'inline-flex items-center gap-2'}, React.createElement('input',{type:'radio', name:'scene-status', checked:Number(form.status)===1, onChange:()=>setForm({...form, status:1})}), React.createElement('span', null, '禁用'))
          )
        ),
        React.createElement('div',{className:'flex items-center justify-end gap-2'},
          React.createElement('button',{className:'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick:onBack}, '取消'),
          React.createElement('button',{className:'px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50', disabled:saving, onClick:save}, saving?'保存中…':'保存')
        )
      )
    );
  };

  window.Components = window.Components || {};
  window.Components.PromptEngineeringPage = PromptEngineeringPage;
  try { window.dispatchEvent(new Event('modules:loaded')); } catch(_) {}
})();
