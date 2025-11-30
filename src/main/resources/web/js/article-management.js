const ArticleManagement = () => {
  const { useState, useEffect, useRef } = React;
  const Lucide = window.LucideReact || {};
  const Fallback = (props) => React.createElement('span', { className: props && props.className });
  const IconFileText = (typeof Lucide.FileText === 'function') ? Lucide.FileText : Fallback;
  const IconPlus = (typeof Lucide.Plus === 'function') ? Lucide.Plus : Fallback;
  const IconSearch = (typeof Lucide.Search === 'function') ? Lucide.Search : Fallback;

  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [addForm, setAddForm] = useState({ title: "", slug: "", summary: "", content: "", status: "DRAFT", authorName: "", contentFormat: "HTML", type: "" });
  const contentRef = useRef("");
  const [catTree, setCatTree] = useState([]);

  const fetchArticles = async (targetPage = page) => {
    setLoading(true);
    setError("");
    try {
      const url = `/api/articles/admin?page=${targetPage}&size=${size}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}`;
      const response = await fetch(url, { credentials: 'same-origin' });
      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text); } catch (_) { throw new Error('未登录或接口异常'); }
      if (!response.ok) throw new Error(data.message || '加载文章失败');
      setArticles(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(data.number ?? targetPage);
    } catch (e) {
      setError(e.message || "请求失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticles(0); fetchCategories(); }, []);

  const fetchCategories = async () => {
    try { const r = await fetch('/api/categories/tree', { credentials:'same-origin' }); const t = await r.text(); const d = JSON.parse(t||'[]'); setCatTree(d||[]); } catch(_) {}
  };

  const categoryOptions = () => {
    const opts = [];
    const walk = (nodes, prefix='') => { (nodes||[]).forEach(n => { opts.push({ id:n.id, name: prefix ? `${prefix} > ${n.name}` : n.name }); if (n.children && n.children.length) walk(n.children, prefix?`${prefix} > ${n.name}`:n.name); }); };
    walk(catTree); return opts;
  };

  const handleSearch = () => fetchArticles(0);
  const handlePrev = () => { if (page > 0) fetchArticles(page - 1); };
  const handleNext = () => { if (page < totalPages - 1) fetchArticles(page + 1); };

  const openAdd = () => { setShowAdd(true); };
  const openEdit = (article) => { setCurrentArticle({ ...article }); contentRef.current = article.content || ""; setShowEdit(true); };
  const openDetail = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/articles/admin/${id}`, { credentials: 'same-origin' });
      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text || '{}'); } catch (_) { throw new Error('加载详情失败'); }
      if (!response.ok) throw new Error(data.message || '加载详情失败');
      setCurrentArticle(data);
      setShowDetail(true);
    } catch (e) {
      setError(e.message || "请求失败");
    } finally { setLoading(false); }
  };

  const RichTextEditor = ({ value, onChange, storageKey = 'article:editor' }) => {
    const wrapperRef = useRef(null);
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const hasSetInitRef = useRef(false);
    useEffect(() => {
      const el = editorRef.current;
      if (!el || !window.Quill) return;
      if (el.__quill_inited) return;
      try { const Font = Quill.import('formats/font'); Font.whitelist = ['sans-serif','serif','monospace']; Quill.register(Font, true); } catch(e) {}
      try { const Size = Quill.import('attributors/style/size'); Quill.register(Size, true); } catch(e) {}

      const toolbar = {
        container: [
          [{ font: ['sans-serif','serif','monospace'] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote'],
          ['link', 'image'],
          ['clean']
        ],
        handlers: {
          image: function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = () => {
              const file = input.files && input.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const base64 = reader.result;
                const range = quillRef.current && quillRef.current.getSelection();
                const index = range ? range.index : (quillRef.current.getLength() || 0);
                quillRef.current.insertEmbed(index, 'image', base64, 'user');
              };
              reader.readAsDataURL(file);
            };
            input.click();
          }
        }
      };

      const q = new Quill(el, { theme: 'snow', placeholder: '在此编写内容，可插入链接/图片，支持格式化', modules: { toolbar } });
      el.__quill_inited = true;
      quillRef.current = q;
      const cached = sessionStorage.getItem(storageKey);
      const initHtml = cached != null ? cached : (value || '');
      if (initHtml && !hasSetInitRef.current) { q.root.innerHTML = initHtml; hasSetInitRef.current = true; }
      let timer = null;
      const handler = () => {
        const html = q.root.innerHTML;
        try { sessionStorage.setItem(storageKey, html); } catch(e) {}
        if (timer) return;
        timer = setTimeout(() => { timer = null; onChange && onChange(html); }, 120);
      };
      q.on('text-change', handler);
      return () => {
        try { q.off('text-change', handler); } catch(e) {}
        quillRef.current = null;
        if (el) { el.__quill_inited = false; el.innerHTML = ''; }
        if (timer) { clearTimeout(timer); timer = null; }
      };
    }, []);
    useEffect(() => {
      const q = quillRef.current;
      if (q && !hasSetInitRef.current && value) { q.root.innerHTML = value; hasSetInitRef.current = true; }
    }, [value]);
    return React.createElement('div', { ref: wrapperRef, className: 'space-y-2' },
      React.createElement('div', { className: 'min-h-[240px]', ref: editorRef })
    );
  };

  const handleAddSave = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          ...addForm,
          content: contentRef.current || addForm.content || "",
          contentFormat: "HTML"
        })
      });
      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text || '{}'); } catch (_) { throw new Error('新增失败'); }
      if (!response.ok) throw new Error(data.message || '新增失败');
      setShowAdd(false);
      try { sessionStorage.removeItem('article:add'); } catch(e) {}
      setAddForm({ title: "", slug: "", summary: "", content: "", status: "DRAFT", authorName: "", contentFormat: "HTML", type: "" });
      fetchArticles(0);
    } catch (e) {
      setError(e.message || "请求失败");
    } finally { setLoading(false); }
  };

  const handleEditSave = async () => {
    if (!currentArticle) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/articles/${currentArticle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          title: currentArticle.title,
          slug: currentArticle.slug,
          summary: currentArticle.summary,
          content: contentRef.current || currentArticle.content || "",
          status: currentArticle.status || 'DRAFT',
          contentFormat: currentArticle.contentFormat || 'HTML',
          type: currentArticle.type || ''
        })
      });
      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text || '{}'); } catch (_) { throw new Error('更新失败'); }
      if (!response.ok) throw new Error(data.message || '更新失败');
      setShowEdit(false);
      try { sessionStorage.removeItem(`article:edit:${currentArticle.id}`); } catch(e) {}
      setCurrentArticle(null);
      fetchArticles(page);
    } catch (e) {
      setError(e.message || "请求失败");
    } finally { setLoading(false); }
  };

  const handlePublish = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/articles/${id}/publish`, { method: 'PUT', credentials: 'same-origin' });
      if (!response.ok) {
        const text = await response.text();
        try { const data = JSON.parse(text || '{}'); throw new Error(data.message || '发布失败'); } catch(_) { throw new Error('发布失败'); }
      }
      fetchArticles(page);
    } catch (e) { setError(e.message || "请求失败"); } finally { setLoading(false); }
  };

  const handleUnpublish = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/articles/${id}/unpublish`, { method: 'PUT', credentials: 'same-origin' });
      if (!response.ok) {
        const text = await response.text();
        try { const data = JSON.parse(text || '{}'); throw new Error(data.message || '下架失败'); } catch(_) { throw new Error('下架失败'); }
      }
      fetchArticles(page);
    } catch (e) { setError(e.message || "请求失败"); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('确认删除该文章？')) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/articles/${id}`, { method: 'DELETE', credentials: 'same-origin' });
      if (!response.ok && response.status !== 200) {
        const text = await response.text();
        try { const data = JSON.parse(text || '{}'); throw new Error(data.message || '删除失败'); } catch(_) { throw new Error('删除失败'); }
      }
      fetchArticles(page);
    } catch (e) { setError(e.message || "请求失败"); } finally { setLoading(false); }
  };

  return (
    React.createElement('div', { className: 'p-6 md:p-10 bg-white rounded-xl shadow-lg w-full h-full space-y-6' },
      React.createElement('h2', { className: 'text-3xl font-bold text-gray-800 flex items-center border-b pb-4 mb-4' },
        React.createElement(IconFileText, { className: 'w-7 h-7 mr-3 text-blue-600' }), ' 文章内容管理'),
      React.createElement('div', { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4' },
        React.createElement('button', { className: 'flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-150', onClick: openAdd },
          React.createElement(IconPlus, { className: 'w-5 h-5 mr-2' }), ' 新建文章'),
        React.createElement('div', { className: 'relative w-full sm:w-1/3' },
          React.createElement('input', { type: 'search', value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') handleSearch(); }, placeholder: '搜索标题/摘要/slug...', className: 'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500' }),
          React.createElement(IconSearch, { className: 'w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' })),
        React.createElement('button', { className: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md', onClick: handleSearch }, '搜索')
      ),
      error && React.createElement('div', { className: 'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md' }, error),
      React.createElement('div', { className: 'overflow-x-auto bg-white rounded-lg border border-gray-200 shadow' },
        React.createElement('table', { className: 'min-w-full divide-y divide-gray-200' },
          React.createElement('thead', { className: 'bg-gray-50' },
            React.createElement('tr', null,
              ['ID','标题','Slug','摘要','作者','状态','类型','操作'].map((h,i)=>React.createElement('th',{key:i,className:'px-4 py-3 text-left text-xs font-medium text-gray-500'},h))
            )
          ),
          React.createElement('tbody', { className: 'bg-white divide-y divide-gray-200' },
            loading ? React.createElement('tr', null, React.createElement('td', { className: 'px-4 py-6 text-center text-gray-500', colSpan: 8 }, '加载中...'))
            : articles.length === 0 ? React.createElement('tr', null, React.createElement('td', { className: 'px-4 py-6 text-center text-gray-500', colSpan: 8 }, '暂无数据'))
            : articles.map(a => React.createElement('tr', { key: a.id },
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, a.id),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, a.title),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, a.slug),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700 truncate max-w-[20rem]' }, a.summary),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, a.authorName),
                React.createElement('td', { className: 'px-4 py-3 text-sm' }, a.status || 'DRAFT'),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, a.type || '-'),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-right space-x-2' },
                  React.createElement('button', { className: 'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300', onClick: () => openDetail(a.id) }, '详情'),
                  React.createElement('button', { className: 'px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick: () => openEdit(a) }, '编辑'),
                  a.status === 'PUBLISHED'
                    ? React.createElement('button', { className: 'px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600', onClick: () => handleUnpublish(a.id) }, '下架')
                    : React.createElement('button', { className: 'px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700', onClick: () => handlePublish(a.id) }, '发布'),
                  React.createElement('button', { className: 'px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700', onClick: () => handleDelete(a.id) }, '删除')
                )
              ))
          )
        )
      ),
      React.createElement('div', { className: 'flex items-center justify-between' },
        React.createElement('div', { className: 'text-sm text-gray-600' }, `第 ${page + 1} / ${Math.max(totalPages, 1)} 页`),
        React.createElement('div', { className: 'space-x-2' },
          React.createElement('button', { className: 'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50', disabled: page === 0, onClick: handlePrev }, '上一页'),
          React.createElement('button', { className: 'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50', disabled: page >= totalPages - 1, onClick: handleNext }, '下一页')
        )
      ),
      showAdd && React.createElement('div', { className: 'fixed inset-0 bg-black/30 flex items-center justify-center p-4' },
        React.createElement('div', { className: 'bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4' },
          React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, '新增文章'),
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
            React.createElement('input', { className: 'border border-gray-300 rounded-lg px-3 py-2', placeholder: '标题', value: addForm.title, onChange: (e) => setAddForm({ ...addForm, title: e.target.value }) }),
            React.createElement('input', { className: 'border border-gray-300 rounded-lg px-3 py-2', placeholder: 'Slug', value: addForm.slug, onChange: (e) => setAddForm({ ...addForm, slug: e.target.value }) }),
            React.createElement('input', { className: 'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2', placeholder: '摘要', value: addForm.summary, onChange: (e) => setAddForm({ ...addForm, summary: e.target.value }) }),
      React.createElement('div', { className: 'md:col-span-2 space-y-2' },
              React.createElement(RichTextEditor, { value: addForm.content, onChange: (html) => { contentRef.current = html; }, storageKey: 'article:add' })
            ),
            React.createElement('select', { className: 'border border-gray-300 rounded-lg px-3 py-2', value: addForm.status, onChange: (e) => setAddForm({ ...addForm, status: e.target.value }) },
              React.createElement('option', { value: 'DRAFT' }, '草稿'),
              React.createElement('option', { value: 'PUBLISHED' }, '发布')
            ),
            React.createElement('select', { className: 'border border-gray-300 rounded-lg px-3 py-2', value: addForm.type || '', onChange: (e) => setAddForm({ ...addForm, type: e.target.value }) },
              React.createElement('option', { value: '' }, '选择分类'),
              categoryOptions().map(o => React.createElement('option',{ key:o.id, value:o.name }, o.name ))
            )
          ),
          React.createElement('div', { className: 'flex justify-end space-x-2 pt-2' },
            React.createElement('button', { className: 'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick: () => { setShowAdd(false); } }, '取消'),
            React.createElement('button', { className: 'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick: handleAddSave }, '保存')
          )
        )
      ),
      showEdit && currentArticle && React.createElement('div', { className: 'fixed inset-0 bg-black/30 flex items-center justify-center p-4' },
        React.createElement('div', { className: 'bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4' },
          React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, '编辑文章'),
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
            React.createElement('div', { className: 'text-sm text-gray-500 md:col-span-2' }, `ID: ${currentArticle.id}`),
            React.createElement('input', { className: 'border border-gray-300 rounded-lg px-3 py-2', placeholder: '标题', value: currentArticle.title ?? '', onChange: (e) => setCurrentArticle({ ...currentArticle, title: e.target.value }) }),
            React.createElement('input', { className: 'border border-gray-300 rounded-lg px-3 py-2', placeholder: 'Slug', value: currentArticle.slug ?? '', onChange: (e) => setCurrentArticle({ ...currentArticle, slug: e.target.value }) }),
            React.createElement('input', { className: 'border border-gray-300 rounded-lg px-3 py-2 md:col-span-2', placeholder: '摘要', value: currentArticle.summary ?? '', onChange: (e) => setCurrentArticle({ ...currentArticle, summary: e.target.value }) }),
            React.createElement('div', { className: 'md:col-span-2 space-y-2' },
              React.createElement(RichTextEditor, { value: currentArticle.content ?? '', onChange: (html) => { contentRef.current = html; }, storageKey: `article:edit:${currentArticle.id}` })
            ),
            React.createElement('select', { className: 'border border-gray-300 rounded-lg px-3 py-2', value: currentArticle.status ?? 'DRAFT', onChange: (e) => setCurrentArticle({ ...currentArticle, status: e.target.value }) },
              React.createElement('option', { value: 'DRAFT' }, '草稿'),
              React.createElement('option', { value: 'PUBLISHED' }, '发布')
            ),
            React.createElement('select', { className: 'border border-gray-300 rounded-lg px-3 py-2', value: currentArticle.type ?? '', onChange: (e) => setCurrentArticle({ ...currentArticle, type: e.target.value }) },
              React.createElement('option', { value: '' }, '选择分类'),
              categoryOptions().map(o => React.createElement('option',{ key:o.id, value:o.name }, o.name ))
            )
          ),
          React.createElement('div', { className: 'flex justify-end space-x-2 pt-2' },
            React.createElement('button', { className: 'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick: () => { setShowEdit(false); setCurrentArticle(null); } }, '取消'),
            React.createElement('button', { className: 'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick: handleEditSave }, '保存')
          )
        )
      ),
      showDetail && currentArticle && React.createElement('div', { className: 'fixed inset-0 bg-black/30 flex items-center justify-center p-4' },
        React.createElement('div', { className: 'bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 space-y-4' },
          React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, '文章详情'),
          React.createElement('div', { className: 'space-y-2' },
            React.createElement('div', { className: 'text-sm text-gray-700' }, `标题: ${currentArticle.title}`),
            React.createElement('div', { className: 'text-sm text-gray-700' }, `Slug: ${currentArticle.slug}`),
            React.createElement('div', { className: 'text-sm text-gray-700' }, `作者: ${currentArticle.authorName}`),
            React.createElement('div', { className: 'text-sm text-gray-700' }, `状态: ${currentArticle.status || 'DRAFT'}`),
            React.createElement('div', { className: 'text-sm text-gray-700' }, `类型: ${currentArticle.type || '-'}`),
            React.createElement('div', { className: 'text-sm text-gray-700' }, `格式: ${currentArticle.contentFormat || 'HTML'}`),
            React.createElement('div', { className: 'text-sm text-gray-700' }, '内容:'),
            React.createElement('div', { className: 'text-sm text-gray-800 whitespace-pre-wrap border border-gray-200 rounded-lg p-3 bg-gray-50' }, currentArticle.content)
          ),
          React.createElement('div', { className: 'flex justify-end' },
            React.createElement('button', { className: 'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick: () => { setShowDetail(false); setCurrentArticle(null); } }, '关闭')
          )
        )
      )
    )
  );
};

window.Components = window.Components || {};
window.Components.ArticleManagement = ArticleManagement;
try { window.dispatchEvent(new Event('modules:loaded')); } catch (e) {}
