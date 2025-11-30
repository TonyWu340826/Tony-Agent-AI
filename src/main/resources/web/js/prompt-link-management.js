(() => {
  const { useState, useEffect } = React;

  const PromptLinkManagement = () => {
    const [scenes, setScenes] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showEdit, setShowEdit] = useState(false);
    const [form, setForm] = useState({ scene_name:'', template_code:'', status:1, description:'' });

    const fetchScenes = async () => {
      setLoading(true); setError('');
      try {
        const resp = await fetch('/api/prompt/admin/scenes?page=0&size=1000', { credentials:'same-origin' });
        const t = await resp.text(); let d={}; try { d = JSON.parse(t || '{}'); } catch(_) {}
        const arr = Array.isArray(d) ? d : (Array.isArray(d.content) ? d.content : []);
        setScenes(arr || []);
      } catch(e){ setError(e.message || '加载失败'); } finally { setLoading(false); }
    };

    const fetchTemplates = async (keyword='') => {
      try {
        const p = new URLSearchParams(); p.set('page', 0); p.set('size', 1000); if (keyword) p.set('keyword', keyword);
        const resp = await fetch(`/api/prompt/admin/templates?${p.toString()}`, { credentials:'same-origin' });
        const t = await resp.text(); let d={}; try { d = JSON.parse(t || '{}'); } catch(_) {}
        const arr = Array.isArray(d) ? d : (Array.isArray(d.content) ? d.content : []);
        setTemplates(arr || []);
      } catch(_){}
    };

    useEffect(() => { fetchScenes(); fetchTemplates(); }, []);

    const openAdd = () => { setForm({ scene_name:'', template_code:'', status:1, description:'' }); setShowEdit(true); };
    const openEdit = (sc) => { setForm({ scene_name: sc.sceneName || sc.scene_name || '', template_code: sc.templateCode || sc.template_code || '', status: sc.status ?? 1, description: sc.description || '' }); setShowEdit(true); };

    const save = async () => {
      setLoading(true); setError('');
      try {
        const payload = { scene_name: form.scene_name.trim(), template_code: form.template_code.trim(), status: Number(form.status||1), description: form.description || '' };
        if (!payload.scene_name) throw new Error('请输入场景名称');
        if (!payload.template_code) throw new Error('请选择模板编码');
        const resp = await fetch('/api/prompt/admin/scenes', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify(payload) });
        const t = await resp.text(); let d={}; try { d = JSON.parse(t || '{}'); } catch(_) {}
        if (!resp.ok || d.success===false) throw new Error(d.message || '保存失败');
        setShowEdit(false); fetchScenes();
      } catch(e){ setError(e.message || '请求失败'); } finally { setLoading(false); }
    };

    return React.createElement('div', { className:'p-6 md:p-10 bg-white rounded-xl shadow-lg w-full h-full space-y-6' },
      React.createElement('div', { className:'flex items-center justify-between' },
        React.createElement('h2', { className:'text-3xl font-bold text-gray-800' }, '提示词关联'),
        React.createElement('button', { className:'px-4 py-2 rounded-md bg-green-600 text-white', onClick:openAdd }, '新增关联')
      ),
      error ? React.createElement('div', { className:'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md' }, error) : null,
      React.createElement('div', { className:'overflow-x-auto bg-white rounded-lg border border-gray-200 shadow' },
        React.createElement('table', { className:'min-w-full divide-y divide-gray-200' },
          React.createElement('thead', { className:'bg-gray-50' }, React.createElement('tr', null, ['场景编码','场景名称','模板编码','状态','操作'].map((h,i)=>React.createElement('th',{key:i,className:'px-4 py-3 text-left text-xs font-medium text-gray-500'},h)))),
          React.createElement('tbody', { className:'bg-white divide-y divide-gray-200' },
            loading ? React.createElement('tr', null, React.createElement('td', { className:'px-4 py-6 text-center text-gray-500', colSpan:5 }, '加载中...')) : (scenes.length===0 ? React.createElement('tr', null, React.createElement('td', { className:'px-4 py-6 text-center text-gray-500', colSpan:5 }, '暂无数据')) : scenes.map(sc => (
              React.createElement('tr', { key: sc.id || sc.sceneCode },
                React.createElement('td', { className:'px-4 py-3 text-sm text-gray-700' }, sc.sceneCode || sc.scene_code),
                React.createElement('td', { className:'px-4 py-3 text-sm text-gray-700' }, sc.sceneName || sc.scene_name || '-'),
                React.createElement('td', { className:'px-4 py-3 text-sm text-gray-700' }, sc.templateCode || sc.template_code || '-'),
                React.createElement('td', { className:'px-4 py-3 text-sm text-gray-700' }, sc.status===1?'启用':'停用'),
                React.createElement('td', { className:'px-4 py-3 text-sm text-right' },
                  React.createElement('button', { className:'px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:()=>openEdit(sc) }, '编辑')
                )
              )
            )))
          )
        )
      ),
      showEdit && React.createElement('div', { className:'fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4' },
        React.createElement('div', { className:'bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 space-y-4' },
          React.createElement('div', { className:'text-xl font-bold text-gray-800' }, '关联场景与模板'),
          React.createElement('div', { className:'grid grid-cols-1 md:grid-cols-2 gap-3' },
            React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2', placeholder:'场景名称', value:form.scene_name, onChange:e=>setForm({ ...form, scene_name:e.target.value }) }),
            React.createElement('div', { className:'flex items-center gap-2' },
              React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2 flex-1', placeholder:'搜索模板名称', value:search, onChange:e=>{ setSearch(e.target.value); fetchTemplates(e.target.value); } }),
            ),
            React.createElement('select', { className:'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2', value:form.template_code, onChange:e=>setForm({ ...form, template_code:e.target.value }) },
              React.createElement('option', { value:'' }, '选择模板编码'),
              ...(Array.isArray(templates)?templates:[]).map(t => React.createElement('option', { key:t.id, value:t.code }, `${t.code} - ${t.templateName || t.template_name || ''}`))
            ),
            React.createElement('textarea', { className:'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2', rows:3, placeholder:'场景描述（可选）', value:form.description, onChange:e=>setForm({ ...form, description:e.target.value }) }),
            React.createElement('label', { className:'inline-flex items-center space-x-2 md:col-span-2' }, React.createElement('input', { type:'checkbox', checked:Number(form.status)===1, onChange:e=>setForm({ ...form, status:e.target.checked?1:0 }) }), React.createElement('span', { className:'text-sm text-gray-700' }, '启用'))
          ),
          React.createElement('div', { className:'flex items-center justify-end gap-2' },
            React.createElement('button', { className:'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick:()=>setShowEdit(false) }, '取消'),
            React.createElement('button', { className:'px-4 py-2 rounded-md bg-blue-600 text白 hover:bg-blue-700', onClick:save }, '保存')
          )
        )
      )
    );
  };

  window.Components = window.Components || {}; window.Components.PromptLinkManagement = PromptLinkManagement; window.dispatchEvent(new Event('modules:loaded'));
})();

