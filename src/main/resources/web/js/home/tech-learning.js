(function() {
    // Icons (Self-contained definitions for independence)
    const Svg = ({ children, className }) => (
        React.createElement('svg',{className, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'}, children)
    );
    const BookOpen = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M2 5h8a3 3 0 013 3v11H5a3 3 0 01-3-3V5z'}), React.createElement('path',{d:'M22 5h-8a3 3 0 00-3 3v11h8a3 3 0 003-3V5z'}));
    const Code2 = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M16 18l6-6-6-6'}), React.createElement('path',{d:'M8 6L2 12l6 6'}));
    const Star = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14l-5-4.87 6.91-1.01L12 2z'}));
    const ArrowRight = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M5 12h14'}), React.createElement('path',{d:'M12 5l7 7-7 7'}));

    const TechLearningPage = () => {
        const { useEffect } = React;
        useEffect(() => { document.title = '技术学习 - 宙斯'; return () => { document.title = '宙斯 - AI 赋能平台'; }; }, []);
        const cards = [
            { title: '面试宝典', desc: '技术内容和海量面试题学习', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', btnColor: 'bg-blue-600 hover:bg-blue-700', action: () => { window.history.pushState({}, '', '/interview'); window.dispatchEvent(new Event('popstate')); } },
            { title: '示例项目', desc: '快速学习与二次开发', icon: Code2, color: 'text-cyan-600', bg: 'bg-cyan-50', btnColor: 'bg-cyan-600 hover:bg-cyan-700', action: () => alert('功能开发中，敬请期待') },
            { title: '最佳实践', desc: '前沿实践与最佳实践', icon: Star, color: 'text-indigo-600', bg: 'bg-indigo-50', btnColor: 'bg-indigo-600 hover:bg-indigo-700', action: () => alert('功能开发中，敬请期待') }
        ];

        return React.createElement('div', { className: 'min-h-screen bg-slate-50 py-12 px-4 md:px-6' },
            React.createElement('div', { className: 'max-w-7xl mx-auto' },
                 React.createElement('div', { className: 'mb-8' },
                    React.createElement('button', { 
                        className: 'flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-white',
                        onClick: () => { 
                            try {
                                if (document.referrer && document.referrer.includes('/home.html')) { history.back(); }
                                else { window.location.assign('/home.html'); }
                            } catch(_) { window.location.assign('/home.html'); }
                        }
                    }, React.createElement(ArrowRight, { className: 'w-4 h-4 rotate-180' }), '返回首页')
                ),
                React.createElement('div', { className: 'text-center mb-16' },
                    React.createElement('h1', { className: 'text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight' }, '技术学习'),
                    React.createElement('p', { className: 'text-xl text-slate-600 max-w-2xl mx-auto' }, '精选学习资料与教程，快速上手与进阶')
                ),
                React.createElement('div', { className: 'grid md:grid-cols-3 gap-8' },
                    cards.map((c, i) => React.createElement('div', { key: i, className: 'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center text-center group hover:-translate-y-2 border border-slate-100' },
                        React.createElement('div', { className: `w-20 h-20 ${c.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm` },
                            React.createElement(c.icon, { className: `w-10 h-10 ${c.color}` })
                        ),
                        React.createElement('h3', { className: 'text-2xl font-bold text-slate-900 mb-3' }, c.title),
                        React.createElement('p', { className: 'text-slate-600 mb-8 flex-1 leading-relaxed' }, c.desc),
                        React.createElement('button', { 
                            className: `px-8 py-3 ${c.btnColor} text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all w-full transform active:scale-95`, 
                            onClick: c.action
                        }, '进入')
                    ))
                )
            )
        );
    };

    if (!window.Components) window.Components = {};
    window.Components.TechLearningPage = TechLearningPage;
})();