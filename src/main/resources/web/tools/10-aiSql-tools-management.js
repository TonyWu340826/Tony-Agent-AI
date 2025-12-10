// --- 管理后台：AI功能管理（原 AIToolManagement） ---
(function(){ if (window.Components && window.Components.AIToolManagement) return; const AIToolManagement = () => {
  const { useState, useEffect } = React;
  const Lucide = window.LucideReact || {};
  const Fallback = (props) => React.createElement('span', { className: props && props.className });
  const IconCpu = (typeof Lucide.Cpu === 'function') ? Lucide.Cpu : Fallback;
  const IconPlus = (typeof Lucide.Plus === 'function') ? Lucide.Plus : Fallback;
  const IconSearch = (typeof Lucide.Search === 'function') ? Lucide.Search : Fallback;
  const IconEdit = (typeof Lucide.Edit === 'function') ? Lucide.Edit : Fallback;
  const IconTrash = (typeof Lucide.Trash2 === 'function') ? Lucide.Trash2 : Fallback;

  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editTool, setEditTool] = useState(null);
  const [addForm, setAddForm] = useState({ toolName: "", description: "", apiPath: "", iconUrl: "", isActive: true, vipAllow: "NO", categoryId: "" });
  const [categories, setCategories] = useState([]);
  const [catMap, setCatMap] = useState({});

  const fetchTools = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (typeFilter) params.set('type', parseInt(typeFilter, 10));
      const resp = await fetch(`/api/tools/admin?${params.toString()}`, { credentials: 'same-origin' });
      const text = await resp.text();
      let data = [];
      try { data = JSON.parse(text || '[]'); } catch (_) { throw new Error('接口异常'); }
      if (!resp.ok) throw new Error('加载失败');
      setTools(Array.isArray(data) ? data : []);
    } catch (e) { setError(e.message || '请求失败'); }
    finally { setLoading(false); }
  };

  useEffect(() => { (async()=>{ await fetchCategories(); await fetchTools(); })(); }, []);

  const fetchCategories = async () => {
    try {
      const resp = await fetch('/api/categories?type=2&page=0&size=1000', { credentials: 'same-origin' });
      const text = await resp.text(); let data = {}; try { data = JSON.parse(text||'{}'); } catch(_) { data = {}; }
      const list = Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []);
      setCategories(list);
      const m = {}; list.forEach(c => { m[c.id] = c.name; }); setCatMap(m);
    } catch(_) { setCategories([]); setCatMap({}); }
  };

  const TYPE_OPTIONS = categories.map(c => ({ value: c.id, label: c.name }));
  const typeLabel = (v) => catMap[v] || (typeof v === 'number' ? String(v) : '-');
  const VIP_OPTIONS = [ { value: 'NO', label: '所有人可用' }, { value: 'VIP', label: 'VIP99专享' } ];

  const openAdd = () => { setAddForm({ toolName: "", description: "", apiPath: "", iconUrl: "", isActive: true, categoryId: (TYPE_OPTIONS[0]?.value||''), vipAllow: 'NO' }); setShowAdd(true); };
  const openEdit = (tool) => { setEditTool({ ...tool, vipAllow: tool.vipAllow || 'NO', type: tool.type }); setShowEdit(true); };

  const handleAddSave = async () => {
    if (!addForm.toolName.trim()) { setError('请输入工具名称'); return; }
    if (!addForm.apiPath.trim()) { setError('请输入API路径'); return; }
    if (!addForm.categoryId) { setError('请选择分类'); return; }
    setLoading(true);
    setError("");
    try {
      const payload = { toolName: addForm.toolName.trim(), description: addForm.description || '', apiPath: addForm.apiPath.trim(), iconUrl: addForm.iconUrl || '', isActive: !!addForm.isActive, type: Number(addForm.categoryId), vipAllow: addForm.vipAllow || 'NO' };
      const resp = await fetch('/api/tools', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(payload) });
      const text = await resp.text(); let data = {}; try { data = JSON.parse(text || '{}'); } catch(_) {}
      if (!resp.ok) throw new Error((data && data.message) || '新增失败');
      setShowAdd(false);
      setAddForm({ toolName: "", description: "", apiPath: "", iconUrl: "", isActive: true, categoryId: "", vipAllow: 'NO' });
      fetchTools();
    } catch (e) { setError(e.message || '请求失败'); }
    finally { setLoading(false); }
  };

  const handleEditSave = async () => {
    if (!editTool) return;
    if (!editTool.toolName || !editTool.apiPath) { setError('名称与API路径必填'); return; }
    setLoading(true);
    setError("");
    try {
      const payload = { toolName: editTool.toolName, description: editTool.description || '', apiPath: editTool.apiPath, iconUrl: editTool.iconUrl || '', isActive: !!editTool.isActive, type: editTool.type ? Number(editTool.type) : undefined, vipAllow: editTool.vipAllow || 'NO' };
      const resp = await fetch(`/api/tools/${editTool.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(payload) });
      const text = await resp.text(); let data = {}; try { data = JSON.parse(text || '{}'); } catch(_) {}
      if (!resp.ok) throw new Error((data && data.message) || '更新失败');
      setShowEdit(false);
      setEditTool(null);
      fetchTools();
    } catch (e) { setError(e.message || '请求失败'); }
    finally { setLoading(false); }
  };

  const toggleActive = async (tool) => {
    const next = !tool.isActive;
    const patched = { toolName: tool.toolName, description: tool.description || '', apiPath: tool.apiPath, iconUrl: tool.iconUrl || '', isActive: next, type: tool.type ? parseInt(tool.type, 10) : 1, vipAllow: tool.vipAllow || 'NO' };
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`/api/tools/${tool.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(patched) });
      const text = await resp.text(); let data = {}; try { data = JSON.parse(text || '{}'); } catch(_) {}
      if (!resp.ok) throw new Error((data && data.message) || '状态更新失败');
      fetchTools();
    } catch(e) { setError(e.message || '请求失败'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('确认删除该工具？')) return;
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`/api/tools/${id}`, { method: 'DELETE', credentials: 'same-origin' });
      if (!resp.ok && resp.status !== 204) {
        const text = await resp.text();
        try { const data = JSON.parse(text || '{}'); throw new Error(data.message || '删除失败'); } catch(_) { throw new Error('删除失败'); }
      }
      fetchTools();
    } catch(e) { setError(e.message || '请求失败'); }
    finally { setLoading(false); }
  };

  return (
    React.createElement('div', { className: 'p-6 md:p-10 bg-white rounded-xl shadow-lg w-full h-full space-y-6' },
      React.createElement('h2', { className: 'text-3xl font-bold text-gray-800 flex items-center border-b pb-4 mb-4' },
        React.createElement(IconCpu, { className: 'w-7 h-7 mr-3 text-blue-600' }), ' AI功能管理'),
      React.createElement('div', { className: 'flex flex-col sm:flex-row justify之间 items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4' },
        React.createElement('button', { className: 'flex items-center bg-green-500 hover:bg-green-600 text白 font-medium py-2 px-4 rounded-lg shadow-md transition duration-150', onClick: openAdd },
          React.createElement(IconPlus, { className: 'w-5 h-5 mr-2' }), ' 新增工具'),
        React.createElement('div', { className: 'relative w-full sm:w-1/3' },
          React.createElement('input', { type: 'search', value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') fetchTools(); }, placeholder: '按名称/描述/API搜索...', className: 'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500' }),
          React.createElement(IconSearch, { className: 'w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' })
        ),
        React.createElement('select', { className: 'border border-gray-300 rounded-lg px-3 py-2 w-48', value: typeFilter, onChange: (e) => { setTypeFilter(e.target.value); } },
          React.createElement('option', { value: '' }, '全部分类'),
          ...TYPE_OPTIONS.map(o => React.createElement('option', { key: o.value, value: o.value }, o.label))
        ),
        React.createElement('button', { className: 'bg-blue-600 hover:bg-blue-700 text白 font-medium py-2 px-4 rounded-lg shadow-md', onClick: fetchTools }, '搜索')
      ),
      error && React.createElement('div', { className: 'bg-red-100 text红-700 border border-red-200 p-3 rounded-lg text-sm shadow-md' }, error),
      React.createElement('div', { className: 'overflow-x-auto bg白 rounded-lg border border-gray-200 shadow' },
        React.createElement('table', { className: 'min-w-full divide-y divide-gray-200 text-xs' },
          React.createElement('thead', { className: 'bg-gray-50' },
            React.createElement('tr', null,
              ['ID','名称','类型','权限','描述','API路径','图标','状态','操作'].map((h,i)=>React.createElement('th',{key:i,className:'px-4 py-3 text-left text-xs font-medium text-gray-500'},h))
            )
          ),
          React.createElement('tbody', { className: 'bg白 divide-y divide-gray-200' },
            loading ? React.createElement('tr', null, React.createElement('td', { className: 'px-4 py-6 text-center text-gray-500', colSpan: 6 }, '加载中...'))
            : tools.length === 0 ? React.createElement('tr', null, React.createElement('td', { className: 'px-4 py-6 text-center text-gray-500', colSpan: 8 }, '暂无数据'))
            : tools.map(t => React.createElement('tr', { key: t.id },
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, t.id),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, t.toolName),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, typeLabel(t.type)),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, (String(t.vipAllow||'NO').toUpperCase()==='VIP' ? 'VIP99专享' : '所有人可用')),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700 truncate max-w-[20rem]' }, t.description),
                React.createElement('td', { className: 'px-3 py-2 text-xs text-gray-700' }, React.createElement('span', { className:'truncate max-w-[12rem] inline-block' }, t.apiPath)),
                React.createElement('td', { className: 'px-4 py-3 text-sm' }, t.iconUrl ? React.createElement('img', { src: t.iconUrl, alt: 'icon', className: 'w-8 h-8 rounded object-cover' }) : '-'),
                React.createElement('td', { className: 'px-4 py-3 text-sm' }, (t.isActive ? '激活' : '禁用')),
                React.createElement('td', { className: 'px-3 py-2 text-xs' },
                  React.createElement('div', { className: 'flex items-center justify-end gap-2 whitespace-nowrap' },
                    React.createElement('button', { className: 'px-3 py-1 rounded-md bg-blue-600 text白 hover:bg-blue-700', onClick: () => openEdit(t) }, '编辑'),
                    React.createElement('button', { className: 'px-3 py-1 rounded-md bg-yellow-500 text白 hover:bg-yellow-600', onClick: () => toggleActive(t) }, (t.isActive ? '禁用' : '启用')),
                    React.createElement('button', { className: 'px-3 py-1 rounded-md bg-red-600 text白 hover:bg-red-700', onClick: () => handleDelete(t.id) }, '删除')
                  )
                )
              ))
          )
        )
      ),
      showAdd && React.createElement('div', { className: 'fixed inset-0 bg黑/30 flex items-center justify中心 p-4' },
        React.createElement('div', { className: 'bg白 rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4' },
          React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, '新增工具'),
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
            React.createElement('input', { className: 'border border-gray-300 rounded-lg px-3 py-2', placeholder: '名称', value: addForm.toolName, onChange: (e) => setAddForm({ ...addForm, toolName: e.target.value }) }),
            React.createElement('input', { className: 'border border-gray-300 rounded-lg px-3 py-2', placeholder: 'API路径', value: addForm.apiPath, onChange: (e) => setAddForm({ ...addForm, apiPath: e.target.value }) }),
            React.createElement('select', { className: 'border border-gray-300 rounded-lg px-3 py-2', value: addForm.categoryId, onChange: (e) => setAddForm({ ...addForm, categoryId: e.target.value }) },
              ...TYPE_OPTIONS.map(o => React.createElement('option', { key: o.value, value: o.value }, o.label))
            ),
            React.createElement('select', { className: 'border border-gray-300 rounded-lg px-3 py-2', value: addForm.vipAllow, onChange: (e) => setAddForm({ ...addForm, vipAllow: e.target.value }) },
              ...VIP_OPTIONS.map(o => React.createElement('option', { key: o.value, value: o.value }, o.label))
            ),
            React.createElement('input', { className: 'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2', placeholder: '图标URL(可选)', value: addForm.iconUrl, onChange: (e) => setAddForm({ ...addForm, iconUrl: e.target.value }) }),
            React.createElement('textarea', { className: 'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2', rows: 4, placeholder: '描述', value: addForm.description, onChange: (e) => setAddForm({ ...addForm, description: e.target.value }) }),
            React.createElement('label', { className: 'inline-flex items-center space-x-2 md:col-span-2' },
              React.createElement('input', { type: 'checkbox', checked: !!addForm.isActive, onChange: (e) => setAddForm({ ...addForm, isActive: e.target.checked }) }),
              React.createElement('span', { className: 'text-sm text-gray-700' }, '激活')
            )
          ),
          React.createElement('div', { className: 'flex justify-end space-x-2 pt-2' },
            React.createElement('button', { className: 'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick: () => { setShowAdd(false); setAddForm({ toolName: "", description: "", apiPath: "", iconUrl: "", isActive: true, categoryId: "", vipAllow: 'NO' }); } }, '取消'),
            React.createElement('button', { className: 'px-4 py-2 rounded-md bg-blue-600 text白 hover:bg-blue-700', onClick: handleAddSave }, '保存')
          )
        )
      ),
      showEdit && editTool && React.createElement('div', { className: 'fixed inset-0 bg黑/30 flex items-center justify中心 p-4' },
        React.createElement('div', { className: 'bg白 rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4' },
          React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, '编辑工具'),
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
            React.createElement('div', { className: 'text-sm text-gray-500 md:col-span-2' }, `ID: ${editTool.id}`),
            React.createElement('input', { className: 'border border-gray-300 rounded-lg px-3 py-2', placeholder: '名称', value: editTool.toolName ?? '', onChange: (e) => setEditTool({ ...editTool, toolName: e.target.value }) }),
            React.createElement('input', { className: 'border border-gray-300 rounded-lg px-3 py-2', placeholder: 'API路径', value: editTool.apiPath ?? '', onChange: (e) => setEditTool({ ...editTool, apiPath: e.target.value }) }),
            React.createElement('select', { className: 'border border-gray-300 rounded-lg px-3 py-2', value: (editTool.type ?? ''), onChange: (e) => setEditTool({ ...editTool, type: e.target.value }) },
              ...TYPE_OPTIONS.map(o => React.createElement('option', { key: o.value, value: o.value }, o.label))
            ),
            React.createElement('select', { className: 'border border-gray-300 rounded-lg px-3 py-2', value: (editTool.vipAllow ?? 'NO'), onChange: (e) => setEditTool({ ...editTool, vipAllow: e.target.value }) },
              ...VIP_OPTIONS.map(o => React.createElement('option', { key: o.value, value: o.value }, o.label))
            ),
            React.createElement('input', { className: 'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2', placeholder: '图标URL(可选)', value: editTool.iconUrl ?? '', onChange: (e) => setEditTool({ ...editTool, iconUrl: e.target.value }) }),
            React.createElement('textarea', { className: 'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2', rows: 4, placeholder: '描述', value: editTool.description ?? '', onChange: (e) => setEditTool({ ...editTool, description: e.target.value }) }),
            React.createElement('label', { className: 'inline-flex items-center space-x-2 md:col-span-2' },
              React.createElement('input', { type: 'checkbox', checked: !!editTool.isActive, onChange: (e) => setEditTool({ ...editTool, isActive: e.target.checked }) }),
              React.createElement('span', { className: 'text-sm text-gray-700' }, '激活')
            )
          ),
          React.createElement('div', { className: 'flex justify-end space-x-2 pt-2' },
            React.createElement('button', { className: 'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick: () => { setShowEdit(false); setEditTool(null); } }, '取消'),
            React.createElement('button', { className: 'px-4 py-2 rounded-md bg-blue-600 text白 hover:bg-blue-700', onClick: handleEditSave }, '保存')
          )
        )
      )
    )
  );
};
window.Components = window.Components || {};
window.Components.AIToolManagement = window.Components.AIToolManagement || AIToolManagement;
})();

