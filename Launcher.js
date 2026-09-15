if (!document.getElementById("lchRootBox")) {

  var LMS360_URL = "https://raw.githubusercontent.com/minhReal/mainM/refs/heads/main/L2.js";
  var EDUXBOX_URL = "https://raw.githubusercontent.com/minhReal/mainM/refs/heads/main/E.js";
  var LCH_VERSION = "v26.1.1";

  var LCH_CHANGELOG = [
    { date: "2026-09-15", tag: "LAUNCHER", version: "v26.1.1", note: "Edit lms360 link" },
    { date: "2026-08-25", tag: "LAUNCHER", version: "v26.1.0", note: "Newly released" },
//    { date: "2026-08-20", tag: "LMS",      version: "v26.1.0",        note: "" },
//    { date: "2026-08-18", tag: "EDUXBOX",  version: "v26.1.0",        note: "" }
  ];

 // --- Things ---
  var TAG_COLORS = {
    LMS: "#e74c3c",
    EDUXBOX: "#2563eb",
    LAUNCHER: "#7c3aed"
  };

  var mainWrapper = document.createElement('div');
  mainWrapper.id = 'lchRootBox';
  mainWrapper.style.cssText = 'position:fixed;top:70px;left:20px;z-index:2147483647;user-select:none;touch-action:none;font-family:"Segoe UI",Roboto,Arial,sans-serif;display:flex;align-items:flex-start;';

  var style = document.createElement('style');
  style.innerHTML = `
    #lchRootBox .lch-header-btn{background:rgba(255,255,255,0.2);border:none;color:white;width:26px;height:26px;border-radius:6px;cursor:pointer}
    #lchRootBox .lch-customBtn{width:100%;padding:12px;border:none;border-radius:10px;color:white;font-size:15px;cursor:pointer;font-weight:700;margin-top:8px;transition:background 0.25s,box-shadow 0.25s,transform 0.1s}
    #lchRootBox .lch-customBtn:active{transform:scale(0.97)}
    #lchRootBox .lch-customBtn:disabled{opacity:0.6;cursor:default;transform:none}
    #lchRootBox #lchBtnLMS360{background:linear-gradient(135deg,#c0392b,#e74c3c);box-shadow:0 4px 12px rgba(192,57,43,0.35)}
    #lchRootBox #lchBtnEDUXBOX{background:linear-gradient(135deg,#1d4ed8,#2563eb);box-shadow:0 4px 12px rgba(37,99,235,0.35)}
    #lchRootBox #lchStatus{font-size:12px;color:#666;text-align:center;min-height:16px;margin-top:6px;}
    .lch-smooth-transition{transition:all 0.3s ease!important}
    #lchRootBox .lch-tabbar{display:flex;gap:4px;padding:8px 8px 0 8px;background:#fff;}
    #lchRootBox .lch-tabbtn{flex:1;padding:8px 0;text-align:center;font-size:13px;font-weight:600;color:#7c3aed;background:#f3eefc;border:none;border-radius:8px 8px 0 0;cursor:pointer;}
    #lchRootBox .lch-tabbtn.lch-active{background:#7c3aed;color:#fff;}
    #lchRootBox .lch-tabpage{display:none;}
    #lchRootBox .lch-tabpage.lch-active{display:block;}
    #lchRootBox .lch-logscroll{max-height:260px;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;}
    #lchRootBox .lch-logitem{background:#f7f5fb;border-radius:10px;padding:8px 10px;border-left:4px solid #7c3aed;}
    #lchRootBox .lch-logtop{display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;}
    #lchRootBox .lch-logtag{font-size:10px;font-weight:800;color:#fff;padding:2px 7px;border-radius:6px;letter-spacing:0.3px;}
    #lchRootBox .lch-logdate{font-size:10px;color:#888;}
    #lchRootBox .lch-logver{font-size:11px;color:#7c3aed;font-weight:700;margin-bottom:2px;}
    #lchRootBox .lch-lognote{font-size:12px;color:#333;line-height:1.4;}
  `;
  document.head.appendChild(style);

  var dragItem = document.createElement('div');
  dragItem.id = 'lchGui';
  dragItem.className = 'lch-smooth-transition';
  dragItem.style.cssText = 'width:270px;background:#fff;border-radius:14px;box-shadow:0 10px 28px rgba(107,33,168,0.28);overflow:hidden;position:relative;z-index:10;';
  dragItem.innerHTML = `
    <header id="lchDragHeader" style="cursor:move;display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:linear-gradient(135deg,#6d28d9,#8b5cf6);color:white;">
      <div>
        <div style="font-weight:700;font-size:14px;line-height:1;">Launcher</div>
        <div style="font-size:11px;opacity:0.85;">${LCH_VERSION}</div>
      </div>
      <div style="display:flex;gap:5px;">
        <button id="lchToggleBtn" class="lch-header-btn">-</button>
        <button id="lchCloseBtn" class="lch-header-btn">x</button>
      </div>
    </header>
    <div id="lchBody">
      <div class="lch-tabbar">
        <button class="lch-tabbtn lch-active" data-tab="lchTabMain">Main</button>
        <button class="lch-tabbtn" data-tab="lchTabLogs">Logs</button>
      </div>
      <div id="lchTabMain" class="lch-tabpage lch-active">
        <div id="lchContent" style="padding:14px;color:#000;background:#fff;">
          <button id="lchBtnLMS360" class="lch-customBtn">LMS360</button>
          <button id="lchBtnEDUXBOX" class="lch-customBtn">EDUXBOX</button>
          <div id="lchStatus"></div>
        </div>
      </div>
      <div id="lchTabLogs" class="lch-tabpage">
        <div id="lchLogScroll" class="lch-logscroll"></div>
      </div>
    </div>
  `;

  mainWrapper.appendChild(dragItem);
  document.body.appendChild(mainWrapper);

  // --- Tab switching ---
  var tabBtns = mainWrapper.querySelectorAll('.lch-tabbtn');
  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      tabBtns.forEach(function(b) { b.classList.remove('lch-active'); });
      mainWrapper.querySelectorAll('.lch-tabpage').forEach(function(p) { p.classList.remove('lch-active'); });
      btn.classList.add('lch-active');
      mainWrapper.querySelector('#' + btn.dataset.tab).classList.add('lch-active');
    });
  });

  // --- Render Logs ---
  function renderLogs() {
    var sorted = LCH_CHANGELOG.slice().sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    var scrollBox = mainWrapper.querySelector('#lchLogScroll');
    scrollBox.innerHTML = sorted.map(function(item) {
      var color = TAG_COLORS[item.tag] || '#7c3aed';
      return `
        <div class="lch-logitem" style="border-left-color:${color};">
          <div class="lch-logtop">
            <span class="lch-logtag" style="background:${color};">${item.tag}</span>
            <span class="lch-logdate">${item.date}</span>
          </div>
          <div class="lch-logver">${item.version || ''}</div>
          <div class="lch-lognote">${item.note}</div>
        </div>
      `;
    }).join('');
  }
  renderLogs();

  // --- Draggable ---
  var isDragging = false, offset = {x:0,y:0};
  var hdr = mainWrapper.querySelector('#lchDragHeader');
  hdr.addEventListener('mousedown', e => {
    if (e.target.closest('button')) return;
    isDragging = true;
    const r = mainWrapper.getBoundingClientRect();
    offset = {x: e.clientX - r.left, y: e.clientY - r.top};
  });
  hdr.addEventListener('touchstart', e => {
    if (e.target.closest('button')) return;
    isDragging = true;
    const r = mainWrapper.getBoundingClientRect();
    offset = {x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top};
  }, {passive:false});
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    mainWrapper.style.left = (e.clientX - offset.x) + 'px';
    mainWrapper.style.top = (e.clientY - offset.y) + 'px';
  });
  document.addEventListener('touchmove', e => {
    if (!isDragging) return;
    e.preventDefault();
    mainWrapper.style.left = (e.touches[0].clientX - offset.x) + 'px';
    mainWrapper.style.top = (e.touches[0].clientY - offset.y) + 'px';
  }, {passive:false});
  document.addEventListener('mouseup', () => isDragging = false);
  document.addEventListener('touchend', () => isDragging = false);

  mainWrapper.querySelector('#lchCloseBtn').onclick = () => mainWrapper.remove();
  mainWrapper.querySelector('#lchToggleBtn').onclick = () => {
    var c = mainWrapper.querySelector('#lchBody');
    c.style.display = c.style.display === 'none' ? 'block' : 'none';
  };

  var statusEl = mainWrapper.querySelector('#lchStatus');

  function injectAsRealScript(js) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.text = js;
    document.body.appendChild(s);
    document.body.removeChild(s);
  }

  mainWrapper.querySelector('#lchBtnLMS360').onclick = function() {
    var btn = this, label = this.textContent;
    btn.disabled = true;
    statusEl.textContent = 'Loading...';
    fetch(LMS360_URL)
      .then(res => { if(!res.ok) throw new Error('Unable to fetch JS file (' + res.status + ')'); return res.text(); })
      .then(js => { injectAsRealScript(js); statusEl.textContent = 'Executed: ' + label; })
      .catch(err => { statusEl.textContent = 'Error: ' + err.message; console.error('Error khi load script:', err); })
      .finally(() => { btn.disabled = false; });
  };

  mainWrapper.querySelector('#lchBtnEDUXBOX').onclick = function() {
    var btn = this, label = this.textContent;
    btn.disabled = true;
    statusEl.textContent = 'Loading...';
    fetch(EDUXBOX_URL)
      .then(res => { if(!res.ok) throw new Error('Unable to fetch JS file (' + res.status + ')'); return res.text(); })
      .then(js => { injectAsRealScript(js); statusEl.textContent = 'Executed: ' + label; })
      .catch(err => { statusEl.textContent = '??Error: ' + err.message; console.error('Error khi load script:', err); })
      .finally(() => { btn.disabled = false; });
  };

  console.log("Launcher loaded " + LCH_VERSION);
}
