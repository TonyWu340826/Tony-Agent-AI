const InterviewManagement = () => {
  const { useState, useEffect, useRef } = React; // 确保 useRef 被引入
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addError, setAddError] = useState('');
  const [editError, setEditError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ categoryId: '', title: '', question: '', solution: '', visibilityVip: 0 });
  const solutionRef = useRef(''); // solutionRef 必须在这里定义
  const [tree, setTree] = useState([]);

  // Portal 组件定义：确保模态框渲染在 DOM 顶层
  const Portal = ({ children }) => ReactDOM.createPortal(children, document.body);


  const fetchTree = async () => {
    try {
      const r = await fetch('/api/categories/tree', { credentials:'same-origin' });
      const t = await r.text();
      const d = JSON.parse(t||'[]');
      if (Array.isArray(d) && d.length) { setTree(d); return; }
    } catch(_) {}
    try {
      const resp = await fetch('/api/interview/items?page=0&size=200', { credentials:'same-origin' });
      const txt = await resp.text();
      const data = JSON.parse(txt||'{}');
      const list = Array.isArray(data.content) ? data.content : [];
      const seen = {};
      const nodes = [];
      for (let i=0;i<list.length;i++) {
        const it = list[i];
        const id = it && it.categoryId;
        if (id!=null && !seen[id]) { seen[id]=1; nodes.push({ id, name: (it.categoryName || String(id)), children: [] }); }
      }
      setTree(nodes);
    } catch(_) { setTree([]); }
  };

  const fetchList = async (targetPage = page) => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams(); params.set('page', targetPage); params.set('size', size);
      if (searchTerm) params.set('search', searchTerm);
      if (categoryId) params.set('categoryId', categoryId);
      const resp = await fetch(`/api/interview/admin/items?${params.toString()}`, { credentials:'same-origin' });
      const text = await resp.text(); let data = {}; try { data = JSON.parse(text); } catch(_) { throw new Error('接口异常'); }
      if (!resp.ok) throw new Error(data.message || '加载失败');
      setItems(data.content || []); setTotalPages(data.totalPages || 0); setPage((data.number != null ? data.number : targetPage));
    } catch(e) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchTree(); fetchList(0); }, []);

  const closeAdd = () => { setShowAdd(false); setAddError(''); try{ sessionStorage.removeItem('interview:add:solution'); }catch(_){} setForm({ categoryId:'', title:'', question:'', solution:'', visibilityVip:0 }); };
  const closeEdit = () => { setShowEdit(false); setEditError(''); setEditItem(null); };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (showAdd) closeAdd();
        if (showEdit) closeEdit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showAdd, showEdit]);

  const handleSearch = () => fetchList(0);
  const handlePrev = () => { if (page>0) fetchList(page-1); };
  const handleNext = () => { if (page<totalPages-1) fetchList(page+1); };

  const openAdd = () => {
    const cachedSolution = sessionStorage.getItem('interview:add:solution') || '';
    setForm({ categoryId:'', title:'', question:'', solution:cachedSolution, visibilityVip:0 });
    setAddError('');
    // 确保 solutionRef 初始化为当前状态的值
    solutionRef.current = cachedSolution;
    setShowAdd(true);
  };
  const openEdit = (it) => {
    const currentSolution = it.solution || '';
    setEditItem({ ...it, solution: currentSolution });
    setEditError('');
    // 确保 solutionRef 初始化为当前状态的值
    solutionRef.current = currentSolution;
    setShowEdit(true);
  };

  const parentOptions = () => {
    const opts = [];
    const walk = (nodes, prefix='') => { (nodes||[]).forEach(n => { opts.push({ id:n.id, name: prefix ? `${prefix} > ${n.name}` : n.name }); if (n.children && n.children.length) walk(n.children, prefix?`${prefix} > ${n.name}`:n.name); }); };
    if (tree && tree.length) {
      walk(tree);
      return opts;
    }
    // Fallback：从当前列表项聚合分类
    const seen = new Set();
    (items||[]).forEach(it => {
      const id = it.categoryId;
      const name = it.categoryName || it.categoryId;
      if (id != null && !seen.has(id)) { seen.add(id); opts.push({ id, name }); }
    });
    return opts;
  };

  const submitAdd = async () => {
    if (!form.categoryId || String(form.categoryId).trim()==='') { setAddError('请选择分类'); return; }
    if (!form.title || !form.title.trim()) { setAddError('请输入标题'); return; }
    if (!form.question || !form.question.trim()) { setAddError('请输入问题'); return; }
    setLoading(true); setAddError('');
    try {
      // 使用 solutionRef.current 作为最终的 solution 提交
      const finalSolution = form.solution || '';
      const payload = { categoryId: Number(form.categoryId), title: form.title.trim(), question: form.question.trim(), solution: finalSolution, visibilityVip: Number(form.visibilityVip) };
      const resp = await fetch('/api/interview/admin/items', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify(payload) });
      const text = await resp.text(); let data = {}; try { data = JSON.parse(text || '{}'); } catch(_) {}
      if (!resp.ok || data.success===false) throw new Error(data.message || '新增失败');
      closeAdd(); fetchList(0);
    } catch(e) { setAddError(e.message || '请求失败'); } finally { setLoading(false); }
  };

  const submitEdit = async () => {
    if (!editItem) return; setLoading(true); setError('');
    try {
      // 使用 solutionRef.current 作为最终的 solution 提交
      const finalSolution = editItem.solution || '';
      const payload = { categoryId: Number(editItem.categoryId), title: editItem.title, question: editItem.question, solution: finalSolution, visibilityVip: Number(editItem.visibilityVip) };
      const resp = await fetch(`/api/interview/admin/items/${editItem.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify(payload) });
      const text = await resp.text(); let data = {}; try { data = JSON.parse(text || '{}'); } catch(_) {}
      if (!resp.ok || data.success===false) throw new Error(data.message || '更新失败');
      closeEdit(); fetchList(page);
    } catch(e) { setEditError(e.message || '请求失败'); } finally { setLoading(false); }
  };

  const removeItem = async (id) => {
    if (!confirm('确认删除该条目？')) return; setLoading(true); setError('');
    try {
      const resp = await fetch(`/api/interview/admin/items/${id}`, { method:'DELETE', credentials:'same-origin' });
      const text = await resp.text(); let data = {}; try { data = JSON.parse(text || '{}'); } catch(_) {}
      if (!resp.ok || data.success===false) throw new Error(data.message || '删除失败');
      fetchList(page);
    } catch(e) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  };

  return (
      React.createElement('div',{className:'p-6 md:p-10 bg-white rounded-xl shadow-lg w-full h-full space-y-6'},
          React.createElement('h2',{className:'text-3xl font-bold text-gray-800 flex items-center border-b pb-4 mb-4'}, '面试宝典'),
          React.createElement('div',{className:'flex items-center gap-3'},
              React.createElement('select',{className:'border border-gray-300 rounded-lg px-3 py-2 w-48', value: categoryId, onChange:(e)=>setCategoryId(e.target.value)},
                  React.createElement('option',{value:''},'全部分类'),
                  parentOptions().map(o => React.createElement('option',{key:o.id, value:o.id}, o.name))
              ),
              React.createElement('input',{className:'border border-gray-300 rounded-lg px-3 py-2 w-full md:w-80', placeholder:'搜索标题/问题...', value:searchTerm, onChange:(e)=>setSearchTerm(e.target.value), onKeyDown:(e)=>{ if(e.key==='Enter') handleSearch(); }}),
              React.createElement('button',{className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:handleSearch}, '搜索'),
              React.createElement('button',{className:'px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700', onClick:openAdd}, '新增')
          ),
          error && React.createElement('div',{className:'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md'}, error),
          React.createElement('div',{className:'overflow-x-auto bg-white rounded-lg border border-gray-200 shadow'},
              React.createElement('table',{className:'min-w-full divide-y divide-gray-200'},
                  React.createElement('thead',{className:'bg-gray-50'}, React.createElement('tr',null,
                      ['ID','标题','分类','可见','时间','操作'].map((h,i)=>React.createElement('th',{key:i,className:'px-4 py-3 text-left text-xs font-medium text-gray-500'},h))
                  )),
                  React.createElement('tbody',{className:'bg-white divide-y divide-gray-200'},
                      loading ? React.createElement('tr',null,React.createElement('td',{className:'px-4 py-6 text-center text-gray-500',colSpan:6},'加载中...'))
                          : items.length===0 ? React.createElement('tr',null,React.createElement('td',{className:'px-4 py-6 text-center text-gray-500',colSpan:6},'暂无数据'))
                              : items.map(it => React.createElement('tr',{key:it.id},
                                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.id),
                                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.title),
                                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.categoryName || it.categoryId),
                                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.visibilityVip===99 ? 'VIP99专享' : 'VIP0可见'),
                                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.createdAt ? new Date(it.createdAt).toLocaleString() : '-'),
                                  React.createElement('td',{className:'px-4 py-3 text-sm'},
                                      React.createElement('div',{className:'flex items-center justify-end gap-2 whitespace-nowrap'},
                                          React.createElement('button',{className:'px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:()=>openEdit(it)},'编辑'),
                                          React.createElement('button',{className:'px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700', onClick:()=>removeItem(it.id)},'删除')
                                      )
                                  )
                              ))
                  )
              )
          ),
          React.createElement('div',{className:'flex items-center justify-between'},
              React.createElement('div',{className:'text-sm text-gray-600'}, `第 ${page+1} / ${Math.max(totalPages,1)} 页`),
              React.createElement('div',{className:'space-x-2'},
                  React.createElement('button',{className:'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50', disabled: page===0, onClick:handlePrev}, '上一页'),
                  React.createElement('button',{className:'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50', disabled: page>=totalPages-1, onClick:handleNext}, '下一页')
              )
          ),
          showAdd && React.createElement(Portal, null,
              React.createElement('div',{className:'fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4', onClick:closeAdd},
                  React.createElement('div',{className:'relative z-[999] bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4', onClick:(e)=>e.stopPropagation()},
                      React.createElement('h3',{className:'text-xl font-bold text-gray-800'}, '新增条目'),
                      React.createElement('div',{className:'grid grid-cols-1 md:grid-cols-2 gap-3'},
                          React.createElement('select',{className:'border border-gray-300 rounded-lg px-3 py-2', value:form.categoryId, onChange:(e)=>{ setForm({...form,categoryId:e.target.value}); setAddError(''); }},
                              React.createElement('option',{value:''},'选择分类'),
                              parentOptions().map(o => React.createElement('option',{key:o.id, value:o.id}, o.name))
                          ),
                          React.createElement('select',{className:'border border-gray-300 rounded-lg px-3 py-2', value:form.visibilityVip, onChange:(e)=>{ setForm({...form,visibilityVip:e.target.value}); setAddError(''); }},
                              React.createElement('option',{value:0},'VIP0可见'),
                              React.createElement('option',{value:99},'VIP99专享')
                          ),
            React.createElement('input',{className:'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2', placeholder:'标题', defaultValue:form.title, onChange:(e)=>{ setForm(f=>({...f,title:e.target.value})); setAddError(''); }}),
            React.createElement('textarea',{className:'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2', rows:4, placeholder:'问题', defaultValue:form.question, onChange:(e)=>{ setForm(f=>({...f,question:e.target.value})); setAddError(''); }}),
            React.createElement('textarea',{className:'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2', rows:6, placeholder:'解答', defaultValue:form.solution, onChange:(e)=>setForm(f=>({...f,solution:e.target.value}))})
                      ),
                      addError && React.createElement('div',{className:'text-sm text-red-600'}, addError),
                      React.createElement('div',{className:'flex justify-end space-x-2 pt-2'},
                          React.createElement('button',{className:'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick:closeAdd},'取消'),
                          React.createElement('button',{className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:submitAdd},'新增')
                      )
                  )
              )
          ),
          showEdit && editItem && React.createElement(Portal, null,
              React.createElement('div',{className:'fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4', onClick:closeEdit},
                  React.createElement('div',{className:'relative z-[999] bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4', onClick:(e)=>e.stopPropagation()},
                      React.createElement('h3',{className:'text-xl font-bold text-gray-800'}, '编辑条目'),
                      React.createElement('div',{className:'grid grid-cols-1 md:grid-cols-2 gap-3'},
                          React.createElement('select',{className:'border border-gray-300 rounded-lg px-3 py-2', value:editItem.categoryId, onChange:(e)=>{ setEditItem({...editItem,categoryId:e.target.value}); setEditError(''); }},
                              parentOptions().map(o => React.createElement('option',{key:o.id, value:o.id}, o.name))
                          ),
                          React.createElement('select',{className:'border border-gray-300 rounded-lg px-3 py-2', value:editItem.visibilityVip, onChange:(e)=>{ setEditItem({...editItem,visibilityVip:e.target.value}); setEditError(''); }},
                              React.createElement('option',{value:0},'VIP0可见'),
                              React.createElement('option',{value:99},'VIP99专享')
                          ),
            React.createElement('input',{className:'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2', placeholder:'标题', defaultValue:(editItem.title != null ? editItem.title : ''), onChange:(e)=>{ setEditItem(i=>({...i,title:e.target.value})); setEditError(''); }}),
            React.createElement('textarea',{className:'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2', rows:4, placeholder:'问题', defaultValue:(editItem.question != null ? editItem.question : ''), onChange:(e)=>{ setEditItem(i=>({...i,question:e.target.value})); setEditError(''); }}),
            React.createElement('textarea',{className:'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2', rows:6, placeholder:'解答', defaultValue:(editItem.solution != null ? editItem.solution : ''), onChange:(e)=>setEditItem(i=>({...i,solution:e.target.value}))})
                      ),
                      editError && React.createElement('div',{className:'text-sm text-red-600'}, editError),
                      React.createElement('div',{className:'flex justify-end space-x-2 pt-2'},
                          React.createElement('button',{className:'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick:closeEdit},'取消'),
                          React.createElement('button',{className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:submitEdit},'保存')
                      )
                  )
              )
          )
      )
  );
};

window.Components = window.Components || {};
window.Components.InterviewManagement = InterviewManagement;
try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}

// =============================================================================
// RichTextEditor 组件
// =============================================================================

function RichTextEditor({ value, onChange, storageKey }) {
  const { useRef, useEffect } = React;
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el || !window.Quill) return;
    if (el.__quill_inited) return;

    // 确保组件被渲染之前，DOM 结构是干净的
    el.innerHTML = '';

    const toolbar = {
      container: [
        [{ font: ['sans-serif','serif','monospace'] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold','italic','underline','strike'],
        [{ header:1 },{ header:2 }],
        [{ list:'ordered' },{ list:'bullet' }],
        ['blockquote'],
        ['link','image'],
        ['clean']
      ],
      handlers: {
        image: function(){
          const input = document.createElement('input'); input.type='file'; input.accept='image/*';
          input.onchange = () => { const f=input.files&&input.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{
            const base64=r.result; const q=quillRef.current; const range=q&&q.getSelection(); const index=range?range.index:q.getLength(); q.insertEmbed(index,'image',base64,'user');
          }; r.readAsDataURL(f); }; input.click(); }
      }
    };
    const q = new Quill(el,{ theme:'snow', placeholder:'支持富文本与图片', modules:{ toolbar } });
    el.__quill_inited = true; quillRef.current = q;

    const cached = storageKey ? sessionStorage.getItem(storageKey) : null;
    const init = cached!=null ? cached : (value||'');
    if (init) q.root.innerHTML = init;

    // RichTextEditor 内部只需要调用外部传入的 onChange 回调
    const handler = () => {
      const html = q.root.innerHTML;
      if(storageKey){ try{ sessionStorage.setItem(storageKey, html); }catch(e){} }
      onChange && onChange(html); // 调用父组件的 onChange
    };

    q.on('text-change', handler);

    // 清理函数
    return ()=>{
      try{ q.off('text-change', handler); }catch(e){}
      quillRef.current=null;
      if(el){ el.__quill_inited=false; el.innerHTML=''; }
    };
  }, [storageKey]); // 依赖 storageKey，因为它在组件生命周期内通常不变

  // 移除对 value 的持续覆盖，避免输入过程被重置

  return React.createElement('div',{ className:'min-h-[240px]', ref: editorRef });
}