// --- 用户端：工具合集（原 UserToolsExplorer） ---
(function(){ if (window.Components && window.Components.UserToolsExplorer) return; const UserToolsExplorer = ({ currentUser }) => {
  const { useEffect, useState } = React;
  const isVipUser = !!(currentUser && Number(currentUser.vipLevel) === 99);
  const [categories, setCategories] = useState([]);
  const [activeType, setActiveType] = useState(null);
  const [search, setSearch] = useState('');
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [toolReady, setToolReady] = useState(false);
  const [showFullScreenModal, setShowFullScreenModal] = useState(false);
  const loadScriptOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => s.src.endsWith(src))) { resolve(); return; } const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag); });

  // 监听关闭模态框事件
  useEffect(() => {
    const handleCloseModal = () => {
      setShowFullScreenModal(false);
      setActiveTool(null);
      setToolReady(false);
    };
    window.addEventListener('closeToolModal', handleCloseModal);
    return () => window.removeEventListener('closeToolModal', handleCloseModal);
  }, []);

  const load = async (type) => {
    setLoading(true);
    try {
      const url = (type && type!==null) ? `/api/tools/active?type=${type}` : '/api/tools/active';
      const r = await fetch(url, { credentials: 'same-origin' });
      const t = await r.text(); let d = []; try { d = JSON.parse(t || '[]'); } catch(_) { d = []; }
      let list = Array.isArray(d) ? d : [];
      if (type == null) { list = list.filter(x => Number(x.type) !== 10000); }
      setTools(list);
    } catch(_) { setTools([]); }
    setLoading(false);
  };
  useEffect(()=>{ load(activeType); }, [activeType]);
  useEffect(()=>{
    (async()=>{
      try {
        const r = await fetch('/api/categories/tree?type=2', { credentials:'same-origin' });
        const t = await r.text(); let d=[]; try{ d=JSON.parse(t||'[]'); }catch(_){ d=[]; }
        const flat = [];
        const walk = (nodes, prefix='') => {
          (nodes||[]).forEach(n => {
            flat.push({ id:n.id, name: prefix ? `${prefix} > ${n.name}` : n.name });
            if (Array.isArray(n.children) && n.children.length) walk(n.children, prefix ? `${prefix} > ${n.name}` : n.name);
          });
        };
        walk(d);
        setCategories(flat.length>0 ? [{ id:null, name:'全部' }, ...flat] : [{ id:null, name:'全部' }]);
      } catch(_){ setCategories([{ id:null, name:'全部' }]); }
    })();
  },[]);

  const filtered = tools.filter(x => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (x.toolName||'').toLowerCase().includes(s) || (x.description||'').toLowerCase().includes(s);
  });

  const openTool = (tool) => {
    const mustVip = String(tool.vipAllow||tool.vip_allow||'').toUpperCase() === 'VIP';
    if (mustVip && !isVipUser) { alert('该功能仅限 VIP99 使用'); return; }
    const ltRaw = tool.linkType ?? tool.link_type ?? '';
    const lt = String(ltRaw).toUpperCase();
    const api = String(tool.apiPath ?? tool.api_path ?? '');
    if (lt === '1' || lt === 'EXTERNAL') { if (api) { window.open(api, '_blank'); } return; }
    
    // 图像生成工具（ID=8）使用全屏模态框
    if (String(tool.id) === '8') {
      setActiveTool(tool);
      setShowFullScreenModal(true);
      const pageExists = !!(window.ToolsPages && window.ToolsPages['8']);
      setToolReady(pageExists);
      if (!pageExists) {
        loadScriptOnce('/tools/17-createImage-tools-management.js').then(()=>{
          setToolReady(!!(window.ToolsPages && window.ToolsPages['8']));
        }).catch(()=>{});
      }
      // 将关闭函数保存到 window 以便子组件调用
      window.__closeImageGenModal = () => {
        setShowFullScreenModal(false);
        setActiveTool(null);
        setToolReady(false);
      };
      return;
    }
    
    if (String(tool.id) === '10') {
      setActiveTool(tool);
      const pageExists10 = !!(window.ToolsPages && window.ToolsPages['10']);
      setToolReady(pageExists10);
      if (!pageExists10) {
        loadScriptOnce('/tools/10-aiSql-tools-management.js').then(()=>{
          setToolReady(!!(window.ToolsPages && window.ToolsPages['10']));
        }).catch(()=>{});
      }
      return;
    }
    if (Number(tool.type) === 20) {
      setActiveTool(tool);
      const pageExists10 = !!(window.ToolsPages && window.ToolsPages['10']);
      setToolReady(pageExists10);
      if (!pageExists10) {
        loadScriptOnce('/tools/10-aiSql-tools-management.js').then(()=>{
          setToolReady(!!(window.ToolsPages && window.ToolsPages['10']));
        }).catch(()=>{});
      }
      return;
    }
    const isVip = String(tool.vipAllow||tool.vip_allow||'').toUpperCase() === 'VIP';
    if (isVip && !isVipUser) { alert('该功能仅限 VIP99 使用'); return; }
    const lt2 = String(tool.linkType||tool.link_type||'').toUpperCase();
    const api2 = String(tool.apiPath||tool.api_path||'');
    if (lt2 === '1' || lt2 === 'EXTERNAL') { if (api2) { window.open(api2, '_blank'); } return; }
    if (lt === '3' || lt === 'EMBED') { setActiveTool(tool); setToolReady(true); return; }
    if (lt === '2' || lt === 'INTERNAL') {
      setActiveTool(tool);
      const pageExists = !!(window.ToolsPages && window.ToolsPages[String(tool.id)]);
      setToolReady(pageExists);
      if (!pageExists) {
        const path = (api2 || api).endsWith('.js') ? (api2 || api) : `${(api2 || api)}.js`;
        loadScriptOnce(`/tools/${path}`).then(()=>{
          setToolReady(!!(window.ToolsPages && window.ToolsPages[String(tool.id)]));
        }).catch(()=>{});
      }
      return;
    }
    // fallback：未配置 link_type 的兼容处理
    setActiveTool(tool);
    const fallbackPath = `/tools/${tool.id}-aiSql-tools-management.js`;
    const exists = !!(window.ToolsPages && window.ToolsPages[String(tool.id)]);
    setToolReady(exists);
    if (!exists) {
      loadScriptOnce(fallbackPath).then(()=>{
        setToolReady(!!(window.ToolsPages && window.ToolsPages[String(tool.id)]));
      }).catch(()=>{});
    }
  };

  const Card = (tool) => (
    React.createElement('div',{className:'bg白 rounded-2xl p-5 shadow border hover:shadow-lg transition cursor-pointer', onClick:()=>openTool(tool)},
      React.createElement('div',{className:'flex items-center gap-3'},
        tool.iconUrl ? React.createElement('img',{src:tool.iconUrl, className:'w-8 h-8 rounded', alt:tool.toolName}) : React.createElement('div',{className:'w-8 h-8 bg-slate-200 rounded'}),
        React.createElement('div',{className:'flex items-center gap-2'},
          React.createElement('span',{className:'font-semibold text-slate-900'}, tool.toolName),
          (String(tool.vipAllow||'').toUpperCase()==='VIP' ? React.createElement('span',{className:'inline-block px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-700 border border-amber-200'}, 'VIP') : null)
        )
      ),
      React.createElement('div',{className:'text-xs text-slate-600 mt-2'}, tool.description || '')
    )
  );

  return (
    React.createElement('div',{className:'grid grid-cols-12 gap-6'},
      React.createElement('aside',{className:'col-span-12 md:col-span-3'},
        React.createElement('div',{className:'bg白 rounded-2xl shadow border p-3'},
          React.createElement('div',{className:'font-semibold text-slate-900 mb-2'}, '分类'),
          categories.map(c => React.createElement('button',{key:(c.id===null?'all':c.id), className:((c.id===activeType)? 'bg-blue-600 text白' : 'text-slate-700 hover:bg-slate-100') + ' w-full text-left px-3 py-2 rounded-lg mb-2', onClick:()=>setActiveType(c.id)}, c.name))
        )
      ),
      React.createElement('section',{className:'col-span-12 md:col-span-9'},
        React.createElement('div',{className:'flex items-center justify之间 mb-4'},
          React.createElement('input',{className:'w-full md:w-64 border border-slate-300 rounded-lg px-3 py-2', placeholder:'搜索工具...', value:search, onChange:(e)=>setSearch(e.target.value)}),
          React.createElement('span',{className:'text-sm text-slate-500'}, `共 ${filtered.length} 项`)
        ),
        React.createElement('div',{className:'grid md:grid-cols-3 gap-6'},
          React.createElement('div',{className:'md:col-span-2'},
            loading ? React.createElement('div',{className:'grid md:grid-cols-3 gap-4'}, [1,2,3,4,5,6].map(i=>React.createElement('div',{key:i,className:'h-24 bg-slate-100 animate-pulse rounded-xl'})))
            : (filtered.length===0 ? React.createElement('div',{className:'text-slate-600 text-sm'}, '暂无数据')
               : React.createElement('div',{className:'grid md:grid-cols-3 gap-6'}, filtered.map(t=>React.createElement(Card,{...t, key:t.id})))
              )
          ),
          React.createElement('div',{className:'md:col-span-1'},
            activeTool ? (
              (()=>{
                const lt = String(activeTool.linkType||'').toUpperCase();
                if (lt === '3' || lt === 'EMBED') { return React.createElement('iframe',{src: activeTool.apiPath, className:'w-full h-[520px] rounded-xl border'}); }
                if (Number(activeTool.type) === 20 && window.ToolsPages && window.ToolsPages['10'] && toolReady) { return React.createElement(window.ToolsPages['10'], null); }
                if (window.ToolsPages && window.ToolsPages[String(activeTool.id)] && toolReady) { return React.createElement(window.ToolsPages[String(activeTool.id)], null); }
                return React.createElement('div',{className:'p-4 border rounded-xl bg白'}, '组件加载中...');
              })()
            ) : React.createElement('div',{className:'p-4 border rounded-xl bg白 text-sm text-slate-500'}, '选择工具以显示功能面板')
          )
        )
      )
      ,
      // 全屏模态框渲染
      showFullScreenModal && activeTool && toolReady && window.ToolsPages && window.ToolsPages[String(activeTool.id)] && 
        React.createElement(window.ToolsPages[String(activeTool.id)], null)
    )
  );
};
window.Components = window.Components || {};
window.Components.UserToolsExplorer = window.Components.UserToolsExplorer || UserToolsExplorer;
})();

