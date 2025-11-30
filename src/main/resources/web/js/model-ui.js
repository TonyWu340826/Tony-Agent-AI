const ModelUI = () => {
  const { useEffect, useState } = React;
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    const load = async () => {
      setLoading(true);
      try {
        const r = await fetch('/api/tools/active?type=1', { credentials:'same-origin' });
        const t = await r.text(); let d=[]; try{ d=JSON.parse(t||'[]'); }catch(_){ d=[]; }
        setList(Array.isArray(d)?d:[]);
      } catch(_){ setList([]); }
      setLoading(false);
    };
    load();
  },[]);

  const skeletons = [1,2,3,4,5,6].map(i=>React.createElement('div',{key:i,className:'h-32 bg-slate-100 animate-pulse rounded-xl'}));
  const cards = (list||[]).map(it=>React.createElement('a',{key:it.id, href:it.apiPath||'#', target:'_self', className:'block bg-white rounded-2xl p-6 shadow border hover:shadow-lg transition'},
    React.createElement('div',{className:'flex items-center gap-3'},
      (it.iconUrl ? React.createElement('img',{src:it.iconUrl, className:'w-8 h-8 rounded', alt:it.toolName}) : React.createElement('div',{className:'w-8 h-8 bg-slate-200 rounded'})),
      React.createElement('div',null,
        React.createElement('div',{className:'font-semibold text-slate-900'}, it.toolName),
        React.createElement('div',{className:'text-xs text-slate-500 truncate'}, it.description||'')
      )
    )
  ));

  return React.createElement('div',{className:'grid md:grid-cols-3 gap-6'},
    loading ? skeletons : (list.length===0 ? React.createElement('div',{className:'text-slate-600 text-sm'}, '暂无模型服务') : cards)
  );
};
window.Components = window.Components || {};
window.Components.ModelUI = ModelUI;
try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}
