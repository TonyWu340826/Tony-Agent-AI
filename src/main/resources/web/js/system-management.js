const SystemManagement = () => {
  const { useState, useEffect } = React;

  // Tabs: 'pay' | 'messages'
  const [tab, setTab] = useState('pay');
  const [wechatQR, setWechatQR] = useState('');
  const [alipayQR, setAlipayQR] = useState('');
  const [cfgLoading, setCfgLoading] = useState(false);
  const [cfgMsg, setCfgMsg] = useState('');

  const [msgs, setMsgs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [replyItem, setReplyItem] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchConfigs = async () => {
    setCfgLoading(true); setCfgMsg('');
    try {
      const r1 = await fetch('/api/v1/configs/value?key=PAY_QR_WECHAT', { credentials:'same-origin' });
      const we = await r1.text(); setWechatQR(we||'');
      const r2 = await fetch('/api/v1/configs/value?key=PAY_QR_ALIPAY', { credentials:'same-origin' });
      const al = await r2.text(); setAlipayQR(al||'');
    } catch(e){ setCfgMsg('加载配置失败'); } finally { setCfgLoading(false); }
  };

  const saveConfig = async (key, value) => {
    setCfgLoading(true); setCfgMsg('');
    try {
      const listResp = await fetch('/api/v1/configs', { credentials:'same-origin' });
      const txt = await listResp.text(); let arr=[]; try{arr=JSON.parse(txt)||[];}catch(_){arr=[]}
      const found = arr.find(x => x.configKey === key);
      const body = JSON.stringify({ configKey: key, configValue: value, description: key==='PAY_QR_WECHAT'?'微信收款码':'支付宝收款码', configType:'TEXT' });
      if (found && found.id) {
        const resp = await fetch(`/api/v1/configs/${found.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body });
        if(!resp.ok) throw new Error('更新失败');
      } else {
        const resp = await fetch('/api/v1/configs', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body });
        if(resp.status!==201) throw new Error('创建失败');
      }
      setCfgMsg('保存成功');
    } catch(e){ setCfgMsg(e.message || '保存失败'); } finally { setCfgLoading(false); }
  };

  const onFilePick = (setter) => (e) => {
    const f=e.target.files && e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=()=>{ setter(r.result||''); }; r.readAsDataURL(f);
  };

  const fetchMessages = async () => {
    setLoading(true); setError('');
    try {
      const resp = await fetch(`/api/system/admin/messages${search?`?search=${encodeURIComponent(search)}`:''}`, { credentials:'same-origin' });
      const txt = await resp.text(); let data=[]; try{ data=JSON.parse(txt||'[]'); }catch(_){ data=[] }
      if(!resp.ok) throw new Error('加载留言失败');
      setMsgs(data||[]);
    } catch(e){ setError(e.message || '请求失败'); } finally { setLoading(false); }
  };

  const submitReply = async () => {
    if (!replyItem) return;
    setLoading(true); setError('');
    try {
      const resp = await fetch(`/api/system/admin/messages/${replyItem.id}/reply`, { method:'PUT', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify({ reply: replyText }) });
      const ok = resp.ok; if(!ok) throw new Error('回复失败');
      setReplyItem(null); setReplyText(''); fetchMessages();
    } catch(e){ setError(e.message || '请求失败'); } finally { setLoading(false); }
  };

  const deleteMsg = async (id) => {
    if(!confirm('确认删除该留言？')) return; setLoading(true); setError('');
    try { const resp = await fetch(`/api/system/admin/messages/${id}`, { method:'DELETE', credentials:'same-origin' }); if(!resp.ok) throw new Error('删除失败'); fetchMessages(); } catch(e){ setError(e.message||'请求失败'); } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchConfigs(); },[]);
  useEffect(()=>{ if(tab==='messages') fetchMessages(); },[tab]);

  return (
    React.createElement('div',{className:'p-6 md:p-10 bg-white rounded-xl shadow-lg w-full h-full space-y-6'},
      React.createElement('h2',{className:'text-3xl font-bold text-gray-800 flex items-center border-b pb-4 mb-4'}, '系统管理'),
      React.createElement('div',{className:'flex gap-2'},
        React.createElement('button',{className:`px-4 py-2 rounded-md ${tab==='pay'?'bg-blue-600 text-white':'bg-gray-200 text-gray-700'}`, onClick:()=>setTab('pay')}, '收款码配置'),
        React.createElement('button',{className:`px-4 py-2 rounded-md ${tab==='messages'?'bg-blue-600 text-white':'bg-gray-200 text-gray-700'}`, onClick:()=>setTab('messages')}, '留言管理')
      ),
      tab==='pay' ? React.createElement('div',{className:'space-y-4'},
        cfgMsg && React.createElement('div',{className:'text-sm'}, cfgMsg),
        React.createElement('div',{className:'grid grid-cols-1 md:grid-cols-2 gap-4'},
          React.createElement('div',{className:'space-y-2'},
            React.createElement('div',null,'微信收款码'),
            wechatQR ? React.createElement('img',{src:wechatQR, alt:'微信收款码', className:'w-48 h-48 object-contain border rounded'}) : null,
            React.createElement('input',{type:'file', accept:'image/*', onChange:onFilePick(setWechatQR)}),
            React.createElement('button',{className:'px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:()=>saveConfig('PAY_QR_WECHAT', wechatQR), disabled: cfgLoading}, '保存微信')
          ),
          React.createElement('div',{className:'space-y-2'},
            React.createElement('div',null,'支付宝收款码'),
            alipayQR ? React.createElement('img',{src:alipayQR, alt:'支付宝收款码', className:'w-48 h-48 object-contain border rounded'}) : null,
            React.createElement('input',{type:'file', accept:'image/*', onChange:onFilePick(setAlipayQR)}),
            React.createElement('button',{className:'px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:()=>saveConfig('PAY_QR_ALIPAY', alipayQR), disabled: cfgLoading}, '保存支付宝')
          )
        )
      ) : React.createElement('div',{className:'space-y-4'},
        error && React.createElement('div',{className:'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md'}, error),
        React.createElement('div',{className:'flex items-center gap-2'},
          React.createElement('input',{className:'border border-gray-300 rounded-lg px-3 py-2', placeholder:'搜索昵称/邮箱/内容', value:search, onChange:(e)=>setSearch(e.target.value)}),
          React.createElement('button',{className:'px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:fetchMessages}, '搜索')
        ),
        React.createElement('div',{className:'overflow-x-auto bg-white rounded-lg border border-gray-200 shadow'},
          React.createElement('table',{className:'min-w-full divide-y divide-gray-200'},
            React.createElement('thead',{className:'bg-gray-50'}, React.createElement('tr',null,
              ['ID','昵称','邮箱','内容','回复','时间','操作'].map((h,i)=>React.createElement('th',{key:i,className:'px-4 py-3 text-left text-xs font-medium text-gray-500'},h))
            )),
            React.createElement('tbody',{className:'bg-white divide-y divide-gray-200'},
              loading ? React.createElement('tr',null,React.createElement('td',{className:'px-4 py-6 text-center text-gray-500', colSpan:7},'加载中...'))
              : msgs.length===0 ? React.createElement('tr',null,React.createElement('td',{className:'px-4 py-6 text-center text-gray-500', colSpan:7},'暂无数据'))
              : msgs.map(m => React.createElement('tr',{key:m.id},
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, m.id),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, m.nickname||'-'),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, m.email||'-'),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, m.content||'-'),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, m.reply||'-'),
                React.createElement('td',{className:'px-4 py-3 text-sm text-gray-700'}, m.createdAt ? new Date(m.createdAt).toLocaleString() : '-'),
                React.createElement('td',{className:'px-4 py-3 text-sm'},
                  React.createElement('div',{className:'flex items-center justify-end gap-2 whitespace-nowrap'},
                    React.createElement('button',{className:'px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:()=>{ setReplyItem(m); setReplyText(m.reply||''); }},'回复'),
                    React.createElement('button',{className:'px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700', onClick:()=>deleteMsg(m.id)},'删除')
                  )
                )
              ))
            )
          )
        ),
        replyItem && React.createElement('div',{className:'fixed inset-0 bg-black/30 flex items-center justify-center p-4'},
          React.createElement('div',{className:'bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 space-y-4'},
            React.createElement('h3',{className:'text-xl font-bold text-gray-800'}, '回复留言'),
            React.createElement('div',null, React.createElement('textarea',{className:'border border-gray-300 rounded-lg px-3 py-2 w-full', rows:6, value:replyText, onChange:(e)=>setReplyText(e.target.value)})),
            React.createElement('div',{className:'flex justify-end gap-2'},
              React.createElement('button',{className:'px-3 py-1 rounded-md bg-gray-200 text-gray-700', onClick:()=>{ setReplyItem(null); setReplyText(''); }}, '取消'),
              React.createElement('button',{className:'px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick:submitReply}, '保存')
            )
          )
        )
      )
    )
  );
};

window.Components = window.Components || {};
window.Components.SystemManagement = SystemManagement;
try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}

