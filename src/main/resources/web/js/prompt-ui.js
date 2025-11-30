const PromptUI = () => {
  const cards = [
    { title:'文案增强', desc:'提升表达与结构', href:'#' },
    { title:'代码审阅', desc:'自动化建议与重构提示', href:'#' },
    { title:'需求澄清', desc:'生成问题清单与讨论纲要', href:'#' }
  ];
  return React.createElement('div',{className:'grid md:grid-cols-3 gap-6'},
    cards.map((c,i)=>React.createElement('div',{key:i,className:'bg-white rounded-2xl p-6 shadow border hover:shadow-lg transition'},
      React.createElement('div',{className:'text-lg font-semibold text-slate-900'}, c.title),
      React.createElement('div',{className:'text-sm text-slate-600 mt-1'}, c.desc),
      React.createElement('div',{className:'mt-3'}, React.createElement('a',{href:c.href, target:'_blank', className:'inline-block px-3 py-1 rounded bg-blue-600 text-white text-xs'}, '打开'))
    ))
  );
};
window.Components = window.Components || {};
window.Components.PromptUI = PromptUI;
try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}
