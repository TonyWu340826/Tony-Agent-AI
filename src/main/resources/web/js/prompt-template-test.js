(() => {
  const { useState, useEffect, useRef } = React;
  const loadOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => s.src.includes(src))) { resolve(); return; } const tag=document.createElement('script'); tag.src=src; tag.defer=true; tag.onload=()=>resolve(); tag.onerror=(e)=>reject(e); document.head.appendChild(tag); });
  const ensureMarkdownLibs = async () => {
    const markedUrl = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    const purifyUrl = 'https://cdn.jsdelivr.net/npm/dompurify@3.0.3/dist/purify.min.js';
    await loadOnce(markedUrl); await loadOnce(purifyUrl);
  };
  const extractFinalAnswer = (text) => {
    const s = String(text||'');
    const markers = [/Final Answer[:：]\s*/i, /最终回答[:：]\s*/i, /答案[:：]\s*/i];
    for (let i=0;i<markers.length;i++) { const r = markers[i]; const m = s.match(r); if (m) return s.slice((m.index||0) + m[0].length).trim(); }
    const stripers = [/^思考过程[:：][\s\S]*?$/mi, /^Reasoning[:：][\s\S]*?$/mi];
    let cleaned = s; for (let i=0;i<stripers.length;i++) cleaned = cleaned.replace(stripers[i], '');
    return cleaned.trim();
  };
  const renderMarkdownHTML = (md) => {
    const marked = window.marked; const DOMPurify = window.DOMPurify; const raw = extractFinalAnswer(md);
    if (!marked) return String(raw||'');
    const renderer = new marked.Renderer();
    renderer.code = (code, infostring) => {
      const lang = (infostring||'').split(/\s+/)[0];
      const esc = code;
      return `<pre style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;overflow:auto;margin:12px 0;"><code class="language-${lang}">${esc}</code></pre>`;
    };
    renderer.table = (header, body) => `<div style="overflow:auto;margin:12px 0;"><table style="border-collapse:collapse;width:100%;"><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
    renderer.tablerow = (content) => `<tr>${content}</tr>`;
    renderer.tablecell = (content, flags) => {
      const tag = flags.header ? 'th' : 'td';
      const align = flags.align || 'left';
      return `<${tag} style="border:1px solid #e2e8f0;padding:8px;text-align:${align};">${content}</${tag}>`;
    };
    marked.setOptions({ breaks: true, renderer });
    const html = marked.parse(String(raw||''));
    return DOMPurify ? DOMPurify.sanitize(html) : html;
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
    const [testMsg, setTestMsg] = useState('');
    const [mdReady, setMdReady] = useState(false);
    useEffect(() => {
      const raw = (template && template.param_schema !== undefined) ? template.param_schema : (template ? template.paramSchema : undefined);
      const fromSchema = genFields(raw);
      setFields(fromSchema);
      ensureMarkdownLibs().then(()=>{ try {
        if (window.marked) {
          const renderer = new window.marked.Renderer();
          renderer.code = (code, infostring) => {
            const lang = (infostring||'').split(/\s+/)[0];
            return `<pre style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;overflow:auto;margin:12px 0;"><code class="language-${lang}">${code}</code></pre>`;
          };
          renderer.table = (header, body) => `<div style="overflow:auto;margin:12px 0;"><table style="border-collapse:collapse;width:100%;"><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
          renderer.tablerow = (content) => `<tr>${content}</tr>`;
          renderer.tablecell = (content, flags) => {
            const tag = flags.header ? 'th' : 'td'; const align = flags.align || 'left';
            return `<${tag} style="border:1px solid #e2e8f0;padding:8px;text-align:${align};">${content}</${tag}>`;
          };
          window.marked.setOptions({ gfm:true, breaks:true, mangle:false, headerIds:false, renderer });
        }
      } catch(_){} setMdReady(true); }).catch(()=>{})
    }, [template]);
    const listRef = useRef(null);
    useEffect(() => { if (listRef.current) { listRef.current.scrollTop = listRef.current.scrollHeight; } }, [chat]);
    const addThinking = () => { setChat(prev => [...prev, { role:'assistant', content:'正在思考中…', thinking:true }]); };
    const removeThinkingAndAppend = (finalContent) => {
      setChat(prev => {
        const withoutThinking = prev.filter(m => !m.thinking);
        return [...withoutThinking, { role:'assistant', content: finalContent }];
      });
    };
    const clearChat = () => { setChat([]); };
    const escapeHtml = (s) => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const handleTest = async () => {
      setError(''); setLoading(true);
      try {
        const raw = getTemplateContent(template);
        const promptText = renderWithParams(raw, params);
        const basePrompt = String(promptText||'').trim();
        if (!basePrompt) { throw new Error('请填写参数并确保提示词非空'); }
        const msg = String(testMsg||'').trim();
        setChat(prev => [...prev, { role:'user', content: msg || basePrompt }]);
        addThinking();
        const r = await fetch('/api/open/deeoSeekChat/model', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify({ prompt: basePrompt, message: msg }) });
        const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ }
        if(!r.ok) throw new Error(d.message || '测试失败');
        const reply = d.message || t || '';
        removeThinkingAndAppend(reply);
        setOutput(reply);
      } catch(e){ setError(e.message || '请求失败'); } finally { setLoading(false); }
    };
    const handleSend = async () => {
      const msg = String(userMsg||'').trim();
      if (!msg) { setError('请输入消息'); return; }
      setError(''); setLoading(true);
      try {
        setChat(prev => [...prev, { role:'user', content: msg }]);
        addThinking();
        const raw = getTemplateContent(template);
        const promptText = renderWithParams(raw, params);
        const last = (()=>{ for(let i=chat.length-1;i>=0;i--){ const m=chat[i]; if(m && m.role==='assistant' && !m.thinking) return String(m.content||''); } return ''; })();
        const combinedPrompt = last ? (promptText ? (promptText + '\n历史对话：' + last) : ('历史对话：' + last)) : (promptText || null);
        const r = await fetch('/api/open/deeoSeekChat/model', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify({ prompt: combinedPrompt, message: msg }) });
        const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ }
        if(!r.ok) throw new Error(d.message || '测试失败');
        const reply = d.message || t || '';
        removeThinkingAndAppend(reply);
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
      React.createElement('div', { className:'grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch h-full' },
        React.createElement('div', { className:'flex flex-col h-full space-y-3 md:col-span-5' },
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
          React.createElement('div', { className:'flex items-center gap-3 pt-0 mt-0' },
            React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2 w-1/2', placeholder:'请输入自定义内容', value:testMsg, onChange:e=>setTestMsg(e.target.value), onKeyDown:e=>{ if(e.key==='Enter' && !loading) handleTest(); } }),
            React.createElement('button', { className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50', disabled:loading, onClick:handleTest }, '立即测试')
          )
        ),
        React.createElement('div', { className:'flex flex-col h-full space-y-3 md:col-span-7' },
          error ? React.createElement('div', { className:'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md' }, error) : null,
          React.createElement('div', { className:'border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3 flex flex-col', style:{ maxHeight: '500px' } },
            React.createElement('div', { className:'flex items-center justify-end' },
              React.createElement('button', { className:'px-3 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200', onClick:clearChat }, '清空聊天记录')
            ),
            React.createElement('div', { className:'flex-1 overflow-y-auto space-y-3', ref:listRef, style:{ background:'#fff', borderRadius:'8px', padding:'6px' } },
              ...(chat||[]).map((m,i)=> {
                if (m.thinking) {
                  return React.createElement('div',{key:i, className:'flex items-start gap-2 justify-end'},
                    React.createElement('div',{style:{maxWidth:'72%', background:'#f3f4f6', border:'1px solid #e5e7eb', borderRadius:'16px', padding:'8px 10px', color:'#4b5563', fontStyle:'italic'}}, '正在思考中…')
                  );
                }
                const isUser = m.role==='user';
                const containerClass = isUser ? 'flex items-start gap-2' : 'flex items-start gap-2 justify-end';
                const avatar = React.createElement('div',{className:'w-7 h-7 rounded-full flex items-center justify-center '+(isUser?'bg-blue-600 text-white':'bg-slate-700 text-white')}, isUser ? '👤' : '🤖');
                const bubbleStyle = isUser
                  ? { maxWidth:'72%', color:'#1890ff', background:'#e6f4ff', border:'1px solid #bae7ff', borderRadius:'16px', padding:'8px 10px' }
                  : { maxWidth:'72%', color:'#333', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'16px', padding:'8px 10px' };
                const bubble = isUser
                  ? React.createElement('div',{style:bubbleStyle}, String(m.content||''))
                  : React.createElement('div',{style:bubbleStyle, dangerouslySetInnerHTML:{ __html: mdReady ? renderMarkdownHTML(String(m.content||'')) : escapeHtml(String(m.content||'')).replace(/\n/g,'<br/>') }});
                return React.createElement('div',{key:i, className:containerClass}, isUser ? avatar : null, bubble, !isUser ? avatar : null);
              })
            ),
            React.createElement('div', { className:'flex items-center gap-2 pt-2' },
              React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2 w-full', placeholder:'输入框', value:userMsg, onChange:e=>setUserMsg(e.target.value), onKeyDown:e=>{ if(e.key==='Enter' && !loading) handleSend(); } }),
              React.createElement('button', { className:'px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50', disabled:loading, onClick:handleSend }, '发送')
            )
          )
        )
      )
      
    );
  };
  window.Components = window.Components || {}; window.Components.PromptTemplateTest = PromptTemplateTest; window.dispatchEvent(new Event('modules:loaded'));
})();

