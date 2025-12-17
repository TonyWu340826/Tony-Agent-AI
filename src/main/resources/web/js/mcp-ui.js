const MCPUI = ({ currentUser } = {}) => {
  const { useEffect, useState } = React;
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState(currentUser || null);
  useEffect(()=>{
    const load = async () => {
      setLoading(true);
      try {
        const r = await fetch('/api/tools/active?type=10000', { credentials:'same-origin' });
        const t = await r.text(); let d=[]; try{ d=JSON.parse(t||'[]'); }catch(_){ d=[]; }
        setList(Array.isArray(d)?d:[]);
      } catch(_){ setList([]); }
      setLoading(false);
    };
    load();
  },[]);

  useEffect(()=>{
    try { if (currentUser) setMe(currentUser); } catch(_) {}
  }, [currentUser]);

  useEffect(()=>{
    const loadMe = async () => {
      try {
        if (me) return;
        if (window.__currentUser) { setMe(window.__currentUser); return; }
      } catch(_) {}
      try {
        const r = await fetch('/api/auth/user', { credentials:'same-origin' });
        const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
        if(d && d.user){ setMe(d.user); try{ window.__currentUser = d.user; }catch(_){ } } else { setMe(null); }
      } catch(_) { setMe(null); }
    };
    loadMe();
  },[me]);

  const isVip99User = !!(me && Number(me.vipLevel)===99);
  const isLoggedIn = !!me;
  const isIqTai = (it) => {
    const name = String((it && it.toolName) || '').toLowerCase();
    const path = String((it && it.apiPath) || (it && it.url) || '').toLowerCase();
    return name.includes('iqtai') || path.includes('iqtai');
  };
  const handleOpen = (e, it) => {
    try { if(e && e.preventDefault) e.preventDefault(); } catch(_) {}
    if (!isLoggedIn) { alert('请先登录后使用'); return; }
    if (!isVip99User) {
      if (isIqTai(it)) { alert('该功能仅限会员可用'); return; }
      alert('该功能为VIP99专享，请升级为VIP后使用');
      return;
    }
    const url = (it && (it.apiPath || it.url)) || '#';
    if (url && url !== '#') { try { window.location.assign(url); } catch(_) {} }
  };

  const skeletons = [1,2,3,4,5,6].map(i=>React.createElement('div',{key:i,className:'h-28 bg-slate-100 animate-pulse rounded-xl'}));
  const cards = (list||[]).map(it=>React.createElement('div',{key:it.id, className:'bg-white rounded-2xl p-5 shadow border'},
    React.createElement('div',{className:'flex items-center gap-3'},
      (it.iconUrl ? React.createElement('img',{src:it.iconUrl, className:'w-8 h-8 rounded', alt:it.toolName}) : React.createElement('div',{className:'w-8 h-8 bg-slate-200 rounded'})),
      React.createElement('div',{className:'font-semibold text-slate-900 flex items-center gap-2'},
        it.toolName,
        React.createElement('span',{className:'inline-block px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-700 border border-amber-200'}, isVip99User ? 'VIP可用' : 'VIP99')
      )
    ),
    React.createElement('div',{className:'text-xs text-slate-500 mt-1 truncate'}, it.description||''),
    React.createElement('div',{className:'mt-3'},
      React.createElement('a',{
        href:(it.apiPath||'#'),
        target:'_self',
        onClick:(e)=>handleOpen(e,it),
        className:'inline-block px-3 py-1 rounded bg-indigo-600 text-white text-xs'
      }, '打开（VIP99）')
    )
  ));

  return React.createElement('div',{className:'grid md:grid-cols-3 gap-6'},
    loading ? skeletons : (list.length===0 ? React.createElement('div',{className:'text-slate-600 text-sm'}, '暂无 MCP 工具') : cards)
  );
};
window.Components = window.Components || {};
window.Components.MCPUI = MCPUI;
try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}
