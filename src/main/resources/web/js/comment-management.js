const CommentManagement = () => {
  const { useState, useEffect } = React;
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [articleId, setArticleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showThread, setShowThread] = useState(false);
  const [threadList, setThreadList] = useState([]);
  const [threadArticleId, setThreadArticleId] = useState(null);

  const fetchList = async (targetPage = page) => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams();
      params.set('page', targetPage);
      params.set('size', size);
      if (searchTerm) params.set('search', searchTerm);
      if (articleId) params.set('articleId', articleId);
      const resp = await fetch(`/api/comments/admin?${params.toString()}`, { credentials: 'same-origin' });
      const text = await resp.text();
      let data = {}; try { data = JSON.parse(text); } catch(_) { throw new Error('接口异常'); }
      if (!resp.ok) throw new Error(data.message || '加载失败');
      setItems(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(data.number ?? targetPage);
    } catch(e) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchList(0); }, []);

  const handleSearch = () => fetchList(0);
  const handlePrev = () => { if (page > 0) fetchList(page - 1); };
  const handleNext = () => { if (page < totalPages - 1) fetchList(page + 1); };

  const openThread = async (aid) => {
    setLoading(true); setError("");
    try {
      const resp = await fetch(`/api/comments/article/${aid}`, { credentials: 'same-origin' });
      const text = await resp.text();
      let data = []; try { data = JSON.parse(text || '[]'); } catch(_) { throw new Error('加载线程失败'); }
      if (!resp.ok) throw new Error('加载线程失败');
      setThreadArticleId(aid);
      setThreadList(data || []);
      setShowThread(true);
    } catch(e) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  };

  const deleteComment = async (id) => {
    if (!confirm('确认删除该评论？')) return;
    setLoading(true); setError("");
    try {
      const resp = await fetch(`/api/comments/admin/${id}`, { method: 'DELETE', credentials: 'same-origin' });
      if (!resp.ok) {
        const text = await resp.text();
        try { const data = JSON.parse(text || '{}'); throw new Error(data.message || '删除失败'); } catch(_) { throw new Error('删除失败'); }
      }
      fetchList(page);
    } catch(e) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  };

  const renderReplies = (list, level = 0) => {
    const pad = level * 16;
    return list.map(c => (
      React.createElement('div', { key: c.id, style: { paddingLeft: pad }, className: 'py-2 border-l border-gray-200' },
        React.createElement('div', { className: 'text-sm text-gray-700' }, `${c.author?.nickname || c.author?.username || '用户'}：${c.content}`),
        c.replies && c.replies.length ? renderReplies(c.replies, level + 1) : null
      )
    ));
  };

  return (
    React.createElement('div', { className: 'p-6 md:p-10 bg-white rounded-xl shadow-lg w-full h-full space-y-6' },
      React.createElement('h2', { className: 'text-3xl font-bold text-gray-800 flex items-center border-b pb-4 mb-4' }, '评论管理'),
      React.createElement('div', { className: 'flex flex-col md:flex-row items-start md:items-center gap-3' },
        React.createElement('input', { className: 'border border-gray-300 rounded-lg px-3 py-2 w-full md:w-40', placeholder: '文章ID', value: articleId, onChange: (e)=>setArticleId(e.target.value)}),
        React.createElement('input', { className: 'border border-gray-300 rounded-lg px-3 py-2 w-full md:flex-1', placeholder: '按内容关键词搜索...', value: searchTerm, onChange: (e)=>setSearchTerm(e.target.value), onKeyDown:(e)=>{ if(e.key==='Enter') handleSearch(); }}),
        React.createElement('button', { className: 'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick: handleSearch }, '搜索')
      ),
      error && React.createElement('div', { className: 'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md' }, error),
      React.createElement('div', { className: 'overflow-x-auto bg-white rounded-lg border border-gray-200 shadow' },
        React.createElement('table', { className: 'min-w-full divide-y divide-gray-200' },
          React.createElement('thead', { className: 'bg-gray-50' },
            React.createElement('tr', null,
              ['ID','文章','用户','内容','父评论','时间','操作'].map((h,i)=>React.createElement('th',{key:i,className:'px-4 py-3 text-left text-xs font-medium text-gray-500'},h))
            )
          ),
          React.createElement('tbody', { className: 'bg-white divide-y divide-gray-200' },
            loading ? React.createElement('tr',null,React.createElement('td',{className:'px-4 py-6 text-center text-gray-500',colSpan:7},'加载中...'))
            : items.length===0 ? React.createElement('tr',null,React.createElement('td',{className:'px-4 py-6 text-center text-gray-500',colSpan:7},'暂无数据'))
            : items.map(it => React.createElement('tr',{key:it.id},
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.id),
                React.createElement('td',{className:'px-4 py-3 text-sm text-blue-700 underline cursor-pointer', onClick:()=>openThread(it.articleId)}, it.articleTitle || it.articleId),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.authorName || it.userId),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700 truncate max-w-[20rem]'}, it.content),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.parentId || '-'),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.createdAt ? new Date(it.createdAt).toLocaleString() : '-'),
                React.createElement('td',{className:'px-4 py-3 text-sm'},
                  React.createElement('div',{className:'flex items-center justify-end gap-2 whitespace-nowrap'},
                    React.createElement('button',{className:'px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700', onClick:()=>deleteComment(it.id)},'删除')
                  )
                )
            ))
          )
        )
      ),
      React.createElement('div',{className:'flex items-center justify-between'},
        React.createElement('div',{className:'text-sm text-gray-600'}, `第 ${page+1} / ${Math.max(totalPages,1)} 页`),
        React.createElement('div',{className:'space-x-2'},
          React.createElement('button',{className:'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50', disabled: page===0, onClick:handlePrev}, '上一页'),
          React.createElement('button',{className:'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50', disabled: page>=totalPages-1, onClick:handleNext}, '下一页')
        )
      ),
      showThread && React.createElement('div',{className:'fixed inset-0 bg-black/30 flex items-center justify-center p-4'},
        React.createElement('div',{className:'bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 space-y-4'},
          React.createElement('h3',{className:'text-xl font-bold text-gray-800'}, `文章 ${threadArticleId} 的评论线程`),
          React.createElement('div',{className:'max-h-[60vh] overflow-y-auto'}, renderReplies(threadList)),
          React.createElement('div',{className:'flex justify-end'},
            React.createElement('button',{className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:()=>{ setShowThread(false); setThreadList([]); setThreadArticleId(null); }},'关闭')
          )
        )
      )
    )
  );
};

window.Components = window.Components || {};
window.Components.CommentManagement = CommentManagement;
try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}

