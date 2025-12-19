(() => {
  const { useState, useEffect, useRef } = React;

  const PromptTemplateEdit = ({ initialData, onClose, onSaved }) => {
    const [form, setForm] = useState({
      scene_code: '',
      model_type: 'gpt-4o',
      version: 1,
      role_type: 'system',
      template_name: '',
      template_content: '',
      param_schema: '[]',
      status: 0
    });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const [optOpen, setOptOpen] = useState(false);
    const [optSrc, setOptSrc] = useState('');
    const [optOut, setOptOut] = useState('');
    const [optErr, setOptErr] = useState('');
    const [optLoading, setOptLoading] = useState(false);
    const [vars, setVars] = useState([]);
    const contentRef = useRef(null);
    const [lastVarName, setLastVarName] = useState('');
    const [sceneOptions, setSceneOptions] = useState([]);
    const [previewCollapsed, setPreviewCollapsed] = useState(true);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [jsonCollapsed, setJsonCollapsed] = useState(true);

    useEffect(() => {
      (async () => {
        try {
          const resp = await fetch('/api/prompt/admin/scenes?page=0&size=1000&status=0', { credentials:'same-origin' });
          const t = await resp.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){}
          const arr = Array.isArray(d) ? d : (Array.isArray(d.content) ? d.content : []);
          setSceneOptions(arr || []);
        } catch(_) { setSceneOptions([]); }
      })();
    }, []);

    // 初始化表单数据
    useEffect(() => {
      if (initialData) {
        const schemaRaw = (initialData.param_schema !== undefined && initialData.param_schema !== null)
          ? initialData.param_schema
          : (initialData.paramSchema !== undefined ? initialData.paramSchema : undefined);
        const schemaText = typeof schemaRaw === 'string'
          ? schemaRaw
          : (schemaRaw ? JSON.stringify(schemaRaw, null, 2) : '[]');
        setForm({
          scene_code: initialData.scene_code || initialData.sceneCode || '',
          model_type: initialData.model_type || initialData.modelType || 'gpt-4o',
          version: initialData.version ?? 1,
          role_type: initialData.role_type || initialData.roleType || 'system',
          template_name: initialData.template_name || initialData.templateName || '',
          template_content: initialData.template_content || initialData.templateContent || '',
          param_schema: schemaText,
          status: Number(initialData.status ?? 0)
        });
        try {
          const obj = typeof schemaRaw === 'string'
            ? JSON.parse(schemaRaw || '[]')
            : (schemaRaw || []);
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
    const handleSave = async (overrideContent) => {
      setError('');
      const jsonCheck = validateJSON();
      if (!form.model_type) { setError('请选择模型类型'); return; }
      if (!form.role_type) { setError('请选择角色类型'); return; }
      if (!String((overrideContent ?? form.template_content) || '').trim()) { setError('请输入模板内容'); return; }
      if (!jsonCheck.ok) { setError('参数结构JSON错误: ' + jsonCheck.msg); return; }
      if (!(initialData && initialData.id) && !String(form.scene_code||'').trim()) { setError('请选择场景编码'); return; }

      setSaving(true);
      try {
        const payload = {
          scene_code: form.scene_code || '',
          model_type: form.model_type,
          version: Number(form.version || 1),
          role_type: form.role_type,
          template_name: form.template_name,
          template_content: overrideContent ?? form.template_content,
          param_schema: jsonCheck.obj,
          status: Number(form.status ?? 0)
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
        const payload = { paramSchema: schemaTxt, promt: optSrc || form.template_content || '', roleType: form.role_type };
        const r = await fetch('/api/open/prompt/optimizePrompt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(payload) });
        const t = await r.text(); let d = {};
        try { d = JSON.parse(t || '{}'); } catch (_) {}
        if (!r.ok) throw new Error(d.message || '优化失败');
        setOptOut(d.optimizedPrompt || t || '');
      } catch (e) { setOptErr(e.message || '请求失败'); } finally { setOptLoading(false); }
    };

    const applyOptimized = () => { if (optOut) setForm({ ...form, template_content: optOut }); setOptOpen(false); };

    const parseVarsFromSchema = (text) => { try { const obj = JSON.parse(text || '[]'); return Array.isArray(obj) ? obj : []; } catch (_) { return []; } };
    const syncVarsToSchema = (nextVars) => { const arr = nextVars ?? vars; const s = JSON.stringify(arr, null, 2); setForm(f => ({ ...f, param_schema: s })); };
    const addVar = () => { const next = [...vars, { name:'', label:'', type:'string', note:'' }]; setVars(next); syncVarsToSchema(next); };
    const updateVar = (idx, key, val) => { const next = vars.map((v,i)=> i===idx ? { ...v, [key]: val } : v); setVars(next); syncVarsToSchema(next); };
    const removeVar = (idx) => { const next = vars.filter((_,i)=>i!==idx); setVars(next); syncVarsToSchema(next); };

    const insertVarToken = (name) => {
      const nm = String(name||'').trim(); if(!nm) return;
      const token = `{${nm}}`;
      try {
        const el = contentRef.current;
        if (el && typeof el.selectionStart === 'number') {
          const start = el.selectionStart, end = el.selectionEnd;
          const prev = form.template_content || '';
          const next = prev.slice(0, start) + token + prev.slice(end);
          setForm({ ...form, template_content: next });
          setTimeout(()=>{ try{ el.focus(); el.selectionStart = el.selectionEnd = start + token.length; }catch(_){} }, 0);
          setLastVarName(nm);
          return;
        }
      } catch(_){}
      setForm({ ...form, template_content: (form.template_content||'') + token });
      setLastVarName(nm);
    };

    const handleContentChange = (e) => {
      const el = e.target;
      let val = String(el.value||'');
      const start = el.selectionStart || 0;
      const before = val.slice(0, start);
      const after = val.slice(start);
      const hasEmptyBraces = /\{\}\s*$/.test(before);
      if (hasEmptyBraces) {
        const names = (vars||[]).map(v=>String(v.name||'').trim()).filter(Boolean);
        const pick = lastVarName && names.includes(lastVarName) ? lastVarName : (names[0]||'');
        if (pick) {
          const replacedBefore = before.replace(/\{\}$/, `{${pick}}`);
          val = replacedBefore + after;
          setForm({ ...form, template_content: val });
          setLastVarName(pick);
          setTimeout(()=>{ try{ contentRef.current && contentRef.current.focus(); contentRef.current.selectionStart = contentRef.current.selectionEnd = replacedBefore.length; }catch(_){} }, 0);
          return;
        }
      }
      setForm({ ...form, template_content: val });
    };

    const buildPreviewNodes = (text) => {
      const s = String(text || '');
      const re = /(\{\{[a-zA-Z0-9_]+\}\}|\{[a-zA-Z0-9_]+\})/g;
      const nodes = [];
      let lastIndex = 0;
      let m;
      while ((m = re.exec(s))) {
        const idx = m.index;
        const token = m[0];
        if (idx > lastIndex) {
          nodes.push(React.createElement('span', { key: 'pv-' + lastIndex }, s.slice(lastIndex, idx)));
        }
        nodes.push(
          React.createElement(
            'span',
            {
              key: 'pv-h-' + idx,
              className:
                'bg-red-600 text-white font-bold underline font-mono px-1 rounded shadow-sm ring-2 ring-red-300'
            },
            token
          )
        );
        lastIndex = re.lastIndex;
      }
      if (lastIndex < s.length) {
        nodes.push(React.createElement('span', { key: 'pv-end' }, s.slice(lastIndex)));
      }
      return nodes;
    };

    // ✅ 最终返回
    return React.createElement(
      'div',
      {
        className: 'space-y-6',
        style: { width: '100%', maxWidth: '1400px' }
      },
      // 错误提示
      error && React.createElement(
        'div',
        { className: 'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md mb-2' },
        error
      ),
      // 场景 & 模型选择
      React.createElement('div', { className:'grid grid-cols-1 lg:grid-cols-3 gap-6' },
        React.createElement('div', { className:'bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden' },
          React.createElement('div', { className:'px-5 py-4 bg-slate-50 border-b border-slate-200' },
            React.createElement('div', { className:'text-sm font-semibold text-slate-900' }, '基础信息'),
            React.createElement('div', { className:'text-xs text-slate-500 mt-1' }, '配置模板的基本参数')
          ),
          React.createElement('div', { className:'p-5 space-y-4' },
            React.createElement('div', { className:'space-y-1' },
              React.createElement('div', { className:'text-sm text-slate-700 font-medium' }, '场景编码', React.createElement('span', { className:'text-red-500 ml-1' }, '*')),
              React.createElement('select', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full bg-white', value:form.scene_code, onChange:e=>setForm({ ...form, scene_code:e.target.value }) },
                React.createElement('option', { value:'' }, '请选择场景'),
                ...sceneOptions.filter(s=>String(s.status)==='0').map(s => React.createElement('option', { key:s.id || s.sceneCode, value:(s.sceneCode || s.scene_code) }, `${s.sceneCode || s.scene_code} - ${s.sceneName || s.scene_name || ''}`))
              )
            ),
            React.createElement('div', { className:'space-y-1' },
              React.createElement('div', { className:'text-sm text-slate-700 font-medium' }, '模型类型', React.createElement('span', { className:'text-red-500 ml-1' }, '*')),
              React.createElement('select', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full bg-white', value: form.model_type, onChange: e => setForm({ ...form, model_type: e.target.value }) },
                ['gpt-4o','deepseek-chat','glm-4','claude-3','qwen-2'].map(m => React.createElement('option', { key:m, value:m }, m.toUpperCase()))
              )
            ),
            React.createElement('div', { className:'space-y-1' },
              React.createElement('div', { className:'text-sm text-slate-700 font-medium' }, '版本号', React.createElement('span', { className:'text-red-500 ml-1' }, '*')),
              React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full bg-white', placeholder:'版本号', value:form.version, onChange:e=>setForm({ ...form, version:e.target.value }) })
            ),
            React.createElement('div', { className:'space-y-1' },
              React.createElement('div', { className:'text-sm text-slate-700 font-medium' }, '角色类型', React.createElement('span', { className:'text-red-500 ml-1' }, '*')),
              React.createElement('select', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full bg-white', value:form.role_type, onChange:e=>setForm({ ...form, role_type:e.target.value }) },
                ['system','user','assistant'].map(r => React.createElement('option', { key:r, value:r }, r.charAt(0).toUpperCase() + r.slice(1)))
              )
            ),
            React.createElement('div', { className:'space-y-1' },
              React.createElement('div', { className:'text-sm text-slate-700 font-medium' }, '模板名称', React.createElement('span', { className:'text-red-500 ml-1' }, '*')),
              React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full bg-white', placeholder:'请输入模板名称', value:form.template_name, onChange:e=>setForm({ ...form, template_name:e.target.value }) })
            )
          )
        ),
        React.createElement('div', { className:'bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden' },
          React.createElement('div', { className:'px-5 py-4 bg-slate-50 border-b border-slate-200' },
            React.createElement('div', { className:'text-sm font-semibold text-slate-900' }, '提示词内容'),
            React.createElement('div', { className:'text-xs text-slate-500 mt-1' }, '编写提示词模板')
          ),
          React.createElement('div', { className:'p-5 space-y-4' },
            React.createElement('div', { className:'flex items-center justify-between gap-3' },
              React.createElement('select', { className:'border border-slate-300 rounded-lg px-3 py-2 text-sm w-full bg-white', value:'', onChange:(e)=>{ const nm=e.target.value; insertVarToken(nm); e.target.value=''; } },
                React.createElement('option', { value:'' }, '插入变量...'),
                ...vars.filter(v=>v && v.name).map((v,i)=>React.createElement('option',{key:`ins-${v.name}-${i}`, value:v.name}, `{${v.name}}`))
              ),
              React.createElement('button', { className:'px-3 py-2 rounded-lg bg-slate-100 text-blue-600 text-sm hover:bg-slate-200 whitespace-nowrap', onClick:openOptimize }, 'AI优化')
            ),
            React.createElement('div', { className:'border border-blue-200 bg-blue-50 rounded-xl p-4 text-sm text-blue-700' },
              React.createElement('div', { className:'font-semibold' }, '可使用 {name} 定义变量'),
              React.createElement('div', { className:'text-blue-600/90 mt-1' }, '示例：查询 {city} 的天气')
            ),
            React.createElement('textarea', { ref: contentRef, className:'border border-slate-300 rounded-xl px-4 py-3 w-full bg-white', rows:10, placeholder:'请输入提示词内容，可使用 {name} 或 {{name}} 定义变量', value:form.template_content, onChange:handleContentChange }),
            React.createElement('div', { className:'flex items-center justify-between text-xs text-slate-500' },
              React.createElement('div', null, `${String(form.template_content||'').length} 字符`),
              React.createElement('button', { className:'text-blue-600 hover:text-blue-700', onClick:()=>setPreviewOpen(true) }, '预览')
            ),
          )
        ),
        React.createElement('div', { className:'bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden' },
          React.createElement('div', { className:'px-5 py-4 bg-slate-50 border-b border-slate-200' },
            React.createElement('div', { className:'text-sm font-semibold text-slate-900' }, '高级配置'),
            React.createElement('div', { className:'text-xs text-slate-500 mt-1' }, '可选的变量和参数')
          ),
          React.createElement('div', { className:'p-5 space-y-5' },
            React.createElement('div', { className:'space-y-3' },
              React.createElement('div', { className:'flex items-center justify-between' },
                React.createElement('div', { className:'text-sm font-semibold text-slate-700' }, '变量设置'),
                React.createElement('button', { className:'text-blue-600 text-sm hover:text-blue-700', onClick:addVar }, '+ 添加')
              ),
              (vars && vars.length > 0)
                ? React.createElement('div', { className:'space-y-3 max-h-64 overflow-y-auto' },
                    vars.map((v, idx) => React.createElement('div', { key:idx, className:'border border-slate-200 rounded-xl p-4 space-y-3' },
                      React.createElement('div', { className:'flex items-center justify-between' },
                        React.createElement('div', { className:'text-xs text-slate-500' }, `变量 ${idx + 1}`),
                        React.createElement('button', { className:'px-3 py-1 rounded-lg bg-slate-100 text-red-600 text-xs hover:bg-slate-200', onClick:()=>removeVar(idx) }, '删除')
                      ),
                      React.createElement('div', { className:'grid grid-cols-1 md:grid-cols-4 gap-3' },
                        React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2', placeholder:'变量名，例如: username', value:v.name || '', onChange:e=>updateVar(idx,'name',e.target.value) }),
                        React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2', placeholder:'变量描述，例如: 用户名称', value:v.label || '', onChange:e=>updateVar(idx,'label',e.target.value) }),
                        React.createElement('select', { className:'border border-slate-300 rounded-lg px-3 py-2', value:v.type || 'string', onChange:e=>updateVar(idx,'type',e.target.value) },
                          ['string','varchar','integer','number','boolean','time','object','array','file'].map(t => React.createElement('option', { key:t, value:t }, String(t).toUpperCase()))
                        ),
                        React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2', placeholder:'备注说明', value:v.note || '', onChange:e=>updateVar(idx,'note',e.target.value) })
                      )
                    ))
                  )
                : React.createElement('div', { className:'border border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500 bg-slate-50' }, '暂无变量')
            ),
            React.createElement('div', { className:'border border-slate-200 rounded-xl overflow-hidden' },
              React.createElement('div', { className:'flex items-center justify-between p-3' },
                React.createElement('div', { className:'text-sm font-medium text-slate-700' }, '参数结构'),
                React.createElement('button', { className:'text-blue-600 text-sm', onClick:()=>setJsonCollapsed(v=>!v) }, '< > JSON')
              ),
              jsonCollapsed ? null : React.createElement('div', { className:'p-3 bg-slate-50 border-t border-slate-200' },
                React.createElement('textarea', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full font-mono text-sm bg-white', rows:8, placeholder:'参数结构 JSON', value:form.param_schema, onChange:e=>{ const val = e.target.value; setForm({ ...form, param_schema: val }); setVars(parseVarsFromSchema(val)); } })
              )
            ),
            React.createElement('label', { className:'flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4' },
              React.createElement('input', { type:'checkbox', checked: Number(form.status)===0, onChange:e=>setForm({ ...form, status: e.target.checked ? 0 : 1 }) }),
              React.createElement('div', null,
                React.createElement('div', { className:'text-sm font-semibold text-slate-800' }, '启用模板'),
                React.createElement('div', { className:'text-xs text-emerald-700 mt-1' }, '启用后立即可用')
              )
            )
          )
        )
      ),
      React.createElement('div', { className:'flex justify-end gap-3 pt-2' },
        React.createElement('button', { className:'px-6 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50', onClick:()=>onClose && onClose() }, '取消'),
        React.createElement('button', { className:'px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50', disabled:saving, onClick:()=>handleSave() }, '保存')
      ),
      previewOpen && React.createElement('div', { className:'fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4', onClick:()=>setPreviewOpen(false) },
        React.createElement('div', { className:'bg-white rounded-2xl shadow-2xl w-[92vw] max-w-[1100px] max-h-[78vh] overflow-hidden flex flex-col', onClick:(e)=>e.stopPropagation() },
          React.createElement('div', { className:'flex items-center justify-between p-4 border-b' },
            React.createElement('div', { className:'text-lg font-semibold text-slate-900' }, '提示词预览'),
            React.createElement('button', { className:'px-3 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200', onClick:()=>setPreviewOpen(false) }, '关闭')
          ),
          React.createElement('div', { className:'p-4 overflow-auto' },
            React.createElement('div', { className:'text-sm text-slate-700', style:{ whiteSpace:'pre-wrap' } }, buildPreviewNodes(form.template_content || ''))
          )
        )
      ),
      optOpen && React.createElement('div', { className:'fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4' },
        React.createElement('div', { className:'bg-white rounded-2xl shadow-2xl w-full p-6 space-y-4 overflow-y-auto', style:{ width:'60vw', maxWidth:'60vw', height:'80vh' } },
          React.createElement('div', { className:'text-xl font-bold text-gray-800' }, 'AI 提示词优化'),
          optErr && React.createElement('div', { className:'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md' }, optErr),
          optLoading && React.createElement('div', { className:'bg-blue-50 text-blue-700 border border-blue-200 p-3 rounded-lg text-sm shadow-md' }, '正在优化中，请稍等...'),
          React.createElement('div', { className:'grid grid-cols-1 md:grid-cols-2 gap-4' },
            React.createElement('div', { className:'space-y-2' },
              React.createElement('div', { className:'text-sm text-gray-700 flex items-center justify-between' },
                React.createElement('span', null, '原始提示词'),
                React.createElement('span', { className:'text-gray-400 text-xs' }, '可编辑')
              ),
              React.createElement('textarea', { className:'border border-gray-300 rounded-lg px-3 py-2 w-full', style:{ height:'60vh' }, value:optSrc, onChange:e=>setOptSrc(e.target.value) })
            ),
            React.createElement('div', { className:'space-y-2' },
              React.createElement('div', { className:'text-sm text-gray-700 flex items-center justify-between' },
                React.createElement('span', null, 'AI 优化后'),
                React.createElement('span', { className:'text-gray-400 text-xs' }, '可编辑')
              ),
              React.createElement('textarea', { className:'border border-gray-300 rounded-lg px-3 py-2 w-full', style:{ height:'60vh' }, value:optOut, placeholder: optLoading ? '正在优化中，请稍等...' : '点击左侧“开始 AI 优化”按钮', onChange:e=>setOptOut(e.target.value) })
            )
          ),
          React.createElement('div', { className:'flex items-center justify-between' },
            React.createElement('div', { className:'text-gray-500 text-xs' }, '提示：使用 {name} 或 {{name}} 格式定义变量；优化历史可对比'),
            React.createElement('div', { className:'space-x-2' },
              React.createElement('button', { className:'px-5 py-2 rounded-md text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50', disabled:optLoading, onClick:runOptimize }, '开始 AI 优化'),
              React.createElement('button', { className:'px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50', disabled:optLoading || !String(optOut||'').trim(), onClick:()=>{ applyOptimized(); } }, '保存优化结果'),
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
