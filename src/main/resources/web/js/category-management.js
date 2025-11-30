const CategoryManagement = () => {
  const { useState, useEffect } = React;
  const TYPE_OPTIONS = [
    { value: 1, label: '文章类型' },
    { value: 2, label: 'AI工具类型' },
    { value: 3, label: 'VIP类型' }
  ];
  const typeLabel = (v) => {
    const o = TYPE_OPTIONS.find(x => x.value === Number(v));
    return o ? o.label : '-';
  };
  const typeLabelFull = (v) => {
    const n = Number(v);
    const txt = typeLabel(n);
    return Number.isFinite(n) ? `${n}-${txt}` : '-';
  };
  const getTypeFromItem = (it) => {
    try { const t = it && (it.type ?? it.categoryType ?? it.category_type); const n = Number(t); return Number.isFinite(n) ? n : undefined; } catch(_) { return undefined; }
  };
  const [tree, setTree] = useState([]);
  const [openIds, setOpenIds] = useState(new Set());
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", parentId: null, type: 2 });

  const fetchTree = async () => {
    try {
      const url = typeFilter ? `/api/categories/tree?type=${encodeURIComponent(typeFilter)}` : '/api/categories/tree';
      const resp = await fetch(url, { credentials: 'same-origin' });
      const text = await resp.text(); let data = []; try { data = JSON.parse(text || '[]'); } catch(_) {}
      setTree(data || []);
    } catch(_) {}
  };

  const fetchList = async (targetPage = page) => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams(); params.set('page', targetPage); params.set('size', size); if (searchTerm) params.set('search', searchTerm); if (typeFilter) params.set('type', Number(typeFilter));
      const resp = await fetch(`/api/categories?${params.toString()}`, { credentials: 'same-origin' });
      const text = await resp.text(); let data = {}; try { data = JSON.parse(text); } catch(_) { throw new Error('接口异常'); }
      if (!resp.ok) throw new Error(data.message || '加载失败');
      const content = Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []);
      const tp = Number(data.totalPages);
      const te = Number(data.totalElements);
      const sz = Number(data.size);
      const num = Number(data.number);
      const lastFlag = typeof data.last === 'boolean' ? data.last : undefined;
      const sizeEff = Number.isFinite(sz) && sz > 0 ? sz : size;
      const currentPage = Number.isFinite(num) ? num : targetPage;
      const calcTotal = (Number.isFinite(te) && te > sizeEff)
        ? Math.max(1, Math.ceil(te / sizeEff))
        : (Number.isFinite(tp) && tp > 0
            ? tp
            : Math.max(1, (content.length >= sizeEff ? (currentPage + 2) : (currentPage + 1))));
      const nextEff = (typeof lastFlag === 'boolean')
        ? !lastFlag
        : (Number.isFinite(te)
            ? ((currentPage + 1) * sizeEff) < te
            : (content.length >= sizeEff));
      setList(content);
      setTotalPages(calcTotal);
      setTotalElements(Number.isFinite(te) ? te : totalElements);
      setPage(currentPage);
      setHasPrev(currentPage > 0);
      setHasNext(nextEff);
    } catch(e) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchTree(); fetchList(0); }, []);
  useEffect(() => { fetchTree(); fetchList(0); }, [typeFilter]);

  const handleSearch = () => fetchList(0);
  const handlePrev = () => { if (page>0) fetchList(page-1); };
  const handleNext = () => { fetchList(page+1); };

  const openAdd = () => { setForm({ name: "", parentId: null, type: typeFilter ? Number(typeFilter) : 2 }); setShowAdd(true); };
  const openEdit = (item) => { setEditItem({ ...item }); setShowEdit(true); };

  const submitAdd = async () => {
    setLoading(true); setError("");
    try {
      const payload = { name: (form.name||'').trim(), parentId: form.parentId ?? null, type: form.type ? Number(form.type) : 2 };
      const resp = await fetch('/api/categories', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify(payload) });
      const text = await resp.text(); let data = {}; try { data = JSON.parse(text || '{}'); } catch(_) {}
      if (!resp.ok) throw new Error(data.message || '新增失败');
      setShowAdd(false); setForm({ name:"", parentId:null, type: typeFilter ? Number(typeFilter) : 2 }); fetchTree(); fetchList(0);
    } catch(e) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  };

  const submitEdit = async () => {
    if (!editItem) return; setLoading(true); setError("");
    try {
      const payload = { name: (editItem.name||'').trim(), parentId: editItem.parentId ?? null, type: editItem.type ? Number(editItem.type) : undefined };
      const resp = await fetch(`/api/categories/${editItem.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify(payload) });
      const text = await resp.text(); let data = {}; try { data = JSON.parse(text || '{}'); } catch(_) {}
      if (!resp.ok) throw new Error(data.message || '更新失败');
      setShowEdit(false); setEditItem(null); fetchTree(); fetchList(page);
    } catch(e) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  };

  const removeItem = async (id) => {
    if (!confirm('确认删除该分类？若有子分类需先删除子分类')) return;
    setLoading(true); setError("");
    try {
      const resp = await fetch(`/api/categories/${id}`, { method:'DELETE', credentials:'same-origin' });
      const text = await resp.text(); let data = {}; try { data = JSON.parse(text || '{}'); } catch(_) {}
      if (!resp.ok) throw new Error(data.message || '删除失败');
      fetchTree(); fetchList(page);
    } catch(e) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  };

  const toggleNode = (id) => setOpenIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const renderTree = (nodes, level=0) => {
    const pad = level * 16;
    return (nodes || []).map(n => {
      const hasChildren = Array.isArray(n.children) && n.children.length>0;
      const isOpen = openIds.has(n.id);
      return React.createElement('div', { key: n.id, style:{ paddingLeft: pad }, className:'py-1' },
        React.createElement('div', { className:'flex items-center gap-2 cursor-pointer', onClick:()=> hasChildren ? toggleNode(n.id) : null },
          hasChildren ? React.createElement('span', { className:'inline-block w-5 h-5 rounded border border-gray-300 text-gray-600 text-center align-middle' }, isOpen?'-':'+') : React.createElement('span', { className:'inline-block w-5' }),
          React.createElement('span', { className:'text-sm text-gray-800' }, `${n.name} · ${typeLabelFull(getTypeFromItem(n))} (L${n.level})`)
        ),
        (hasChildren && isOpen) ? renderTree(n.children, level+1) : null
      );
    });
  };

  const parentOptions = () => {
    // 展平 tree 为下拉选项
    const opts = [];
    const walk = (nodes, prefix='') => {
      (nodes||[]).forEach(n => { opts.push({ id:n.id, name: prefix ? `${prefix} > ${n.name}` : n.name, level:n.level, type:n.type }); if (n.children && n.children.length) walk(n.children, prefix?`${prefix} > ${n.name}`:n.name); });
    };
    walk(tree);
    return typeFilter ? opts.filter(o => Number(o.type) === Number(typeFilter)) : opts;
  };

  return (
    React.createElement('div', { className:'p-6 md:p-10 bg-white rounded-xl shadow-lg w-full h-full space-y-6' },
      React.createElement('h2', { className:'text-3xl font-bold text-gray-800 flex items-center border-b pb-4 mb-4' }, '分类管理 (最多三级)'),
      React.createElement('div', { className:'flex items-center gap-3' },
        React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2 w-full md:w-80', placeholder:'按名称搜索...', value:searchTerm, onChange:(e)=>setSearchTerm(e.target.value), onKeyDown:(e)=>{ if(e.key==='Enter') handleSearch(); }}),
        React.createElement('select', { className:'border border-gray-300 rounded-lg px-3 py-2 w-52', value:typeFilter, onChange:(e)=>setTypeFilter(e.target.value) },
          React.createElement('option', { value:'' }, '全部类型'),
          ...TYPE_OPTIONS.map(o => React.createElement('option', { key:o.value, value:o.value }, o.label))
        ),
        
        React.createElement('button', { className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick: handleSearch }, '搜索'),
        React.createElement('button', { className:'px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700', onClick: openAdd }, '新增分类')
      ),
      error && React.createElement('div', { className:'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md' }, error),
      React.createElement('div', { className:'grid grid-cols-1 md:grid-cols-2 gap-6' },
        React.createElement('div', { className:'overflow-x-auto bg-white rounded-lg border border-gray-200 shadow' },
          React.createElement('table', { className:'min-w-full divide-y divide-gray-200' },
            React.createElement('thead', { className:'bg-gray-50' },
              React.createElement('tr', null, ['ID','名称','类型','父ID','级别','操作'].map((h,i)=>React.createElement('th',{key:i,className:'px-4 py-3 text-left text-xs font-medium text-gray-500'},h)))
            ),
            React.createElement('tbody', { className:'bg-white divide-y divide-gray-200' },
              loading ? React.createElement('tr',null,React.createElement('td',{className:'px-4 py-6 text-center text-gray-500',colSpan:6},'加载中...'))
              : list.length===0 ? React.createElement('tr',null,React.createElement('td',{className:'px-4 py-6 text-center text-gray-500',colSpan:6},'暂无数据'))
              : list.map(it => React.createElement('tr',{key:it.id},
                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.id),
                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.name),
                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, typeLabelFull(getTypeFromItem(it))),
                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.parentId ?? '-'),
                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.level),
                  React.createElement('td',{className:'px-4 py-3 text-sm'},
                    React.createElement('div',{className:'flex items-center justify-end gap-2 whitespace-nowrap'},
                      React.createElement('button',{className:'px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:()=>openEdit(it)},'编辑'),
                      React.createElement('button',{className:'px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700', onClick:()=>removeItem(it.id)},'删除')
                    )
                  )
              ))
            )
          ),
          React.createElement('div', { className:'flex items-center justify-between px-4 py-3 border-t bg-gray-50' },
            React.createElement('div', { className:'text-sm text-gray-600' }, `第 ${page+1} / ${Math.max(totalPages,1)} 页`),
            React.createElement('div', { className:'space-x-2' },
              React.createElement('button',{className:'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50', disabled: !hasPrev, onClick:handlePrev}, '上一页'),
              React.createElement('button',{className:'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50', disabled: !hasNext, onClick:handleNext}, '下一页')
            )
          )
        ),
        React.createElement('div', { className:'bg-white rounded-lg border border-gray-200 shadow p-4' },
          React.createElement('h3', { className:'text-lg font-bold text-gray-800 mb-2' }, '分类树'),
          React.createElement('div', { className:'max-h-[50vh] overflow-y-auto' }, renderTree(tree))
        )
      ),
      
      showAdd && React.createElement('div',{className:'fixed inset-0 bg-black/30 flex items-center justify-center p-4'},
        React.createElement('div',{className:'bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4'},
          React.createElement('h3',{className:'text-xl font-bold text-gray-800'}, '新增分类'),
          React.createElement('div',{className:'space-y-3'},
            React.createElement('input',{className:'w-full border border-gray-300 rounded-lg px-3 py-2', placeholder:'名称', value:form.name, onChange:(e)=>setForm({...form,name:e.target.value})}),
            React.createElement('select',{className:'w-full border border-gray-300 rounded-lg px-3 py-2', value: form.type ?? 2, onChange:(e)=>setForm({...form,type:Number(e.target.value)})},
              ...TYPE_OPTIONS.map(o => React.createElement('option',{key:o.value, value:o.value}, o.label))
            ),
            React.createElement('select',{className:'w-full border border-gray-300 rounded-lg px-3 py-2', value: form.parentId ?? '', onChange:(e)=>setForm({...form,parentId: e.target.value ? Number(e.target.value) : null})},
              React.createElement('option',{value:''},'顶级'),
              parentOptions().map(opt => React.createElement('option',{key:opt.id, value:opt.id}, opt.name))
            )
          ),
          React.createElement('div',{className:'flex justify-end space-x-2 pt-2'},
            React.createElement('button',{className:'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick:()=>{ setShowAdd(false); setForm({ name:"", parentId:null, type: typeFilter ? Number(typeFilter) : 2 }); }},'取消'),
            React.createElement('button',{className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:submitAdd},'保存')
          )
        )
      ),
      showEdit && editItem && React.createElement('div',{className:'fixed inset-0 bg-black/30 flex items-center justify-center p-4'},
        React.createElement('div',{className:'bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4'},
          React.createElement('h3',{className:'text-xl font-bold text-gray-800'}, '编辑分类'),
          React.createElement('div',{className:'space-y-3'},
            React.createElement('input',{className:'w-full border border-gray-300 rounded-lg px-3 py-2', placeholder:'名称', value:editItem.name ?? '', onChange:(e)=>setEditItem({...editItem, name:e.target.value})}),
            React.createElement('select',{className:'w-full border border-gray-300 rounded-lg px-3 py-2', value: editItem.type ?? 2, onChange:(e)=>setEditItem({...editItem,type:Number(e.target.value)})},
              ...TYPE_OPTIONS.map(o => React.createElement('option',{key:o.value, value:o.value}, o.label))
            ),
            React.createElement('select',{className:'w-full border border-gray-300 rounded-lg px-3 py-2', value: editItem.parentId ?? '', onChange:(e)=>setEditItem({...editItem,parentId: e.target.value ? Number(e.target.value) : null})},
              React.createElement('option',{value:''},'顶级'),
              parentOptions().map(opt => React.createElement('option',{key:opt.id, value:opt.id}, opt.name))
            )
          ),
          React.createElement('div',{className:'flex justify-end space-x-2 pt-2'},
            React.createElement('button',{className:'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick:()=>{ setShowEdit(false); setEditItem(null); }},'取消'),
            React.createElement('button',{className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:submitEdit},'保存')
          )
        )
      )
    )
  );
};

window.Components = window.Components || {};
window.Components.CategoryManagement = CategoryManagement;
try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}
