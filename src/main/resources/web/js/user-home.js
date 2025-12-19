// =============================================================================
// 0. 图标和数据 (保持不变)
// =============================================================================
const Svg = ({ children, className }) => (
    React.createElement('svg',{className, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'}, children)
);
const BookOpen = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M2 5h8a3 3 0 013 3v11H5a3 3 0 01-3-3V5z'}), React.createElement('path',{d:'M22 5h-8a3 3 0 00-3 3v11h8a3 3 0 003-3V5z'}));
const Code2 = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M16 18l6-6-6-6'}), React.createElement('path',{d:'M8 6L2 12l6 6'}));
const Crown = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M2 18l2-11 6 4 6-4 2 11'}), React.createElement('path',{d:'M2 18h20'}));
const GitBranch = ({ className }) => React.createElement(Svg,{className}, React.createElement('circle',{cx:'18',cy:'6',r:'3'}), React.createElement('circle',{cx:'6',cy:'18',r:'3'}), React.createElement('path',{d:'M6 21V6a9 9 0 009 9h3'}));
const ArrowRight = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M5 12h14'}), React.createElement('path',{d:'M12 5l7 7-7 7'}));
const Newspaper = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M2 7h18a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V7z'}), React.createElement('path',{d:'M16 3v4'}), React.createElement('path',{d:'M8 11h8'}), React.createElement('path',{d:'M8 15h6'}));
const Terminal = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M4 4h16v16H4z'}), React.createElement('path',{d:'M7 8l3 3-3 3'}), React.createElement('path',{d:'M13 16h4'}));
const Star = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14l-5-4.87 6.91-1.01L12 2z'}));
const Github = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M12 2C7 2 3 6 3 11c0 4 3 7 7 8v-2c-2 0-2-1-3-2 2 0 3-1 3-1-1 0-2-1-2-2 .5 0 1 .2 1 .2 0-1-.7-1.5-1.5-1.8 1-.1 1.5.7 1.5.7.5-.8 1.3-1 2-1s1.5.2 2 1c0 0 .5-.8 1.5-.7-.8.3-1.5.8-1.5 1.8 0 0 .5-.2 1-.2 0 1-1 2-2 2 0 0 1 1 3 1-1 1-1 2-3 2v2c4-1 7-4 7-8 0-5-4-9-9-9z'}));
const Sparkles = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M12 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z'}));
const Menu = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M3 6h18'}), React.createElement('path',{d:'M3 12h18'}), React.createElement('path',{d:'M3 18h18'}));
const Twitter = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83'}));
const Linkedin = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6'}), React.createElement('rect',{x:'2',y:'9',width:'4',height:'12'}), React.createElement('circle',{cx:'4',cy:'4',r:'2'}));
const Mail = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M4 4h16v16H4z'}), React.createElement('path',{d:'M22 6l-10 7L2 6'}));
const Zap = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M13 2L3 14h7l-1 8 11-14h-7l1-6z'}));
const ProSupportIcon = ({ className }) => React.createElement(Svg,{className},
    React.createElement('path',{d:'M7 10a5 5 0 0110 0v3a2 2 0 01-2 2H9a2 2 0 01-2-2v-3z'}),
    React.createElement('path',{d:'M9 10V9a3 3 0 016 0v1'}),
    React.createElement('path',{d:'M9 16v2a3 3 0 003 3h0a3 3 0 003-3v-2'}),
    React.createElement('path',{d:'M4 12v1a3 3 0 003 3'}),
    React.createElement('path',{d:'M20 12v1a3 3 0 01-3 3'}),
    React.createElement('circle',{cx:'10',cy:'13',r:'0.6'}),
    React.createElement('circle',{cx:'14',cy:'13',r:'0.6'}),
    React.createElement('path',{d:'M12 2v2'}),
    React.createElement('path',{d:'M10.5 4.5L12 4l1.5.5'})
);

const features = [
    { id:'articles', icon:BookOpen, title:'文章咨询', description:'获取最新的AI技术文章、行业资讯和最佳实践指南', color:'from-blue-500 to-cyan-500' },
    { id:'platform', icon:Code2, title:'开发平台', description:'强大的开发工具和API接口，快速集成模型能力', color:'from-indigo-500 to-purple-500' },
    { id:'vip', icon:Crown, title:'VIP服务', description:'专属权益：优先支持、定制服务与高级功能', color:'from-amber-500 to-orange-500' },
    { id:'opensource', icon:GitBranch, title:'代码开源', description:'开放源代码，与社区共同构建更好的生态', color:'from-green-500 to-emerald-500' }
];

const SIGNIN_URL = 'http://116.62.120.101:8088/signin';

// =============================================================================
// 1. 辅助工具组件 (必须在被使用前定义)
// =============================================================================
const ImageWithFallback = ({ src, alt, className }) => {
    const { useState } = React;
    const [idx, setIdx] = useState(0);
    const list = [src, '/image/img.png', 'image/img.png', '/web/image/img.png'];
    const current = list[Math.min(idx, list.length-1)];
    return React.createElement('img',{src: current, alt, className, onError:()=>setIdx(i=>i+1)});
};

// =============================================================================
// 2. 头部组件 (必须在 UserHome 前定义)
// =============================================================================
const Header = ({ user, onOpenLogin, onOpenRegister, onLogout, onOpenAgents, openModule, prefetchPrompt, setShowProfile }) => {
    const { useEffect, useState } = React;
    const [agents, setAgents] = useState([]);
    const [loadingAgents, setLoadingAgents] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    
    // 修复个人资料显示问题
    const handleShowProfile = () => {
        console.log('handleShowProfile called');
        console.log('setShowProfile type:', typeof setShowProfile);
        console.log('setShowProfile value:', setShowProfile);
        // 正确调用传入的setShowProfile函数
        if (typeof setShowProfile === 'function') {
            console.log('Calling setShowProfile(true)');
            setShowProfile(true);
        } else {
            console.error('setShowProfile is not a function:', setShowProfile);
        }
    };    
    // 确保 currentUser 对象包含 registrationDate 字段
    useEffect(() => {
        if (user && !user.registrationDate) {
            // 如果用户对象没有 registrationDate，尝试从服务器获取完整用户信息
            const fetchFullUserInfo = async () => {
                try {
                    const response = await fetch('/api/auth/user');
                    const data = await response.json();
                    if (data && data.user && data.user.registrationDate) {
                        // 更新用户对象以包含 registrationDate
                        Object.assign(user, data.user);
                    }
                } catch (error) {
                    console.error('获取完整用户信息失败:', error);
                }
            };
            
            fetchFullUserInfo();
        }
    }, [user]);
    // 确保 currentUser 对象包含 registrationDate 字段
    useEffect(() => {
        if (user && !user.registrationDate) {
            // 如果用户对象没有 registrationDate，尝试从服务器获取完整用户信息
            const fetchFullUserInfo = async () => {
                try {
                    const response = await fetch('/api/auth/user');
                    const data = await response.json();
                    if (data && data.user && data.user.registrationDate) {
                        // 更新用户对象以包含 registrationDate
                        Object.assign(user, data.user);
                    }
                } catch (error) {
                    console.error('获取完整用户信息失败:', error);
                }
            };
            
            fetchFullUserInfo();
        }
    }, [user]);
    useEffect(()=>{
        const fetchAgents = async () => {
            setLoadingAgents(true);
            try {
                const resp = await fetch('/api/tools/active?type=10000', { credentials:'same-origin' });
                const txt = await resp.text(); let data=[]; try{ data=JSON.parse(txt||'[]'); }catch(_){ data=[]; }
                setAgents(Array.isArray(data)?data:[]);
            } catch(_) { setAgents([]); }
            setLoadingAgents(false);
        };
        fetchAgents();
    },[]);
    const isVipUser = !!(user && Number(user.vipLevel)===99);
    const username = (user && (user.nickname||user.username)) || '用户';
    return (
    React.createElement('header',{className:'sticky top-0 z-[60] backdrop-blur-lg bg-white/90 border-b border-slate-100 shadow-sm'},
        React.createElement('div',{className:'max-w-7xl mx-auto px-3 lg:px-6 py-4'},
                React.createElement('div',{className:'flex items-center'},
                React.createElement('div',{className:'flex items-center gap-1 cursor-pointer', onClick:(e)=>{ e.preventDefault(); try{ window.location.assign('/home.html'); }catch(_){ } try{ openModule && openModule(null); }catch(_){ } try{ const el=document.getElementById('features-section'); if(el) el.scrollIntoView({behavior:'smooth', block:'start'}); }catch(_){ } }},
                    React.createElement('div',{className:'w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center'}, React.createElement(Sparkles,{className:'w-5 h-5 text-white'})),
                    React.createElement('span',{className:'text-3xl tracking-tight text-slate-950 font-bold'}, '宙斯')
                ),
                // 🎯 优化 3: 增大导航项间距 gap-8
                React.createElement('div',{className:'hidden md:flex items-center gap-12 relative flex-1 justify-center'}, 
                    React.createElement('div',{className:'relative group'},
                        React.createElement('a',{href:'#',className:'flex items-center gap-2 text-slate-800 font-semibold text-base md:text-lg hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1', onClick:(e)=>{ e.preventDefault(); try{ window.location.assign('/home.html'); }catch(_){ } try{ openModule && openModule(null); }catch(_){ } try{ const el=document.getElementById('features-section'); if(el) el.scrollIntoView({behavior:'smooth', block:'start'}); }catch(_){ } }}, React.createElement(Code2,{className:'w-5 h-5'}),'平台功能'),
                        // 使用 visible/invisible 控制可交互性，避免 pointer-events 切换导致 hover 丢失而无法点击
                        React.createElement('div',{className:'absolute left-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 w-64 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]'},
                            [
                                {name:'核心功能', anchor:'#features-section', icon:Sparkles},
                                {name:'AI资讯', anchor:'#articles-preview', icon:Newspaper},
                                {name:'技术学习', anchor:'#tech-learning', icon:BookOpen},
                                {name:'VIP服务', anchor:'#vip-section', icon:Crown},
                                {name:'代码开源', anchor:'#opensource', icon:GitBranch}
                            ].map((a,i)=>React.createElement('div',{key:i,className:'flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer', onClick:()=>{ 
                                if(a.anchor==='#articles-preview'){ try{ history.pushState({ page:'articles' }, '', '/articles'); }catch(_){ try{ window.location.hash='articles'; }catch(__){} } try{ window.dispatchEvent(new Event('popstate')); }catch(__){} } 
                                else if(a.anchor==='#tech-learning'){ try{ history.pushState({ page:'tech-learning' }, '', '/tech-learning'); }catch(_){ try{ window.location.hash='tech-learning'; }catch(__){} } try{ window.dispatchEvent(new Event('popstate')); }catch(__){} }
                                else { const el=document.querySelector(a.anchor); if(el) el.scrollIntoView({behavior:'smooth', block:'start'}); } 
                            }},
                                React.createElement(a.icon,{className:'w-5 h-5 text-slate-700'}),
                                React.createElement('span',{className:'text-slate-900 font-medium'}, a.name)
                            ))
                        ) 
                    ),
                    React.createElement('a',{href:'#',className:'flex items-center gap-2 text-slate-800 font-semibold text-base md:text-lg hover:text-indigo-600 transition-colors border-b-2 border-transparent hover:border-indigo-600 pb-1', onClick:(e)=>{ e.preventDefault(); try{ if(String(window.location.pathname||'').endsWith('/home.html')){ window.location.hash = 'tools'; if(openModule) openModule('tools'); } else { window.location.assign('/home.html#tools'); } }catch(_){ } try{ const el=document.getElementById('tools-page'); if(el) el.scrollIntoView({behavior:'smooth', block:'start'}); }catch(_){ } }}, React.createElement(Terminal,{className:'w-5 h-5'}),'工具合集'),
                    React.createElement('a',{href:'#',className:'text-slate-800 font-semibold text-base md:text-lg hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1', onClick:(e)=>{ e.preventDefault(); try{ window.location.hash = 'model'; openModule && openModule('model'); }catch(_){ } }}, '模型服务'),
                    React.createElement('a',{href:'#',className:'text-slate-800 font-semibold text-base md:text-lg hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1', onClick:(e)=>{ e.preventDefault(); try{ window.location.assign('/mcp/index.html'); }catch(_){ } }}, 'MCP'),
                    React.createElement('a',{href:'#',className:'text-slate-800 font-semibold text-base md:text-lg hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1', onMouseEnter:()=>{ try{ prefetchPrompt && prefetchPrompt(); }catch(_){ } }, onClick:(e)=>{ e.preventDefault(); try{ history.pushState({ page:'prompt-engineering' }, '', '/prompt-engineering'); }catch(_){ try{ window.location.hash = 'prompt-engineering'; }catch(__){} } try{ prefetchPrompt && prefetchPrompt(); }catch(_){ } try{ openModule && openModule('prompt-engineering'); }catch(_){ } try{ const el=document.getElementById('prompt-engineering-page'); if(el) el.scrollIntoView({behavior:'smooth', block:'start'}); }catch(_){ } }}, 'Prompt工程'),
                    React.createElement('div',{className:'relative group'},
                        React.createElement('a',{href:'#',className:'flex items-center gap-2 text-slate-800 font-semibold text-base md:text-lg hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1', onClick:(e)=>{ e.preventDefault(); try{ onOpenAgents && onOpenAgents(); }catch(_){ } }}, React.createElement(Star,{className:'w-5 h-5'}),'三方AI平台'),
                        // 同上：避免 pointer-events 切换导致下拉菜单无法点击
                        React.createElement('div',{className:'absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 w-80 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]'},
                            (loadingAgents ? [1,2,3].map((i)=>React.createElement('div',{key:i,className:'h-8 bg-slate-100 rounded animate-pulse mb-2'}))
                            : agents.map((a,i)=>React.createElement('div',{key:i,className:'flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-50 cursor-pointer', onClick:()=>{
                                    const isVipTool = String(a.vipAllow||'').toUpperCase()==='VIP';
                                    if(isVipTool && !isVipUser){ alert('该工具为VIP99专享，请升级为VIP后使用'); return; }
                                    const url = a.apiPath || a.url; if(url) window.open(url,'_blank');
                                }},
                                React.createElement(ImageWithFallback,{src:a.iconUrl, alt:a.toolName, className:'w-6 h-6 rounded'}),
                                React.createElement('span',{className:'text-slate-900 font-medium flex items-center gap-2'}, a.toolName, (String(a.vipAllow||'').toUpperCase()==='VIP' ? React.createElement(Crown,{className:'w-4 h-4 text-amber-500'}) : null)),
                                React.createElement(ArrowRight,{className:'w-4 h-4 text-slate-400 ml-auto'})
                            )))
                        )
                    )
                ),
                React.createElement('div',{className:'flex items-center gap-4 ml-auto'},
                    user ? (
                        React.createElement('div',{className:'relative'},
                            React.createElement('div',{className:'flex items-center gap-2 cursor-pointer mr-4', onClick:()=>setUserMenuOpen(v=>!v)},
                                React.createElement('div',{className:'w-8 h-8 rounded-full overflow-hidden border-2 relative', style:{ borderColor: isVipUser ? '#FFD700' : '#D1D5DB' }},
                                    isVipUser && React.createElement('div', {className:'absolute inset-0 rounded-full', style:{ boxShadow: '0 0 10px rgba(255,215,0,0.8), 0 0 20px rgba(255,215,0,0.6)', zIndex: -1 }}),
                                    user ? (
                                        React.createElement('img', {
                                            src: user.avatar || (isVipUser ? '/image/头像4.jpeg' : ['/image/头像1.png', '/image/头像2.jpeg', '/image/头像3.jpeg'][Math.floor(Math.random() * 3)]),
                                            alt: '用户头像',
                                            className: 'w-full h-full object-cover',
                                            onError: (e) => { 
                                                // 根据用户VIP状态选择不同的备用头像
                                                if (isVipUser) {
                                                    e.target.src = '/image/头像4.jpeg';
                                                } else {
                                                    // 非VIP用户尝试其他头像文件
                                                    const avatarFiles = ['/image/头像1.png', '/image/头像2.jpeg', '/image/头像3.jpeg'];
                                                    e.target.src = avatarFiles[Math.floor(Math.random() * avatarFiles.length)];
                                                }
                                                e.target.onerror = () => { e.target.src = '/image/default-avatar.png'; };
                                            },
                                            style: { display: 'block', width: '100%', height: '100%', objectFit: 'cover' }
                                        })
                                    ) : (
                                        React.createElement('div', {className: 'bg-gray-200 border-2 border-dashed rounded-xl w-full h-full'})
                                    )
                                ),
                                isVipUser && React.createElement('span',{className:'text-xs font-bold', style:{ background:'linear-gradient(45deg, #FFD700, #FFA500)', boxShadow:'0 0 15px rgba(255,215,0,0.6)', borderRadius:'50px', padding:'3px 10px', color:'#000' }},
                                    React.createElement('span',{className:'inline-flex items-center gap-1'}, React.createElement(Crown,{className:'w-3 h-3'}), 'VIP 99')
                                )
                            ),
                            userMenuOpen && React.createElement('div',{className:'absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 transition-opacity'},
                                React.createElement('div',{className:'px-3 py-2 text-sm font-semibold text-slate-800'}, username),
                                React.createElement('div',{className:'border-t border-slate-100 my-1'}),
                                React.createElement('button',{className:'block w-full text-left px-3 py-2 text-slate-700 hover:bg-blue-50 rounded-md', onClick: () => {
                                    // 关闭用户菜单
                                    setUserMenuOpen(false);
                                    // 显示个人资料页面
                                    if (typeof setShowProfile === 'function') {
                                        setShowProfile(true);
                                    }
                                }}, '个人资料'),                                React.createElement('button',{className:'block w-full text-left px-3 py-2 text-slate-700 hover:bg-blue-50 rounded-md'}, '设置'),
                                                                                                React.createElement('button',{className:'block w-full text-left px-3 py-2 text-pink-500 font-bold hover:bg-pink-50 rounded-md animate-bounce', onClick:()=>{
                                    // 显示鼓励模态框
                                    const showDonationModal = () => {
                                        // 创建模态框背景
                                        const backdrop = document.createElement('div');
                                        backdrop.style.position = 'fixed';
                                        backdrop.style.inset = '0';
                                        backdrop.style.background = 'rgba(0,0,0,.35)';
                                        backdrop.style.zIndex = '1350';
                                        backdrop.style.display = 'flex';
                                        backdrop.style.alignItems = 'center';
                                        backdrop.style.justifyContent = 'center';
                                        backdrop.style.padding = '16px';
                                        
                                        // 创建模态框主体
                                        const box = document.createElement('div');
                                        box.style.width = '88vw';
                                        box.style.maxWidth = '420px';
                                        box.style.background = '#fff';
                                        box.style.borderRadius = '14px';
                                        box.style.boxShadow = '0 20px 44px rgba(2,6,23,.18)';
                                        box.style.overflow = 'hidden';
                                        backdrop.appendChild(box);
                                        
                                        // 添加模态框内容
                                        box.innerHTML = `
                                          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#0ea5e9;color:#fff;font-weight:700">
                                            <span>是否资助 UP 主</span>
                                            <button id="don-x" style="padding:8px 12px;border-radius:10px;background:#eef2ff;color:#334155">关闭</button>
                                          </div>
                                          <div id="don-body" style="padding:16px;color:#0f172a">点击确认后，将展示微信与支付宝收款码,一分也是爱。</div>
                                          <div style="display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid #e2e8f0">
                                            <button id="don-c" style="padding:8px 12px;border-radius:10px;background:#eef2ff;color:#334155;font-weight:600">取消</button>
                                            <button id="don-ok" style="padding:8px 12px;border-radius:10px;background:#2563eb;color:#fff;font-weight:600">确认</button>
                                          </div>
                                        `;
                                        
                                        document.body.appendChild(backdrop);
                                        
                                        // 添加关闭事件
                                        const close = () => { 
                                            try { 
                                                document.body.removeChild(backdrop); 
                                            } catch(e) {}
                                        };
                                        
                                        box.querySelector('#don-x').onclick = close;
                                        box.querySelector('#don-c').onclick = close;
                                        backdrop.addEventListener('click', (e) => { 
                                            if (e.target === backdrop) close(); 
                                        });
                                        
                                        // 确认按钮事件
                                        box.querySelector('#don-ok').onclick = async () => {
                                            const body = box.querySelector('#don-body');
                                            const w = '/image/weixin.png';
                                            const a = '/image/zhifubao.jpg';
                                            body.innerHTML = `
                                              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                                                <div style="border:1px solid #e2e8f0;border-radius:12px;padding:8px">
                                                  <div style="font-weight:700;color:#0f172a;margin-bottom:6px">微信收款码</div>
                                                  <img src="${w}" alt="微信收款码" style="width:100%;aspect-ratio:1/1;object-fit:contain;border-radius:10px;background:#f8fafc"/>
                                                </div>
                                                <div style="border:1px solid #e2e8f0;border-radius:12px;padding:8px">
                                                  <div style="font-weight:700;color:#0f172a;margin-bottom:6px">支付宝收款码</div>
                                                  <img src="${a}" alt="支付宝收款码" style="width:100%;aspect-ratio:1/1;object-fit:contain;border-radius:10px;background:#f8fafc"/>
                                                </div>
                                              </div>
                                              <div style="font-size:12px;color:#475569;margin-top:4px">感谢您的支持！长按保存后在对应 App 识别。</div>
                                            `;
                                        };
                                    };
                                    
                                    showDonationModal();
                                }}, '鼓励'),
                                React.createElement('button',{className:'block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md', onClick:()=>{ if(confirm('确定要退出登录吗？')){ onLogout(); try{ window.location.href='/index.html'; }catch(_){ } alert('已退出登录'); } }}, '登出')
                            )
                        )
                    ) : (
                        React.createElement(React.Fragment,null,
                            React.createElement('button',{className:'hidden md:block px-4 py-2 text-slate-700 font-medium hover:text-blue-600 transition-colors', onClick:onOpenLogin}, '登录'),
                            React.createElement('button',{className:'px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all font-semibold hover:from-blue-700 hover:to-indigo-700', onClick:onOpenRegister}, '免费注册')
                        )
                    ),
                    React.createElement('button',{className:'md:hidden p-2'}, React.createElement(Menu,{className:'w-6 h-6 text-slate-700'}))
                )
            )
        )
    ))
};

// =============================================================================
// 3. 英雄区组件 (必须在 UserHome 前定义)
// =============================================================================
const HeroSection = ({ onOpenRegister, onOpenLogin }) => (
    // 🎯 优化 2: 增加留白 pt-20 pb-32
    React.createElement('section',{className:'relative pt-20 pb-32 px-6 overflow-hidden bg-white'},
        React.createElement('div',{className:'absolute inset-0 pointer-events-none'},
            React.createElement('div',{className:'absolute top-[-50px] right-[-50px] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10'}),
            React.createElement('div',{className:'absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10'}),
        ),
        React.createElement('div',{className:'max-w-7xl mx-auto relative z-10'},
            React.createElement('div',{className:'grid lg:grid-cols-2 gap-12 items-center'}, // 🎯 优化 2: 增大 gap-12
                React.createElement('div',{className:'space-y-8'}, // 🎯 优化 2: 增大 space-y-8
                    React.createElement('div',{className:'inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-semibold'}, React.createElement(Zap,{className:'w-4 h-4'}), React.createElement('span',{className:'text-sm'},'国内首个个人AI大模型平台')),
                    React.createElement('h1',{className:'text-5xl md:text-6xl tracking-tight text-slate-900 font-extrabold'}, '大模型应用平台', React.createElement('br'), React.createElement('span',{className:'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'}, '赋能智能未来')),
                    React.createElement('p',{className:'text-lg md:text-xl text-slate-600 leading-relaxed'}, '领先的人工智能大语言模型平台，为开发者和企业提供强大的AI能力。'),
                    React.createElement('div',{className:'flex flex-wrap gap-4'},
                        React.createElement('button',{className:'px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:-translate-y-0.5 flex items-center gap-2', onClick:()=>window.open(SIGNIN_URL,'_blank')}, '立即体验', React.createElement(ArrowRight,{className:'w-5 h-5'})),
                        React.createElement('button',{className:'px-8 py-4 bg-white text-slate-700 rounded-xl border-2 border-slate-300 hover:border-blue-600 transition-all font-medium', onClick:()=>window.open('https://agijuejin.feishu.cn/wiki/UvJPwhfkiitMzhkhEfycUnS9nAm','_blank')}, '查看文档')
                    ),
                    React.createElement('div',{className:'flex items-center gap-8 pt-4'},
                        React.createElement('div',null, React.createElement('div',{className:'text-3xl text-slate-900 font-bold'}, 'X+'), React.createElement('div',{className:'text-sm text-slate-600'}, '企业用户')),
                        React.createElement('div',{className:'w-px h-12 bg-slate-300'}),
                        React.createElement('div',null, React.createElement('div',{className:'text-3xl text-slate-900 font-bold'}, 'X+'), React.createElement('div',{className:'text-sm text-slate-600'}, '开发者')),
                        React.createElement('div',{className:'w-px h-12 bg-slate-300'}),
                        React.createElement('div',null, React.createElement('div',{className:'text-3xl text-slate-900 font-bold'}, '99.9%'), React.createElement('div',{className:'text-sm text-slate-600'}, '可用性'))
                    )
                ),
                React.createElement('div',{className:'relative'},
                    React.createElement('div',{className:'relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/30 transform hover:scale-[1.01] transition-transform duration-500 border-4 border-white'},
                        React.createElement(ImageWithFallback,{src:'https://images.unsplash.com/photo-1717501219184-c3fc77f501c3?auto=format&fit=crop&w=1080&q=80', alt:'AI Technology', className:'w-full h-auto'}),
                        React.createElement('div',{className:'absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent'})
                    )
                )
            )
        )
    )
);

// =============================================================================
// 4. 页脚组件 (必须在 UserHome 前定义)
// =============================================================================
const Footer = () => (
    // 🎯 优化 2: 增加留白 py-16
    React.createElement('footer',{className:'bg-slate-900 text-slate-300 py-16 px-6'},
        React.createElement('div',{className:'max-w-7xl mx-auto'},
            // 🎯 优化 2: 增加留白 gap-12 mb-12
            React.createElement('div',{className:'grid md:grid-cols-4 gap-12 mb-12'},
                React.createElement('div',{className:'md:col-span-1'},
                    React.createElement('div',{className:'flex items-center gap-2 mb-4'}, React.createElement('div',{className:'w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center'}, React.createElement(Sparkles,{className:'w-5 h-5 text-white'})), React.createElement('span',{className:'text-lg text-white font-bold'}, '云杉大模型')),
                    React.createElement('p',{className:'text-sm text-slate-400 mb-4'}, '赋能智能未来，让AI触手可及'),
                    // 🎯 优化 1: 社交链接在新标签页打开
                    React.createElement('div',{className:'flex items-center gap-3'},
                        React.createElement('a',{href:'#',className:'w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors', target:'_blank'}, React.createElement(Github,{className:'w-4 h-4'})),
                        React.createElement('a',{href:'#',className:'w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors', target:'_blank'}, React.createElement(Twitter,{className:'w-4 h-4'})),
                        React.createElement('a',{href:'#',className:'w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors', target:'_blank'}, React.createElement(Linkedin,{className:'w-4 h-4'})),
                        React.createElement('a',{href:'#',className:'w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors', target:'_blank'}, React.createElement(Mail,{className:'w-4 h-4'}))
                    )
                ),
                React.createElement('div',null,
                    React.createElement('h4',{className:'text-white font-semibold mb-4'}, '产品'),
                    React.createElement('ul',{className:'space-y-2 text-sm'},
                        // 内部锚点跳转不需要新页面
                        ['文章咨询','开发平台','VIP服务','代码开源'].map((t,i)=>React.createElement('li',{key:i}, i===0
                            ? React.createElement('a',{href:'#',className:'hover:text-white transition-colors', onClick:(e)=>{ e.preventDefault(); try{ history.pushState({ page:'articles' }, '', '/articles'); }catch(_){ try{ window.location.hash='articles'; }catch(__){} } try{ window.dispatchEvent(new Event('popstate')); }catch(__){} }}, t)
                            : React.createElement('a',{href:`#${['articles-preview','platform','vip-section','opensource'][i]}`,className:'hover:text-white transition-colors'}, t)))
                    )
                ),
                React.createElement('div',null,
                    React.createElement('h4',{className:'text-white font-semibold mb-4'}, '资源'),
                    React.createElement('ul',{className:'space-y-2 text-sm'},
                        // 🎯 优化 1: 资源链接在新标签页打开
                        ['开发文档','API参考','使用教程','社区论坛'].map((t,i)=>React.createElement('li',{key:i}, React.createElement('a',{href:'#',className:'hover:text-white transition-colors', target:'_blank'}, t)))
                    )
                ),
                React.createElement('div',null,
                    React.createElement('h4',{className:'text-white font-semibold mb-4'}, '公司'),
                    React.createElement('ul',{className:'space-y-2 text-sm'},
                        ['关于我们','加入我们','联系我们','隐私政策'].map((t,i)=>React.createElement('li',{key:i}, React.createElement('a',{href:'#',className:'hover:text-white transition-colors'}, t)))
                    )
                )
            ),

            React.createElement('section',{id:'aggregate-section', className:'py-24 px-6 max-w-7xl mx-auto bg-white'},
                React.createElement('div',{className:'text-center mb-12'},
                    React.createElement('h2',{className:'text-4xl tracking-tight text-slate-900 mb-4 font-extrabold'}, '平台功能聚合'),
                    React.createElement('p',{className:'text-lg text-slate-600'}, '统一入口，按需打开模块')
                ),
                React.createElement('div',{className:'grid md:grid-cols-4 gap-8'},
                    [
                        {title:'工具合集', key:'tools'},
                        {title:'模型服务', key:'model'},
                        {title:'MCP', key:'mcp'},
                        {title:'Prompt工程', key:'prompt-engineering'}
                    ].map((c,i)=>React.createElement('div',{key:i,className:'bg-white rounded-2xl p-8 shadow-xl border hover:shadow-2xl transition cursor-pointer', onClick:()=>{ if(c.key==='prompt-engineering'){ try{ history.pushState({ page:'prompt-engineering' }, '', '/prompt-engineering'); }catch(_){ try{ window.location.hash='prompt-engineering'; }catch(__){} } setShowModule(null); setActivePage('prompt-engineering'); } else { try{ window.location.hash = c.key; }catch(_){ } setShowAgents(c.key==='mcp')||setShowModule(c.key); } }},
                        React.createElement('div',{className:'text-xl font-semibold text-slate-900'}, c.title),
                        React.createElement('p',{className:'text-slate-600 text-sm mt-2'}, '点击打开')
                    ))
                )
            ),

            showModule && React.createElement('div',{className:'fixed inset-0 z-[950] bg-black/60 flex items-center justify-center p-4', onClick:()=>{ setShowModule(null); }},
                React.createElement('div',{className:'bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden', onClick:(e)=>e.stopPropagation()},
                    React.createElement('div',{className:'p-6 space-y-4'},
                        React.createElement('div',{className:'text-xl font-bold text-slate-900'},
                            showModule==='tools'?'工具合集':showModule==='model'?'模型服务':showModule==='mcp'?'MCP':showModule==='dba'?'SQL 智能生成与执行助手':'Prompt工程'
                        ),
                        (showModule==='tools' && (window.Components&&window.Components.UserToolsExplorer) ? React.createElement(window.Components.UserToolsExplorer, { currentUser }) : null),
                        (showModule==='model' && (window.Components&&window.Components.ModelUI) ? React.createElement(window.Components.ModelUI) : null),
                        (showModule==='mcp' && (window.Components&&window.Components.MCPUI) ? React.createElement(window.Components.MCPUI, { currentUser }) : null),
                        (showModule==='prompt' && (window.Components&&window.Components.PromptUI) ? React.createElement(window.Components.PromptUI) : null),
                        (showModule==='dba' && (window.Components&&window.Components.SqlDbaUI) ? React.createElement(window.Components.SqlDbaUI) : null)
                    ),
                    React.createElement('div',{className:'px-6 pb-6 text-right'}, React.createElement('button',{className:'px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200', onClick:()=>setShowModule(null)}, '关闭'))
                )
            ),
            // 🎯 优化 2: 增加留白 pt-8
            React.createElement('div',{id:'footer-copyright', className:'pt-12 border-t border-slate-800 text-center'},
                React.createElement('p',{className:'text-sm text-white'}, '© 2025 TonyWu AI 平台. All rights reserved.'),
                React.createElement('p',{className:'text-sm text-slate-300 mt-1'}, '让智能赋能每个人 · 共建可信AI新纪元')
            )
        )
    )
);

const ArticleContent = ({ detail }) => {
  const fmt = String((detail && detail.contentFormat) || '').toUpperCase();
  let c = (detail && (detail.content ?? detail.summary ?? detail.text ?? '')) || '';
  if (typeof c !== 'string') { try { c = JSON.stringify(c, null, 2); } catch(_) { c = String(c||''); } }
  if (!c || String(c).trim().length === 0) { c = '暂无内容'; }
  const looksHtml = /<[^>]+>/.test(c||'');
  if (fmt === 'HTML' || looksHtml) {
    return React.createElement('div',{className:'text-slate-800', dangerouslySetInnerHTML:{__html:c}});
  }
  return React.createElement('pre',{className:'whitespace-pre-wrap break-words text-slate-800'}, c);
};

const ArticlesPage = () => {
  const { useEffect, useState, useMemo } = React;
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [active, setActive] = useState(null);
  const [detail, setDetail] = useState(null);
  const [cache, setCache] = useState({});

  const params = () => new URLSearchParams(String(window.location.search||''));
  const currentId = useMemo(()=>{ const p=params(); return p.get('id')||null; }, [window.location.search]);
  const currentSlug = useMemo(()=>{ const p=params(); return p.get('slug')||null; }, [window.location.search]);

  const fetchList = async (target=0, append=false) => {
    setLoading(true); setError('');
    try {
      const r = await fetch(`/api/articles?page=${target}&size=${size}`, { credentials:'same-origin' });
      const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
      const arr = Array.isArray(d.content) ? d.content : (Array.isArray(d) ? d : []);
      const tp = Number.isFinite(d.totalPages) ? d.totalPages : (arr.length<size ? target+1 : target+2);
      setList(prev => append ? [...prev, ...arr] : arr);
      setPage(target); setHasMore((target+1)<tp && arr.length>0);
    } catch(e){ setError('加载失败'); if(!append) setList([]); setHasMore(false); }
    setLoading(false);
  };

  const normalize = (d) => { try{ if(d && typeof d==='object'){ if(d.data) d=d.data; else if(d.result) d=d.result; else if(d.article) d=d.article; } }catch(_){ } return d; };
  const tryFetch = async (url) => { const r=await fetch(url,{credentials:'same-origin',cache:'no-store'}); const t=await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; } d=normalize(d); return d; };

  const openByItem = async (item) => {
    if(!item) return;
    setActive(item);
    const push = () => { const q = new URLSearchParams(); if(item.id) q.set('id', item.id); else if(item.slug) q.set('slug', item.slug); history.pushState({ page:'articles', id:item.id, slug:item.slug }, '', `/articles?${q.toString()}`); };
    try{ push(); }catch(_){ try{ window.location.hash='articles'; }catch(__){} }
    const key = item.id || item.slug || item.title;
    const cached = key ? cache[key] : null;
    if (cached && (cached.content || cached.summary || cached.text)) { setDetail(cached); return; }
    let d=null;
    try {
      if(item.toolId){ d = await tryFetch(`/api/tools/${encodeURIComponent(item.toolId)}?t=${Date.now()}`); }
      if(item.id && (!d || !d.content)){ d = await tryFetch(`/api/articles?id=${encodeURIComponent(item.id)}&t=${Date.now()}`); }
      if(item.slug && (!d || !d.content)){ d = await tryFetch(`/api/articles/${encodeURIComponent(item.slug)}?t=${Date.now()}`); }
      if(item.id && (!d || !d.content)){ d = await tryFetch(`/api/articles/admin/${encodeURIComponent(item.id)}?t=${Date.now()}`); }
    } catch(_){ d=null; }
    if(!d || (!d.content && !d.summary && !d.text)){
      if(item.content){ d = { title:item.title, createdAt:item.createdAt, content:item.content, contentFormat:'HTML' }; }
      else if(item.summary){ d = { title:item.title, createdAt:item.createdAt, content:item.summary, contentFormat:'HTML' }; }
    }
    const finalD = (d && (d.content || d.summary || d.text)) ? { title:d.title||item.title||'文章详情', createdAt:d.createdAt||item.createdAt, content:d.content||d.summary||d.text, contentFormat:d.contentFormat, text:d.text } : { title:item.title||'文章详情', createdAt:item.createdAt, content:'加载失败，请稍后重试' };
    setDetail(finalD); if(key) setCache(prev=>({ ...prev, [key]: finalD }));
  };

  const openByQuery = async () => {
    const id = currentId; const slug = currentSlug;
    if (!id && !slug && list.length>0) { openByItem(list[0]); return; }
    let item = null;
    try { item = list.find(x => (id && String(x.id)===String(id)) || (slug && String(x.slug)===String(slug))); } catch(_) {}
    if (!item) {
      try {
        let d=null;
        if(id){ d = await tryFetch(`/api/articles/admin/${encodeURIComponent(id)}?t=${Date.now()}`); }
        if(!d && slug){ d = await tryFetch(`/api/articles/${encodeURIComponent(slug)}?t=${Date.now()}`); }
        if(d) item = d;
      } catch(_){ }
    }
    if(item) openByItem(item);
  };

  useEffect(()=>{ fetchList(0,false); },[]);
  useEffect(()=>{ if(list.length>0) openByQuery(); },[list]);
  useEffect(()=>{ const onPop = () => { openByQuery(); }; window.addEventListener('popstate', onPop); return ()=>window.removeEventListener('popstate', onPop); }, []);

  const idx = useMemo(()=>{ try{ return list.findIndex(x => active && (x.id===active.id || x.slug===active.slug)); }catch(_){ return -1; } }, [list, active]);
  const goPrev = () => { if(idx>0) openByItem(list[idx-1]); };
  const goNext = () => { if(idx>=0 && idx<list.length-1) openByItem(list[idx+1]); };

  return (
    React.createElement('section',{className:'min-h-[60vh] py-6 px-3 md:px-6'},
      React.createElement('div',{className:'max-w-7xl mx-auto grid grid-cols-12 gap-6'},
        React.createElement('aside',{className:'col-span-12 md:col-span-3'},
          React.createElement('div',{className:'bg-white border rounded-xl shadow overflow-hidden h-[70vh] md:h-[80vh] flex flex-col'},
            React.createElement('div',{className:'px-4 py-3 border-b text-blue-700 font-bold'}, '文章列表'),
            React.createElement('div',{className:'flex-1 overflow-auto'},
              loading ? React.createElement('div',{className:'p-3 text-slate-500'}, '加载中...')
              : (list||[]).map(a => React.createElement('div',{key:a.id, className:'px-4 py-2 border-b hover:bg-blue-50 cursor-pointer text-sm flex items-center gap-2', onClick:()=>openByItem(a)},
                  React.createElement('span',{className:'truncate flex-1'}, a.title),
                  React.createElement('span',{className:'text-slate-400 text-xs'}, a.authorName||'')
                ))
            ),
            React.createElement('div',{className:'flex items-center justify-between px-4 py-2 border-t'},
              React.createElement('button',{className:'px-3 py-1 bg-slate-100 rounded text-slate-700 hover:bg-slate-200 disabled:opacity-50', disabled:page===0, onClick:()=>fetchList(Math.max(0,page-1), false)}, '上一页'),
              React.createElement('button',{className:'px-3 py-1 bg-slate-100 rounded text-slate-700 hover:bg-slate-200 disabled:opacity-50', disabled:!hasMore, onClick:()=>fetchList(page+1, false)}, '下一页')
            )
          )
        ),
        React.createElement('main',{className:'col-span-12 md:col-span-9'},
          React.createElement('div',{className:'bg-white border rounded-xl shadow overflow-hidden min-h-[70vh] md:min-h-[80vh]'},
            React.createElement('div',{className:'px-6 py-4 border-b flex items-center justify-between'},
              React.createElement('h2',{className:'text-2xl font-extrabold text-slate-900 truncate'}, (detail && detail.title) || (active && active.title) || '文章详情'),
              React.createElement('div',{className:'flex items-center gap-2'},
                React.createElement('button',{className:'px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200', onClick:()=>{ try{ const prev = document.referrer||''; if(prev.includes('/home.html')) { history.back(); } else { window.location.assign('/home.html#articles-preview'); } } catch(_){ window.location.assign('/home.html#articles-preview'); } }}, '返回'),
                React.createElement('button',{className:'px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:opacity-50', disabled:idx<=0, onClick:goPrev}, '上一篇'),
                React.createElement('button',{className:'px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:opacity-50', disabled:idx<0 || idx>=list.length-1, onClick:goNext}, '下一篇')
              )
            ),
            error && React.createElement('div',{className:'px-6 py-2 text-red-600 text-sm'}, error),
            React.createElement('div',{className:'px-6 py-3 text-slate-500 text-sm'}, (detail && detail.createdAt) ? new Date(detail.createdAt).toLocaleString() : ''),
            React.createElement('div',{className:'px-6 py-6'}, detail ? React.createElement(ArticleContent,{detail}) : React.createElement('div',{className:'text-slate-500'}, '请选择左侧文章'))
          )
        )
      )
    )
  );
};



// =============================================================================
// 3. 智能客服组件（浮动按钮 + 弹窗）
// =============================================================================
const SupportChat = () => {
    const { useState, useRef, useEffect } = React;
    const [open, setOpen] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role:'assistant', content:'您好，我是智能客服。可以为您提供以下帮助：\n- 了解平台核心功能\n- 查找工具合集分类\n- 咨询VIP权益与服务\n- 反馈问题与建议' },
        { role:'assistant', content:'您可以直接输入问题，或点击下方快捷话术。' }
    ]);
    const bottomRef = useRef(null);
    useEffect(()=>{ try{ bottomRef.current && bottomRef.current.scrollIntoView({behavior:'smooth'}); }catch(_){ } }, [messages, open]);
    useEffect(()=>{ try{ window.__supportChatMounted = true; }catch(_){ } }, []);
    useEffect(()=>{
        try {
            if (document.getElementById('sc-style')) return;
            const s = document.createElement('style');
            s.id = 'sc-style';
            s.textContent = "@keyframes sc-blink{0%,45%,100%{opacity:1}46%,48%{opacity:0}}@keyframes sc-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}@keyframes sc-breathe{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.12);opacity:.2}}@keyframes sc-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px) scale(1.03)}}@keyframes vipPulse{0%{box-shadow:0 0 15px rgba(255,215,0,0.8),0 0 25px rgba(255,215,0,0.6)}50%{box-shadow:0 0 20px rgba(255,215,0,0.9),0 0 35px rgba(255,215,0,0.7)}100%{box-shadow:0 0 15px rgba(255,215,0,0.8),0 0 25px rgba(255,215,0,0.6)}}.sc-bot{animation:sc-float 6s ease-in-out infinite}.sc-eye{animation:sc-blink 4s infinite}.sc-pulse{animation:sc-breathe 1.8s ease-in-out infinite}.sc-bounce{animation:sc-bounce 1.6s ease-in-out infinite}.vip-glow{animation:vipPulse 2s ease-in-out infinite}";
            document.head.appendChild(s);
        } catch(_) {}
    }, []);

    const send = async () => {
        const text = String(input||'').trim();
        if (!text) return;
        const pendingId = Date.now();
        setMessages(prev => [...prev, { role:'user', content:text }, { role:'assistant', content:'', thinking:true, id: pendingId }]);
        setInput('');
        try {
            const r = await fetch('/api/open/chat', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ prompt: text }) });
            const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
            const reply = (d && typeof d.response==='string') ? d.response : (d.message || '未获取到回复');
            setMessages(prev => prev.map(m => (m.thinking && m.id===pendingId) ? { ...m, content: reply, thinking:false } : m));
        } catch(_) {
            setMessages(prev => prev.map(m => (m.thinking && m.id===pendingId) ? { ...m, content: '网络异常，请稍后重试', thinking:false } : m));
        }
    };
    const quick = async (text) => {
        const pendingId = Date.now();
        setMessages(prev => [...prev, { role:'user', content:text }, { role:'assistant', content:'', thinking:true, id: pendingId }]);
        try {
            const r = await fetch('/api/open/chat', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ prompt: text }) });
            const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
            const reply = (d && typeof d.response==='string') ? d.response : (d.message || '未获取到回复');
            setMessages(prev => prev.map(m => (m.thinking && m.id===pendingId) ? { ...m, content: reply, thinking:false } : m));
        } catch(_) {
            setMessages(prev => prev.map(m => (m.thinking && m.id===pendingId) ? { ...m, content: '网络异常，请稍后重试', thinking:false } : m));
        }
    };

    return (
        React.createElement(React.Fragment, null,
            (!open) && React.createElement('button', { className:'fixed right-6 top-1/2 -translate-y-1/2 z-[1300] w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-[0_12px_30px_rgba(56,189,248,0.35)] hover:brightness-110 grid place-items-center relative sc-bounce', onClick:()=>setOpen(true), 'aria-label':'打开AI客服' },
                React.createElement(ProSupportIcon,{className:'w-6 h-6 sc-bot'}),
                React.createElement('span',{className:'absolute inset-0 rounded-full border-2 border-cyan-300 sc-pulse'}),
                React.createElement('span',{className:'absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-400 animate-ping'})
            ),
            open && React.createElement('div', { className: fullscreen ? 'fixed inset-0 z-[1300] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4' : '' },
                React.createElement('div', { className:(fullscreen ? 'w-full max-w-5xl h-[92vh] max-h-[900px] rounded-2xl' : 'fixed right-6 top-1/2 -translate-y-1/2 z-[1300] w-80 md:w-96 h-[28rem] rounded-2xl') + ' bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col' },
                React.createElement('div', { className:'flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white' },
                    React.createElement('div', { className:'font-semibold text-slate-900' }, 'AI客服'),
                    React.createElement('div', { className:'flex items-center gap-2' },
                        React.createElement('button', { id:'support-chat-fullscreen', className:'px-3 py-1 rounded bg-white/15 text-white hover:bg-white/25', onClick:()=>setFullscreen(f=>!f), title:'切换全屏' }, fullscreen?'退出全屏':'全屏'),
                        React.createElement('button', { className:'px-2 py-1 rounded bg-white/15 text-white hover:bg-white/25', onClick:()=>{ setOpen(false); setFullscreen(false); } }, '关闭')
                    )
                ),
                React.createElement('div', { className:'flex-1 min-h-0 p-3 overflow-auto space-y-3 bg-slate-50/60' },
                    messages.map((m,i)=>{
                        const isAssistant = m.role === 'assistant';
                        const avatar = isAssistant
                            ? React.createElement('div', { className:'w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white flex items-center justify-center text-[10px] font-extrabold flex-shrink-0' }, 'AI')
                            : React.createElement('div', { className:'w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-extrabold flex-shrink-0' }, '我');

                        const body = m.thinking
                            ? React.createElement('div',{className:'flex items-center gap-2'},
                                React.createElement('svg',{className:'animate-spin h-4 w-4 ' + (isAssistant ? 'text-blue-600' : 'text-white'), viewBox:'0 0 24 24'},
                                    React.createElement('circle',{className:'opacity-25', cx:'12', cy:'12', r:'10', stroke:'currentColor', strokeWidth:'4'}),
                                    React.createElement('path',{className:'opacity-75', fill:'currentColor', d:'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'})
                                ),
                                '正在思考…'
                            )
                            : React.createElement('div', { className:'whitespace-pre-wrap break-words' }, m.content);

                        return React.createElement('div', { key:i, className:'flex items-end gap-2 ' + (isAssistant ? '' : 'justify-end') },
                            isAssistant ? avatar : null,
                            React.createElement('div', { className:'max-w-[78%] ' + (isAssistant ? '' : 'text-right') },
                                React.createElement('div', { className:'text-[10px] text-slate-400 mb-1 ' + (isAssistant ? '' : 'text-right') }, isAssistant ? 'AI客服' : '我'),
                                React.createElement('div', { className:(isAssistant ? 'bg-white text-slate-800 border border-slate-200' : 'bg-blue-600 text-white') + ' px-3 py-2 rounded-2xl text-sm shadow-sm ' + (isAssistant ? 'rounded-bl-md' : 'rounded-br-md') }, body)
                            ),
                            isAssistant ? null : avatar
                        );
                    }),
                    React.createElement('div', { ref: bottomRef })
                ),
                React.createElement('div', { className:'mt-auto px-3 py-2 border-t border-slate-100 space-y-2 bg-white' },
                    React.createElement('div', { className:'flex items-center gap-2' },
                        React.createElement('input', { className:'flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm', placeholder:'请输入您的问题…', value:input, onChange:(e)=>setInput(e.target.value), onKeyDown:(e)=>{ if(e.key==='Enter') send(); } }),
                        React.createElement('button', { className:'px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700', onClick:send }, '发送')
                    ),
                    React.createElement('div', { className:'flex flex-wrap gap-2' },
                        ['平台核心功能','工具合集分类','VIP权益咨询','反馈问题与建议'].map((q,idx)=>React.createElement('button',{ key:idx, className:'px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200', onClick:()=>quick(q) }, q))
                    )
                )
              )
            )
        )
    );
};

