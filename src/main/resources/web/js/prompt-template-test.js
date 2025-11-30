(() => {
  const { useState, useEffect } = React;
  const loadOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => s.src.includes(src))) { resolve(); return; } const tag=document.createElement('script'); tag.src=src; tag.defer=true; tag.onload=()=>resolve(); tag.onerror=(e)=>reject(e); document.head.appendChild(tag); });
  const ensureMarkdownLibs = async () => {
    const markedUrl = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    const purifyUrl = 'https://cdn.jsdelivr.net/npm/dompurify@3.0.3/dist/purify.min.js';
    await loadOnce(markedUrl); await loadOnce(purifyUrl);
  };
  const genFields = (schema) => {
    try { const obj = typeof schema === 'string' ? JSON.parse(schema||'[]') : (schema || []); if (Array.isArray(obj)) return obj; if (obj && typeof obj==='object' && obj.properties) { const req = obj.required || []; return Object.keys(obj.properties).map(k => ({ name:k, label: obj.properties[k].title || k, type: obj.properties[k].type || 'text', required: req.includes(k), ...obj.properties[k] })); } return []; } catch(_) { return []; }
  };
  const PromptTemplateTest = ({ template, onClose }) => {
    const [params, setParams] = useState({});
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fields, setFields] = useState([]);
    const [model, setModel] = useState(template?.model_type || '');
    useEffect(() => { setFields(genFields(template?.param_schema)); ensureMarkdownLibs().catch(()=>{}); }, [template]);
    const handleTest = async () => {
      setError(''); setLoading(true); setOutput('');
      try {
        const payload = { templateId: template?.id, model_type: model || template?.model_type, role_type: template?.role_type, params };
        const r = await fetch('/api/prompt/admin/templates/test', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify(payload) });
        const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){}
        if(!r.ok) throw new Error(d.message || '测试失败');
        setOutput(d.output || t || '');
      } catch(e){ setError(e.message || '请求失败'); } finally { setLoading(false); }
    };
    const renderField = (f) => {
      const v = params[f.name] ?? (f.default ?? '');
      const set = (val) => setParams({ ...params, [f.name]: val });
      if (f.type==='boolean') return React.createElement('label', { className:'flex items-center gap-2' }, React.createElement('input', { type:'checkbox', checked: !!v, onChange:e=>set(e.target.checked) }), React.createElement('span', null, f.label||f.name));
      if (f.type==='number') return React.createElement('div', { className:'space-y-1' }, React.createElement('div', { className:'text-sm text-gray-700' }, f.label||f.name), React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2 w-full', type:'number', value:v, onChange:e=>set(e.target.value?Number(e.target.value):'') }));
      if (f.type==='select' && Array.isArray(f.options)) return React.createElement('div', { className:'space-y-1' }, React.createElement('div', { className:'text-sm text-gray-700' }, f.label||f.name), React.createElement('select', { className:'border border-gray-300 rounded-lg px-3 py-2 w-full', value:v, onChange:e=>set(e.target.value) }, ...f.options.map(op => React.createElement('option', { key:op.value ?? op, value:op.value ?? op }, op.label ?? String(op)))));
      const rows = Math.min(6, Math.max(2, (f.maxLength||0) > 80 ? 4 : 3));
      return React.createElement('div', { className:'space-y-1' }, React.createElement('div', { className:'text-sm text-gray-700' }, f.label||f.name), React.createElement('textarea', { className:'border border-gray-300 rounded-lg px-3 py-2 w-full', rows, value:v, onChange:e=>set(e.target.value), placeholder:f.placeholder || '' }));
    };
    return React.createElement('div', { className:'grid grid-cols-1 md:grid-cols-2 gap-4' },
      React.createElement('div', { className:'space-y-3' },
        React.createElement('div', { className:'text-sm text-gray-700' }, '模型选择'),
        React.createElement('select', { className:'border border-gray-300 rounded-lg px-3 py-2 w-full', value:model, onChange:e=>setModel(e.target.value) },
          ...['', 'gpt-4o','deepseek-chat','glm-4','claude-3','qwen-2'].map(m => React.createElement('option', { key:m, value:m }, m ? m.toUpperCase() : '跟随模板'))
        ),
        React.createElement('div', { className:'text-sm text-gray-700' }, '参数输入'),
        React.createElement('div', { className:'space-y-2' }, ...(fields||[]).map(f => React.createElement('div', { key:f.name }, renderField(f))))
      ),
      React.createElement('div', { className:'space-y-3' },
        error ? React.createElement('div', { className:'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md' }, error) : null,
        React.createElement('div', { className:'flex gap-2' },
          React.createElement('button', { className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50', disabled:loading, onClick:handleTest }, '立即测试'),
          React.createElement('button', { className:'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick:()=>onClose && onClose() }, '关闭')
        ),
        React.createElement('div', { className:'border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[20rem]' },
          React.createElement('div', { dangerouslySetInnerHTML:{ __html: (window.DOMPurify && window.marked) ? window.DOMPurify.sanitize(window.marked.parse(output || '')) : (output || '') } })
        )
      )
    );
  };
  window.Components = window.Components || {}; window.Components.PromptTemplateTest = PromptTemplateTest; window.dispatchEvent(new Event('modules:loaded'));
})();

