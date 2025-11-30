(() => {
  const z = 1350;
  const addStyle = () => {
    if (document.getElementById('donation-style')) return;
    const s = document.createElement('style');
    s.id = 'donation-style';
    s.textContent = `
      @keyframes donation-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
      @keyframes donation-pulse { 0%{box-shadow:0 0 0 0 rgba(59,130,246,0.7)} 70%{box-shadow:0 0 0 12px rgba(59,130,246,0)} 100%{box-shadow:0 0 0 0 rgba(59,130,246,0)} }
      .donation-btn { position: fixed; right: 24px; bottom: 24px; z-index: ${z}; padding: 10px 14px; border-radius: 9999px; color: #fff; background: linear-gradient(135deg,#2563eb,#22d3ee); font-weight: 700; letter-spacing: .5px; display: inline-flex; align-items: center; gap: 8px; animation: donation-bounce 6s ease-in-out infinite, donation-pulse 2.6s infinite; filter: saturate(1.2); }
      .donation-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: ${z}; display: flex; align-items: center; justify-content: center; padding: 16px; }
      .donation-modal { width: 92vw; max-width: 680px; background: #fff; border-radius: 16px; box-shadow: 0 25px 50px rgba(2,6,23,.25); overflow: hidden; }
      .donation-modal-header { display:flex; align-items:center; justify-content:space-between; padding: 12px 16px; background: #0ea5e9; color:#fff; font-weight: 700; }
      .donation-modal-body { padding: 16px; background:#fff; }
      .donation-actions { display:flex; justify-content:flex-end; gap: 8px; padding: 12px 16px; border-top: 1px solid #e2e8f0; }
      .donation-btn-small { padding:8px 12px; border-radius:10px; font-weight:600; }
      .donation-cancel { background:#eef2ff; color:#334155; }
      .donation-confirm { background:#2563eb; color:#fff; }
      .donation-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .donation-card { border:1px solid #e2e8f0; border-radius:12px; padding:10px; }
      .donation-title { font-weight:700; color:#0f172a; margin-bottom:8px; }
      .donation-img { width:100%; aspect-ratio:1/1; object-fit:contain; border-radius:10px; background:#f8fafc; }
      .donation-tip { font-size:12px; color:#475569; margin-top:6px; }
    `;
    document.head.appendChild(s);
  };

  const parseCodes = (val) => {
    let wechat = null, alipay = null;
    try {
      const d = typeof val === 'string' ? JSON.parse(val) : val;
      if (d && typeof d === 'object') { wechat = d.wechat || d.wx || d.weixin; alipay = d.alipay || d.zhifubao; }
    } catch(_) {}
    if (!wechat && !alipay && typeof val === 'string') {
      const s = val.trim();
      const parts = s.split(/[,;\n]/).map(x=>x.trim()).filter(Boolean);
      if (parts.length >= 2) { [wechat, alipay] = parts; }
      else if (parts.length === 1) { wechat = parts[0]; }
      const mW = s.match(/wechat\s*[:=]\s*(\S+)/i); if (mW) wechat = mW[1];
      const mA = s.match(/alipay\s*[:=]\s*(\S+)/i); if (mA) alipay = mA[1];
    }
    return { wechat, alipay };
  };

  const showModal = async () => {
    addStyle();
    const backdrop = document.createElement('div'); backdrop.className = 'donation-modal-backdrop';
    const box = document.createElement('div'); box.className = 'donation-modal'; backdrop.appendChild(box);
    box.innerHTML = `
      <div class="donation-modal-header">
        <span>是否资助 UP 主</span>
        <button id="don-close" class="donation-btn-small donation-cancel">关闭</button>
      </div>
      <div class="donation-modal-body" id="don-body">
        <div style="margin-bottom:12px;color:#0f172a">点击确认后，将展示微信与支付宝收款码,一分也是爱。</div>
      </div>
      <div class="donation-actions">
        <button id="don-cancel" class="donation-btn-small donation-cancel">取消</button>
        <button id="don-ok" class="donation-btn-small donation-confirm">确认</button>
      </div>
    `;
    document.body.appendChild(backdrop);
    const close = () => { try{ document.body.removeChild(backdrop); }catch(_){} };
    box.querySelector('#don-close').onclick = close;
    box.querySelector('#don-cancel').onclick = close;
    box.querySelector('#don-ok').onclick = async () => {
      const body = box.querySelector('#don-body');
      body.innerHTML = '<div style="color:#334155">加载收款码中...</div>';
      try {
        const r = await fetch('/api/v1/configs', { credentials:'same-origin' });
        const t = await r.text(); let arr = []; try { arr = JSON.parse(t||'[]'); } catch(_) {}
        const item = (Array.isArray(arr) ? arr : []).find(x => (x && (x.configKey||x.config_key||'')).toString().toUpperCase() === 'TEXT');
        const val = item ? (item.configValue || item.config_value || '') : '';
        const { wechat, alipay } = parseCodes(val || '');
        const w = wechat || ''; const a = alipay || '';
        body.innerHTML = `
          <div class="donation-grid">
            <div class="donation-card">
              <div class="donation-title">微信收款码</div>
              ${w ? `<img src="${w}" alt="微信收款码" class="donation-img"/>` : '<div class="donation-tip">未配置</div>'}
            </div>
            <div class="donation-card">
              <div class="donation-title">支付宝收款码</div>
              ${a ? `<img src="${a}" alt="支付宝收款码" class="donation-img"/>` : '<div class="donation-tip">未配置</div>'}
            </div>
          </div>
          <div class="donation-tip">感谢您的支持！复制二维码或长按保存后在对应 App 识别。</div>
        `;
      } catch(_) {
        body.innerHTML = '<div style="color:#ef4444">加载失败，请稍后重试</div>';
      }
    };
  };

  const mountBtn = () => {
    addStyle();
    if (document.getElementById('donation-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'donation-btn';
    btn.className = 'donation-btn';
    btn.innerText = '鼓励';
    btn.onclick = showModal;
    document.body.appendChild(btn);
  };

  document.addEventListener('DOMContentLoaded', mountBtn);
  window.addEventListener('modules:loaded', mountBtn);
  try { window.dispatchEvent(new Event('modules:loaded')); } catch(_){ }
})();