// =============================================================================
// 5. UserHome 主组件 (放在最后，确保依赖已定义)
// =============================================================================
const UserHome = () => {
    const { useEffect, useState } = React;
    const [articles, setArticles] = useState([]);
    const [showIframe, setShowIframe] = useState(false);
    const [vipMsg, setVipMsg] = useState({ nickname:'', email:'', content:'' });
    const [msgTip, setMsgTip] = useState('');
    const [articlesLoading, setArticlesLoading] = useState(true);
    const [articlesPage, setArticlesPage] = useState(0);
    const [articlesHasMore, setArticlesHasMore] = useState(true);
    const [articleDetail, setArticleDetail] = useState(null);
    const [showArticle, setShowArticle] = useState(false);
    const [activeArticleId, setActiveArticleId] = useState(null);
    const [detailCache, setDetailCache] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [authTip, setAuthTip] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const [showProfile, setShowProfile] = useState(false); // 新增：控制个人资料页面显示
    const captchaUrl = () => `/api/captcha/image?t=${Date.now()}`;
    const [capSrc, setCapSrc] = useState(captchaUrl());
    const [loginForm, setLoginForm] = useState({ username:'', password:'' });
    const [registerForm, setRegisterForm] = useState({ username:'', email:'', password:'', nickname:'' });
    const [showAgents, setShowAgents] = useState(false);
    const [showModule, setShowModule] = useState(null);
    const [toolsReady, setToolsReady] = useState(!!(window.Components && window.Components.UserToolsExplorer));
    const [promptReady, setPromptReady] = useState(!!(window.Components && window.Components.PromptEngineeringPage));
    const [techLearningReady, setTechLearningReady] = useState(!!(window.Components && window.Components.TechLearningPage));
    const [interviewReady, setInterviewReady] = useState(!!(window.Components && window.Components.InterviewHomePage));
    const [interviewParams, setInterviewParams] = useState({});
    const [activePage, setActivePage] = useState(null);
    const [agentList, setAgentList] = useState([]);
    const [agentLoading, setAgentLoading] = useState(false);
    useEffect(()=>{ try{ document.body.style.overflow = showAuth ? 'hidden' : ''; }catch(_){ } return ()=>{ try{ document.body.style.overflow=''; }catch(_){ } }; }, [showAuth]);

    useEffect(()=>{
        try {
            const applyRoute = () => {
                const h = (window.location.hash || '').replace(/^#/, '');
                const p = String(window.location.pathname||'');
                if (h === 'articles' || (!h && p.startsWith('/articles'))) {
                    setActivePage('articles');
                    setShowModule(null);
                } else if (h === 'tech-learning' || (!h && (p.startsWith('/tech-learning') || p.startsWith('/learn')))) {
                    setActivePage('tech-learning');
                    setShowModule(null);
                    try {
                        const loaded = !!(window.Components && window.Components.TechLearningPage);
                        if (!loaded) {
                            const loadScriptOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => (s.src||'').endsWith(src))) { resolve(); return; } const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag); });
                            loadScriptOnce('/js/home/tech-learning.js').then(()=>{
                                setTechLearningReady(!!(window.Components && window.Components.TechLearningPage));
                                try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) { }
                            }).catch(()=>{ });
                        } else {
                            setTechLearningReady(true);
                        }
                    } catch(_){ }
                } else if (p.startsWith('/interview')) {
                    setShowModule(null);
                    try {
                        const loaded = !!(window.Components && window.Components.InterviewHomePage);
                        if (!loaded) {
                            const loadScriptOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => (s.src||'').endsWith(src))) { resolve(); return; } const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag); });
                            loadScriptOnce('/js/home/interview-guide.js').then(()=>{
                                setInterviewReady(true);
                            }).catch(()=>{ });
                        } else {
                            setInterviewReady(true);
                        }
                    } catch(_){}

                    if (p.includes('/items')) {
                        const urlParams = new URLSearchParams(window.location.search);
                        const categoryId = urlParams.get('categoryId');
                        setInterviewParams({ categoryId });
                        setActivePage('interview-items');
                    } else if (p.includes('/category/')) {
                        const parts = p.split('/category/');
                        const id = parts.length > 1 ? parts[1] : null;
                        setInterviewParams({ id });
                        setActivePage('interview-category');
                    } else {
                         setActivePage('interview-home');
                    }
                } else if (p.endsWith('/home.html') || (!h && (p==='/' || p.endsWith('/home.html')))) {
                    setActivePage(null);
                    setShowModule(null);
                } else if (h === 'articles-preview') {
                    setActivePage(null);
                    setShowModule(null);
                    try { const el = document.getElementById('articles-preview'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(_){}
                } else if (h === 'tools') {
                    setActivePage('tools');
                    setShowModule(null);
                    try { const el = document.getElementById('tools-page'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(_){ }
                    // 确保工具合集组件脚本已加载
                    try {
                        const loaded = !!(window.Components && window.Components.UserToolsExplorer);
                        if (!loaded) {
                            const loadScriptOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => (s.src||'').endsWith(src))) { resolve(); return; } const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag); });
                            loadScriptOnce('/tools/10-aiSql-tools-management.js').then(()=>{
                                setToolsReady(!!(window.Components && window.Components.UserToolsExplorer));
                                try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}
                            }).catch(()=>{});
                        } else {
                            setToolsReady(true);
                        }
                    } catch(_){}
                } else if (h === 'prompt-engineering' || (!h && p.startsWith('/prompt-engineering'))) {
                    setActivePage('prompt-engineering');
                    setShowModule(null);
                    try { const el = document.getElementById('prompt-engineering-page'); if (el) el.scrollIntoView({ behavior:'smooth', block:'start' }); } catch(_){ }
                    try {
                        const loaded = !!(window.Components && window.Components.PromptEngineeringPage);
                        if (!loaded) {
                            const loadScriptOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => (s.src||'').endsWith(src))) { resolve(); return; } const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag); });
                            loadScriptOnce('/js/prompt-engineering.js').then(()=>{
                                setPromptReady(!!(window.Components && window.Components.PromptEngineeringPage));
                                try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) { }
                            }).catch(()=>{ });
                        } else {
                            setPromptReady(true);
                        }
                    } catch(_){ }
                } else if (h === 'model' || h === 'mcp' || h === 'prompt' || h === 'dba') {
                    setActivePage(null);
                    setShowModule(h);
                }
            };
            applyRoute();
            window.addEventListener('hashchange', applyRoute);
            window.addEventListener('popstate', applyRoute);
            return () => { window.removeEventListener('hashchange', applyRoute); window.removeEventListener('popstate', applyRoute); };
        } catch(_) {}
    }, []);

    useEffect(()=>{
        const recordVisit = async (user) => {
            try {
                const username = user ? (user.nickname||user.username) : '访客';
                const userId = user ? user.id : undefined;
                await fetch('/api/visit/logs', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ username, userId, path:'/home.html' }) });
            } catch(_){}
        };
        const fetchArticles = async (page=0, append=false) => {
            setArticlesLoading(true);
            try {
                const resp = await fetch(`/api/articles?page=${page}&size=6`);
                const txt = await resp.text(); let data={}; try{ data=JSON.parse(txt||'{}'); }catch(_){ data={}; }
                const list = Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []);
                const totalPages = typeof data.totalPages==='number' ? data.totalPages : (list.length<6 ? page+1 : page+2);
                setArticles(prev => append ? [...prev, ...list] : list);
                setArticlesPage(page);
                setArticlesHasMore((page+1) < totalPages && list.length>0);
            } catch(_) { if(!append) setArticles([]); setArticlesHasMore(false); }
            setArticlesLoading(false);
        };
        fetchArticles(0,false);
        const fetchUser = async () => {
            try {
                const r = await fetch('/api/auth/user');
                const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
                if(d && d.user){ setCurrentUser(d.user); try{ window.__currentUser = d.user; }catch(_){ } await recordVisit(d.user); } else { setCurrentUser(null); try{ window.__currentUser = null; }catch(_){ } await recordVisit(null); }
            } catch(_) { setCurrentUser(null); }
        };
        fetchUser();
    },[]);

    useEffect(()=>{
        // 背景预加载 Prompt 工程脚本，降低首次点击等待
        try {
            const loadScriptOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => (s.src||'').endsWith(src))) { resolve(); return; } const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag); });
            const t = setTimeout(()=>{
                loadScriptOnce('/js/prompt-engineering.js').then(()=>{
                    try { setPromptReady(!!(window.Components && window.Components.PromptEngineeringPage)); }catch(_){ }
                    try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}
                }).catch(()=>{});
            }, 1200);
            return ()=>{ try{ clearTimeout(t); }catch(_){ } };
        } catch(_) {}
    }, []);

    useEffect(()=>{
        // 当弹窗打开“工具合集”模块时，确保组件脚本已加载
        if (showModule === 'tools' && !(window.Components && window.Components.UserToolsExplorer)) {
            const loadScriptOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => (s.src||'').endsWith(src))) { resolve(); return; } const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag); });
            loadScriptOnce('/tools/10-aiSql-tools-management.js').then(()=>{
                setToolsReady(!!(window.Components && window.Components.UserToolsExplorer));
                try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}
            }).catch(()=>{});
        }
        // 当主容器切换到 Prompt 工程时，确保页面脚本已加载
        if (activePage === 'prompt-engineering' && !(window.Components && window.Components.PromptEngineeringPage)) {
            const loadScriptOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => (s.src||'').endsWith(src))) { resolve(); return; } const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag); });
            loadScriptOnce('/js/prompt-engineering.js').then(()=>{
                setPromptReady(!!(window.Components && window.Components.PromptEngineeringPage));
                try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}
            }).catch(()=>{});
        }
        // 懒加载模块弹框组件脚本：model / mcp / prompt / dba
        if (showModule === 'model' && !(window.Components && window.Components.ModelUI)) {
            const loadScriptOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => (s.src||'').endsWith(src))) { resolve(); return; } const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag); });
            loadScriptOnce('/js/model-ui.js').then(()=>{ try{ window.dispatchEvent(new Event('modules:loaded')); }catch(e){}; }).catch(()=>{});
        }
        if (showModule === 'mcp' && !(window.Components && window.Components.MCPUI)) {
            const loadScriptOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => (s.src||'').endsWith(src))) { resolve(); return; } const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag); });
            loadScriptOnce('/js/mcp-ui.js').then(()=>{ try{ window.dispatchEvent(new Event('modules:loaded')); }catch(e){}; }).catch(()=>{});
        }
        if (showModule === 'prompt' && !(window.Components && window.Components.PromptUI)) {
            const loadScriptOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => (s.src||'').endsWith(src))) { resolve(); return; } const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag); });
            loadScriptOnce('/js/prompt-ui.js').then(()=>{ try{ window.dispatchEvent(new Event('modules:loaded')); }catch(e){}; }).catch(()=>{});
        }
        if (showModule === 'dba' && !(window.Components && window.Components.SqlDbaUI)) {
            const loadScriptOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => (s.src||'').endsWith(src))) { resolve(); return; } const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag); });
            loadScriptOnce('/js/sql-dba-ui.js').then(()=>{ try{ window.dispatchEvent(new Event('modules:loaded')); }catch(e){}; }).catch(()=>{});
        }
        const fetchAgentsModal = async () => {
            if(!showAgents) return;
            setAgentLoading(true);
            try {
                const resp = await fetch('/api/tools/active?type=10000', { credentials:'same-origin' });
                const txt = await resp.text(); let data=[]; try{ data=JSON.parse(txt||'[]'); }catch(_){ data=[]; }
                setAgentList(Array.isArray(data)?data:[]);
            } catch(_) { setAgentList([]); }
            setAgentLoading(false);
        };
        fetchAgentsModal();
    }, [showAgents, showModule]);

    useEffect(()=>{ try{ if (activePage==='prompt-engineering' || activePage==='tools') setShowModule(null); }catch(_){ } }, [activePage]);

    const loadMoreArticles = async () => {
        const next = articlesPage + 1;
        try {
            const resp = await fetch(`/api/articles?page=${next}&size=6`);
            const txt = await resp.text(); let data={}; try{ data=JSON.parse(txt||'{}'); }catch(_){ data={}; }
            const list = Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []);
            const totalPages = typeof data.totalPages==='number' ? data.totalPages : (list.length<6 ? next+1 : next+2);
            setArticles(prev => [...prev, ...list]);
            setArticlesPage(next);
            setArticlesHasMore((next+1) < totalPages && list.length>0);
        } catch(_) { setArticlesHasMore(false); }
    };

    const openArticle = async (item) => {
        if (activeArticleId && item && item.id === activeArticleId && showArticle) {
            setShowArticle(false);
            setActiveArticleId(null);
            return;
        }
        setActiveArticleId(item?.toolId ?? item?.id ?? null);
        setArticleDetail({ title: item?.title || '文章详情', content: '内容加载中...' });
        setShowArticle(true);
        const key = item?.toolId ?? item?.id ?? item?.slug ?? item?.title;
        const cached = key ? detailCache[key] : null;
        if (cached && (cached.content || cached.summary)) {
            setArticleDetail({ title: cached.title || item?.title || '文章详情', createdAt: cached.createdAt || item?.createdAt, content: cached.content || cached.summary, contentFormat: cached.contentFormat });
            return;
        }
        let detail = null;
        const normalize = (d) => {
            try {
                if(d && typeof d==='object'){
                    if(d.data) d = d.data;
                    else if(d.result) d = d.result;
                    else if(d.article) d = d.article;
                }
            } catch(_){}
            return d;
        };
        const tryFetch = async (url) => {
            try { console.log('GET', url); } catch(_){ }
            const r = await fetch(url, { credentials:'same-origin', cache:'no-store' });
            const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
            d = normalize(d);
            try {
                if (d && Array.isArray(d.content)) {
                    const found = d.content.find(x => x && (x.id===item.id || x.slug===item.slug));
                    if (found) d = found;
                }
            } catch(_){}
            return d;
        };
        try {
            if(item && item.toolId){ detail = await tryFetch(`/api/tools/${encodeURIComponent(item.toolId)}?t=${Date.now()}`); }
            if(item && item.id && (!detail || !detail.content)){ detail = await tryFetch(`/api/articles?id=${encodeURIComponent(item.id)}&t=${Date.now()}`); }
            if(item && item.slug && (!detail || !detail.content)){ detail = await tryFetch(`/api/articles/${encodeURIComponent(item.slug)}?t=${Date.now()}`); }
            if(item && item.id && (!detail || !detail.content)){ detail = await tryFetch(`/api/articles/admin/${encodeURIComponent(item.id)}?t=${Date.now()}`); }
        
            if(!detail || (!detail.content && !detail.summary)){
                if(item && item.content && String(item.content).trim().length>0){
                    detail = { title:item.title, createdAt:item.createdAt, content:item.content };
                } else if(item && item.summary && String(item.summary).trim().length>0){
                    detail = { title:item.title, createdAt:item.createdAt, content:item.summary };
                } else {
                    const page = await tryFetch('/api/articles?page=0&size=10');
                    const arr = Array.isArray(page?.content) ? page.content : (Array.isArray(page) ? page : []);
                    const found = arr.find(x => x.id===item.id || x.slug===item.slug || x.title===item.title);
                    if(found) detail = found;
                }
            }
        } catch(_) { detail = { title:item?.title||'加载失败', content:'' }; }
        const finalDetail = (detail && (detail.content || detail.summary || detail.text))
            ? { title: detail.title||item?.title||'文章详情', createdAt: detail.createdAt||item?.createdAt, content: detail.content||detail.summary||detail.text, contentFormat: detail.contentFormat, text: detail.text }
            : { title: item?.title||'文章详情', createdAt: item?.createdAt, content: item?.summary||'加载失败，请稍后重试' };
        setArticleDetail(finalDetail);
        if (key) setDetailCache(prev => ({ ...prev, [key]: finalDetail }));
    };

    const submitVipMessage = async () => {
        if(!currentUser || Number(currentUser.vipLevel)!==99){ setMsgTip('仅VIP99可留言'); return; }
        setMsgTip('提交中...');
        try {
            const r = await fetch('/api/system/messages', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ nickname:vipMsg.nickname, email:vipMsg.email, content:vipMsg.content }) });
            const ok = r.ok; setMsgTip(ok?'留言成功，我们会尽快联系您':'留言失败'); if(ok) setVipMsg({ nickname:'', email:'', content:'' });
        } catch(_){ setMsgTip('网络错误'); }
    };

    // 🎯 优化 1: Platform iframe 逻辑保持，但点击功能卡片时在新窗口打开
    const openPlatform = () => window.open(SIGNIN_URL, '_blank'); 
    const openAuth = (mode='login') => { setAuthMode(mode); setShowAuth(true); setAuthTip(''); };
    const logout = async () => { setCurrentUser(null); try { await fetch('/api/auth/logout', { method:'POST' }); } catch(_){} window.location.reload(); };
    const submitLogin = async () => {
        setAuthLoading(true); setAuthTip('');
        try {
            const body = new URLSearchParams({ username: loginForm.username||'', password: loginForm.password||'', captcha: captcha||'' }).toString();
            const r = await fetch('/api/auth/login', { method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded' }, body });
            const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
            if(r.ok && (d.success!==false)){
                const me = await fetch('/api/auth/user');
                const mt = await me.text(); let md={}; try{ md=JSON.parse(mt||'{}'); }catch(_){ md={}; }
                if(md && md.user){ setCurrentUser(md.user); setShowAuth(false); setLoginForm({ username:'', password:'' }); }
            } else { setAuthTip(d.message||'用户名或密码错误'); }
        } catch(_){ setAuthTip('网络错误'); }
        setAuthLoading(false);
    };
    const submitRegister = async () => {
        setAuthLoading(true); setAuthTip('');
        try {
            const r = await fetch('/api/auth/register', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ ...registerForm, captcha }) });
            const t = await r.text(); let d={}; try{ d=JSON.parse(t||'{}'); }catch(_){ d={}; }
            if(r.ok && (d.success!==false)) { setAuthTip('注册成功，请登录'); setAuthMode('login'); }
            else { setAuthTip(d.message||'注册失败'); }
        } catch(_){ setAuthTip('网络错误'); }
        setAuthLoading(false);
    };

    return (
        React.createElement('div',null,
            React.createElement(Header,{ user: currentUser, onOpenLogin: ()=>openAuth('login'), onOpenRegister: ()=>openAuth('register'), onLogout: logout, onOpenAgents: ()=>setShowAgents(true), openModule: (key)=>{
                if (key==='tools' || key==='prompt-engineering') { setActivePage(key); setShowModule(null); }
                else { setActivePage(null); setShowModule(key); }
            }, prefetchPrompt: ()=>{
                try {
                    const loadScriptOnce = (src) => new Promise((resolve, reject) => { if ([...document.scripts].some(s => (s.src||'').endsWith(src))) { resolve(); return; } const tag = document.createElement('script'); tag.src = src; tag.defer = true; tag.onload = () => resolve(); tag.onerror = (e) => reject(e); document.head.appendChild(tag); });
                    loadScriptOnce('/js/prompt-engineering.js').then(()=>{
                        try { setPromptReady(!!(window.Components && window.Components.PromptEngineeringPage)); }catch(_){ }
                        try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}
                    }).catch(()=>{});
                } catch(_) {}
            }, setShowProfile }),
            (activePage==='articles') && React.createElement(ArticlesPage,null),
            (activePage==='tech-learning') && ((window.Components && window.Components.TechLearningPage) ? React.createElement(window.Components.TechLearningPage,null) : React.createElement('div',null, techLearningReady ? '组件加载中...' : '正在加载组件脚本...')),
            (activePage==='interview-home') && ((window.Components && window.Components.InterviewHomePage) ? React.createElement(window.Components.InterviewHomePage,null) : React.createElement('div',null, interviewReady ? '组件加载中...' : '正在加载组件脚本...')),
            (activePage==='interview-category') && ((window.Components && window.Components.InterviewCategoryPage) ? React.createElement(window.Components.InterviewCategoryPage, { id: interviewParams.id }) : React.createElement('div',null, interviewReady ? '组件加载中...' : '正在加载组件脚本...')),
            (activePage==='interview-items') && ((window.Components && window.Components.InterviewItemsPage) ? React.createElement(window.Components.InterviewItemsPage, { categoryId: interviewParams.categoryId }) : React.createElement('div',null, interviewReady ? '组件加载中...' : '正在加载组件脚本...')),
            (activePage!=='tools' && activePage!=='prompt-engineering' && activePage!=='articles' && activePage!=='tech-learning' && !String(activePage||'').startsWith('interview')) && React.createElement(HeroSection,{ onOpenRegister: ()=>openAuth('register'), onOpenLogin: ()=>openAuth('login') }),

            // 核心功能区
            // 🎯 优化 2: 增加留白 py-24
            (activePage!=='tools' && activePage!=='prompt-engineering' && activePage!=='articles' && activePage!=='tech-learning' && !String(activePage||'').startsWith('interview')) && React.createElement('section',{id:'features-section', className:'py-24 px-6 max-w-7xl mx-auto'}, 
                // 🎯 优化 2: 增加留白 mb-16
                React.createElement('div',{className:'text-center mb-16'}, 
                    React.createElement('h2',{className:'text-4xl tracking-tight text-slate-900 mb-4 font-extrabold'}, '核心功能与服务'), 
                    React.createElement('p',{className:'text-lg text-slate-600 max-w-2xl mx-auto'}, '全方位的AI解决方案，满足从学习到生产的各种需求') 
                ),
                // 🎯 优化 2: 增加留白 gap-8
                React.createElement('div',{className:'grid md:grid-cols-2 lg:grid-cols-4 gap-8'}, 
                    features.map(f => {
                        const Icon = f.icon;
                        return React.createElement('div',{key:f.id,className:'group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-slate-100 hover:border-blue-200'}, // 增加 p-8 内边距，增加圆角
                            React.createElement('div',{className:`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${f.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity`} ),
                            React.createElement('div',{className:'relative z-10'},
                                React.createElement('div',{className:`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`},
                                    React.createElement(Icon,{className:'w-6 h-6 text-white'})
                                ),
                                React.createElement('h3',{className:'text-xl font-semibold text-slate-900 mb-2'}, f.title),
                                React.createElement('p',{className:'text-slate-600 mb-6 text-sm'}, f.description),
                                React.createElement('button',{className:`flex items-center gap-2 text-transparent bg-gradient-to-r ${f.color} bg-clip-text font-medium group-hover:gap-3 transition-all`, onClick:()=>{
                                        if(f.id==='articles') { document.getElementById('articles-preview').scrollIntoView({ behavior:'smooth', block:'start' }); }
                                        // 🎯 优化 1: 点击“了解更多”在新标签页打开
                                        if(f.id==='platform') { window.open(SIGNIN_URL, '_blank'); }
                                        if(f.id==='vip') { const el=document.getElementById('vip-section'); if(el) el.scrollIntoView({behavior:'smooth'}) }
                                        if(f.id==='opensource') { window.open('hthttps://github.com/TonyWu340826/Tony-Agent-AI','_blank'); }
                                    }}, '了解更多', React.createElement(ArrowRight,{className:'w-4 h-4'}))
                            )
                        );
                    })
                )
            ),

            (activePage==='tools') && React.createElement('section',{id:'tools-page', className:'py-16 px-6 max-w-[1400px] mx-auto bg白 rounded-2xl'},
                React.createElement('div',{className:'flex items-center justify-between mb-6'},
                    React.createElement('h2',{className:'text-2xl font-extrabold text-slate-900'}, '工具合集')
                ),
                (window.Components && window.Components.UserToolsExplorer) ? React.createElement(window.Components.UserToolsExplorer, { currentUser }) : React.createElement('div',null, toolsReady ? '组件加载中...' : '正在加载组件脚本...')
            ),

            (activePage==='prompt-engineering') && React.createElement('section',{id:'prompt-engineering-page', className:'py-16 px-6 max-w-[1400px] mx-auto bg白 rounded-2xl'},
                (window.Components && window.Components.PromptEngineeringPage) ? React.createElement(window.Components.PromptEngineeringPage, { currentUser, requireLogin: ()=>openAuth('login') }) : React.createElement('div',null, promptReady ? '组件加载中...' : '正在加载组件脚本...')
            ),

            showAgents && React.createElement('div',{className:'fixed inset-0 z-[950] bg-black/60 flex items-center justify-center p-4', onClick:()=>setShowAgents(false)},
                React.createElement('div',{className:'bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden', onClick:(e)=>e.stopPropagation()},
                    React.createElement('div',{className:'p-6'},
                        React.createElement('h3',{className:'text-xl font-semibold text-slate-900 mb-4'}, '三方Agent合集'),
                        React.createElement('div',{className:'space-y-3'},
                            agentLoading ? [1,2,3,4].map((i)=>React.createElement('div',{key:i,className:'h-10 bg-slate-100 rounded animate-pulse'}))
                            : (agentList.length===0 ? React.createElement('div',{className:'text-slate-500 text-sm'}, '暂无可用Agent')
                               : agentList.map((a,i)=>React.createElement('div',{key:i,className:'flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer', onClick:()=>{
                                        const isVipTool = String(a.vipAllow||'').toUpperCase()==='VIP';
                                        if(isVipTool && !(currentUser && Number(currentUser.vipLevel)===99)) { alert('该工具为VIP99专享，请升级为VIP后使用'); return; }
                                        const url = a.apiPath || a.url; if(url) window.open(url,'_blank');
                                    }},
                                    React.createElement(ImageWithFallback,{src:a.iconUrl, alt:a.toolName, className:'w-7 h-7 rounded'}),
                                    React.createElement('span',{className:'text-slate-900 font-medium flex items-center gap-2'}, a.toolName, (String(a.vipAllow||'').toUpperCase()==='VIP' ? React.createElement(Crown,{className:'w-4 h-4 text-amber-500'}) : null)),
                                    React.createElement(ArrowRight,{className:'w-4 h-4 text-slate-400 ml-auto'})
                                )))
                        ),
                        React.createElement('div',{className:'mt-4 text-right'},
                            React.createElement('button',{className:'px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200', onClick:()=>setShowAgents(false)}, '关闭')
                        )
                    )
                )
            ),

            // 文章预览区
            // 🎯 优化 2: 增加留白 py-24
            (activePage!=='tools' && activePage!=='prompt-engineering' && activePage!=='articles' && activePage!=='tech-learning' && !String(activePage||'').startsWith('interview')) && React.createElement('section',{id:'articles-preview', className:'py-24 px-6 bg-slate-50'}, 
                React.createElement('div',{className:'max-w-7xl mx-auto'},
                    // 🎯 优化 2: 增加留白 gap-12
                    React.createElement('div',{className:'grid lg:grid-cols-2 gap-12 items-center'}, 
                        React.createElement('div',null,
                            // 🎯 优化 2: 增加留白 mb-4
                            React.createElement('div',{className:'inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full text-blue-700 mb-4'}, 
                                React.createElement(Newspaper,{className:'w-4 h-4'}), React.createElement('span',{className:'text-sm'}, 'AI资讯')
                            ),
                            // 🎯 优化 2: 增加留白 mb-4
                            React.createElement('h3',{className:'text-4xl text-slate-900 mb-4 font-extrabold'}, '获取前沿AI资讯与技术干货'),
                            // 🎯 优化 2: 增加留白 mb-8
                            React.createElement('p',{className:'text-lg text-slate-600 mb-8 leading-relaxed'}, '我们精选行业内最新、最具深度的技术文章和应用案例，助您保持领先地位。'),

                            // 🎯 优化 2: 增加留白 space-y-4 mb-8
                            React.createElement('div',{className:'space-y-4 mb-8'},
                                articlesLoading ? (
                                    Array.from({length:3}).map((_, i) => React.createElement('div',{key:i, className:'h-5 bg-slate-200 rounded animate-pulse w-full'})) 
                                ) : (
                                    (articles||[]).map(a => React.createElement('div',{key:a.id, className:'block group hover:bg-white p-3 rounded-lg transition-colors border-b border-slate-100 last:border-b-0 cursor-pointer', onClick:()=>{ try{ const q=new URLSearchParams(); if(a.id) q.set('id', a.id); else if(a.slug) q.set('slug', a.slug); history.pushState({ page:'articles', id:a.id, slug:a.slug }, '', `/articles?${q.toString()}`); }catch(_){ try{ window.location.hash='articles'; }catch(__){} } setActivePage('articles'); }},
                                        React.createElement('div',{className:'flex items-center gap-3'},
                                            React.createElement('div',{className:'w-2 h-2 bg-blue-600 rounded-full flex-shrink-0'}),
                                            React.createElement('span',{className:'text-slate-800 font-medium truncate group-hover:text-blue-600 transition-colors text-base'}, a.title),
                                            React.createElement('button',{className:'ml-auto p-1 rounded hover:bg-slate-100 text-slate-600 flex-shrink-0', onClick:(e)=>{ e.stopPropagation(); try{ const q=new URLSearchParams(); if(a.id) q.set('id', a.id); else if(a.slug) q.set('slug', a.slug); history.pushState({ page:'articles', id:a.id, slug:a.slug }, '', `/articles?${q.toString()}`); }catch(_){ try{ window.location.hash='articles'; }catch(__){} } setActivePage('articles'); }, 'aria-label':'查看文章详情'},
                                                React.createElement(ArrowRight,{className:'w-5 h-5'})
                                            )
                                        )
                                    ))
                                )
                            ),
                            React.createElement('button',{className:`px-6 py-3 rounded-xl font-semibold transition-colors shadow-md ${articlesHasMore?'bg-blue-600 text-white hover:bg-blue-700':'bg-gray-300 text-gray-600 cursor-not-allowed'}`, onClick:()=>{ if(articlesHasMore) loadMoreArticles(); }}, articlesLoading?'加载中...':(articlesHasMore?'浏览更多文章':'没有更多了'))
                        ),

                        // 右侧展示图
                        React.createElement('div',null,
                            React.createElement('div',{className:'relative rounded-2xl overflow-hidden'},
                                React.createElement('div',{className:'w-full aspect-[16/9]'},
                                    React.createElement(ImageWithFallback,{src:'/image/img.png', alt:'', className:'w-full h-full object-cover'})
                                )
                            )
                        )
                    )
                )
            ),



            // Platform (iframe modal) - 逻辑保持，但点击功能卡片时在新窗口打开，所以 modal 不会显示
            (activePage!=='tools' && activePage!=='prompt-engineering' && activePage!=='articles' && activePage!=='tech-learning' && !String(activePage||'').startsWith('interview') && showIframe) && React.createElement('div',{className:'fixed inset-0 z-[900] bg-black/70 flex items-center justify-center p-4', onClick:()=>setShowIframe(false)},
                React.createElement('div',{className:'bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden', onClick:(e)=>e.stopPropagation()},
                    React.createElement('div',{className:'flex items-center justify-between p-3 border-b border-slate-100'},
                        React.createElement('div',{className:'inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 rounded-full text-indigo-700'}, React.createElement(Terminal,{className:'w-4 h-4'}), React.createElement('span',{className:'text-sm font-semibold'}, '开发平台')),
                        React.createElement('button',{className:'px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors', onClick:()=>setShowIframe(false)}, '关闭')
                    ),
                    React.createElement('iframe',{src:SIGNIN_URL, className:'w-full h-full border-0', allow:'fullscreen'})
                )
            ),

            // VIP服务留言区
            // 🎯 优化 2: 增加留白 my-24
            (activePage!=='tools' && activePage!=='prompt-engineering' && activePage!=='articles' && activePage!=='tech-learning' && !String(activePage||'').startsWith('interview')) && React.createElement('section',{id:'vip-section', className:'bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-12 md:p-16 my-24 max-w-7xl mx-auto shadow-xl border border-amber-200'},
                React.createElement('div',{className:'max-w-4xl mx-auto text-center'},
                    // 🎯 优化 2: 增加留白 mb-6
                    React.createElement('div',{className:'inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-amber-700 font-semibold mb-6 shadow-md'}, React.createElement(Star,{className:'w-4 h-4'}), React.createElement('span',{className:'text-sm'}, 'VIP专属服务')),
                    // 🎯 优化 2: 增加留白 mb-6
                    React.createElement('h3',{className:'text-4xl text-slate-900 mb-6 font-extrabold'}, '升级为VIP，享受专属权益'), 
                    // 🎯 优化 2: 增加留白 mb-12
                    React.createElement('p',{className:'text-lg text-slate-600 mb-12'}, '我们提供极速响应、定制化服务和专属顾问支持，为您的业务保驾护航。'),

                    // 🎯 优化 2: 增加留白 gap-6 mb-12
                    React.createElement('div',{className:'grid md:grid-cols-3 gap-6 mb-12 text-left'}, 
                        ['极速响应','定制服务','专属顾问'].map((label,idx)=>React.createElement('div',{key:idx,className:'bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-amber-500'}, // 增加 p-6 内边距
                            React.createElement('h4',{className:'text-xl text-slate-900 font-semibold mb-2'}, label),
                            React.createElement('p',{className:'text-sm text-slate-600'}, ['7x24小时内响应','根据您的需求深度定制','一对一技术与业务支持'][idx])
                        ))
                    ),

                    // 🎯 优化 2: 增加留白 p-8
                    React.createElement('div',{className:'bg-white rounded-xl p-8 shadow-2xl text-left border border-amber-300'}, 
                        React.createElement('h4',{className:'text-2xl text-slate-900 mb-4 font-semibold'}, '联系我们'),
                        React.createElement('p',{className:'text-slate-600 mb-6 text-sm'}, '请留下您的联系方式和需求，我们将尽快安排专属顾问与您对接。'),
                        React.createElement('div',{className:'grid md:grid-cols-3 gap-4'},
                            React.createElement('input',{className:'border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-3 py-2 transition-all text-base', placeholder:'昵称', value:vipMsg.nickname, onChange:e=>setVipMsg({...vipMsg,nickname:e.target.value})}),
                            React.createElement('input',{className:'border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-3 py-2 transition-all text-base', placeholder:'邮箱', value:vipMsg.email, onChange:e=>setVipMsg({...vipMsg,email:e.target.value})}),
                            React.createElement('button',{className:'px-6 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors shadow-md text-base', onClick:submitVipMessage, disabled: msgTip==='提交中...' || !currentUser || Number(currentUser.vipLevel)!==99}, msgTip==='提交中...' ? '提交中...' : (!currentUser || Number(currentUser.vipLevel)!==99 ? '仅VIP99可留言' : '提交留言'))
                        ),
                        React.createElement('textarea',{className:'border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-3 py-2 w-full mt-4 transition-all text-base', rows:4, placeholder:'留言内容 (请详细描述您的需求)', value:vipMsg.content, onChange:e=>setVipMsg({...vipMsg,content:e.target.value})}), // 增加 rows
                        msgTip && React.createElement('div',{className:`mt-3 text-sm font-medium ${msgTip.includes('成功') ? 'text-green-600' : 'text-red-600'}`, role:'alert'}, msgTip)
                    )
                )
            ),

            // 开源区
            // 🎯 优化 2: 增加留白 py-24
            (activePage!=='tools' && activePage!=='prompt-engineering' && activePage!=='articles' && activePage!=='tech-learning' && !String(activePage||'').startsWith('interview')) && React.createElement('section',{id:'opensource', className:'py-24 px-6 max-w-7xl mx-auto bg-white'}, 
                // 🎯 优化 2: 增加留白 gap-12
                React.createElement('div',{className:'grid lg:grid-cols-2 gap-12 items-center'},
                    React.createElement('div',{className:'order-2 lg:order-1'},
                        // 🎯 优化 2: 增加留白 mb-4
                        React.createElement('div',{className:'inline-flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full text-green-700 font-semibold mb-4'}, React.createElement(Github,{className:'w-4 h-4'}), React.createElement('span',{className:'text-sm'}, '开源社区')),
                        // 🎯 优化 2: 增加留白 mb-4
                        React.createElement('h3',{className:'text-4xl text-slate-900 mb-4 font-extrabold'}, '拥抱开源，共建生态'),
                        // 🎯 优化 2: 增加留白 mb-6
                        React.createElement('p',{className:'text-lg text-slate-600 mb-6 leading-relaxed'}, '开放源代码，与社区共同构建更好的AI生态系统。欢迎开发者们贡献代码和提交建议。'),
                        // 🎯 优化 1: “访问GitHub”在新标签页打开·
                        React.createElement('button',{className:'px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md', onClick:()=>window.open('https://github.com/TonyWu340826/Tony-Agent-AI','_blank')}, '访问GitHub')
                    ),
                    React.createElement('div',{className:'order-1 lg:order-2'},
                        // 🎯 优化 2: 增加留白 p-8
                        React.createElement('div',{className:'bg-white rounded-2xl p-8 shadow-xl border border-slate-100'}, 
                            React.createElement('div',{className:'flex items-center justify-between mb-6'}, React.createElement('h4',{className:'text-xl text-slate-900 font-semibold'}, '项目活跃度'), React.createElement(Github,{className:'w-6 h-6 text-slate-600'})),
                            // 🎯 优化 2: 增加留白 space-y-4
                            React.createElement('div',{className:'space-y-4'},
                                ['Stars','Forks','Contributors'].map((label,idx)=>React.createElement('div',{key:idx},
                                    React.createElement('div',{className:'flex items-center justify-between mb-2'}, React.createElement('span',{className:'text-sm text-slate-600'}, label), React.createElement('span',{className:'text-xl text-slate-900 font-bold'}, ['x','x','x+'][idx])),
                                    React.createElement('div',{className:'w-full h-2 bg-slate-100 rounded-full overflow-hidden'}, React.createElement('div',{className:'h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full', style:{ width: ['85%','65%','75%'][idx] } }))
                                ))
                            )
                        )
                    )
                )
            ),
            showAuth && React.createElement('div',{className:'fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4', onClick:()=>setShowAuth(false)},
                React.createElement('div',{className:'bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden', onClick:(e)=>e.stopPropagation()},
                    React.createElement('div',{className:'flex border-b border-gray-200'},
                        React.createElement('button',{className:`flex-1 px-4 py-3 text-sm font-medium ${authMode==='login'?'text-blue-600 border-b-2 border-blue-600':'text-gray-500 hover:text-gray-700'}`, onClick:()=>setAuthMode('login')}, '登录'),
                        React.createElement('button',{className:`flex-1 px-4 py-3 text-sm font-medium ${authMode==='register'?'text-blue-600 border-b-2 border-blue-600':'text-gray-500 hover:text-gray-700'}`, onClick:()=>setAuthMode('register')}, '注册')
                    ),
                    authMode==='login' ? React.createElement('div',{className:'p-6 space-y-5'},
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, '用户名'),
                            React.createElement('input',{className:'w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', placeholder:'请输入用户名', value:loginForm.username, onChange:e=>setLoginForm({...loginForm, username:e.target.value})})
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, '密码'),
                            React.createElement('input',{className:'w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', type:'password', placeholder:'请输入密码', value:loginForm.password, onChange:e=>setLoginForm({...loginForm, password:e.target.value})})
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, '验证码'),
                            React.createElement('div',{className:'grid grid-cols-3 gap-3'},
                                React.createElement('input',{className:'w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition col-span-2', placeholder:'请输入验证码', value:captcha, onChange:e=>setCaptcha(e.target.value)}),
                                React.createElement('img',{src:capSrc, alt:'验证码', className:'h-12 rounded-lg border cursor-pointer self-end', onClick:()=>setCapSrc(captchaUrl())})
                            )
                        ),
                        authTip && React.createElement('div',{className:'text-sm text-red-600 bg-red-50 p-3 rounded-lg'}, authTip),
                        React.createElement('button',{className:'w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md font-medium', disabled:authLoading, onClick:submitLogin}, authLoading?'登录中...':'登录')
                    ) : React.createElement('div',{className:'p-6 space-y-5'},
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, '用户名'),
                            React.createElement('input',{className:'w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', placeholder:'请输入用户名', value:registerForm.username, onChange:e=>setRegisterForm({...registerForm, username:e.target.value})})
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, '邮箱'),
                            React.createElement('input',{className:'w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', placeholder:'请输入邮箱', value:registerForm.email, onChange:e=>setRegisterForm({...registerForm, email:e.target.value})})
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, '昵称（可选）'),
                            React.createElement('input',{className:'w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', placeholder:'请输入昵称', value:registerForm.nickname, onChange:e=>setRegisterForm({...registerForm, nickname:e.target.value})})
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, '密码'),
                            React.createElement('input',{className:'w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition', type:'password', placeholder:'请输入密码', value:registerForm.password, onChange:e=>setRegisterForm({...registerForm, password:e.target.value})})
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, '验证码'),
                            React.createElement('div',{className:'grid grid-cols-3 gap-3'},
                                React.createElement('input',{className:'w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition col-span-2', placeholder:'请输入验证码', value:captcha, onChange:e=>setCaptcha(e.target.value)}),
                                React.createElement('img',{src:capSrc, alt:'验证码', className:'h-12 rounded-lg border cursor-pointer self-end', onClick:()=>setCapSrc(captchaUrl())})
                            )
                        ),
                        authTip && React.createElement('div',{className:'text-sm text-red-600 bg-red-50 p-3 rounded-lg'}, authTip),
                        React.createElement('button',{className:'w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md font-medium', disabled:authLoading, onClick:submitRegister}, authLoading?'注册中...':'注册')
                    )
                ),
            // 新增：个人资料页面
            showProfile && currentUser && React.createElement('div', { className: 'fixed inset-0 flex items-center justify-center p-4', style: { zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.6)' }, onClick: () => setShowProfile(false) },
                React.createElement('div', { className: 'bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden', onClick: (e) => e.stopPropagation() },
                    React.createElement('div', { className: 'flex items-center justify-between px-6 py-4 border-b' },
                        React.createElement('h3', { className: 'text-xl font-bold text-slate-900' }, '个人资料'),
                        React.createElement('button', { className: 'px-2 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200', onClick: () => setShowProfile(false) }, '×')
                    ),
                    React.createElement('div', { className: 'p-6 space-y-4' },
                        React.createElement('div', { className: 'flex items-center space-x-4' },
                            React.createElement('div', { className: 'w-16 h-16 rounded-full overflow-hidden border-2 relative' },
                                React.createElement('img', {
                                    src: currentUser.avatar || (Number(currentUser.vipLevel) === 99 ? '/image/头像4.jpeg' : ['/image/头像1.png', '/image/头像2.jpeg', '/image/头像3.jpeg'][Math.floor(Math.random() * 3)]),
                                    alt: '用户头像',
                                    className: 'w-full h-full object-cover',
                                    onError: (e) => { 
                                        // 根据用户VIP状态选择不同的备用头像
                                        const isVip = Number(currentUser.vipLevel) === 99;
                                        if (isVip) {
                                            e.target.src = '/image/头像4.jpeg';
                                        } else {
                                            // 非VIP用户尝试其他头像文件
                                            const avatarFiles = ['/image/头像1.png', '/image/头像2.jpeg', '/image/头像3.jpeg'];
                                            e.target.src = avatarFiles[Math.floor(Math.random() * avatarFiles.length)];
                                        }
                                        e.target.onerror = () => { e.target.src = '/image/default-avatar.png'; };
                                    },
                                    style: { display: 'block', width: '100%', height: '100%', objectFit: 'cover' }
                                })
                            ),
                            React.createElement('div', null,
                                React.createElement('h4', { className: 'font-semibold text-lg' }, currentUser.nickname || currentUser.username || '未知用户'),
                                React.createElement('p', { className: 'text-sm text-gray-500' }, currentUser.username || '')
                            )
                        ),
                        React.createElement('div', { className: 'space-y-3' },
                            React.createElement('div', null,
                                React.createElement('label', { className: 'text-sm font-medium text-gray-700' }, '用户名'),
                                React.createElement('div', { className: 'mt-1 p-2 bg-gray-50 rounded-md text-slate-900' }, currentUser.username || '未设置')
                            ),
                            React.createElement('div', null,
                                React.createElement('label', { className: 'text-sm font-medium text-gray-700' }, '邮箱'),
                                React.createElement('div', { className: 'mt-1 p-2 bg-gray-50 rounded-md text-slate-900' }, currentUser.email || '未设置')
                            ),
                            React.createElement('div', null,
                                React.createElement('label', { className: 'text-sm font-medium text-gray-700' }, '昵称'),
                                React.createElement('div', { className: 'mt-1 p-2 bg-gray-50 rounded-md text-slate-900' }, currentUser.nickname || '未设置')
                            ),
                            React.createElement('div', null,
                                React.createElement('label', { className: 'text-sm font-medium text-gray-700' }, '会员等级'),
                                React.createElement('div', { className: 'mt-1 p-2 bg-gray-50 rounded-md text-slate-900' }, `VIP ${currentUser.vipLevel ?? 0}`)
                            ),
                            React.createElement('div', null,
                                React.createElement('label', { className: 'text-sm font-medium text-gray-700' }, '注册时间'),
                                React.createElement('div', { className: 'mt-1 p-2 bg-gray-50 rounded-md text-slate-900' }, (currentUser.registrationDate ? new Date(currentUser.registrationDate).toLocaleString() : (currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleString() : '未知')))                            )
                        )
                    )
                )
            ),
            React.createElement('div',{className:'fixed bottom-0 left-0 right-0 z-[1000] pointer-events-none'},
                React.createElement('div',{className:`mx-auto max-w-7xl px-4 transition-all duration-300 transform ${showArticle?'translate-y-0 opacity-100 pointer-events-auto':'translate-y-full opacity-0'}`, style:{ transform: showArticle ? 'translateY(0)' : 'translateY(100%)', opacity: showArticle ? 1 : 0, transition: 'transform .3s ease, opacity .3s ease' }},
                    React.createElement('div',{className:'bg-white rounded-t-2xl shadow-2xl border border-slate-200 overflow-hidden'},
                        React.createElement('div',{className:'flex items-center justify-between px-6 pt-4'},
                            React.createElement('h3',{className:'text-lg font-semibold text-slate-900 truncate'}, (articleDetail&&articleDetail.title)||'文章详情'),
                            React.createElement('button',{className:'px-2 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200', onClick:()=>{ setShowArticle(false); setActiveArticleId(null); }, 'aria-label':'关闭详情'}, '×')
                        ),
                        React.createElement('div',{className:'px-6 pb-6 text-sm text-slate-500'}, (articleDetail&&articleDetail.createdAt) ? new Date(articleDetail.createdAt).toLocaleString() : ''),
                        React.createElement('div',{className:'px-6 pb-6 max-h-[40vh] md:max-h-[50vh] overflow-auto'}, React.createElement(ArticleContent,{detail:articleDetail}))
                    )
                )
            ),
            !showAuth && !String(activePage||'').startsWith('interview') && React.createElement(Footer,null)
            , React.createElement(SupportChat, null)
        )
    ));
};

window.Components = window.Components || {};
window.Components.UserHome = UserHome;
try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}
