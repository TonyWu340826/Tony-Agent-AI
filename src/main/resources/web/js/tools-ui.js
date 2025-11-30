const ToolsUI = () => {
  const Terminal = (props) => React.createElement('svg',{className:props.className,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'},React.createElement('path',{d:'M4 4h16v16H4z'}),React.createElement('path',{d:'M7 8l3 3-3 3'}),React.createElement('path',{d:'M13 16h4'}));
  const Github = (props) => React.createElement('svg',{className:props.className,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'},React.createElement('path',{d:'M12 2C7 2 3 6 3 11c0 4 3 7 7 8v-2c-2 0-2-1-3-2 2 0 3-1 3-1-1 0-2-1-2-2 .5 0 1 .2 1 .2 0-1-.7-1.5-1.5-1.8 1-.1 1.5.7 1.5.7.5-.8 1.3-1 2-1s1.5.2 2 1c0 0 .5-.8 1.5-.7-.8.3-1.5.8-1.5 1.8 0 0 .5-.2 1-.2 0 1-1 2-2 2 0 0 1 1 3 1-1 1-1 2-3 2v2c4-1 7-4 7-8 0-5-4-9-9-9z'}));
  const BookOpen = (props) => React.createElement('svg',{className:props.className,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'},React.createElement('path',{d:'M2 5h8a3 3 0 013 3v11H5a3 3 0 01-3-3V5z'}),React.createElement('path',{d:'M22 5h-8a3 3 0 00-3 3v11h8a3 3 0 003-3V5z'}));
  const items = [
    {name:'开发平台', desc:'快速进入平台控制台', icon:Terminal, onClick:()=>window.open('http://116.62.120.101:8088/signin','_blank')},
    {name:'GitHub', desc:'代码托管与协作', icon:Github, onClick:()=>window.open('https://github.com/TonyWu3408','_blank')},
    {name:'文档中心', desc:'平台使用文档', icon:BookOpen, onClick:()=>window.open('https://agijuejin.feishu.cn/wiki/UvJPwhfkiitMzhkhEfycUnS9nAm','_blank')}
  ];
  return React.createElement('div',{className:'grid md:grid-cols-3 gap-8'},
    items.map((t,i)=>React.createElement('div',{key:i,className:'bg-white rounded-2xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all cursor-pointer', onClick:t.onClick},
      React.createElement('div',{className:'w-12 h-12 bg-slate-900/5 rounded-xl flex items-center justify-center mb-4'}, React.createElement(t.icon,{className:'w-6 h-6 text-slate-900'})),
      React.createElement('div',{className:'text-xl font-semibold text-slate-900 mb-2'}, t.name),
      React.createElement('p',{className:'text-slate-600 text-sm'}, t.desc)
    ))
  );
};
window.Components = window.Components || {};
window.Components.ToolsUI = ToolsUI;
try { window.dispatchEvent(new Event('modules:loaded')); } catch(e) {}
