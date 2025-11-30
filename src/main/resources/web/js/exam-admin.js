const ExamAdmin = () => {
  const { useState, useEffect } = React;
  const SUBJECTS = ['数学','语文','英语'];
  const TYPES = ['选择','判断','填空','简答'];
  const GRADES = [1,2,3,4,5,6];

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ subject:'', grade:'', type:'', tag:'', q:'' });
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ subject:'数学', grade:1, type:'选择', content:'', optionsJson:'', correctAnswer:'', explanation:'', knowledgeTags:'', num:0 });
  const [stats, setStats] = useState({ avgAccuracy:0, recordCount:0 });

  const fetchList = async (p=page, s=size) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.subject) params.set('subject', filters.subject);
      if (filters.grade) params.set('grade', parseInt(filters.grade,10));
      if (filters.type) params.set('type', filters.type);
      if (filters.tag) params.set('tag', filters.tag);
      if (filters.q) params.set('q', filters.q);
      params.set('page', p);
      params.set('size', s);
      const r = await fetch(`/api/exams/questions?${params.toString()}`, { credentials:'same-origin' });
      const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
      const content = Array.isArray(d.content) ? d.content : (Array.isArray(d) ? d : []);
      setList(content);
      setPage(typeof d.number==='number'?d.number:p);
      setSize(typeof d.size==='number'?d.size:s);
      setTotal(typeof d.totalElements==='number'?d.totalElements:content.length);
    } catch(_) { setList([]); }
    setLoading(false);
  };

  const fetchStats = async () => {};

  useEffect(()=>{ fetchList(0,size); }, []);
  useEffect(()=>{}, [filters.subject, filters.grade]);

  const openAdd = () => { setForm({ subject:'数学', grade:1, type:'选择', content:'', optionsJson:'', correctAnswer:'', explanation:'', knowledgeTags:'', num:0 }); setShowAdd(true); };
  const saveAdd = async () => {
    if (!form.content.trim()) return;
    try {
      const r = await fetch('/api/exams/questions', { method:'POST', headers:{ 'Content-Type':'application/json' }, credentials:'same-origin', body: JSON.stringify(form) });
      if (!r.ok) throw new Error('新增失败');
      setShowAdd(false); fetchList(0,size);
    } catch(_) {}
  };
  const openEdit = (q) => { setEditing(q); setForm({ subject:q.subject, grade:q.grade, type:q.type, content:q.content, optionsJson:q.optionsJson||'', correctAnswer:q.correctAnswer||'', explanation:q.explanation||'', knowledgeTags:q.knowledgeTags||'', num: (q.num||0) }); setShowEdit(true); };
  const copyAdd = (q) => { setForm({ subject:q.subject, grade:q.grade, type:q.type, content:q.content, optionsJson:q.optionsJson||'', correctAnswer:q.correctAnswer||'', explanation:q.explanation||'', knowledgeTags:q.knowledgeTags||'' }); setShowAdd(true); };
  const saveEdit = async () => {
    if (!editing) return;
    try {
      const r = await fetch(`/api/exams/questions/${editing.id}`, { method:'PUT', headers:{ 'Content-Type':'application/json' }, credentials:'same-origin', body: JSON.stringify(form) });
      if (!r.ok) throw new Error('更新失败');
      setShowEdit(false); setEditing(null); fetchList(page,size);
    } catch(_) {}
  };
  const handleDelete = async (id) => {
    if (!confirm('确认删除该题目？')) return;
    try {
      const r = await fetch(`/api/exams/questions/${id}`, { method:'DELETE', credentials:'same-origin' });
      if (!r.ok && r.status !== 204) throw new Error('删除失败');
      fetchList(page,size);
    } catch(_) {}
  };

  const Field = (label, el) => React.createElement('div', { className:'space-y-1' }, React.createElement('div', { className:'text-xs text-slate-500' }, label), el);
  const Sel = (value, onChange, opts) => React.createElement('select', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value, onChange }, opts.map(x=>React.createElement('option',{ key:x, value:x }, x)));

  return (
    React.createElement('div', { className:'p-6 space-y-6 bg-white rounded-2xl border' },
      React.createElement('div', { className:'flex items-center justify-between' },
        React.createElement('div', { className:'text-xl font-bold text-slate-900' }, '考试管理 · 题库'),
        React.createElement('div', { className:'flex items-center gap-2' },
          React.createElement('button', { className:'px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700', onClick: openAdd }, '新增题目')
        )
      ),
      React.createElement('div', { className:'grid md:grid-cols-6 gap-3' },
        Field('科目', Sel(filters.subject, (e)=>setFilters({...filters, subject:e.target.value}), [''].concat(SUBJECTS))),
        Field('年级', Sel(filters.grade, (e)=>setFilters({...filters, grade:e.target.value}), [''].concat(GRADES))),
        Field('题型', Sel(filters.type, (e)=>setFilters({...filters, type:e.target.value}), [''].concat(TYPES))),
        Field('知识点标签', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:filters.tag, onChange:(e)=>setFilters({...filters, tag:e.target.value}) })),
        Field('关键词', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:filters.q, onChange:(e)=>setFilters({...filters, q:e.target.value}) })),
        React.createElement('div', null,
          React.createElement('button', { className:'px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 w-full', onClick:()=>fetchList(0,size) }, '搜索')
        )
      ),
      React.createElement('div', null,
          loading ? React.createElement('div', { className:'grid md:grid-cols-3 gap-3' }, [1,2,3,4,5,6].map(i=>React.createElement('div', { key:i, className:'h-24 bg-slate-100 animate-pulse rounded-lg' })))
          : React.createElement('div', { className:'overflow-x-auto border rounded-lg' },
              React.createElement('table', { className:'min-w-full text-xs' },
                React.createElement('thead', { className:'bg-slate-50' },
                  React.createElement('tr', null, ['ID','科目','年级','题型','题干','知识点','操作'].map((h,i)=>React.createElement('th',{key:i,className:'px-3 py-2 text-left text-slate-600 font-medium'},h)))
                ),
                React.createElement('tbody', null,
                  list.length===0 ? React.createElement('tr', null, React.createElement('td', { className:'px-3 py-4 text-center text-slate-500', colSpan:7 }, '暂无数据'))
                  : list.map(q=>React.createElement('tr', { key:q.id },
                      React.createElement('td', { className:'px-3 py-2' }, q.id),
                      React.createElement('td', { className:'px-3 py-2' }, q.subject),
                      React.createElement('td', { className:'px-3 py-2' }, q.grade),
                      React.createElement('td', { className:'px-3 py-2' }, q.type),
                      React.createElement('td', { className:'px-3 py-2 truncate max-w-[22rem]' }, q.content),
                      React.createElement('td', { className:'px-3 py-2 truncate max-w-[16rem]' }, q.knowledgeTags||''),
                      React.createElement('td', { className:'px-3 py-2' },
                        React.createElement('div', { className:'flex items-center gap-2' },
                          React.createElement('button', { className:'px-2 py-1 rounded bg-blue-600 text-white', onClick:()=>openEdit(q) }, '编辑'),
                          React.createElement('button', { className:'px-2 py-1 rounded bg-slate-600 text-white', onClick:()=>copyAdd(q) }, '复制'),
                          React.createElement('button', { className:'px-2 py-1 rounded bg-red-600 text-white', onClick:()=>handleDelete(q.id) }, '删除')
                        )
                      )
                    )
                  )
                )
              )
      ),
      React.createElement('div', { className:'flex items-center justify-start mt-2' },
        React.createElement('div', { className:'text-xs text-slate-500 mr-3' }, `第 ${page+1} 页 · 共 ${total} 条`),
        React.createElement('div', { className:'flex items-center gap-2' },
          React.createElement('button', { className:'px-2 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50', disabled: page<=0, onClick:()=>{ const p=Math.max(0,page-1); fetchList(p,size); } }, '上一页'),
          React.createElement('button', { className:'px-2 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50', disabled: (page+1)*size>=total, onClick:()=>{ const p=page+1; fetchList(p,size); } }, '下一页')
        )
      ),
      showAdd && React.createElement('div', { className:'fixed inset-0 bg-black/40 grid place-items-center p-4' },
        React.createElement('div', { className:'bg-white rounded-2xl p-4 w-full max-w-3xl space-y-3' },
          React.createElement('div', { className:'text-lg font-bold text-slate-900' }, '新增题目'),
          React.createElement('div', { className:'grid md:grid-cols-3 gap-3' },
            Field('科目', Sel(form.subject, (e)=>setForm({...form, subject:e.target.value}), SUBJECTS)),
            Field('年级', Sel(form.grade, (e)=>setForm({...form, grade:parseInt(e.target.value,10)}), GRADES)),
            Field('题型', Sel(form.type, (e)=>setForm({...form, type:e.target.value}), TYPES))
          ),
          Field('排序号(num)', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', type:'number', value:form.num, onChange:(e)=>setForm({...form, num: parseInt(e.target.value||'0',10)}) })),
          Field('题干', React.createElement('textarea', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', rows:4, value:form.content, onChange:(e)=>setForm({...form, content:e.target.value}) })),
          Field('选项(JSON，选择题用)', React.createElement('textarea', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', rows:3, value:form.optionsJson, onChange:(e)=>setForm({...form, optionsJson:e.target.value}) })),
          Field('正确答案', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:form.correctAnswer, onChange:(e)=>setForm({...form, correctAnswer:e.target.value}) })),
          Field('解析', React.createElement('textarea', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', rows:3, value:form.explanation, onChange:(e)=>setForm({...form, explanation:e.target.value}) })),
          Field('知识点标签(逗号分隔)', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:form.knowledgeTags, onChange:(e)=>setForm({...form, knowledgeTags:e.target.value}) })),
          React.createElement('div', { className:'flex items-center justify-end gap-2' },
            React.createElement('button', { className:'px-3 py-2 rounded bg-slate-100 text-slate-700', onClick:()=>setShowAdd(false) }, '取消'),
            React.createElement('button', { className:'px-3 py-2 rounded bg-blue-600 text-white', onClick:saveAdd }, '保存')
          )
        )
      ),
      showEdit && React.createElement('div', { className:'fixed inset-0 bg-black/40 grid place-items-center p-4' },
        React.createElement('div', { className:'bg-white rounded-2xl p-4 w-full max-w-3xl space-y-3' },
          React.createElement('div', { className:'text-lg font-bold text-slate-900' }, '编辑题目'),
          React.createElement('div', { className:'grid md:grid-cols-3 gap-3' },
            Field('科目', Sel(form.subject, (e)=>setForm({...form, subject:e.target.value}), SUBJECTS)),
            Field('年级', Sel(form.grade, (e)=>setForm({...form, grade:parseInt(e.target.value,10)}), GRADES)),
            Field('题型', Sel(form.type, (e)=>setForm({...form, type:e.target.value}), TYPES))
          ),
          Field('排序号(num)', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', type:'number', value:form.num, onChange:(e)=>setForm({...form, num: parseInt(e.target.value||'0',10)}) })),
          Field('题干', React.createElement('textarea', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', rows:4, value:form.content, onChange:(e)=>setForm({...form, content:e.target.value}) })),
          Field('选项(JSON，选择题用)', React.createElement('textarea', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', rows:3, value:form.optionsJson, onChange:(e)=>setForm({...form, optionsJson:e.target.value}) })),
          Field('正确答案', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:form.correctAnswer, onChange:(e)=>setForm({...form, correctAnswer:e.target.value}) })),
          Field('解析', React.createElement('textarea', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', rows:3, value:form.explanation, onChange:(e)=>setForm({...form, explanation:e.target.value}) })),
          Field('知识点标签(逗号分隔)', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:form.knowledgeTags, onChange:(e)=>setForm({...form, knowledgeTags:e.target.value}) })),
          React.createElement('div', { className:'flex items-center justify-end gap-2' },
            React.createElement('button', { className:'px-3 py-2 rounded bg-slate-100 text-slate-700', onClick:()=>{ setShowEdit(false); setEditing(null); } }, '取消'),
            React.createElement('button', { className:'px-3 py-2 rounded bg-blue-600 text-white', onClick:saveEdit }, '保存')
          )
        )
      )
    )
  ));
};

window.Components = window.Components || {};
window.Components.ExamAdmin = ExamAdmin;
try { window.dispatchEvent(new Event('modules:loaded')); } catch(_){}
