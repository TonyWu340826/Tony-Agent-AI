const UserToolsExplorer = ({ currentUser }) => {
  const { useEffect, useMemo, useRef, useState } = React;
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 添加useEffect来监听返回到工具列表的事件
  useEffect(() => {
    // 监听返回到工具列表的事件
    const handleBackToToolList = () => {
      setActiveTool(null);
      setToolReady(false);
      setShowOverlay(false);
      setSidebarOpen(false);
    };

    window.addEventListener('backToToolList', handleBackToToolList);

    return () => {
      window.removeEventListener('backToToolList', handleBackToToolList);
    };
  }, []);

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
      const hasType = type !== null && type !== undefined && type !== '';
      const url = hasType
          ? `/api/tools/active?type=${type}&page=${page}&size=${size}`
          : `/api/tools/active?page=${page}&size=${size}`;
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

  const TYPE_NAME_MAP = {1:'AI工具',2:'三方AI平台',3:'阅读与写作',4:'图像生成',5:'AI商业解读',6:'教育与学习',7:'AI智能SQL',8:'文案与写作',9:'编程助手',10:'工作效率'};
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
    setSidebarOpen(false);
    if (Number(tool.type) === 20) {
      setActiveTool(tool);
      await ensureTool10Ready();
      return;
    }
    if (Number(tool.type) === 19) {
      setActiveTool(tool);
      await ensureTool16Ready();
      return;
    }
    const isVip = String(tool.vipAllow||tool.vip_allow||'').toUpperCase() === 'VIP';
    if (isVip && !isVipUser) { alert('该功能仅限 VIP99 使用'); return; }
    const lt2 = String(tool.linkType||tool.link_type||'').toUpperCase();
    const api2 = String(tool.apiPath||tool.api_path||'');
    if (lt2 === '1' || lt2 === 'EXTERNAL') { if (api2) { window.open(api2, '_blank'); } return; }
    if (lt === '4') { setActiveTool(tool); setToolReady(true); return; }
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
      React.createElement('div',{className:'bg-gradient-to-br from-white via-white to-blue-50/30 rounded-xl p-3 shadow-lg border border-slate-200/80 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center h-[160px] relative overflow-hidden group backdrop-blur-sm', onClick:()=>openTool(tool)},
          // Animated background gradient overlay
          React.createElement('div',{className:'absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500'}),

          // VIP Badge
          (String(tool.vipAllow||'').toUpperCase()==='VIP' ?
                  React.createElement('span',{className:'absolute top-1.5 right-1.5 px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white border border-amber-300/50 font-bold shadow-md z-10'}, 'VIP') : null
          ),

          // Icon with glow effect
          tool.iconUrl ?
              React.createElement('div',{className:'relative z-10'},
                  React.createElement('div',{className:'absolute inset-0 bg-blue-400/20 rounded-lg blur-md group-hover:bg-blue-500/40 transition-all duration-300'}),
                  React.createElement('img',{src:tool.iconUrl, className:'relative w-10 h-10 rounded-lg mb-2 shadow-md object-cover group-hover:scale-110 group-hover:rotate-3 transition-all duration-300', alt:tool.toolName})
              ) :
              React.createElement('div',{className:'relative z-10 w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-2 flex items-center justify-center text-slate-400 text-xs shadow-inner group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300'}, '🔧'),

          // Title with gradient on hover
          React.createElement('div',{className:'relative z-10 font-semibold text-sm text-slate-900 group-hover:text-blue-700 mb-1 line-clamp-2 px-1 w-full transition-colors duration-300'}, tool.toolName),

          // Description
          React.createElement('div',{className:'relative z-10 text-xs text-slate-500 group-hover:text-slate-600 line-clamp-2 leading-relaxed px-1 w-full transition-colors duration-300'}, tool.description || '暂无描述'),

          // Bottom shine effect
          React.createElement('div',{className:'absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/50 transition-all duration-500'})
      )
  );

  const toolShortName = (name) => {
    const raw = String(name || '').trim();
    if (!raw) return '-';
    const compact = raw.replace(/\s+/g, ' ');
    const hasCjk = /[\u4e00-\u9fff]/.test(compact);
    if (hasCjk) {
      const cjk = compact.replace(/[^\u4e00-\u9fff]/g, '');
      if (cjk.length >= 4) return cjk.slice(0, 4);
      if (cjk.length >= 2) return cjk.slice(0, 2);
      return (cjk || compact).slice(0, 4);
    }
    const parts = compact.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      const a = String(parts[0] || '').charAt(0);
      const b = String(parts[1] || '').charAt(0);
      return (a + b).toUpperCase();
    }
    const word = parts[0] || compact;
    const letters = word.replace(/[^a-zA-Z0-9]/g, '');
    if (letters.length >= 4) return letters.slice(0, 4).toUpperCase();
    if (letters.length >= 2) return letters.slice(0, 2).toUpperCase();
    return compact.slice(0, 4).toUpperCase();
  };

  const ToolGlobe = ({ items, onOpen }) => {
    const containerRef = useRef(null);
    const itemRefs = useRef([]);
    const rafRef = useRef(0);
    const rotRef = useRef({ ax: 0, ay: 0, vx: 0.002, vy: 0.003 });
    const dragRef = useRef({ down: false, x: 0, y: 0, sx: 0, sy: 0, pid: null, captured: false, t: 0, moved: false, lastMovedAt: 0 });
    const sizeRef = useRef({ w: 0, h: 0 });
    const radiusRef = useRef(160);

    const points = useMemo(() => {
      const list = Array.isArray(items) ? items : [];
      const n = Math.max(1, list.length);
      const golden = Math.PI * (3 - Math.sqrt(5));
      return list.map((tool, i) => {
        const y = 1 - (i / Math.max(1, n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = golden * i;
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        return { x, y, z, tool };
      });
    }, [items]);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const updateSize = () => {
        const rect = el.getBoundingClientRect();
        const w = Math.max(1, rect.width);
        const h = Math.max(1, rect.height);
        sizeRef.current = { w, h };
        radiusRef.current = Math.max(120, Math.min(w, h) * 0.38);
      };

      updateSize();
      let ro;
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(() => updateSize());
        try { ro.observe(el); } catch (_) {}
      } else {
        window.addEventListener('resize', updateSize);
      }

      const tick = () => {
        const { w, h } = sizeRef.current;
        const r = radiusRef.current;
        const fov = 520;
        const st = rotRef.current;
        st.ay += st.vy;
        st.ax += st.vx;
        st.vx *= 0.985;
        st.vy *= 0.985;
        if (Math.abs(st.vx) < 0.0003) st.vx = (st.vx < 0 ? -1 : 1) * 0.0003;
        if (Math.abs(st.vy) < 0.0003) st.vy = (st.vy < 0 ? -1 : 1) * 0.0003;

        const sinY = Math.sin(st.ay);
        const cosY = Math.cos(st.ay);
        const sinX = Math.sin(st.ax);
        const cosX = Math.cos(st.ax);

        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          const node = itemRefs.current[i];
          if (!node) continue;

          let x = p.x;
          let y = p.y;
          let z = p.z;

          const x1 = x * cosY + z * sinY;
          const z1 = -x * sinY + z * cosY;
          x = x1;
          z = z1;

          const y1 = y * cosX - z * sinX;
          const z2 = y * sinX + z * cosX;
          y = y1;
          z = z2;

          const px = x * r;
          const py = y * r;
          const pz = z * r;

          const scale = fov / (fov + pz + r);
          const tx = px * scale + w / 2;
          const ty = py * scale + h / 2;
          const opacity = Math.max(0.25, Math.min(1, 0.35 + (scale - 0.4) * 1.6));
          const s = Math.max(0.65, Math.min(1.12, scale));

          node.style.transform = `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(${s})`;
          node.style.opacity = String(opacity);
          node.style.zIndex = String(Math.floor(1000 + pz));
          node.style.filter = `blur(${Math.max(0, (0.9 - scale) * 1.2)}px)`;
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (ro) {
          try { ro.disconnect(); } catch (_) {}
        } else {
          window.removeEventListener('resize', updateSize);
        }
      };
    }, [points]);

    const onPointerDown = (e) => {
      const el = containerRef.current;
      if (!el) return;
      dragRef.current = {
        down: true,
        x: e.clientX,
        y: e.clientY,
        sx: e.clientX,
        sy: e.clientY,
        pid: (e && e.pointerId != null) ? e.pointerId : null,
        captured: false,
        t: Date.now(),
        moved: false,
        lastMovedAt: 0
      };
    };
    const onPointerMove = (e) => {
      if (!dragRef.current.down) return;
      const el = containerRef.current;
      const { w, h } = sizeRef.current;
      const dx = e.clientX - dragRef.current.x;
      const dy = e.clientY - dragRef.current.y;
      const totalDx = e.clientX - dragRef.current.sx;
      const totalDy = e.clientY - dragRef.current.sy;
      const dist = Math.hypot(totalDx, totalDy);
      if (dist > 6) {
        if (!dragRef.current.moved) {
          dragRef.current.moved = true;
        }
        dragRef.current.lastMovedAt = Date.now();
        if (el && !dragRef.current.captured && dragRef.current.pid != null) {
          try { el.setPointerCapture(dragRef.current.pid); dragRef.current.captured = true; } catch (_) {}
        }
      }
      dragRef.current.x = e.clientX;
      dragRef.current.y = e.clientY;
      const st = rotRef.current;
      const kx = (Math.PI / Math.max(220, w)) * 0.9;
      const ky = (Math.PI / Math.max(220, h)) * 0.9;
      st.vy = dx * kx;
      st.vx = dy * ky;
    };
    const onPointerUp = (e) => {
      dragRef.current.down = false;
      const el = containerRef.current;
      if (!el) return;
      if (dragRef.current.captured && dragRef.current.pid != null) {
        try { el.releasePointerCapture(dragRef.current.pid); } catch (_) {}
      }
      dragRef.current.captured = false;
      dragRef.current.pid = null;
    };

    const list = Array.isArray(items) ? items : [];
    const shouldIgnoreClick = () => {
      const now = Date.now();
      const st = dragRef.current;
      return !!(st && st.moved && st.lastMovedAt && (now - st.lastMovedAt) < 220);
    };

    return React.createElement('div', {
          ref: containerRef,
          onPointerDown,
          onPointerMove,
          onPointerUp,
          className: 'relative w-full h-[420px] md:h-[480px] rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-indigo-50/40 overflow-hidden select-none touch-none'
        },
        React.createElement('div', { className: 'absolute inset-0 pointer-events-none', style: { backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.12) 0%, rgba(255,255,255,0) 55%), radial-gradient(circle at 70% 60%, rgba(59,130,246,0.10) 0%, rgba(255,255,255,0) 60%)' } }),
        React.createElement('div', { className: 'absolute inset-0 pointer-events-none opacity-60', style: { backgroundImage: 'linear-gradient(rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.22) 1px, transparent 1px)', backgroundSize: '48px 48px' } }),
        React.createElement('div', { className: 'absolute left-4 top-4 text-xs text-slate-500' }, '拖拽旋转 · 点击打开工具'),
        ...list.map((tool, idx) => React.createElement('button', {
          key: tool && tool.id != null ? String(tool.id) : String(idx),
          type: 'button',
          ref: (node) => { itemRefs.current[idx] = node; },
          onClick: () => { if (shouldIgnoreClick()) return; if (onOpen) onOpen(tool); },
          className: 'absolute left-0 top-0 px-2.5 py-1.5 rounded-full border border-slate-200 bg-white/85 backdrop-blur text-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 hover:text-indigo-700 transition flex items-center gap-2 max-w-[220px]',
          style: { transform: 'translate(-50%, -50%) translate(-9999px, -9999px)' },
          title: tool && tool.toolName ? tool.toolName : ''
        },
          (tool && tool.iconUrl
              ? React.createElement('img', { src: tool.iconUrl, alt: tool.toolName || 'tool', className: 'w-7 h-7 rounded-full object-cover border border-slate-200 bg-white flex-none' })
              : React.createElement('div', { className: 'w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 text-slate-700 border border-slate-200 flex-none grid place-items-center text-[11px] font-bold' }, toolShortName(tool && tool.toolName))
          ),
          React.createElement('span', { className: 'text-[12px] font-semibold truncate leading-4 min-w-0' }, (tool && tool.toolName) ? tool.toolName : '-')
        ))
    );
  };

  const ToolListItem = (tool) => (
      React.createElement('button', {
            type: 'button',
            onClick: () => openTool(tool),
            className: `${activeTool && String(activeTool.id) === String(tool.id)
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-200 shadow-sm'
                : 'bg-transparent text-slate-800 border-transparent hover:bg-white hover:border-slate-200'} w-full text-left px-3 py-2.5 rounded-xl border transition flex items-center gap-2`,
            title: tool.toolName || ''
          },
          React.createElement('span', { className: `${activeTool && String(activeTool.id) === String(tool.id) ? 'bg-white/70' : 'bg-slate-300'} w-1.5 h-5 rounded-full flex-none` }),
          tool.iconUrl
              ? React.createElement('img', { src: tool.iconUrl, className: 'w-7 h-7 rounded-lg object-cover flex-none', alt: tool.toolName || 'tool' })
              : React.createElement('div', { className: `${activeTool && String(activeTool.id) === String(tool.id) ? 'bg-white/30' : 'bg-slate-200'} w-7 h-7 rounded-lg flex-none` }),
          React.createElement('div', { className: 'min-w-0 flex-1' },
              React.createElement('div', { className: 'text-[13px] font-semibold truncate leading-5' }, tool.toolName || '-'),
              React.createElement('div', { className: `${activeTool && String(activeTool.id) === String(tool.id) ? 'text-white/80' : 'text-slate-500'} text-[11px] truncate leading-4` }, tool.description || '')
          ),
          (String(tool.vipAllow || '').toUpperCase() === 'VIP'
              ? React.createElement('span', { className: `${activeTool && String(activeTool.id) === String(tool.id) ? 'bg-white/20 text-white border-white/20' : 'bg-amber-100 text-amber-700 border-amber-200'} px-2 py-0.5 text-[10px] rounded-full border font-semibold flex-none` }, 'VIP')
              : null)
      )
  );

  const clearActiveTool = () => {
    setActiveTool(null);
    setToolReady(false);
    setShowOverlay(false);
  };

  const renderActiveTool = () => {
    if (!activeTool) {
      const globeItems = (Array.isArray(filtered) ? filtered : []).slice(0, 42);
      return React.createElement('div', { className: 'relative overflow-hidden rounded-2xl border bg-white text-slate-900 min-h-[62vh]' },
          React.createElement('div', { className: 'absolute inset-0', style: { backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.18) 0%, rgba(255,255,255,0) 55%), radial-gradient(circle at 80% 30%, rgba(59,130,246,0.14) 0%, rgba(255,255,255,0) 60%), radial-gradient(circle at 50% 90%, rgba(34,211,238,0.10) 0%, rgba(255,255,255,0) 55%)' } }),
          React.createElement('div', { className: 'absolute inset-0 opacity-60', style: { backgroundImage: 'linear-gradient(rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.25) 1px, transparent 1px)', backgroundSize: '52px 52px' } }),
          React.createElement('div', { className: 'absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/80' }),
          React.createElement('div', { className: 'relative p-8 md:p-10' },
              React.createElement('div', { className: 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-slate-700 text-xs shadow-sm' },
                  React.createElement('span', { className: 'w-2 h-2 rounded-full bg-blue-600' }),
                  'AI 工具合集'
              ),
              React.createElement('div', { className: 'mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900' }, '一站式 AI 能力中心'),
              React.createElement('div', { className: 'mt-3 text-slate-600 max-w-2xl leading-relaxed' }, '这里汇聚了学习、创作、办公与开发等多类型工具。通过左侧菜单快速定位功能，右侧将加载对应工具页面，开箱即用。'),
              React.createElement('div', { className: 'mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4' },
                  React.createElement('div', { className: 'rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-5 shadow-sm' },
                      React.createElement('div', { className: 'text-sm font-semibold text-slate-900' }, '快速发现'),
                      React.createElement('div', { className: 'mt-1 text-xs text-slate-600 leading-relaxed' }, '按分组浏览工具，支持搜索，减少选择成本。')
                  ),
                  React.createElement('div', { className: 'rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-5 shadow-sm' },
                      React.createElement('div', { className: 'text-sm font-semibold text-slate-900' }, '场景覆盖'),
                      React.createElement('div', { className: 'mt-1 text-xs text-slate-600 leading-relaxed' }, '从模型与Agent到写作、图片与效率，持续扩展。')
                  ),
                  React.createElement('div', { className: 'rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-5 shadow-sm' },
                      React.createElement('div', { className: 'text-sm font-semibold text-slate-900' }, '安全可控'),
                      React.createElement('div', { className: 'mt-1 text-xs text-slate-600 leading-relaxed' }, '统一入口与权限控制，VIP 工具清晰标识。')
                  )
              ),
              React.createElement('div', { className: 'mt-7 flex flex-wrap items-center gap-3' },
                  React.createElement('div', { className: 'px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-sm shadow-sm' }, '从左侧选择一个工具开始'),
                  React.createElement('div', { className: 'text-xs text-slate-500' }, `当前可用工具：${filtered.length} 个`)
              ),
              React.createElement('div', { className: 'mt-6' },
                  React.createElement(ToolGlobe, { items: globeItems, onOpen: openTool }, null)
              )
          )
      );
    }

    const lt = String(activeTool.linkType || activeTool.link_type || '').toUpperCase();
    const apiPath = String(activeTool.apiPath || activeTool.api_path || '');
    if (lt === '4') {
      return React.createElement('iframe', { src: apiPath, className: 'w-full h-[78vh] rounded-2xl border bg-white' });
    }
    if (lt === '3' || lt === 'EMBED') {
      return React.createElement('iframe', { src: apiPath, className: 'w-full h-[78vh] rounded-2xl border bg-white' });
    }
    if (Number(activeTool.type) === 19 && window.ToolsPages && window.ToolsPages['16'] && toolReady) {
      return React.createElement(window.ToolsPages['16'], { currentUser }, null);
    }
    if (Number(activeTool.type) === 20 && window.ToolsPages && window.ToolsPages['10'] && toolReady) {
      return React.createElement(window.ToolsPages['10'], null);
    }
    if (window.ToolsPages && window.ToolsPages[String(activeTool.id)] && toolReady) {
      return React.createElement(window.ToolsPages[String(activeTool.id)], { currentUser }, null);
    }
    return React.createElement('div', { className: 'p-6 border rounded-2xl bg-white text-sm text-slate-500' }, '工具加载中...');
  };

  const categoryList = (Array.isArray(categories) ? categories : []).filter(c => c && c.id != null);
  const categoryIdSet = new Set(categoryList.map(c => String(c.id)));
  const otherTools = filtered.filter(t => !categoryIdSet.has(String(Number(t.type))));
  const groupedTools = categoryList
      .map(c => ({
        id: c.id,
        name: c.name,
        items: filtered.filter(t => String(Number(t.type)) === String(c.id))
      }))
      .filter(g => g.items.length > 0);

  const handleCategoryChange = (e) => {
    setPage(0);
    const raw = (e && e.target && e.target.value != null) ? String(e.target.value) : '';
    if (!raw) {
      setActiveType(null);
      return;
    }
    const next = Number(raw);
    setActiveType(Number.isNaN(next) ? null : next);
  };

  return (
      React.createElement('div', { className: 'bg-white rounded-2xl border overflow-hidden min-h-[75vh]' },
          React.createElement('div', { className: 'md:hidden flex items-center justify-between px-4 py-3 border-b bg-slate-50/60' },
              React.createElement('div', { className: 'font-semibold text-slate-900' }, '工具合集'),
              React.createElement('button', { className: 'px-3 py-1 rounded-lg bg-slate-100 text-slate-700', onClick: ()=>setSidebarOpen(v=>!v) }, sidebarOpen ? '收起菜单' : '展开菜单')
          ),
          React.createElement('div', { className: 'grid grid-cols-12 min-h-[75vh]' },
              React.createElement('aside', { className: `${sidebarOpen ? 'block' : 'hidden'} md:block col-span-12 ${sidebarCollapsed ? 'md:col-span-1' : 'md:col-span-3'} border-b md:border-b-0 md:border-r bg-slate-50/50` },
                  React.createElement('div', { className: `p-4 ${sidebarCollapsed ? 'space-y-3' : 'space-y-4'}` },
                      React.createElement('div', { className: 'hidden md:flex items-center justify-between gap-2' },
                          React.createElement('div', { className: `min-w-0 ${sidebarCollapsed ? 'hidden' : 'block'}` },
                              React.createElement('div', { className: 'text-lg font-bold text-slate-900' }, '工具合集'),
                              React.createElement('div', { className: 'text-xs text-slate-500 mt-1' }, '选择工具开始使用')
                          ),
                          React.createElement('button', {
                            type: 'button',
                            className: 'ml-auto w-9 h-9 grid place-items-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                            title: sidebarCollapsed ? '展开侧栏' : '折叠侧栏',
                            onClick: ()=>setSidebarCollapsed(v=>!v)
                          }, sidebarCollapsed ? '›' : '‹')
                      ),
                      !sidebarCollapsed && React.createElement('input', { className: 'w-full border border-slate-200 rounded-xl px-3 py-2 bg-white', placeholder: '搜索工具...', value: search, onChange: (e)=>setSearch(e.target.value) }),
                      !sidebarCollapsed && React.createElement('select', {
                        className: 'w-full border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-900',
                        value: (activeType == null ? '' : String(activeType)),
                        onChange: handleCategoryChange
                      },
                          ...(Array.isArray(categories) ? categories : [{ id: null, name: '全部' }])
                              .map(c => React.createElement('option', { key: String(c && c.id), value: (c && c.id != null) ? String(c.id) : '' }, (c && c.name) ? c.name : '全部'))
                      ),
                      React.createElement('div', { className: `${sidebarCollapsed ? 'max-h-[66vh]' : 'max-h-[64vh]'} overflow-auto pr-1 space-y-4` },
                          loading
                              ? React.createElement('div', { className: 'space-y-2' }, [1,2,3,4,5,6,7,8].map(i=>React.createElement('div', { key: i, className: 'h-10 bg-slate-100 rounded-xl animate-pulse' })))
                              : (
                                  React.createElement(React.Fragment, null,
                                      (groupedTools.length === 0 && otherTools.length === 0)
                                          ? React.createElement('div', { className: 'text-xs text-slate-500' }, '暂无工具')
                                          : null,
                                      groupedTools.map(g => React.createElement('div', { key: String(g.id), className: 'space-y-1' },
                                          !sidebarCollapsed && React.createElement('div', { className: 'px-2 pt-2 pb-1 text-[11px] font-bold tracking-wide text-slate-500 uppercase' }, g.name),
                                          React.createElement('div', { className: 'space-y-1' },
                                              g.items.map(t => React.createElement(ToolListItem, { ...t, key: t.id }))
                                          )
                                      )),
                                      (otherTools.length > 0
                                          ? React.createElement('div', { className: 'space-y-1' },
                                              !sidebarCollapsed && React.createElement('div', { className: 'px-2 pt-2 pb-1 text-[11px] font-bold tracking-wide text-slate-500 uppercase' }, '其他'),
                                              React.createElement('div', { className: 'space-y-1' }, otherTools.map(t => React.createElement(ToolListItem, { ...t, key: t.id })))
                                          )
                                          : null)
                                  )
                              )
                      )
                  )
              ),
              React.createElement('section', { className: `${sidebarOpen ? 'hidden' : 'block'} md:block col-span-12 ${sidebarCollapsed ? 'md:col-span-11' : 'md:col-span-9'} bg-white` },
                  React.createElement('div', { className: 'p-4 border-b flex items-center justify-between gap-3' },
                      React.createElement('div', { className: 'min-w-0' },
                          React.createElement('div', { className: 'text-base font-semibold text-slate-900 truncate' }, activeTool ? (activeTool.toolName || '工具') : '欢迎使用工具合集'),
                          React.createElement('div', { className: 'text-xs text-slate-500 truncate' }, activeTool ? (activeTool.description || '') : '在左侧选择工具后，将在此处展示功能页面')
                      ),
                      activeTool
                          ? React.createElement('div', { className: 'flex items-center gap-2' },
                              React.createElement('button', { className: 'px-3 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm', onClick: clearActiveTool }, '返回列表'),
                              React.createElement('button', { className: 'px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm', onClick: ()=>setSidebarOpen(true) }, '菜单')
                          )
                          : React.createElement('div', { className: 'flex items-center gap-2' },
                              React.createElement('button', { className: 'px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm', onClick: ()=>setSidebarOpen(true) }, '菜单')
                          )
                  ),
                  React.createElement('div', { className: 'p-4' },
                      renderActiveTool()
                  )
              )
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

  const handleAdd = () => { setShowAdd(true); setAddForm({ toolName:'', description:'', apiPath:'', iconUrl:'', isActive:true, vipAllow:'NO', type:(categories[0]?.id||''), linkType:'1' }); };
  const saveAdd = async () => {
    if (!addForm.toolName || !addForm.apiPath) { setError('名称与API路径必填'); return; }
    setLoading(true); setError('');
    try {
      const payload = { toolName:addForm.toolName.trim(), description:addForm.description||'', apiPath:addForm.apiPath.trim(), iconUrl:addForm.iconUrl||'', isActive:!!addForm.isActive, type: Number(addForm.type||1), vipAllow:addForm.vipAllow||'NO', linkType:addForm.linkType||'1' };
      const resp = await fetch('/api/tools', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify(payload)});
      const ok = resp.ok; setShowAdd(false); if (!ok) { const tx=await resp.text(); let d={}; try{ d=JSON.parse(tx||'{}'); }catch(_){ d={}; } throw new Error(d.message||'新增失败'); }
      fetchTools();
    } catch(e){ setError(e.message||'请求失败'); }
    setLoading(false);
  };
  const openEdit = (t) => { setEditTool({ ...t, vipAllow: t.vipAllow||'NO', linkType: t.linkType||'1' }); setShowEdit(true); };
  const saveEdit = async () => {
    if (!editTool) return; if (!editTool.toolName || !editTool.apiPath) { setError('名称与API路径必填'); return; }
    setLoading(true); setError('');
    try {
      const payload = { toolName:editTool.toolName, description:editTool.description||'', apiPath:editTool.apiPath, iconUrl:editTool.iconUrl||'', isActive:!!editTool.isActive, type: Number(editTool.type||1), vipAllow:editTool.vipAllow||'NO', linkType:editTool.linkType||'1' };
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
                  React.createElement('thead',{className:'bg-gray-50'}, React.createElement('tr',null, ['ID','名称','类型','权限','链接方式','描述','API路径','状态','操作'].map((h,i)=>React.createElement('th',{key:i,className:'px-4 py-3 text-left text-xs font-medium text-gray-500'},h)))),
                  React.createElement('tbody',{className:'bg-white divide-y divide-gray-200'},
                      loading ? React.createElement('tr',null, React.createElement('td',{className:'px-4 py-6 text-center text-gray-500', colSpan:9}, '加载中...'))
                          : tools.length===0 ? React.createElement('tr',null, React.createElement('td',{className:'px-4 py-6 text-center text-gray-500', colSpan:9}, '暂无数据'))
                              : tools.map(t=>React.createElement('tr',{key:t.id},
                                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, t.id),
                                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, t.toolName),
                                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, typeLabel(t.type)),
                                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, (String(t.vipAllow||'NO').toUpperCase()==='VIP'?'VIP99专享':'所有人可用')),
                                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, (String(t.linkType||'1').toUpperCase()==='4'?'内嵌链接':'外部链接')),
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
          , (showAdd && React.createElement('div',{className:'fixed inset-0 bg-black/50 flex items-center justify-center p-4'},
              React.createElement('div',{className:'bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4'},
                  React.createElement('h3',{className:'text-xl font-bold text-gray-800'}, '新增工具'),
                  React.createElement('div',{className:'space-y-4'},
                      React.createElement('div',{className:'grid grid-cols-1 md:grid-cols-2 gap-4'},
                          React.createElement('div',{className:'space-y-1'},
                              React.createElement('label',{className:'text-sm font-medium text-gray-700'}, '工具名称 *'),
                              React.createElement('input',{className:'w-full border rounded px-3 py-2', placeholder:'请输入工具名称', value:addForm.toolName, onChange:(e)=>setAddForm({...addForm, toolName:e.target.value})})
                          ),
                          React.createElement('div',{className:'space-y-1'},
                              React.createElement('label',{className:'text-sm font-medium text-gray-700'}, 'API路径 *'),
                              React.createElement('input',{className:'w-full border rounded px-3 py-2', placeholder:'请输入API路径，如：/api/chat/gpt4', value:addForm.apiPath, onChange:(e)=>setAddForm({...addForm, apiPath:e.target.value})})
                          ),
                          React.createElement('div',{className:'space-y-1'},
                              React.createElement('label',{className:'text-sm font-medium text-gray-700'}, '工具类型'),
                              React.createElement('select',{className:'w-full border rounded px-3 py-2', value:addForm.type, onChange:(e)=>setAddForm({...addForm, type:e.target.value})},
                                  React.createElement('option',{value:''}, '请选择类型'),
                                  ...categories.map(c=>React.createElement('option',{key:c.id, value:c.id}, c.name))
                              )
                          ),
                          React.createElement('div',{className:'space-y-1'},
                              React.createElement('label',{className:'text-sm font-medium text-gray-700'}, '权限设置'),
                              React.createElement('select',{className:'w-full border rounded px-3 py-2', value:addForm.vipAllow, onChange:(e)=>setAddForm({...addForm, vipAllow:e.target.value})},
                                  React.createElement('option',{value:'NO'}, '所有人可用'),
                                  React.createElement('option',{value:'VIP'}, 'VIP99专享')
                              )
                          ),
                          React.createElement('div',{className:'space-y-1'},
                              React.createElement('label',{className:'text-sm font-medium text-gray-700'}, '链接方式'),
                              React.createElement('select',{className:'w-full border rounded px-3 py-2', value:addForm.linkType || '1', onChange:(e)=>setAddForm({...addForm, linkType:e.target.value})},
                                  React.createElement('option',{value:'1'}, '外部链接(直接跳转)'),
                                  React.createElement('option',{value:'2'}, '内部实现'),
                                  React.createElement('option',{value:'3'}, '内嵌页面'),
                                  React.createElement('option',{value:'4'}, '内嵌链接(新)')
                              )
                          )
                      ),
                      React.createElement('div',{className:'space-y-1'},
                          React.createElement('label',{className:'text-sm font-medium text-gray-700'}, '图标URL'),
                          React.createElement('input',{className:'w-full border rounded px-3 py-2', placeholder:'请输入图标URL（可选）', value:addForm.iconUrl, onChange:(e)=>setAddForm({...addForm, iconUrl:e.target.value})})
                      ),
                      React.createElement('div',{className:'space-y-1'},
                          React.createElement('label',{className:'text-sm font-medium text-gray-700'}, '描述'),
                          React.createElement('textarea',{className:'w-full border rounded px-3 py-2', rows:4, placeholder:'请输入工具描述（可选）', value:addForm.description, onChange:(e)=>setAddForm({...addForm, description:e.target.value})})
                      ),
                      React.createElement('div',{className:'flex items-center space-x-2 pt-2'},
                          React.createElement('input',{type:'checkbox', checked:!!addForm.isActive, onChange:(e)=>setAddForm({...addForm, isActive:e.target.checked})}),
                          React.createElement('label',{className:'text-sm font-medium text-gray-700'}, '激活')
                      )
                  ),
                  React.createElement('div',{className:'flex justify-end gap-2'},
                      React.createElement('button',{className:'px-4 py-2 rounded bg-gray-200', onClick:()=>{ setShowAdd(false); }}, '取消'),
                      React.createElement('button',{className:'px-4 py-2 rounded bg-blue-600 text-white', onClick:saveAdd}, '保存')
                  )
              )
          )),
          (showEdit && editTool && React.createElement('div',{className:'fixed inset-0 bg-black/50 flex items-center justify-center p-4'},
              React.createElement('div',{className:'bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4'},
                  React.createElement('h3',{className:'text-xl font-bold text-gray-800'}, '编辑工具'),
                  React.createElement('div',{className:'space-y-4'},
                      React.createElement('div',{className:'text-sm text-gray-500'}, `ID: ${editTool.id}`),
                      React.createElement('div',{className:'grid grid-cols-1 md:grid-cols-2 gap-4'},
                          React.createElement('div',{className:'space-y-1'},
                              React.createElement('label',{className:'text-sm font-medium text-gray-700'}, '工具名称 *'),
                              React.createElement('input',{className:'w-full border rounded px-3 py-2', placeholder:'请输入工具名称', value:editTool.toolName||'', onChange:(e)=>setEditTool({...editTool, toolName:e.target.value})})
                          ),
                          React.createElement('div',{className:'space-y-1'},
                              React.createElement('label',{className:'text-sm font-medium text-gray-700'}, 'API路径 *'),
                              React.createElement('input',{className:'w-full border rounded px-3 py-2', placeholder:'请输入API路径', value:editTool.apiPath||'', onChange:(e)=>setEditTool({...editTool, apiPath:e.target.value})})
                          ),
                          React.createElement('div',{className:'space-y-1'},
                              React.createElement('label',{className:'text-sm font-medium text-gray-700'}, '工具类型'),
                              React.createElement('select',{className:'w-full border rounded px-3 py-2', value:(editTool.type||''), onChange:(e)=>setEditTool({...editTool, type:e.target.value})},
                                  React.createElement('option',{value:''}, '请选择类型'),
                                  ...categories.map(c=>React.createElement('option',{key:c.id, value:c.id}, c.name))
                              )
                          ),
                          React.createElement('div',{className:'space-y-1'},
                              React.createElement('label',{className:'text-sm font-medium text-gray-700'}, '权限设置'),
                              React.createElement('select',{className:'w-full border rounded px-3 py-2', value:(editTool.vipAllow||'NO'), onChange:(e)=>setEditTool({...editTool, vipAllow:e.target.value})},
                                  React.createElement('option',{value:'NO'}, '所有人可用'),
                                  React.createElement('option',{value:'VIP'}, 'VIP99专享')
                              )
                          ),
                          React.createElement('div',{className:'space-y-1'},
                              React.createElement('label',{className:'text-sm font-medium text-gray-700'}, '链接方式'),
                              React.createElement('select',{className:'w-full border rounded px-3 py-2', value:(editTool.linkType||'1'), onChange:(e)=>setEditTool({...editTool, linkType:e.target.value})},
                                  React.createElement('option',{value:'1'}, '外部链接(直接跳转)'),
                                  React.createElement('option',{value:'2'}, '内部实现'),
                                  React.createElement('option',{value:'3'}, '内嵌页面'),
                                  React.createElement('option',{value:'4'}, '内嵌链接(新)')
                              )
                          )
                      ),
                      React.createElement('div',{className:'space-y-1'},
                          React.createElement('label',{className:'text-sm font-medium text-gray-700'}, '图标URL'),
                          React.createElement('input',{className:'w-full border rounded px-3 py-2', placeholder:'请输入图标URL（可选）', value:editTool.iconUrl||'', onChange:(e)=>setEditTool({...editTool, iconUrl:e.target.value})})
                      ),
                      React.createElement('div',{className:'space-y-1'},
                          React.createElement('label',{className:'text-sm font-medium text-gray-700'}, '描述'),
                          React.createElement('textarea',{className:'w-full border rounded px-3 py-2', rows:4, placeholder:'请输入工具描述（可选）', value:editTool.description||'', onChange:(e)=>setEditTool({...editTool, description:e.target.value})})
                      ),
                      React.createElement('div',{className:'flex items-center space-x-2 pt-2'},
                          React.createElement('input',{type:'checkbox', checked:!!editTool.isActive, onChange:(e)=>setEditTool({...editTool, isActive:e.target.checked})}),
                          React.createElement('label',{className:'text-sm font-medium text-gray-700'}, '激活')
                      )
                  ),
                  React.createElement('div',{className:'flex justify-end gap-2'},
                      React.createElement('button',{className:'px-4 py-2 rounded bg-gray-200', onClick:()=>{ setShowEdit(false); setEditTool(null); }}, '取消'),
                      React.createElement('button',{className:'px-4 py-2 rounded bg-blue-600 text-white', onClick:saveEdit}, '保存')
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
