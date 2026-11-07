/* Casa Nunes Gestão: camada de visual (estilo Apple).
   Só muda a aparência. Não mexe em vendas, pedidos, caixa nem no banco.
   Carregado no fim do index.html. Para desfazer: tirar a linha do visual-gestao.js do index.html. */
(function () {
  var CSS = `
:root{--vx-r:16px;--vx-ease:cubic-bezier(.23,1,.32,1)}
/* cantos: 3 tamanhos so (cartao 16, painel 20, pilula) */
.tile,.oc,.box,.card,.sumbox{border-radius:var(--vx-r)!important}
.shell{border-radius:20px!important}
.cart{border-radius:20px 20px 0 0!important}
/* cartao de destaque: sem degrade, escuro e calmo */
.tile.acc{background:var(--ink)!important;color:var(--onInk)!important}
.tile.acc .th,.tile.acc .td,.tile.acc .tv{color:var(--onInk)!important}
.tile.acc .th i,.tile.acc .chip{background:rgba(255,255,255,.14)!important;color:var(--onInk)!important}
/* sem listras decorativas */
.hatch{background:var(--accL)!important}
.pb{background:var(--soft)!important}
.lw .la .deco{display:none!important}
/* total da venda neutro, nao rosa */
.sumbox{background:var(--soft)!important}
/* acao boa em verde; cancelar separado */
.ob .btn.acc{background:var(--ok)!important;color:#fafaf9!important}
.oc .ob2 .btn.wa{background:var(--card)!important;color:#15803d!important;border:1px solid var(--line)}
.oc .ob2 .btn.wa svg{fill:#15803d!important}
details.vx-more{grid-column:1/-1;margin-top:10px}
details.vx-more>summary{list-style:none;cursor:pointer;font-size:.8125rem;font-weight:600;color:var(--ink2);padding:10px 4px;min-height:44px;display:flex;align-items:center;gap:6px}
details.vx-more>summary::-webkit-details-marker{display:none}
details.vx-more>summary::after{content:"";width:7px;height:7px;border:solid currentColor;border-width:0 2px 2px 0;transform:rotate(45deg) translateY(-2px);transition:transform 200ms var(--vx-ease)}
details.vx-more[open]>summary::after{transform:rotate(225deg)}
.vx-more-list{display:flex;flex-wrap:wrap;gap:8px}
.vx-more-list .vx-danger{color:var(--bad)!important;margin-left:auto}
/* toque: o botao afunda no instante do dedo */
button,.btn,.pill,a.btn{transition:transform 100ms var(--vx-ease),filter 150ms ease}
button:active,.btn:active,.pill:active{transform:scale(.97)}
/* data numa linha so */
td.vx-nw{white-space:nowrap}
/* barra de abas do celular: vidro fosco, 5 abas */
@media (max-width:900px){
  .bnav{background:color-mix(in srgb,var(--card) 78%,transparent)!important;backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border-top:1px solid var(--line)}
  .bnav>button.vx-hide{display:none!important}
}
dialog.vx-sheet{border:0;padding:8px 16px calc(16px + env(safe-area-inset-bottom));margin:auto auto 0;width:100%;max-width:560px;border-radius:20px 20px 0 0;background:var(--card);color:var(--ink);transform:translateY(0);transition:transform 300ms var(--vx-ease),opacity 200ms ease}
dialog.vx-sheet::backdrop{background:rgba(0,0,0,.35)}
dialog.vx-sheet .vx-grab{width:36px;height:5px;border-radius:99px;background:var(--line);margin:4px auto 12px}
dialog.vx-sheet button{display:flex;align-items:center;gap:12px;width:100%;min-height:52px;border:0;background:none;color:var(--ink);font:600 1rem inherit;padding:0 8px;border-radius:12px;text-align:left}
dialog.vx-sheet button:hover{background:var(--soft)}
dialog.vx-sheet svg{width:22px;height:22px}

#vx-upd{position:fixed;left:50%;bottom:calc(96px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:9000;display:flex;gap:12px;align-items:center;background:var(--ink);color:var(--onInk);padding:10px 10px 10px 16px;border-radius:99px;box-shadow:0 6px 20px rgba(0,0,0,.25);font-size:.875rem;font-weight:600}
#vx-upd button{border:0;border-radius:99px;padding:9px 14px;background:var(--ok);color:#fafaf9;font:inherit;cursor:pointer;min-height:40px}
@media(min-width:901px){#vx-upd{bottom:24px}}
@media (prefers-reduced-motion:reduce){*{transition-duration:0ms!important}button:active,.btn:active,.pill:active{transform:none}}
@media (prefers-reduced-transparency:reduce){.bnav{background:var(--card)!important;backdrop-filter:none!important}}
`;
  var st = document.createElement('style'); st.id = 'vx-css'; st.textContent = CSS;
  document.head.appendChild(st);

  /* letra em rem: acompanha o tamanho de letra escolhido no celular */
  function remify() {
    [].forEach.call(document.styleSheets, function (s) {
      var rules; try { rules = s.cssRules; } catch (e) { return; }
      (function walk(list) {
        [].forEach.call(list, function (r) {
          if (r.cssRules) walk(r.cssRules);
          if (r.style && /px$/.test(r.style.fontSize)) {
            var px = parseFloat(r.style.fontSize), imp = r.style.getPropertyPriority('font-size');
            if (px >= 16 && /input|select|textarea/.test(r.selectorText || '')) return; /* evita zoom do iPhone */
            r.style.setProperty('font-size', (px / 16) + 'rem', imp);
          }
        });
      })(rules);
    });
  }

  var MAIN = ['geral', 'pdv', 'pedidos', 'caixa'];
  function arrumar() {
    /* 1. Cumprimento: "Bom dia", sem "Administração" */
    document.querySelectorAll('.hello h1').forEach(function (h) {
      if (/,\s*Administra/.test(h.textContent)) h.textContent = h.textContent.replace(/,\s*Administra\S*/, '');
    });
    /* 2. Frase cortada "que o mês passado" sem numero */
    document.querySelectorAll('.mut').forEach(function (m) {
      if (/^que o m[eê]s passado$/.test(m.textContent.trim()) && !m.parentElement.querySelector('.chip')) m.parentElement.style.display = 'none';
    });
    /* 3. Plural e traço vazio */
    var w = document.createTreeWalker(document.getElementById('view') || document.body, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) {
      if (/\b1 movimentos\b/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace('1 movimentos', '1 movimento');
      if (n.nodeValue.trim() === '\u2014' && n.parentElement && n.parentElement.tagName === 'TD') n.nodeValue = 'Não informado';
    }
    /* 4. Data numa linha */
    document.querySelectorAll('td').forEach(function (td) {
      if (!td.classList.contains('vx-nw') && /^\d{2}\/\d{2}(\s|$)/.test(td.textContent.trim())) td.classList.add('vx-nw');
    });
    /* 5. Pedido: Troca, Cancelar e Historico vao para "Mais opções" */
    document.querySelectorAll('.oc .ob2:not([data-vx])').forEach(function (row) {
      row.setAttribute('data-vx', '1');
      var mover = [].filter.call(row.children, function (b) { return /fTroca|fCanc|hist/.test(b.getAttribute('onclick') || ''); });
      if (!mover.length) return;
      var d = document.createElement('details'); d.className = 'vx-more';
      d.innerHTML = '<summary>Mais opções</summary><div class="vx-more-list"></div>';
      var list = d.lastChild;
      mover.forEach(function (b) {
        if (/fCanc/.test(b.getAttribute('onclick') || '')) b.classList.add('vx-danger');
        list.appendChild(b);
      });
      list.appendChild(list.querySelector('.vx-danger') || document.createTextNode(''));
      row.after(d);
      if (!row.children.length) row.style.display = 'none';
    });
    /* 6. Barra de abas do celular: 4 abas + Mais */
    var nav = document.getElementById('bnav');
    if (nav && !nav.querySelector('.vx-maisbtn')) {
      var extra = [];
      [].forEach.call(nav.children, function (b) {
        var k = ((b.getAttribute('onclick') || '').match(/go\('(\w+)'\)/) || [])[1];
        if (k && MAIN.indexOf(k) < 0) { b.classList.add('vx-hide'); extra.push(b); }
      });
      if (extra.length) {
        var mb = document.createElement('button'); mb.className = 'vx-maisbtn'; mb.type = 'button';
        mb.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>Mais';
        if (extra.some(function (b) { return b.classList.contains('on'); })) mb.classList.add('on');
        mb.onclick = function () { abrirMais(extra); };
        nav.appendChild(mb);
      }
    }
  }

  function abrirMais(extra) {
    var dlg = document.getElementById('vx-sheet');
    if (!dlg) {
      dlg = document.createElement('dialog'); dlg.id = 'vx-sheet'; dlg.className = 'vx-sheet';
      dlg.setAttribute('aria-label', 'Mais telas');
      dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
      document.body.appendChild(dlg);
    }
    dlg.innerHTML = '<div class="vx-grab"></div>';
    extra.forEach(function (b) {
      var c = document.createElement('button'); c.type = 'button'; c.innerHTML = b.innerHTML;
      c.onclick = function () { dlg.close(); b.click(); };
      dlg.appendChild(c);
    });
    dlg.showModal();
  }

  /* Modo escuro automatico, se a pessoa usa o celular no escuro */
  try {
    if (!localStorage.getItem('cn-tema') && matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark');
  } catch (e) {}


  /* ===== Atualizacao automatica do app instalado =====
     Pergunta ao servidor se a pagina mudou (impressao digital/ETag muda a cada publicacao).
     Mudou: atualiza sozinho se a pessoa nao estiver no meio de algo; se estiver, mostra aviso. */
  var vxEtag = null;
  function vxImpressao() {
    return fetch('/?vx=' + Date.now(), { cache: 'no-store', credentials: 'same-origin' })
      .then(function (r) { return r.ok ? (r.headers.get('etag') || '') : null; })
      .catch(function () { return null; });
  }
  function vxAtualizar() {
    if (typeof window.atualizarApp === 'function') return window.atualizarApp();
    location.reload();
  }
  function vxAviso() {
    if (document.getElementById('vx-upd')) return;
    var d = document.createElement('div'); d.id = 'vx-upd'; d.setAttribute('role', 'status');
    d.innerHTML = '<span>Versão nova do sistema</span><button type="button">Atualizar agora</button>';
    d.querySelector('button').onclick = vxAtualizar;
    document.body.appendChild(d);
  }
  function vxChecar() {
    if (location.protocol !== 'https:' || !navigator.onLine) return;
    vxImpressao().then(function (e) {
      if (!e) return;
      if (vxEtag === null) { vxEtag = e; return; }
      if (e === vxEtag) return;
      var ocupado = typeof window.ocupado === 'function' && window.ocupado();
      if (ocupado || document.querySelector('dialog[open],.modal.on,.modal.open')) vxAviso(); else vxAtualizar();
    });
  }
  vxChecar();
  setInterval(vxChecar, 120000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') vxChecar(); });
  window.addEventListener('focus', vxChecar);
  window.addEventListener('online', vxChecar);

  /* Botao fixo de atualizar no topo, ao lado do sino */
  function vxBotao() {
    if (document.getElementById('vx-refresh')) return;
    var sino = [].find.call(document.querySelectorAll('header button, .hr button, .icb'), function (b) { return /notif|sino|bell/i.test(b.outerHTML) || b.classList.contains('icb'); });
    var lugar = (sino && sino.parentElement) || document.querySelector('header .hr') || document.querySelector('header');
    if (!lugar) return;
    var b = document.createElement('button'); b.id = 'vx-refresh'; b.type = 'button'; b.className = (sino && sino.className) || 'icb';
    b.title = 'Atualizar o sistema'; b.setAttribute('aria-label', 'Atualizar o sistema');
    b.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>';
    b.onclick = function () { b.disabled = true; b.style.opacity = '.5'; vxAtualizar(); };
    if (sino) lugar.insertBefore(b, sino); else lugar.appendChild(b);
  }

  remify();
  var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(function () { arrumar(); vxBotao(); }, 30); })
    .observe(document.body, { childList: true, subtree: true });
  arrumar(); vxBotao();
})();
