// Dashboard Summary component (独立文件)
const DashboardSummary = ({ userId }) => {
  const { useState, useEffect } = React;
  const [now, setNow] = useState(new Date());
  const [userCount, setUserCount] = useState(null);
  const [publishedCount, setPublishedCount] = useState(null);
  const [visitCount, setVisitCount] = useState(null);
  const [showVisitList, setShowVisitList] = useState(false);
  const [visitList, setVisitList] = useState([]);
  const [visitPage, setVisitPage] = useState(0);
  const [visitTotalPages, setVisitTotalPages] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const resp = await fetch('/api/admin/users?page=0&size=1', { credentials: 'same-origin' });
        const txt = await resp.text(); let data={}; try{ data = JSON.parse(txt||'{}'); }catch(_){ data={}; }
        const total = (typeof data.totalElements === 'number') ? data.totalElements : ((Array.isArray(data.content)?data.content.length:0));
        setUserCount(total);
      } catch(e) { setError('加载用户数量失败'); }
    };
    const fetchPublishedCount = async () => {
      try {
        const resp = await fetch('/api/articles?page=0&size=1');
        const txt = await resp.text(); let data={}; try{ data = JSON.parse(txt||'{}'); }catch(_){ data={}; }
        const total = (typeof data.totalElements === 'number') ? data.totalElements : ((Array.isArray(data.content)?data.content.length:0));
        setPublishedCount(total);
      } catch(e) { setError('加载文章数量失败'); }
    };
    fetchUsersCount();
    fetchPublishedCount();
    const recordVisit = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        const username = token ? token.split('-').pop() : '访客';
        await fetch('/api/visit/logs', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify({ username, path: '/dashboard/summary' }) });
      } catch(_){}
    };
    const fetchTodayVisitCount = async () => {
      try { const r = await fetch('/api/visit/today/count', { credentials:'same-origin' }); const t= await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; } setVisitCount(typeof d.count==='number'?d.count:null); } catch(_){ setVisitCount(null); }
    };
    recordVisit();
    fetchTodayVisitCount();
  }, []);

  const loadVisitList = async (targetPage=0) => {
    try {
      const r = await fetch(`/api/visit/today/list?page=${targetPage}&size=10`, { credentials:'same-origin' });
      const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
      const content = Array.isArray(d.content) ? d.content : [];
      setVisitList(content);
      setVisitPage(d.number ?? targetPage);
      setVisitTotalPages(d.totalPages ?? 0);
      setShowVisitList(true);
    } catch(_){ setShowVisitList(true); }
  };

  return (
    React.createElement('div',{className:'p-8 md:p-12 bg-white rounded-2xl shadow-lg w-full h-full space-y-6'},
      React.createElement('div',{className:'flex items-center justify-between'},
        React.createElement('h2',{className:'text-4xl font-extrabold text-gray-800 flex items-center'},
          React.createElement(LayoutDashboard,{className:'w-8 h-8 mr-3 text-blue-600'}), ' 仪表盘概览'
        ),
        React.createElement('div',{className:'flex items-center text-lg md:text-xl text-gray-700'},
          React.createElement(Sun,{className:'w-6 h-6 mr-2 text-yellow-500'}),
          React.createElement('span',null, now.toLocaleString())
        )
      ),
      React.createElement('p',{className:'text-xl text-gray-700'},
        '欢迎回来，', React.createElement('span',{className:'font-semibold text-blue-600'}, userId),'！这是您的管理后台总览。'
      ),
      error && React.createElement('div',{className:'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md'}, error),
      React.createElement('div',{className:'grid grid-cols-1 md:grid-cols-3 gap-8 pt-2'},
        React.createElement('div',{className:'bg-blue-50 p-8 rounded-2xl border border-blue-200 shadow-md'},
          React.createElement('p',{className:'text-base font-medium text-blue-600'},'总注册用户'),
          React.createElement('p',{className:'text-4xl font-extrabold text-gray-900 mt-1'}, userCount!=null ? String(userCount) : '—')
        ),
        React.createElement('div',{className:'bg-green-50 p-8 rounded-2xl border border-green-200 shadow-md'},
          React.createElement('p',{className:'text-base font-medium text-green-600'},'已发布文章'),
          React.createElement('p',{className:'text-4xl font-extrabold text-gray-900 mt-1'}, publishedCount!=null ? String(publishedCount) : '—')
        ),
        React.createElement('div',{className:'bg-yellow-50 p-8 rounded-2xl border border-yellow-200 shadow-md'},
          React.createElement('p',{className:'text-base font-medium text-yellow-600'},'今日访问量'),
          React.createElement('p',{className:'text-4xl font-extrabold text-gray-900 mt-1'}, visitCount!=null ? String(visitCount) : '—'),
          React.createElement('div',{className:'mt-3'},
            React.createElement('button',{className:'px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:()=>loadVisitList(0)}, '查看列表')
          )
        )
      ),
      React.createElement('div',{className:'mt-8 bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-300 text-center'},
        React.createElement('p',{className:'text-gray-700 font-semibold text-lg'},'数据分析图表占位区'),
        React.createElement('p',{className:'text-base text-gray-500 mt-2'},'未来将集成实时数据图表，如用户增长趋势、文章热门度等。')
      )
      ,
      showVisitList && React.createElement('div',{className:'fixed inset-0 bg-black/30 flex items-center justify-center p-4'},
        React.createElement('div',{className:'bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 space-y-4'},
          React.createElement('h3',{className:'text-xl font-bold text-gray-800'}, '今日访问列表'),
          React.createElement('div',{className:'overflow-x-auto bg-white rounded-lg border border-gray-200 shadow'},
            React.createElement('table',{className:'min-w-full divide-y divide-gray-200'},
              React.createElement('thead',{className:'bg-gray-50'}, React.createElement('tr',null,
                ['时间','用户','IP','路径','UA'].map((h,i)=>React.createElement('th',{key:i,className:'px-4 py-3 text-left text-xs font-medium text-gray-500'},h))
              )),
              React.createElement('tbody',{className:'bg-white divide-y divide-gray-200'},
                visitList.length===0 ? React.createElement('tr',null,React.createElement('td',{className:'px-4 py-6 text-center text-gray-500', colSpan:5},'暂无访问')) :
                visitList.map(it => React.createElement('tr',{key:it.id},
                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.createdAt ? new Date(it.createdAt).toLocaleString() : '-'),
                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.username || '-'),
                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.ip || '-'),
                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, it.path || '-'),
                  React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700 truncate max-w-[20rem]'}, it.userAgent || '-')
                ))
              )
            )
          ),
          React.createElement('div',{className:'flex items-center justify-between'},
            React.createElement('div',{className:'text-sm text-gray-600'}, `第 ${visitPage+1} / ${Math.max(visitTotalPages,1)} 页`),
            React.createElement('div',{className:'space-x-2'},
              React.createElement('button',{className:'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50', disabled: visitPage===0, onClick:()=>loadVisitList(visitPage-1)}, '上一页'),
              React.createElement('button',{className:'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50', disabled: visitPage>=visitTotalPages-1, onClick:()=>loadVisitList(visitPage+1)}, '下一页')
            )
          ),
          React.createElement('div',{className:'flex justify-end'},
            React.createElement('button',{className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:()=>setShowVisitList(false)}, '关闭')
          )
        )
      )
    )
  );
};

window.Components = window.Components || {};
window.Components.DashboardSummary = DashboardSummary;
try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}
