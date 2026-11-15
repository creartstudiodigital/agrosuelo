(function () {
  'use strict';
  function safe(fn, name) { try { fn(); } catch (e) { if (window.console) console.warn('[agrosuelo] ' + name, e); } }

  function initNav() {
    var nav = document.getElementById('nav');
    var toggle = document.getElementById('toggle');
    var onScroll = function () { nav.classList.toggle('is-solid', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.querySelectorAll('#menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) toggle.click();
    });
  }

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
          el.style.transitionDelay = Math.min(sibs, 5) * 70 + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function initParallax() {
    var items = document.querySelectorAll('[data-parallax]');
    if (!items.length) return;
    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      items.forEach(function (img) {
        var r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh;
        img.style.transform = 'translate3d(0,' + (p * -40).toFixed(1) + 'px,0) scale(1.05)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    // let hero intro animation finish first
    setTimeout(update, 2500);
  }

  function initServices() {
    // one open at a time
    var all = document.querySelectorAll('.svc');
    all.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) all.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  }

  function initForm() {
    var form = document.getElementById('form');
    var err = document.getElementById('formErr');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      if (!f.nombre.value.trim()) { err.textContent = 'Por favor, escribe tu nombre.'; f.nombre.focus(); return; }
      err.textContent = '';
      var msg = 'Hola Grupo Agrosuelo, soy ' + f.nombre.value.trim() + '.' +
        (f.ubicacion.value.trim() ? ' Mi finca está en ' + f.ubicacion.value.trim() + '.' : '') +
        ' Me interesa: ' + f.servicio.value + '.' +
        (f.mensaje.value.trim() ? ' ' + f.mensaje.value.trim() : '');
      var url = 'https://wa.me/584242580162?text=' + encodeURIComponent(msg);
      var w = null;
      try { w = window.open(url, '_blank', 'noopener'); } catch (x) {}
      if (!w) { err.innerHTML = '<a class="btn btn--lime btn--full" target="_blank" rel="noopener" href="' + url + '">Abrir WhatsApp con tu mensaje →</a>'; }
    });
  }


  function initCountdown() {
    var el = document.getElementById('countdown');
    if (!el || el.children.length > 0) return;
    var target = new Date('2026-12-12T12:00:00-04:00').getTime();
    function tick() {
      var d = target - Date.now();
      if (d <= 0) { el.hidden = true; return; }
      var days = Math.floor(d / 864e5), hrs = Math.floor(d / 36e5) % 24, min = Math.floor(d / 6e4) % 60;
      el.innerHTML = '<div><b>' + days + '</b><span>días</span></div><div><b>' + hrs + '</b><span>horas</span></div><div><b>' + min + '</b><span>min</span></div>';
      el.hidden = false;
    }
    tick(); setInterval(tick, 30000);
  }

  function initYear() { document.getElementById('year').textContent = new Date().getFullYear(); }

  function boot() {
    safe(initNav, 'nav');
    safe(initReveal, 'reveal');
    safe(initParallax, 'parallax');
    safe(initServices, 'services');
    safe(initForm, 'form');
    safe(initCountdown, 'countdown');
    safe(initYear, 'year');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
