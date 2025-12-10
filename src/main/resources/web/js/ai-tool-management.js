const UserToolsExplorer = ({ currentUser }) => {
  const { useEffect, useState } = React;
  const isVipUser = !!(currentUser && Number(currentUser.vipLevel) === 99);
  const [categories, setCategories] = useState([]);
  const [catMap, setCatMap] = useState({});
  const [activeType, setActiveType] = useState(null);
  const [search, setSearch] = useState('');
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [toolReady, setToolReady] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  const loadScriptOnce = (src) => new Promise((resolve, reject) => {
    if ([...document.scripts].some(s => (s.src||'').endsWith(src))) { resolve(); return; }
    const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag);
  });
  const loadToolScript = async (path) => {
    const p = path.endsWith('.js') ? path : `${path}.js`;
    const url = `/tools/${p}`;
    try { await loadScriptOnce(url); return true; } catch(_){}
    return false;
  };

  const ensureTool10Ready = async () => {
    try {
      if (window.ToolsPages && window.ToolsPages['10']) { setToolReady(true); return; }
      await loadToolScript('10-aiSql-tools-management.js');
      let tries = 0;
      const tick = () => {
        const ok = !!(window.ToolsPages && window.ToolsPages['10']);
        if (ok) { setToolReady(true); try { window.dispatchEvent(new Event('modules:loaded')); } catch(_){} return; }
        tries++;
        if (tries < 20) { setTimeout(tick, 200); } else { setToolReady(false); }
      };
      tick();
    } catch(_) { setToolReady(false); }
  };

  const ensureTool16Ready = async () => {
    try {
      if (window.ToolsPages && window.ToolsPages['16']) { setToolReady(true); return; }
      await loadToolScript('16-aiExam-tools-management.js');
      let tries = 0;
      const tick = () => {
        const ok = !!(window.ToolsPages && window.ToolsPages['16']);
        if (ok) { setToolReady(true); try { window.dispatchEvent(new Event('modules:loaded')); } catch(_){} return; }
        tries++;
        if (tries < 20) { setTimeout(tick, 200); } else { setToolReady(false); }
      };
      tick();
    } catch(_) { setToolReady(false); }
  };

  const InlineSqlDba = () => {
    const { useState, useMemo } = React;
    const parseTables = (raw) => {
      try { const t = (raw||'').trim(); if (!t) return []; try { const j = JSON.parse(t); if (Array.isArray(j)) { return j.map(x=>x.name||x.table||x).filter(Boolean); } } catch(_) {} const names = new Set(); const re = /(CREATE\s+TABLE\s+`?(\w+)`?|\n\s*table\s*:\s*(\w+)|\b(t_[a-zA-Z0-9_]+)\b)/ig; let m; while ((m = re.exec(t))){ const n = m[2]||m[3]||m[4]; if(n) names.add(n); } return [...names]; } catch(_){ return []; } };
    const [raw, setRaw] = useState('');
    const tables = useMemo(()=>parseTables(raw), [raw]);
    const [selected, setSelected] = useState([]);
    const [need, setNeed] = useState('');
    const [sql, setSql] = useState('');
    const [loading, setLoading] = useState(false);
    const handleFile = async (e) => {
      try { const files = Array.from(e.target.files||[]); if (!files.length) return; const readers = await Promise.all(files.map(f=>new Promise((resolve)=>{ const r=new FileReader(); r.onload=()=>resolve(String(r.result||'')); r.readAsText(f); }))); const merged = readers.join('\n\n'); setRaw(prev => (prev ? (prev+'\n\n'+merged) : merged)); } catch(_) {}
    };
    const toggle = (name) => setSelected(prev => prev.includes(name) ? prev.filter(x=>x!==name) : [...prev, name]);
    const copySql = async () => { try { if(!sql) return; await navigator.clipboard.writeText(sql); } catch(_){} };
    const gen = async () => { const prompt = (need||'').trim(); if (selected.length===0) { alert('请至少选择一张表'); return; } if(!prompt){ alert('请输入SQL需求'); return; } setLoading(true); setSql(''); try { const body = { user_prompt: prompt, selected_tables: selected, table_structures: raw ? [raw] : [] }; const r = await fetch('/api/open/sql/dba', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) }); const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; } setSql(d.sql||d.response||d.message||''); } catch(_) { setSql(''); alert('生成失败'); } setLoading(false); };
    return (
      React.createElement('div',{className:'space-y-4'},
        React.createElement('div',{className:'space-y-2'},
          React.createElement('div',{className:'flex items-center gap-2'},
            React.createElement('input',{type:'file', accept:'.txt,.sql,.json', multiple:true, onChange:handleFile}),
            React.createElement('button',{className:'px-3 py-1 rounded bg-slate-100 text-slate-700', onClick:()=>setRaw('')}, '清空')
          ),
          React.createElement('textarea',{className:'w-full border border-slate-300 rounded-lg px-3 py-2', rows:6, placeholder:'支持粘贴 DDL 或 JSON 表结构', value:raw, onChange:(e)=>setRaw(e.target.value)}),
          React.createElement('div',{className:'text-xs text-slate-500'}, `已解析 ${tables.length} 张表`)
        ),
        React.createElement('div',{className:'grid grid-cols-2 gap-2'}, tables.map(n=>React.createElement('label',{key:n,className:'border rounded-xl p-2 flex items-center gap-2'}, React.createElement('input',{type:'checkbox', checked:selected.includes(n), onChange:()=>toggle(n)}), React.createElement('span',{className:'text-sm text-slate-900'}, n)) )),
        React.createElement('div',{className:'space-y-2'},
          React.createElement('label',{className:'text-sm text-slate-700'}, '请输入你的 SQL 需求'),
          React.createElement('textarea',{className:'w-full border border-slate-300 rounded-lg px-3 py-2', rows:4, placeholder:'例如：查询所有用户姓名和年龄', value:need, onChange:(e)=>setNeed(e.target.value)})
        ),
        React.createElement('div',{className:'flex items-center gap-3'},
          React.createElement('button',{className:'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50', disabled:loading || selected.length===0, onClick:gen}, loading?'生成中…':'生成 SQL'),
          React.createElement('span',{className:'text-xs text-slate-500'}, selected.length>0?`已选择：${selected.join(', ')}`:'请选择至少一张表')
        ),
        React.createElement('div',null,
          React.createElement('div',{className:'flex items-center justify-between'},
            React.createElement('label',{className:'text-sm text-slate-700'}, '生成结果'),
            React.createElement('button',{className:'px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200', onClick:copySql, disabled:!sql}, '复制')
          ),
          React.createElement('pre',{className:'bg-white border border-slate-200 rounded-lg p-3 text-sm whitespace-pre-wrap break-words min-h-[6rem] text-slate-900 font-mono'}, sql||'')
        )
      )
    );
  };

  const load = async (type) => {
    setLoading(true);
    try {
      const url = (type && type!==null) ? `/api/tools/active?type=${type}&page=${page}&size=${size}` : `/api/tools/active?page=${page}&size=${size}`;
      const r = await fetch(url, { credentials: 'same-origin' });
      const t = await r.text(); let d = []; try { d = JSON.parse(t || '[]'); } catch(_) { d = []; }
      let list = Array.isArray(d.content) ? d.content : (Array.isArray(d) ? d : []);
      if (type == null) { list = list.filter(x => Number(x.type) !== 10000); }
      setTools(list);
      const tp = Number.isFinite(d.totalPages) ? d.totalPages : Math.max(1, Math.ceil(list.length / size));
      const num = Number.isFinite(d.number) ? d.number : page;
      setTotalPages(tp);
      setPage(num);
    } catch(_) { setTools([]); }
    setLoading(false);
  };
  useEffect(()=>{ load(activeType); }, [activeType, page, size]);
  useEffect(()=>{
    (async()=>{
      try {
        let list = [];
        // 首选树接口
        try {
          const r = await fetch('/api/categories/tree?type=2', { credentials:'same-origin' });
          const t = await r.text(); let d=[]; try{ d=JSON.parse(t||'[]'); }catch(_){ d=[]; }
          const flat = [];
          const walk = (nodes, prefix='') => { (nodes||[]).forEach(n => { flat.push({ id:n.id, name: prefix ? `${prefix} > ${n.name}` : n.name }); if (Array.isArray(n.children) && n.children.length) walk(n.children, prefix ? `${prefix} > ${n.name}` : n.name); }); };
          walk(d);
          if (flat.length) { list = flat; const m={}; flat.forEach(c=>{ if(c && c.id!=null) m[c.id]=c.name; }); setCatMap(m); }
        } catch(_){}
        // 兼容分页接口
        if (!list.length) {
          try {
            const r2 = await fetch('/api/categories?type=2&page=0&size=1000', { credentials:'same-origin' });
            const t2 = await r2.text(); let d2={}; try{ d2=JSON.parse(t2||'{}'); }catch(_){ d2={}; }
            const arr = Array.isArray(d2.content) ? d2.content : (Array.isArray(d2) ? d2 : []);
            list = arr.map(c => ({ id:c.id, name:c.name })).filter(x=>x && x.name);
            const m = {}; arr.forEach(c=>{ if(c && c.id!=null) m[c.id] = c.name; });
            setCatMap(m);
          } catch(_){}
        }
        if (!list.length) { setCatMap(prev=>prev); }
        setCategories(list.length>0 ? [{ id:null, name:'全部' }, ...list] : [{ id:null, name:'全部' }]);
      } catch(_){ setCategories([{ id:null, name:'全部' }]); }
    })();
  },[]);

  const TYPE_NAME_MAP = {1:'AI工具',2:'三方Agent平台',3:'阅读与写作',4:'图像生成',5:'AI商业解读',6:'教育与学习',7:'AI智能SQL',8:'文案与写作',9:'编程助手',10:'工作效率'};
  const filtered = tools.filter(x => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (x.toolName||'').toLowerCase().includes(s) || (x.description||'').toLowerCase().includes(s);
  });
  useEffect(()=>{
    try {
      const needDerive = !(Array.isArray(categories)) || categories.length <= 1 || (categories.length === 1 && categories[0] && categories[0].name === '全部');
      if (!needDerive) return;
      const types = new Map();
      tools.forEach(it => { const k = Number(it.type); if (!Number.isNaN(k)) { const label = catMap[k] || TYPE_NAME_MAP[k] || `分类${k}`; types.set(k, label); } });
      const derived = Array.from(types.entries()).map(([id, name]) => ({ id, name }));
      const base = [{ id:null, name:'全部' }, ...derived];
      setCategories(base);
    } catch(_) {}
  }, [tools, catMap]);

  const openTool = async (tool) => {
    const mustVip = String(tool.vipAllow||tool.vip_allow||'').toUpperCase() === 'VIP';
    if (mustVip && !isVipUser) { alert('该功能仅限 VIP99 使用'); return; }
    const ltRaw = tool.linkType ?? tool.link_type ?? '';
    const lt = String(ltRaw).toUpperCase();
    const api = String(tool.apiPath ?? tool.api_path ?? '');
    if (lt === '1' || lt === 'EXTERNAL') { if (api) { window.open(api, '_blank'); } return; }
    if (Number(tool.type) === 20) {
      setActiveTool(tool);
      await ensureTool10Ready();
      setShowOverlay(true);
      return;
    }
    if (Number(tool.type) === 19) {
      setActiveTool(tool);
      await ensureTool16Ready();
      setShowOverlay(true);
      return;
    }
    const isVip = String(tool.vipAllow||tool.vip_allow||'').toUpperCase() === 'VIP';
    if (isVip && !isVipUser) { alert('该功能仅限 VIP99 使用'); return; }
    const lt2 = String(tool.linkType||tool.link_type||'').toUpperCase();
    const api2 = String(tool.apiPath||tool.api_path||'');
    if (lt2 === '1' || lt2 === 'EXTERNAL') { if (api2) { window.open(api2, '_blank'); } return; }
    if (lt === '3' || lt === 'EMBED') { setActiveTool(tool); setToolReady(true); return; }
    if (lt === '2' || lt === 'INTERNAL') {
      const exists = !!(window.ToolsPages && window.ToolsPages[String(tool.id)]);
      if (!exists) {
        const ok = await loadToolScript(api2 || api);
        if (!ok || !(window.ToolsPages && window.ToolsPages[String(tool.id)])) { alert('该工具尚未就绪'); return; }
      }
      setActiveTool(tool);
      setToolReady(true);
      return;
    }
    const fallback = `${tool.id}-aiSql-tools-management.js`;
    const exists = !!(window.ToolsPages && window.ToolsPages[String(tool.id)]);
    if (!exists) {
      const ok = await loadToolScript(fallback);
      if (!ok || !(window.ToolsPages && window.ToolsPages[String(tool.id)])) { alert('该工具尚未就绪'); return; }
    }
    setActiveTool(tool);
    setToolReady(true);
  };

  const Card = (tool) => (
    React.createElement('div',{className:'bg-white rounded-2xl p-6 shadow border hover:shadow-lg transition cursor-pointer flex flex-col items-center justify-center text-center h-[240px] relative overflow-hidden group', onClick:()=>openTool(tool)},
      // VIP Badge
      (String(tool.vipAllow||'').toUpperCase()==='VIP' ? 
        React.createElement('span',{className:'absolute top-3 right-3 px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-700 border border-amber-200 font-bold'}, 'VIP') : null
      ),
      // Icon
      tool.iconUrl ? 
        React.createElement('img',{src:tool.iconUrl, className:'w-14 h-14 rounded-xl mb-4 shadow-sm object-cover', alt:tool.toolName}) : 
        React.createElement('div',{className:'w-14 h-14 bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-slate-400'}, 'Logo'),
      
      // Title
      React.createElement('div',{className:'font-bold text-lg text-slate-900 mb-2 line-clamp-1'}, tool.toolName),
      
      // Description
      React.createElement('div',{className:'text-xs text-slate-500 line-clamp-3 leading-relaxed px-2'}, tool.description || '暂无描述')
    )
  );

  return (
    React.createElement('div',{className:'grid grid-cols-12 gap-6'},
      React.createElement('aside',{className:'col-span-12 md:col-span-3'},
        React.createElement('div',{className:'bg-white rounded-2xl shadow border p-3'},
          React.createElement('div',{className:'font-semibold text-slate-900 mb-2'}, '分类'),
          categories.map(c => React.createElement('button',{key:(c.id===null?'all':c.id), className:((c.id===activeType)? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100') + ' w-full text-left px-3 py-2 rounded-lg mb-2', onClick:()=>setActiveType(c.id)}, c.name))
        )
      ),
      React.createElement('section',{className:'col-span-12 md:col-span-9'},
        React.createElement('div',{className:'flex items-center mb-4'},
          React.createElement('input',{className:'w-full md:w-80 border border-slate-300 rounded-lg px-3 py-2', placeholder:'搜索工具...', value:search, onChange:(e)=>setSearch(e.target.value)})
        ),
        React.createElement('div',{className:'grid md:grid-cols-12 gap-6'},
          React.createElement('div',{className:(activeTool ? 'md:col-span-8' : 'md:col-span-12')},
            loading ? React.createElement('div',{className:'grid md:grid-cols-3 gap-4'}, [1,2,3,4,5,6].map(i=>React.createElement('div',{key:i,className:'h-24 bg-slate-100 animate-pulse rounded-xl'})))
            : (filtered.length===0 ? React.createElement('div',{className:'text-slate-600 text-sm'}, '暂无数据')
               : React.createElement('div',{className:'grid md:grid-cols-4 lg:grid-cols-5 gap-4'}, filtered.map(t=>React.createElement(Card,{...t, key:t.id})))
              )
          ),
          activeTool && React.createElement('div',{className:'md:col-span-3'},
            (()=>{
              const lt = String(activeTool.linkType||'').toUpperCase();
              if (lt === '3' || lt === 'EMBED') { return React.createElement('iframe',{src: activeTool.apiPath, className:'w-full h-[520px] rounded-xl border'}); }
              if (Number(activeTool.type) === 20 && window.ToolsPages && window.ToolsPages['10'] && toolReady) { return React.createElement(window.ToolsPages['10'], null); }
              if (window.ToolsPages && window.ToolsPages[String(activeTool.id)] && toolReady) { return React.createElement(window.ToolsPages[String(activeTool.id)], null); }
              return React.createElement('div',{className:'p-6 border rounded-xl bg-white text-sm text-slate-500'}, '工具加载中...');
            })()
          )
        )
        , React.createElement('div',{className:'flex items-center justify-between mt-6'},
          React.createElement('div',{className:'text-xs text-slate-500'}, `第 ${page+1} / ${Math.max(totalPages,1)} 页 · 共 ${filtered.length} 项`),
          React.createElement('div',{className:'flex items-center gap-2'},
            React.createElement('button',{className:'px-3 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50', disabled: page<=0, onClick:()=>setPage(p=>Math.max(0,p-1))}, '上一页'),
            React.createElement('button',{className:'px-3 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50', disabled: (page+1)>=totalPages, onClick:()=>setPage(p=>p+1)}, '下一页')
          )
        )
        , (showOverlay && React.createElement('div',{className:'fixed inset-0 z-[980] bg-black/60 flex items-center justify-center p-4', onClick:()=>{ setShowOverlay(false); setActiveTool(null); setToolReady(false); }},
            React.createElement('div',{className:'bg-white rounded-2xl shadow-2xl w-full max-w-[75vw] md:max-w-5xl h-[75vh] overflow-hidden', onClick:(e)=>e.stopPropagation()},
              React.createElement('div',{className:'p-6 space-y-4 h-full overflow-auto'},
                React.createElement('div',{className:'text-xl font-bold text-slate-900'}, (Number(activeTool?.type)===19 ? '小学AI助教' : '智能DBA')),
                (Number(activeTool?.type)===19
                  ? (window.ToolsPages && window.ToolsPages['16'] ? React.createElement(window.ToolsPages['16'], { currentUser }, null) : React.createElement('div',{className:'text-sm text-slate-500'}, '考试页面加载中...'))
                  : ((window.ToolsPages && window.ToolsPages['10']) ? React.createElement(window.ToolsPages['10'], null) : React.createElement(InlineSqlDba, null))
                )
              ),
              React.createElement('div',{className:'px-6 pb-6 text-right'}, React.createElement('button',{className:'px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200', onClick:()=>{ setShowOverlay(false); setActiveTool(null); setToolReady(false); }}, '关闭'))
            )
          ))
      )
    )
  );
};

const AIToolManagement = () => {
  const { useState, useEffect } = React;
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [catMap, setCatMap] = useState({});
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ toolName:'', description:'', apiPath:'', iconUrl:'', isActive:true, vipAllow:'NO', type:'' });
  const [showEdit, setShowEdit] = useState(false);
  const [editTool, setEditTool] = useState(null);

  useEffect(()=>{ (async()=>{ await fetchCategories(); await fetchTools(); })(); }, []);
  const fetchCategories = async () => {
    try {
      const resp = await fetch('/api/categories?type=2&page=0&size=1000', { credentials: 'same-origin' });
      const text = await resp.text(); let data = {}; try { data = JSON.parse(text||'{}'); } catch(_) {}
      const list = Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []);
      setCategories(list);
      const m = {}; list.forEach(c=>{ m[c.id]=c.name; }); setCatMap(m);
    } catch(_) { setCategories([]); setCatMap({}); }
  };
  const typeLabel = (v) => catMap[v] || (typeof v==='number' ? String(v) : '-');
  const fetchTools = async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams(); if(searchTerm) params.set('search',searchTerm); if(typeFilter) params.set('type',parseInt(typeFilter,10)); params.set('page', page); params.set('size', size);
      const resp = await fetch(`/api/tools/admin?${params.toString()}`, { credentials:'same-origin' });
      const text = await resp.text(); let data = {}; try{ data = JSON.parse(text||'{}'); }catch(_){ data={}; }
      const list = Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []);
      setTools(list);
      const tp = Number.isFinite(data.totalPages) ? data.totalPages : Math.max(1, Math.ceil(list.length / size));
      const num = Number.isFinite(data.number) ? data.number : page;
      setTotalPages(tp);
      setPage(num);
    } catch(e){ setError(e.message||'请求失败'); }
    setLoading(false);
  };
  useEffect(()=>{ fetchTools(); }, [page, size]);

  const handleAdd = () => { setShowAdd(true); setAddForm({ toolName:'', description:'', apiPath:'', iconUrl:'', isActive:true, vipAllow:'NO', type:(categories[0]?.id||'') }); };
  const saveAdd = async () => {
    if (!addForm.toolName || !addForm.apiPath) { setError('名称与API路径必填'); return; }
    setLoading(true); setError('');
    try {
      const payload = { toolName:addForm.toolName.trim(), description:addForm.description||'', apiPath:addForm.apiPath.trim(), iconUrl:addForm.iconUrl||'', isActive:!!addForm.isActive, type: Number(addForm.type||1), vipAllow:addForm.vipAllow||'NO' };
      const resp = await fetch('/api/tools', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify(payload)});
      const ok = resp.ok; setShowAdd(false); if (!ok) { const tx=await resp.text(); let d={}; try{ d=JSON.parse(tx||'{}'); }catch(_){ d={}; } throw new Error(d.message||'新增失败'); }
      fetchTools();
    } catch(e){ setError(e.message||'请求失败'); }
    setLoading(false);
  };
  const openEdit = (t) => { setEditTool({ ...t, vipAllow: t.vipAllow||'NO' }); setShowEdit(true); };
  const saveEdit = async () => {
    if (!editTool) return; if (!editTool.toolName || !editTool.apiPath) { setError('名称与API路径必填'); return; }
    setLoading(true); setError('');
    try {
      const payload = { toolName:editTool.toolName, description:editTool.description||'', apiPath:editTool.apiPath, iconUrl:editTool.iconUrl||'', isActive:!!editTool.isActive, type: Number(editTool.type||1), vipAllow:editTool.vipAllow||'NO' };
      const resp = await fetch(`/api/tools/${editTool.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify(payload)});
      const ok = resp.ok; setShowEdit(false); setEditTool(null); if (!ok) { const tx=await resp.text(); let d={}; try{ d=JSON.parse(tx||'{}'); }catch(_){ d={}; } throw new Error(d.message||'更新失败'); }
      fetchTools();
    } catch(e){ setError(e.message||'请求失败'); }
    setLoading(false);
  };
  const handleDelete = async (id) => {
    if (!confirm('确认删除该工具？')) return;
    setLoading(true); setError('');
    try {
      const resp = await fetch(`/api/tools/${id}`, { method:'DELETE', credentials:'same-origin' });
      if (!resp.ok && resp.status !== 204) { const tx=await resp.text(); let d={}; try{ d=JSON.parse(tx||'{}'); }catch(_){ d={}; } throw new Error(d.message||'删除失败'); }
      fetchTools();
    } catch(e){ setError(e.message||'请求失败'); }
    setLoading(false);
  };

  return (
    React.createElement('div',{className:'p-6 md:p-10 bg-white rounded-xl shadow-lg w-full h-full space-y-6'},
      React.createElement('h2',{className:'text-3xl font-bold text-gray-800'}, 'AI功能管理'),
      React.createElement('div',{className:'flex items-center gap-3'},
        React.createElement('input',{type:'search', value:searchTerm, onChange:(e)=>setSearchTerm(e.target.value), onKeyDown:(e)=>{ if(e.key==='Enter') fetchTools(); }, placeholder:'按名称/描述/API搜索...', className:'w-full md:w-80 border border-gray-300 rounded-lg px-3 py-2'}),
        React.createElement('select',{className:'border border-gray-300 rounded-lg px-3 py-2 w-48', value:typeFilter, onChange:(e)=>setTypeFilter(e.target.value)},
          React.createElement('option',{value:''},'全部分类'),
          ...categories.map(c=>React.createElement('option',{key:c.id, value:c.id}, c.name))
        ),
        React.createElement('button',{className:'px-3 py-2 bg-blue-600 text-white rounded-lg', onClick:fetchTools}, '搜索'),
        React.createElement('button',{className:'px-3 py-2 bg-green-600 text-white rounded-lg', onClick:handleAdd}, '新增')
      ),
      error && React.createElement('div',{className:'text-red-600 text-sm'}, error),
      React.createElement('div',{className:'overflow-x-auto bg-white rounded-lg border border-gray-200 shadow'},
        React.createElement('table',{className:'min-w-full divide-y divide-gray-200 text-xs'},
          React.createElement('thead',{className:'bg-gray-50'}, React.createElement('tr',null, ['ID','名称','类型','权限','描述','API路径','状态','操作'].map((h,i)=>React.createElement('th',{key:i,className:'px-4 py-3 text-left text-xs font-medium text-gray-500'},h)))),
          React.createElement('tbody',{className:'bg白 divide-y divide-gray-200'},
            loading ? React.createElement('tr',null, React.createElement('td',{className:'px-4 py-6 text-center text-gray-500', colSpan:8}, '加载中...'))
            : tools.length===0 ? React.createElement('tr',null, React.createElement('td',{className:'px-4 py-6 text-center text-gray-500', colSpan:8}, '暂无数据'))
            : tools.map(t=>React.createElement('tr',{key:t.id},
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, t.id),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, t.toolName),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, typeLabel(t.type)),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, (String(t.vipAllow||'NO').toUpperCase()==='VIP'?'VIP99专享':'所有人可用')),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700 truncate max-w-[20rem]'}, t.description||''),
                React.createElement('td',{className:'px-3 py-2 text-xs text-gray-700'}, React.createElement('span',{className:'truncate max-w-[12rem] inline-block'}, t.apiPath||'')),
                React.createElement('td',{className:'px-4 py-3 text-sm'}, (t.isActive?'激活':'禁用')),
                React.createElement('td',{className:'px-3 py-2 text-xs'},
                  React.createElement('div',{className:'flex items-center justify-end gap-2'},
                    React.createElement('button',{className:'px-3 py-1 rounded bg-blue-600 text-white', onClick:()=>openEdit(t)}, '修改'),
                    React.createElement('button',{className:'px-3 py-1 rounded border border-red-600 text-red-600 bg-white hover:bg-red-50', onClick:()=>handleDelete(t.id)}, '删除')
                  )
                )
            ))
          )
        ),
        React.createElement('div',{className:'flex items-center justify-between mt-4'},
          React.createElement('div',{className:'text-xs text-slate-500'}, `第 ${page+1} / ${Math.max(totalPages,1)} 页`),
          React.createElement('div',{className:'flex items-center gap-2'},
            React.createElement('button',{className:'px-3 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50', disabled: page<=0, onClick:()=>setPage(p=>Math.max(0,p-1))}, '上一页'),
            React.createElement('button',{className:'px-3 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50', disabled: (page+1)>=totalPages, onClick:()=>setPage(p=>p+1)}, '下一页')
          )
        )
      )
      , (showAdd && React.createElement('div',{className:'fixed inset-0 bg-black/30 flex items-center justify-center p-4'},
          React.createElement('div',{className:'bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4'},
            React.createElement('h3',{className:'text-xl font-bold text-gray-800'}, '新增工具'),
            React.createElement('div',{className:'grid grid-cols-1 md:grid-cols-2 gap-3'},
              React.createElement('input',{className:'border rounded px-3 py-2', placeholder:'名称', value:addForm.toolName, onChange:(e)=>setAddForm({...addForm, toolName:e.target.value})}),
              React.createElement('input',{className:'border rounded px-3 py-2', placeholder:'API路径(如 10-aiSql-tools-management)', value:addForm.apiPath, onChange:(e)=>setAddForm({...addForm, apiPath:e.target.value})}),
              React.createElement('select',{className:'border rounded px-3 py-2', value:addForm.type, onChange:(e)=>setAddForm({...addForm, type:e.target.value})},
                ...categories.map(c=>React.createElement('option',{key:c.id, value:c.id}, c.name))
              ),
              React.createElement('select',{className:'border rounded px-3 py-2', value:addForm.vipAllow, onChange:(e)=>setAddForm({...addForm, vipAllow:e.target.value})},
                React.createElement('option',{value:'NO'}, '所有人可用'),
                React.createElement('option',{value:'VIP'}, 'VIP99专享')
              ),
              React.createElement('input',{className:'border rounded px-3 py-2 md:col-span-2', placeholder:'图标URL(可选)', value:addForm.iconUrl, onChange:(e)=>setAddForm({...addForm, iconUrl:e.target.value})}),
              React.createElement('textarea',{className:'border rounded px-3 py-2 md:col-span-2', rows:4, placeholder:'描述', value:addForm.description, onChange:(e)=>setAddForm({...addForm, description:e.target.value})}),
              React.createElement('label',{className:'inline-flex items-center gap-2 md:col-span-2'}, React.createElement('input',{type:'checkbox', checked:!!addForm.isActive, onChange:(e)=>setAddForm({...addForm, isActive:e.target.checked})}), React.createElement('span',null,'激活'))
            ),
            React.createElement('div',{className:'flex justify-end gap-2'},
              React.createElement('button',{className:'px-4 py-2 rounded bg-gray-200', onClick:()=>{ setShowAdd(false); }}, '取消'),
              React.createElement('button',{className:'px-4 py-2 rounded bg-blue-600 text-white', onClick:saveAdd}, '保存')
            )
          )
        ))
      , (showEdit && editTool && React.createElement('div',{className:'fixed inset-0 bg黑/30 flex items-center justify-center p-4'},
          React.createElement('div',{className:'bg白 rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4'},
            React.createElement('h3',{className:'text-xl font-bold text-gray-800'}, '编辑工具'),
            React.createElement('div',{className:'grid grid-cols-1 md:grid-cols-2 gap-3'},
              React.createElement('div',{className:'text-sm text-gray-500 md:col-span-2'}, `ID: ${editTool.id}`),
              React.createElement('input',{className:'border rounded px-3 py-2', placeholder:'名称', value:editTool.toolName||'', onChange:(e)=>setEditTool({...editTool, toolName:e.target.value})}),
              React.createElement('input',{className:'border rounded px-3 py-2', placeholder:'API路径', value:editTool.apiPath||'', onChange:(e)=>setEditTool({...editTool, apiPath:e.target.value})}),
              React.createElement('select',{className:'border rounded px-3 py-2', value:(editTool.type||''), onChange:(e)=>setEditTool({...editTool, type:e.target.value})},
                ...categories.map(c=>React.createElement('option',{key:c.id, value:c.id}, c.name))
              ),
              React.createElement('select',{className:'border rounded px-3 py-2', value:(editTool.vipAllow||'NO'), onChange:(e)=>setEditTool({...editTool, vipAllow:e.target.value})},
                React.createElement('option',{value:'NO'}, '所有人可用'),
                React.createElement('option',{value:'VIP'}, 'VIP99专享')
              ),
              React.createElement('input',{className:'border rounded px-3 py-2 md:col-span-2', placeholder:'图标URL(可选)', value:editTool.iconUrl||'', onChange:(e)=>setEditTool({...editTool, iconUrl:e.target.value})}),
              React.createElement('textarea',{className:'border rounded px-3 py-2 md:col-span-2', rows:4, placeholder:'描述', value:editTool.description||'', onChange:(e)=>setEditTool({...editTool, description:e.target.value})}),
              React.createElement('label',{className:'inline-flex items-center gap-2 md:col-span-2'}, React.createElement('input',{type:'checkbox', checked:!!editTool.isActive, onChange:(e)=>setEditTool({...editTool, isActive:e.target.checked})}), React.createElement('span',null,'激活'))
            ),
            React.createElement('div',{className:'flex justify-end gap-2'},
              React.createElement('button',{className:'px-4 py-2 rounded bg-gray-200', onClick:()=>{ setShowEdit(false); setEditTool(null); }}, '取消'),
              React.createElement('button',{className:'px-4 py-2 rounded bg-blue-600 text白', onClick:saveEdit}, '保存')
            )
          )
        ))
    )
  );
};

window.Components = window.Components || {};
window.Components.UserToolsExplorer = UserToolsExplorer;
window.Components.AIToolManagement = AIToolManagement;
try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}
