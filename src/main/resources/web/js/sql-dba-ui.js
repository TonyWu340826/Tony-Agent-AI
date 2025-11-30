const SqlDbaUI = () => {
  const { useState, useMemo } = React;

  const parseTables = (raw) => {
    try {
      const t = (raw||'').trim();
      if (!t) return [];
      try { const j = JSON.parse(t); if (Array.isArray(j)) { return j.map(x=>x.name||x.table||x).filter(Boolean); } } catch(_) {}
      const names = new Set();
      const re = /(CREATE\s+TABLE\s+`?(\w+)`?|\n\s*table\s*:\s*(\w+)|\b(t_[a-zA-Z0-9_]+)\b)/ig;
      let m; while ((m = re.exec(t))){ const n = m[2]||m[3]||m[4]; if(n) names.add(n); }
      return [...names];
    } catch(_){ return []; }
  };

  const [raw, setRaw] = useState('');
  const tables = useMemo(()=>parseTables(raw), [raw]);
  const [selected, setSelected] = useState([]);
  const [need, setNeed] = useState('');
  const [sql, setSql] = useState('');
  const [loading, setLoading] = useState(false);

  const toggle = (name) => setSelected(prev => prev.includes(name) ? prev.filter(x=>x!==name) : [...prev, name]);

  const gen = async () => {
    const prompt = (need||'').trim(); if(!prompt){ alert('请输入SQL需求'); return; }
    setLoading(true); setSql('');
    try {
      const body = { user_prompt: prompt, selected_tables: selected, table_structures: raw ? [raw] : [] };
      const r = await fetch('/api/open/sql/dba', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) });
      const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
      setSql(d.sql||d.response||d.message||'');
    } catch(_) { setSql(''); alert('生成失败'); }
    setLoading(false);
  };

  const TableCard = ({ name }) => (
    React.createElement('div',{className:'border rounded-xl p-3 hover:shadow-sm transition'},
      React.createElement('label',{className:'flex items-center gap-2'},
        React.createElement('input',{type:'checkbox', checked:selected.includes(name), onChange:()=>toggle(name)}),
        React.createElement('span',{className:'font-medium text-slate-900'}, name)
      )
    )
  );

  return (
    React.createElement('div',{className:'grid grid-cols-12 gap-6'},
      React.createElement('aside',{className:'col-span-12 md:col-span-3'},
        React.createElement('div',{className:'bg-white rounded-2xl shadow border p-3 space-y-2'},
          React.createElement('div',{className:'font-semibold text-slate-900'}, '选择表'),
          tables.length===0 ? React.createElement('div',{className:'text-xs text-slate-500'}, '请在右侧粘贴表结构，并点击解析')
          : React.createElement('div',{className:'space-y-2'}, tables.map(n=>React.createElement(TableCard,{key:n,name:n})))
        )
      ),
      React.createElement('section',{className:'col-span-12 md:col-span-9'},
        React.createElement('div',{className:'bg-white rounded-2xl shadow border p-6 space-y-4'},
          React.createElement('h2',{className:'text-2xl font-bold text-slate-900 flex items-center gap-2'}, 'SQL 智能生成与执行助手'),
          React.createElement('details', null,
            React.createElement('summary', {className:'cursor-pointer text-sm text-slate-700'}, '表结构详情（点击展开）'),
            React.createElement('pre',{className:'bg-slate-50 border rounded-lg p-3 text-xs whitespace-pre-wrap break-all'}, raw||'')
          ),
          React.createElement('div',{className:'space-y-2'},
            React.createElement('label',{className:'text-sm text-slate-700'}, '粘贴/上传表结构'),
            React.createElement('textarea',{className:'w-full border border-slate-300 rounded-lg px-3 py-2', rows:8, placeholder:'支持粘贴 DDL 或 JSON 表结构', value:raw, onChange:(e)=>setRaw(e.target.value)}),
            React.createElement('div',{className:'flex items-center gap-2'},
              React.createElement('button',{className:'px-3 py-2 bg-slate-100 text-slate-700 rounded', onClick:()=>{}}, '解析'),
              React.createElement('span',{className:'text-xs text-slate-500'}, `已解析 ${tables.length} 张表`)
            )
          ),
          React.createElement('div',{className:'space-y-2'},
            React.createElement('label',{className:'text-sm text-slate-700'}, '请输入你的 SQL 需求（例如：查询所有用户的姓名和年龄）'),
            React.createElement('textarea',{className:'w-full border border-slate-300 rounded-lg px-3 py-2', rows:4, placeholder:'描述你的查询需求', value:need, onChange:(e)=>setNeed(e.target.value)})
          ),
          React.createElement('div',{className:'flex items-center gap-3'},
            React.createElement('button',{className:'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50', disabled:loading, onClick:gen}, loading?'生成中…':'生成 SQL'),
            React.createElement('span',{className:'text-xs text-slate-500'}, selected.length>0?`已选择：${selected.join(', ')}`:'')
          ),
          React.createElement('div',null,
            React.createElement('label',{className:'text-sm text-slate-700'}, '生成结果'),
            React.createElement('pre',{className:'bg-black text-green-200 rounded-lg p-3 text-xs whitespace-pre-wrap break-words min-h-[6rem]'}, sql||'')
          )
        )
      )
    )
  );
};

window.Components = window.Components || {};
window.Components.SqlDbaUI = SqlDbaUI;
try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}

