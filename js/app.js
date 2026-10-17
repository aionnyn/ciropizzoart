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
  function aggiornaNav() {
    var c = camere[stato.camera], n = camere.length;
    $$('#punti button').forEach(function (b, k) {
      b.setAttribute('aria-current', k === stato.camera ? 'true' : 'false');
      b.setAttribute('aria-label', t(camere[k].dataset.nome));
    });
    $('#conta-nome').textContent = t(c.dataset.nome);
    $('#conta-num').textContent = (stato.camera + 1) + ' / ' + n;
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

  function vaiA(i) {
    if (stato.fase === 2 && camere[stato.camera].classList.contains('attiva') && ((i + camere.length) % camere.length) !== stato.camera) {
      conIride(function () { mostraCamera(i); });
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
    if (c.dataset.id === 'verde') setTimeout(preparaTela, 400);
    scena.dataset.camera = c.dataset.id;
    setTimeout(aggiornaScorri, 1500);
    scena.style.setProperty('--sfondo', c.dataset.sfondo);
    scena.style.setProperty('--inchiostro', c.dataset.inchiostro);
    aggiornaNav();
    chiudiFoglio(); chiudiQuadro(); $('#carta-zoom').hidden = true;
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
  function apri() { stato.fase = 1; scena.classList.add('aperto'); }
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
  function entra() {
    if (stato.fase === 2 || scena.classList.contains('entrando')) return;
    var tufo = $('#tufo'), ob = $('#obiettivo').getBoundingClientRect(), sc = scena.getBoundingClientRect();
    tufo.style.transformOrigin = (ob.left - sc.left + ob.width / 2) + 'px ' + (ob.top - sc.top + ob.height / 2) + 'px';
    scena.classList.add('entrando');
    var da = aperturaObj;
    anima(ridotto ? 10 : 700, function (e) { obiettivoA(da + (100 - da) * e); }, function () {
      var tun = $('#tunnel'); tun.classList.remove('vola'); void tun.offsetWidth; if (!ridotto) tun.classList.add('vola');
      stato.fase = 2; scena.classList.add('aperto', 'dentro');
      setTimeout(function () { scena.classList.remove('entrando'); mostraCamera(stato.camera); }, ridotto ? 0 : 1500);
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
  camere.forEach(function (c, k) {
    punti.appendChild(el('button', { type: 'button', onclick: function () { vaiA(k); } }, esc(c.dataset.num)));
  });

  var azioni = {
    apri: apri, entra: entra, esci: esci,
    succ: function () { if (!scorriCamera()) vaiA(stato.camera + 1); },
    'scorri-giu': function () { scorriCamera(); },
    prec: function () { vaiA(stato.camera - 1); },
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
    var voci = '', gruppo = '';
    camere.forEach(function (c, k) {
      if (c.dataset.gruppo !== gruppo) {
        voci += (gruppo ? '</div>' : '') + '<p class="menu-tit">' + esc(t('gruppo_' + c.dataset.gruppo)) + '</p><div class="menu-lista">';
        gruppo = c.dataset.gruppo;
      }
      voci += '<button type="button" class="menu-voce" data-menu-camera="' + k + '"' + (k === stato.camera && stato.fase === 2 ? ' aria-current="true"' : '') + '><b>' + esc(c.dataset.num) + '</b><span>' + esc(t(c.dataset.nome)) + '</span></button>';
    });
    voci += '</div>';
    $('#menu').innerHTML = voci +
      '<p class="menu-tit">' + esc(t('menu_contatti')) + '</p><div class="menu-contatti">' +
        '<a class="menu-chip" target="_blank" rel="noopener" href="' + esc(waLink(t('wa_testo'))) + '">WhatsApp</a>' +
        '<button type="button" class="menu-chip" data-azione="contatto-tel">' + esc(t('menu_chiama')) + '</button>' +
        '<button type="button" class="menu-chip" data-azione="contatto-mail">Email</button>' +
        (ig ? '<a class="menu-chip" target="_blank" rel="noopener" href="https://instagram.com/' + encodeURIComponent(ig) + '">Instagram</a>' : '') +
      '</div>' +
      '<div class="menu-fondo"><span class="menu-lingue">' + esc(t('menu_lingua')) + ' <button type="button" data-lingua="it"' + (lingua === 'it' ? ' aria-pressed="true"' : '') + '>IT</button><button type="button" data-lingua="en"' + (lingua === 'en' ? ' aria-pressed="true"' : '') + '>EN</button></span>' +
      '<button type="button" class="menu-esci" data-azione="esci">' + esc(t('menu_esci')) + '</button></div>';
  }
  function apriMenu() { disegnaMenu(); $('#menu').hidden = false; menuAperto = true; $('#menu-btn').setAttribute('aria-expanded', 'true'); }
  function chiudiMenu() { $('#menu').hidden = true; menuAperto = false; $('#menu-btn').setAttribute('aria-expanded', 'false'); }
  $('#menu').addEventListener('click', function (e) {
    var v = e.target.closest('[data-menu-camera]');
    if (v) { chiudiMenu(); vaiA(+v.dataset.menuCamera); return; }
    if (e.target.closest('a,[data-azione]')) setTimeout(chiudiMenu, 0);
    if (e.target.closest('[data-lingua]')) setTimeout(disegnaMenu, 0);
  });
  document.addEventListener('click', function (e) { if (menuAperto && !e.target.closest('#menu,#menu-btn')) chiudiMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuAperto) chiudiMenu(); });
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
      if (e.key === 'ArrowRight') vaiA(stato.camera + 1);
      else if (e.key === 'ArrowLeft') vaiA(stato.camera - 1);
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
    calze(traccia1, balza1, LT1, 1, 60, .9, 13); // la gamba dietro ha sempre la calza
    var l = calze(traccia, pizzo, LT, calzaF, 34, .64, 9);
    var p = traccia.getPointAtLength(l), q = traccia.getPointAtLength(Math.min(LT, l + 2));
    var ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
    mano.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ') rotate(' + (ang + 90).toFixed(1) + ') translate(0,-30)');
    mano.setAttribute('opacity', calzaF > .015 ? 1 : 0);
    calza.setAttribute('aria-valuenow', Math.round(calzaF * 100));
    disegnaCalza();
  }
  function disegnaCalza() {
    if (!calza) return;
    var su = calzaF > .9, h = $('#calza-hint');
    h.textContent = t(su ? 'calza_hint_ok' : 'calza_hint');
    h.classList.toggle('lampeggia', calzaF < .05);
    $('#calza-btn').textContent = t(su ? 'calza_giu' : 'calza_btn');
    $('#calza-testo').classList.toggle('aperto', su);
  }
  function calzaVerso(f, dur) {
    var da = calzaF;
    anima(ridotto ? 10 : (dur || 1800), function (e) { calzaA(da + (f - da) * e); });
  }
  (function () {
    var tirando = false, svg = $('svg', calza);
    function daPuntatore(e) {
      var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var m = traccia.getScreenCTM(); if (!m) return;
      var p = pt.matrixTransform(m.inverse()), best = campioni[0], bd = 1e9;
      campioni.forEach(function (c) { var d = (c.x - p.x) * (c.x - p.x) + (c.y - p.y) * (c.y - p.y); if (d < bd) { bd = d; best = c; } });
      calzaA((best.f * LT - 34) / (LT * .64 - 34));
    }
    calza.addEventListener('pointerdown', function (e) { tirando = true; calza.setPointerCapture(e.pointerId); daPuntatore(e); });
    calza.addEventListener('pointermove', function (e) { if (tirando) daPuntatore(e); });
    calza.addEventListener('pointerup', function () { tirando = false; });
    calza.addEventListener('pointercancel', function () { tirando = false; });
    calza.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { calzaA(calzaF + .1); e.preventDefault(); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { calzaA(calzaF - .1); e.preventDefault(); }
    });
    $('#calza-btn').addEventListener('click', function () { calzaVerso(calzaF > .9 ? 0 : 1); });
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
  $('#scatto').addEventListener('click', scatta);
  function disegnaPolaroid() { if (scatti) mostraFotoPolaroid(false); }

  /* ================= III · PITTURA: si dipinge con il dito ================= */
  var telaPit = $('#tela-canvas'), tctx = telaPit.getContext('2d'), coloreTela = '#C8102E', dipinto = 0, svelato = false, telaPronta = false;
  function preparaTela() {
    var r = telaPit.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (!r.width) return;
    var era = telaPronta; telaPronta = true;
    var img = era ? tctx.getImageData(0, 0, telaPit.width, telaPit.height) : null;
    telaPit.width = r.width * dpr; telaPit.height = r.height * dpr;
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (img) tctx.putImageData(img, 0, 0);
  }
  function pennellata(x0, y0, x1, y1, forza) {
    var dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
    var larg = 26 * (forza || 1);
    tctx.lineCap = 'round'; tctx.strokeStyle = coloreTela;
    for (var b = -6; b <= 6; b++) {   // le setole del pennello
      var o = b / 6 * larg / 2, j = (Math.random() - .5) * 2;
      tctx.globalAlpha = .18 + Math.random() * .22;
      tctx.lineWidth = 2 + Math.random() * 3;
      tctx.beginPath(); tctx.moveTo(x0 + nx * (o + j), y0 + ny * (o + j)); tctx.lineTo(x1 + nx * (o + j), y1 + ny * (o + j)); tctx.stroke();
    }
    tctx.globalAlpha = 1;
    dipinto += d;
    if (!svelato && dipinto > 200) {
      svelato = true;
      $('#tela-titolo').classList.add('dipinto'); $('#verde-testo').classList.add('aperto');
    }
    $('#tela-invito').classList.add('via');
  }
  (function () {
    var giu = false, ux = 0, uy = 0;
    function pos(e) { var r = telaPit.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    telaPit.addEventListener('pointerdown', function (e) { if (!telaPronta) preparaTela(); giu = true; telaPit.setPointerCapture(e.pointerId); var p = pos(e); ux = p[0]; uy = p[1]; pennellata(ux, uy, ux + .1, uy + .1); });
    telaPit.addEventListener('pointermove', function (e) { if (!giu) return; var p = pos(e); pennellata(ux, uy, p[0], p[1]); ux = p[0]; uy = p[1]; });
    telaPit.addEventListener('pointerup', function () { giu = false; });
    telaPit.addEventListener('pointercancel', function () { giu = false; });
  })();
  $$('.pennelli .colore').forEach(function (b) {
    b.addEventListener('click', function () {
      coloreTela = b.dataset.colore;
      $$('.pennelli .colore').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    });
  });
  $('#tela-pulisci').addEventListener('click', function () {
    tctx.clearRect(0, 0, telaPit.width, telaPit.height);
  });
  window.addEventListener('resize', preparaTela);
  function disegnaPennello() {}


  /* ================= IV · IL JUKE-BOX ================= */
  var SIT = SITO.situazioni || [];
  var jb = { credito: 0, cade: false, codice: '', suonato: -1, sbloccati: [], msg: 'msg_inserisci', lampeggia: true };
  var cifre = $('#jb-cifre'), dischi = $('#jb-dischi'), pallini = $('#jb-pallini');
  $('#jb-totale').textContent = SIT.length;
  SIT.forEach(function (s, k) {
    dischi.appendChild(el('button', { type: 'button', class: 'disco', onclick: function () { suona(k); } }, '<b>' + (101 + k) + '</b><span></span><i aria-hidden="true"></i>'));
    pallini.appendChild(el('span', { 'aria-hidden': 'true' }));
  });
  var TASTI = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '↵'];
  TASTI.forEach(function (x) { $('#jb-tastiera').appendChild(el('button', { type: 'button', onclick: function () { tasto(x); } }, x)); });

  function messaggio(k, lamp) { jb.msg = k; jb.lampeggia = !!lamp; disegnaJb(); }
  function disegnaJb() {
    var mostra = jb.codice ? (jb.codice + '––').slice(0, 3) : (jb.suonato >= 0 ? String(101 + jb.suonato) : '–––');
    $$('span', cifre).forEach(function (s, k) { s.textContent = mostra[k]; });
    cifre.classList.toggle('accese', !!jb.codice || jb.suonato >= 0);
    var m = $('#jb-msg');
    m.textContent = jb.msg ? t(jb.msg, { t: 100 + SIT.length }) : '';
    m.classList.toggle('lampeggia', jb.lampeggia);
    $('#jb-credito').textContent = t('jb_credito') + ' ' + jb.credito;
    $('#jb-fessura').classList.toggle('accesa', jb.cade || jb.credito > 0);
    $('#jb-fronte').classList.toggle('suona', jb.suonato >= 0);
    $$('.disco', dischi).forEach(function (d, k) {
      var s = loc(SIT[k]), ok = jb.sbloccati.indexOf(k) >= 0;
      $('span', d).textContent = s.titolo;
      d.setAttribute('aria-label', t('jb_disco') + ' ' + (101 + k) + ': ' + s.titolo);
      d.classList.toggle('suonato', ok);
      d.style.borderLeftColor = ok ? SIT[k].colore : '';
      $('i', d).textContent = ok ? '♪' : '';
    });
    $$('button', $('#jb-tastiera')).forEach(function (b, k) {
      var x = TASTI[k];
      b.setAttribute('aria-label', x === 'C' ? t('cancella') : (x === '↵' ? t('conferma') : t('tasto') + ' ' + x));
    });
    $$('span', pallini).forEach(function (p, k) { p.style.background = jb.sbloccati.indexOf(k) >= 0 ? SIT[k].colore : 'transparent'; });
    $('#jb-conta').textContent = jb.sbloccati.length;
  }
  $('#jb-moneta').addEventListener('click', function () {
    if (jb.cade) return;
    jb.cade = true; messaggio('');
    var m = el('span', { class: 'moneta-cade', 'aria-hidden': 'true' });
    this.parentNode.appendChild(m);
    setTimeout(function () { m.remove(); jb.cade = false; jb.credito++; messaggio('msg_scegli'); }, 750);
  });
  function suona(k) {
    if (jb.credito <= 0) { jb.codice = ''; messaggio('msg_inserisci', true); return; }
    jb.credito--; jb.suonato = k; jb.codice = '';
    if (jb.sbloccati.indexOf(k) < 0) jb.sbloccati.push(k);
    messaggio('msg_play'); apriFoglio(k);
  }
  function tasto(x) {
    if (x === 'C') { jb.codice = ''; messaggio(''); return; }
    if (x === '↵') { messaggio('msg_componi'); return; }
    jb.codice += x;
    if (jb.codice.length < 3) { messaggio(''); return; }
    var n = parseInt(jb.codice, 10);
    if (n >= 101 && n <= 100 + SIT.length) suona(n - 101);
    else { jb.codice = ''; messaggio('msg_inesistente'); }
  }
  var foglioAperto = -1;
  function apriFoglio(k) { foglioAperto = k; disegnaFoglio(); $('#foglio').hidden = false; }
  function disegnaFoglio() {
    if (foglioAperto < 0) return;
    var k = foglioAperto, s = loc(SIT[k]);
    $('#foglio-codice').textContent = t('jb_disco') + ' ' + (101 + k) + ' · ' + t('jb_sbloccata');
    $('#foglio-titolo').textContent = s.titolo;
    $('#foglio-testo').textContent = s.testo;
    $('#foglio-luce').textContent = t('jb_luce') + ': ' + s.luce;
    $('#foglio-camera').textContent = t('jb_camera') + ': ' + s.camera;
    $('.foglio-carta').style.borderTopColor = SIT[k].colore;
    var premio = $('#foglio-premio');
    premio.hidden = jb.sbloccati.length < SIT.length;
    premio.innerHTML = t('jb_premio', { codice: esc(SITO.premioJukebox || '') });
    $('#foglio-wa').href = waLink(t('wa_situazione', { titolo: s.titolo, codice: 101 + k }));
  }
  function chiudiFoglio() { $('#foglio').hidden = true; foglioAperto = -1; }

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
  function disegnaContatti() {
    var C = SITO.contatti || {};
    var wa = String(C.whatsapp || '').replace(/\D/g, ''), ig = String(C.instagram || '').replace(/^@/, '').trim();
    var riga = '<div class="contatti-riga">' +
      (C.indirizzo ? '<a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(C.indirizzo.replace(/’/g, "'")) + '" target="_blank" rel="noopener">' + esc(C.indirizzo) + '</a>' : '') +
      (C.telefono ? '<a href="tel:' + esc(String(C.telefono).replace(/\s/g, '')) + '">' + esc(C.telefono) + '</a>' : '') +
      (C.email ? '<a href="mailto:' + esc(C.email) + '?subject=' + encodeURIComponent(t('mail_oggetto')) + '">' + esc(C.email) + '</a>' : '') +
      '</div>';
    var bWa = wa.length >= 8
      ? '<a class="btn-social wa" aria-label="WhatsApp" href="https://wa.me/' + wa + '?text=' + encodeURIComponent(t('wa_testo')) + '" target="_blank" rel="noopener">' + ICONA_WA + '<span>' + esc(t('wa_btn')) + '</span></a>'
      : '<span class="btn-social wa vuoto" title="' + esc(t('manca')) + '">' + ICONA_WA + '<span>' + esc(t('wa_btn')) + '</span><small>' + esc(t('manca')) + '</small></span>';
    var bIg = ig
      ? '<a class="btn-social ig" aria-label="Instagram @' + esc(ig) + '" href="https://instagram.com/' + encodeURIComponent(ig) + '" target="_blank" rel="noopener">' + ICONA_IG + '<span>@' + esc(ig) + '</span></a>'
      : '<span class="btn-social ig vuoto" title="' + esc(t('manca')) + '">' + ICONA_IG + '<span>' + esc(t('ig_btn')) + '</span><small>' + esc(t('manca')) + '</small></span>';
    var tel = String(C.telefono || '').replace(/[^\d+]/g, '');
    // dentro un'anteprima (iframe) i link tel: e mailto: sono bloccati: si apre un pannello da copiare
    var bTel = tel.length >= 8 ? (inCornice
      ? '<button type="button" class="btn-social tel" data-azione="contatto-tel">' + ICONA_TEL + '<span>' + esc(t('tel_btn')) + '</span></button>'
      : '<a class="btn-social tel" href="tel:' + tel + '">' + ICONA_TEL + '<span>' + esc(t('tel_btn')) + '</span></a>') : '';
    var bMail = C.email ? (inCornice
      ? '<button type="button" class="btn-social mail" data-azione="contatto-mail">' + ICONA_MAIL + '<span>' + esc(t('mail_btn')) + '</span></button>'
      : '<a class="btn-social mail" href="mailto:' + esc(C.email) + '?subject=' + encodeURIComponent(t('mail_oggetto')) + '">' + ICONA_MAIL + '<span>' + esc(t('mail_btn')) + '</span></a>') : '';
    $('#contatti').innerHTML = '<div class="social">' + bWa + bIg + bTel + bMail + '</div>' + riga;
  }


  /* ================= ∞ · LO STUDIO: il tempo si ferma ================= */
  var orologio = $('#orologio'), tempoFermo = false, tFermo = 0, oraFerma = '';
  for (var q = 0; q < 60; q += 5) {
    var tc = el('span', { class: 'tacca' + (q % 15 === 0 ? ' grande' : '') });
    tc.style.transform = 'rotate(' + (q * 6) + 'deg) translateY(-70px)';
    orologio.insertBefore(tc, orologio.firstChild);
  }
  orologio.insertBefore(el('span', { class: 'numero-orologio', 'aria-hidden': 'true' }, 'XII'), orologio.firstChild);
  function muoviLancette() {
    if (tempoFermo) return;
    var d = new Date(), sec = d.getSeconds(), min = d.getMinutes() + sec / 60, ore = (d.getHours() % 12) + min / 60;
    $('#lancetta-ore').style.transform = 'rotate(' + (ore * 30) + 'deg)';
    $('#lancetta-min').style.transform = 'rotate(' + (min * 6) + 'deg)';
    $('#lancetta-sec').style.transform = 'rotate(' + (sec * 6) + 'deg)';
  }
  muoviLancette(); setInterval(muoviLancette, 1000);
  function disegnaTempo() {
    var b = $('#ferma-tempo');
    b.textContent = t(tempoFermo ? 'riparti' : 'ferma');
    b.setAttribute('aria-pressed', tempoFermo ? 'true' : 'false');
    $('#tempo-ora').textContent = tempoFermo ? t('fermo_alle', { ora: oraFerma }) : '';
  }
  function impostaTempo(fermo) {
    tempoFermo = fermo;
    if (fermo) { var d = new Date(); oraFerma = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
    scena.classList.toggle('tempo-fermo', fermo);
    muoviLancette(); disegnaTempo();
  }
  $('#ferma-tempo').addEventListener('click', function () { impostaTempo(!tempoFermo); });
  // scendendo a vedere lo studio il tempo si ferma da solo: le foto vanno a fuoco
  $('[data-id="studio"]').addEventListener('scroll', function () {
    if (!tempoFermo && this.scrollTop > 120) impostaTempo(true);
  }, { passive: true });

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
    numeraEtichette(); aggiornaNav();
    disegnaCalza(); disegnaPolaroid(); disegnaPennello(); disegnaPoker();
    disegnaJb(); disegnaFoglio();
    disegnaExvoto();
    disegnaFiltri(); disegnaGalleria(); if (quadroAperto >= 0) mostraQuadro(quadroAperto);
    disegnaOracolo();
    disegnaTunnel();
    disegnaContatti(); if (contattoTipo) apriContatto(contattoTipo);
    disegnaVendita();
    disegnaProdotti(); disegnaCarrello();
    disegnaTempo();
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
      scena.style.setProperty('--ry', (puntatore.attivo ? px * 7 : 0).toFixed(2) + 'deg');
      scena.style.setProperty('--rx', (puntatore.attivo ? -py * 6 : 0).toFixed(2) + 'deg');
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
    scena.classList.add('aperto'); setTimeout(entra, 50);
  } else {
    // il sipario aspetta il clic; se nessuno lo apre, si apre da solo dopo 7 secondi
    setTimeout(function () { if (stato.fase === 0) apri(); }, 7000);
  }
})();
