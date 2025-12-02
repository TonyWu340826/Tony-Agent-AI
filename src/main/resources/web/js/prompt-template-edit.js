(() => {
  const { useState, useEffect } = React;

  const PromptTemplateEdit = ({ initialData, onClose, onSaved }) => {
    const [form, setForm] = useState({
      model_type: '',
      version: 1,
      role_type: 'system',
      template_name: '',
      template_content: '',
      param_schema: '[]',
      status: 1
    });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const [optOpen, setOptOpen] = useState(false);
    const [optSrc, setOptSrc] = useState('');
    const [optOut, setOptOut] = useState('');
    const [optErr, setOptErr] = useState('');
    const [optLoading, setOptLoading] = useState(false);
    const [vars, setVars] = useState([]);

    // 无场景选择：新增模板不需要关联场景

    // 初始化表单数据
    useEffect(() => {
      if (initialData) {
        setForm({
          model_type: initialData.model_type || initialData.modelType || '',
          version: initialData.version ?? 1,
          role_type: initialData.role_type || initialData.roleType || 'system',
          template_name: initialData.template_name || initialData.templateName || '',
          template_content: initialData.template_content || initialData.templateContent || '',
          param_schema: typeof initialData.param_schema === 'string'
              ? initialData.param_schema
              : (initialData.param_schema ? JSON.stringify(initialData.param_schema, null, 2) : '[]'),
          status: Number(initialData.status ?? 1)
        });
        try {
          const obj = typeof initialData.param_schema === 'string'
              ? JSON.parse(initialData.param_schema || '[]')
              : (initialData.param_schema || []);
          const arr = Array.isArray(obj) ? obj : [];
          setVars(arr);
        } catch (_) { setVars([]); }
      }
    }, [initialData]);

    // 验证 JSON
    const validateJSON = () => {
      try {
        const obj = JSON.parse(form.param_schema || '[]');
        if (!Array.isArray(obj) && typeof obj !== 'object') throw new Error('JSON格式需为数组或对象');
        return { ok: true, obj };
      } catch (e) {
        return { ok: false, msg: e.message };
      }
    };

    // 保存
    const handleSave = async () => {
      setError('');
      const jsonCheck = validateJSON();
      if (!form.model_type) { setError('请选择模型类型'); return; }
      if (!form.role_type) { setError('请选择角色类型'); return; }
      if (!form.template_content.trim()) { setError('请输入模板内容'); return; }
      if (!jsonCheck.ok) { setError('参数结构JSON错误: ' + jsonCheck.msg); return; }

      setSaving(true);
      try {
        const payload = {
          model_type: form.model_type,
          version: Number(form.version || 1),
          role_type: form.role_type,
          template_name: form.template_name,
          template_content: form.template_content,
          param_schema: jsonCheck.obj,
          status: Number(form.status || 1)
        };
        let url = '/api/prompt/admin/templates';
        let method = 'POST';
        if (initialData && initialData.id) { url = `/api/prompt/admin/templates/${initialData.id}`; method = 'PUT'; }
        const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(payload) });
        const t = await r.text();
        let d = {};
        try { d = JSON.parse(t || '{}'); } catch (_) {}
        if (!r.ok || d.success === false) throw new Error(d.message || '保存失败');
        onSaved && onSaved();
      } catch (e) { setError(e.message || '请求失败'); } finally { setSaving(false); }
    };

    // 打开 AI 优化弹窗
    const openOptimize = () => { setOptSrc(form.template_content || ''); setOptOut(''); setOptErr(''); setOptOpen(true); };

    // 执行优化
    const runOptimize = async () => {
      setOptErr(''); setOptLoading(true); setOptOut('');
      let schemaTxt = form.param_schema || '';
      try { const obj = JSON.parse(schemaTxt || ''); schemaTxt = JSON.stringify(obj); } catch (_) {}
      try {
        const payload = { raw_prompt: optSrc || form.template_content || '', model_type: form.model_type, role_type: form.role_type, param_schema: schemaTxt };
        const r = await fetch('/api/open/prompt/optimize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(payload) });
        const t = await r.text(); let d = {};
        try { d = JSON.parse(t || '{}'); } catch (_) {}
        if (!r.ok) throw new Error(d.message || '优化失败');
        setOptOut(d.optimized || t || '');
      } catch (e) { setOptErr(e.message || '请求失败'); } finally { setOptLoading(false); }
    };

    const applyOptimized = () => { if (optOut) setForm({ ...form, template_content: optOut }); setOptOpen(false); };

    const parseVarsFromSchema = (text) => { try { const obj = JSON.parse(text || '[]'); return Array.isArray(obj) ? obj : []; } catch (_) { return []; } };
    const syncVarsToSchema = (nextVars) => { const arr = nextVars ?? vars; const s = JSON.stringify(arr, null, 2); setForm(f => ({ ...f, param_schema: s })); };
    const addVar = () => { const next = [...vars, { name:'', label:'', type:'text', note:'' }]; setVars(next); syncVarsToSchema(next); };
    const updateVar = (idx, key, val) => { const next = vars.map((v,i)=> i===idx ? { ...v, [key]: val } : v); setVars(next); syncVarsToSchema(next); };
    const removeVar = (idx) => { const next = vars.filter((_,i)=>i!==idx); setVars(next); syncVarsToSchema(next); };

    // ✅ 最终返回
    return React.createElement('div', { className: 'space-y-4' },
        // 错误提示
        error && React.createElement('div', { className: 'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md mb-2' }, error),

        // 场景 & 模型选择
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
            null,
            React.createElement('select', {
                  className: 'border border-gray-300 rounded-lg px-3 py-2',
                  value: form.model_type,
                  onChange: e => setForm({ ...form, model_type: e.target.value })
                },
                ['gpt-4o','deepseek-chat','glm-4','claude-3','qwen-2'].map(m => React.createElement('option', { key:m, value:m }, m.toUpperCase()))
            ),
            React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2', placeholder:'版本号', value:form.version, onChange:e=>setForm({ ...form, version:e.target.value }) }),
            React.createElement('select', {
                  className:'border border-gray-300 rounded-lg px-3 py-2',
                  value:form.role_type,
                  onChange:e=>setForm({ ...form, role_type:e.target.value })
                },
                ['system','user','assistant'].map(r => React.createElement('option', { key:r, value:r }, r))
            ),
            React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2', placeholder:'模板名称', value:form.template_name, onChange:e=>setForm({ ...form, template_name:e.target.value }) }),
            React.createElement('div', { className:'md:col-span-2 relative' },
                React.createElement('button', { className:'absolute right-2 -top-9 text-purple-600 text-sm', onClick:openOptimize }, '使用AI优化'),
                React.createElement('textarea', {
                  className:'border border-gray-300 rounded-lg px-3 py-2 w-full',
                  rows:6,
                  placeholder:'请输入提示词内容，使用 {{variable_name}} 定义变量',
                  value:form.template_content,
                  onChange:e=>setForm({ ...form, template_content:e.target.value })
                })
            ),
            // 变量设置
            React.createElement('div', { className:'md:col-span-2 border rounded-lg p-4 space-y-3' },
                React.createElement('div', { className:'flex items-center justify-between' },
                    React.createElement('div', { className:'text-sm font-semibold text-gray-700' }, '变量设置（可选）'),
                    React.createElement('button', { className:'text-blue-600 text-sm', onClick:addVar }, '+ 添加变量')
                ),
                React.createElement('div', { className:'space-y-3' },
                    vars.map((v, idx) => React.createElement('div', { key:idx, className:'grid grid-cols-1 md:grid-cols-4 gap-3 items-start' },
                        React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2', placeholder:'变量名，例如: username', value:v.name || '', onChange:e=>updateVar(idx,'name',e.target.value) }),
                        React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2', placeholder:'变量描述，例如: 用户名称', value:v.label || '', onChange:e=>updateVar(idx,'label',e.target.value) }),
                        React.createElement('select', { className:'border border-gray-300 rounded-lg px-3 py-2', value:v.type || 'text', onChange:e=>updateVar(idx,'type',e.target.value) },
                            ['text','number','boolean','select'].map(t => React.createElement('option', { key:t, value:t }, t.toUpperCase()))
                        ),
                        React.createElement('div', { className:'flex items-center justify-between' },
                            React.createElement('input', { className:'border border-gray-300 rounded-lg px-3 py-2 w-full', placeholder:'备注说明', value:v.note || '', onChange:e=>updateVar(idx,'note',e.target.value) }),
                            React.createElement('button', { className:'ml-3 text-red-600 text-sm', onClick:()=>removeVar(idx) }, '删除此变量')
                        )
                    ))
                )
            ),
            
            React.createElement('textarea', {
              className:'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2 font-mono text-sm',
              rows:8,
              placeholder:'参数结构 JSON',
              value:form.param_schema,
              onChange:e=>{ const val = e.target.value; setForm({ ...form, param_schema: val }); setVars(parseVarsFromSchema(val)); }
            }),
            React.createElement('label', { className:'inline-flex items-center space-x-2 md:col-span-2' },
                React.createElement('input', { type:'checkbox', checked: Number(form.status)===1, onChange:e=>setForm({ ...form, status: e.target.checked ? 1 : 0 }) }),
                React.createElement('span', { className:'text-sm text-gray-700' }, '启用此模板')
            ),
            React.createElement('div', { className:'flex justify-end space-x-2 pt-2' },
                React.createElement('button', { className:'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick:()=>onClose && onClose() }, '取消'),
                React.createElement('button', { className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50', disabled:saving, onClick:handleSave }, '保存')
            )
        ),
        optOpen && React.createElement('div', { className:'fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4' },
          React.createElement('div', { className:'bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-6 space-y-4' },
            React.createElement('div', { className:'text-xl font-bold text-gray-800' }, 'AI 提示词优化'),
            optErr && React.createElement('div', { className:'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md' }, optErr),
            React.createElement('div', { className:'grid grid-cols-1 md:grid-cols-2 gap-4' },
              React.createElement('div', { className:'space-y-2' },
                React.createElement('div', { className:'text-sm text-gray-700 flex items-center justify-between' },
                  React.createElement('span', null, '原始提示词'),
                  React.createElement('span', { className:'text-gray-400 text-xs' }, '可编辑')
                ),
                React.createElement('textarea', { className:'border border-gray-300 rounded-lg px-3 py-2 w-full h-60', value:optSrc, onChange:e=>setOptSrc(e.target.value) })
              ),
              React.createElement('div', { className:'space-y-2' },
                React.createElement('div', { className:'text-sm text-gray-700' }, 'AI 优化后'),
                React.createElement('div', { className:'border border-gray-200 rounded-lg p-3 bg-gray-50 min-h-[15rem] text-sm whitespace-pre-wrap' }, optOut || '点击左侧“开始 AI 优化”按钮')
              )
            ),
            React.createElement('div', { className:'flex items-center justify-between' },
              React.createElement('div', { className:'text-gray-500 text-xs' }, '提示：使用 {{variable_name}} 格式定义变量；优化历史可对比'),
              React.createElement('div', { className:'space-x-2' },
                React.createElement('button', { className:'px-5 py-2 rounded-md text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50', disabled:optLoading, onClick:runOptimize }, '开始 AI 优化'),
                React.createElement('button', { className:'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick:()=>setOptOpen(false) }, '关闭')
              )
            )
          )
        )
    );
  };

  window.Components = window.Components || {};
  window.Components.PromptTemplateEdit = PromptTemplateEdit;
  window.dispatchEvent(new Event('modules:loaded'));
})();