// --- 智能DBA（工具ID=10）功能面板 ---
const Tool10 = () => {
  const { useState, useMemo } = React;
  const parseTables = (raw) => {
    try { const t = (raw||'').trim(); if (!t) return []; try { const j = JSON.parse(t); if (Array.isArray(j)) { return j.map(x=>x.name||x.table||x).filter(Boolean); } } catch(_) {} const names = new Set(); const re = /(CREATE\s+TABLE\s+`?(\w+)`?|\n\s*table\s*:\s*(\w+)|\b(t_[a-zA-Z0-9_]+)\b)/ig; let m; while ((m = re.exec(t))){ const n = m[2]||m[3]||m[4]; if(n) names.add(n); } return [...names]; } catch(_){ return []; } };
  const [raw, setRaw] = useState('');
  const tables = useMemo(()=>parseTables(raw), [raw]);
  const [selected, setSelected] = useState([]);
  const [need, setNeed] = useState('');
  const [sql, setSql] = useState('');
  const [loading, setLoading] = useState(false);
  const handleFile = async (e) => {
    try {
      const files = Array.from(e.target.files||[]);
      if (!files.length) return;
      const readers = await Promise.all(files.map(f => new Promise((resolve)=>{ const r = new FileReader(); r.onload = ()=>resolve(String(r.result||'')); r.readAsText(f); }))); 
      const merged = readers.join('\n\n');
      setRaw(prev => (prev ? (prev + '\n\n' + merged) : merged));
    } catch(_) {}
  };
  const toggle = (name) => setSelected(prev => prev.includes(name) ? prev.filter(x=>x!==name) : [...prev, name]);
  const copySql = async () => { try { if (!sql) return; await navigator.clipboard.writeText(sql); } catch(_){} };
  const gen = async () => { const prompt = (need||'').trim(); if (selected.length===0) { alert('请至少选择一张表'); return; } if(!prompt){ alert('请输入SQL需求'); return; } setLoading(true); setSql(''); try { const body = { user_prompt: prompt, selected_tables: selected, table_structures: raw ? [raw] : [] }; const r = await fetch('/api/open/sql/dba', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) }); const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; } setSql(d.sql||d.response||d.message||''); } catch(_) { setSql(''); alert('生成失败'); } setLoading(false); };
  return (
    React.createElement('div',{className:'grid grid-cols-12 gap-6'},
      React.createElement('aside',{className:'col-span-12 md:col-span-3'},
        React.createElement('div',{className:'border rounded-2xl p-3 bg白'},
          React.createElement('div',{className:'font-semibold text-slate-900 mb-2'}, '表清单'),
          React.createElement('div',{className:'space-y-1 max-h-[520px] overflow-auto'},
            tables.length? tables.map(n=>React.createElement('button',{key:n,className:(selected.includes(n)?'bg-blue-600 text白':'text-slate-700 hover:bg-slate-100')+' w-full text-left px-3 py-2 rounded-lg'}, n)) : React.createElement('div',{className:'text-xs text-slate-500'}, '暂无表')
          )
        )
      ),
      React.createElement('section',{className:'col-span-12 md:col-span-9'},
        React.createElement('div',{className:'space-y-4'},
          React.createElement('h3',{className:'text-lg font-bold text-slate-900'}, 'SQL 智能生成与执行助手'),
          React.createElement('div',{className:'space-y-2'},
            React.createElement('label',{className:'text-sm text-slate-700'}, '粘贴/上传表结构'),
            React.createElement('div',{className:'flex items-center gap-2'},
              React.createElement('input',{type:'file', accept:'.txt,.sql,.json', multiple:true, onChange:handleFile}),
              React.createElement('button',{className:'px-3 py-1 rounded bg-slate-100 text-slate-700', onClick:()=>setRaw('')}, '清空')
            ),
            React.createElement('textarea',{className:'w-full border border-slate-300 rounded-lg px-3 py-2', rows:6, placeholder:'支持粘贴 DDL 或 JSON 表结构', value:raw, onChange:(e)=>setRaw(e.target.value)}),
            React.createElement('div',{className:'text-xs text-slate-500'}, `已解析 ${tables.length} 张表`)
          ),
          React.createElement('div',{className:'grid grid-cols-2 gap-2'}, tables.map(n=>React.createElement('label',{key:n,className:'border rounded-xl p-2 flex items-center gap-2'}, React.createElement('input',{type:'checkbox', checked:selected.includes(n), onChange:()=>toggle(n)}), React.createElement('span',{className:'text-sm text-slate-900'}, n)) )),
          React.createElement('div',{className:'space-y-2'},
            React.createElement('label',{className:'text-sm text-slate-700'}, '请输入你的 SQL 需求'),
            React.createElement('textarea',{className:'w-full border border-slate-300 rounded-lg px-3 py-2', rows:4, placeholder:'例如：查询所有用户姓名和年龄', value:need, onChange:(e)=>setNeed(e.target.value)})
          ),
          React.createElement('div',{className:'flex items-center gap-3'},
            React.createElement('button',{className:'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50', disabled:loading || selected.length===0, onClick:gen}, loading?'生成中…':'生成 SQL'),
            React.createElement('span',{className:'text-xs text-slate-500'}, selected.length>0?`已选择：${selected.join(', ')}`:'请选择至少一张表')
          ),
          React.createElement('div',null,
            React.createElement('div',{className:'flex items-center justify-between'},
              React.createElement('label',{className:'text-sm text-slate-700'}, '生成结果'),
              React.createElement('button',{className:'px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200', onClick:copySql, disabled:!sql}, '复制')
            ),
            React.createElement('pre',{className:'bg-white border border-slate-200 rounded-lg p-3 text-sm whitespace-pre-wrap break-words min-h-[6rem] text-slate-900 font-mono'}, sql||'')
          )
        )
      )
    )
  );
};

window.ToolsPages = window.ToolsPages || {};
window.ToolsPages['10'] = Tool10;
window.Components = window.Components || {};
// 已在上方 IIFE 中按需注册，避免重复声明
window.Components.UserToolsExplorer = UserToolsExplorer;
try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}
