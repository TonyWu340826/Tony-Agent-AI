const ExamSessionAdmin = () => {
  const { useState, useEffect } = React;
  const SUBJECTS = ['数学','语文','英语'];
  const GRADES = [1,2,3,4,5,6];
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ subject:'', grade:'', q:'', userId:'' });
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ userId:'', userName:'', paperName:'测试卷', subject:'数学', grade:1, questionIds:'', startTime:'', endTime:'', score:'', correctNum:0, wrongNum:0, aiSummary:'' });
  const [qBankLoading, setQBankLoading] = useState(false);
  const [qBank, setQBank] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [qPage, setQPage] = useState(0);
  const [qSize, setQSize] = useState(10);
  const [qTotal, setQTotal] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ id:null, code:'', userId:'', userName:'', paperName:'', subject:'数学', grade:1, status:0, startTime:'', endTime:'', aiSummary:'' });

  const fetchList = async (p=page, s=size) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.subject) params.set('subject', filters.subject);
      if (filters.grade) params.set('grade', parseInt(filters.grade,10));
      if (filters.userId) params.set('userId', filters.userId);
      if (filters.q) params.set('q', filters.q);
      params.set('page', p); params.set('size', s);
      const r = await fetch(`/api/exams/sessions?${params.toString()}`, { credentials:'same-origin' });
      const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
      const content = Array.isArray(d.content) ? d.content : (Array.isArray(d) ? d : []);
      setList(content);
      setPage(typeof d.number==='number'?d.number:p);
      setSize(typeof d.size==='number'?d.size:s);
      setTotal(typeof d.totalElements==='number'?d.totalElements:content.length);
    } catch(_) { setList([]); }
    setLoading(false);
  };

  useEffect(()=>{ fetchList(0,size); }, []);

  const saveAdd = async () => {
    const ids = selectedIds.join(',');
    if (!form.paperName.trim()) return;
    if (selectedIds.length === 0) return;
    if (selectedIds.length > 25) return;
    try {
      const fmt = v => { if (!v) return v; const t = String(v); return t.includes('T') ? t.replace('T',' ') + (t.length===16?':00':'') : t; };
      const r = await fetch('/api/exams/sessions', { method:'POST', headers:{ 'Content-Type':'application/json' }, credentials:'same-origin', body: JSON.stringify({ ...form, startTime: fmt(form.startTime), endTime: fmt(form.endTime), questionIds: ids }) });
      if (!r.ok) throw new Error('新增失败');
      setShowAdd(false); fetchList(0,size);
    } catch(_) {}
  };
  const handleDelete = async (id) => {
    if (!confirm('确认删除该记录？')) return;
    try {
      const r = await fetch(`/api/exams/sessions/${id}`, { method:'DELETE', credentials:'same-origin' });
      if (!r.ok && r.status !== 204) throw new Error('删除失败');
      fetchList(page,size);
    } catch(_) {}
  };
  const fetchQBank = async (p=qPage, s=qSize) => {
    setQBankLoading(true);
    try {
      const params = new URLSearchParams();
      if (form.subject) params.set('subject', form.subject);
      if (form.grade) params.set('grade', form.grade);
      params.set('page', p); params.set('size', s);
      const r = await fetch(`/api/exams/questions?${params.toString()}`, { credentials:'same-origin' });
      const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
      let content = Array.isArray(d.content) ? d.content : (Array.isArray(d) ? d : []);
      content = content.slice().sort((a,b)=> ((a.id||0) - (b.id||0)) );
      setQBank(content);
      setQPage(typeof d.number==='number'?d.number:p);
      setQSize(typeof d.size==='number'?d.size:s);
      setQTotal(typeof d.totalElements==='number'?d.totalElements:content.length);
    } catch(_) { setQBank([]); }
    setQBankLoading(false);
  };
  const toggleId = (id) => { setSelectedIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : (prev.length<25 ? [...prev, id] : prev)); };

  useEffect(()=>{ if (showAdd) { fetchQBank(0, qSize); } }, [showAdd]);
  useEffect(()=>{ if (showAdd) { fetchQBank(0, qSize); } }, [form.subject, form.grade]);

  const Field = (label, el) => React.createElement('div', { className:'space-y-1' }, React.createElement('div', { className:'text-xs text-slate-500' }, label), el);
  const Sel = (value, onChange, opts) => React.createElement('select', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value, onChange }, opts.map(x=>React.createElement('option',{ key:x, value:x }, x)));

  const openEdit = (s) => {
    setEditForm({
      id: s.id,
      code: s.code||'',
      userId: s.userId!=null? String(s.userId):'',
      userName: s.userName||'',
      paperName: s.paperName||'',
      subject: s.subject||'数学',
      grade: s.grade||1,
      status: typeof s.status==='number'?s.status:0,
      startTime: s.startTime||'',
      endTime: s.endTime||'',
      aiSummary: s.aiSummary||''
    });
    setShowEdit(true);
  };
  const saveEdit = async () => {
    if (!editForm.id) return;
    try {
      const fmt = v => { if (!v) return v; const t = String(v); return t.includes('T') ? t.replace('T',' ') + (t.length===16?':00':'') : t; };
      const r = await fetch(`/api/exams/sessions/${editForm.id}`, { method:'PUT', headers:{ 'Content-Type':'application/json' }, credentials:'same-origin', body: JSON.stringify({
        paperName: editForm.paperName,
        subject: editForm.subject,
        grade: editForm.grade,
        userId: editForm.userId? Number(editForm.userId): null,
        userName: editForm.userName,
        status: editForm.status,
        startTime: fmt(editForm.startTime),
        endTime: fmt(editForm.endTime),
        aiSummary: editForm.aiSummary
      }) });
      if (!r.ok) throw new Error('保存失败');
      setShowEdit(false);
      fetchList(page,size);
    } catch(_) {}
  };

  return (
    React.createElement('div', { className:'p-6 space-y-6 bg-white rounded-2xl border' },
      React.createElement('div', { className:'flex items-center justify之间' },
        React.createElement('div', { className:'text-xl font-bold text-slate-900' }, '考试管理 · 考试')
      ),
      React.createElement('div', { className:'grid md:grid-cols-6 gap-3' },
        Field('科目', Sel(filters.subject, (e)=>setFilters({...filters, subject:e.target.value}), [''].concat(SUBJECTS))),
        Field('年级', Sel(filters.grade, (e)=>setFilters({...filters, grade:e.target.value}), [''].concat(GRADES))),
        Field('用户ID', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:filters.userId, onChange:(e)=>setFilters({...filters, userId:e.target.value}) })),
        Field('关键词', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:filters.q, onChange:(e)=>setFilters({...filters, q:e.target.value}) })),
        React.createElement('div', null,
          React.createElement('button', { className:'px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 w-full', onClick:()=>fetchList(0,size) }, '搜索')
        ),
        React.createElement('div', null,
          React.createElement('button', { className:'px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 w-full', onClick:()=>setShowAdd(true) }, '新增考试')
        )
      ),
      loading ? React.createElement('div', { className:'grid md:grid-cols-3 gap-3' }, [1,2,3,4,5,6].map(i=>React.createElement('div', { key:i, className:'h-24 bg-slate-100 animate-pulse rounded-lg' })))
      : React.createElement('div', { className:'overflow-x-auto border rounded-lg' },
          React.createElement('table', { className:'min-w-full text-xs' },
            React.createElement('thead', { className:'bg-slate-50' }, React.createElement('tr', null, ['ID','用户ID','用户名','批次号','试卷','科目','年级','题目数','得分','状态','正确/错误','时间','操作'].map((h,i)=>React.createElement('th',{key:i,className:'px-3 py-2 text-left text-slate-600 font-medium'},h)))) ,
            React.createElement('tbody', null,
              list.length===0 ? React.createElement('tr', null, React.createElement('td', { className:'px-3 py-4 text-center text-slate-500', colSpan:11 }, '暂无数据'))
              : list.map(s=>React.createElement('tr', { key:s.id },
                  React.createElement('td', { className:'px-3 py-2' }, s.id),
                  React.createElement('td', { className:'px-3 py-2' }, (s.userId!=null?s.userId:'')),
                  React.createElement('td', { className:'px-3 py-2' }, s.userName||''),
                  React.createElement('td', { className:'px-3 py-2' }, s.code||''),
                  React.createElement('td', { className:'px-3 py-2 truncate max-w-[14rem]' }, s.paperName||''),
                  React.createElement('td', { className:'px-3 py-2' }, s.subject||''),
                  React.createElement('td', { className:'px-3 py-2' }, s.grade||''),
                  React.createElement('td', { className:'px-3 py-2' }, (String(s.questionIds||'').split(',').filter(x=>x.trim()).length)),
                  React.createElement('td', { className:'px-3 py-2' }, (s.score!=null?s.score:'-')),
                  React.createElement('td', { className:'px-3 py-2' }, (s.status===1?'考试结束':'待考试')),
                  React.createElement('td', { className:'px-3 py-2' }, `${s.correctNum||0} / ${s.wrongNum||0}`),
                  React.createElement('td', { className:'px-3 py-2' }, (s.startTime||'') ),
                  React.createElement('td', { className:'px-3 py-2' },
                    React.createElement('div', { className:'flex items-center gap-2' },
                      React.createElement('button', { className:'px-2 py-1 rounded bg-blue-600 text-white', onClick:()=>openEdit(s) }, '编辑'),
                      React.createElement('button', { className:'px-2 py-1 rounded bg-red-600 text-white', onClick:()=>handleDelete(s.id) }, '删除')
                    )
                  )
                ))
            )
          )
      ),
      React.createElement('div', { className:'flex items-center justify-between' },
        React.createElement('div', { className:'text-xs text-slate-500' }, `第 ${page+1} 页 · 共 ${total} 条`),
        React.createElement('div', { className:'flex items-center gap-2' },
          React.createElement('button', { className:'px-2 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50', disabled: page<=0, onClick:()=>{ const p=Math.max(0,page-1); fetchList(p,size); } }, '上一页'),
          React.createElement('button', { className:'px-2 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50', disabled: (page+1)*size>=total, onClick:()=>{ const p=page+1; fetchList(p,size); } }, '下一页')
        )
      ),
      showAdd && React.createElement('div', { className:'fixed inset-0 bg-black/40 grid place-items-center p-4' },
        React.createElement('div', { className:'bg-white rounded-2xl p-4 w-full max-w-3xl space-y-3' },
          React.createElement('div', { className:'text-lg font-bold text-slate-900' }, '新增考试'),
          React.createElement('div', { className:'grid md:grid-cols-3 gap-3' },
            Field('考试名称', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:form.paperName, onChange:(e)=>setForm({...form, paperName:e.target.value}) })),
            Field('科目', Sel(form.subject, (e)=>setForm({...form, subject:e.target.value}), SUBJECTS)),
            Field('年级', Sel(form.grade, (e)=>setForm({...form, grade:parseInt(e.target.value,10)}), GRADES))
          ),
          React.createElement('div', { className:'grid md:grid-cols-3 gap-3' },
            Field('用户ID', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:form.userId, onChange:(e)=>setForm({...form, userId:e.target.value}) })),
            Field('用户名', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:form.userName, onChange:(e)=>setForm({...form, userName:e.target.value}) }))
          ),
          React.createElement('div', { className:'space-y-2' },
            React.createElement('div', { className:'flex items-center justify-between' },
              React.createElement('div', { className:'text-sm text-slate-700 font-semibold' }, '选择题目（最多25题）'),
              React.createElement('div', { className:'text-xs text-slate-500' }, `已选 ${selectedIds.length} / 25`)
            ),
            qBankLoading ? React.createElement('div', { className:'text-xs text-slate-500' }, '题库加载中...')
            : React.createElement('div', { className:'border rounded-lg' },
                React.createElement('table', { className:'min-w-full text-xs' },
                  React.createElement('thead', { className:'bg-slate-50' },
                    React.createElement('tr', null, ['选','ID','subject','grade','q_type','content','num'].map((h,i)=>React.createElement('th',{key:i,className:'px-2 py-2 text-left text-slate-600 font-medium'},h)))
                  ),
                  React.createElement('tbody', null,
                    qBank.map(q=>React.createElement('tr',{key:q.id},
                      React.createElement('td',{className:'px-2 py-2'}, React.createElement('input',{type:'checkbox', checked:selectedIds.includes(q.id), onChange:()=>toggleId(q.id)})),
                      React.createElement('td',{className:'px-2 py-2'}, q.id),
                      React.createElement('td',{className:'px-2 py-2'}, q.subject),
                      React.createElement('td',{className:'px-2 py-2'}, q.grade),
                      React.createElement('td',{className:'px-2 py-2'}, q.type),
                      React.createElement('td',{className:'px-2 py-2 truncate max-w-[18rem]'}, q.content),
                      React.createElement('td',{className:'px-2 py-2'}, (q.num!=null?q.num:0))
                    ))
                  )
                )
              ),
            React.createElement('div', { className:'flex items-center justify-start mt-2' },
              React.createElement('div', { className:'text-xs text-slate-500 mr-3' }, `第 ${qPage+1} 页 · 共 ${qTotal} 条`),
              React.createElement('div', { className:'flex items-center gap-2' },
                React.createElement('button', { className:'px-2 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50', disabled: qPage<=0, onClick:()=>{ const p=Math.max(0,qPage-1); fetchQBank(p,qSize); } }, '上一页'),
                React.createElement('button', { className:'px-2 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50', disabled: (qPage+1)*qSize>=qTotal, onClick:()=>{ const p=qPage+1; fetchQBank(p,qSize); } }, '下一页')
              )
            )
          ),
          Field('开始时间', React.createElement('input', { type:'datetime-local', className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:form.startTime, onChange:(e)=>setForm({...form, startTime:e.target.value}) })),
          Field('结束时间', React.createElement('input', { type:'datetime-local', className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:form.endTime, onChange:(e)=>setForm({...form, endTime:e.target.value}) })),
          Field('AI总结与建议', React.createElement('textarea', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', rows:3, value:form.aiSummary, onChange:(e)=>setForm({...form, aiSummary:e.target.value}) })),
          React.createElement('div', { className:'flex items-center justify-end gap-2' },
            React.createElement('button', { className:'px-3 py-2 rounded bg-slate-100 text-slate-700', onClick:()=>setShowAdd(false) }, '取消'),
            React.createElement('button', { className:'px-3 py-2 rounded bg-blue-600 text-white', onClick:saveAdd }, '保存')
          )
        )
      )
      ,
      showEdit && React.createElement('div', { className:'fixed inset-0 bg-black/40 grid place-items-center p-4' },
        React.createElement('div', { className:'bg-white rounded-2xl p-4 w-full max-w-3xl space-y-3' },
          React.createElement('div', { className:'text-lg font-bold text-slate-900' }, '编辑考试'),
          React.createElement('div', { className:'grid md:grid-cols-3 gap-3' },
            Field('批次号', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:editForm.code, readOnly:true })),
            Field('用户ID', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:editForm.userId, onChange:(e)=>setEditForm({...editForm, userId:e.target.value}) })),
            Field('用户名', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:editForm.userName, onChange:(e)=>setEditForm({...editForm, userName:e.target.value}) })),
            Field('考试名称', React.createElement('input', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:editForm.paperName, onChange:(e)=>setEditForm({...editForm, paperName:e.target.value}) })),
            Field('科目', Sel(editForm.subject, (e)=>setEditForm({...editForm, subject:e.target.value}), SUBJECTS)),
            Field('年级', Sel(editForm.grade, (e)=>setEditForm({...editForm, grade:parseInt(e.target.value,10)}), GRADES))
          ),
          React.createElement('div', { className:'grid md:grid-cols-3 gap-3' },
            Field('状态', Sel(editForm.status, (e)=>setEditForm({...editForm, status:parseInt(e.target.value,10)}), [0,1]))
          ),
          Field('开始时间', React.createElement('input', { type:'datetime-local', className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:editForm.startTime, onChange:(e)=>setEditForm({...editForm, startTime:e.target.value}) })),
          Field('结束时间', React.createElement('input', { type:'datetime-local', className:'border border-slate-300 rounded-lg px-3 py-2 w-full', value:editForm.endTime, onChange:(e)=>setEditForm({...editForm, endTime:e.target.value}) })),
          Field('AI总结与建议', React.createElement('textarea', { className:'border border-slate-300 rounded-lg px-3 py-2 w-full', rows:3, value:editForm.aiSummary, onChange:(e)=>setEditForm({...editForm, aiSummary:e.target.value}) })),
          React.createElement('div', { className:'flex items-center justify-end gap-2' },
            React.createElement('button', { className:'px-3 py-2 rounded bg-slate-100 text-slate-700', onClick:()=>setShowEdit(false) }, '取消'),
            React.createElement('button', { className:'px-3 py-2 rounded bg-blue-600 text-white', onClick:saveEdit }, '保存')
          )
        )
      )
    )
  );
};

  window.Components = window.Components || {};
  window.Components.ExamSessionAdmin = ExamSessionAdmin;
  try { window.dispatchEvent(new Event('modules:loaded')); } catch(_){}
