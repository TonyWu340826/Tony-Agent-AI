// --- 文字生成视频（工具ID=17）功能面板 ---
(function(){
  const Tool17 = () => {
    const { useState, useEffect } = React;
    const Lucide = window.LucideReact || {};
    const Fallback = (props) => React.createElement('span', { className: props && props.className }, props.children);
    const IconVideo = (typeof Lucide.Video === 'function') ? Lucide.Video : Fallback;
    const IconX = (typeof Lucide.X === 'function') ? Lucide.X : Fallback;
    const IconDownload = (typeof Lucide.Download === 'function') ? Lucide.Download : Fallback;
    const IconSparkles = (typeof Lucide.Sparkles === 'function') ? Lucide.Sparkles : Fallback;
    const IconSettings = (typeof Lucide.Settings2 === 'function') ? Lucide.Settings2 : Fallback;
    const IconWand = (typeof Lucide.Wand2 === 'function') ? Lucide.Wand2 : Fallback;

    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('低分辨率、错误、最差质量、低质量、残缺、多余的手指、比例不良');
    const [size, setSize] = useState('1280*720');
    const [duration, setDuration] = useState(5);
    const [model, setModel] = useState('wanx2.1-t2v-turbo');
    const [audio, setAudio] = useState(true);
    const [audioUrl, setAudioUrl] = useState('');
    const [watermark, setWatermark] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultVideo, setResultVideo] = useState(null);
    const [error, setError] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [generatingPrompt, setGeneratingPrompt] = useState(false);
    const [aiPolishOpen, setAiPolishOpen] = useState(false);
    const [aiPolishText, setAiPolishText] = useState('');
    const [showTemplatesPolish, setShowTemplatesPolish] = useState(false);
    const [templatesPolish, setTemplatesPolish] = useState([]);
    const [filteredTemplatesPolish, setFilteredTemplatesPolish] = useState([]);
    const [templateLoadingPolish, setTemplateLoadingPolish] = useState(false);
    const [showVarModalPolish, setShowVarModalPolish] = useState(false);
    const [currentTemplatePolish, setCurrentTemplatePolish] = useState(null);
    const [formVarsPolish, setFormVarsPolish] = useState({});
    const [varDefinitionsPolish, setVarDefinitionsPolish] = useState([]);

    // 模型选项
    const modelOptions = [
      { value: 'wanx2.1-t2v-turbo', label: '万相2.1极速版（有声视频）' },
      { value: 'wanx-txt2video-pro', label: '万相专业版（有声视频）' },
      { value: 'wanx2.1-t2v-plus', label: '万相2.1专业版（无声视频）' }
    ];

    // 分辨率选项
    const sizeOptions = [
      { value: '1280*720', label: '1280×720 (16:9)' },
      { value: '832*480', label: '832×480 (16:9)' },
      { value: '1920*1080', label: '1920×1080 (16:9)' },
      { value: '1080*1920', label: '1080×1920 (9:16)' },
      { value: '720*1280', label: '720×1280 (9:16)' }
    ];

    // 时长选项
    const durationOptions = [
      { value: 5, label: '5秒' },
      { value: 10, label: '10秒' }
    ];

    // 关闭模态框的函数
    const closeModal = () => {
      console.log('closeModal called');
      setIsVisible(false);
      
      // 方法1: 调用 window 上的关闭函数（如果存在）
      try {
        if (typeof window.__closeVideoGenModal === 'function') {
          console.log('Calling window.__closeVideoGenModal');
          window.__closeVideoGenModal();
        }
      } catch (e) {
        console.error('Error calling window.__closeVideoGenModal:', e);
      }
      
      // 方法2: 发送事件通知父组件关闭
      try {
        const event = new CustomEvent('closeToolModal', { bubbles: true, composed: true });
        window.dispatchEvent(event);
        console.log('closeToolModal event dispatched');
      } catch(e) {
        console.error('Event dispatch error:', e);
      }
      
      // 方法3: 触发自定义事件，通知父组件返回工具列表
      window.dispatchEvent(new CustomEvent('backToToolList'));
    };

    // 监听 ESC 键关闭模态框
    useEffect(() => {
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          console.log('ESC key pressed');
          if (!aiPolishOpen) {
            closeModal();
          }
        }
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const loadTemplatesPolish = async () => {
      if (templatesPolish.length > 0) return;
      setTemplateLoadingPolish(true);
      try {
        const res = await fetch('/api/prompt/admin/templates?page=0&size=1000&status=0', { credentials: 'same-origin' });
        const data = await res.json();
        const list = Array.isArray(data) ? data : (Array.isArray(data.content) ? data.content : []);
        setTemplatesPolish(list);
        setFilteredTemplatesPolish(list);
      } catch (e) {
        console.error('Load templates failed', e);
      } finally {
        setTemplateLoadingPolish(false);
      }
    };

    const parseParamSchemaPolish = (t) => {
      const raw = (t && (t.paramSchema !== undefined ? t.paramSchema : t.param_schema));
      if (!raw) return null;
      try {
        if (typeof raw === 'string') {
          return JSON.parse(raw || 'null');
        }
        if (typeof raw === 'object') return raw;
      } catch (_) {
        return null;
      }
      return null;
    };

    const resolveLabelFromSchemaItem = (item, fallback) => {
      if (!item) return fallback;
      if (typeof item === 'string') return item;
      if (typeof item === 'object') {
        return item.label || item.title || item.name || item.key || item.id || item.description || fallback;
      }
      return fallback;
    };

    const resolveLabelForName = (name, schema) => {
      const fallback = name;
      if (!schema) return fallback;
      if (Array.isArray(schema)) {
        const item = schema.find(s => s && (s.name === name || s.key === name || s.id === name));
        return resolveLabelFromSchemaItem(item, fallback);
      }
      if (schema && typeof schema === 'object') {
        const v = schema[name];
        return resolveLabelFromSchemaItem(v, fallback);
      }
      return fallback;
    };

    const resolveLabelForIndex = (idx, schema) => {
      const fallback = `参数${idx + 1}`;
      if (!schema) return fallback;
      if (Array.isArray(schema)) {
        return resolveLabelFromSchemaItem(schema[idx], fallback);
      }
      if (schema && typeof schema === 'object') {
        const keys = Object.keys(schema || {});
        const key = keys[idx];
        return resolveLabelFromSchemaItem(key ? schema[key] : null, fallback);
      }
      return fallback;
    };

    const insertAiPolishContent = (text) => {
      const base = String(aiPolishText || '');
      const parts = base.split('#');
      parts.pop();
      const newText = parts.join('#') + String(text || '');
      setAiPolishText(newText);
    };

    const handleAiPolishTextChange = (e) => {
      const val = e.target.value;
      setAiPolishText(val);

      const lastChar = val.slice(-1);
      if (lastChar === '#') {
        setShowTemplatesPolish(true);
        loadTemplatesPolish();
        setFilteredTemplatesPolish(templatesPolish.length > 0 ? templatesPolish : []);
        return;
      }
      if (showTemplatesPolish) {
        if (!val.includes('#')) {
          setShowTemplatesPolish(false);
          return;
        }
        const parts = val.split('#');
        const query = String(parts[parts.length - 1] || '').toLowerCase();
        if (query.includes(' ') || query.includes('\n')) {
          setShowTemplatesPolish(false);
          return;
        }
        setFilteredTemplatesPolish(templatesPolish.filter(t => String((t && (t.templateName || t.template_name)) || '').toLowerCase().includes(query)));
      }
    };

	const maybeOpenTemplateMenuPolish = (val, cursorPos) => {
		try {
			const text = String(val || '');
			const pos = Number.isFinite(cursorPos) ? cursorPos : text.length;
			const idx = text.lastIndexOf('#', Math.max(0, pos - 1));
			if (idx < 0) {
				setShowTemplatesPolish(false);
				return;
			}
			const query = String(text.slice(idx + 1, pos) || '').toLowerCase();
			if (query.includes(' ') || query.includes('\n') || query.includes('\r') || query.includes('\t')) {
				setShowTemplatesPolish(false);
				return;
			}
			setShowTemplatesPolish(true);
			loadTemplatesPolish();
			if (templatesPolish.length > 0) {
				setFilteredTemplatesPolish(templatesPolish.filter(t => String((t && (t.templateName || t.template_name)) || '').toLowerCase().includes(query)));
			}
		} catch (_) {
			setShowTemplatesPolish(false);
		}
	};

    const selectTemplatePolish = (t) => {
      setShowTemplatesPolish(false);
      const content = String((t && (t.templateContent || t.template_content)) || '');
      const schema = parseParamSchemaPolish(t || {});

      const emptyCount = (content.match(/\{\}/g) || []).length;
      const namedSet = new Set();
      const named = [];
      const re = /\{([^}]*)\}/g;
      let m;
      while ((m = re.exec(content)) !== null) {
        const nm = String(m[1] || '').trim();
        if (!nm) continue;
        if (!namedSet.has(nm)) {
          namedSet.add(nm);
          named.push(nm);
        }
      }

      const defs = [];
      named.forEach(nm => {
        defs.push({ key: `named:${nm}`, kind: 'named', name: nm, label: resolveLabelForName(nm, schema) });
      });
      for (let i = 0; i < emptyCount; i++) {
        defs.push({ key: `empty:${i}`, kind: 'empty', index: i, label: resolveLabelForIndex(i, schema) });
      }

      if (defs.length === 0) {
        insertAiPolishContent(content);
        return;
      }

      setVarDefinitionsPolish(defs);
      setFormVarsPolish({});
      setCurrentTemplatePolish(t);
      setShowVarModalPolish(true);
    };

    const submitPolishVariables = () => {
      if (!currentTemplatePolish) return;
      let content = String((currentTemplatePolish.templateContent || currentTemplatePolish.template_content) || '');

      (varDefinitionsPolish || []).forEach(def => {
        if (def.kind === 'named') {
          const val = String(formVarsPolish[def.key] || '');
          content = content.split(`{${def.name}}`).join(val);
        }
      });

      const emptyDefs = (varDefinitionsPolish || []).filter(d => d.kind === 'empty').sort((a, b) => (a.index || 0) - (b.index || 0));
      emptyDefs.forEach(def => {
        const val = String(formVarsPolish[def.key] || '');
        content = content.replace(/\{\}/, val);
      });

      insertAiPolishContent(content);
      setShowVarModalPolish(false);
      setCurrentTemplatePolish(null);
    };

    // AI生成提示词
    const generatePrompt = async (seedText) => {
      setGeneratingPrompt(true);
      setError('');

      try {
        const seed = (seedText === undefined || seedText === null) ? '' : String(seedText).trim();
        const messageText = seed
          ? `请帮我润色并扩写以下用于文生视频的提示词，输出可直接用于视频生成模型的中文提示词：${seed}`
          : `请你生成并润色一个高质量、可直接用于视频生成模型的中文提示词。要求包含：场景、主体、动作、镜头语言、光线氛围、风格与色彩、质量词。参数：分辨率=${size}，时长=${duration}秒。`;

        // 调用deeSeekChat接口生成提示词
        const response = await fetch('/api/open/deeoSeekChat/model', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: messageText,
            prompt: "你是一个专业的AI视频提示词工程师，擅长将简单的描述扩展为详细、精确的视频生成提示词。请将用户提供的简单描述转换为适合视频生成模型使用的详细提示词，包括场景描述、主体动作、镜头语言、氛围色调等细节。"
          }),
          credentials: 'same-origin'
        });

        if (response.ok) {
          const data = await response.json();
          // 根据实际返回的数据结构调整
          // deeSeekChat返回格式为 { message: "..." }
          setPrompt(data.message || '');
        } else {
          throw new Error('生成提示词失败');
        }
      } catch (err) {
        setError('生成提示词失败，请稍后重试');
        console.error('提示词生成错误:', err);
      } finally {
        setGeneratingPrompt(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!prompt.trim()) {
        setError('请输入视频描述');
        return;
      }

      setLoading(true);
      setError('');
      setResultVideo(null);

      try {
        const requestBody = {
          prompt: prompt.trim(),
          negativePrompt: negativePrompt.trim(),
          size: size,
          duration: duration,
          model: model,
          audio: audio,
          audioUrl: audio ? (audioUrl.trim() || null) : null,
          watermark: watermark
        };

        // 增加超时时间到60秒
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时

        const response = await fetch('/api/workFlow/text_create_viedo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          credentials: 'same-origin',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (response.ok) {
          // 修复：正确处理后端返回的数据格式
          if (data.videoUrl) {
            setResultVideo(data.videoUrl);
          } else {
            setError('视频生成成功但未返回有效URL');
          }
        } else {
          setError(data.message || '生成视频失败');
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          setError('请求超时，请稍后重试');
        } else {
          setError('网络错误，请稍后重试');
        }
        console.error('视频生成错误:', err);
      } finally {
        setLoading(false);
      }
    };

    const handleReset = () => {
      setPrompt('');
      setNegativePrompt('低分辨率、错误、最差质量、低质量、残缺、多余的手指、比例不良');
      setSize('1280*720');
      setDuration(5);
      setModel('wanx2.1-t2v-turbo');
      setAudio(true);
      setAudioUrl('');
      setWatermark(false);
      setResultVideo(null);
      setError('');
    };

    // 全屏弹框渲染
    if (!isVisible) {
      return React.createElement('div', { 
        className: 'fixed bottom-6 right-6 z-[9999] bg-white rounded-full shadow-2xl p-4 cursor-pointer hover:scale-105 transition-transform border-2 border-blue-600 flex items-center gap-2 animate-bounce',
        onClick: () => setIsVisible(true),
        title: '点击恢复 AI 视频生成工作台'
      },
        React.createElement(IconSparkles, { className: 'w-6 h-6 text-blue-600' }),
        React.createElement('span', { className: 'font-bold text-blue-900' }, '恢复 AI 视频')
      );
    }

    return React.createElement('div', { 
      className: 'fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4',
      onClick: closeModal
    },
      React.createElement('div', { 
        className: 'bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full max-w-6xl h-[90vh] relative',
        onClick: (e) => e.stopPropagation() // 阻止点击内容区域时关闭
      },
        // 顶部导航栏
        React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between border-b flex-shrink-0' },
          React.createElement('div', { className: 'flex items-center gap-3' },
            React.createElement('div', { className: 'w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center' },
              React.createElement(IconSparkles, { className: 'w-6 h-6' })
            ),
            React.createElement('div', null,
              React.createElement('h2', { className: 'font-bold text-lg' }, 'AI 视频生成工作台'),
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

        aiPolishOpen && React.createElement('div', {
          className: 'absolute inset-0 z-[999] bg-black/40 flex items-center justify-center p-4',
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
          }
        },
          React.createElement('div', {
            className: 'w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-visible',
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
            }
          },
            React.createElement('div', { className: 'px-5 py-4 border-b border-slate-200 flex items-center justify-between' },
              React.createElement('div', { className: 'text-sm font-bold text-slate-800' }, 'AI润色'),
              React.createElement('button', {
                type: 'button',
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAiPolishOpen(false);
                },
                className: 'w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center',
                title: '关闭'
              },
                typeof IconX === 'function' && IconX !== Fallback
                  ? React.createElement(IconX, { className: 'w-4 h-4 text-slate-600' })
                  : React.createElement('span', { className: 'text-lg text-slate-600 leading-none' }, '×')
              )
            ),
            React.createElement('div', { className: 'p-5 space-y-3' },
              React.createElement('div', { className: 'relative' },
                React.createElement('textarea', {
                  value: aiPolishText,
                  onChange: handleAiPolishTextChange,
                  onClick: (e) => maybeOpenTemplateMenuPolish(e.target.value, e.target.selectionStart),
                  onKeyUp: (e) => maybeOpenTemplateMenuPolish(e.target.value, e.target.selectionStart),
                  className: 'w-full h-40 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-700',
                  placeholder: '输入需要润色的提示词（可留空，AI将生成一段高质量提示词；输入 # 可选择模板）',
                  disabled: loading || generatingPrompt
                }),
                showTemplatesPolish && React.createElement('div', { className: 'absolute z-50 left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl max-h-72 overflow-y-auto' },
                  templateLoadingPolish
                    ? React.createElement('div', { className: 'p-3 text-slate-500 text-sm' }, '加载中...')
                    : (filteredTemplatesPolish.length === 0
                      ? React.createElement('div', { className: 'p-3 text-slate-500 text-sm' }, '无匹配模板')
                      : filteredTemplatesPolish.map(t => React.createElement('div', {
                        key: t.id,
                        className: 'px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm text-slate-700 border-b border-slate-100 last:border-0',
                        onClick: () => selectTemplatePolish(t)
                      }, t.templateName || t.template_name)))
                )
              ),
              React.createElement('div', { className: 'flex items-center justify-end' },
                React.createElement('button', {
                  type: 'button',
                  onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    generatePrompt(aiPolishText);
                  },
                  disabled: loading || generatingPrompt,
                  className: 'h-9 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 font-bold disabled:opacity-50 flex items-center gap-2'
                },
                  generatingPrompt
                    ? React.createElement('div', { className: 'w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' })
                    : React.createElement('span', { className: 'text-xs font-bold leading-none' }, 'AI'),
                  React.createElement('span', null, '开始润色并回填')
                )
              )
            )
          )
        ),

        showVarModalPolish && React.createElement('div', { className: 'fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4', onClick: () => setShowVarModalPolish(false) },
          React.createElement('div', { className: 'bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden', onClick: (e) => e.stopPropagation() },
            React.createElement('div', { className: 'px-6 py-4 border-b border-slate-100 flex items-center justify-between' },
              React.createElement('h3', { className: 'font-bold text-lg text-slate-800' }, '填写模板参数'),
              React.createElement('button', { type: 'button', className: 'w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center', onClick: () => setShowVarModalPolish(false), title: '关闭' },
                typeof IconX === 'function' && IconX !== Fallback
                  ? React.createElement(IconX, { className: 'w-4 h-4 text-slate-600' })
                  : React.createElement('span', { className: 'text-lg text-slate-600 leading-none' }, '×')
              )
            ),
            React.createElement('div', { className: 'p-6 space-y-4 max-h-[60vh] overflow-y-auto' },
              (varDefinitionsPolish || []).map(def =>
                React.createElement('div', { key: def.key, className: 'space-y-1' },
                  React.createElement('label', { className: 'block text-sm font-medium text-slate-700' }, def.label),
                  React.createElement('input', {
                    type: 'text',
                    value: formVarsPolish[def.key] || '',
                    onChange: (e) => setFormVarsPolish({ ...formVarsPolish, [def.key]: e.target.value }),
                    className: 'w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                  })
                )
              )
            ),
            React.createElement('div', { className: 'px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3' },
              React.createElement('button', {
                type: 'button',
                onClick: () => setShowVarModalPolish(false),
                className: 'px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium'
              }, '取消'),
              React.createElement('button', {
                type: 'button',
                onClick: submitPolishVariables,
                className: 'px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium'
              }, '确认使用')
            )
          )
        ),

        // 主体内容区：左右分栏
        React.createElement('div', { className: 'flex-1 flex overflow-hidden' },
          
          // 左侧：控制面板
          React.createElement('div', { className: 'w-full md:w-[400px] bg-white border-r border-slate-200 overflow-y-auto' },
            React.createElement('div', { className: 'p-6 space-y-5' },
            
              // 模型选择（移到顶部）
              React.createElement('div', { className: 'space-y-2' },
                React.createElement('label', { className: 'block text-sm font-semibold text-slate-700' }, '模型'),
                React.createElement('select', {
                  value: model,
                  onChange: (e) => setModel(e.target.value),
                  className: 'w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  disabled: loading
                },
                  modelOptions.map(opt => 
                    React.createElement('option', { key: opt.value, value: opt.value }, `${opt.label} (${opt.value})`)
                  )
                )
              ),
              
              // 主要提示词（带AI生成按钮）
              React.createElement('div', { className: 'space-y-2' },
                React.createElement('div', { className: 'flex items-center justify-between' },
                  React.createElement('label', { className: 'block text-sm font-semibold text-slate-700' }, '视频描述 (Prompt)'),
                  React.createElement('button', {
                    type: 'button',
                    onClick: (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAiPolishText(prompt || '');
                      setShowTemplatesPolish(false);
                      setShowVarModalPolish(false);
                      setAiPolishOpen(true);
                    },
                    disabled: loading,
                    className: 'h-8 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition-all disabled:opacity-50 font-bold',
                    title: 'AI润色'
                  }, 'AI润色')
                ),
                React.createElement('textarea', {
                  value: prompt,
                  onChange: (e) => setPrompt(e.target.value),
                  placeholder: '详细描述您想要生成的视频内容，例如：一只可爱的小猫在花园里玩耍',
                  className: 'w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-700',
                  disabled: loading || generatingPrompt
                })
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
                  disabled: loading
                })
              ),

              // 基本设置
              React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                // 分辨率
                React.createElement('div', { className: 'space-y-2' },
                  React.createElement('label', { className: 'block text-sm font-semibold text-slate-700' }, '分辨率'),
                  React.createElement('select', {
                    value: size,
                    onChange: (e) => setSize(e.target.value),
                    className: 'w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    disabled: loading
                  },
                    sizeOptions.map(opt => 
                      React.createElement('option', { key: opt.value, value: opt.value }, opt.label)
                    )
                  )
                ),

                // 时长
                React.createElement('div', { className: 'space-y-2' },
                  React.createElement('label', { className: 'block text-sm font-semibold text-slate-700' }, '时长'),
                  React.createElement('select', {
                    value: duration,
                    onChange: (e) => setDuration(Number(e.target.value)),
                    className: 'w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    disabled: loading
                  },
                    durationOptions.map(opt => 
                      React.createElement('option', { key: opt.value, value: opt.value }, opt.label)
                    )
                  )
                )
              ),

              // 高级选项切换
              React.createElement('div', { className: 'pt-2' },
                React.createElement('button', {
                  type: 'button',
                  onClick: () => setShowAdvanced(!showAdvanced),
                  className: 'flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900'
                },
                  React.createElement(IconSettings, { className: 'w-4 h-4' }),
                  showAdvanced ? '隐藏高级选项' : '显示高级选项'
                )
              ),

              // 高级选项
              showAdvanced && React.createElement('div', { className: 'space-y-4 pt-4 border-t border-slate-200' },
                // 音频开关
                React.createElement('div', { className: 'flex items-center justify-between' },
                  React.createElement('div', { className: 'flex items-center gap-2' },
                    React.createElement('span', { className: 'text-sm font-medium text-slate-700' }, '启用音频'),
                    React.createElement('span', { className: 'text-xs text-slate-500' }, '为视频添加声音')
                  ),
                  React.createElement('label', { className: 'relative inline-flex items-center cursor-pointer' },
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: audio,
                      onChange: (e) => {
                        const checked = e.target.checked;
                        setAudio(checked);
                        if (!checked) {
                          setAudioUrl('');
                        }
                      },
                      className: 'sr-only peer',
                      disabled: loading
                    }),
                    React.createElement('div', { className: "w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })
                  )
                ),

                audio && React.createElement('div', { className: 'space-y-2' },
                  React.createElement('label', { className: 'block text-sm font-semibold text-slate-700' }, '音频文件地址'),
                  React.createElement('input', {
                    type: 'text',
                    value: audioUrl,
                    onChange: (e) => setAudioUrl(e.target.value),
                    placeholder: '请输入可访问的音频URL，例如：https://xxx.com/audio.mp3',
                    className: 'w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    disabled: loading
                  })
                ),

                // 水印开关
                React.createElement('div', { className: 'flex items-center justify-between' },
                  React.createElement('div', { className: 'flex items-center gap-2' },
                    React.createElement('span', { className: 'text-sm font-medium text-slate-700' }, '添加水印'),
                    React.createElement('span', { className: 'text-xs text-slate-500' }, '在视频上添加标识')
                  ),
                  React.createElement('label', { className: 'relative inline-flex items-center cursor-pointer' },
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: watermark,
                      onChange: (e) => setWatermark(e.target.checked),
                      className: 'sr-only peer',
                      disabled: loading
                    }),
                    React.createElement('div', { className: "w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })
                  )
                )
              ),

              // 错误信息
              error && React.createElement('div', { className: 'p-3 bg-red-50 text-red-700 rounded-lg text-sm' }, error),

              // 生成按钮
              React.createElement('button', {
                onClick: handleSubmit,
                disabled: loading || !prompt.trim(),
                className: `w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2
                  ${loading || !prompt.trim() ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/30'}`
              },
                loading ? React.createElement('div', { className: 'w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' }) : React.createElement(IconVideo, { className: 'w-5 h-5' }),
                loading ? '正在生成中...' : '立即生成'
              ),
              
              // 重置按钮
              React.createElement('button', {
                onClick: handleReset,
                disabled: loading,
                className: 'w-full py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50'
              }, '重置参数')
            )
          ),

          // 右侧：预览区
          React.createElement('div', { className: 'flex-1 bg-slate-100/50 flex items-center justify-center p-8 relative' },
            // 背景装饰
            !resultVideo && !loading && React.createElement('div', { className: 'text-center text-slate-400' },
              React.createElement(IconVideo, { className: 'w-24 h-24 mx-auto mb-4 opacity-20' }),
              React.createElement('p', { className: 'text-lg font-medium opacity-60' }, '在左侧输入描述，开始创作您的视频')
            ),

            // 加载动画
            loading && React.createElement('div', { className: 'flex flex-col items-center justify-center space-y-4' },
              React.createElement('div', { className: 'relative' },
                 React.createElement('div', { className: 'w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin' }),
                 React.createElement('div', { className: 'absolute inset-0 flex items-center justify-center' },
                   React.createElement(IconSparkles, { className: 'w-6 h-6 text-blue-600 animate-pulse' })
                 )
              ),
              React.createElement('p', { className: 'text-slate-600 font-medium animate-pulse' }, 'AI 正在生成视频...')
            ),

            // 结果展示
            resultVideo && !loading && React.createElement('div', { className: 'relative group max-w-full max-h-full shadow-2xl rounded-lg overflow-hidden w-full h-full flex items-center justify-center' },
              React.createElement('video', { 
                src: resultVideo, 
                controls: true,
                className: 'max-w-full max-h-[75vh] object-contain bg-black'
              }),
              React.createElement('div', { className: 'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-3' },
                React.createElement('a', { 
                  href: resultVideo, 
                  target: '_blank',
                  download: 'ai-generated-video.mp4',
                  className: 'p-2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-lg transition-colors',
                  title: '下载视频'
                }, React.createElement(IconDownload, { className: 'w-5 h-5' }))
              )

            )
          )
        )
      )
    );
  };

  window.ToolsPages = window.ToolsPages || {};
  window.ToolsPages['17'] = Tool17;
})();