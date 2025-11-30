;(function(){
  const Tool16 = ({ currentUser }) => {
    const { useState, useEffect } = React;
    const SUBJECTS = ['数学','语文','英语'];
    const GRADES = [1,2,3,4,5,6];
    const [grade, setGrade] = useState(1);
    const [subject, setSubject] = useState('数学');
    const [step, setStep] = useState('home');
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [examUserName, setExamUserName] = useState('');
    const [practiceIdx, setPracticeIdx] = useState(0);
    const [practiceAnswers, setPracticeAnswers] = useState({});
    const [practicePendingAnswers, setPracticePendingAnswers] = useState({});
    const [practiceConfirmed, setPracticeConfirmed] = useState({});
    const [showAnswer, setShowAnswer] = useState(false);
    const [exam, setExam] = useState(null);
    const [examQuestions, setExamQuestions] = useState([]);
    const [examIdx, setExamIdx] = useState(0);
    const [examAnswers, setExamAnswers] = useState({});
    const [examPendingAnswers, setExamPendingAnswers] = useState({});
    const [examConfirmed, setExamConfirmed] = useState({});
    const [examDurationMin, setExamDurationMin] = useState(60);
    const [remainSec, setRemainSec] = useState(60*60);
    const [timerOn, setTimerOn] = useState(false);
    const [doneStats, setDoneStats] = useState({ score:0, correct:0, wrong:0 });
    const [aiSummary, setAiSummary] = useState('');
    const [namePromptOpen, setNamePromptOpen] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [codePromptOpen, setCodePromptOpen] = useState(false);
    const [codeInput, setCodeInput] = useState('');
    const [inlineNameOpen, setInlineNameOpen] = useState(false);
    const [inlineNameValue, setInlineNameValue] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const Field = (label, el) => React.createElement('div', { className:'space-y-1' }, React.createElement('div', { className:'text-xs text-slate-500' }, label), el);
    const Sel = (value, onChange, opts) => React.createElement('select', { className:'border border-slate-300 rounded-lg px-3 py-2', value, onChange }, opts.map(x=>React.createElement('option',{ key:x, value:x }, x)));

    const fetchPractice = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(); params.set('subject', subject); params.set('grade', grade); params.set('page', 0); params.set('size', 50);
        const r = await fetch(`/api/exams/questions?${params.toString()}`, { credentials:'same-origin' });
        const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
        const arr = Array.isArray(d.content) ? d.content : (Array.isArray(d) ? d : []);
        const shuffled = arr.slice().sort(()=>Math.random()-0.5).slice(0, Math.min(10, arr.length));
        setQuestions(shuffled); setPracticeIdx(0); setPracticeAnswers({}); setShowAnswer(false);
      } catch(_){ setQuestions([]); }
      setLoading(false); setStep('practice');
    };

    const fetchSessions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(); params.set('subject', subject); params.set('grade', grade); params.set('status', 0); params.set('page', 0); params.set('size', 10);
        const r = await fetch(`/api/exams/sessions?${params.toString()}`, { credentials:'same-origin' });
        const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
        const arr = Array.isArray(d.content) ? d.content : (Array.isArray(d) ? d : []);
        setSessions(arr);
      } catch(_){ setSessions([]); }
      setLoading(false); setStep('examList');
    };

    const fetchSessionsByUser = async (userName) => {
      setLoading(true);
      try {
        const params = new URLSearchParams(); params.set('userName', String(userName||'').trim()); params.set('status', 0); params.set('page', 0); params.set('size', 10);
        const r = await fetch(`/api/exams/sessions?${params.toString()}`, { credentials:'same-origin' });
        const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
        const arr = Array.isArray(d.content) ? d.content : (Array.isArray(d) ? d : []);
        setSessions(arr);
      } catch(_){ setSessions([]); }
      setLoading(false); setStep('examList');
    };

    const fetchSessionsByCode = async (code) => {
      setLoading(true);
      try {
        const params = new URLSearchParams(); params.set('code', String(code||'').trim()); params.set('status', 0); params.set('page', 0); params.set('size', 10);
        const r = await fetch(`/api/exams/sessions?${params.toString()}`, { credentials:'same-origin' });
        const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
        const arr = Array.isArray(d.content) ? d.content : (Array.isArray(d) ? d : []);
        setSessions(arr);
      } catch(_){ setSessions([]); }
      setLoading(false); setStep('examList');
    };

    const openNamePrompt = () => {
      const preset = (currentUser && (currentUser.username||currentUser.name)) || examUserName || '';
      const v = String(preset||'');
      setNameInput(v);
      setInlineNameValue(v);
      setNamePromptOpen(true);
      setInlineNameOpen(true);
    };

    const confirmNamePrompt = () => {
      const nm = String(nameInput||'').trim();
      if (!nm) return;
      setExamUserName(nm);
      setNamePromptOpen(false);
      fetchSessionsByUser(nm);
    };

    const cancelNamePrompt = () => { setNamePromptOpen(false); };
    const openCodePrompt = () => { setCodeInput(''); setCodePromptOpen(true); };
    const confirmCodePrompt = () => { const c = String(codeInput||'').trim(); if(!c) return; setCodePromptOpen(false); fetchSessionsByCode(c); };
    const cancelCodePrompt = () => { setCodePromptOpen(false); };

    const startExam = async (s) => {
      setExam(s); setLoading(true);
      try {
        const ids = String(s.questionIds||'').split(',').map(x=>parseInt(x,10)).filter(Boolean);
        const r = await fetch(`/api/exams/questions/by-ids?ids=${encodeURIComponent(ids.join(','))}`, { credentials:'same-origin' });
        const t = await r.text(); let d=[]; try{ d=JSON.parse(t||'[]'); }catch(_){ d=[]; }
        const picked = Array.isArray(d) ? d : [];
        setExamQuestions(picked); setExamIdx(0); setExamAnswers({}); setExamPendingAnswers({}); setExamConfirmed({});
        setRemainSec(examDurationMin*60); setTimerOn(true); setStep('examRun');
      } catch(_){ setExamQuestions([]); }
      setLoading(false);
    };

    useEffect(()=>{
      if (!timerOn) return;
      const h = setInterval(()=>{ setRemainSec(s=>Math.max(0,s-1)); }, 1000);
      return ()=>clearInterval(h);
    }, [timerOn]);

    useEffect(()=>{ if (timerOn && remainSec===0) { finishExam(); } }, [timerOn, remainSec]);

    const computeStats = (arr, answers) => {
      let correct = 0; let wrong = 0;
      arr.forEach(q=>{ const a = String(answers[q.id]||''); const ok = a && (String(q.correctAnswer||'')===a); if (ok) correct++; else wrong++; });
      const score = Math.round((correct/Math.max(1,arr.length))*100);
      return { score, correct, wrong };
    };

    const finishExam = async () => {
      if (submitting) return;
      setSubmitting(true);
      setTimerOn(false);
      const stats = computeStats(examQuestions, examAnswers);
      setDoneStats(stats);
      const details = examQuestions.map(q=>({ id:q.id, content: q.content||'', userAnswer: examAnswers[q.id]||'', correct: String(examAnswers[q.id]||'')===String(q.correctAnswer||''), correctAnswer: q.correctAnswer||'', subject:q.subject, grade:q.grade, type:q.type, knowledgeTags:q.knowledgeTags||'' }));
      const wrongTags = Array.from(new Set(details.filter(d=>!d.correct).flatMap(d=>String(d.knowledgeTags||'').split(',').map(x=>x.trim()).filter(Boolean))));
      let summary = wrongTags.length ? `本次考试需巩固：${wrongTags.join('、')}。请重点复习相关知识点，并多做练习题。` : '表现很好！继续保持。';
      try {
        const body = { userName: (currentUser && (currentUser.username||currentUser.name)) || '', subject: (exam && exam.subject) || subject, grade: (exam && exam.grade) || grade, score: String(stats.score), correctNum: stats.correct, wrongNum: stats.wrong, details };
        const r = await fetch('/api/open/exam/insights', { method:'POST', headers:{ 'Content-Type':'application/json' }, credentials:'same-origin', body: JSON.stringify(body) });
        const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
        if (d && typeof d.report==='string' && d.report.trim()) { summary = d.report.trim(); }
      } catch(_) {}
      setAiSummary(summary);
      try {
        if (exam && exam.id) {
          const body = { userId: (currentUser && (currentUser.id||currentUser.userId)) || null, userName: (currentUser && (currentUser.username||currentUser.name)) || '', score: String(stats.score), correctNum: stats.correct, wrongNum: stats.wrong, answerDetailsJson: JSON.stringify(details), aiSummary: summary, status: 1 };
          await fetch(`/api/exams/sessions/${exam.id}`, { method:'PUT', headers:{ 'Content-Type':'application/json' }, credentials:'same-origin', body: JSON.stringify(body) });
        }
      } catch(_){}
      setStep('examDone');
      setSubmitting(false);
    };

    const PracticeCard = () => {
      const q = questions[practiceIdx]; if (!q) return React.createElement('div',{className:'text-sm text-slate-500'}, '暂无题目');
      const opts = (()=>{ try{ const j = JSON.parse(q.optionsJson||'[]'); if(Array.isArray(j)) return j; }catch(_){} return []; })();
      const pending = practicePendingAnswers[q.id] || '';
      const confirmed = !!practiceConfirmed[q.id];
      const chosen = practiceAnswers[q.id] || '';
      const setPending = (v) => setPracticePendingAnswers(prev=>({ ...prev, [q.id]: v }));
      const confirm = () => { const v = String(pending||'').trim(); if(!v) return; setPracticeAnswers(prev=>({ ...prev, [q.id]: v })); setPracticeConfirmed(prev=>({ ...prev, [q.id]: true })); setShowAnswer(true); };
      const isChoice = opts.length>0 && String(q.type||'').includes('选');
      const isJudge = !opts.length && String(q.type||'').includes('判');
      const isFill = !isChoice && !isJudge;
      const match = (a,b) => String(a||'').trim() === String(b||'').trim();
      const ok = confirmed && match(chosen, q.correctAnswer);
      return React.createElement('div',{className:'p-6 bg-white rounded-2xl shadow border space-y-4'},
          React.createElement('div',{className:'text-sm text-rose-600 font-semibold'}, q.type||'题目'),
          React.createElement('div',{className:'text-lg font-bold text-slate-900'}, q.content||''),
          (isChoice ? React.createElement('div',{className:'space-y-2'}, opts.map((opt,i)=>{
            const optLabel = (typeof opt==='string') ? opt : (opt.label || opt.value || String.fromCharCode(65+i));
            const optValue = (typeof opt==='string') ? opt : (opt.value ?? opt.label ?? String.fromCharCode(65+i));
            return React.createElement('button',{
              key:i,
              className:(pending===optValue? 'bg-blue-50 border-blue-300' : 'bg-slate-50 border-slate-200')+' w-full text-left px-4 py-3 rounded-lg border',
              onClick:()=>{ if(!confirmed) setPending(String(optValue)); }
            }, `${String.fromCharCode(65+i)}  ${optLabel}`);
          })) : null),
          (isJudge ? React.createElement('div',{className:'grid grid-cols-2 gap-3'}, ['正确','错误'].map((label,i)=>React.createElement('button',{key:i,className:(pending===label? 'bg-blue-50 border-blue-300' : 'bg-slate-50 border-slate-200')+' w-full text-center px-4 py-3 rounded-lg border', onClick:()=>{ if(!confirmed) setPending(label); }}, (i===0?'✓ ':'X ')+label))) : null),
          (isFill ? React.createElement('div',{className:'space-y-2'}, React.createElement('textarea',{className:'w-full border border-slate-300 rounded-lg px-3 py-2', rows:3, placeholder:'请输入你的答案…', value:pending, onChange:(e)=>{ if(!confirmed) setPending(e.target.value); }})) : null),
          React.createElement('div',{className:'flex items-center justify-between'},
              React.createElement('div',{className:'text-xs text-slate-500'}, `第 ${practiceIdx+1} / ${questions.length} 题`),
              React.createElement('div',{className:'flex items-center gap-2'},
                  React.createElement('button',{className:'px-3 py-2 rounded bg-indigo-600 text-white disabled:opacity-50', disabled: confirmed || !String(pending||'').trim(), onClick:confirm}, '确认'),
                  React.createElement('button',{className:'px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50', disabled: practiceIdx>=questions.length-1 || !confirmed, onClick:()=>setPracticeIdx(i=>Math.min(i+1, questions.length-1))}, '下一题')
              )
          ),
          (confirmed ? React.createElement('div',{className:(ok?'text-emerald-600':'text-rose-600')+' text-sm font-semibold'}, ok?'回答正确':'回答错误') : null),
          (confirmed ? React.createElement('div',{className:'text-xs text-slate-500'}, `你的答案：${chosen||'-'} · 正确答案：${q.correctAnswer||'-'}`) : null),
          (showAnswer ? React.createElement('div',{className:'text-sm text-slate-700'}, `正确答案：${q.correctAnswer||'-'}`) : null),
          (showAnswer ? React.createElement('div',{className:'text-sm text-slate-500'}, q.explanation||'') : null)
      );
    };

    const ExamRunCard = () => {
      const q = examQuestions[examIdx]; if (!q) return React.createElement('div',{className:'text-sm text-slate-500'}, '暂无题目');
      const opts = (()=>{ try{ const j = JSON.parse(q.optionsJson||'[]'); if(Array.isArray(j)) return j; }catch(_){} return []; })();
      const pending = examPendingAnswers[q.id] || '';
      const confirmed = !!examConfirmed[q.id];
      const chosen = examAnswers[q.id] || '';
      const answeredCount = Object.keys(examAnswers).filter(id=>examAnswers[id]).length;
      const setPending = (v) => setExamPendingAnswers(prev=>({ ...prev, [q.id]: v }));
      const confirmAnswer = () => { const v = String(pending||'').trim(); if(!v) return; setExamAnswers(prev=>({ ...prev, [q.id]: v })); setExamConfirmed(prev=>({ ...prev, [q.id]: true })); };
      const isChoice = opts.length>0 && String(q.type||'').includes('选');
      const isJudge = !opts.length && String(q.type||'').includes('判');
      const isFill = !isChoice && !isJudge;
      const match = (a,b) => String(a||'').trim() === String(b||'').trim();
      const isCorrect = confirmed && match(chosen, q.correctAnswer);
      return React.createElement('div',{className:'grid md:grid-cols-4 gap-6'},
          React.createElement('div',{className:'md:col-span-3'},
              React.createElement('div',{className:'p-6 bg-white rounded-2xl shadow border space-y-4'},
                  React.createElement('div',{className:'flex items-center justify-between'},
                      React.createElement('div',{className:'text-sm text-indigo-600 font-semibold'}, q.type||'题目'),
                      React.createElement('div',{className:'text-xs text-rose-600 font-semibold'}, `${String(Math.floor(remainSec/60)).padStart(2,'0')}:${String(remainSec%60).padStart(2,'0')}`)
                  ),
                  React.createElement('div',{className:'text-lg font-bold text-slate-900'}, q.content||''),
                  (isChoice ? React.createElement('div',{className:'space-y-2'}, opts.map((opt,i)=>{
                    const optLabel = (typeof opt==='string') ? opt : (opt.label || opt.value || String.fromCharCode(65+i));
                    const optValue = (typeof opt==='string') ? opt : (opt.value ?? opt.label ?? String.fromCharCode(65+i));
                    return React.createElement('button',{
                      key:i,
                      className:(pending===optValue? 'bg-blue-50 border-blue-300' : 'bg-slate-50 border-slate-200')+' w-full text-left px-4 py-3 rounded-lg border',
                      onClick:()=>{ if(!confirmed) setPending(String(optValue)); }
                    }, `${String.fromCharCode(65+i)}  ${optLabel}`);
                  })) : null),
                  (isJudge ? React.createElement('div',{className:'grid grid-cols-2 gap-3'}, ['正确','错误'].map((label,i)=>React.createElement('button',{key:i,className:(pending===label? 'bg-blue-50 border-blue-300' : 'bg-slate-50 border-slate-200')+' w-full text-center px-4 py-3 rounded-lg border', onClick:()=>{ if(!confirmed) setPending(label); }}, (i===0?'✓ ':'X ')+label))) : null),
                  (isFill ? React.createElement('div',{className:'space-y-2'}, React.createElement('textarea',{className:'w-full border border-slate-300 rounded-lg px-3 py-2', rows:3, placeholder:'请输入你的答案…', value:pending, onChange:(e)=>{ if(!confirmed) setPending(e.target.value); }})) : null),
                  React.createElement('div',{className:'flex items-center justify-between'},
                      React.createElement('div',{className:'text-xs text-slate-500'}, `第 ${examIdx+1} / ${examQuestions.length} 题 · 已答 ${answeredCount}`),
                      React.createElement('div',{className:'flex items-center gap-2'},
                          React.createElement('button',{className:'px-3 py-2 rounded bg-slate-100 text-slate-700 disabled:opacity-50', disabled: examIdx<=0, onClick:()=>setExamIdx(i=>Math.max(0,i-1))}, '上一题'),
                          React.createElement('button',{className:'px-3 py-2 rounded bg-indigo-600 text-white disabled:opacity-50', disabled: confirmed || !String(pending||'').trim(), onClick:confirmAnswer}, '确认'),
                          React.createElement('button',{className:'px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50', disabled: examIdx>=examQuestions.length-1 || !confirmed, onClick:()=>setExamIdx(i=>Math.min(i+1, examQuestions.length-1))}, '下一题'),
                          React.createElement('button',{className:'px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50', disabled: submitting, onClick:finishExam}, submitting ? '正在批改和分析中…' : '交卷')
                      )
                  ),
                  (confirmed ? React.createElement('div',{className:(isCorrect?'text-emerald-600':'text-rose-600')+' text-sm font-semibold'}, isCorrect?'回答正确':'回答错误') : null),
                  (confirmed ? React.createElement('div',{className:'text-xs text-slate-500'}, `你的答案：${chosen||'-'} · 正确答案：${q.correctAnswer||'-'}`) : null),
                  React.createElement('div',{className:'space-y-2'},
                      React.createElement('div',{className:'h-1 bg-slate-200 rounded-full overflow-hidden'}, React.createElement('div',{className:'h-1 bg-blue-600', style:{ width: `${Math.round(((examIdx+1)/Math.max(1,examQuestions.length))*100)}%` }}))
                  )
              )
          ),
          React.createElement('div',null,
              React.createElement('div',{className:'p-4 bg-white rounded-2xl border shadow space-y-3'},
                  React.createElement('div',{className:'text-sm font-semibold text-slate-700'}, '答题卡'),
                  React.createElement('div',{className:'grid grid-cols-5 gap-2'}, examQuestions.map((qq,idx)=>React.createElement('button',{key:qq.id,className:(idx===examIdx?'bg-blue-600 text-white':'bg-slate-100 text-slate-700')+' rounded px-3 py-1', onClick:()=>setExamIdx(idx)}, String(idx+1))),
                      React.createElement('div',{className:'text-xs text-slate-500'}, `总题数 ${examQuestions.length} · 已答 ${answeredCount} · 未答 ${Math.max(0, examQuestions.length-answeredCount)}`)
                  )
              )
          ));
    };

    const Home = () => React.createElement('div',{className:'space-y-6'},
        React.createElement('div',{className:'p-4 bg-white rounded-2xl border shadow'},
            React.createElement('div',{className:'text-lg font-bold text-slate-900 mb-3'}, '你好，小朋友！'),
            React.createElement('div',{className:'text-sm text-slate-600'}, '选择你的年级和科目，开始学习吧')
        ),
        React.createElement('div',{className:'space-y-3'},
            React.createElement('div',{className:'text-sm text-slate-700 font-semibold'}, '选择你的年级'),
            React.createElement('div',{className:'grid grid-cols-3 md:grid-cols-6 gap-3'}, GRADES.map(g=>React.createElement('button',{key:g,className:(g===grade?'bg-gradient-to-r from-pink-500 to-purple-500 text-white':'bg-white')+' rounded-xl border px-4 py-3', onClick:()=>setGrade(g)}, `${g}年级`)))
        ),
        React.createElement('div',{className:'space-y-3'},
            React.createElement('div',{className:'text-sm text-slate-700 font-semibold'}, '选择你要学习的科目'),
            React.createElement('div',{className:'grid grid-cols-3 gap-3'}, SUBJECTS.map(s=>React.createElement('button',{key:s,className:(s===subject?'bg-blue-600 text-white':'bg-white')+' rounded-xl border px-4 py-6', onClick:()=>setSubject(s)}, s)))
        ),
        React.createElement('div',{className:'text-center'}, React.createElement('button',{className:'px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700', onClick:()=>setStep('mode')}, '开始学习'))
    );

    const ModeSelect = () => React.createElement('div',{className:'space-y-6'},
        React.createElement('div',{className:'text-lg font-bold text-slate-900 text-center'}, '选择学习模式'),
        React.createElement('div',{className:'grid grid-cols-1 md:grid-cols-2 gap-6'},
            React.createElement('div',{className:'bg-white rounded-2xl border shadow p-6 space-y-2'},
                React.createElement('div',{className:'text-lg font-bold text-slate-900'}, '随机练习'),
                React.createElement('div',{className:'text-xs text-slate-500'}, '不限时 · 即时反馈 · 查看解析'),
                React.createElement('button',{className:'px-4 py-2 rounded bg-pink-500 text-white hover:bg-pink-600', onClick:fetchPractice}, '开始练习')
            ),
            React.createElement('div',{className:'bg-white rounded-2xl border shadow p-6 space-y-2'},
                React.createElement('div',{className:'text-lg font-bold text-slate-900'}, '正式考试'),
                React.createElement('div',{className:'text-xs text-slate-500'}, '限时考试 · AI批改 · 成绩记录'),
                React.createElement('div',{className:'flex items-center gap-2'},
                    React.createElement('button',{className:'px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700', onClick:openCodePrompt}, '按编号选择'),
                    React.createElement('button',{className:'px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700', onClick:openNamePrompt}, '按用户名选择')
                )
                , (inlineNameOpen ? React.createElement('div',{className:'mt-3 flex items-center gap-2'},
                    React.createElement('input',{className:'flex-1 border border-slate-300 rounded-lg px-3 py-2', value:inlineNameValue, onChange:(e)=>setInlineNameValue(e.target.value), placeholder:'请输入用户名'}),
                    React.createElement('button',{className:'px-3 py-2 rounded bg-slate-100 text-slate-700', onClick:()=>{ setInlineNameOpen(false); }}, '取消'),
                    React.createElement('button',{className:'px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50', disabled:!String(inlineNameValue||'').trim(), onClick:()=>{ const v=String(inlineNameValue||'').trim(); setExamUserName(v); setInlineNameOpen(false); setNamePromptOpen(false); fetchSessionsByUser(v); }}, '确定')
                ) : null)
            )
        )
    );

    const ExamList = () => React.createElement('div',{className:'space-y-6'},
        React.createElement('div',{className:'flex items-center justify-between'},
            React.createElement('div',{className:'text-lg font-bold text-slate-900'}, '考试大厅'),
            React.createElement('div',{className:'flex items-center gap-2'},
                React.createElement('div',{className:'text-xs px-2 py-1 rounded bg-slate-100 text-slate-700'}, `${subject} · ${grade}年级`),
                (examUserName ? React.createElement('div',{className:'text-xs px-2 py-1 rounded bg-slate-100 text-slate-700'}, `用户：${examUserName}`) : null)
            )
        ),
        React.createElement('div',{className:'grid grid-cols-1 md:grid-cols-2 gap-4'},
            sessions.map(s=>React.createElement('div',{key:s.id,className:'bg-white rounded-2xl border shadow p-5 flex items-center gap-4'},
                React.createElement('div',{className:'w-12 h-12 bg-blue-600 rounded-lg'}),
                React.createElement('div',{className:'flex-1'},
                    React.createElement('div',{className:'font-semibold text-slate-900'}, s.paperName||'-'),
                    React.createElement('div',{className:'text-xs text-slate-500'}, `考试编号：${s.code||'-'}`),
                    React.createElement('div',{className:'text-xs text-slate-500'}, `题目数：${String(s.questionIds||'').split(',').filter(x=>x.trim()).length}`),
                    React.createElement('div',{className:'text-xs text-slate-500'}, `时长：${examDurationMin} 分钟`)
                ),
                React.createElement('button',{className:'px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700', onClick:()=>startExam(s)}, '开始考试')
            ))
        )
    );

    const ExamDone = () => React.createElement('div',{className:'space-y-6'},
        React.createElement('div',{className:'p-5 bg-white rounded-2xl border shadow'},
            React.createElement('div',{className:'text-lg font-bold text-slate-900'}, '考试完成！'),
            React.createElement('div',{className:'grid grid-cols-3 gap-4 mt-3'},
                React.createElement('div',{className:'text-center'}, React.createElement('div',{className:'text-3xl font-bold text-slate-900'}, doneStats.score), React.createElement('div',{className:'text-xs text-slate-500'}, '分数')),
                React.createElement('div',{className:'text-center'}, React.createElement('div',{className:'text-3xl font-bold text-emerald-600'}, doneStats.correct), React.createElement('div',{className:'text-xs text-slate-500'}, '正确')),
                React.createElement('div',{className:'text-center'}, React.createElement('div',{className:'text-3xl font-bold text-rose-600'}, doneStats.wrong), React.createElement('div',{className:'text-xs text-slate-500'}, '错误'))
            )
        ),
        React.createElement('div',{className:'p-5 bg-white rounded-2xl border shadow'},
            React.createElement('div',{className:'text-sm font-semibold text-slate-700 mb-2'}, 'AI老师的评价'),
            React.createElement('div',{className:'text-sm text-slate-600'}, aiSummary||'')
        ),
        React.createElement('div',{className:'p-5 bg-white rounded-2xl border shadow space-y-3'},
            React.createElement('div',{className:'text-sm font-semibold text-slate-700'}, '错题详情'),
            examQuestions.filter(q=>String(examAnswers[q.id]||'')!==String(q.correctAnswer||'')).map(q=>React.createElement('div',{key:q.id,className:'border rounded-xl p-3 bg-rose-50 border-rose-200'},
                React.createElement('div',{className:'text-xs text-rose-600 font-semibold'}, `${q.type||'题目'} · ${q.subject||''} · ${q.grade||''}年级`),
                React.createElement('div',{className:'text-sm text-slate-900 mt-1'}, q.content||''),
                React.createElement('div',{className:'text-xs text-slate-600 mt-1'}, `你的答案：${examAnswers[q.id]||'-'} · 正确答案：${q.correctAnswer||'-'}`),
                React.createElement('div',{className:'text-xs text-slate-500 mt-1'}, q.explanation||'')
            ))
        ),
        React.createElement('div',{className:'flex items-center justify-end gap-2'},
            React.createElement('button',{className:'px-4 py-2 rounded bg-pink-500 text-white', onClick:()=>{ setStep('practice'); setQuestions(examQuestions.slice(0, Math.min(10, examQuestions.length))); setPracticeIdx(0); setPracticeAnswers({}); setShowAnswer(true); }}, '继续练习'),
            React.createElement('button',{className:'px-4 py-2 rounded bg-slate-100 text-slate-700', onClick:()=>{ setStep('home'); setExam(null); setExamQuestions([]); setExamAnswers({}); }}, '返回首页')
        )
    );

    return React.createElement('div',{className:'space-y-6'},
        React.createElement('div',{className:'flex items-center justify-between'},
            React.createElement('button',{className:'text-xs px-3 py-1 rounded bg-slate-100 text-slate-700', onClick:()=>{ setStep('home'); setTimerOn(false);} }, '返回'),
            React.createElement('div',{className:'text-xs px-2 py-1 rounded bg-slate-100 text-slate-700'}, `${subject} · ${grade}年级`)
        ),
        (loading ? React.createElement('div',{className:'text-sm text-slate-500'}, '加载中...') :
            (step==='home' ? React.createElement(Home,null) :
                step==='mode' ? React.createElement(ModeSelect,null) :
                    step==='practice' ? React.createElement(PracticeCard,null) :
                        step==='examList' ? React.createElement(ExamList,null) :
                            step==='examRun' ? React.createElement(ExamRunCard,null) :
                                step==='examDone' ? React.createElement(ExamDone,null) :
                                    React.createElement(Home,null)))
        ,
        (namePromptOpen ? React.createElement('div',{className:'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1300]'},
            React.createElement('div',{className:'bg-white rounded-2xl shadow-2xl w-[92vw] max-w-md'},
                React.createElement('div',{className:'px-5 py-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl'},
                    React.createElement('div',{className:'text-white font-semibold'}, '按用户名选择考试')
                ),
                React.createElement('div',{className:'p-5 space-y-4'},
                    React.createElement('div',{className:'text-sm text-slate-700'}, '请输入用户名以查询待考试试卷'),
                    React.createElement('input',{className:'w-full border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg px-3 py-2', value:nameInput, onChange:(e)=>setNameInput(e.target.value), placeholder:'例如：张三'}),
                    React.createElement('div',{className:'flex items-center justify-end gap-2'},
                        React.createElement('button',{className:'px-3 py-2 rounded bg-slate-100 text-slate-700', onClick:cancelNamePrompt}, '取消'),
                        React.createElement('button',{className:'px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50', disabled:!String(nameInput||'').trim(), onClick:confirmNamePrompt}, '确定')
                    )
                )
            )
        ) : null,
        (codePromptOpen ? React.createElement('div',{className:'fixed inset-0 bg-black/30 flex items-center justify-center z-[1000]'},
            React.createElement('div',{className:'bg-white rounded-2xl border shadow p-5 w-80 space-y-3'},
                React.createElement('div',{className:'text-sm font-semibold text-slate-700'}, '请输入考试编号'),
                React.createElement('input',{className:'w-full border border-slate-300 rounded-lg px-3 py-2', value:codeInput, onChange:(e)=>setCodeInput(e.target.value), placeholder:'如：1764315632367'}),
                React.createElement('div',{className:'flex items-center justify-end gap-2'},
                    React.createElement('button',{className:'px-3 py-2 rounded bg-slate-100 text-slate-700', onClick:cancelCodePrompt}, '取消'),
                    React.createElement('button',{className:'px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50', disabled:!String(codeInput||'').trim(), onClick:confirmCodePrompt}, '确定')
                )
            )
        ) : null)
    ));
  };

  window.ToolsPages = window.ToolsPages || {};
  window.ToolsPages['16'] = window.ToolsPages['16'] || Tool16;
})();
