/* =============================================================
   Ciro Pizzo Art — logica del sito
   Non serve modificare questo file per aggiornare i contenuti:
   testi → js/testi.js · foto, giochi, contatti → js/contenuti.js
   ============================================================= */
(function () {
  'use strict';

  var SITO = window.SITO || {};
  var TESTI = window.TESTI || { it: {}, en: {} };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var el = function (tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    if (html != null) n.innerHTML = html;
    return n;
  };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ================= LINGUA ================= */
  function linguaIniziale() {
    var q = (location.search.match(/[?&]lang=(it|en)/) || [])[1];
    if (q) return q;
    try { var s = localStorage.getItem('cp-lingua'); if (s === 'it' || s === 'en') return s; } catch (e) {}
    return /^it/i.test(navigator.language || 'it') ? 'it' : 'en';
  }
  var lingua = linguaIniziale();
  function t(k, v) {
    var s = (TESTI[lingua] && TESTI[lingua][k]) || TESTI.it[k] || k;
    if (v) Object.keys(v).forEach(function (x) { s = s.split('{' + x + '}').join(v[x]); });
    return s;
  }
  // voce di una lista con eventuale traduzione  { ..., en: { ... } }
  function loc(o) { if (lingua !== 'it' && o && o[lingua]) { var r = {}; for (var k in o) r[k] = o[k]; for (var j in o[lingua]) r[j] = o[lingua][j]; return r; } return o; }
  // blocco con { it: ..., en: ... }
  function blocco(b) { return b ? (b[lingua] || b.it || b) : b; }

  // link WhatsApp con messaggio già scritto
  function waLink(msg) {
    var n = String((SITO.contatti || {}).whatsapp || '').replace(/\D/g, '');
    return n.length >= 8 ? 'https://wa.me/' + n + '?text=' + encodeURIComponent(msg) : '#grotta';
  }
  var ICONA_WA_PICCOLA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.4 18.6z"/><path d="M9.2 8.6c.3 2.6 2.4 4.9 5 5.4l1-1.2 1.9.9c-.2 1-1.1 1.6-2.1 1.5-3.6-.4-6.5-3.3-6.9-6.9-.1-1 .5-1.9 1.5-2.1l.9 1.9z"/></svg>';

  var scena = $('#scena');
  var camere = $$('.camera', scena);
  var stato = { fase: 0, camera: 0 }; // 0 sipario chiuso · 1 parete · 2 dentro

  /* ================= PERCORSO ================= */
  // il percorso numerato: lo Shop (data-fuori) è una pagina a parte
  var percorso = camere.map(function (c, k) { return k; }).filter(function (k) { return !camere[k].dataset.fuori; });
  function passo(d) {
    var p = percorso.indexOf(stato.camera);
    if (p < 0) return d > 0 ? percorso[0] : percorso[percorso.length - 1];
    return percorso[(p + d + percorso.length) % percorso.length];
  }
  function aggiornaNav() {
    var c = camere[stato.camera], p = percorso.indexOf(stato.camera);
    $$('#punti button').forEach(function (b) {
      var k = +b.dataset.k;
      b.setAttribute('aria-current', k === stato.camera ? 'true' : 'false');
      b.setAttribute('aria-label', t(camere[k].dataset.nome));
    });
    $('#conta-nome').textContent = t(c.dataset.nome);
    $('#conta-num').textContent = p < 0 ? 'Ciro Pizzo art' : (p + 1) + ' / ' + percorso.length;
    $('#navigazione').setAttribute('aria-label', lingua === 'it' ? 'Camere' : 'Rooms');
  }
  /* ---- il diaframma: chiude, cambia camera, riapre ---- */
  var LAME = 7, inTransizione = false, ridotto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function disegnaIride(svg, r, cx, cy, W, H, rot) {
    var pts = [], k, a;
    for (k = 0; k < LAME; k++) { a = rot + k * 2 * Math.PI / LAME; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    var d = 'M' + (cx - W) + ' ' + (cy - H) + 'H' + (cx + W) + 'V' + (cy + H) + 'H' + (cx - W) + 'Z';
    if (r > 0.5) d += 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z';
    var e = '', L = Math.max(W, H) * 2;
    if (r > 0.5) for (k = 0; k < LAME; k++) {
      var p0 = pts[k], p1 = pts[(k + 1) % LAME], dx = p0[0] - p1[0], dy = p0[1] - p1[1], m = Math.hypot(dx, dy) || 1;
      e += 'M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + 'L' + (p0[0] + dx / m * L).toFixed(1) + ' ' + (p0[1] + dy / m * L).toFixed(1);
    }
    svg.querySelector('.lame').setAttribute('d', d);
    svg.querySelector('.spigoli').setAttribute('d', e);
  }
  function anima(dur, fn, fine) {
    var t0 = performance.now();
    (function passo(t) {
      var x = Math.min(1, (t - t0) / dur), e = x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      fn(e); if (x < 1) requestAnimationFrame(passo); else if (fine) fine();
    })(t0);
  }
  var iride = $('#iride');
  function irideA(r) {
    var w = scena.clientWidth, h = scena.clientHeight;
    iride.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    disegnaIride(iride, r, w / 2, h / 2, w, h, (1 - r / Math.hypot(w, h)) * 1.4);
  }
  function conIride(cambia) {
    if (ridotto || inTransizione) { cambia(); return; }
    inTransizione = true;
    var R = Math.hypot(scena.clientWidth, scena.clientHeight) / 1.6;
    iride.classList.add('attiva');
    anima(420, function (e) { irideA(R * (1 - e)); }, function () {
      cambia();
      anima(650, function (e) { irideA(R * e); }, function () { iride.classList.remove('attiva'); inTransizione = false; });
    });
  }

  // verso il Boudoir: un telo di velluto rosso entra ondeggiando, copre e scivola via
  function conVelluto(cambia) {
    if (ridotto || inTransizione) { cambia(); return; }
    inTransizione = true;
    var v = $('#velluto-passa'), telo = v.firstElementChild; v.hidden = false;
    var dur = 1700;
    var an = telo.animate([
      { transform: 'translateX(-112%) skewX(14deg) scaleY(1.08)', borderRadius: '0 60% 60% 0 / 0 50% 50% 0' },
      { transform: 'translateX(-4%) skewX(-5deg) scaleY(1.02)', borderRadius: '0 18% 18% 0 / 0 50% 50% 0', offset: .38 },
      { transform: 'translateX(0) skewX(0deg) scaleY(1)', borderRadius: '0', offset: .5 },
      { transform: 'translateX(4%) skewX(5deg) scaleY(1.02)', borderRadius: '18% 0 0 18% / 50% 0 0 50%', offset: .62 },
      { transform: 'translateX(112%) skewX(-14deg) scaleY(1.08)', borderRadius: '60% 0 0 60% / 50% 0 0 50%' }
    ], { duration: dur, easing: 'cubic-bezier(.55,.05,.35,1)' });
    setTimeout(cambia, dur * .5);
    an.onfinish = function () { v.hidden = true; inTransizione = false; };
  }
  function vaiA(i) {
    if (stato.fase === 2 && camere[stato.camera].classList.contains('attiva') && ((i + camere.length) % camere.length) !== stato.camera) {
      var dest = camere[(i + camere.length) % camere.length];
      (dest.dataset.id === 'boudoir' ? conVelluto : conIride)(function () { mostraCamera(i); });
    } else mostraCamera(i);
  }
  function mostraCamera(i) {
    var n = camere.length;
    stato.camera = (i + n) % n;
    camere.forEach(function (c, k) {
      c.classList.toggle('attiva', k === stato.camera);
      c.classList.toggle('passata', k < stato.camera);
      c.setAttribute('aria-hidden', k === stato.camera ? 'false' : 'true');
      if (k === stato.camera) c.scrollTop = 0;
    });
    var c = camere[stato.camera];
    if (c.dataset.id === 'galleria') setTimeout(flusso, 60);
    if (c.dataset.id === 'studio') setTimeout(mjMoneta, 900);
    if (c.dataset.id === 'oro') ditoAutomatico(); else fermaDito();
    if (c.dataset.id === 'boudoir') window.dispatchEvent(new Event('cp-boudoir'));
    if (stato.fase === 2) setTimeout(mostraSuggerimento, 1800);
    if (c.dataset.id === 'verde') setTimeout(function () { scrittaFatta = false; $('#rivela-scritta').setAttribute('width', 0); preparaTela(); }, 700);
    scena.dataset.camera = c.dataset.id;
    setTimeout(aggiornaScorri, 1500);
    scena.style.setProperty('--sfondo', c.dataset.sfondo);
    scena.classList.toggle('chiaro', c.classList.contains('chiara'));
    scena.style.setProperty('--inchiostro', c.dataset.inchiostro);
    aggiornaNav();
    chiudiFoglio(); chiudiQuadro(); $('#carta-zoom').hidden = true; if ($('#lettura')) $('#lettura').hidden = true;
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search + '#' + c.dataset.id);
  }
  // nelle camere lunghe la freccia avanti prima scende a vedere il resto
  function restaDaVedere(c) { return c && c.scrollHeight - c.clientHeight - c.scrollTop > 40; }
  function scorriCamera() {
    var c = camere[stato.camera];
    if (stato.fase !== 2 || !restaDaVedere(c)) return false;
    c.scrollBy({ top: c.clientHeight * .8, behavior: ridotto ? 'auto' : 'smooth' });
    return true;
  }
  function aggiornaScorri() {
    var c = camere[stato.camera], b = $('#scorri-giu');
    b.hidden = !(stato.fase === 2 && c.classList.contains('attiva') && c.scrollTop < 30 && restaDaVedere(c));
  }
  camere.forEach(function (c) { c.addEventListener('scroll', aggiornaScorri, { passive: true }); });
  window.addEventListener('resize', aggiornaScorri);
  function vaiAId(id) {
    var k = camere.findIndex(function (c) { return c.dataset.id === id; });
    if (k >= 0) vaiA(k);
  }
  function apri() { stato.fase = 1; scena.classList.add('aperto'); clearTimeout(timerSipario); }
  // il nome in alto a sinistra riporta al sipario chiuso, come all'inizio
  var timerSipario = 0;
  function attendiSipario() { clearTimeout(timerSipario); timerSipario = setTimeout(function () { if (stato.fase === 0) apri(); }, 7000); }
  function chiudiSipario() {
    if (typeof chiudiMenu === 'function') chiudiMenu();
    if ($('#lettura')) $('#lettura').hidden = true;
    esci(); stato.fase = 0; stato.camera = 0;
    scena.classList.remove('aperto', 'dentro', 'entrando');
    attendiSipario();
  }
  /* ---- le quattro arti dentro l'obiettivo e nel viaggio 2D → 5D ---- */
  var ARTI = [
    { dim: '2D', chiave: 'dim_disegno', svg: '<path d="M11 37l2-8 19-19 6 6-19 19z"/><path d="M13 29l6 6M29 13l6 6M11 37l4-1"/>' },
    { dim: '3D', chiave: 'dim_pittura', svg: '<rect x="11" y="9" width="26" height="20" rx="1.5"/><path d="M15 24c4-6 7 1 11-5s6-3 7-6"/><path d="M17 29l-4 12M31 29l4 12M24 29v8"/>' },
    { dim: '4D', chiave: 'dim_foto', svg: '<rect x="7" y="15" width="34" height="23" rx="4"/><path d="M17 15l3-5h8l3 5"/><circle cx="24" cy="26.5" r="7"/><circle cx="24" cy="26.5" r="3"/><path d="M34 19.5h3"/>' },
    { dim: '5D', chiave: 'dim_boudoir', svg: '<path d="M20 5c-2 10 0 17 4 23-3 4-4 8-2 12l8 3.5 1-2-5-4c0-6 1-10 0-14 2-6 4-12 3-18.5"/><path d="M20.3 11.5c3 1.6 6 1.6 8.6 0"/><path d="M21 14.5c2.5 1.2 5 1.2 7.6 0" stroke-dasharray="1.5 1.5"/>' }
  ];
  function iconaArte(a) { return '<svg viewBox="0 0 48 48" aria-hidden="true">' + a.svg + '</svg>'; }
  function disegnaTunnel() {
    $('#tunnel').innerHTML = ARTI.map(function (a) {
      return '<span><b>' + a.dim + '</b></span>';
    }).join('');
  }

  /* ---- l'obiettivo: diaframma chiuso a f/8, si apre e si entra in 2D → 5D ---- */
  var diafObj = $('#diaframma-obiettivo'), aperturaObj = 34;
  function obiettivoA(r) { aperturaObj = r; disegnaIride(diafObj, r, 0, 0, 100, 100, (1 - r / 100) * 1.6); }
  obiettivoA(70);
  // il diaframma "respira" finché non entri
  (function respira(t) {
    if (stato.fase < 2 && !scena.classList.contains('entrando')) obiettivoA(72 + Math.sin(t / 1100) * 6);
    requestAnimationFrame(respira);
  })(0);
  /* dopo il 5D: la grotta di tufo, l'acqua azzurra che sgorga e la luce in cui si entra */
  function soglia(fatto) {
    var s = $('#soglia'), finito = false, tm = [];
    function fine() {
      if (finito) return; finito = true; tm.forEach(clearTimeout);
      s.classList.add('esce');
      fatto();
      setTimeout(function () { s.hidden = true; s.classList.remove('vista', 'entra', 'esce'); }, 700);
    }
    s.hidden = false; void s.offsetWidth; s.classList.add('vista');
    tm.push(setTimeout(function () { s.classList.add('entra'); }, 3000));
    tm.push(setTimeout(fine, 4100));
    s.onclick = fine;
  }
  function entra(salta) {
    if (stato.fase === 2 || scena.classList.contains('entrando')) return;
    var tufo = $('#tufo'), ob = $('#obiettivo').getBoundingClientRect(), sc = scena.getBoundingClientRect();
    tufo.style.transformOrigin = (ob.left - sc.left + ob.width / 2) + 'px ' + (ob.top - sc.top + ob.height / 2) + 'px';
    scena.classList.add('entrando');
    var da = aperturaObj;
    anima(ridotto ? 10 : 700, function (e) { obiettivoA(da + (100 - da) * e); }, function () {
      var tun = $('#tunnel'); tun.classList.remove('vola'); void tun.offsetWidth; if (!ridotto) tun.classList.add('vola');
      stato.fase = 2; scena.classList.add('aperto', 'dentro');
      setTimeout(function () {
        if (ridotto || salta) { scena.classList.remove('entrando'); mostraCamera(stato.camera); return; }
        soglia(function () { scena.classList.remove('entrando'); mostraCamera(stato.camera); });
      }, ridotto ? 0 : 1500);
    });
  }
  function esci() {
    stato.fase = 1; scena.classList.remove('dentro'); obiettivoA(70); scena.dataset.camera = ''; $('#scorri-giu').hidden = true;
    scena.style.setProperty('--sfondo', '#0B0807');
    scena.style.setProperty('--inchiostro', '#F3EBDA');
    camere.forEach(function (c) { c.classList.remove('attiva', 'passata'); });
    chiudiFoglio(); chiudiQuadro();
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
  }

  var punti = $('#punti');
  percorso.forEach(function (k) {
    punti.appendChild(el('button', { type: 'button', 'data-k': k, onclick: function () { vaiA(k); } }, esc(camere[k].dataset.num)));
  });

  var azioni = {
    apri: apri, entra: entra, esci: esci,
    sipario: function () { chiudiSipario(); },
    // dallo Studio: di nuovo il viaggio 2D → 5D, la grotta d'acqua azzurra, e si entra nelle arti
    esplora5d: function () {
      if (inTransizione) return;
      var dopo = passo(1), tun = $('#tunnel');
      inTransizione = true;
      tun.classList.remove('vola'); void tun.offsetWidth; if (!ridotto) tun.classList.add('vola');
      setTimeout(function () {
        soglia(function () { inTransizione = false; mostraCamera(dopo); });
      }, ridotto ? 0 : 1400);
    },
    succ: function () { if (!scorriCamera()) vaiA(passo(1)); },
    'scorri-giu': function () { scorriCamera(); },
    prec: function () { vaiA(passo(-1)); },
    'chiudi-foglio': function () { chiudiFoglio(); },
    prenota: function () { vaiAId('grotta'); },
    'vai-shop': function () { if (stato.fase === 2) vaiAId('shop'); else { stato.camera = camere.findIndex(function (c) { return c.dataset.id === 'shop'; }); entra(); } },
    'contatto-tel': function () { apriContatto('tel'); },
    'contatto-mail': function () { apriContatto('mail'); },
    'chiudi-contatto': function () { chiudiContatto(); },
    'chiudi-quadro': function () { chiudiQuadro(); },
    'quadro-succ': function () { mostraQuadro(quadroAperto + 1); },
    'quadro-prec': function () { mostraQuadro(quadroAperto - 1); },
    menu: function () { menuAperto ? chiudiMenu() : apriMenu(); }
  };
  /* ---- menu a tendina: tutte le pagine, contatti e lingua in un posto ---- */
  var menuAperto = false;
  function disegnaMenu() {
    var C = SITO.contatti || {}, ig = (C.instagram || '').replace(/^@/, '');
    var voci = '', gruppo = '', shopK = -1;
    camere.forEach(function (c, k) {
      if (c.dataset.fuori) { shopK = k; return; }
      if (c.dataset.gruppo !== gruppo) {
        voci += (gruppo ? '</div>' : '') + '<div class="menu-gruppo"><p class="menu-tit">' + esc(t('gruppo_' + c.dataset.gruppo)) + '</p>';
        gruppo = c.dataset.gruppo;
      }
      voci += '<button type="button" class="menu-voce" data-menu-camera="' + k + '"' + (k === stato.camera && stato.fase === 2 ? ' aria-current="true"' : '') + '><b>' + esc(c.dataset.num) + '</b><span>' + esc(t(c.dataset.nome)) + '</span></button>';
    });
    voci += '</div>';
    var tel = (C.telefono || '').replace(/[^+\d]/g, '');
    $('#menu').innerHTML =
      '<div class="menu-cima"><button type="button" class="menu-firma" data-azione="sipario">Ciro Pizzo <em>art</em></button>' +
        '<button type="button" class="menu-x" data-azione="menu" aria-label="' + esc(t('menu_chiudi')) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>' +
      '<div class="menu-corpo"><nav class="menu-voci">' + voci + '</nav>' +
      '<aside class="menu-lato">' +
        (shopK >= 0 ? '<button type="button" class="menu-shop" data-menu-camera="' + shopK + '"><span class="menu-tit">' + esc(t('gruppo_shop')) + '</span><strong>Shop</strong><small>' + esc(t('menu_shop_sotto')) + '</small></button>' : '') +
        '<a class="menu-prenota" target="_blank" rel="noopener" href="' + esc(waLink(t('wa_testo'))) + '">' + esc(t('menu_prenota')) + '</a>' +
        '<div class="menu-recapiti">' +
          (C.indirizzo ? '<a target="_blank" rel="noopener" href="https://maps.google.com/?q=' + encodeURIComponent(C.indirizzo) + '">' + esc(C.indirizzo) + '</a>' : '') +
          (C.telefono ? '<button type="button" data-azione="contatto-tel">' + esc(C.telefono) + '</button>' : '') +
          (C.email ? '<button type="button" data-azione="contatto-mail">' + esc(C.email) + '</button>' : '') +
          (ig ? '<a target="_blank" rel="noopener" href="https://instagram.com/' + encodeURIComponent(ig) + '">@' + esc(ig) + '</a>' : '') +
        '</div>' +
        '<div class="menu-fondo"><span class="menu-lingue"><button type="button" data-lingua="it"' + (lingua === 'it' ? ' aria-pressed="true"' : '') + '>IT</button><button type="button" data-lingua="en"' + (lingua === 'en' ? ' aria-pressed="true"' : '') + '>EN</button></span>' +
        '<button type="button" class="menu-esci" data-azione="esci">' + esc(t('menu_esci')) + '</button></div>' +
        '<p class="menu-motto">' + esc(t('menu_motto')) + '</p>' +
      '</aside></div>';
  }
  function apriMenu() { disegnaMenu(); $('#menu').hidden = false; menuAperto = true; $('#menu-btn').setAttribute('aria-expanded', 'true'); }
  function chiudiMenu() { $('#menu').hidden = true; menuAperto = false; $('#menu-btn').setAttribute('aria-expanded', 'false'); }
  $('#menu').addEventListener('click', function (e) {
    var v = e.target.closest('[data-menu-camera]');
    if (v) { chiudiMenu(); vaiA(+v.dataset.menuCamera); return; }
    if (e.target.closest('a,[data-azione]') && !e.target.closest('[data-azione=menu]')) setTimeout(chiudiMenu, 0);
    if (e.target.closest('[data-lingua]')) setTimeout(disegnaMenu, 0);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (menuAperto) chiudiMenu(); else if ($('#lettura') && !$('#lettura').hidden) { $('#lettura').hidden = true; pensAperto = -1; } } });
  scena.addEventListener('click', function (e) {
    var b = e.target.closest('[data-azione]');
    if (b && azioni[b.dataset.azione]) azioni[b.dataset.azione]();
    var l = e.target.closest('[data-lingua]');
    if (l) impostaLingua(l.dataset.lingua);
  });

  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input, textarea')) return;
    if (!$('#lightbox').hidden) {
      if (e.key === 'ArrowRight') mostraQuadro(quadroAperto + 1);
      else if (e.key === 'ArrowLeft') mostraQuadro(quadroAperto - 1);
      else if (e.key === 'Escape') chiudiQuadro();
      return;
    }
    if (!$('#polaroid').hidden && $('#polaroid').classList.contains('grande')) {
      if (e.key === 'ArrowRight') { cambiaFoto(1); return; }
      if (e.key === 'ArrowLeft') { cambiaFoto(-1); return; }
    }
    if (e.key === 'Escape' && !$('#polaroid').hidden) { chiudiFoto(); return; }
    if (e.key === 'Escape' && !$('#foglio').hidden) { chiudiFoglio(); return; }
    if (e.key === 'Escape' && !$('#contatto').hidden) { chiudiContatto(); return; }
    if (stato.fase === 2) {
      if (e.key === 'ArrowRight') vaiA(passo(1));
      else if (e.key === 'ArrowLeft') vaiA(passo(-1));
    }
  });

  /* ================= I · BOUDOIR: la mano tira su la calza lungo la gamba piegata ================= */
  var calza = $('#calza'), calzaF = 0;
  var traccia = $('#calza-traccia'), pizzo = $('#calza-pizzo'), mano = $('#calza-mano');
  var traccia1 = $('#calza-traccia1'), balza1 = $('#calza-balza1');
  var LT = traccia.getTotalLength(), LT1 = traccia1.getTotalLength(), MIN = 60;
  var campioni = [];
  for (var c = 0; c <= 120; c++) { var pp = traccia.getPointAtLength(LT * c / 120); campioni.push({ x: pp.x, y: pp.y, f: c / 120 }); }
  function calze(tr, bz, Ltot, fr, min, max, dash) {
    var l = min + fr * (Ltot * max - min);
    tr.setAttribute('stroke-dasharray', l.toFixed(1) + ' ' + (Ltot * 2).toFixed(0));
    bz.setAttribute('stroke-dasharray', '0 ' + (l - dash).toFixed(1) + ' ' + dash + ' ' + (Ltot * 2).toFixed(0));
    bz.setAttribute('opacity', Math.min(1, fr * 8).toFixed(2));
    return l;
  }
  function calzaA(f) {
    calzaF = Math.max(0, Math.min(1, f));
    calze(traccia1, balza1, LT1, 1, 70, .8, 34); // la gamba dietro ha sempre la calza
    var l = calze(traccia, pizzo, LT, calzaF, 70, .8, 28);
    calza.setAttribute('aria-valuenow', Math.round(calzaF * 100));
    disegnaCalza();
  }
  // nel boudoir: la gamba resta ferma sullo schermo e la calza segue lo scorrimento
  // (giù = si tira su, su = si sfila); il movimento è morbido, senza scatti
  var calzaMeta = 0, calzaGira = false;
  function calzaVerso(f) { calzaMeta = Math.max(0, Math.min(1, f)); if (!calzaGira) { calzaGira = true; requestAnimationFrame(calzaPasso); } }
  function calzaPasso() {
    var d = calzaMeta - calzaF;
    if (Math.abs(d) < .002) { calzaA(calzaMeta); calzaGira = false; return; }
    calzaA(calzaF + d * (ridotto ? 1 : .16)); requestAnimationFrame(calzaPasso);
  }
  (function () {
    var cam = $('[data-id="boudoir"]'), pista = $('#calza-pista');
    function progresso() {
      var rC = cam.getBoundingClientRect(), rP = pista.getBoundingClientRect(), corsa = rP.height - calza.offsetHeight;
      var top = parseFloat(getComputedStyle(calza).top) || 0;
      return corsa > 0 ? (rC.top + top - rP.top) / corsa : 0;
    }
    cam.addEventListener('scroll', function () { calzaVerso(progresso()); }, { passive: true });
    window.addEventListener('resize', function () { calzaVerso(progresso()); });
    // il pulsante porta la pagina al punto giusto: la calza segue
    window.cpCalzaScorri = function (su) {
      var rC = cam.getBoundingClientRect(), rP = pista.getBoundingClientRect(), corsa = rP.height - calza.offsetHeight;
      var top = parseFloat(getComputedStyle(calza).top) || 0;
      var y = cam.scrollTop + (rP.top - rC.top) - top + (su ? corsa : 0);
      cam.scrollTo({ top: Math.max(0, y), behavior: ridotto ? 'auto' : 'smooth' });
    };
  })();
  // lo schizzo si disegna quando entra nello schermo
  (function () {
    var s = $('#schizzo'); if (!s) return;
    if (!('IntersectionObserver' in window)) { s.classList.add('disegnato'); return; }
    new IntersectionObserver(function (v) { v.forEach(function (x) { if (x.isIntersecting) s.classList.add('disegnato'); }); }, { root: $('[data-id="boudoir"]'), threshold: .35 }).observe(s);
  })();
  var calzaStato = null;
  function disegnaCalza(forza) {
    if (!calza) return;
    var st = (calzaF > .9 ? 2 : calzaF < .05 ? 0 : 1) + lingua;
    if (st === calzaStato && forza !== true) return; calzaStato = st;
    var su = calzaF > .9, h = $('#calza-hint');
    h.textContent = t(su ? 'calza_hint_ok' : 'calza_hint');
    h.classList.toggle('lampeggia', calzaF < .05);
    $('#calza-btn').textContent = t(su ? 'calza_giu' : 'calza_btn');
    $('#calza-testo').classList.toggle('aperto', su);
  }
  (function () {
    var tirando = false, y0 = 0, f0 = 0;
    calza.addEventListener('pointerdown', function (e) { tirando = true; y0 = e.clientY; f0 = calzaMeta; calza.setPointerCapture(e.pointerId); });
    calza.addEventListener('pointermove', function (e) { if (tirando) calzaVerso(f0 + (y0 - e.clientY) / (calza.offsetHeight * .6)); });
    calza.addEventListener('pointerup', function () { tirando = false; });
    calza.addEventListener('pointercancel', function () { tirando = false; });
    calza.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { calzaVerso(calzaMeta + .1); e.preventDefault(); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { calzaVerso(calzaMeta - .1); e.preventDefault(); }
    });
    $('#calza-btn').addEventListener('click', function () { var su = calzaMeta < .5; window.cpCalzaScorri(su); calzaVerso(su ? 1 : 0); });
  })();

  calzaA(0);

  /* ================= II · RITRATTO: la macchina che scatta ================= */
  var diafMacchina = $('#diaframma-macchina'), scatti = 0;
  function macchinaA(r) { disegnaIride(diafMacchina, r, 0, 0, 100, 100, (1 - r / 100) * 1.6); }
  function scatta() {
    var b = $('#scatto'); if (b.disabled) return;
    b.disabled = true;
    var fl = $('#flash'); fl.classList.remove('lampo'); void fl.offsetWidth; fl.classList.add('lampo');
    anima(90, function (e) { macchinaA(72 * (1 - e)); }, function () {
      anima(260, function (e) { macchinaA(72 * e); }, function () { b.disabled = false; });
    });
    scatti++;
    var v = (SITO.galleria || []); if (!v.length) return;
    fotoIdx = (scatti - 1) % v.length;
    var pol = $('#polaroid');
    mostraFotoPolaroid(false);
    var h = $('#oro-hint'); h.classList.remove('lampeggia'); h.style.opacity = 0;
    pol.hidden = false; pol.classList.remove('esce', 'cade', 'grande'); void pol.offsetWidth; pol.classList.add('esce');
    pol.onanimationend = function (e) {
      if (e.animationName === 'esce') { pol.classList.add('grande'); $('#polaroid-chiudi').focus({ preventScroll: true }); }
      if (e.animationName === 'cade') { pol.hidden = true; pol.classList.remove('cade', 'grande'); }
    };
    $('#fumetto-scatto').classList.add('via');
    var h = $('#oro-hint'); h.classList.remove('lampeggia'); h.style.opacity = 0;
  }
  macchinaA(72);
  var fotoIdx = 0;
  function mostraFotoPolaroid(rifai) {
    var v = SITO.galleria || []; if (!v.length) return;
    var o = loc(v[fotoIdx]), img = $('#polaroid-img');
    $('.polaroid-foto').classList.toggle('vuota', !o.foto);
    if (o.foto) { img.src = o.foto; img.alt = o.titolo; } else { img.removeAttribute('src'); img.alt = ''; }
    $('#polaroid-cap').textContent = (o.titolo || 'Coming soon') + ' · ' + (fotoIdx + 1) + ' / ' + v.length;
    if (rifai) { img.classList.remove('rifai'); void img.offsetWidth; img.classList.add('rifai'); }
  }
  function cambiaFoto(d) {
    var v = SITO.galleria || []; if (!v.length) return;
    fotoIdx = (fotoIdx + d + v.length) % v.length; mostraFotoPolaroid(true);
  }
  $('#polaroid-prec').addEventListener('click', function () { cambiaFoto(-1); });
  $('#polaroid-succ').addEventListener('click', function () { cambiaFoto(1); });
  (function () { // swipe sulla foto grande
    var x0 = null, pol = $('#polaroid');
    pol.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    pol.addEventListener('touchend', function (e) {
      if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40 && pol.classList.contains('grande')) cambiaFoto(dx < 0 ? 1 : -1);
    });
  })();
  function chiudiFoto() {
    var pol = $('#polaroid'); if (pol.hidden || pol.classList.contains('cade')) return;
    pol.classList.remove('esce', 'grande'); void pol.offsetWidth; pol.classList.add('cade');
  }
  $('#polaroid-chiudi').addEventListener('click', chiudiFoto);
  $('#scatto').addEventListener('click', function () { fermaDito(); scatta(); });
  // entrando nella pagina un dito preme da solo lo scatto; si può sempre scattare anche a mano
  var timerDito = [];
  function fermaDito() { timerDito.forEach(clearTimeout); timerDito = []; $('#dito').classList.remove('scende', 'preme', 'sale'); }
  function ditoAutomatico() {
    fermaDito();
    if (!$('#polaroid').hidden || ridotto) return;
    var d = $('#dito');
    timerDito.push(setTimeout(function () { d.classList.add('scende'); }, 900));
    timerDito.push(setTimeout(function () { d.classList.add('preme'); $('#scatto').classList.add('premuto'); }, 1700));
    timerDito.push(setTimeout(function () { $('#scatto').classList.remove('premuto'); scatta(); }, 1880));
    timerDito.push(setTimeout(function () { d.classList.remove('preme'); d.classList.add('sale'); }, 2050));
    timerDito.push(setTimeout(function () { d.classList.remove('scende', 'sale'); }, 2900));
  }
  function disegnaPolaroid() { if (scatti) mostraFotoPolaroid(false); }

  /* ================= III · PITTURA: il pennello scrive in vernice, poi si dipinge ================= */
  var telaPit = $('#tela-canvas'), tctx = telaPit.getContext('2d'), coloreTela = '#B3162C', telaPronta = false;
  var telaBox = $('#tela-viva'), pen = $('#pennello-vero'), scrittaFatta = false, scrivendo = false;
  pen.style.color = coloreTela;
  function preparaTela() {
    var r = { width: telaPit.clientWidth, height: telaPit.clientHeight }, dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (!r.width) return;
    var era = telaPronta; telaPronta = true;
    var img = era ? tctx.getImageData(0, 0, telaPit.width, telaPit.height) : null;
    telaPit.width = r.width * dpr; telaPit.height = r.height * dpr;
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (img) tctx.putImageData(img, 0, 0);
    if (!era || !scrittaFatta) scriviTitolo();
  }
  // il pennello: la punta sta esattamente sul punto (x, y) della tela
  function pennelloA(x, y, ang) {
    pen.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + (ang == null ? -38 : ang) + 'deg)';
  }
  function pennelloRiposo() {
    var r = telaBox.getBoundingClientRect();
    pen.classList.add('riposo'); pennelloA(r.width * .78, r.height * .86, -24);
  }
  // il titolo si scrive da sinistra a destra, il pennello lo segue come se stendesse la vernice
  function scriviTitolo() {
    if (scrivendo) return;
    var svg = $('#tela-scritta'), testo = $('#scritta-testo'), rivela = $('#rivela-scritta');
    var fai = function () {
      var bb; try { bb = testo.getBBox(); } catch (e) { return; }
      if (!bb.width) return;
      if (bb.width > 560 || testo.getAttribute('font-size') !== '96') { testo.setAttribute('font-size', '96'); bb = testo.getBBox(); if (bb.width > 560) { testo.setAttribute('font-size', String(Math.floor(96 * 560 / bb.width))); bb = testo.getBBox(); } }
      scrivendo = true; scrittaFatta = false; pen.classList.remove('riposo');
      var m = svg.getScreenCTM(), rT = telaBox.getBoundingClientRect(), sc = m ? m.a : 1, ox = m ? m.e - rT.left : 0, oy = m ? m.f - rT.top : 0;
      var x0 = bb.x - 6, x1 = Math.max(bb.x + bb.width + 6, 436), base = bb.y + bb.height * .62, alt = bb.height * .3;
      var durata = ridotto ? 10 : 3200;
      anima(durata, function (t) {
        var x = x0 + (x1 - x0) * t;
        rivela.setAttribute('width', Math.max(0, x));
        var y = base - Math.sin(t * Math.PI * 11) * alt * (0.6 + 0.4 * Math.sin(t * 7));
        pennelloA(ox + x * sc, oy + y * sc, -38 + Math.sin(t * 20) * 6);
      }, function () {
        rivela.setAttribute('width', 600); scrivendo = false; scrittaFatta = true;
        pennelloRiposo();
        $('#verde-testo').classList.add('aperto');
      });
    };
    if (document.fonts && document.fonts.load) document.fonts.load('italic 500 96px "Cormorant Garamond"').then(fai, fai); else fai();
  }
  function pennellata(x0, y0, x1, y1) {
    var dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
    var larg = 18;
    tctx.lineCap = 'round'; tctx.lineJoin = 'round'; tctx.strokeStyle = coloreTela;
    tctx.globalAlpha = .85; tctx.lineWidth = larg * .7;   // corpo della vernice
    tctx.beginPath(); tctx.moveTo(x0, y0); tctx.lineTo(x1, y1); tctx.stroke();
    for (var b = -5; b <= 5; b++) {   // le setole
      var o = b / 5 * larg / 2, j = (Math.random() - .5) * 1.5;
      tctx.globalAlpha = .12 + Math.random() * .2; tctx.lineWidth = 1 + Math.random() * 2;
      tctx.beginPath(); tctx.moveTo(x0 + nx * (o + j), y0 + ny * (o + j)); tctx.lineTo(x1 + nx * (o + j), y1 + ny * (o + j)); tctx.stroke();
    }
    tctx.globalAlpha = .25; tctx.strokeStyle = '#fff'; tctx.lineWidth = 1.2;   // riflesso lucido
    tctx.beginPath(); tctx.moveTo(x0 - nx * larg * .18, y0 - ny * larg * .18); tctx.lineTo(x1 - nx * larg * .18, y1 - ny * larg * .18); tctx.stroke();
    tctx.globalAlpha = 1;
    $('#tela-invito').classList.add('via');
  }
  (function () {
    var giu = false, ux = 0, uy = 0;
    function pos(e) { var r = telaPit.getBoundingClientRect(), k = telaPit.clientWidth / (r.width || 1); return [(e.clientX - r.left) * k, (e.clientY - r.top) * k]; }
    telaPit.addEventListener('pointerdown', function (e) {
      if (!telaPronta) preparaTela(); if (scrivendo) return;
      giu = true; telaPit.setPointerCapture(e.pointerId); var p = pos(e); ux = p[0]; uy = p[1];
      pen.classList.remove('riposo'); pen.classList.add('dipinge'); pennelloA(ux, uy); pennellata(ux, uy, ux + .1, uy + .1);
    });
    telaPit.addEventListener('pointermove', function (e) {
      if (scrivendo) return;
      var p = pos(e);
      if (giu) { pennellata(ux, uy, p[0], p[1]); ux = p[0]; uy = p[1]; }
      if (giu || e.pointerType === 'mouse') { pen.classList.remove('riposo'); pennelloA(p[0], p[1], -38 + Math.max(-12, Math.min(12, (p[0] - ux) * 2))); }
    });
    function su() { giu = false; pen.classList.remove('dipinge'); }
    telaPit.addEventListener('pointerup', function (e) { su(); if (e.pointerType !== 'mouse') setTimeout(function () { if (!giu && !scrivendo) pennelloRiposo(); }, 900); });
    telaPit.addEventListener('pointercancel', su);
    telaPit.addEventListener('pointerleave', function () { if (!giu && !scrivendo) pennelloRiposo(); });
  })();
  $$('.tavolozza-vera .macchia').forEach(function (b) {
    b.addEventListener('click', function () {
      coloreTela = b.dataset.colore; pen.style.color = coloreTela;
      $$('.tavolozza-vera .macchia').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      pen.classList.remove('intinge'); void pen.offsetWidth; pen.classList.add('intinge');
    });
  });
  $('#tela-pulisci').addEventListener('click', function () {
    tctx.clearRect(0, 0, telaPit.width, telaPit.height);
    $('#rivela-scritta').setAttribute('width', 0); scrittaFatta = false; scriviTitolo();
  });
  window.addEventListener('resize', function () { if (telaPronta) { preparaTela(); if (scrittaFatta) pennelloRiposo(); } });
  function disegnaPennello() {}


  /* ================= ∞ · LO STUDIO: il mega juke-box ================= */
  var MJ = SITO.studio || [], tempoFermo = false, tFermo = 0;
  var mj = { codice: '', suona: -1, moneta: false, timer: [], foto: 'a', msg: '' };
  var precarica = MJ.map(function (s) { var i = new Image(); i.src = s.foto; return i; });
  MJ.forEach(function (s, k) {
    $('#mj-titoli').appendChild(el('button', { type: 'button', class: 'mj-disco', 'data-k': k, onclick: function () { mjSuona(k); } },
      '<b>' + (101 + k) + '</b><span></span>'));
  });
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '▶'].forEach(function (x) {
    $('#mj-tastiera').appendChild(el('button', { type: 'button', 'aria-label': x === 'C' ? 'Reset' : x === '▶' ? 'Play' : x, onclick: function () { mjTasto(x); } }, x));
  });
  function mjPulisci() { mj.timer.forEach(clearTimeout); mj.timer = []; }
  function mjDopo(ms, fn) { mj.timer.push(setTimeout(fn, ms)); }
  function mjCifre(txt, accese) {
    var c = (txt + '–––').slice(0, 3);
    $('#mj-cifre').innerHTML = c.split('').map(function (x) { return '<span>' + x + '</span>'; }).join('');
    $('#mj-cifre').classList.toggle('accese', !!accese);
  }
  function mjMsg(k) { mj.msg = k; $('#mj-msg').textContent = k ? t(k, { da: 101, a: 100 + MJ.length }) : ''; }
  // dove il tempo si ferma: l'orologio da taschino si ferma all'ora esatta,
  // il coperchio si stacca, diventa 100 lire e vola nella fessura del juke-box
  var oraFerma = '', monetaVolo = null;
  function fermaTempo() {
    var d = new Date(), hh = d.getHours(), mm = d.getMinutes();
    oraFerma = ('0' + hh).slice(-2) + ':' + ('0' + mm).slice(-2);
    $('#taschino-ore').setAttribute('transform', 'rotate(' + ((hh % 12) * 30 + mm / 2) + ' 30 42)');
    $('#taschino-min').setAttribute('transform', 'rotate(' + (mm * 6) + ' 30 42)');
    disegnaTempo();
  }
  function disegnaTempo() { if (oraFerma) $('#tempo-scritta').textContent = t('tempo_fermo', { ora: oraFerma }); }
  function fineMoneta() {
    if (monetaVolo) { monetaVolo.remove(); monetaVolo = null; }
    $('#mj-fessura').classList.add('accesa');
  }
  function mjMoneta() {
    fermaTempo();
    if (mj.moneta) return;
    mj.moneta = true;
    var cop = $('#taschino-coperchio');
    cop.classList.remove('apre', 'via'); void cop.offsetWidth; cop.classList.add('apre');
    mjDopo(ridotto ? 10 : 800, function () {
      var rS = scena.getBoundingClientRect(), rC = cop.getBoundingClientRect(), rF = $('#mj-fessura').getBoundingClientRect();
      var m = el('span', { class: 'moneta-volante', 'aria-hidden': 'true' }, '<b>100</b><small>LIRE</small>');
      var dim = 40, x0 = rC.left - rS.left + rC.width / 2 - dim / 2, y0 = rC.top - rS.top + rC.height / 2 - dim / 2;
      var x1 = rF.left - rS.left + rF.width / 2 - dim / 2, y1 = rF.top - rS.top + rF.height / 2 - dim / 2;
      m.style.left = x0 + 'px'; m.style.top = y0 + 'px'; scena.appendChild(m); monetaVolo = m;
      cop.classList.add('via');
      var dx = x1 - x0, dy = y1 - y0, alto = Math.min(-60, dy / 2 - 120);
      var vol = m.animate([
        { transform: 'translate(0,0) scale(.9) rotateY(0deg)' },
        { transform: 'translate(' + dx * .5 + 'px,' + alto + 'px) scale(1.25) rotateY(540deg)', offset: .55 },
        { transform: 'translate(' + dx + 'px,' + (dy - 26) + 'px) scale(1) rotateY(900deg)', offset: .85 },
        { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.9,.25) rotateY(990deg)', opacity: 0 }
      ], { duration: ridotto ? 10 : 1400, easing: 'cubic-bezier(.45,0,.4,1)', fill: 'forwards' });
      vol.onfinish = function () {
        fineMoneta(); mjMsg('mj_inserita');
        mjDopo(600, function () { if (mj.suona < 0) mjSuona(0); });
      };
    });
  }
  function mjSuona(k) {
    var s = loc(MJ[k]); if (!s) return;
    mjPulisci(); mj.codice = ''; mj.suona = k; var tok = mj.tok = (mj.tok || 0) + 1;
    if (!mj.moneta) { mj.moneta = true; $('#taschino-coperchio').classList.add('via'); }
    fineMoneta();
    mjCifre(String(101 + k), true); mjMsg('mj_suona');
    $$('.mj-disco').forEach(function (d) { d.classList.toggle('attivo', +d.dataset.k === k); });
    var schermo = $('#mj-schermo'), vin = $('#mj-vinile');
    schermo.classList.add('cambia'); vin.classList.remove('gira'); void vin.offsetWidth; vin.classList.add('gira');
    $('#mj-fronte').classList.add('suona');
    mjDopo(ridotto ? 10 : 650, function () {
      var nuova = mj.foto === 'a' ? 'b' : 'a', img = $('#mj-foto-' + nuova), vecchia = $('#mj-foto-' + mj.foto);
      img.src = s.foto; img.alt = s.titolo;
      img.onload = img.onerror = null;
      var mostra = function () {
        if (tok !== mj.tok) return;
        img.classList.add('vista'); vecchia.classList.remove('vista'); mj.foto = nuova;
        $('#mj-num').textContent = 101 + k; $('#mj-titolo').textContent = s.titolo; $('#mj-testo').textContent = s.testo;
        schermo.classList.remove('cambia'); schermo.classList.add('piena');
      };
      if (img.complete && img.naturalWidth) mostra(); else { img.onload = mostra; img.onerror = mostra; }
    });
  }
  function mjTasto(x) {
    if (x === 'C') { mjPulisci(); mj.codice = ''; mjCifre(mj.suona >= 0 ? String(101 + mj.suona) : '', mj.suona >= 0); mjMsg('mj_scegli'); return; }
    if (x === '▶') { if (mj.codice.length) x = ''; else return; }
    if (x) { if (mj.codice.length >= 3) mj.codice = ''; mj.codice += x; }
    mjPulisci(); mjCifre(mj.codice, true); mjMsg('');
    if (mj.codice.length < 3 && x) return;
    var n = parseInt(mj.codice, 10) - 101;
    if (n >= 0 && n < MJ.length) { mjSuona(n); return; }
    mjMsg('mj_errato');
    var schermo = $('#mj-schermo'); schermo.classList.remove('errore'); void schermo.offsetWidth; schermo.classList.add('errore');
    mjDopo(1100, function () { mj.codice = ''; mjCifre(mj.suona >= 0 ? String(101 + mj.suona) : '', mj.suona >= 0); mjMsg('mj_scegli'); });
  }
  // con la tastiera del computer: si digitano i numeri quando si è nello studio
  document.addEventListener('keydown', function (e) {
    if (stato.fase !== 2 || camere[stato.camera].dataset.id !== 'studio' || e.target.closest('input,textarea')) return;
    if (/^[0-9]$/.test(e.key)) mjTasto(e.key);
    else if (e.key === 'Backspace' || e.key === 'Delete') mjTasto('C');
  });
  function disegnaMj() {
    $$('.mj-disco').forEach(function (d) { var s = loc(MJ[+d.dataset.k]); d.querySelector('span').textContent = s.titolo; d.setAttribute('aria-label', (101 + +d.dataset.k) + ' · ' + s.titolo); });
    if (mj.suona >= 0) { var s = loc(MJ[mj.suona]); $('#mj-titolo').textContent = s.titolo; $('#mj-testo').textContent = s.testo; }
    mjMsg(mj.msg || 'mj_scegli'); disegnaTempo();
  }
  mjCifre('', false);
  function chiudiFoglio() { $('#foglio').hidden = true; }

  /* ================= V · EX-VOTO ================= */
  var ceri = 0, grazia = -1;
  $('#accendi').addEventListener('click', function () {
    var G = blocco(SITO.grazie) || [];
    var g = Math.floor(Math.random() * G.length);
    if (g === grazia) g = (g + 1) % G.length;
    grazia = g; ceri++;
    $('#nicchia').classList.add('accesa');
    var ev = $('#exvoto'); ev.hidden = false; ev.classList.remove('pop'); void ev.offsetWidth; ev.classList.add('pop');
    disegnaExvoto();
  });
  function disegnaExvoto() {
    $('#accendi').textContent = t(ceri ? 'accendi_altro' : 'accendi');
    if (!ceri) return;
    var G = blocco(SITO.grazie) || [];
    var gr = G[grazia] || ''; $('#grazia').textContent = gr.charAt(0).toUpperCase() + gr.slice(1);
    var box = $('#ceri'); box.hidden = false; box.innerHTML = '';
    for (var i = 0; i < Math.min(ceri, 12); i++) box.appendChild(el('i', { 'aria-hidden': 'true' }));
    box.appendChild(el('small', null, ceri + ' ' + t(ceri === 1 ? 'cero_uno' : 'ceri_molti')));
  }

  /* ================= VI · GALLERIA ================= */
  var OPERE = SITO.galleria || [];
  var parete = $('#parete');
  var quadroAperto = -1;
  var filtro = 'tutto';
  function elenco() {
    var v = [];
    OPERE.forEach(function (o, k) { if (filtro === 'tutto' || (o.tipo || 'foto') === filtro) v.push(k); });
    return v;
  }
  function disegnaFiltri() {
    var box = $('#filtri'), presenti = {};
    OPERE.forEach(function (o) { presenti[o.tipo || 'foto'] = true; });
    var T = (SITO.tecniche || []).filter(function (x) { return presenti[x.id]; });
    box.innerHTML = '';
    if (T.length < 2 && filtro === 'tutto') { box.hidden = true; return; }
    box.hidden = false;
    [{ id: 'tutto', it: t('gal_tutto'), en: t('gal_tutto') }].concat(T).forEach(function (x) {
      box.appendChild(el('button', { type: 'button', 'aria-pressed': filtro === x.id ? 'true' : 'false', onclick: function () {
        filtro = x.id; disegnaFiltri(); disegnaGalleria(); parete.scrollLeft = 0;
      } }, esc(x[lingua] || x.it)));
    });
  }
  function nomeTecnica(id) {
    var x = (SITO.tecniche || []).filter(function (z) { return z.id === id; })[0];
    return x ? (x[lingua] || x.it) : '';
  }
  function disegnaGalleria() {
    parete.innerHTML = '';
    elenco().forEach(function (k) {
      var o = loc(OPERE[k]);
      var fig = el('figure', { class: 'quadro' });
      if (!o.foto) {
        fig.innerHTML = '<span class="cornice vuota"><span class="cornice-labbro"><span class="in-arrivo">Coming soon</span></span></span>' +
          '<figcaption class="targhetta"><b>Coming soon</b><small>Ciro Pizzo Art</small></figcaption>';
        parete.appendChild(fig); return;
      }
      var btn = el('button', { type: 'button', class: 'cornice', 'aria-label': t('gal_apri') + ': ' + o.titolo, onclick: function () { mostraQuadro(k); } });
      btn.innerHTML = '<span class="cornice-labbro"><img src="' + esc(o.foto) + '" alt="' + esc(o.alt || o.titolo) + '" loading="lazy"></span>';
      fig.appendChild(btn);
      fig.appendChild(el('figcaption', { class: 'targhetta' }, '<b>' + esc(o.titolo) + '</b><small>' + esc(nomeTecnica(o.tipo || 'foto')) + ' · ' + esc(o.anno || '') + '</small>'));
      parete.appendChild(fig);
    });
  }
  function mostraQuadro(k) {
    var v = elenco(); if (!v.length) return;
    var prima = quadroAperto;
    if (v.indexOf(k) < 0) { // passo avanti/indietro dentro la selezione
      var pos = v.indexOf(prima), passo = k > prima ? 1 : -1;
      k = v[(pos + passo + v.length) % v.length];
    }
    quadroAperto = k;
    var o = loc(OPERE[k]), n = v.indexOf(k);
    var img = $('#lb-img'); img.src = o.foto; img.alt = o.alt || o.titolo;
    $('#lb-titolo').textContent = o.titolo;
    $('#lb-info').textContent = 'Ciro Pizzo · ' + [nomeTecnica(o.tipo || 'foto'), o.tecnica, o.anno, o.serie].filter(Boolean).join(' · ') + ' · ' + (n + 1) + ' / ' + v.length;
    $('#lightbox').setAttribute('aria-label', o.titolo);
    var lw = $('#lb-wa');
    lw.hidden = !o.vendita;
    if (o.vendita) {
      lw.href = waLink(t('wa_opera', { titolo: o.titolo }));
      lw.innerHTML = ICONA_WA_PICCOLA + '<span>' + esc(t('opera_btn')) + (o.prezzo ? ' · ' + esc(o.prezzo) : '') + '</span>';
    }
    if (prima !== quadroAperto) { var c = $('#lb-cornice'); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
    $('#lightbox').hidden = false;
  }
  function chiudiQuadro() { $('#lightbox').hidden = true; quadroAperto = -1; }
  (function () {
    var x0 = null, lb = $('#lightbox');
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 == null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) mostraQuadro(quadroAperto + (dx < 0 ? 1 : -1));
    });
  })();

  /* ================= VII · L'ORACOLO DI EROS ================= */
  var box = $('#oracolo');
  var orc = { q: -1, punti: {}, ultima: 'E' };
  function disegnaOracolo() {
    if (!box) return;
    var OR = blocco(SITO.oracolo) || { domande: [], risultati: {} };
    box.innerHTML = '';
    if (orc.q < 0) {
      var w = el('div', { class: 'pop colonna' },
        '<span class="etichetta">' + esc(numero('oracolo') + t('orc_etichetta')) + '</span><h2>' + esc(t('orc_titolo')) + '</h2>' +
        '<p class="testo">' + esc(t('orc_testo')) + '</p>');
      w.appendChild(el('button', { type: 'button', class: 'btn-nero', onclick: function () { orc.q = 0; orc.punti = {}; disegnaOracolo(); } }, esc(t('orc_btn'))));
      box.appendChild(w); return;
    }
    if (orc.q < OR.domande.length) {
      var d = OR.domande[orc.q];
      var w2 = el('div', { class: 'pop colonna larga' },
        '<span class="mini-maiusc">' + esc(t('orc_domanda', { n: orc.q + 1, t: OR.domande.length })) + '</span><h3>' + esc(d.domanda) + '</h3>');
      var griglia = el('div', { class: 'risposte' });
      d.risposte.forEach(function (r, k) {
        griglia.appendChild(el('button', { type: 'button', class: 'risposta', onclick: function () {
          orc.punti[r[0]] = (orc.punti[r[0]] || 0) + 1; orc.ultima = r[0]; orc.q++; disegnaOracolo();
        } }, '<b>' + 'αβγδεζ'[k] + '</b><span>' + esc(r[1]) + '</span>'));
      });
      w2.appendChild(griglia); box.appendChild(w2); return;
    }
    var best = orc.ultima, bv = -1;
    Object.keys(OR.risultati).forEach(function (k) {
      var v = orc.punti[k] || 0;
      if (v > bv || (v === bv && k === orc.ultima)) { bv = v; best = k; }
    });
    var r = OR.risultati[best];
    var w3 = el('div', { class: 'pop colonna' },
      '<span class="etichetta">' + esc(t('orc_parlato')) + '</span><div class="dio-greco">' + esc(r.greco) + '</div>' +
      '<h3>' + esc(t('orc_sei')) + ' ' + esc(r.nome) + '</h3><p class="testo">' + esc(r.testo) + '</p>' +
      '<div class="scena-tua">' + esc(t('orc_scena')) + ' <strong>' + esc(r.scena) + '</strong></div>');
    var b = el('div', { class: 'bottoni', style: 'margin-top:8px' });
    b.appendChild(el('button', { type: 'button', class: 'btn-nero', onclick: function () { vaiAId(r.camera); } }, esc(t('orc_entra'))));
    b.appendChild(el('a', { class: 'btn-rosso', href: waLink(t('wa_oracolo', { nome: r.nome, scena: r.scena })), target: '_blank', rel: 'noopener' }, esc(t('orc_prenota'))));
    b.appendChild(el('button', { type: 'button', class: 'btn-trasp', onclick: function () { orc.q = -1; disegnaOracolo(); } }, esc(t('orc_rigioca'))));
    w3.appendChild(b); box.appendChild(w3);
  }

  /* ================= VIII · CONTATTI ================= */
  var ICONA_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.4 18.6z"/><path d="M9.2 8.6c.3 2.6 2.4 4.9 5 5.4l1-1.2 1.9.9c-.2 1-1.1 1.6-2.1 1.5-3.6-.4-6.5-3.3-6.9-6.9-.1-1 .5-1.9 1.5-2.1l.9 1.9z"/></svg>';
  var ICONA_TEL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5h3l1.4 4-2 1.3a11 11 0 0 0 6.2 6.2l1.3-2 4 1.4v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/></svg>';
  var ICONA_MAIL = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="3"/><path d="M4 7.5l8 6 8-6"/></svg>';
  var ICONA_IG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/></svg>';
  var inCornice = (function () { try { return window.self !== window.top; } catch (e) { return true; } })();
  var contattoTipo = '';
  function apriContatto(tipo) {
    var C = SITO.contatti || {}; contattoTipo = tipo;
    var tel = String(C.telefono || '').replace(/[^\d+]/g, '');
    $('#contatto-titolo').textContent = t(tipo === 'tel' ? 'tel_titolo' : 'mail_titolo');
    $('#contatto-valore').textContent = tipo === 'tel' ? C.telefono : C.email;
    $('#contatto-copia').textContent = t(tipo === 'tel' ? 'copia_num' : 'copia_mail');
    var a = $('#contatto-apri');
    a.textContent = t(tipo === 'tel' ? 'apri_tel' : 'apri_mail');
    a.href = tipo === 'tel' ? 'tel:' + tel : 'mailto:' + C.email + '?subject=' + encodeURIComponent(t('mail_oggetto'));
    $('#contatto-ok').textContent = '';
    $('#contatto').hidden = false;
  }
  function chiudiContatto() { $('#contatto').hidden = true; contattoTipo = ''; }
  $('#contatto-copia').addEventListener('click', function () {
    var v = $('#contatto-valore').textContent, ok = $('#contatto-ok');
    function aMano() {
      var r = document.createRange(); r.selectNodeContents($('#contatto-valore'));
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      ok.textContent = t('copia_mano');
    }
    try {
      navigator.clipboard.writeText(v).then(function () { ok.textContent = t('copiato'); }, aMano);
    } catch (e) { aMano(); }
  });
  // il biglietto da visita: tutto chiaro, in un colpo d'occhio
  function disegnaContatti() {
    var C = loc(SITO.contatti || {});
    var wa = String(C.whatsapp || '').replace(/\D/g, ''), ig = String(C.instagram || '').replace(/^@/, '').trim();
    var tel = String(C.telefono || '').replace(/[^\d+]/g, '');
    var mappa = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(String(C.indirizzo || '').replace(/’/g, "'"));
    var mail = 'mailto:' + (C.email || '') + '?subject=' + encodeURIComponent(t('mail_oggetto'));
    function riga(et, val, href, azione) {
      if (!val) return '';
      var v = azione ? '<button type="button" data-azione="' + azione + '">' + esc(val) + '</button>'
        : href ? '<a href="' + esc(href) + '"' + (/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(val) + '</a>' : '<span>' + esc(val) + '</span>';
      return '<div class="bv-riga"><dt>' + esc(t(et)) + '</dt><dd>' + v + '</dd></div>';
    }
    var ind = String(C.indirizzo || '').split(', ');
    var indTesto = ind[0] + (ind[1] ? '\n' + (C.cap ? C.cap + ' ' : '') + ind.slice(1).join(', ') : '');
    var carta = '<article class="biglietto">' +
      '<header class="bv-testa"><span class="bv-logo">Ciro Pizzo <em>art</em></span><span class="bv-mestiere">' + esc(t('bv_mestiere')) + '</span></header>' +
      '<span class="bv-filetto" aria-hidden="true"></span>' +
      '<dl class="bv-dati">' +
        (C.indirizzo ? '<div class="bv-riga"><dt>' + esc(t('bv_studio')) + '</dt><dd><a href="' + esc(mappa) + '" target="_blank" rel="noopener" class="bv-ind">' + esc(indTesto) + '</a></dd></div>' : '') +
        riga('bv_telefono', C.telefono, inCornice ? '' : 'tel:' + tel, inCornice ? 'contatto-tel' : '') +
        riga('bv_email', C.email, inCornice ? '' : mail, inCornice ? 'contatto-mail' : '') +
        riga('bv_instagram', ig ? '@' + ig : '', ig ? 'https://instagram.com/' + encodeURIComponent(ig) : '') +
        riga('bv_web', C.sito, C.sito ? 'https://' + C.sito : '') +
        riga('bv_quando', C.orari, '') +
      '</dl></article>';
    var azioniBv = '<div class="bv-azioni">' +
      (wa.length >= 8 ? '<a class="bv-btn principale" href="https://wa.me/' + wa + '?text=' + encodeURIComponent(t('wa_testo')) + '" target="_blank" rel="noopener">' + ICONA_WA + '<span>' + esc(t('bv_scrivi')) + '</span></a>' : '') +
      (tel.length >= 8 ? (inCornice ? '<button type="button" class="bv-btn" data-azione="contatto-tel">' : '<a class="bv-btn" href="tel:' + tel + '">') + ICONA_TEL + '<span>' + esc(t('tel_btn')) + '</span>' + (inCornice ? '</button>' : '</a>') : '') +
      (C.email ? (inCornice ? '<button type="button" class="bv-btn" data-azione="contatto-mail">' : '<a class="bv-btn" href="' + esc(mail) + '">') + ICONA_MAIL + '<span>' + esc(t('bv_email')) + '</span>' + (inCornice ? '</button>' : '</a>') : '') +
      (C.indirizzo ? '<a class="bv-btn" href="' + esc(mappa) + '" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></svg><span>' + esc(t('bv_mappa')) + '</span></a>' : '') +
      '<button type="button" class="bv-btn" id="bv-salva"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/><path d="M19 4v5M16.5 6.5h5"/></svg><span>' + esc(t('bv_salva')) + '</span></button>' +
      '</div>';
    $('#contatti').innerHTML = carta + azioniBv;
    $('#bv-salva').onclick = function () {
      var vc = ['BEGIN:VCARD', 'VERSION:3.0', 'N:Pizzo;Ciro;;;', 'FN:Ciro Pizzo', 'ORG:Ciro Pizzo Art', 'TITLE:' + t('bv_mestiere'),
        tel ? 'TEL;TYPE=CELL,VOICE:' + tel : '', C.email ? 'EMAIL;TYPE=INTERNET:' + C.email : '',
        C.indirizzo ? 'ADR;TYPE=WORK:;;' + ind[0] + ';' + (ind[1] || '').replace(/\s*\(.*\)/, '') + ';SA;' + (C.cap || '') + ';Italia' : '',
        C.sito ? 'URL:https://' + C.sito : '', ig ? 'X-SOCIALPROFILE;type=instagram:https://instagram.com/' + ig : '', 'END:VCARD'].filter(Boolean).join('\r\n');
      var url = URL.createObjectURL(new Blob([vc], { type: 'text/vcard' }));
      var l = el('a', { href: url, download: 'Ciro-Pizzo-Art.vcf' }); document.body.appendChild(l); l.click();
      setTimeout(function () { URL.revokeObjectURL(url); l.remove(); }, 1500);
    };
  }

  /* ================= VENDITA: pacchetti, buono, prima volta, collaborazioni ================= */
  function disegnaVendita() {
    // WhatsApp sempre visibile
    $('#wa-fluttuante').href = waLink(t('wa_testo'));
    // pacchetti
    var P = $('#pacchetti'); P.innerHTML = '';
    (SITO.pacchetti || []).forEach(function (p0) {
      var p = loc(p0);
      var card = el('article', { class: 'pacchetto' },
        '<h3>' + esc(p.nome) + '</h3><span class="pacchetto-sotto">' + esc(p.sotto || '') + '</span>' +
        '<ul>' + (p.include || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
        '<span class="pacchetto-prezzo">' + esc(p.prezzo || t('prezzo_richiesta')) + '</span>');
      card.appendChild(el('a', { class: 'btn-social wa', href: waLink(t('wa_pacchetto', { nome: p.nome })), target: '_blank', rel: 'noopener' }, ICONA_WA_PICCOLA + '<span>' + esc(t('pacchetto_btn')) + '</span>'));
      P.appendChild(card);
    });
    // buono regalo
    var bw = $('#buono-wa');
    bw.href = waLink(t('wa_buono'));
    bw.innerHTML = ICONA_WA_PICCOLA + '<span>' + esc(t('buono_btn')) + '</span>';
    // prima volta
    var F = $('#faq'); F.innerHTML = '';
    (SITO.faq || []).forEach(function (q0) {
      var q = loc(q0);
      F.appendChild(el('details', { class: 'domanda' }, '<summary>' + esc(q.d) + '</summary><p>' + esc(q.r) + '</p>'));
    });
    var pw = $('#prima-wa');
    pw.href = waLink(t('wa_domanda'));
    pw.innerHTML = ICONA_WA_PICCOLA + '<span>' + esc(t('prima_btn')) + '</span>';
    // collaborazioni
    var K = $('#collab'); K.innerHTML = '';
    (SITO.collaborazioni || []).forEach(function (c0) {
      var c = loc(c0);
      K.appendChild(el('a', { href: waLink(t('wa_collab', { chi: c.chi })), target: '_blank', rel: 'noopener' }, esc(c.nome)));
    });
  }
  // la busta di ceralacca
  $('#sigillo').addEventListener('click', function () {
    var b = $('#busta');
    if (b.classList.contains('aperta')) return;
    b.classList.add('aperta');
    $('#busta-hint').hidden = true;
    setTimeout(function () { $('#buono-wa').hidden = false; }, ridotto ? 0 : 1300);
  });

  /* ================= X · SHOP: prodotti e carrello ================= */
  var PRODOTTI = SITO.shop || [], carrello = [];
  try { carrello = JSON.parse(localStorage.getItem('cp-carrello') || '[]') || []; } catch (e) { carrello = []; }
  function salvaCarrello() { try { localStorage.setItem('cp-carrello', JSON.stringify(carrello)); } catch (e) {} }
  function euro(n) { return '€ ' + (Math.round(n * 100) / 100).toLocaleString(lingua === 'it' ? 'it-IT' : 'en-GB', { minimumFractionDigits: n % 1 ? 2 : 0 }); }
  function prodotto(id) { return PRODOTTI.filter(function (p) { return p.id === id; })[0]; }
  function prezzoDi(p, v) { return p.varianti ? (p.varianti[v] || p.varianti[0]).prezzo : p.prezzo; }
  function nomeRiga(r) {
    var p0 = prodotto(r.id); if (!p0) return '';
    var p = loc(p0); return p.nome + (p0.varianti ? ' ' + p0.varianti[r.v || 0].nome : '');
  }
  var scelte = {};
  function mockup(p) {
    var img = p.foto ? '<img src="' + esc(p.foto) + '" alt="" loading="lazy">' : '<span class="in-arrivo mini">Coming soon</span>';
    if (p.tipo === 'calendario') return '<div class="mock mock-calendario"><span class="spirale"></span>' + img + '<span class="mese"><b>2027</b><i></i></span></div>';
    if (p.tipo === 'libro') return '<div class="mock mock-libro"><span class="libro-copertina">' + img + '<b>Ciro Pizzo</b></span></div>';
    if (p.tipo === 'stampa') return '<div class="mock mock-stampa">' + img + '<i>Ciro Pizzo · 1/30</i></div>';
    if (p.tipo === 'quadro') return '<div class="mock mock-quadro"><span class="cornice"><span class="cornice-labbro">' + img + '</span></span></div>';
    return '<div class="mock mock-buono"><span class="mini-busta"><span class="mini-sigillo">CP</span></span></div>';
  }
  function disegnaProdotti() {
    var box = $('#prodotti'); box.innerHTML = '';
    PRODOTTI.forEach(function (p0) {
      var p = loc(p0), v = scelte[p0.id] || 0, pr = prezzoDi(p0, v);
      var card = el('article', { class: 'prodotto' }, mockup(p0) +
        '<h3>' + esc(p.nome) + '</h3><p>' + esc(p.descr || '') + '</p>');
      if (p0.varianti) {
        var sel = el('div', { class: 'varianti', role: 'group', 'aria-label': t('formato') });
        p0.varianti.forEach(function (x, k) {
          sel.appendChild(el('button', { type: 'button', 'aria-pressed': k === v ? 'true' : 'false', onclick: function () { scelte[p0.id] = k; disegnaProdotti(); } }, esc(x.nome)));
        });
        card.appendChild(sel);
      }
      card.appendChild(el('span', { class: 'prodotto-prezzo' }, pr == null ? esc(t('prezzo_richiesta')) : euro(pr)));
      var az = el('div', { class: 'prodotto-azioni' });
      var add = el('button', { type: 'button', class: 'btn-rosso', onclick: function () {
        var trov = carrello.filter(function (r) { return r.id === p0.id && (r.v || 0) === v; })[0];
        if (trov) trov.q++; else carrello.push({ id: p0.id, v: v, q: 1 });
        salvaCarrello(); disegnaCarrello();
        add.textContent = t('aggiunto') + ' ✓'; setTimeout(function () { add.textContent = t('aggiungi'); }, 1200);
      } }, esc(t('aggiungi')));
      az.appendChild(add);
      if (p0.link_pagamento) az.appendChild(el('a', { class: 'btn-linea', href: p0.link_pagamento, target: '_blank', rel: 'noopener' }, esc(t('compra_subito'))));
      card.appendChild(az);
      box.appendChild(card);
    });
  }
  function disegnaCarrello() {
    carrello = carrello.filter(function (r) { return prodotto(r.id) && r.q > 0; });
    var ul = $('#carrello-righe'); ul.innerHTML = '';
    var tot = 0, extra = false, n = 0, righeMsg = [];
    carrello.forEach(function (r, k) {
      var p0 = prodotto(r.id), pr = prezzoDi(p0, r.v || 0);
      n += r.q; if (pr == null) extra = true; else tot += pr * r.q;
      righeMsg.push('• ' + r.q + ' × ' + nomeRiga(r) + (pr == null ? '' : ' (' + euro(pr * r.q) + ')'));
      var li = el('li', null, '<span class="riga-nome">' + esc(nomeRiga(r)) + '</span><span class="riga-prezzo">' + (pr == null ? '€' : euro(pr * r.q)) + '</span>');
      var q = el('span', { class: 'quantita' });
      q.appendChild(el('button', { type: 'button', 'aria-label': t('meno'), onclick: function () { r.q--; salvaCarrello(); disegnaCarrello(); } }, '−'));
      q.appendChild(el('b', null, String(r.q)));
      q.appendChild(el('button', { type: 'button', 'aria-label': t('piu'), onclick: function () { r.q++; salvaCarrello(); disegnaCarrello(); } }, '+'));
      li.insertBefore(q, li.lastChild);
      ul.appendChild(li);
    });
    var vuoto = !carrello.length;
    $('#carrello-vuoto').hidden = !vuoto;
    $('#carrello-totale').innerHTML = vuoto ? '' : '<span>' + esc(t('totale')) + '</span><b>' + (tot ? euro(tot) : '€') + '</b>' + (extra && tot ? '<small>' + esc(t('totale_extra')) + '</small>' : '');
    var o = $('#ordina');
    o.hidden = vuoto; $('#svuota').hidden = vuoto;
    o.href = waLink(t('wa_ordine_inizio') + '\n' + righeMsg.join('\n') + (tot ? '\n' + t('totale') + ': ' + euro(tot) + (extra ? ' ' + t('totale_extra') : '') : '') + '\n' + t('wa_ordine_fine'));
    o.innerHTML = ICONA_WA_PICCOLA + '<span>' + esc(t('ordina')) + '</span>';
    var badge = $('#carrello-n'); badge.hidden = !n; badge.textContent = n;
    $('#carrello-btn').setAttribute('aria-label', t('carrello_aria', { n: n }));
  }
  $('#svuota').addEventListener('click', function () { carrello = []; salvaCarrello(); disegnaCarrello(); });

  /* ================= III · POKER D'AUTORE ================= */
  var tavolo = $('#tavolo'), mazzo = $('#mazzo'), manoCarte = [], distribuendo = false, giri = 0;
  var SEMI = [{ s: '♥', r: true }, { s: '♦', r: true }, { s: '♣', r: false }, { s: '♠', r: false }];
  var VALORI = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  for (var mz = 0; mz < 6; mz++) mazzo.appendChild(el('span', { class: 'carta-dorso', style: 'transform:translate(' + (-mz * .6) + 'px,' + (-mz * .8) + 'px)' }));
  function mescola(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function disegnaPoker() { $('#distribuisci').textContent = t(giri ? 'poker_ancora' : 'poker_btn'); }
  function distribuisci() {
    if (distribuendo) return; distribuendo = true; giri++;
    manoCarte.forEach(function (c) { c.classList.add('via'); });
    var vecchie = manoCarte; manoCarte = [];
    setTimeout(function () { vecchie.forEach(function (c) { c.remove(); }); }, 500);
    mazzo.classList.remove('mescola'); void mazzo.offsetWidth; mazzo.classList.add('mescola');
    var mazzoCarte = [];
    SEMI.forEach(function (s) { VALORI.forEach(function (v) { mazzoCarte.push({ v: v, s: s }); }); });
    mescola(mazzoCarte);
    var foto = mescola((SITO.carte || []).map(function (c, k) { return k; }));
    var W = tavolo.clientWidth, H = tavolo.clientHeight, N = 5;
    var stretto = W < 640, cw, ch, pos = [];
    if (stretto) { // telefono: 3 carte sopra e 2 sotto, grandi
      cw = Math.min((W - 36) / 3.15, (H - 40) / 3.15); ch = cw * 1.5;
      var gy = (H - ch * 2 - 14) / 2 + 10;
      for (var q = 0; q < 3; q++) pos.push({ x: W / 2 - cw / 2 + (q - 1) * (cw + 8), y: gy, r: (q - 1) * 3 });
      for (q = 0; q < 2; q++) pos.push({ x: W / 2 - cw / 2 + (q - .5) * (cw + 8), y: gy + ch + 14, r: (q - .5) * 4 });
    } else { // computer: ventaglio di 5 carte grandi
      cw = Math.min(210, (W - 220) / 5.3, (H - 70) / 1.55); ch = cw * 1.5;
      for (q = 0; q < N; q++) pos.push({ x: W / 2 - cw / 2 + (q - 2) * (cw + 12), y: H / 2 - ch / 2 + Math.abs(q - 2) * 8 + 10, r: (q - 2) * 4 });
    }
    var rT = tavolo.getBoundingClientRect(), rM = mazzo.getBoundingClientRect(), sc = rT.width / W || 1;
    var mx = (rM.left - rT.left) / sc + (rM.width / sc - cw) / 2, my = (rM.top - rT.top) / sc + (rM.height / sc - ch) / 2;
    $('#tavolo-invito').hidden = true;
    setTimeout(function () {
      for (var i = 0; i < N; i++) (function (i) {
        var dati = mazzoCarte[i], f = (SITO.carte || [])[foto[i % Math.max(1, foto.length)]] || {};
        var x = pos[i].x, y = pos[i].y, rot = pos[i].r;
        var carta = el('button', { type: 'button', class: 'carta', 'aria-label': t('poker_aria', { carta: dati.v + dati.s.s }) });
        carta.style.cssText = 'width:' + cw + 'px;height:' + ch + 'px;left:' + mx + 'px;top:' + my + 'px';
        var faccia = f.foto ? '<img src="' + esc(f.foto) + '" alt="' + esc(f.titolo || '') + '">' : '<span class="carta-soon">' + esc(t('poker_soon')) + '</span>';
        carta.innerHTML = '<span class="carta-interno"><span class="carta-retro"></span><span class="carta-fronte' + (dati.s.r ? ' rossa' : '') + '">' +
          '<b class="ang alto">' + dati.v + '<i>' + dati.s.s + '</i></b><span class="carta-foto">' + faccia + '</span><b class="ang basso">' + dati.v + '<i>' + dati.s.s + '</i></b></span></span>';
        carta.addEventListener('click', function () { if (!carta.classList.contains('girata')) carta.classList.add('girata'); else ingrandisciCarta(carta); });
        tavolo.appendChild(carta); manoCarte.push(carta);
        setTimeout(function () {
          carta.style.transform = 'translate(' + (x - mx) + 'px,' + (y - my) + 'px) rotate(' + rot + 'deg)';
          setTimeout(function () { carta.classList.add('girata'); if (i === N - 1) distribuendo = false; }, 520 + i * 160);
        }, ridotto ? 0 : 120 + i * 170);
      })(i);
      disegnaPoker();
    }, ridotto ? 0 : 900);
  }
  $('#distribuisci').addEventListener('click', distribuisci);
  // la carta girata si ingrandisce per vedere bene la foto
  function ingrandisciCarta(carta) {
    var z = $('#carta-zoom');
    z.innerHTML = '<div class="carta-grande">' + carta.querySelector('.carta-fronte').outerHTML + '</div><p>' + esc(t('poker_zoom')) + '</p>';
    z.hidden = false;
  }
  $('#carta-zoom').addEventListener('click', function () { this.hidden = true; });

  /* ================= VII · PENSIERI (il blog) ================= */
  var pensAperto = -1, pensFiltro = 'tutti';
  function disegnaPensieri() {
    var L = (SITO.pensieri || []).map(loc), box = $('#pens-lista');
    if (!box) return;
    box.innerHTML = '';
    var filtri = el('div', { class: 'pens-filtri', role: 'group' });
    ['tutti', 'maestri', 'spirito'].forEach(function (f) {
      filtri.appendChild(el('button', { type: 'button', 'aria-pressed': pensFiltro === f ? 'true' : 'false', onclick: function () { pensFiltro = f; disegnaPensieri(); } }, esc(t('pens_' + f))));
    });
    box.appendChild(filtri);
    var ordine = L.map(function (p, k) { return k; }).sort(function (x, y) { return (L[x].gruppo === 'maestri' ? 0 : 1) - (L[y].gruppo === 'maestri' ? 0 : 1) || x - y; }), nn = 0;
    ordine.forEach(function (k) {
      var p = L[k];
      if (pensFiltro !== 'tutti' && p.gruppo !== pensFiltro) return;
      nn++;
      box.appendChild(el('button', { type: 'button', class: 'pens-voce', onclick: function () { apriPensiero(k); } },
        '<span class="pens-n">' + String(nn).padStart(2, '0') + '</span>' +
        '<span class="pens-corpo"><small>' + esc(p.tema || '') + '</small><strong>' + esc(p.titolo) + '</strong>' +
        '<em>' + esc(((p.testo || [])[0] || '').slice(0, 130)) + '…</em></span>' +
        '<span class="pens-leggi">' + esc(t('pens_leggi')) + ' <i aria-hidden="true">→</i></span>'));
    });
    if (pensAperto >= 0) apriPensiero(pensAperto);
  }
  function apriPensiero(k) {
    var p = loc((SITO.pensieri || [])[k]); if (!p) return;
    pensAperto = k;
    var l = $('#lettura');
    l.innerHTML = '<div class="lettura-foglio">' +
      '<button type="button" class="lettura-torna" data-azione="chiudi-pensiero">← ' + esc(t('pens_torna')) + '</button>' +
      '<small>' + esc(p.tema || '') + (p.minuti ? ' · ' + esc(t('pens_min', { n: p.minuti })) : '') + '</small>' +
      '<h3>' + esc(p.titolo) + '</h3><span class="filetto" aria-hidden="true"></span>' +
      (p.testo || []).map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('') +
      '<p class="lettura-firma">Ciro Pizzo</p>' +
      '<a class="btn-linea" target="_blank" rel="noopener" href="' + esc(waLink(t('wa_testo'))) + '">' + esc(t('pens_prenota')) + '</a></div>';
    l.hidden = false; l.scrollTop = 0;
  }
  function chiudiPensiero() { pensAperto = -1; $('#lettura').hidden = true; }
  azioni['chiudi-pensiero'] = chiudiPensiero;

  /* ================= NAVIGARE SENZA FRECCE: mappa, "continua", gesti ================= */
  // la mappa della pagina d'ingresso: una tessera per ogni pagina
  function disegnaMappa() {
    var m = $('#mappa'); if (!m) return;
    m.innerHTML = '';
    camere.forEach(function (c, k) {
      if (c.dataset.id === 'benvenuto') return;
      var tess = el('button', { type: 'button', class: 'tessera', 'data-gruppo': c.dataset.gruppo, onclick: function () { vaiA(k); } },
        '<b>' + esc(c.dataset.num || '€') + '</b><span>' + esc(t(c.dataset.nome)) + '</span><small>' + esc(t('gruppo_' + c.dataset.gruppo)) + '</small>');
      tess.style.setProperty('--tc', c.dataset.sfondo);
      m.appendChild(tess);
    });
  }
  // in fondo a ogni pagina: "Continua → prossima pagina" e "Tutte le pagine"
  camere.forEach(function (c, k) {
    var dove = c.querySelector(':scope > .contenuto') || (getComputedStyle(c).flexDirection === 'column' ? c : null);
    if (!dove) return;
    // la firma gigante chiude ogni pagina
    var firma = el('button', { type: 'button', class: 'firma-gigante', 'data-azione': 'sipario', 'aria-label': 'Ciro Pizzo art' }, 'Ciro Pizzo <em>art</em>');
    var bordo = el('div', { class: 'pizzo-fine', 'aria-hidden': 'true' }, '<svg viewBox="0 0 1920 78">' + [0,1,2,3,4,5,6,7,8,9,10,11].map(function (k) { return '<use href="#pizzo-unita" x="' + k * 160 + '" width="160" height="78"/>'; }).join('') + '</svg>');
    if (c.dataset.id !== 'boudoir') bordo = document.createComment('pizzo solo nel boudoir');
    if (c.dataset.fuori) { dove.appendChild(bordo); dove.appendChild(firma); return; }
    var box = el('div', { class: 'prossima-box' });
    box.appendChild(el('button', { type: 'button', class: 'prossima', onclick: function () { vaiA(passo(1)); } }, ''));
    box.appendChild(el('button', { type: 'button', class: 'tutte', onclick: function () { apriMenu(); } }, ''));
    dove.appendChild(box); dove.appendChild(bordo); dove.appendChild(firma);
  });
  function disegnaProssime() {
    $$('.camera').forEach(function (c) {
      var b = c.querySelector('.prossima'); if (!b) return;
      var k = camere.indexOf(c), p = percorso.indexOf(k), nx = camere[percorso[(p + 1) % percorso.length]];
      b.innerHTML = '<small>' + esc(t('prossima')) + '</small><span>' + esc((nx.dataset.num && nx.dataset.num !== '·' ? nx.dataset.num + ' · ' : '') + t(nx.dataset.nome)) + '</span><i aria-hidden="true">→</i>';
      c.querySelector('.tutte').textContent = t('tutte_pagine');
    });
  }
  // sul telefono: scorrere di lato con il dito cambia pagina
  (function () {
    var x0 = null, y0 = 0, t0 = 0, NO = 'canvas,#calza,.parete,.mj-tastiera,.mj-titoli,.tavolo,#polaroid,.lightbox,.menu-tendina,.lettura,.carta-zoom,.foglio,input,textarea,[data-noswipe]';
    scena.addEventListener('touchstart', function (e) {
      x0 = null;
      if (stato.fase !== 2 || e.touches.length !== 1 || e.target.closest(NO)) return;
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now();
    }, { passive: true });
    scena.addEventListener('touchend', function (e) {
      if (x0 == null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 70 && Math.abs(dy) < Math.abs(dx) * .6 && Date.now() - t0 < 700 && !inTransizione) {
        vaiA(passo(dx < 0 ? 1 : -1)); nascondiSuggerimento();
      }
    }, { passive: true });
  })();
  // il suggerimento compare una volta sola, la prima volta che si entra dal telefono
  var suggVisto = false;
  try { suggVisto = localStorage.getItem('cp-swipe') === '1'; } catch (e) {}
  function mostraSuggerimento() {
    if (suggVisto || !('ontouchstart' in window)) return;
    suggVisto = true; try { localStorage.setItem('cp-swipe', '1'); } catch (e) {}
    var s = $('#suggerimento'); s.hidden = false; setTimeout(nascondiSuggerimento, 4200);
  }
  function nascondiSuggerimento() { var s = $('#suggerimento'); if (s) s.hidden = true; }

  /* ================= APPLICA LA LINGUA ================= */
  function impostaLingua(l) {
    if (l !== 'it' && l !== 'en') return;
    lingua = l;
    try { localStorage.setItem('cp-lingua', l); } catch (e) {}
    applica();
  }
  /* il numero romano della camera davanti alla sua etichetta (l'ordine si cambia solo in index.html) */
  function numero(id) {
    var c = camere.find(function (x) { return x.dataset.id === id; });
    return c && /^[IVX]+$/.test(c.dataset.num) ? c.dataset.num + ' · ' : '';
  }
  function numeraEtichette() {
    camere.forEach(function (c) {
      var e = c.querySelector('.etichetta[data-t]');
      if (e && /^[IVX]+$/.test(c.dataset.num)) e.textContent = c.dataset.num + ' · ' + t(e.dataset.t);
    });
  }
  function applica() {
    document.documentElement.lang = lingua;
    document.title = 'Ciro Pizzo Art — ' + t('firma_sotto');
    $$('[data-t]').forEach(function (n) { n.textContent = t(n.dataset.t); });
    $$('[data-t-aria]').forEach(function (n) { n.setAttribute('aria-label', t(n.dataset.tAria)); });
    $$('[data-lingua]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lingua === lingua ? 'true' : 'false'); });
    numeraEtichette(); aggiornaNav(); disegnaMappa(); disegnaProssime();
    disegnaCalza(true); disegnaPolaroid(); disegnaPennello(); disegnaPoker();
    disegnaMj();
    disegnaExvoto();
    disegnaFiltri(); disegnaGalleria(); if (quadroAperto >= 0) mostraQuadro(quadroAperto);
    disegnaOracolo(); disegnaPensieri();
    disegnaTunnel();
    disegnaContatti(); if (contattoTipo) apriContatto(contattoTipo);
    disegnaVendita();
    disegnaProdotti(); disegnaCarrello();
  }
  applica();

  /* ================= PROFONDITÀ: bokeh, inclinazione 3D, galleria ================= */
  var tela = $('#bokeh'), ctx = tela.getContext && tela.getContext('2d');
  var puntatore = { x: 0, y: 0, attivo: false }, luci = [];
  function hexRgb(h) { h = (h || '#C9A24B').replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function dimensiona() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    tela.width = scena.clientWidth * dpr; tela.height = scena.clientHeight * dpr;
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  for (var b = 0; b < 3; b++) luci.push({ x: [.2, .8, .5][b], y: [.25, .4, .85][b], r: [.55, .45, .5][b], f: b * 2.1 });
  window.addEventListener('resize', dimensiona); dimensiona();
  scena.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var r = scena.getBoundingClientRect();
    puntatore.x = (e.clientX - r.left) / r.width - .5; puntatore.y = (e.clientY - r.top) / r.height - .5; puntatore.attivo = true;
  });
  scena.addEventListener('pointerleave', function () { puntatore.attivo = false; });
  (function ciclo(t) {
    if (tempoFermo) t = tFermo; else tFermo = t;
    var px = puntatore.attivo ? puntatore.x : Math.sin(t / 4200) * .18, py = puntatore.attivo ? puntatore.y : Math.cos(t / 5100) * .14;
    if (!ridotto) {
      // l'inclinazione 3D segue solo il mouse: su telefono i pulsanti restano fermi sotto il dito
      // nelle pagine da toccare (juke-box, tela, poker) niente inclinazione: i tasti restano fermi
      var fermo = stato.fase === 2 && /^(studio|verde|poker)$/.test(camere[stato.camera].dataset.id), on = puntatore.attivo && !fermo;
      scena.style.setProperty('--ry', (on ? px * 7 : 0).toFixed(2) + 'deg');
      scena.style.setProperty('--rx', (on ? -py * 6 : 0).toFixed(2) + 'deg');
    }
    if (ctx && stato.fase === 2) {
      var W = scena.clientWidth, H = scena.clientHeight, cam = camere[stato.camera];
      var col = hexRgb(getComputedStyle(cam).getPropertyValue('--accento').trim());
      ctx.clearRect(0, 0, W, H);
      luci.forEach(function (l) {
        var x = (l.x + Math.sin(t / 9000 + l.f) * .08) * W - px * 40, y = (l.y + Math.cos(t / 11000 + l.f) * .06) * H - py * 30;
        var R = l.r * Math.max(W, H), a = .1 + .04 * Math.sin(t / 4000 + l.f);
        var g = ctx.createRadialGradient(x, y, 0, x, y, R);
        g.addColorStop(0, 'rgba(' + col + ',' + a + ')'); g.addColorStop(1, 'rgba(' + col + ',0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      });
    }
    requestAnimationFrame(ciclo);
  })(0);

  // galleria: i quadri ruotano nello spazio come in un museo che gira
  function flusso() {
    var c = parete.getBoundingClientRect(), mezzo = c.left + c.width / 2;
    $$('.quadro', parete).forEach(function (q) {
      var r = q.getBoundingClientRect(), d = (r.left + r.width / 2 - mezzo) / c.width;
      d = Math.max(-1, Math.min(1, d));
      q.style.transform = 'rotateY(' + (-d * 38).toFixed(1) + 'deg) translateZ(' + (-Math.abs(d) * 120).toFixed(0) + 'px) scale(' + (1 - Math.abs(d) * .12).toFixed(3) + ')';
      q.style.opacity = (1 - Math.abs(d) * .45).toFixed(2);
    });
  }
  parete.addEventListener('scroll', function () { requestAnimationFrame(flusso); }, { passive: true });
  window.addEventListener('resize', flusso);
  var _dg = disegnaGalleria; disegnaGalleria = function () { _dg(); requestAnimationFrame(flusso); };
  disegnaGalleria();

  /* link diretto a una camera (es. sito/?lang=en#galleria) */
  var h = location.hash.replace('#', '');
  if (h && camere.some(function (c) { return c.dataset.id === h; })) {
    stato.camera = camere.findIndex(function (c) { return c.dataset.id === h; });
    scena.classList.add('aperto'); setTimeout(function () { entra(true); }, 50);
  } else {
    // il sipario aspetta il clic; se nessuno lo apre, si apre da solo dopo 7 secondi
    attendiSipario();
  }
})();
