(() => {
  const { useState, useEffect, useRef } = React;
  const loadOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => s.src.includes(src))) { resolve(); return; } const tag=document.createElement('script'); tag.src=src; tag.defer=true; tag.onload=()=>resolve(); tag.onerror=(e)=>reject(e); document.head.appendChild(tag); });
  const ensureMarkdownLibs = async () => {
    const markedUrl = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    const purifyUrl = 'https://cdn.jsdelivr.net/npm/dompurify@3.0.3/dist/purify.min.js';
    await loadOnce(markedUrl); await loadOnce(purifyUrl);
  };
  const genFields = (schema) => {
    try {
      const obj = typeof schema === 'string' ? JSON.parse(schema||'[]') : (schema || []);
      if (Array.isArray(obj)) return obj.map(it => ({ name: it.name || it.key || '', label: it.label || it.name || it.key || '', type: it.type || 'string', note: it.note || '' }));
      return [];
    } catch(_) { return []; }
  };
  const renderPrompt = (tpl, params) => {
    const s = String(tpl||'');
    const re = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}}|\{\s*([a-zA-Z0-9_.-]+)\s*\}/g;
    return s.replace(re, (_,a,b)=>{ const key = a||b; const val = params && Object.prototype.hasOwnProperty.call(params,key) ? params[key] : ''; return String(val??''); });
  };
  const renderWithParams = (templateContent, paramValues) => {
    return renderPrompt(templateContent, paramValues);
  };
  const getTemplateContent = (tpl) => {
    if (!tpl) return '';
    const txt = tpl.template_content ?? tpl.templateContent ?? '';
    return String(txt || '');
  };
  const PromptTemplateTest = ({ template, onClose }) => {
    const [params, setParams] = useState({});
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fields, setFields] = useState([]);
    const [chat, setChat] = useState([]);
    const [userMsg, setUserMsg] = useState('');
    useEffect(() => {
      const raw = (template && template.param_schema !== undefined) ? template.param_schema : (template ? template.paramSchema : undefined);
      const fromSchema = genFields(raw);
      setFields(fromSchema);
      ensureMarkdownLibs().catch(()=>{});
    }, [template]);
    const listRef = useRef(null);
    useEffect(() => { if (listRef.current) { listRef.current.scrollTop = listRef.current.scrollHeight; } }, [chat]);
    const handleTest = async () => {
      setError(''); setLoading(true);
      try {
        const raw = getTemplateContent(template);
        const promptText = renderWithParams(raw, params);
        const msg = String(promptText||'').trim();
        if (!msg) { throw new Error('请填写参数并确保提示词非空'); }
        const r = await fetch('/api/open/deeoSeekChat/model', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify({ message: msg }) });
        const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ }
        if(!r.ok) throw new Error(d.message || '测试失败');
        const reply = d.message || t || '';
        const next = [...chat];
        next.push({ role:'user', content: msg });
        next.push({ role:'assistant', content: reply });
        setChat(next);
        setOutput(reply);
      } catch(e){ setError(e.message || '请求失败'); } finally { setLoading(false); }
    };
    const handleSend = async () => {
      const msg = String(userMsg||'').trim();
      if (!msg) { setError('请输入消息'); return; }
      setError(''); setLoading(true);
      try {
        const r = await fetch('/api/open/deeoSeekChat/model', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify({ message: msg }) });
        const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ }
        if(!r.ok) throw new Error(d.message || '测试失败');
        const reply = d.message || t || '';
        const next = [...chat];
        next.push({ role:'user', content: msg });
        next.push({ role:'assistant', content: reply });
        setChat(next);
        setUserMsg('');
        setOutput(reply);
      } catch(e){ setError(e.message || '请求失败'); } finally { setLoading(false); }
    };
    const renderInputCell = (f) => {
      const v = params[f.name] ?? '';
      const set = (val) => setParams({ ...params, [f.name]: val });
      if (f.type==='number') return React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2 text-base w-full', type:'number', value:v, onChange:e=>set(e.target.value?Number(e.target.value):'') });
      if (f.type==='boolean') return React.createElement('input', { type:'checkbox', checked:!!v, onChange:e=>set(e.target.checked) });
      if (f.type==='select' && Array.isArray(f.options)) return React.createElement('select', { className:'border border-gray-300 rounded-lg px-3 py-2 text-base w-full', value:v, onChange:e=>set(e.target.value) }, ...f.options.map(op => React.createElement('option', { key:op.value ?? op, value:op.value ?? op }, op.label ?? String(op))));
      return React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2 text-base w-full', value:v, onChange:e=>set(e.target.value) });
    };
    return React.createElement('div', { className:'space-y-3', style:{ maxHeight:'65vh' } },
      React.createElement('div', { className:'grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch h-full' },
        React.createElement('div', { className:'flex flex-col h-full space-y-3' },
          React.createElement('div', { className:'text-sm text-gray-700' }, '参数输入'),
          React.createElement('div', { className:'border border-gray-200 rounded-lg overflow-y-auto', style:{ maxHeight: '380px' } },
            React.createElement('table', { className:'w-full text-base' },
              React.createElement('thead', null,
                React.createElement('tr', { className:'bg-gray-50 text-gray-700' },
                  React.createElement('th', { className:'px-3 py-2 text-left' }, '属性'),
                  React.createElement('th', { className:'px-3 py-2 text-left' }, '类型'),
                  React.createElement('th', { className:'px-3 py-2 text-left' }, '名称'),
                  React.createElement('th', { className:'px-3 py-2 text-left' }, '输入值')
                )
              ),
              React.createElement('tbody', null,
                ...(fields||[]).map((f,i)=> React.createElement('tr', { key:f.name||i, className:'border-t border-gray-200' },
                  React.createElement('td', { className:'px-3 py-2 font-mono text-gray-800' }, f.name || ''),
                  React.createElement('td', { className:'px-3 py-2 text-gray-600 uppercase' }, String(f.type||'string')),
                  React.createElement('td', { className:'px-3 py-2 text-gray-800' }, f.label || ''),
                  React.createElement('td', { className:'px-3 py-2' }, renderInputCell(f))
                ))
              )
            )
          ),
          null
        ),
        React.createElement('div', { className:'flex flex-col h-full space-y-3' },
          error ? React.createElement('div', { className:'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md' }, error) : null,
          React.createElement('div', { className:'border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3 flex flex-col', style:{ maxHeight: '500px' } },
            React.createElement('div', { className:'flex-1 overflow-y-auto space-y-2', ref:listRef },
              ...(chat||[]).map((m,i)=> React.createElement('div',{key:i, className: m.role==='user' ? 'text-sm bg-blue-50 border border-blue-200 rounded-lg p-2' : 'text-sm bg-gray-100 border border-gray-200 rounded-lg p-2'}, React.createElement('div',{dangerouslySetInnerHTML:{ __html: (window.DOMPurify && window.marked) ? window.DOMPurify.sanitize(window.marked.parse(String(m.content||''))) : String(m.content||'') }})))
            ),
            React.createElement('div', { className:'flex items-center gap-2 pt-2' },
              React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2 w-full', placeholder:'输入框', value:userMsg, onChange:e=>setUserMsg(e.target.value), onKeyDown:e=>{ if(e.key==='Enter' && !loading) handleSend(); } }),
              React.createElement('button', { className:'px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50', disabled:loading, onClick:handleSend }, '发送')
            )
          )
        )
      )
      , React.createElement('div', { className:'flex items-center gap-3 pt-0 mt-0' },
        React.createElement('button', { className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50', disabled:loading, onClick:handleTest }, '立即测试')
      )
    );
  };
  window.Components = window.Components || {}; window.Components.PromptTemplateTest = PromptTemplateTest; window.dispatchEvent(new Event('modules:loaded'));
})();

