/* VR Couverture — interactions */
(function () {
  'use strict';

  var TEL = '+33759518726';
  var MAIL = 'contact@vr-couverture.fr';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- année ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- hauteur de la barre d'appel ---------- */
  var bar = document.getElementById('callbar');
  function barH() {
    var h = (bar && getComputedStyle(bar).display !== 'none') ? bar.offsetHeight : 0;
    document.documentElement.style.setProperty('--sticky-h', h + 'px');
  }
  barH();
  window.addEventListener('resize', barH);

  /* ---------- apparition au défilement ---------- */
  var rv = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) {
    rv.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        setTimeout(function () { e.target.classList.add('in'); }, Math.min(i * 60, 240));
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  }

  /* ---------- galerie ---------- */
  // [fichier, largeur, hauteur, metier, classe de tuile, legende]
  var PHOTOS = [
    ['g1',  1100, 688,  'couverture', 't-xl', 'Couverture', "Réfection complète de la toiture d'une longère en tuiles terre cuite"],
    ['g2',  1100, 825,  'charpente',  '',     'Charpente',  "Grange : charpente et couverture entièrement refaites"],
    ['g3',  1100, 825,  'couverture', '',     'Couverture', "Fenêtre de toit posée et raccordée sur une couverture en tuiles"],
    ['g4',  1100, 825,  'couverture', 't-md', 'Couverture', "Pose des tuiles en cours sur liteaunage neuf"],
    ['g5',  1100, 688,  'charpente',  't-md', 'Charpente',  "Liteaunage neuf sur charpente traitée, pignon en pierre"],
    ['g6',   840, 630,  'zinc',       't-md', 'Zinguerie',  "Couverture zinc à joint debout sur une toiture terrasse"],
    ['g7',  1100, 825,  'zinc',       't-po', 'Étanchéité', "Support bois neuf posé avant étanchéité d'une toiture plate"],
    ['g8',  1100, 1467, 'facade',     't-po', 'Démoussage', "Nettoyage haute pression d'une toiture en tuiles"],
    ['g9',  1100, 1467, 'facade',     't-po', 'Ravalement', "Ravalement de façade terminé sur un pignon"],
    ['g10', 1100, 1467, 'facade',     't-po', 'Ravalement', "Ravalement et reprise de la rive de toit"],
    ['g11', 1100, 825,  'couverture', 't-wd', 'Couverture', "Réfection de toiture sous échafaudage sur une maison en pierre"],
    ['g12', 1100, 825,  'zinc',       't-wd', 'Étanchéité', "Étanchéité et raccord de tuiles autour d'un châssis de toit"]
  ];

  var gal = document.getElementById('gal');
  var galNone = document.getElementById('galNone');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var visible = PHOTOS.map(function (_, i) { return i; });   // indices affichés

  var PLUS = '<span class="gt__plus" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none">' +
             '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></span>';

  if (gal) {
    var html = '';
    PHOTOS.forEach(function (p, i) {
      html += '<button type="button" class="gt ' + p[4] + '" data-i="' + i + '" data-f="' + p[3] + '"' +
              ' aria-label="Agrandir : ' + p[6] + '">' +
              '<img src="img/' + p[0] + '-sm.webp" width="620" height="465" loading="lazy" decoding="async" alt="' + p[6] + '">' +
              PLUS +
              '<span class="gt__c"><span class="gt__m">' + p[5] + '</span>' + p[6] + '</span>' +
              '</button>';
    });
    gal.innerHTML = html;

    // apparition en cascade a la premiere entree dans le viewport
    if (!reduce && 'IntersectionObserver' in window) {
      var tuiles = Array.prototype.slice.call(gal.querySelectorAll('.gt'));
      tuiles.forEach(function (t) { t.classList.add('is-out'); });
      var ioG = new IntersectionObserver(function (entries) {
        if (!entries.some(function (e) { return e.isIntersecting; })) return;
        tuiles.forEach(function (t, i) {
          setTimeout(function () { t.classList.remove('is-out'); }, i * 45);
        });
        ioG.disconnect();
      }, { threshold: 0.05 });
      ioG.observe(gal);
    }
  }

  function filtrer(f) {
    var tiles = gal.querySelectorAll('.gt');
    visible = [];
    tiles.forEach(function (t) {
      var on = (f === 'tout' || t.dataset.f === f);
      if (on) visible.push(+t.dataset.i);
      if (reduce) { t.hidden = !on; return; }
      if (on) {
        t.hidden = false;
        requestAnimationFrame(function () { t.classList.remove('is-out'); });
      } else {
        t.classList.add('is-out');
        setTimeout(function () { if (t.classList.contains('is-out')) t.hidden = true; }, 280);
      }
    });
    if (galNone) galNone.hidden = visible.length > 0;
  }

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (o) { o.setAttribute('aria-selected', String(o === c)); });
      filtrer(c.dataset.f);
    });
  });

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('lb'), lbImg = document.getElementById('lbImg'),
      lbCap = document.getElementById('lbCap'), pos = 0, opener = null;

  function precharge(i) {
    if (i < 0 || i >= visible.length) return;
    var im = new Image(); im.src = 'img/' + PHOTOS[visible[i]][0] + '.webp';
  }
  function show(i) {
    if (!visible.length) return;
    pos = (i + visible.length) % visible.length;
    var p = PHOTOS[visible[pos]];
    lbImg.src = 'img/' + p[0] + '.webp';
    lbImg.alt = p[6];
    lbCap.innerHTML = '<b>' + p[5] + '</b> ' + p[6] +
                      ' <span class="lb__num">' + (pos + 1) + ' / ' + visible.length + '</span>';
    precharge(pos + 1); precharge(pos - 1);
  }
  function open(idx) {
    var i = visible.indexOf(idx);
    if (i < 0) return;
    opener = document.activeElement;
    show(i);
    lb.hidden = false; lb.classList.add('on');
    document.body.style.overflow = 'hidden';
    document.getElementById('lbX').focus();
  }
  function close() {
    lb.classList.remove('on'); lb.hidden = true;
    document.body.style.overflow = '';
    if (opener) opener.focus();
  }

  if (gal && lb) {
    gal.addEventListener('click', function (e) {
      var b = e.target.closest('button.gt');
      if (b) open(+b.dataset.i);
    });
    document.getElementById('lbX').addEventListener('click', close);
    document.getElementById('lbP').addEventListener('click', function () { show(pos - 1); });
    document.getElementById('lbN').addEventListener('click', function () { show(pos + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });

    // balayage tactile
    var sx = 0, sy = 0, sw = false;
    lb.addEventListener('touchstart', function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; sw = true;
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (!sw) return;
      sw = false;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) show(pos + (dx < 0 ? 1 : -1));
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close();
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(pos - 1);
      else if (e.key === 'ArrowRight') show(pos + 1);
      else if (e.key === 'Tab') {
        var f = lb.querySelectorAll('button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- comparateur avant / après ---------- */
  var CHANTIERS = [
    { id: 'a1', nom: 'Longère en pierre',
      detail: 'Charpente, liteaunage, écran sous-toiture et couverture tuile',
      altA: "La même longère avant travaux, charpente et liteaunage à nu",
      altB: "Toiture terminée en tuiles neuves sur une longère en pierre" },
    { id: 'a2', nom: 'Grange',
      detail: 'Charpente déposée puis refaite, couverture tuile et rives',
      altA: "Grange avant travaux, charpente à nu sous échafaudage",
      altB: "Grange après travaux, toiture en tuiles terminée" }
  ];

  var cmp = document.getElementById('cmp');
  if (cmp) {
    var top = document.getElementById('cmpTop'),
        rule = document.getElementById('cmpRule'),
        handle = document.getElementById('cmpHandle'),
        chipA = document.getElementById('chipA'),
        chipB = document.getElementById('chipB'),
        imgA = document.getElementById('cmpBefore'),
        imgB = document.getElementById('cmpAfter'),
        meta = document.getElementById('cmpMeta'),
        tabs = Array.prototype.slice.call(document.querySelectorAll('.ba__tab'));

    var K = 140, C = 18, SWEEP = 2.6, FADE = 12;
    var st = { x: 50, v: 0, target: 50, drag: false, pid: null, sweep: false, swept: false, t0: 0 };
    var raf = 0, last = 0;

    function clamp(v) { return v < 0 ? 0 : v > 100 ? 100 : v; }
    function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function sweepAt(u) {
      if (u < .38) return lerp(50, 94, ease(u / .38));
      if (u < .78) return lerp(94, 6, ease((u - .38) / .4));
      return lerp(6, 50, ease((u - .78) / .22));
    }
    function paint() {
      var x = clamp(st.x);
      top.style.clipPath = 'inset(0 ' + (100 - x).toFixed(2) + '% 0 0)';
      rule.style.left = x.toFixed(2) + '%';
      handle.setAttribute('aria-valuenow', Math.round(x));
      handle.setAttribute('aria-valuetext', Math.round(x) + ' % avant');
      chipA.style.opacity = x > FADE ? '1' : '0';
      chipB.style.opacity = x < 100 - FADE ? '1' : '0';
    }
    function frame(ts) {
      var dt = Math.min(.05, Math.max(.001, (ts - last) / 1000));
      last = ts;
      if (st.sweep) {
        var u = (ts / 1000 - st.t0) / SWEEP;
        if (u >= 1) { st.sweep = false; st.swept = true; st.target = 50; }
        else st.target = sweepAt(u);
      }
      st.v += ((st.target - st.x) * K - st.v * C) * dt;
      st.x += st.v * dt;
      if (st.x < 0) { st.x = 0; st.v = 0; }
      if (st.x > 100) { st.x = 100; st.v = 0; }
      paint();
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    function set(v) {
      st.sweep = false; st.swept = true;
      st.target = clamp(v);
      if (reduce) { st.x = st.target; st.v = 0; paint(); }
    }
    function fromX(clientX) {
      var r = cmp.getBoundingClientRect();
      set((clientX - r.left) / Math.max(1, r.width) * 100);
    }

    cmp.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      st.drag = true; st.pid = e.pointerId;
      if (cmp.setPointerCapture) cmp.setPointerCapture(e.pointerId);
      fromX(e.clientX);
    });
    cmp.addEventListener('pointermove', function (e) {
      if (st.drag && e.pointerId === st.pid) fromX(e.clientX);
    });
    function end() { st.drag = false; st.pid = null; }
    cmp.addEventListener('pointerup', end);
    cmp.addEventListener('pointercancel', end);
    cmp.addEventListener('dblclick', function () { set(50); });

    handle.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 10 : 2, n = st.target;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') n += step;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') n -= step;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = 100;
      else return;
      e.preventDefault();
      set(n);
    });

    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var c = CHANTIERS[+t.dataset.i];
        tabs.forEach(function (o) { o.setAttribute('aria-selected', String(o === t)); });
        imgA.src = 'img/ba/' + c.id + '-avant.webp'; imgA.alt = c.altA;
        imgB.src = 'img/ba/' + c.id + '-apres.webp'; imgB.alt = c.altB;
        meta.innerHTML = '<b>' + c.nom + '</b> <span>' + c.detail + '</span>';
        set(50);
      });
    });

    paint();
    if (reduce) {
      st.swept = true;
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            start();
            if (!st.swept && !st.sweep) { st.sweep = true; st.t0 = performance.now() / 1000; }
          } else { stop(); }
        });
      }, { threshold: .25 }).observe(cmp);
    } else { start(); }
  }

  /* ---------- carte de la zone ---------- */
  var zsvg = document.getElementById('zmapSvg'),
      ztip = document.getElementById('zmapTip'),
      zlist = document.getElementById('villes');

  if (zsvg && zlist) {
    var zpaths = {};
    Array.prototype.forEach.call(zsvg.querySelectorAll('.z'), function (p) {
      zpaths[p.id.replace(/^z-/, '')] = p;
    });
    var zlis = {};
    Array.prototype.forEach.call(zlist.querySelectorAll('li[data-z]'), function (li) {
      zlis[li.dataset.z] = li;
    });

    var actif = null;
    function surligne(slug, e) {
      if (actif === slug) { if (e) place(e); return; }
      eteins();
      actif = slug;
      if (zpaths[slug]) zpaths[slug].classList.add('on');
      if (zlis[slug]) zlis[slug].classList.add('on');
      if (zpaths[slug] && ztip) {
        ztip.textContent = zpaths[slug].dataset.nom;
        ztip.classList.add('on');
        place(e);
      }
    }
    function eteins() {
      if (!actif) return;
      if (zpaths[actif]) zpaths[actif].classList.remove('on');
      if (zlis[actif]) zlis[actif].classList.remove('on');
      actif = null;
      if (ztip) ztip.classList.remove('on');
    }
    function place(e) {
      if (!ztip) return;
      var box = zsvg.parentNode.getBoundingClientRect(), x, y;
      if (e && e.clientX !== undefined) { x = e.clientX - box.left; y = e.clientY - box.top; }
      else if (actif && zpaths[actif]) {
        var r = zpaths[actif].getBoundingClientRect();
        x = r.left + r.width / 2 - box.left; y = r.top + r.height / 2 - box.top;
      } else return;
      ztip.style.left = Math.max(8, Math.min(box.width - 8, x)) + 'px';
      ztip.style.top = y + 'px';
    }

    Array.prototype.forEach.call(zsvg.querySelectorAll('.z'), function (p) {
      var slug = p.id.replace(/^z-/, '');
      p.addEventListener('pointerenter', function (e) { surligne(slug, e); });
      p.addEventListener('pointermove', function (e) { if (actif === slug) place(e); });
      p.addEventListener('pointerleave', eteins);
    });
    zsvg.addEventListener('pointerleave', eteins);

    Object.keys(zlis).forEach(function (slug) {
      var li = zlis[slug];
      li.addEventListener('pointerenter', function () { surligne(slug, null); });
      li.addEventListener('pointerleave', eteins);
    });
  }

  /* ---------- formulaire ---------- */
  var form = document.getElementById('devis');
  if (form) {
    var errBox = document.getElementById('formErr'), btn = document.getElementById('send');

    function fail(msg) { errBox.textContent = msg; errBox.hidden = false; }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errBox.hidden = true;
      var nom = form.nom, tel = form.telephone;
      [nom, tel].forEach(function (i) { i.parentNode.classList.remove('f--err'); });

      var digits = tel.value.replace(/\D/g, '');
      if (!nom.value.trim()) { nom.parentNode.classList.add('f--err'); nom.focus(); return fail('Indiquez votre nom.'); }
      if (digits.length < 9) { tel.parentNode.classList.add('f--err'); tel.focus(); return fail('Indiquez un numéro de téléphone valide.'); }

      var data = {
        nom: nom.value.trim(),
        telephone: tel.value.trim(),
        ville: form.ville.value.trim(),
        type_travaux: form.type_travaux.value || 'non précisé',
        message: form.message.value.trim(),
        _subject: 'Devis VR Couverture — ' + nom.value.trim(),
        _template: 'table'
      };

      btn.disabled = true;
      btn.textContent = 'Envoi…';

      fetch('https://formsubmit.co/ajax/' + MAIL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error('http');
        form.hidden = true;
        document.getElementById('sent').hidden = false;
        document.getElementById('sent').scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = 'Recevoir mon devis gratuit';
        fail("L'envoi a échoué. Ouverture d'un SMS pré-rempli, ou appelez le 07 59 51 87 26.");
        var txt = 'Demande de devis — ' + data.nom + ' — ' + data.telephone +
                  (data.ville ? ' — ' + data.ville : '') + ' — ' + data.type_travaux +
                  (data.message ? ' — ' + data.message : '');
        window.location.href = 'sms:' + TEL + '?&body=' + encodeURIComponent(txt);
      });
    });
  }
})();
