(() => {
  const { useState, useEffect } = React;
  const Icon = (name, props) => {
    const I = (window.LucideReact && window.LucideReact[name]) || (() => React.createElement('span', { className: props.className }, ''));
    return React.createElement(I, props);
  };
  const loadOnce = (src) => new Promise((resolve, reject) => {
    if ([...document.scripts].some(s => s.src.endsWith(src))) { resolve(); return; }
    const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag);
  });
  const StatusTag = ({ enabled }) => (
    React.createElement('span', { className: enabled ? 'text-green-600' : 'text-gray-500' }, enabled ? '已启用' : '已禁用')
  );
  const ModelChip = ({ model }) => (
    React.createElement('span', { className: 'px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600 border border-blue-200' }, model)
  );
  const PromptTemplateManagement = () => {
    const [items, setItems] = useState([]);
    const [filters, setFilters] = useState({ model: '', status: '', version: '' });
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [showTest, setShowTest] = useState(false);
    const [testData, setTestData] = useState(null);
    const fetchList = async (targetPage = page) => {
      setLoading(true); setError('');
      try {
        const p = new URLSearchParams(); p.set('page', targetPage); p.set('size', size);
        if (filters.model) p.set('model_type', filters.model);
        if (filters.status) p.set('status', filters.status);
        if (filters.version) p.set('version', filters.version);
        if (search) p.set('keyword', search);
        const r = await fetch(`/api/prompt/admin/templates?${p.toString()}`, { credentials: 'same-origin' });
        const t = await r.text(); let d = {}; try { d = JSON.parse(t || '{}'); } catch(_) { throw new Error('接口异常'); }
        if (!r.ok) throw new Error(d.message || '加载失败');
        setItems(d.content || []); setTotalPages(d.totalPages || 0); setPage(d.number ?? targetPage);
      } catch(e) { setError(e.message || '请求失败'); } finally { setLoading(false); }
    };
    useEffect(() => { fetchList(0); }, []);
    const handleDelete = async (id) => {
      if (!confirm('确认删除该模板？')) return; setLoading(true); setError('');
      try { const r = await fetch(`/api/prompt/admin/templates/${id}`, { method:'DELETE', credentials:'same-origin' }); const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){} if(!r.ok || d.success===false) throw new Error(d.message || '删除失败'); fetchList(page); } catch(e){ setError(e.message || '请求失败'); } finally { setLoading(false); }
    };
    const handleCopy = async (id) => {
      setLoading(true); setError('');
      try { const r = await fetch(`/api/prompt/admin/templates/${id}/copy`, { method:'POST', credentials:'same-origin' }); const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){} if(!r.ok || d.success===false) throw new Error(d.message || '复制失败'); fetchList(page); } catch(e){ setError(e.message || '请求失败'); } finally { setLoading(false); }
    };
    const openEdit = async (data) => {
      await loadOnce('/js/prompt-template-edit.js'); setEditData(data || null); setShowEdit(true);
    };
    const openTest = async (data) => {
      await loadOnce('/js/prompt-template-test.js'); setTestData(data); setShowTest(true);
    };
    const handleToggleStatus = async (it) => {
      setLoading(true); setError('');
      try {
        const nextStatus = String(it.status ?? '0') === '0' ? 1 : 0;
        const payload = {
          scene_code: it.sceneCode || it.scene_code || '',
          model_type: it.modelType || it.model_type || '',
          version: Number(it.version ?? 1),
          role_type: it.roleType || it.role_type || '',
          template_name: it.templateName || it.template_name || '',
          template_content: it.templateContent || it.template_content || '',
          param_schema: (it.paramSchema !== undefined ? it.paramSchema : it.param_schema),
          status: nextStatus
        };
        const r = await fetch(`/api/prompt/admin/templates/${it.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify(payload) });
        const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){}
        if (!r.ok || d.success===false) throw new Error(d.message || '状态修改失败');
        fetchList(page);
      } catch(e){ setError(e.message || '请求失败'); } finally { setLoading(false); }
    };
    const onSaved = () => { setShowEdit(false); setEditData(null); fetchList(0); };
    const onClosed = () => { setShowEdit(false); setEditData(null); };
    const onTestClosed = () => { setShowTest(false); setTestData(null); };
    const modelOptions = ['gpt-4o','deepseek-chat','glm-4','claude-3','qwen-2'];
    return React.createElement('div', { className:'p-6 md:p-10 bg-white rounded-xl shadow-lg w-full h-full space-y-6' },
      React.createElement('h2', { className:'text-3xl font-bold text-gray-800 border-b pb-4 mb-4' }, '提示词模板'),
      React.createElement('div', { className:'flex flex-col md:flex-row gap-3 items-start md:items-center' },
        React.createElement('div', { className:'relative w-full md:w-80' },
          React.createElement('input', { className:'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg', placeholder:'搜索标题...', value:search, onChange:e=>setSearch(e.target.value), onKeyDown:e=>{ if(e.key==='Enter') fetchList(0); } }),
          React.createElement(Icon, { name:'Search', className:'w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' })
        ),
        React.createElement('select', { className:'border border-gray-300 rounded-lg px-3 py-2 w-40', value:filters.model, onChange:e=>setFilters({ ...filters, model:e.target.value }) },
          React.createElement('option', { value:'' }, '所有模型'),
          ...modelOptions.map(m => React.createElement('option', { key:m, value:m }, m.toUpperCase()))
        ),
        React.createElement('select', { className:'border border-gray-300 rounded-lg px-3 py-2 w-32', value:filters.status, onChange:e=>setFilters({ ...filters, status:e.target.value }) },
          React.createElement('option', { value:'' }, '所有状态'),
          React.createElement('option', { value:'0' }, '启用'),
          React.createElement('option', { value:'1' }, '停用')
        ),
        React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2 w-24', placeholder:'版本', value:filters.version, onChange:e=>setFilters({ ...filters, version:e.target.value }) }),
        React.createElement('div', { className:'flex gap-2 ml-auto' },
          React.createElement('button', { className:'px-4 py-2 rounded-md bg-blue-600 text-white', onClick:()=>fetchList(0) }, '筛选')
        )
      ),
      error ? React.createElement('div', { className:'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md' }, error) : null,
      React.createElement('div', { className:'overflow-x-auto bg-white rounded-lg border border-gray-200 shadow w-full' },
        React.createElement('div', { className:'px-4 py-3 font-semibold text-gray-700 border-b flex items-center justify-between' },
          React.createElement('span', null, '模板列表'),
          React.createElement('button', { className:'px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700', onClick:()=>openEdit(null) }, '新增模板')
        ),
        React.createElement('table', { className:'min-w-full divide-y divide-gray-200' },
          React.createElement('thead', { className:'bg-gray-50' }, React.createElement('tr', null, ['模型','模板名称','编码','版本','角色','业务属性','状态','更新时间','操作'].map((h,i)=>{
            const alignClass = h==='操作' ? 'text-right' : 'text-left';
            return React.createElement('th',{key:i,className:`px-6 py-3 ${alignClass} text-xs font-medium text-gray-500`},h);
          }))),
          React.createElement('tbody', { className:'bg-white divide-y divide-gray-200' },
            loading ? React.createElement('tr', null, React.createElement('td', { className:'px-6 py-6 text-center text-gray-500', colSpan:9 }, '加载中...')) : (items.length===0 ? React.createElement('tr', null, React.createElement('td', { className:'px-6 py-6 text-center text-gray-500', colSpan:9 }, '暂无数据')) : items.map(it => (
              React.createElement('tr', { key: it.id },
                React.createElement('td', { className:'px-6 py-3 text-sm text-gray-700' }, React.createElement(ModelChip, { model: (it.modelType || it.model_type || '').toUpperCase() })),
                React.createElement('td', { className:'px-6 py-3 text-sm text-gray-700' }, it.templateName || it.template_name || '-'),
                React.createElement('td', { className:'px-6 py-3 text-xs text-gray-600 font-mono' }, it.code || '-'),
                React.createElement('td', { className:'px-6 py-3 text-sm text-gray-700' }, `v${it.version ?? 1}`),
                React.createElement('td', { className:'px-6 py-3 text-sm text-gray-700' }, it.roleType || it.role_type || '-'),
                React.createElement('td', { className:'px-6 py-3 text-xs text-gray-600' }, (()=>{ try{ const raw = (it.param_schema !== undefined ? it.param_schema : (it.paramSchema !== undefined ? it.paramSchema : undefined)); const obj = typeof raw === 'string' ? JSON.parse(raw||'[]') : (raw||[]); if(Array.isArray(obj)){ const names = obj.map(v=>String((v&&(v.name||v.label||v.key))||'').trim()).filter(Boolean); const head=names.slice(0,3).join(', '); const more = names.length>3 ? ` +${names.length-3}` : ''; return head ? `${head}${more}` : '-'; } if(obj && typeof obj==='object'){ const keys = Object.keys(obj||{}); const head = keys.slice(0,3).join(', '); const more = keys.length>3 ? ` +${keys.length-3}` : ''; return head ? `${head}${more}` : '-'; } return '-'; }catch(_){ return '-'; }})()),
                React.createElement('td', { className:'px-6 py-3 text-sm' }, React.createElement(StatusTag, { enabled: String(it.status ?? '0') === '0' })),
                React.createElement('td', { className:'px-6 py-3 text-sm text-gray-700' }, (()=>{ const u = it.updatedAt || it.update_time || it.updated_at; return u ? new Date(u).toLocaleString() : '-'; })()),
                React.createElement('td', { className:'px-6 py-3 text-sm text-right' },
                  React.createElement('div', { className:'flex items-center justify-end gap-2 whitespace-nowrap' },
                    React.createElement('button', { className:'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300', onClick:()=>openTest(it) }, '测试'),
                    React.createElement('button', { className:'px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:()=>openEdit(it) }, '编辑'),
                    React.createElement('button', { className:'px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600', onClick:()=>handleCopy(it.id) }, '复制版本'),
                    React.createElement('button', { className: (String(it.status ?? '0') === '0' ? 'px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600' : 'px-3 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700'), onClick:()=>handleToggleStatus(it) }, String(it.status ?? '0') === '0' ? '禁用' : '启用'),
                    React.createElement('button', { className:'px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700', onClick:()=>handleDelete(it.id) }, '删除')
                  )
                )
              )
            )))
          )
        )
      ),
      React.createElement('div', { className:'flex items-center justify-between' },
        React.createElement('div', { className:'text-sm text-gray-600' }, `第 ${page + 1} / ${Math.max(totalPages,1)} 页`),
        React.createElement('div', { className:'space-x-2' },
          React.createElement('button', { className:'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50', disabled: page===0, onClick:()=>{ if(page>0) fetchList(page-1); } }, '上一页'),
          React.createElement('button', { className:'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50', disabled: page>=totalPages-1, onClick:()=>{ if(page<totalPages-1) fetchList(page+1); } }, '下一页')
        )
      ),
      showEdit ? React.createElement('div', { className:'fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4', onClick:onClosed },
        React.createElement('div', { className:'bg-white rounded-3xl shadow-2xl w-[92vw] max-w-[1600px] space-y-4 overflow-y-auto', style:{ maxHeight:'86vh' }, onClick:(e)=>e.stopPropagation() },
          React.createElement('div', { className:'flex items-center justify-between p-6 border-b' },
            React.createElement('div', { className:'text-xl font-bold text-gray-800' }, editData && editData.id ? '编辑模板' : '新增模板'),
            React.createElement('button', { className:'px-3 py-1 rounded-md bg-gray-200 text-gray-700', onClick:onClosed }, '关闭')
          ),
          window.Components && window.Components.PromptTemplateEdit ? React.createElement('div',{className:'p-6'}, React.createElement(window.Components.PromptTemplateEdit, { initialData: editData, onClose:onClosed, onSaved })) : React.createElement('div', { className:'p-6 text-gray-600' }, '编辑组件加载中...')
        )
      ) : null,
      showTest ? React.createElement('div', { className:'fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-auto' },
        React.createElement('div', { className:'bg-white rounded-xl shadow-2xl w-full p-6', style:{ width:'70vw', maxWidth:'70vw', maxHeight:'80vh' } },
          React.createElement('div', { className:'mb-4 flex items-center justify-between' },
            React.createElement('div', { className:'text-xl font-bold text-gray-800' }, '模板测试'),
            React.createElement('button', { className:'px-3 py-1 rounded-md bg-gray-200 text-gray-700', onClick:onTestClosed }, '关闭')
          ),
          window.Components && window.Components.PromptTemplateTest ? React.createElement(window.Components.PromptTemplateTest, { template:testData, onClose:onTestClosed }) : React.createElement('div', { className:'p-6 text-gray-600' }, '测试组件加载中...')
        )
      ) : null
    );
  };
  window.Components = window.Components || {}; window.Components.PromptTemplateManagement = PromptTemplateManagement; window.dispatchEvent(new Event('modules:loaded'));
})();
