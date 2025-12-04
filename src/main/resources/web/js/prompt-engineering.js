(() => {
  const { useState, useEffect } = React;

  const loadOnce = (src) => new Promise((resolve, reject) => {
    if ([...document.scripts].some(s => (s.src||'').endsWith(src))) { resolve(); return; }
    const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag);
  });

  const IconPlus = (window.LucideReact && window.LucideReact.Plus) || ((props)=>React.createElement('span',{className:props.className}));

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
    const { useState } = React; const [open, setOpen] = useState(false);
    const copy = () => { try { const c = tpl.templateContent || tpl.template_content || ''; navigator.clipboard && navigator.clipboard.writeText(c); } catch(_){} };
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
          React.createElement('button', { className:'px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200', onClick:()=>setOpen(o=>!o) }, open?'收起':'展开'),
          React.createElement('button', { className:'px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200', onClick:copy }, '复制')
        )
      ),
      open ? React.createElement('pre', { className:'bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm whitespace-pre-wrap break-words text-slate-900' }, tpl.templateContent || tpl.template_content || '') : null,
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
    const [editorReady, setEditorReady] = useState(!!(window.Components && window.Components.PromptTemplateEdit));
    const [currentScene, setCurrentScene] = useState(null);
    const [tpls, setTpls] = useState([]);
    const [tplLoading, setTplLoading] = useState(false);

    useEffect(() => {
      const fetchScenes = async () => {
        setLoading(true); setError('');
        try {
          const p = new URLSearchParams(); p.set('page', 0); p.set('size', 1000); p.set('status', 0);
          const resp = await fetch(`/api/prompt/admin/scenes?${p.toString()}`, { credentials:'same-origin' });
          const t = await resp.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
          const arr = Array.isArray(d) ? d : (Array.isArray(d.content) ? d.content : []);
          setScenes((arr||[]).filter(s => String(s.status)==='0'));
        } catch(e){ setError(e.message || '加载失败'); }
        setLoading(false);
      };
      fetchScenes();
    }, []);

    useEffect(() => {
      try {
        const p = String(window.location.pathname||'');
        const m = p.match(/^\/prompt-engineering\/scene\/(\w[\w-]*)$/);
        if (m && m[1]) { const code = m[1]; const sc = (scenes||[]).find(s=> (s.sceneCode||s.scene_code)===code ); openScene(code, sc); return; }
        if (/^\/prompt-engineering\/scene\/new$/.test(p)) { openCreateScene(); return; }
      } catch(_) {}
    }, [scenes]);

    const openCreate = async () => {
      if (!requireVip()) return;
      try {
        await loadOnce('/js/prompt-template-edit.js');
        setEditorReady(!!(window.Components && window.Components.PromptTemplateEdit));
      } catch(_) {}
      setView('create');
      try { history.pushState({ page:'prompt-engineering-create' }, '', '/prompt-engineering/create'); } catch(_) {}
    };

    const backToList = () => {
      setView('list');
      setCurrentScene(null); setTpls([]);
      try { history.pushState({ page:'prompt-engineering' }, '', '/prompt-engineering'); } catch(_) {}
    };

    const openScene = async (code, sceneObj) => {
      const sc = sceneObj || (scenes||[]).find(s => (s.sceneCode||s.scene_code)===code);
      setCurrentScene(sc || { sceneCode: code, sceneName: '-', description: '' });
      setView('scene'); setTpls([]); setTplLoading(true); setError('');
      try { history.pushState({ page:'prompt-engineering-scene', sceneCode: code }, '', `/prompt-engineering/scene/${code}`); } catch(_) {}
      try {
        const p = new URLSearchParams(); p.set('page', 0); p.set('size', 1000); p.set('scene_code', code);
        const resp = await fetch(`/api/prompt/admin/templates?${p.toString()}`, { credentials:'same-origin' });
        const t = await resp.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
        const arr = Array.isArray(d) ? d : (Array.isArray(d.content) ? d.content : []);
        const list = (arr||[]).filter(x=> String(x.status)==='0' || x.status===0 || x.status===undefined);
        setTpls(list);
      } catch(e){ setError(e.message||'加载失败'); }
      setTplLoading(false);
    };

    const openCreateScene = () => {
      if (!requireVip()) return;
      setView('createScene');
      try { history.pushState({ page:'prompt-engineering-scene-new' }, '', '/prompt-engineering/scene/new'); } catch(_) {}
    };

    if (view === 'create') {
      return React.createElement('section', { className:'py-12 px-6 max-w-[1200px] mx-auto bg-white rounded-2xl' },
        React.createElement('div', { className:'flex items-center justify-between mb-6' },
          React.createElement('h2', { className:'text-2xl font-extrabold text-slate-900' }, '新增提示词模板'),
          React.createElement('button', { className:'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick: backToList }, '返回')
        ),
        (window.Components && window.Components.PromptTemplateEdit && editorReady)
          ? React.createElement(window.Components.PromptTemplateEdit, { initialData: null, onClose: backToList, onSaved: backToList })
          : React.createElement('div', { className:'p-6 text-slate-600' }, '编辑器组件加载中...')
      );
    }

    if (view === 'scene') {
      return React.createElement(SceneTemplatesView, { scene: currentScene||{}, tpls, loading: tplLoading, onBack: backToList });
    }
    if (view === 'createScene') {
      return React.createElement(SceneCreatePage, { onBack: backToList, onSaved: ()=>{ try{ /* reload scenes */ }catch(_){ } } });
    }

    return React.createElement('section', { className:'py-12 px-6 max-w-[1400px] mx-auto bg-white rounded-2xl' },
      React.createElement('div', { className:'flex items-center justify-between mb-6' },
        React.createElement('h2', { className:'text-2xl font-extrabold text-slate-900' }, 'Prompt 工程'),
        React.createElement('div', { className:'flex items-center gap-2' },
          React.createElement('button', { className:'inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700', onClick: ()=>openCreateScene() }, '+ 新增场景'),
          React.createElement('button', { className:'inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick: openCreate }, React.createElement(IconPlus,{className:'w-5 h-5'}), '我要开发')
        )
      ),
      error && React.createElement('div', { className:'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md mb-4' }, error),
      loading ? React.createElement('div', { className:'grid md:grid-cols-3 lg:grid-cols-4 gap-6' }, [1,2,3,4,5,6,7,8].map(i=>React.createElement('div',{key:i,className:'h-32 bg-slate-100 rounded-xl animate-pulse'})))
      : React.createElement('div', { className:'grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' }, (scenes||[]).map(sc => React.createElement(SceneCard, { key: sc.id || sc.sceneCode || sc.scene_code, scene: sc, onClick: ()=>openScene(sc.sceneCode||sc.scene_code, sc) })))
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
      : (tpls && tpls.length>0 ? React.createElement('div', { className:'grid md:grid-cols-2 lg:grid-cols-3 gap-6' }, tpls.map(t=>React.createElement(TemplateCard,{ key:t.id||t.code, tpl:t }))) : React.createElement('div',{className:'text-slate-600 text-sm'}, '暂无模板'))
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

