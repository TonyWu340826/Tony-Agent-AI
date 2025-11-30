const RechargeManagement = () => {
  const { useState, useEffect } = React;
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [userId, setUserId] = useState('');
  const [tradeNo, setTradeNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ userId: '', amount: '', type: 'BALANCE' });

  const fetchList = async (targetPage = page) => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', targetPage); params.set('size', size);
      if (userId) params.set('userId', userId);
      if (tradeNo) params.set('tradeNo', tradeNo);
      const resp = await fetch(`/api/recharge/admin?${params.toString()}`, { credentials: 'same-origin' });
      const text = await resp.text(); let data = {}; try { data = JSON.parse(text); } catch(_) { throw new Error('接口异常'); }
      if (!resp.ok) throw new Error(data.message || '加载失败');
      setItems(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(data.number ?? targetPage);
    } catch(e) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchList(0); }, []);

  const handleSearch = () => fetchList(0);
  const handlePrev = () => { if (page>0) fetchList(page-1); };
  const handleNext = () => { if (page<totalPages-1) fetchList(page+1); };

  const submitAdd = async () => {
    setLoading(true); setError('');
    try {
      const payload = { userId: Number(form.userId), amount: form.amount, type: form.type };
      const resp = await fetch('/api/recharge/admin/manual', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify(payload) });
      const text = await resp.text(); let data = {}; try { data = JSON.parse(text || '{}'); } catch(_) {}
      if (!resp.ok || data.success===false) throw new Error(data.message || '新增失败');
      setShowAdd(false); setForm({ userId:'', amount:'', type:'BALANCE' }); fetchList(0);
    } catch(e) { setError(e.message || '请求失败'); } finally { setLoading(false); }
  };

  return (
    React.createElement('div',{className:'p-6 md:p-10 bg-white rounded-xl shadow-lg w-full h-full space-y-6'},
      React.createElement('h2',{className:'text-3xl font-bold text-gray-800 flex items-center border-b pb-4 mb-4'}, '充值管理'),
      React.createElement('div',{className:'flex items-center gap-3'},
        React.createElement('input',{className:'border border-gray-300 rounded-lg px-3 py-2 w-40', placeholder:'用户ID', value:userId, onChange:(e)=>setUserId(e.target.value)}),
        React.createElement('input',{className:'border border-gray-300 rounded-lg px-3 py-2 w-64', placeholder:'交易流水号', value:tradeNo, onChange:(e)=>setTradeNo(e.target.value)}),
        React.createElement('button',{className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:handleSearch}, '搜索'),
        React.createElement('button',{className:'px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700', onClick:()=>setShowAdd(true)}, '手动新增成功记录')
      ),
      error && React.createElement('div',{className:'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md'}, error),
      React.createElement('div',{className:'overflow-x-auto bg-white rounded-lg border border-gray-200 shadow'},
        React.createElement('table',{className:'min-w-full divide-y divide-gray-200'},
          React.createElement('thead',{className:'bg-gray-50'}, React.createElement('tr',null,
            ['ID','用户ID','金额','类型','状态','交易号','时间'].map((h,i)=>React.createElement('th',{key:i,className:'px-4 py-3 text-left text-xs font-medium text-gray-500'},h))
          )),
          React.createElement('tbody',{className:'bg-white divide-y divide-gray-200'},
            loading ? React.createElement('tr',null,React.createElement('td',{className:'px-4 py-6 text-center text-gray-500',colSpan:7},'加载中...'))
            : items.length===0 ? React.createElement('tr',null,React.createElement('td',{className:'px-4 py-6 text-center text-gray-500',colSpan:7},'暂无数据'))
            : items.map(r => React.createElement('tr',{key:r.tradeNo},
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, r.id),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, r.userId),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, r.amount),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, r.type),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, r.status),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, r.tradeNo),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, r.rechargeDate ? new Date(r.rechargeDate).toLocaleString() : '-')
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
      showAdd && React.createElement('div',{className:'fixed inset-0 bg-black/30 flex items-center justify-center p-4'},
        React.createElement('div',{className:'bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4'},
          React.createElement('h3',{className:'text-xl font-bold text-gray-800'}, '手动新增成功记录（触发VIP5）'),
          React.createElement('div',{className:'space-y-3'},
            React.createElement('input',{className:'w-full border border-gray-300 rounded-lg px-3 py-2', placeholder:'用户ID', value:form.userId, onChange:(e)=>setForm({...form,userId:e.target.value})}),
            React.createElement('input',{className:'w-full border border-gray-300 rounded-lg px-3 py-2', placeholder:'金额(如 99.00)', value:form.amount, onChange:(e)=>setForm({...form,amount:e.target.value})}),
            React.createElement('select',{className:'w-full border border-gray-300 rounded-lg px-3 py-2', value:form.type, onChange:(e)=>setForm({...form,type:e.target.value})},
              React.createElement('option',{value:'BALANCE'},'余额'),
              React.createElement('option',{value:'VIP'},'VIP')
            )
          ),
          React.createElement('div',{className:'flex justify-end space-x-2 pt-2'},
            React.createElement('button',{className:'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick:()=>{ setShowAdd(false); setForm({ userId:'', amount:'', type:'BALANCE' }); }},'取消'),
            React.createElement('button',{className:'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:submitAdd},'保存')
          )
        )
      )
    )
  );
};

window.Components = window.Components || {};
window.Components.RechargeManagement = RechargeManagement;
try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}

