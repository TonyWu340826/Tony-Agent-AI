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

    const startRandomExam = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('subject', subject);
        params.set('grade', grade);
        params.set('page', 0);
        params.set('size', 100);
        const r = await fetch(`/api/exams/questions?${params.toString()}`, { credentials:'same-origin' });
        const t = await r.text();
        let d={};
        try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
        const arr = Array.isArray(d.content) ? d.content : (Array.isArray(d) ? d : []);
        if (arr.length === 0) { alert('暂无题目，无法开始考试'); setLoading(false); return; }
        const shuffled = arr.slice().sort(()=>Math.random()-0.5).slice(0, Math.min(20, arr.length));
        const mockExam = {
          id: 'random-' + Date.now(),
          paperName: `随机考试 - ${subject} ${grade}年级`,
          subject: subject,
          grade: grade,
          questionIds: shuffled.map(q=>q.id).join(','),
          code: 'RANDOM-' + Date.now()
        };
        setExam(mockExam);
        setExamQuestions(shuffled);
        setExamIdx(0);
        setExamAnswers({});
        setExamPendingAnswers({});
        setExamConfirmed({});
        setRemainSec(examDurationMin * 60);
        setTimerOn(true);
        setStep('examRun');
      } catch(e) {
        alert('加载失败，请稍后再试');
      }
      setLoading(false);
    };

    const fetchPractice = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(); params.set('subject', subject); params.set('grade', grade); params.set('page', 0); params.set('size', 100);
        const r = await fetch(`/api/exams/questions?${params.toString()}`, { credentials:'same-origin' });
        const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
        const arr = Array.isArray(d.content) ? d.content : (Array.isArray(d) ? d : []);
        const shuffled = arr.slice().sort(()=>Math.random()-0.5).slice(0, Math.min(20, arr.length));
        setQuestions(shuffled); setPracticeIdx(0); setPracticeAnswers({}); setPracticePendingAnswers({}); setPracticeConfirmed({}); setShowAnswer(false);
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
      const qType = String(q.type||q.q_type||'');
      const opts = (()=>{ 
        try{ 
          if(qType.includes('选') && q.content && String(q.content).trim().startsWith('[')){
            const j = JSON.parse(q.content); if(Array.isArray(j)) return j;
          }
          const j = JSON.parse(q.optionsJson||'[]'); 
          if(Array.isArray(j)) return j;
          if(j && typeof j==='object') return Object.entries(j).sort((a,b)=>String(a[0]).localeCompare(String(b[0]))).map(([k,v])=>({value:k, label:v}));
        }catch(_){} 
        return []; 
      })();
      const pending = practicePendingAnswers[q.id] || '';
      const confirmed = !!practiceConfirmed[q.id];
      const chosen = practiceAnswers[q.id] || '';
      const answeredCount = Object.keys(practiceAnswers).filter(id=>practiceAnswers[id]).length;
      const setPending = (v) => setPracticePendingAnswers(prev=>({ ...prev, [q.id]: v }));
      const confirm = () => { const v = String(pending||'').trim(); if(!v) return; setPracticeAnswers(prev=>({ ...prev, [q.id]: v })); setPracticeConfirmed(prev=>({ ...prev, [q.id]: true })); setShowAnswer(true); };
      const isChoice = opts.length>0 && qType.includes('选');
      const isJudge = !isChoice && qType.includes('判');
      const isFill = !isChoice && !isJudge;
      const match = (a,b) => String(a||'').trim() === String(b||'').trim();
      const ok = confirmed && match(chosen, q.correctAnswer);
      
      const questionText = (isChoice && q.content && String(q.content).trim().startsWith('[')) ? (q.title||'请选择正确答案：') : (q.content||'');

      return React.createElement('div',{className:'grid md:grid-cols-4 gap-6'},
          React.createElement('div',{className:'md:col-span-3'},
              React.createElement('div',{className:'p-6 bg-white rounded-2xl shadow border space-y-4'},
                  React.createElement('div',{className:'flex items-center justify-between'},
                      React.createElement('div',{className:'text-sm text-rose-600 font-semibold'}, qType||'题目'),
                      React.createElement('div',{className:'text-xs text-slate-500'}, `第 ${practiceIdx+1} / ${questions.length} 题 · 已答 ${answeredCount}`)
                  ),
                  React.createElement('div',{className:'text-lg font-bold text-slate-900'}, questionText),
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
                      React.createElement('div',{className:'flex items-center gap-2'},
                          React.createElement('button',{className:'px-3 py-2 rounded bg-slate-100 text-slate-700 disabled:opacity-50', disabled: practiceIdx<=0, onClick:()=>setPracticeIdx(i=>Math.max(0,i-1))}, '上一题'),
                          React.createElement('button',{className:'px-3 py-2 rounded bg-indigo-600 text-white disabled:opacity-50', disabled: confirmed || !String(pending||'').trim(), onClick:confirm}, '确认')
                      ),
                      React.createElement('div',{className:'flex items-center gap-2'},
                          React.createElement('button',{className:'px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50', disabled: practiceIdx>=questions.length-1 || !confirmed, onClick:()=>setPracticeIdx(i=>Math.min(i+1, questions.length-1))}, '下一题'),
                          React.createElement('button',{className:'px-4 py-2 rounded bg-rose-600 text-white', onClick:()=>{ setStep('mode'); }}, '返回')
                      )
                  ),
                  (confirmed ? React.createElement('div',{className:(ok?'text-emerald-600':'text-rose-600')+' text-sm font-semibold'}, ok?'回答正确':'回答错误') : null),
                  (confirmed ? React.createElement('div',{className:'text-xs text-slate-500'}, `你的答案：${chosen||'-'} · 正确答案：${q.correctAnswer||'-'}`) : null),
                  (confirmed ? React.createElement('div',{className:'text-sm text-slate-500'}, q.explanation||'') : null),
                  React.createElement('div',{className:'space-y-2'},
                      React.createElement('div',{className:'h-1 bg-slate-200 rounded-full overflow-hidden'}, React.createElement('div',{className:'h-1 bg-blue-600', style:{ width: `${Math.round(((practiceIdx+1)/Math.max(1,questions.length))*100)}%` }}))
                  )
              )
          ),
          React.createElement('div',null,
              React.createElement('div',{className:'p-4 bg-white rounded-2xl border shadow space-y-3'},
                  React.createElement('div',{className:'text-sm font-semibold text-slate-700'}, '答题卡'),
                  React.createElement('div',{className:'grid grid-cols-5 gap-2'}, questions.map((qq,idx)=>React.createElement('button',{key:qq.id,className:(idx===practiceIdx?'bg-blue-600 text-white':'bg-slate-100 text-slate-700')+' rounded px-3 py-1', onClick:()=>setPracticeIdx(idx)}, String(idx+1))),
                      React.createElement('div',{className:'text-xs text-slate-500'}, `总题数 ${questions.length} · 已答 ${answeredCount} · 未答 ${Math.max(0, questions.length-answeredCount)}`)
                  )
              )
          ));
    };

    const ExamRunCard = () => {
      const q = examQuestions[examIdx]; if (!q) return React.createElement('div',{className:'text-sm text-slate-500'}, '暂无题目');
      const qType = String(q.type||q.q_type||'');
      const opts = (()=>{ 
        try{ 
          if(qType.includes('选') && q.content && String(q.content).trim().startsWith('[')){
            const j = JSON.parse(q.content); if(Array.isArray(j)) return j;
          }
          const j = JSON.parse(q.optionsJson||'[]'); 
          if(Array.isArray(j)) return j;
          if(j && typeof j==='object') return Object.entries(j).sort((a,b)=>String(a[0]).localeCompare(String(b[0]))).map(([k,v])=>({value:k, label:v}));
        }catch(_){} 
        return []; 
      })();
      const pending = examPendingAnswers[q.id] || '';
      const confirmed = !!examConfirmed[q.id];
      const chosen = examAnswers[q.id] || '';
      const answeredCount = Object.keys(examAnswers).filter(id=>examAnswers[id]).length;
      const setPending = (v) => setExamPendingAnswers(prev=>({ ...prev, [q.id]: v }));
      const confirmAnswer = () => { const v = String(pending||'').trim(); if(!v) return; setExamAnswers(prev=>({ ...prev, [q.id]: v })); setExamConfirmed(prev=>({ ...prev, [q.id]: true })); };
      const isChoice = opts.length>0 && qType.includes('选');
      const isJudge = !isChoice && qType.includes('判');
      const isFill = !isChoice && !isJudge;
      const match = (a,b) => String(a||'').trim() === String(b||'').trim();
      const isCorrect = confirmed && match(chosen, q.correctAnswer);
      
      const questionText = (isChoice && q.content && String(q.content).trim().startsWith('[')) ? (q.title||'请选择正确答案：') : (q.content||'');

      return React.createElement('div',{className:'grid md:grid-cols-4 gap-6'},
          React.createElement('div',{className:'md:col-span-3'},
              React.createElement('div',{className:'p-6 bg-white rounded-2xl shadow border space-y-4'},
                  React.createElement('div',{className:'flex items-center justify-between'},
                      React.createElement('div',{className:'text-sm text-indigo-600 font-semibold'}, qType||'题目'),
                      React.createElement('div',{className:'text-xs text-rose-600 font-semibold'}, `${String(Math.floor(remainSec/60)).padStart(2,'0')}:${String(remainSec%60).padStart(2,'0')}`)
                  ),
                  React.createElement('div',{className:'text-lg font-bold text-slate-900'}, questionText),
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
        React.createElement('div',{className:'p-4 bg-white rounded-2xl border shadow flex items-center justify-between'},
            React.createElement('div', null,
                React.createElement('div',{className:'text-lg font-bold text-slate-900 mb-1'}, '欢迎来到AI学习系统'),
                React.createElement('div',{className:'text-sm text-slate-600'}, '选择你的年级和科目，开始学习吧')
            ),
            // Optimized Cool Avatar Frame (VIP99 Effect)
            React.createElement('div', { 
                className: 'flex items-center gap-3'
            },
                React.createElement('div', { 
                    className: 'relative group cursor-pointer',
                    onClick: () => {
                        const name = (currentUser && currentUser.username) || 'root';
                        const level = (currentUser && currentUser.vipLevel) || 99;
                        alert(`当前用户: ${name} (VIP${level})`);
                    },
                    title: '点击查看用户信息'
                },
                    // Cool rotating glow effect (VIP99)
                    React.createElement('div', {
                        className: 'absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-purple-600 rounded-full blur opacity-75 animate-spin',
                        style: { animationDuration: '4s' }
                    }),
                    // Avatar Container
                    React.createElement('div', {
                        className: 'relative w-12 h-12 rounded-full bg-slate-900 p-0.5 flex items-center justify-center z-10'
                    },
                        React.createElement('div', {
                            className: 'w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner'
                        }, (currentUser && currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'R'))
                    ),
                    // Crown Badge (VIP99)
                    React.createElement('div', {
                        className: 'absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg z-20 transform group-hover:scale-110 transition-transform duration-300'
                    }, 
                        React.createElement('span', { className: 'text-xs' }, '👑')
                    )
                )
            )
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
        React.createElement('div',{className:'grid grid-cols-1 md:grid-cols-3 gap-6'},
            React.createElement('div',{className:'bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border-2 border-pink-300 shadow-lg p-6 space-y-3 relative overflow-hidden'},
                // 装饰效果
                React.createElement('div',{className:'absolute top-0 right-0 w-20 h-20 bg-pink-400/10 rounded-full -mr-10 -mt-10'}),
                React.createElement('div',{className:'absolute bottom-0 left-0 w-16 h-16 bg-rose-400/10 rounded-full -ml-8 -mb-8'}),
                React.createElement('div',{className:'relative'},
                    React.createElement('div',{className:'flex items-center gap-2 mb-2'},
                        React.createElement('div',{className:'text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent'}, '📚 随机练习'),
                        React.createElement('span',{className:'px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold shadow-md'}, '推荐')
                    ),
                    React.createElement('div',{className:'text-xs text-slate-600 mb-3'}, '不限时 · 即时反馈 · 查看解析'),
                    React.createElement('button',{className:'w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold hover:shadow-xl hover:shadow-pink-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2', onClick:fetchPractice}, 
                        React.createElement('span',null, '开始练习'),
                        React.createElement('svg',{className:'w-4 h-4', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2'}, React.createElement('path',{d:'M5 12h14M12 5l7 7-7 7'}))
                    )
                )
            ),
            React.createElement('div',{className:'bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-300 shadow-lg p-6 space-y-3 relative overflow-hidden'},
                // 装饰效果
                React.createElement('div',{className:'absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full -mr-10 -mt-10'}),
                React.createElement('div',{className:'absolute bottom-0 left-0 w-16 h-16 bg-indigo-400/10 rounded-full -ml-8 -mb-8'}),
                React.createElement('div',{className:'relative'},
                    React.createElement('div',{className:'flex items-center gap-2 mb-2'},
                        React.createElement('div',{className:'text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent'}, '🎲 随机考试'),
                        React.createElement('span',{className:'px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-md'}, 'NEW')
                    ),
                    React.createElement('div',{className:'text-xs text-slate-600 mb-3'}, '随机生成试卷 · 模拟真实考试 · AI批改'),
                    React.createElement('button',{className:'w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-xl hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2', onClick:startRandomExam}, 
                        React.createElement('span',null, '开始考试'),
                        React.createElement('svg',{className:'w-4 h-4', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2'}, React.createElement('path',{d:'M5 12h14M12 5l7 7-7 7'}))
                    )
                )
            ),
            React.createElement('div',{className:'bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-300 shadow-lg p-6 space-y-3 relative overflow-hidden'},
                // 装饰效果
                React.createElement('div',{className:'absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full -mr-10 -mt-10'}),
                React.createElement('div',{className:'absolute bottom-0 left-0 w-16 h-16 bg-cyan-400/10 rounded-full -ml-8 -mb-8'}),
                React.createElement('div',{className:'relative'},
                    React.createElement('div',{className:'flex items-center gap-2 mb-2'},
                        React.createElement('div',{className:'text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'}, '📝 正式考试'),
                        React.createElement('span',{className:'px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-violet-400 to-purple-500 text-white font-bold shadow-md'}, '正式')
                    ),
                    React.createElement('div',{className:'text-xs text-slate-600 mb-3'}, '限时考试 · AI批改 · 成绩记录'),
                    React.createElement('div',{className:'flex items-center gap-2'},
                        React.createElement('button',{className:'w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2', onClick:openCodePrompt}, 
                            React.createElement('span',null, '按编号选择')
                        ),
                        React.createElement('button',{className:'w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:shadow-xl hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2', onClick:openNamePrompt}, 
                            React.createElement('span',null, '按用户名选择')
                        )
                    ),
                    (inlineNameOpen ? React.createElement('div',{className:'mt-3 flex items-center gap-2'},
                        React.createElement('input',{className:'flex-1 border border-slate-300 rounded-lg px-3 py-2', value:inlineNameValue, onChange:(e)=>setInlineNameValue(e.target.value), placeholder:'请输入用户名'}),
                        React.createElement('button',{className:'px-3 py-2 rounded bg-slate-100 text-slate-700', onClick:()=>{ setInlineNameOpen(false); }}, '取消'),
                        React.createElement('button',{className:'px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50', disabled:!String(inlineNameValue||'').trim(), onClick:()=>{ const v=String(inlineNameValue||'').trim(); setExamUserName(v); setInlineNameOpen(false); setNamePromptOpen(false); fetchSessionsByUser(v); }}, '确定')
                    ) : null)
                )
            )
        ),
        // New modules: Homework Grading and Difficult Problem Assistance
        React.createElement('div',{className:'grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'},
            React.createElement('div',{className:'bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 shadow-lg p-6 space-y-3 relative overflow-hidden'},
                React.createElement('div',{className:'absolute top-0 right-0 w-20 h-20 bg-amber-400/10 rounded-full -mr-10 -mt-10'}),
                React.createElement('div',{className:'absolute bottom-0 left-0 w-16 h-16 bg-orange-400/10 rounded-full -ml-8 -mb-8'}),
                React.createElement('div',{className:'relative'},
                    React.createElement('div',{className:'flex items-center gap-2 mb-2'},
                        React.createElement('div',{className:'text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent'}, '📖 作业批改'),
                        React.createElement('span',{className:'px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-bold shadow-md'}, 'AI')
                    ),
                    React.createElement('div',{className:'text-xs text-slate-600 mb-3'}, '拍照上传作业 · AI智能批改 · 详细解析'),
                    React.createElement('div',{className:'space-y-3'},
                        React.createElement('input',{type:'file', accept:'image/*,.pdf,.doc,.docx', className:'w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700', onChange:handleHomeworkFileUpload}),
                        React.createElement('button',{className:'w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold hover:shadow-xl hover:shadow-amber-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2', onClick:startHomeworkGrading}, 
                            React.createElement('span',null, '开始批改'),
                            React.createElement('svg',{className:'w-4 h-4', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2'}, React.createElement('path',{d:'M5 12h14M12 5l7 7-7 7'}))
                        )
                    )
                )
            ),
            React.createElement('div',{className:'bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-300 shadow-lg p-6 space-y-3 relative overflow-hidden'},
                React.createElement('div',{className:'absolute top-0 right-0 w-20 h-20 bg-emerald-400/10 rounded-full -mr-10 -mt-10'}),
                React.createElement('div',{className:'absolute bottom-0 left-0 w-16 h-16 bg-green-400/10 rounded-full -ml-8 -mb-8'}),
                React.createElement('div',{className:'relative'},
                    React.createElement('div',{className:'flex items-center gap-2 mb-2'},
                        React.createElement('div',{className:'text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent'}, '❓ 难题辅助'),
                        React.createElement('span',{className:'px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold shadow-md'}, 'AI')
                    ),
                    React.createElement('div',{className:'text-xs text-slate-600 mb-3'}, '拍照上传难题 · AI详细讲解 · 解题思路'),
                    React.createElement('div',{className:'space-y-3'},
                        React.createElement('input',{type:'file', accept:'image/*,.pdf,.doc,.docx', className:'w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700', onChange:handleProblemFileUpload}),
                        React.createElement('button',{className:'w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2', onClick:startProblemAssistance}, 
                            React.createElement('span',null, '开始辅助'),
                            React.createElement('svg',{className:'w-4 h-4', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2'}, React.createElement('path',{d:'M5 12h14M12 5l7 7-7 7'}))
                        )
                    )
                )
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

    const downloadExamReport = () => {
      const wrongQuestions = examQuestions.filter(q=>String(examAnswers[q.id]||'')!==String(q.correctAnswer||''));
      const timestamp = new Date().toLocaleString('zh-CN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });
      
      // 生成 HTML 格式内容（可以被 Word 打开）
      let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body { font-family: 'Microsoft YaHei', Arial, sans-serif; padding: 40px; line-height: 1.8; }
.title { text-align: center; font-size: 28px; font-weight: bold; color: #1e58af; margin-bottom: 30px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
.section { margin: 30px 0; padding: 20px; background: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 8px; }
.section-title { font-size: 20px; font-weight: bold; color: #1e3a8a; margin-bottom: 15px; }
.info-row { margin: 8px 0; font-size: 14px; }
.label { font-weight: bold; color: #475569; }
.score { font-size: 32px; font-weight: bold; color: #10b981; }
.correct { color: #10b981; font-weight: bold; }
.wrong { color: #ef4444; font-weight: bold; }
.stats { display: flex; justify-content: space-around; text-align: center; margin: 20px 0; }
.stat-item { padding: 15px; }
.ai-summary { background: #eff6ff; padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid #bfdbfe; }
.question { margin: 20px 0; padding: 15px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; }
.question-header { font-weight: bold; color: #991b1b; margin-bottom: 10px; font-size: 15px; }
.question-content { margin: 10px 0; font-size: 14px; }
.answer { margin: 8px 0; font-size: 14px; }
.explanation { margin-top: 10px; padding: 10px; background: #fefce8; border-left: 3px solid #facc15; font-style: italic; color: #713f12; }
.success-msg { text-align: center; font-size: 24px; color: #10b981; font-weight: bold; padding: 40px; background: #d1fae5; border-radius: 12px; }
</style>
</head>
<body>
`;
      
      // 标题
      html += `<div class="title">📋 考试报告</div>\n`;
      
      // 基本信息
      html += `<div class="section">\n`;
      html += `<div class="section-title">📝 考试信息</div>\n`;
      html += `<div class="info-row"><span class="label">考试时间：</span>${timestamp}</div>\n`;
      html += `<div class="info-row"><span class="label">科目：</span>${subject}</div>\n`;
      html += `<div class="info-row"><span class="label">年级：</span>${grade}年级</div>\n`;
      html += `<div class="info-row"><span class="label">试卷名称：</span>${exam?.paperName || '随机考试'}</div>\n`;
      html += `</div>\n`;
      
      // 成绩
      html += `<div class="section">\n`;
      html += `<div class="section-title">🎯 考试成绩</div>\n`;
      html += `<div class="stats">\n`;
      html += `<div class="stat-item"><div class="score">${doneStats.score}</div><div>分数</div></div>\n`;
      html += `<div class="stat-item"><div class="correct" style="font-size:32px;">${doneStats.correct}</div><div>正确</div></div>\n`;
      html += `<div class="stat-item"><div class="wrong" style="font-size:32px;">${doneStats.wrong}</div><div>错误</div></div>\n`;
      html += `<div class="stat-item"><div style="font-size:32px; font-weight:bold;">${examQuestions.length}</div><div>总题数</div></div>\n`;
      html += `</div>\n`;
      html += `</div>\n`;
      
      // AI评价
      html += `<div class="section">\n`;
      html += `<div class="section-title">🤖 AI老师的评价</div>\n`;
      html += `<div class="ai-summary">${(aiSummary||'暂无评价').replace(/\n/g, '<br>')}</div>\n`;
      html += `</div>\n`;
      
      // 错题详情
      if (wrongQuestions.length > 0) {
        html += `<div class="section">\n`;
        html += `<div class="section-title">❌ 错题详情 (共 ${wrongQuestions.length} 题)</div>\n`;
        
        wrongQuestions.forEach((q, idx) => {
          html += `<div class="question">\n`;
          html += `<div class="question-header">第 ${idx + 1} 题 - ${q.type || '题目'} | ${q.subject || ''} | ${q.grade || ''}年级</div>\n`;
          html += `<div class="question-content"><strong>题目：</strong>${q.content || ''}</div>\n`;
          html += `<div class="answer"><span class="wrong">❌ 你的答案：</span>${examAnswers[q.id] || '-'}</div>\n`;
          html += `<div class="answer"><span class="correct">✓ 正确答案：</span>${q.correctAnswer || '-'}</div>\n`;
          if (q.explanation) {
            html += `<div class="explanation">💡 解析：${q.explanation}</div>\n`;
          }
          html += `</div>\n`;
        });
        html += `</div>\n`;
      } else {
        html += `<div class="success-msg">🎉 恰喜你！所有题目都答对了！</div>\n`;
      }
      
      html += `</body>\n</html>`;
      
      const blob = new Blob([html], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `考试报告_${subject}_${grade}年级_${Date.now()}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const ExamDone = () => React.createElement('div',{className:'space-y-6'},
        React.createElement('div',{className:'p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-300 shadow-lg'},
            React.createElement('div',{className:'flex items-center gap-2 mb-3'},
                React.createElement('div',{className:'text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'}, '🎉 考试完成！'),
                React.createElement('span',{className:'px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-violet-400 to-purple-500 text-white font-bold shadow-md'}, '完成')
            ),
            React.createElement('div',{className:'grid grid-cols-3 gap-4 mt-3'},
                React.createElement('div',{className:'text-center'}, React.createElement('div',{className:'text-3xl font-bold text-slate-900'}, doneStats.score), React.createElement('div',{className:'text-xs text-slate-500'}, '分数')),
                React.createElement('div',{className:'text-center'}, React.createElement('div',{className:'text-3xl font-bold text-emerald-600'}, doneStats.correct), React.createElement('div',{className:'text-xs text-slate-500'}, '正确')),
                React.createElement('div',{className:'text-center'}, React.createElement('div',{className:'text-3xl font-bold text-rose-600'}, doneStats.wrong), React.createElement('div',{className:'text-xs text-slate-500'}, '错误'))
            )
        ),
        React.createElement('div',{className:'p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-300 shadow-lg'},
            React.createElement('div',{className:'flex items-center gap-2 mb-2'},
                React.createElement('div',{className:'text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'}, '🤖 AI老师的评价'),
                React.createElement('span',{className:'px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-md'}, '智能')
            ),
            React.createElement('div',{className:'text-sm text-slate-600 bg-white/50 rounded-lg p-3 border border-indigo-100'}, aiSummary||'')
        ),
        React.createElement('div',{className:'p-5 bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl border-2 border-rose-300 shadow-lg space-y-3'},
            React.createElement('div',{className:'flex items-center gap-2 mb-2'},
                React.createElement('div',{className:'text-sm font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent'}, '❌ 错题详情'),
                React.createElement('span',{className:'px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-pink-400 to-rose-500 text-white font-bold shadow-md'}, '重点')
            ),
            examQuestions.filter(q=>String(examAnswers[q.id]||'')!==String(q.correctAnswer||'')).map(q=>React.createElement('div',{key:q.id,className:'border rounded-xl p-3 bg-white border-rose-200 shadow-sm'},
                React.createElement('div',{className:'text-xs text-rose-600 font-semibold'}, `${q.type||'题目'} · ${q.subject||''} · ${q.grade||''}年级`),
                React.createElement('div',{className:'text-sm text-slate-900 mt-1'}, q.content||''),
                React.createElement('div',{className:'text-xs text-slate-600 mt-1'}, `你的答案：${examAnswers[q.id]||'-'} · 正确答案：${q.correctAnswer||'-'}`),
                React.createElement('div',{className:'text-xs text-slate-500 mt-1 bg-amber-50/50 p-2 rounded border border-amber-100'}, q.explanation||'')
            ))
        ),
        React.createElement('div',{className:'flex items-center justify-between gap-2'},
            React.createElement('div',{className:'flex items-center gap-2'},
                React.createElement('button',{className:'px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold hover:shadow-xl hover:shadow-pink-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2', onClick:()=>{ setStep('practice'); setQuestions(examQuestions.slice(0, Math.min(20, examQuestions.length))); setPracticeIdx(0); setPracticeAnswers({}); setPracticePendingAnswers({}); setPracticeConfirmed({}); setShowAnswer(true); }}, 
                    React.createElement('svg',{className:'w-4 h-4', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2'}, React.createElement('path',{d:'M4 4h16v16H4z'})),
                    React.createElement('span',null, '继续练习')
                ),
                React.createElement('button',{className:'px-4 py-2 rounded-lg bg-gradient-to-r from-slate-600 to-gray-600 text-white font-semibold hover:shadow-xl hover:shadow-slate-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2', onClick:()=>{ setStep('home'); setExam(null); setExamQuestions([]); setExamAnswers({}); }}, 
                    React.createElement('svg',{className:'w-4 h-4', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2'}, React.createElement('path',{d:'M3 12h18'})),
                    React.createElement('span',null, '返回首页')
                )
            ),
            React.createElement('button',{className:'px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2', onClick:downloadExamReport},
                React.createElement('svg',{className:'w-4 h-4', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'},
                    React.createElement('path',{d:'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4'}),
                    React.createElement('polyline',{points:'7 10 12 15 17 10'}),
                    React.createElement('line',{x1:'12', y1:'15', x2:'12', y2:'3'})
                ),
                React.createElement('span',null, '下载报告')
            )
        )
    );

    // Add new state variables for homework and problem assistance
    const [homeworkFile, setHomeworkFile] = useState(null);
    const [problemFile, setProblemFile] = useState(null);
    const [homeworkResult, setHomeworkResult] = useState(null);
    const [problemResult, setProblemResult] = useState(null);
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    // File upload handlers
    const handleHomeworkFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setHomeworkFile(file);
        }
    };

    const handleProblemFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProblemFile(file);
        }
    };

    // Functions to start homework grading and problem assistance
    const startHomeworkGrading = async () => {
        if (!homeworkFile) {
            alert('请先选择要批改的作业文件');
            return;
        }
        
        // Show loading modal with animation
        setShowLoadingModal(true);
        
        try {
            // Create FormData to send file and other parameters
            const formData = new FormData();
            formData.append('file', homeworkFile);
            formData.append('message', '请批改这份作业');
            formData.append('prompt', '请识别文件的内容，按照里面的内容进行批改，并返回每一次的批改结果，错误分析，题目解析。不要有多余的废话，返回的结构只包含批改的内容，因为需要导出这个批改结果。');
            
            console.log('Sending request to /api/open/aliyunUnderstandImage with file:', homeworkFile);
            
            // Call the backend API endpoint
            const response = await fetch('/api/open/aliyunUnderstandImage', {
                method: 'POST',
                body: formData
            });
            
            console.log('Received response from server:', response);
            
            const contentType = response.headers.get('content-type');
            console.log('Response content type:', contentType);
            
            let result;
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.log('Response text:', text);
                try {
                    result = JSON.parse(text);
                } catch (e) {
                    result = { message: text };
                }
            }
            
            console.log('Parsed result:', result);
            
            if (response.ok) {
                // Use the actual AI response
                const aiFeedback = result.message || '作业批改完成';
                
                console.log('AI Feedback:', aiFeedback);
                
                // Try to parse structured data from AI response if it's in JSON format
                let parsedData = null;
                try {
                    // If the AI returns JSON data, parse it
                    if (typeof aiFeedback === 'string') {
                        // Try to parse as JSON
                        parsedData = JSON.parse(aiFeedback);
                    } else if (typeof aiFeedback === 'object') {
                        // If it's already an object, use it directly
                        parsedData = aiFeedback;
                    }
                } catch (parseError) {
                    // If parsing fails, we'll use the raw response
                    console.log('Could not parse AI response as JSON');
                }
                
                // Create homework result data
                const homeworkResultData = {
                    score: parsedData && (parsedData.score || parsedData.Score) ? (parsedData.score || parsedData.Score) : 0,
                    totalQuestions: parsedData && (parsedData.totalQuestions || parsedData.TotalQuestions) ? (parsedData.totalQuestions || parsedData.TotalQuestions) : 0,
                    correct: parsedData && (parsedData.correct || parsedData.Correct) ? (parsedData.correct || parsedData.Correct) : 0,
                    wrong: parsedData && (parsedData.wrong || parsedData.Wrong) ? (parsedData.wrong || parsedData.Wrong) : 0,
                    feedback: aiFeedback,
                    detailedAnalysis: aiFeedback
                };
                
                console.log('Homework result data:', homeworkResultData);
                
                setHomeworkResult(homeworkResultData);
                setStep('homeworkResult');
            } else {
                throw new Error(result.message || '作业批改失败');
            }
        } catch (error) {
            console.error('作业批改失败:', error);
            alert('作业批改失败: ' + (error.message || '请稍后重试'));
        } finally {
            // Always hide loading modal when done
            setShowLoadingModal(false);
        }
    };

    const startProblemAssistance = async () => {
        if (!problemFile) {
            alert('请先选择需要辅助的难题文件');
            return;
        }
        
        // Show loading modal with animation
        setShowLoadingModal(true);
        
        try {
            // Create FormData to send file and other parameters
            const formData = new FormData();
            formData.append('file', problemFile);
            formData.append('message', '请解答这道题');
            formData.append('prompt', '请识别文件的内容，按照里面的内容进行解答，并返回详细的解题过程和知识点解析。不要有多余的废话，返回的结构只包含解题的内容，因为需要导出这个解题结果。');
            
            console.log('Sending request to /api/open/aliyunUnderstandImage with file:', problemFile);
            
            // Call the backend API endpoint
            const response = await fetch('/api/open/aliyunUnderstandImage', {
                method: 'POST',
                body: formData
            });
            
            console.log('Received response from server:', response);
            
            const contentType = response.headers.get('content-type');
            console.log('Response content type:', contentType);
            
            let result;
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.log('Response text:', text);
                try {
                    result = JSON.parse(text);
                } catch (e) {
                    result = { message: text };
                }
            }
            
            console.log('Parsed result:', result);
            
            if (response.ok) {
                // Use the actual AI response
                const aiFeedback = result.message || '题目解答完成';
                
                console.log('AI Feedback:', aiFeedback);
                
                // For problem assistance, we'll structure the data differently
                const problemResultData = {
                    problem: '题目解析',
                    solution: aiFeedback,
                    explanation: '知识点解析'
                };
                
                console.log('Problem result data:', problemResultData);
                
                setProblemResult(problemResultData);
                setStep('problemResult');
            } else {
                throw new Error(result.message || '题目解答失败');
            }
        } catch (error) {
            console.error('题目解答失败:', error);
            alert('题目解答失败: ' + (error.message || '请稍后重试'));
        } finally {
            // Always hide loading modal when done
            setShowLoadingModal(false);
        }
    };

    // Download functions for saving results
    const downloadHomeworkResult = () => {
        // Create content for the file
        const content = `作业批改结果
==============

得分: ${homeworkResult?.score || 0}
正确: ${homeworkResult?.correct || 0}
错误: ${homeworkResult?.wrong || 0}
总题数: ${homeworkResult?.totalQuestions || 0}

AI老师点评:
${homeworkResult?.feedback || ''}

详细分析:
${homeworkResult?.detailedAnalysis || ''}`;
        
        // Create a Blob with the content
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `作业批改结果_${new Date().toLocaleDateString('zh-CN')}.txt`;
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const downloadProblemResult = () => {
        // Create content for the file
        const content = `难题解答结果
==============

题目:
${problemResult?.problem || ''}

解题过程:
${problemResult?.solution || ''}

知识点解析:
${problemResult?.explanation || ''}`;
        
        // Create a Blob with the content
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `难题解答结果_${new Date().toLocaleDateString('zh-CN')}.txt`;
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // New components for displaying results
    const HomeworkResult = () => React.createElement('div',{className:'space-y-6'},
        React.createElement('div',{className:'p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 shadow-lg'},
            React.createElement('div',{className:'flex items-center gap-2 mb-3'},
                React.createElement('div',{className:'text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent'}, '📖 作业批改结果'),
                React.createElement('span',{className:'px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-bold shadow-md'}, '完成')
            ),
            React.createElement('div',{className:'grid grid-cols-3 gap-4 mt-3'},
                React.createElement('div',{className:'text-center'}, React.createElement('div',{className:'text-3xl font-bold text-slate-900'}, homeworkResult?.score), React.createElement('div',{className:'text-xs text-slate-500'}, '得分')),
                React.createElement('div',{className:'text-center'}, React.createElement('div',{className:'text-3xl font-bold text-emerald-600'}, homeworkResult?.correct), React.createElement('div',{className:'text-xs text-slate-500'}, '正确')),
                React.createElement('div',{className:'text-center'}, React.createElement('div',{className:'text-3xl font-bold text-rose-600'}, homeworkResult?.wrong), React.createElement('div',{className:'text-xs text-slate-500'}, '错误'))
            )
        ),
        React.createElement('div',{className:'p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-300 shadow-lg'},
            React.createElement('div',{className:'flex items-center gap-2 mb-2'},
                React.createElement('div',{className:'text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'}, '📝 AI老师点评'),
                React.createElement('span',{className:'px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-md'}, '智能')
            ),
            React.createElement('div',{className:'text-sm text-slate-600 bg-white/50 rounded-lg p-3 border border-blue-100'}, homeworkResult?.feedback || '')
        ),
        React.createElement('div',{className:'p-5 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl border-2 border-green-300 shadow-lg'},
            React.createElement('div',{className:'flex items-center gap-2 mb-2'},
                React.createElement('div',{className:'text-sm font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent'}, '🔍 详细分析'),
                React.createElement('span',{className:'px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold shadow-md'}, '详尽')
            ),
            React.createElement('div',{className:'text-sm text-slate-600 bg-white/50 rounded-lg p-3 border border-green-100 whitespace-pre-wrap'}, homeworkResult?.detailedAnalysis || '')
        ),
        React.createElement('div',{className:'flex items-center justify-center gap-3 mt-6'},
            React.createElement('button',{className:'px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-2', onClick:()=>downloadHomeworkResult()}, 
                React.createElement('span',null, '📥 下载结果')
            ),
            React.createElement('button',{className:'px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 flex items-center gap-2', onClick:()=>setStep('mode')}, 
                React.createElement('span',null, '返回学习模式')
            )
        )
    );

    const ProblemResult = () => React.createElement('div',{className:'space-y-6'},
        React.createElement('div',{className:'p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-300 shadow-lg'},
            React.createElement('div',{className:'flex items-center gap-2 mb-3'},
                React.createElement('div',{className:'text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent'}, '❓ 难题解答'),
                React.createElement('span',{className:'px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold shadow-md'}, '详解')
            ),
            React.createElement('div',{className:'space-y-4'},
                React.createElement('div',{className:'bg-white/50 rounded-lg p-3 border border-emerald-100'},
                    React.createElement('div',{className:'text-sm font-semibold text-slate-700 mb-2'}, '题目：'),
                    React.createElement('div',{className:'text-sm text-slate-600'}, problemResult?.problem || '')
                ),
                React.createElement('div',{className:'bg-white/50 rounded-lg p-3 border border-emerald-100'},
                    React.createElement('div',{className:'text-sm font-semibold text-slate-700 mb-2'}, '解题过程：'),
                    React.createElement('div',{className:'text-sm text-slate-600 whitespace-pre-line'}, problemResult?.solution || '')
                ),
                React.createElement('div',{className:'bg-white/50 rounded-lg p-3 border border-emerald-100'},
                    React.createElement('div',{className:'text-sm font-semibold text-slate-700 mb-2'}, '知识点解析：'),
                    React.createElement('div',{className:'text-sm text-slate-600'}, problemResult?.explanation || '')
                )
            )
        ),
        React.createElement('div',{className:'flex items-center justify-center gap-3 mt-6'},
            React.createElement('button',{className:'px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-2', onClick:()=>downloadProblemResult()}, 
                React.createElement('span',null, '📥 下载结果')
            ),
            React.createElement('button',{className:'px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 flex items-center gap-2', onClick:()=>setStep('mode')}, 
                React.createElement('span',null, '返回学习模式')
            )
        )
    );
    
    // Loading modal component with animation
    const LoadingModal = () => {
        if (!showLoadingModal) return null;
        
        // Create a modal that can only be closed by clicking the close button (not by clicking outside)
        return React.createElement('div', { 
            className: 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1400]',
            // Prevent closing when clicking outside - stop all click events on the backdrop
            onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        },
            React.createElement('div', { 
                className: 'bg-white rounded-2xl shadow-2xl w-[90vw] max-w-md p-6 relative'
            },
                // Close button in top-right corner
                React.createElement('button', {
                    className: 'absolute top-4 right-4 text-slate-400 hover:text-slate-600',
                    onClick: (e) => {
                        e.stopPropagation();
                        setShowLoadingModal(false);
                    }
                },
                    React.createElement('svg', {
                        className: 'w-6 h-6',
                        fill: 'none',
                        stroke: 'currentColor',
                        viewBox: '0 0 24 24'
                    },
                        React.createElement('path', {
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                            strokeWidth: 2,
                            d: 'M6 18L18 6M6 6l12 12'
                        })
                    )
                ),
                React.createElement('div', { 
                    className: 'flex flex-col items-center justify-center space-y-4 pt-4'
                },
                    // Spinning loader animation
                    React.createElement('div', { 
                        className: 'w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'
                    }),
                    React.createElement('div', { 
                        className: 'text-lg font-semibold text-slate-800'
                    }, 'AI正在努力分析中...'),
                    React.createElement('div', { 
                        className: 'text-sm text-slate-500 text-center'
                    }, '请耐心等待，这可能需要几秒钟时间'),
                    // Progress indicator
                    React.createElement('div', { 
                        className: 'w-full bg-slate-200 rounded-full h-2'
                    },
                        React.createElement('div', { 
                            className: 'bg-blue-600 h-2 rounded-full animate-pulse',
                            style: { width: '70%' }
                        })
                    )
                )
            )
        );
    };

    // Logout function
    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', { 
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                // Redirect to login page or reload the page
                window.location.reload();
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    
    return React.createElement('div',{className:'space-y-6'},
        React.createElement('div',{className:'flex items-center justify-between'},
            React.createElement('button',{className:'text-xs px-3 py-1 rounded bg-slate-100 text-slate-700', onClick:()=>{ setStep('home'); setTimerOn(false);} }, '返回'),
            React.createElement('div',{className:'flex items-center gap-3'},
                React.createElement('div',{className:'text-xs px-2 py-1 rounded bg-slate-100 text-slate-700'}, `${subject} · ${grade}年级`),
                React.createElement('button',{className:'text-xs px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-1', onClick:handleLogout}, 
                    React.createElement('svg',{className:'w-3 h-3', fill:'none', stroke:'currentColor', viewBox:'0 0 24 24'},
                        React.createElement('path',{strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:2, d:'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'})
                    ),
                    '登出'
                )
            )
        ),
        (step==='home' ? React.createElement(Home,null) :
            step==='mode' ? React.createElement(ModeSelect,null) :
                step==='practice' ? React.createElement(PracticeCard,null) :
                    step==='examList' ? React.createElement(ExamList,null) :
                        step==='examRun' ? React.createElement(ExamRunCard,null) :
                            step==='examDone' ? React.createElement(ExamDone,null) :
                                step==='homeworkResult' ? React.createElement(HomeworkResult,null) :
                                    step==='problemResult' ? React.createElement(ProblemResult,null) :
                                        React.createElement(Home,null))
        ,
        React.createElement(LoadingModal, null),
        (namePromptOpen ? React.createElement('div',{className:'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1300]',
            onClick: (e) => {
                // Only close if clicking on the backdrop itself
                if (e.target === e.currentTarget) {
                    cancelNamePrompt();
                }
            }},
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
        (codePromptOpen ? React.createElement('div',{className:'fixed inset-0 bg-black/30 flex items-center justify-center z-[1000]',
            onClick: (e) => {
                // Only close if clicking on the backdrop itself
                if (e.target === e.currentTarget) {
                    cancelCodePrompt();
                }
            }},
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
