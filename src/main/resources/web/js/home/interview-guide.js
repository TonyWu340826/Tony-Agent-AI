(function() {
    const { useState, useEffect } = React;

    // --- Icons ---
    const Svg = ({ children, className }) => (
        React.createElement('svg',{className, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'}, children)
    );
    const ArrowRight = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M5 12h14'}), React.createElement('path',{d:'M12 5l7 7-7 7'}));
    const Folder = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z'}));
    const BookOpen = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z'}), React.createElement('path',{d:'M22 3h-6a4 4 0 01-4 4v14a3 3 0 003-3h7z'}));
    const FileText = ({ className }) => React.createElement(Svg,{className}, React.createElement('path',{d:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z'}), React.createElement('polyline',{points:'14 2 14 8 20 8'}), React.createElement('line',{x1:'16',y1:'13',x2:'8',y2:'13'}), React.createElement('line',{x1:'16',y1:'17',x2:'8',y2:'17'}), React.createElement('polyline',{points:'10 9 9 9 8 9'}));
    const Layers = ({ className }) => React.createElement(Svg,{className}, React.createElement('polygon',{points:'12 2 2 7 12 12 22 7 12 2'}), React.createElement('polyline',{points:'2 17 12 22 22 17'}), React.createElement('polyline',{points:'2 12 12 17 22 12'}));

    // --- API ---
    const fetchCategories = async (parentId, maxType) => {
        const params = new URLSearchParams();
        params.append('size', 100); // Fetch enough
        if (parentId !== undefined) params.append('parentId', parentId);
        if (maxType !== undefined) params.append('maxType', maxType);
        const res = await fetch(`/api/categories?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        return data.content || [];
    };

    const fetchItems = async (categoryId, type) => {
        const params = new URLSearchParams();
        params.append('size', 100);
        if (categoryId) params.append('categoryId', categoryId);
        if (type) params.append('type', type);
        const res = await fetch(`/api/interview/items?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch items');
        const data = await res.json();
        return data.content || [];
    };

    const fetchCategory = async (id) => {
        const res = await fetch(`/api/categories/${id}`);
        if (!res.ok) throw new Error('Failed to fetch category');
        return await res.json();
    };

    // --- Components ---

    const Breadcrumb = ({ items }) => {
        return React.createElement('nav', { className: 'flex items-center text-sm text-slate-500 mb-6 overflow-x-auto whitespace-nowrap' },
            React.createElement('button', { 
                className: 'hover:text-blue-600 transition-colors flex-shrink-0 cursor-pointer',
                onClick: () => {
                    window.history.pushState({}, '', '/');
                    window.dispatchEvent(new Event('popstate'));
                }
            }, '首页'),
            React.createElement(ArrowRight, { className: 'w-3 h-3 mx-2 flex-shrink-0 text-slate-400' }),
            React.createElement('button', { 
                className: `transition-colors flex-shrink-0 ${(!items || items.length === 0) ? 'text-slate-900 font-medium cursor-default' : 'hover:text-blue-600 cursor-pointer'}`,
                onClick: () => {
                    if (items && items.length > 0) {
                        // Mark state to avoid history trap when clicking 'Back' on the landing page
                        window.history.pushState({ fromBreadcrumb: true }, '', '/interview');
                        window.dispatchEvent(new Event('popstate'));
                    }
                }
            }, '面试宝典'),
            items && items.map((item, index) => [
                React.createElement(ArrowRight, { key: `arrow-${index}`, className: 'w-3 h-3 mx-2 flex-shrink-0 text-slate-400' }),
                React.createElement('button', { 
                    key: `item-${index}`,
                    className: `transition-colors flex-shrink-0 ${index === items.length - 1 ? 'text-slate-900 font-medium cursor-default' : 'hover:text-blue-600 cursor-pointer'}`,
                    onClick: index === items.length - 1 ? undefined : item.onClick
                }, item.label)
            ])
        );
    };

    // 1. Level 1: InterviewHomePage
    const InterviewHomePage = () => {
        const [categories, setCategories] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            document.title = '面试宝典 - 宙斯';
            // type <= -10, parentId = 0 (roots)
            fetchCategories(0, -10).then(setCategories).catch(console.error).finally(()=>setLoading(false));
        }, []);

        if (loading) return React.createElement('div', {className:'p-10 text-center text-gray-500'}, '加载中...');

        return React.createElement('div', { className: 'min-h-screen bg-slate-50 py-12 px-4 md:px-6' },
            React.createElement('div', { className: 'max-w-7xl mx-auto' },
                React.createElement('div', { className: 'mb-8' },
                    React.createElement('button', { 
                        className: 'flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-white cursor-pointer',
                        onClick: () => { 
                            // If user came from breadcrumb (deep link return), go to Home instead of back (which would return to child)
                            if (window.history.state && window.history.state.fromBreadcrumb) {
                                window.history.pushState({}, '', '/');
                                window.dispatchEvent(new Event('popstate'));
                            } else {
                                window.history.back(); 
                            }
                        }
                    }, React.createElement(ArrowRight, { className: 'w-4 h-4 rotate-180' }), '返回')
                ),
                React.createElement('div', { className: 'text-center mb-12' },
                    React.createElement('h1', { className: 'text-4xl font-extrabold text-slate-900 mb-4' }, '面试宝典'),
                    React.createElement('p', { className: 'text-xl text-slate-600' }, '精选技术栈面试题与知识点，助你通关')
                ),
                React.createElement('div', { className: 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' },
                    categories.map(c => React.createElement('div', { 
                        key: c.id, 
                        className: 'bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 cursor-pointer border border-slate-100 group',
                        onClick: () => { 
                            window.history.pushState({}, '', `/interview/category/${c.id}`);
                            window.dispatchEvent(new Event('popstate'));
                        }
                    },
                        React.createElement('div', { className: 'flex items-start justify-between mb-4' },
                            React.createElement('div', { className: 'w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center' },
                                React.createElement(Layers, { className: 'w-6 h-6' })
                            ),
                            React.createElement(ArrowRight, { className: 'w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors' })
                        ),
                        React.createElement('h3', { className: 'text-xl font-bold text-slate-900 mb-2' }, c.name),
                        React.createElement('p', { className: 'text-slate-500 text-sm mb-4 break-words whitespace-pre-wrap' }, c.description || '暂无描述'),
                        React.createElement('div', { className: 'flex items-center gap-4 text-xs text-slate-400' },
                            React.createElement('span', null, '包含子分类')
                        )
                    ))
                )
            )
        );
    };

    // 2. Level 2: InterviewCategoryPage
    const InterviewCategoryPage = ({ id }) => {
        const [categories, setCategories] = useState([]);
        const [currentCat, setCurrentCat] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            setLoading(true);
            Promise.all([
                fetchCategories(id),
                fetchCategory(id)
            ]).then(([cats, cat]) => {
                setCategories(cats);
                setCurrentCat(cat);
            }).catch(console.error).finally(()=>setLoading(false));
        }, [id]);

        if (loading) return React.createElement('div', {className:'p-10 text-center text-gray-500'}, '加载中...');

        return React.createElement('div', { className: 'min-h-screen bg-slate-50 py-12 px-4 md:px-6' },
            React.createElement('div', { className: 'max-w-7xl mx-auto' },
                React.createElement(Breadcrumb, {
                    items: [
                        { label: currentCat ? currentCat.name : '...', onClick: null }
                    ]
                }),
                React.createElement('div', { className: 'mb-10' },
                    React.createElement('h1', { className: 'text-3xl font-bold text-slate-900' }, '选择具体模块'),
                    React.createElement('p', { className: 'text-slate-600 mt-2' }, '请选择您感兴趣的领域进行深入学习')
                ),
                React.createElement('div', { className: 'grid md:grid-cols-3 lg:grid-cols-4 gap-6' },
                    categories.map(c => React.createElement('div', { 
                        key: c.id, 
                        className: 'bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 cursor-pointer border border-slate-100 group flex flex-col',
                        onClick: () => { 
                            window.history.pushState({}, '', `/interview/items?categoryId=${c.id}`);
                            window.dispatchEvent(new Event('popstate'));
                        }
                    },
                        React.createElement('div', { className: 'flex items-center justify-between mb-4' },
                            React.createElement('div', { className: 'w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center' },
                                React.createElement(Folder, { className: 'w-5 h-5' })
                            ),
                            React.createElement(ArrowRight, { className: 'w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors' })
                        ),
                        React.createElement('h3', { className: 'text-lg font-bold text-slate-900 mb-1' }, c.name),
                        React.createElement('p', { className: 'text-slate-500 text-xs mb-0 break-words whitespace-pre-wrap' }, c.description || '暂无描述')
                    ))
                ),
                categories.length === 0 && React.createElement('div', { className: 'text-center text-gray-500 py-20' }, '该分类下暂无内容')
            )
        );
    };

    // 3. Level 3: InterviewItemsPage
    const InterviewItemsPage = ({ categoryId }) => {
        const [items, setItems] = useState([]);
        const [activeTab, setActiveTab] = useState('1'); // '1': Knowledge, '2': Question
        const [currentCat, setCurrentCat] = useState(null);
        const [parentCat, setParentCat] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            setLoading(true);
            Promise.all([
                fetchItems(categoryId, activeTab),
                fetchCategory(categoryId)
            ]).then(([itemsData, catData]) => {
                setItems(itemsData);
                setCurrentCat(catData);
                if (catData.parentId) {
                    return fetchCategory(catData.parentId).then(setParentCat);
                }
            }).catch(console.error).finally(()=>setLoading(false));
        }, [categoryId, activeTab]);

        return React.createElement('div', { className: 'min-h-screen bg-slate-50 py-8 px-4 md:px-6' },
            React.createElement('div', { className: 'max-w-5xl mx-auto' },
                 React.createElement(Breadcrumb, {
                    items: [
                        parentCat && { 
                            label: parentCat.name, 
                            onClick: () => {
                                window.history.pushState({}, '', `/interview/category/${parentCat.id}`);
                                window.dispatchEvent(new Event('popstate'));
                            }
                        },
                        { label: currentCat ? currentCat.name : '...', onClick: null }
                    ].filter(Boolean)
                }),
                
                React.createElement('div', { className: 'bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden' },
                    // Header & Tabs
                    React.createElement('div', { className: 'border-b border-slate-100 px-6 pt-6' },
                        React.createElement('div', { className: 'flex items-center gap-8' },
                            React.createElement('button', { 
                                className: `pb-4 px-2 text-base font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab==='1'?'border-blue-600 text-blue-600':'border-transparent text-slate-500 hover:text-slate-700'}`,
                                onClick: () => setActiveTab('1')
                            }, React.createElement(BookOpen, { className: 'w-4 h-4' }), '知识点学习'),
                            React.createElement('button', { 
                                className: `pb-4 px-2 text-base font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab==='2'?'border-blue-600 text-blue-600':'border-transparent text-slate-500 hover:text-slate-700'}`,
                                onClick: () => setActiveTab('2')
                            }, React.createElement(FileText, { className: 'w-4 h-4' }), '面试题库')
                        )
                    ),
                    
                    // Content
                    React.createElement('div', { className: 'p-6 min-h-[400px]' },
                        loading ? React.createElement('div', { className: 'text-center py-20 text-slate-400' }, '加载中...') :
                        items.length === 0 ? React.createElement('div', { className: 'text-center py-20 text-slate-400' }, '暂无数据') :
                        React.createElement('div', { className: 'space-y-6' },
                            items.map((item, idx) => React.createElement('div', { key: item.id, className: 'border-b border-slate-50 last:border-0 pb-6 last:pb-0' },
                                React.createElement('div', { className: 'flex items-start gap-3' },
                                    React.createElement('span', { className: 'bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded mt-1 shrink-0' }, `Q${idx+1}`),
                                    React.createElement('div', { className: 'flex-1' },
                                        React.createElement('h3', { className: 'text-lg font-bold text-slate-800 mb-3 break-words', style: { wordBreak: 'break-word', overflowWrap: 'anywhere' } }, item.title || item.question),
                                        React.createElement('div', { 
                                            className: 'max-w-none bg-slate-50 p-4 rounded-lg text-slate-600 text-sm leading-relaxed overflow-x-auto',
                                            style: { whiteSpace: 'pre-wrap', wordBreak: 'break-word' }
                                        }, 
                                            (item.solution || '暂无详解').split('\n').map((line, i) => 
                                                React.createElement('p', { 
                                                    key: i, 
                                                    className: 'mb-2 last:mb-0',
                                                    style: { whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }
                                                }, line)
                                            )
                                        )
                                    )
                                )
                            ))
                        )
                    )
                )
            )
        );
    };

    if (!window.Components) window.Components = {};
    window.Components.InterviewHomePage = InterviewHomePage;
    window.Components.InterviewCategoryPage = InterviewCategoryPage;
    window.Components.InterviewItemsPage = InterviewItemsPage;
})();
