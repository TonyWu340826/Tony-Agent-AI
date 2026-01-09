 (function(){
  const { useEffect, useMemo, useRef, useState } = React;

  const cx = (...xs) => xs.filter(Boolean).join(' ');

  const api = {
    async me(){
      const r = await fetch('/api/auth/user', { credentials:'same-origin', cache:'no-store' });
      const t = await r.text();
      let d = {}; try { d = JSON.parse(t||'{}'); } catch(_) { d = {}; }
      if (!r.ok || d.success === false) throw new Error((d && d.message) || '未登录');
      return d.user;
    },
    async listSpaces(){
      const r = await fetch('/api/vector/spaces', { credentials:'same-origin', cache:'no-store' });
      const t = await r.text();
      let d = {}; try { d = JSON.parse(t||'{}'); } catch(_) { d = {}; }
      if (!r.ok || d.success === false) throw new Error((d && d.message) || '加载空间失败');
      return d.data || [];
    },
    async createSpace(payload){
      const r = await fetch('/api/vector/spaces', { method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload||{}) });
      const t = await r.text();
      let d = {}; try { d = JSON.parse(t||'{}'); } catch(_) { d = {}; }
      if (!r.ok || d.success === false) throw new Error((d && d.message) || '创建空间失败');
      return d.data;
    },
    async listDocs(spaceId){
      const r = await fetch(`/api/vector/spaces/${spaceId}/documents`, { credentials:'same-origin', cache:'no-store' });
      const t = await r.text();
      let d = {}; try { d = JSON.parse(t||'{}'); } catch(_) { d = {}; }
      if (!r.ok || d.success === false) throw new Error((d && d.message) || '加载文档失败');
      return d.data || [];
    },
    async getDoc(docId){
      const r = await fetch(`/api/vector/documents/${docId}`, { credentials:'same-origin', cache:'no-store' });
      const t = await r.text();
      let d = {}; try { d = JSON.parse(t||'{}'); } catch(_) { d = {}; }
      if (!r.ok || d.success === false) throw new Error((d && d.message) || '获取文档失败');
      return d.data;
    },
    async deleteDoc(docId){
      const r = await fetch(`/api/vector/documents/${docId}`, { method:'DELETE', credentials:'same-origin' });
      const t = await r.text();
      let d = {}; try { d = JSON.parse(t||'{}'); } catch(_) { d = {}; }
      if (!r.ok || d.success === false) throw new Error((d && d.message) || '删除失败');
      return true;
    },
    async upload(spaceId, file, request){
      const form = new FormData();
      form.append('file', file);
      if (request) {
        form.append('request', JSON.stringify(request));
      }
      const r = await fetch(`/api/vector/spaces/${spaceId}/documents`, { method:'POST', credentials:'same-origin', body: form });
      const t = await r.text();
      let d = {}; try { d = JSON.parse(t||'{}'); } catch(_) { d = {}; }
      if (!r.ok || d.success === false) throw new Error((d && d.message) || '上传失败');
      return d.data;
    },
    async chat(orgCode, message, docType){
      const payload = { message, model: 'text-embedding-v4', orgCode };
      if (docType) payload.docType = docType;
      const r = await fetch('/api/document/milvus/search', { method:'POST', credentials:'same-origin', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
      const t = await r.text();
      if (!r.ok) throw new Error('问答失败');
      return t;
    }
  };

  const parseProcess = (v) => {
    if (!v) return null;
    if (typeof v === 'object') return v;
    try { return JSON.parse(v); } catch(_) { return null; }
  };

  const Steps = ({ process }) => {
    const order = [
      { key:'upload', name:'上传' },
      { key:'read', name:'读取' },
      { key:'split', name:'切分' },
      { key:'group', name:'分组' },
      { key:'embed', name:'嵌入' },
      { key:'save', name:'保存' }
    ];
    const p = process || {};

    const statusOf = (k) => {
      const st = p[k] || {};
      if (st.ok === true) return 'done';
      if (st.ok === false) return 'fail';
      return 'todo';
    };

    const cls = (st) => {
      if (st === 'done') return { ring:'border-emerald-200 bg-emerald-50', dot:'bg-emerald-600 text-white', text:'text-emerald-700' };
      if (st === 'fail') return { ring:'border-rose-200 bg-rose-50', dot:'bg-rose-600 text-white', text:'text-rose-700' };
      return { ring:'border-slate-200 bg-white', dot:'bg-slate-100 text-slate-600', text:'text-slate-600' };
    };

    const icon = (st, idx) => {
      if (st === 'done') return React.createElement('svg', { className:'w-3.5 h-3.5', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'3', strokeLinecap:'round', strokeLinejoin:'round' },
        React.createElement('path', { d:'M20 6 9 17l-5-5' })
      );
      if (st === 'fail') return React.createElement('svg', { className:'w-3.5 h-3.5', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'3', strokeLinecap:'round', strokeLinejoin:'round' },
        React.createElement('path', { d:'M18 6 6 18' }),
        React.createElement('path', { d:'M6 6 18 18' })
      );
      return String(idx + 1);
    };

    return React.createElement('div', { className:'w-full' },
      React.createElement('div', { className:'grid grid-cols-3 md:grid-cols-6 gap-2' },
        order.map((s, idx) => {
          const st = statusOf(s.key);
          const c = cls(st);
          const showArrow = idx < order.length - 1;
          return React.createElement('div', { key:s.key, className:`relative flex items-center gap-2 rounded-2xl border ${c.ring} px-3 py-2` },
            React.createElement('div', { className:`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${c.dot}` }, icon(st, idx)),
            React.createElement('div', { className:`text-sm font-semibold ${c.text}` }, s.name),
            showArrow ? React.createElement('span', { className:'absolute -right-2 top-1/2 -translate-y-1/2 text-slate-300 font-extrabold hidden md:inline' }, '>') : null
          );
        })
      )
    );
  };

  const SpacePicker = ({ spaces, activeId, onSelect, onCreate }) => {
    return React.createElement('div', { className:'space-y-3' },
      React.createElement('div', { className:'flex items-center justify-between' },
        React.createElement('div', { className:'text-sm font-bold text-slate-900' }, '空间'),
        React.createElement('button', { className:'px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700', onClick:onCreate }, '创建空间')
      ),
      spaces.length === 0
        ? React.createElement('div', { className:'text-sm text-slate-500' }, '暂无空间，请先创建')
        : React.createElement('div', { className:'space-y-2' },
          spaces.map(s => React.createElement('button', {
            key: s.id,
            className: `w-full text-left px-3 py-2 rounded-xl border ${String(activeId)===String(s.id) ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`,
            onClick: () => onSelect(s)
          },
            React.createElement('div', { className:'text-sm font-semibold text-slate-900' }, s.name || s.orgCode),
            React.createElement('div', { className:'text-xs text-slate-500 mt-0.5 break-all' }, s.orgCode)
          ))
        )
    );
  };

  const SpaceListPage = ({ user, spaces, onEnterSpace, onCreate }) => {
    const total = Array.isArray(spaces) ? spaces.length : 0;
    return React.createElement('div', { className:'max-w-6xl mx-auto' },
      React.createElement('div', { className:'bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl p-6' },
        React.createElement('div', { className:'flex items-start justify-between gap-4' },
          React.createElement('div', null,
            React.createElement('div', { className:'text-2xl font-extrabold text-white tracking-tight' }, '智能知识库'),
            React.createElement('div', { className:'text-sm text-slate-400 mt-1' }, '创建空间 · 上传文档 · 选择范围 · 开始对话'),
            React.createElement('div', { className:'mt-4 flex flex-wrap items-center gap-2' },
              React.createElement('span', { className:'inline-flex items-center gap-2 text-xs font-semibold text-slate-200 bg-white/5 border border-white/10 rounded-full px-3 py-1.5' },
                React.createElement('span', { className:'w-2 h-2 rounded-full bg-indigo-500' }),
                React.createElement('span', null, `空间 ${total}`)
              ),
              React.createElement('span', { className:'inline-flex items-center gap-2 text-xs font-semibold text-slate-200 bg-white/5 border border-white/10 rounded-full px-3 py-1.5' },
                React.createElement('span', { className:'w-2 h-2 rounded-full bg-emerald-500' }),
                React.createElement('span', null, '支持 pdf/docx/txt/md')
              ),
              React.createElement('span', { className:'inline-flex items-center gap-2 text-xs font-semibold text-slate-200 bg-white/5 border border-white/10 rounded-full px-3 py-1.5' },
                React.createElement('span', { className:'w-2 h-2 rounded-full bg-blue-500' }),
                React.createElement('span', null, '可指定单文档问答')
              )
            )
          ),
          React.createElement('button', { className:'px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition', onClick:onCreate }, '创建空间')
        ),
        React.createElement('div', { className:'mt-6' },
          spaces.length === 0
            ? React.createElement('div', { className:'rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-sm' },
                React.createElement('div', { className:'mx-auto w-14 h-14 rounded-2xl bg-white/5 shadow flex items-center justify-center border border-white/10' },
                  React.createElement('svg', { className:'w-7 h-7 text-indigo-400', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round' },
                    React.createElement('path', { d:'M12 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z' })
                  )
                ),
                React.createElement('div', { className:'mt-4 text-base font-bold text-white' }, '还没有空间'),
                React.createElement('div', { className:'mt-1 text-sm text-slate-400' }, '创建一个空间来管理你的文档并进行知识库问答'),
                React.createElement('button', { className:'mt-5 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700', onClick:onCreate }, '立即创建')
              )
            : React.createElement('div', { className:'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' },
                spaces.map(s => React.createElement('button', {
                  key: s.id,
                  className:'group text-left rounded-3xl border border-white/10 bg-white/5 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all overflow-hidden',
                  onClick: ()=>onEnterSpace(s)
                },
                  React.createElement('div', { className:'h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 relative' },
                    React.createElement('div', { className:'absolute inset-0 opacity-20', style:{ backgroundImage:'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.9), transparent 60%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.7), transparent 55%)' } }),
                    React.createElement('div', { className:'absolute bottom-3 left-4 flex items-center gap-2' },
                      React.createElement('div', { className:'w-9 h-9 rounded-2xl bg-white/15 border border-white/25 backdrop-blur flex items-center justify-center' },
                        React.createElement('svg', { className:'w-5 h-5 text-white', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round' },
                          React.createElement('path', { d:'M3 7h6l2 2h10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z' })
                        )
                      ),
                      React.createElement('div', { className:'text-white font-bold text-sm' }, 'Space')
                    )
                  ),
                  React.createElement('div', { className:'p-4' },
                    React.createElement('div', { className:'text-base font-extrabold text-white truncate' }, s.name || '未命名空间'),
                    React.createElement('div', { className:'text-xs text-slate-400 mt-1 break-all line-clamp-2' }, s.orgCode),
                    React.createElement('div', { className:'mt-3 inline-flex items-center gap-2 text-xs font-semibold text-cyan-200 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1' },
                      React.createElement('span', { className:'w-1.5 h-1.5 rounded-full bg-indigo-600' }),
                      React.createElement('span', { className:'group-hover:underline' }, '进入空间')
                    )
                  )
                ))
              )
        )
      )
    );
  };

  const SpaceDetailHeader = ({ space, onBack }) => {
    return React.createElement('div', { className:'rounded-3xl border border-white/10 bg-white/5 shadow-sm overflow-hidden' },
      React.createElement('div', { className:'p-4 bg-white/5 border-b border-white/10 flex items-start justify-between gap-3' },
        React.createElement('div', null,
          React.createElement('div', { className:'text-base font-extrabold text-white' }, space ? (space.name || '未命名空间') : ''),
          React.createElement('div', { className:'text-xs text-slate-400 mt-1 break-all' }, space ? space.orgCode : '')
        ),
        React.createElement('button', { className:'px-3 py-2 rounded-2xl bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10 text-sm shadow-sm', onClick:onBack }, '返回')
      )
    );
  };

  const CreateSpaceModal = ({ open, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    useEffect(()=>{ if(open){ setName(''); setDesc(''); } }, [open]);
    if (!open) return null;
    return React.createElement('div', { className:'fixed inset-0 z-[1000] bg-black/40 flex items-center justify-center p-4', onClick:onClose },
      React.createElement('div', { className:'bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4', onClick:(e)=>e.stopPropagation() },
        React.createElement('div', { className:'text-lg font-extrabold text-slate-900' }, '创建空间'),
        React.createElement('input', { className:'w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200', placeholder:'空间名称', value:name, onChange:e=>setName(e.target.value) }),
        React.createElement('textarea', { className:'w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200', placeholder:'描述（可选）', rows:3, value:desc, onChange:e=>setDesc(e.target.value) }),
        React.createElement('div', { className:'flex justify-end gap-2' },
          React.createElement('button', { className:'px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200', onClick:onClose }, '取消'),
          React.createElement('button', { className:'px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700', onClick:()=>onSubmit({ name, description: desc }) }, '创建')
        )
      )
    );
  };

  const ChatPanel = ({ orgCode, docs }) => {
    const [input, setInput] = useState('');
    const [busy, setBusy] = useState(false);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [messages, setMessages] = useState([
      { role:'assistant', content:'您好，我是智能知识库助手。请先上传文档，然后向我提问。' }
    ]);
    const bottomRef = useRef(null);
    const pickRef = useRef(null);

    useEffect(()=>{ try { bottomRef.current && bottomRef.current.scrollIntoView({ behavior:'smooth' }); } catch(_) {} }, [messages]);

    useEffect(()=>{
      const onDown = (e) => {
        try {
          const t = e.target;
          if (pickRef.current && pickRef.current.contains(t)) return;
          setPickerOpen(false);
        } catch(_) {
          setPickerOpen(false);
        }
      };
      document.addEventListener('mousedown', onDown);
      document.addEventListener('touchstart', onDown);
      return () => {
        document.removeEventListener('mousedown', onDown);
        document.removeEventListener('touchstart', onDown);
      };
    }, []);

    const send = async () => {
      const v = (input || '').trim();
      if (!v || !orgCode) return;

      const list = Array.isArray(docs) ? docs : [];
      if (list.length === 0) {
        setInput('');
        setMessages(prev => [...prev, { role:'user', content:v }, { role:'assistant', content:'该空间暂无文档数据，无法进行智能问答' }]);
        return;
      }

      setInput('');
      setMessages(prev => [...prev, { role:'user', content:v }, { role:'assistant', content:'正在检索…', pending:true }]);
      setBusy(true);
      try {
        const respText = await api.chat(orgCode, v, (selectedDoc && selectedDoc.docType) ? selectedDoc.docType : undefined);
        setMessages(prev => {
          const next = prev.slice();
          const idx = next.findIndex(m => m.pending);
          if (idx >= 0) next[idx] = { role:'assistant', content: respText };
          return next;
        });
      } catch(e) {
        setMessages(prev => {
          const next = prev.slice();
          const idx = next.findIndex(m => m.pending);
          if (idx >= 0) next[idx] = { role:'assistant', content: e.message || '请求失败' };
          return next;
        });
      } finally {
        setBusy(false);
      }
    };

    const hasDocs = (Array.isArray(docs) ? docs : []).length > 0;

    return React.createElement('div', { className:'h-full flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden' },
      React.createElement('div', { className:'px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-white to-indigo-50 flex items-center justify-between gap-3' },
        React.createElement('div', null,
          React.createElement('div', { className:'font-extrabold text-slate-900 tracking-tight' }, '智能问答'),
          React.createElement('div', { className:'mt-0.5 text-xs text-slate-500' }, selectedDoc ? '范围：单文档' : '范围：全部文档')
        ),
        React.createElement('div', { className:'flex items-center gap-2' },
          selectedDoc ? React.createElement('div', { className:'hidden sm:flex items-center gap-2 max-w-[420px] px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-800 text-xs font-semibold' },
            React.createElement('span', { className:'w-2 h-2 rounded-full bg-indigo-600' }),
            React.createElement('span', { className:'truncate' }, selectedDoc.fileName || selectedDoc.docType || '已选择文档'),
            React.createElement('button', { className:'ml-1 text-indigo-700 hover:text-indigo-900', onClick:()=>setSelectedDoc(null), title:'清除' }, '×')
          ) : null
        )
      ),
      React.createElement('div', { className:'flex-1 min-h-0 overflow-auto p-4 space-y-3 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.08),transparent_45%),radial-gradient(circle_at_90%_0%,rgba(59,130,246,0.08),transparent_40%),linear-gradient(to_bottom,rgba(248,250,252,1),rgba(249,250,251,1))]' },
        messages.map((m, i) => React.createElement('div', { key:i, className:cx('flex items-end gap-2', m.role==='user' ? 'justify-end' : 'justify-start') },
          m.role === 'assistant'
            ? React.createElement('div', { className:'w-7 h-7 rounded-2xl bg-white border border-slate-200 shadow-sm grid place-items-center text-xs font-extrabold text-indigo-700' }, 'AI')
            : null,
          React.createElement('div', { className:cx('max-w-[86%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm', m.role==='user' ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-md' : 'bg-white text-slate-900 border border-slate-200 rounded-bl-md') }, m.content),
          m.role === 'user'
            ? React.createElement('div', { className:'w-7 h-7 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white grid place-items-center text-[10px] font-extrabold' }, '我')
            : null
        )),
        (!orgCode || !hasDocs) ? React.createElement('div', { className:'mt-2 text-xs text-slate-500' },
          !orgCode ? '请先选择一个空间' : '提示：上传文档后即可开始问答'
        ) : null,
        React.createElement('div', { ref: bottomRef })
      ),
      React.createElement('div', { className:'p-3 border-t border-slate-100 bg-white/90 backdrop-blur flex items-center gap-2' },
        React.createElement('div', { className:'relative', ref: pickRef },
          React.createElement('button', { className:cx('w-10 h-10 rounded-2xl border grid place-items-center transition', (!orgCode || busy || !hasDocs) ? 'border-slate-200 bg-slate-50 text-slate-400' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'), disabled: !orgCode || busy || !hasDocs, onClick: ()=>setPickerOpen(v=>!v), title: hasDocs ? '选择文档' : '暂无文档可选' },
            React.createElement('svg', { className:'w-5 h-5 text-slate-700', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round' },
              React.createElement('path', { d:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
              React.createElement('path', { d:'M14 2v6h6' }),
              React.createElement('path', { d:'M16 13H8' }),
              React.createElement('path', { d:'M16 17H8' })
            )
          ),
          pickerOpen && React.createElement('div', { className:'absolute bottom-12 left-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-[20]' },
            React.createElement('div', { className:'px-2 py-1 text-xs font-bold text-slate-600' }, '基于某个文档提问（仅传 docType）'),
            React.createElement('button', { className:`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm hover:bg-slate-50 ${!selectedDoc ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`, onClick: ()=>{ setSelectedDoc(null); setPickerOpen(false); } },
              React.createElement('span', null, '全部文档'),
              !selectedDoc ? React.createElement('span', { className:'text-xs font-bold' }, '✓') : null
            ),
            (Array.isArray(docs) ? docs : []).map((d)=>React.createElement('button', { key:d.id, className:`w-full flex items-start justify-between gap-3 px-3 py-2 rounded-xl text-sm hover:bg-slate-50 ${selectedDoc && String(selectedDoc.id)===String(d.id) ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`, onClick: ()=>{ setSelectedDoc({ id:d.id, fileName:d.fileName, docType:d.docType }); setPickerOpen(false); } },
              React.createElement('div', { className:'min-w-0' },
                React.createElement('div', { className:'font-semibold truncate' }, d.fileName || '-'),
                React.createElement('div', { className:'text-xs text-slate-500 mt-0.5' }, (d.docType || '-').toUpperCase())
              ),
              (selectedDoc && String(selectedDoc.id)===String(d.id)) ? React.createElement('span', { className:'text-xs font-bold mt-0.5' }, '✓') : null
            )),
            React.createElement('div', { className:'border-t border-slate-100 my-2' }),
            React.createElement('div', { className:'px-2 py-1 text-xs text-slate-500' }, '当前：', React.createElement('span', { className:'font-semibold text-slate-700' }, selectedDoc ? (selectedDoc.fileName || selectedDoc.docType || '已选择') : '全部'))
          )
        ),
        React.createElement('input', { className:'flex-1 border border-slate-200 rounded-2xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200 bg-white', placeholder: orgCode ? (hasDocs ? '输入你的问题…' : '请先上传文档') : '请先选择空间', value: input, disabled: !orgCode || busy, onChange:e=>setInput(e.target.value), onKeyDown:e=>{ if(e.key==='Enter') send(); } }),
        React.createElement('button', { className:'px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 font-semibold shadow-sm', disabled: !orgCode || busy, onClick: send }, busy ? '…' : '发送')
      )
    );
  };

  const App = () => {
    const [user, setUser] = useState(null);
    const [spaces, setSpaces] = useState([]);
    const [activeSpace, setActiveSpace] = useState(null);
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [showCreate, setShowCreate] = useState(false);

    const [uploading, setUploading] = useState(false);
    const [uploadSteps, setUploadSteps] = useState(null);
    const pollTimerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [docQuery, setDocQuery] = useState('');
    const [docFilter, setDocFilter] = useState('all');

    const onPickFile = () => {
      try { fileInputRef.current && fileInputRef.current.click(); } catch(_) {}
    };

    const docsFiltered = useMemo(() => {
      const list = Array.isArray(docs) ? docs : [];
      const q = (docQuery || '').trim().toLowerCase();
      return list.filter(d => {
        if (docFilter === 'ready' && d.status !== 'READY') return false;
        if (docFilter === 'failed' && d.status !== 'FAILED') return false;
        if (docFilter === 'processing' && (d.status === 'READY' || d.status === 'FAILED')) return false;
        if (!q) return true;
        const name = (d.fileName || '').toLowerCase();
        const type = (d.docType || '').toLowerCase();
        return name.includes(q) || type.includes(q);
      });
    }, [docs, docQuery, docFilter]);

    const fmtTime = (v) => {
      if (!v) return '-';
      try {
        const d = new Date(v);
        if (!Number.isFinite(d.getTime())) return String(v);
        return d.toLocaleString();
      } catch(_) {
        return String(v);
      }
    };

    const refreshSpaces = async () => {
      const list = await api.listSpaces();
      setSpaces(list);
      return list;
    };

    const refreshDocs = async (space) => {
      if (!space) { setDocs([]); return []; }
      const list = await api.listDocs(space.id);
      setDocs(list);
      return list;
    };

    const doDelete = async (docId) => {
      if (!activeSpace) return;
      try {
        if (!confirm('确认删除该文档记录？')) return;
      } catch(_) {}
      setErr('');
      try {
        await api.deleteDoc(docId);
        await refreshDocs(activeSpace);
      } catch(e) {
        setErr(e.message || '删除失败');
      }
    };

    useEffect(() => {
      (async () => {
        try {
          setLoading(true);
          const u = await api.me();
          setUser(u);
          const s = await refreshSpaces();
          setActiveSpace(null);
          setDocs([]);
        } catch(e) {
          setErr(e.message || '加载失败');
        } finally {
          setLoading(false);
        }
      })();
    }, []);

    useEffect(() => {
      return () => {
        try {
          if (pollTimerRef.current) {
            clearInterval(pollTimerRef.current);
            pollTimerRef.current = null;
          }
        } catch(_) {}
      };
    }, []);

    const openSpace = async (space) => {
      setActiveSpace(space);
      setUploadSteps(null);
      try { await refreshDocs(space); } catch(e) { setErr(e.message || '加载文档失败'); }
    };

    const backToSpaces = async () => {
      stopPoll();
      setActiveSpace(null);
      setDocs([]);
      setUploadSteps(null);
      try { await refreshSpaces(); } catch(e) { setErr(e.message || '加载空间失败'); }
    };

    const createSpace = async ({ name, description }) => {
      try {
        const s = await api.createSpace({ name, description });
        setShowCreate(false);
        const list = await refreshSpaces();
        const found = list.find(x => String(x.id) === String(s.id)) || s;
        await openSpace(found);
      } catch(e) {
        setErr(e.message || '创建失败');
      }
    };

    const stopPoll = () => {
      try {
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
          pollTimerRef.current = null;
        }
      } catch(_) {}
    };

    const startPollDoc = (docId) => {
      stopPoll();
      pollTimerRef.current = setInterval(async () => {
        try {
          const d = await api.getDoc(docId);
          const p = parseProcess(d.processJson);
          if (p) setUploadSteps(p);
          if (d && (d.status === 'READY' || d.status === 'FAILED')) {
            stopPoll();
          }
        } catch(_) {
          // ignore transient polling errors
        }
      }, 1000);
    };

    const onUploadFile = async (file) => {
      if (!activeSpace) return;
      setErr('');
      setUploading(true);
      stopPoll();
      setUploadSteps({
        upload: { ok: true },
        read: { ok: null },
        split: { ok: null },
        group: { ok: null },
        embed: { ok: null },
        save: { ok: null }
      });
      try {
        const ext = (file.name||'').toLowerCase();
        let docType = 'txt';
        if (ext.endsWith('.pdf')) docType = 'pdf';
        else if (ext.endsWith('.docx')) docType = 'docx';
        else if (ext.endsWith('.md')) docType = 'md';
        else if (ext.endsWith('.txt')) docType = 'txt';

        const req = { chunkSize: 512, overlap: 50, model: 'text-embedding-v4', dimensions: 1024, docType, orgCode: activeSpace.orgCode };
        const created = await api.upload(activeSpace.id, file, req);
        if (created && created.id) {
          const p = parseProcess(created.processJson);
          if (p) setUploadSteps(p);
          startPollDoc(created.id);
        }
        await refreshDocs(activeSpace);
      } catch(e) {
        setErr(e.message || '上传失败');
        stopPoll();
        setUploadSteps(prev => {
          if (!prev) return prev;
          return { ...prev, embed: { ok: false }, save: { ok: false } };
        });
      } finally {
        setUploading(false);
      }
    };

    const activeOrgCode = activeSpace ? activeSpace.orgCode : null;

    if (loading) {
      return React.createElement('div', { className:'p-6 text-slate-600' }, '加载中...');
    }

    if (err && !user) {
      return React.createElement('div', { className:'p-6' },
        React.createElement('div', { className:'bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl' }, err),
        React.createElement('div', { className:'mt-3 text-sm text-slate-500' }, '请先登录后使用智能知识库')
      );
    }

    if (!activeSpace) {
      return React.createElement(React.Fragment, null,
        React.createElement(SpaceListPage, { user, spaces, onEnterSpace: openSpace, onCreate: ()=>setShowCreate(true) }),
        React.createElement(CreateSpaceModal, { open: showCreate, onClose: ()=>setShowCreate(false), onSubmit: createSpace })
      );
    }

    return React.createElement('div', { className:'grid grid-cols-1 lg:grid-cols-12 gap-8' },
      React.createElement('div', { className:'lg:col-span-5 space-y-6' },
        React.createElement(SpaceDetailHeader, { space: activeSpace, onBack: backToSpaces }),

        React.createElement('div', { className:'bg-white/5 rounded-3xl border border-white/10 shadow-sm p-4 space-y-4 overflow-hidden' },
          React.createElement('div', { className:'flex items-center justify-between' },
            React.createElement('div', { className:'text-sm font-bold text-white' }, '文档上传'),
            React.createElement('div', { className:'text-xs text-slate-400 break-all' }, activeSpace.orgCode)
          ),
          React.createElement('div', {
            className: cx(
              'relative rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_10%_10%,rgba(99,102,241,0.18),transparent_45%),radial-gradient(circle_at_90%_0%,rgba(59,130,246,0.16),transparent_40%),linear-gradient(to_bottom,rgba(15,23,42,0.75),rgba(2,6,23,0.85))] p-4',
              dragOver ? 'ring-4 ring-cyan-400/20 border-cyan-400/30' : ''
            ),
            onDragEnter: (e)=>{ e.preventDefault(); e.stopPropagation(); setDragOver(true); },
            onDragOver: (e)=>{ e.preventDefault(); e.stopPropagation(); setDragOver(true); },
            onDragLeave: (e)=>{ e.preventDefault(); e.stopPropagation(); setDragOver(false); },
            onDrop: (e)=>{
              e.preventDefault(); e.stopPropagation();
              setDragOver(false);
              const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
              if (f) onUploadFile(f);
            }
          },
            React.createElement('div', { className:'flex items-start justify-between gap-3' },
              React.createElement('div', null,
                React.createElement('div', { className:'text-sm text-white font-extrabold' }, '拖拽文件到这里，或点击上传'),
                React.createElement('div', { className:'text-xs text-slate-400 mt-1' }, '支持 pdf / docx / txt / md · 自动切分向量化')
              ),
              React.createElement('button', { className:'px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60', disabled: uploading, onClick: onPickFile }, uploading ? '上传中…' : '选择文件')
            ),
            React.createElement('input', { ref:fileInputRef, type:'file', className:'hidden', disabled: uploading, accept:'.pdf,.docx,.txt,.md', onChange:(e)=>{ const f=e.target.files&&e.target.files[0]; if(f) onUploadFile(f); e.target.value=''; } })
          ),
          uploadSteps && React.createElement('div', { className:'space-y-2' },
            React.createElement('div', { className:'text-sm font-bold text-white' }, '解析过程'),
            React.createElement(Steps, { process: uploadSteps })
          )
        ),

        React.createElement('div', { className:'bg-white/5 rounded-3xl border border-white/10 shadow-sm overflow-hidden' },
          React.createElement('div', { className:'px-4 py-3 border-b border-white/10 bg-white/5' },
            React.createElement('div', { className:'flex items-center justify-between gap-3' },
              React.createElement('div', { className:'font-extrabold text-white' }, '文档列表'),
              React.createElement('div', { className:'text-xs text-slate-400' }, `${docs.length} 个文档`)
            ),
            React.createElement('div', { className:'mt-3 flex items-center gap-2' },
              React.createElement('div', { className:'flex-1' },
                React.createElement('input', { className:'w-full border border-white/10 bg-white/5 text-slate-100 rounded-2xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-500', placeholder:'搜索文件名 / docType', value: docQuery, onChange:(e)=>setDocQuery(e.target.value) })
              ),
              React.createElement('select', { className:'border border-white/10 rounded-2xl px-3 py-2 text-sm bg-white/5 text-slate-200 outline-none focus:ring-2 focus:ring-cyan-400/30', value: docFilter, onChange:(e)=>setDocFilter(e.target.value) },
                React.createElement('option', { value:'all' }, '全部'),
                React.createElement('option', { value:'ready' }, '可检索'),
                React.createElement('option', { value:'processing' }, '处理中'),
                React.createElement('option', { value:'failed' }, '失败')
              )
            )
          ),
          React.createElement('div', { className:'max-h-[420px] overflow-auto p-3' },
            docsFiltered.length === 0
              ? React.createElement('div', { className:'p-6 text-center rounded-3xl border border-white/10 bg-white/5' },
                  React.createElement('div', { className:'text-sm font-extrabold text-white' }, docs.length === 0 ? '暂无文档' : '没有匹配的文档'),
                  React.createElement('div', { className:'mt-1 text-xs text-slate-400' }, docs.length === 0 ? '上传一个文档后即可开始问答' : '换个关键词或筛选条件试试')
                )
              : React.createElement('div', { className:'grid grid-cols-1 gap-3' },
                  docsFiltered.map(d => {
                    const ok = d.status === 'READY';
                    const st = ok ? { txt:'可检索', cls:'text-emerald-200 bg-emerald-500/10 border-emerald-500/20' }
                      : d.status === 'FAILED' ? { txt:'失败', cls:'text-rose-200 bg-rose-500/10 border-rose-500/20' }
                      : { txt:'处理中', cls:'text-slate-200 bg-white/5 border-white/10' };
                    return React.createElement('div', { key:d.id, className:'rounded-3xl border border-white/10 bg-white/5 shadow-sm hover:shadow-md transition overflow-hidden' },
                      React.createElement('div', { className:'p-4 flex items-start justify-between gap-3' },
                        React.createElement('div', { className:'min-w-0' },
                          React.createElement('div', { className:'text-sm font-extrabold text-white truncate' }, d.fileName || '-'),
                          React.createElement('div', { className:'mt-1 text-xs text-slate-400 break-all' }, `${d.docType || '-'} · ${fmtTime(d.createdAt)}`)
                        ),
                        React.createElement('div', { className:'flex items-center gap-2' },
                          React.createElement('span', { className:cx('text-[11px] font-extrabold px-2.5 py-1 rounded-full border', st.cls) }, st.txt),
                          React.createElement('button', { className:'text-xs font-semibold text-rose-300 hover:text-rose-200 hover:underline', onClick:()=>doDelete(d.id) }, '删除')
                        )
                      )
                    );
                  })
              )
          )
        )
      ),

      React.createElement('div', { className:'lg:col-span-7' },
        React.createElement(ChatPanel, { orgCode: activeOrgCode, docs })
      )
    );
  };

  const mount = () => {
    const el = document.getElementById('root');
    if (!el) return;
    ReactDOM.createRoot(el).render(React.createElement(App));
  };

  if (window.React && window.ReactDOM) mount();
  else window.addEventListener('load', mount);
})();
