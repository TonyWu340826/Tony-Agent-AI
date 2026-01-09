// --- 图像生成（工具ID=8）功能面板 ---
(function(){
  const Tool8 = () => {
    const { useState, useEffect } = React;
    const Lucide = window.LucideReact || {};
    const Fallback = (props) => React.createElement('span', { className: props && props.className }, props.children);
    const IconImage = (typeof Lucide.Image === 'function') ? Lucide.Image : Fallback;
    const IconX = (typeof Lucide.X === 'function') ? Lucide.X : Fallback;
    const IconDownload = (typeof Lucide.Download === 'function') ? Lucide.Download : Fallback;
    const IconSparkles = (typeof Lucide.Sparkles === 'function') ? Lucide.Sparkles : Fallback;
    const IconSettings = (typeof Lucide.Settings2 === 'function') ? Lucide.Settings2 : Fallback;

    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('低分辨率、错误、最差质量、低质量、残缺、多余的手指、比例不良');
    const [size, setSize] = useState('1328*1328');
    const [loading, setLoading] = useState(false);
    const [resultImage, setResultImage] = useState(null);
    const [error, setError] = useState('');
    const [isVisible, setIsVisible] = useState(true);

    // --- Template Logic States ---
    const [showTemplates, setShowTemplates] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const [templateLoading, setTemplateLoading] = useState(false);
    
    // Variable Filling States
    const [showVarModal, setShowVarModal] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(null);
    const [formVars, setFormVars] = useState({});
    const [varDefinitions, setVarDefinitions] = useState([]);

    // Fetch Templates
    const loadTemplates = async () => {
      if (templates.length > 0) return;
      setTemplateLoading(true);
      try {
        const res = await fetch('/api/prompt/admin/templates?page=0&size=1000&status=0');
        const data = await res.json();
        const list = Array.isArray(data.content) ? data.content : [];
        setTemplates(list);
        setFilteredTemplates(list);
      } catch(e) { console.error('Load templates failed', e); }
      setTemplateLoading(false);
    };

    // Handle Input Change
    const handlePromptChange = (e) => {
      const val = e.target.value;
      setPrompt(val);

      // Trigger on '#'
      const lastChar = val.slice(-1);
      if (lastChar === '#') {
        setShowTemplates(true);
        loadTemplates();
        setFilteredTemplates(templates.length > 0 ? templates : []);
      } else if (showTemplates) {
        // Simple filter based on text after the last '#'
        const parts = val.split('#');
        const query = parts[parts.length - 1].toLowerCase();
        // If user types space, likely done with tag
        if (query.includes(' ') || query.includes('\n')) {
          setShowTemplates(false);
        } else {
          setFilteredTemplates(templates.filter(t => (t.templateName||'').toLowerCase().includes(query)));
        }
      }
    };

    // Handle Template Selection
    const selectTemplate = (t) => {
      setShowTemplates(false);
      const content = t.templateContent || '';
      // Find variables {varName}
      const regex = /\{([^}]+)\}/g;
      const vars = [];
      let match;
      while ((match = regex.exec(content)) !== null) {
        vars.push(match[1]);
      }

      if (vars.length === 0) {
        // Direct insert
        insertContent(content);
      } else {
        // Prepare variable form
        const uniqueVars = [...new Set(vars)];
        let schema = null;
        try {
          if (typeof t.paramSchema === 'string' && t.paramSchema) {
             schema = JSON.parse(t.paramSchema);
          } else if (typeof t.paramSchema === 'object') {
             schema = t.paramSchema;
          }
        } catch(e) {}

        const definitions = uniqueVars.map(v => {
          let label = v;
          if (schema) {
            if (Array.isArray(schema)) {
               // Try to find in array
               const item = schema.find(s => s.name === v || s.key === v || s.id === v);
               if (item) {
                 label = item.label || item.title || item.name || item.description || v;
               }
            } else {
               // Object map
               const val = schema[v];
               if (typeof val === 'string') {
                 label = val;
               } else if (val && typeof val === 'object') {
                 label = val.label || val.title || val.name || v;
               }
            }
          }
          return { name: v, label };
        });
        
        setVarDefinitions(definitions);
        setFormVars({});
        setCurrentTemplate(t);
        setShowVarModal(true);
      }
    };

    const insertContent = (text) => {
      const parts = prompt.split('#');
      parts.pop(); // Remove the part after last # (including the # implicitly if we join properly)
      // Actually we want to replace the LAST # and whatever follows
      // prompt is "something #query" -> parts=["something ", "query"]
      // We want "something " + text
      // If prompt ends with #, parts=["something ", ""]
      
      const newPrompt = parts.join('#') + text;
      setPrompt(newPrompt);
    };

    const submitVariables = () => {
      if (!currentTemplate) return;
      let content = currentTemplate.templateContent || '';
      varDefinitions.forEach(def => {
        const val = formVars[def.name] || '';
        // Global replace
        content = content.split(`{${def.name}}`).join(val);
      });
      insertContent(content);
      setShowVarModal(false);
      setCurrentTemplate(null);
    };

    // 关闭模态框的函数
    const closeModal = () => {
      console.log('closeModal called');
      setIsVisible(false);
      
      // 方法1: 调用 window 上的关闭函数（如果存在）
      try {
        if (typeof window.__closeImageGenModal === 'function') {
          console.log('Calling window.__closeImageGenModal');
          window.__closeImageGenModal();
        }
      } catch (e) {
        console.error('Error calling window.__closeImageGenModal:', e);
      }
      
      // 方法2: 发送事件通知父组件关闭
      try {
        const event = new CustomEvent('closeToolModal', { bubbles: true, composed: true });
        window.dispatchEvent(event);
        console.log('closeToolModal event dispatched');
      } catch(e) {
        console.error('Event dispatch error:', e);
      }
    };

    // 监听 ESC 键关闭模态框
    useEffect(() => {
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          console.log('ESC key pressed');
          closeModal();
        }
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const sizeOptions = [
      { value: '1664*928', label: '16:9 (1664x928)' },
      { value: '1472*1140', label: '4:3 (1472x1140)' },
      { value: '1328*1328', label: '1:1 (1328x1328)' },
      { value: '1140*1472', label: '3:4 (1140x1472)' },
      { value: '928*1664', label: '9:16 (928x1664)' }
    ];

    const handleGenerate = async () => {
      if (!prompt.trim()) {
        setError('请输入画面描述');
        return;
      }
      setLoading(true);
      setError('');
      setResultImage(null);

      try {
        const response = await fetch('/api/open/aliyunCreateImage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: prompt.trim(),
            negativePrompt: negativePrompt.trim(),
            size: size
          })
        });

        if (!response.ok) {
          throw new Error('生成请求失败');
        }

        const data = await response.json();
        if (data.message && data.message.startsWith('http')) {
             setResultImage(data.message);
        } else {
             throw new Error(data.message || '未获取到图片地址');
        }

      } catch (err) {
        setError(err.message || '生成失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    // 全屏弹框渲染
    if (!isVisible) {
      return React.createElement('div', { 
        className: 'fixed bottom-6 right-6 z-[9999] bg-white rounded-full shadow-2xl p-4 cursor-pointer hover:scale-105 transition-transform border-2 border-blue-600 flex items-center gap-2 animate-bounce',
        onClick: () => setIsVisible(true),
        title: '点击恢复 AI 图像生成工作台'
      },
        React.createElement(IconSparkles, { className: 'w-6 h-6 text-blue-600' }),
        React.createElement('span', { className: 'font-bold text-blue-900' }, '恢复 AI 绘图')
      );
    }

      return React.createElement('div', { 
        className: 'fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4',
        onClick: closeModal
      },
        // Variable Input Modal
        showVarModal && React.createElement('div', { className: 'fixed inset-0 z-[300] bg-black/60 flex items-center justify-center p-4', onClick: () => setShowVarModal(false) },
          React.createElement('div', { className: 'bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden', onClick: e => e.stopPropagation() },
            React.createElement('div', { className: 'px-6 py-4 border-b border-slate-100 flex items-center justify-between' },
              React.createElement('h3', { className: 'font-bold text-lg text-slate-800' }, '填写模板变量'),
              React.createElement('button', { onClick: () => setShowVarModal(false), className: 'text-slate-400 hover:text-slate-600' }, React.createElement(IconX, { className: 'w-5 h-5' }))
            ),
            React.createElement('div', { className: 'p-6 space-y-4 max-h-[60vh] overflow-y-auto' },
              varDefinitions.map(def => 
                React.createElement('div', { key: def.name, className: 'space-y-1' },
                  React.createElement('label', { className: 'block text-sm font-medium text-slate-700' }, def.label),
                  React.createElement('input', {
                    type: 'text',
                    value: formVars[def.name] || '',
                    onChange: e => setFormVars({ ...formVars, [def.name]: e.target.value }),
                    className: 'w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                  })
                )
              )
            ),
            React.createElement('div', { className: 'px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3' },
              React.createElement('button', {
                onClick: () => setShowVarModal(false),
                className: 'px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium'
              }, '取消'),
              React.createElement('button', {
                onClick: submitVariables,
                className: 'px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium'
              }, '确认使用')
            )
          )
        ),
        
        React.createElement('div', { 
          className: 'bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full max-w-6xl h-[90vh]',
        onClick: (e) => e.stopPropagation() // 阻止点击内容区域时关闭
      },
        // 顶部导航栏
        React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between border-b flex-shrink-0' },
          React.createElement('div', { className: 'flex items-center gap-3' },
            React.createElement('div', { className: 'w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center' },
              React.createElement(IconSparkles, { className: 'w-6 h-6' })
            ),
            React.createElement('div', null,
              React.createElement('h2', { className: 'font-bold text-lg' }, 'AI 图像生成工作台'),
              React.createElement('span', { className: 'text-xs text-white/80' }, 'Powered by ZEUS.AIAI')
            )
          ),
          React.createElement('button', {
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Close button clicked!');
              closeModal();
            },
            className: 'p-3 hover:bg-white/30 rounded-lg text-white transition-all cursor-pointer border-2 border-white/50 hover:border-white font-bold',
            title: '关闭',
            type: 'button',
            style: { minWidth: '44px', minHeight: '44px' }
          }, 
            // 使用 IconX 如果可用，否则使用 × 文本作为后备
            typeof IconX === 'function' && IconX !== Fallback 
              ? React.createElement(IconX, { className: 'w-6 h-6' })
              : React.createElement('span', { className: 'text-2xl font-bold leading-none' }, '×')
          )
        ),

        // 主体内容区：左右分栏
        React.createElement('div', { className: 'flex-1 flex overflow-hidden' },
          
          // 左侧：控制面板
          React.createElement('div', { className: 'w-full md:w-[400px] bg-white border-r border-slate-200 overflow-y-auto' },
            React.createElement('div', { className: 'p-6 space-y-5' },
            
              // 提示词输入
              React.createElement('div', { className: 'space-y-2 relative' },
                React.createElement('label', { className: 'block text-sm font-semibold text-slate-700' }, '画面描述 (Prompt)'),
                React.createElement('textarea', {
                  value: prompt,
                  onChange: handlePromptChange,
                  placeholder: '描述您想要生成的画面细节，输入 # 可唤起提示词模板',
                  className: 'w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-700',
                }),
                // Template Dropdown
                showTemplates && React.createElement('div', { className: 'absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto' },
                   templateLoading ? React.createElement('div', { className: 'p-3 text-slate-500 text-sm' }, '加载中...') :
                   filteredTemplates.length === 0 ? React.createElement('div', { className: 'p-3 text-slate-500 text-sm' }, '无匹配模板') :
                   filteredTemplates.map(t => React.createElement('div', {
                     key: t.id,
                     className: 'px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-slate-700 border-b border-slate-100 last:border-0',
                     onClick: () => selectTemplate(t)
                   }, t.templateName))
                )
              ),

              // 负面提示词
              React.createElement('div', { className: 'space-y-2' },
                React.createElement('label', { className: 'block text-sm font-semibold text-slate-700 flex items-center gap-2' }, 
                  '负面描述 (Negative Prompt)',
                  React.createElement('span', { className: 'text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded' }, '不希望出现的内容')
                ),
                React.createElement('textarea', {
                  value: negativePrompt,
                  onChange: (e) => setNegativePrompt(e.target.value),
                  className: 'w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm text-slate-600 bg-slate-50',
                })
              ),

              // 尺寸选择
              React.createElement('div', { className: 'space-y-2' },
                React.createElement('label', { className: 'block text-sm font-semibold text-slate-700' }, '图片比例'),
                React.createElement('div', { className: 'grid grid-cols-3 gap-3' },
                  sizeOptions.map(opt => 
                    React.createElement('button', {
                      key: opt.value,
                      onClick: () => setSize(opt.value),
                      className: `px-3 py-2 text-sm rounded-lg border transition-all ${size === opt.value ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium ring-2 ring-blue-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`
                    }, opt.label)
                  )
                )
              ),

              // 生成按钮
              React.createElement('button', {
                onClick: handleGenerate,
                disabled: loading || !prompt.trim(),
                className: `w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2
                  ${loading || !prompt.trim() ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/30'}`
              },
                loading ? React.createElement('div', { className: 'w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' }) : React.createElement(IconSparkles, { className: 'w-5 h-5' }),
                loading ? '正在绘制中...' : '立即生成'
              ),
              
              error && React.createElement('div', { className: 'p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100' }, error)
            )
          ),

          // 右侧：预览区
          React.createElement('div', { className: 'flex-1 bg-slate-100/50 flex items-center justify-center p-8 relative' },
            // 背景装饰
            !resultImage && !loading && React.createElement('div', { className: 'text-center text-slate-400' },
              React.createElement(IconImage, { className: 'w-24 h-24 mx-auto mb-4 opacity-20' }),
              React.createElement('p', { className: 'text-lg font-medium opacity-60' }, '在左侧输入描述，开始创作您的杰作')
            ),

            // 加载动画
            loading && React.createElement('div', { className: 'flex flex-col items-center justify-center space-y-4' },
              React.createElement('div', { className: 'relative' },
                 React.createElement('div', { className: 'w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin' }),
                 React.createElement('div', { className: 'absolute inset-0 flex items-center justify-center' },
                   React.createElement(IconSparkles, { className: 'w-6 h-6 text-blue-600 animate-pulse' })
                 )
              ),
              React.createElement('p', { className: 'text-slate-600 font-medium animate-pulse' }, 'AI 正在挥毫泼墨...')
            ),

            // 结果展示
            resultImage && !loading && React.createElement('div', { className: 'relative group max-w-full max-h-full shadow-2xl rounded-lg overflow-hidden' },
              React.createElement('img', { 
                src: resultImage, 
                className: 'max-w-full max-h-[75vh] object-contain bg-white',
                alt: 'Generated Result' 
              }),
              React.createElement('div', { className: 'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-3' },
                React.createElement('a', { 
                  href: resultImage, 
                  target: '_blank',
                  download: 'ai-generated-image.png',
                  className: 'p-2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-lg transition-colors',
                  title: '下载图片'
                }, React.createElement(IconDownload, { className: 'w-5 h-5' }))
              )
            )
          )
        )
      )
    );
  };

  window.ToolsPages = window.ToolsPages || {};
  window.ToolsPages['8'] = Tool8;
})();
