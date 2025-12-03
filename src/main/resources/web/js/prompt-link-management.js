(() => {
  const { useState, useEffect } = React;

  const PromptLinkManagement = () => {
    const [scenes, setScenes] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showEdit, setShowEdit] = useState(false);
    const [form, setForm] = useState({ scene_name:'', status:0, description:'' });

    const fetchScenes = async (keyword='', status='') => {
      setLoading(true); setError('');
      try {
        const p = new URLSearchParams(); p.set('page', 0); p.set('size', 1000); if (keyword) p.set('keyword', keyword); if (status !== '' && status !== null) p.set('status', status);
        const resp = await fetch(`/api/prompt/admin/scenes?${p.toString()}`, { credentials:'same-origin' });
        const t = await resp.text(); let d={}; try { d = JSON.parse(t || '{}'); } catch(_) {}
        const arr = Array.isArray(d) ? d : (Array.isArray(d.content) ? d.content : []);
        setScenes(arr || []);
      } catch(e){ setError(e.message || '加载失败'); } finally { setLoading(false); }
    };
    const remove = async (id) => {
      if (!id) return;
      if (!window.confirm('确认删除该场景？')) return;
      setLoading(true); setError('');
      try {
        const resp = await fetch(`/api/prompt/admin/scenes/${id}`, { method:'DELETE', credentials:'same-origin' });
        const t = await resp.text(); let d={}; try { d = JSON.parse(t || '{}'); } catch(_) {}
        if (!resp.ok || d.success===false) throw new Error(d.message || '删除失败');
        fetchScenes(search, statusFilter);
      } catch(e){ setError(e.message || '请求失败'); } finally { setLoading(false); }
    };

    useEffect(() => { fetchScenes(); }, []);

    const openAdd = () => { setForm({ scene_name:'', status:0, description:'' }); setShowEdit(true); };
    const openEdit = (sc) => { setForm({ id: sc.id, scene_code: sc.sceneCode || sc.scene_code || '', scene_name: sc.sceneName || sc.scene_name || '', status: sc.status ?? 1, description: sc.description || '' }); setShowEdit(true); };

    const save = async () => {
      setLoading(true); setError('');
      try {
        const payload = { sceneName: form.scene_name.trim(), status: Number(form.status||0), description: form.description || '' };
        if (!payload.sceneName) throw new Error('请输入场景名称');
        const method = form.id ? 'PUT' : 'POST';
        const url = form.id ? `/api/prompt/admin/scenes/${form.id}` : '/api/prompt/admin/scenes';
        const resp = await fetch(url, { method, headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify(payload) });
        const t = await resp.text(); let d={}; try { d = JSON.parse(t || '{}'); } catch(_) {}
        if (!resp.ok || d.success===false) throw new Error(d.message || '保存失败');
        setShowEdit(false); fetchScenes(search, statusFilter);
      } catch(e){ setError(e.message || '请求失败'); } finally { setLoading(false); }
    };

    const setStatus = async (sc, status) => {
      if (!sc || !sc.id) return;
      setLoading(true); setError('');
      try {
        const payload = { sceneCode: sc.sceneCode || sc.scene_code || '', sceneName: sc.sceneName || sc.scene_name || '', description: sc.description || '', status: Number(status) };
        const resp = await fetch(`/api/prompt/admin/scenes/${sc.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify(payload) });
        const t = await resp.text(); let d={}; try { d = JSON.parse(t || '{}'); } catch(_) {}
        if (!resp.ok || d.success===false) throw new Error(d.message || '修改状态失败');
        fetchScenes(search, statusFilter);
      } catch(e){ setError(e.message || '请求失败'); } finally { setLoading(false); }
    };

    return React.createElement('div', { className:'p-6 md:p-10 bg-white rounded-xl shadow-lg w-full h-full space-y-6' },
      React.createElement('div', { className:'flex items-center justify-between' },
        React.createElement('h2', { className:'text-3xl font-bold text-gray-800' }, '提示词场景'),
        React.createElement('div', { className:'flex items-center gap-2' },
          React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2 w-64', placeholder:'按编码/名称搜索', value:search, onChange:e=>setSearch(e.target.value), onKeyDown:e=>{ if(e.key==='Enter') fetchScenes(search, statusFilter); } }),
          React.createElement('select', { className:'border border-gray-300 rounded-lg px-3 py-2', value:statusFilter, onChange:e=>setStatusFilter(e.target.value) },
            React.createElement('option', { value:'' }, '全部'),
            React.createElement('option', { value:'0' }, '启用'),
            React.createElement('option', { value:'1' }, '禁用')
          ),
          React.createElement('button', { className:'px-3 py-2 rounded-md bg-blue-600 text-white', onClick:()=>fetchScenes(search, statusFilter) }, '搜索'),
          React.createElement('button', { className:'px-4 py-2 rounded-md bg-green-600 text-white', onClick:openAdd }, '新增场景')
        )
      ),
      error ? React.createElement('div', { className:'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md' }, error) : null,
      React.createElement('div', { className:'overflow-x-auto bg-white rounded-lg border border-gray-200 shadow' },
        React.createElement('table', { className:'min-w-full divide-y divide-gray-200' },
          React.createElement('thead', { className:'bg-gray-50' }, React.createElement('tr', null, ['场景编码','场景名称','状态','描述','操作'].map((h,i)=>React.createElement('th',{key:i,className:'px-4 py-3 text-left text-xs font-medium text-gray-500'},h)))),
          React.createElement('tbody', { className:'bg-white divide-y divide-gray-200' },
            loading ? React.createElement('tr', null, React.createElement('td', { className:'px-4 py-6 text-center text-gray-500', colSpan:5 }, '加载中...')) : (scenes.length===0 ? React.createElement('tr', null, React.createElement('td', { className:'px-4 py-6 text-center text-gray-500', colSpan:5 }, '暂无数据')) : scenes.map(sc => (
              React.createElement('tr', { key: sc.id || sc.sceneCode },
                React.createElement('td', { className:'px-4 py-3 text-sm text-gray-700' }, sc.sceneCode || sc.scene_code),
                React.createElement('td', { className:'px-4 py-3 text-sm text-gray-700' }, sc.sceneName || sc.scene_name || '-'),
                React.createElement('td', { className:'px-4 py-3 text-sm text-gray-700' }, Number(sc.status)===0?'启用':'禁用'),
                React.createElement('td', { className:'px-4 py-3 text-sm text-gray-700' }, sc.description || '-'),
                React.createElement('td', { className:'px-4 py-3 text-sm text-right' },
                  React.createElement('div', { className:'flex items-center justify-end gap-2' },
                    React.createElement('button', { className:'px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:()=>openEdit(sc) }, '编辑'),
                    React.createElement('button', { className: (Number(sc.status)===0 ? 'px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600' : 'px-3 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700'), onClick:()=>setStatus(sc, Number(sc.status)===0 ? 1 : 0) }, Number(sc.status)===0 ? '禁用' : '启用'),
                    React.createElement('button', { className:'px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700', onClick:()=>remove(sc.id) }, '删除')
                  )
                )
              )
            )))
          )
        )
      ),
      showEdit && React.createElement('div', { className:'fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4' },
        React.createElement('div', { className:'bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 space-y-4' },
          React.createElement('div', { className:'text-xl font-bold text-gray-800' }, form.id ? '编辑场景' : '新增场景'),
          React.createElement('div', { className:'grid grid-cols-1 md:grid-cols-2 gap-3' },
            form.id ? React.createElement('div', { className:'md:col-span-2' },
              React.createElement('label', { className:'block text-sm text-gray-600 mb-1' }, '场景编码'),
              React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-50', value:form.scene_code || '', readOnly:true })
            ) : null,
            React.createElement('div', { className:'md:col-span-2' },
              React.createElement('label', { className:'block text-sm text-gray-600 mb-1' }, '场景名称'),
              React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2 w-full', placeholder:'请输入场景名称', value:form.scene_name, onChange:e=>setForm({ ...form, scene_name:e.target.value }) })
            ),
            React.createElement('div', { className:'md:col-span-2' },
              React.createElement('label', { className:'block text-sm text-gray-600 mb-1' }, '场景描述'),
              React.createElement('textarea', { className:'border border-gray-300 rounded-lg px-3 py-2 w-full', rows:3, placeholder:'请输入场景描述（可选）', value:form.description, onChange:e=>setForm({ ...form, description:e.target.value }) })
            ),
            React.createElement('div', { className:'md:col-span-2' },
              React.createElement('label', { className:'block text-sm text-gray-600 mb-1' }, '启用状态'),
              React.createElement('div', { className:'flex items-center gap-4' },
                React.createElement('label', { className:'inline-flex items-center gap-2' },
                  React.createElement('input', { type:'radio', name:'scene-status', checked:Number(form.status)===0, onChange:()=>setForm({ ...form, status:0 }) }),
                  React.createElement('span', null, '启用')
                ),
                React.createElement('label', { className:'inline-flex items-center gap-2' },
                  React.createElement('input', { type:'radio', name:'scene-status', checked:Number(form.status)===1, onChange:()=>setForm({ ...form, status:1 }) }),
                  React.createElement('span', null, '禁用')
                )
              )
            )
          ),
          React.createElement('div', { className:'flex items-center justify-end gap-2' },
            React.createElement('button', { className:'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick:()=>setShowEdit(false) }, '取消'),
            React.createElement('button', { className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:save }, '保存')
          )
        )
      )
    );
  };

  window.Components = window.Components || {}; window.Components.PromptLinkManagement = PromptLinkManagement; window.dispatchEvent(new Event('modules:loaded'));
})();

