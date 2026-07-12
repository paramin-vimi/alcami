/* ============================================================
   ALCAMI — main.js  ·  vanilla, GSAP-optional
   ============================================================ */
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof gsap !== 'undefined';

  const A = 'assets/img/';
  const FALLBACK = [
    'linear-gradient(145deg,#2a2a2c 0%,#1c1c1e 55%,#161617 100%)',
    'linear-gradient(160deg,#33302a 0%,#201e1a 55%,#161514 100%)'
  ];
  const IMAGES = {
    'hero':     A + 'factory-highres.jpg',
    'hero-2':   A + 'slide1.jpg',
    'hero-3':   A + 'slide2.jpg',
    'about':    A + 'news-3.jpg',
    'factory':  A + 'slide1.jpg',
    'facilities': A + 'facilities.jpg',
    'news-1':   A + 'news-1.jpg',
    'news-2':   A + 'news-2.jpg',
    'news-3':   A + 'news-3.jpg',
    // facilities (real photos from alcamiglobal.com/facilities)
    'fac-1':    A + 'facilities/facilities_alcami_industries.jpg', // Alcami Industries (Thailand) — Rayong
    'fac-2':    A + 'facilities/facilities2.jpg',                  // Alcami Manufacturing (Thailand) — Prachinburi aerial
    'fac-3':    A + 'facilities/facilities3.jpg',                  // Alcami Technology (Thailand) — Prachinburi
    'fac-4':    A + 'facilities/facilities5.jpg',                  // Alcami Industries (Philippines)
    'fac-5':    A + 'facilities/facilities4.jpg',                  // Alcami Global (Singapore) — sourcing & trading
    // solutions
    's-thermoforming': A + 'solutions/thermoforming.png',
    's-injection':     A + 'solutions/injection.png',
    's-mold':          A + 'solutions/mold.png',
    's-extrusion':     A + 'solutions/extrusion.png',
    's-cnc':           A + 'solutions/cnc.png',
    's-transport':     A + 'solutions/transport.png',
    's-diwashing':     A + 'solutions/diwashing.png',
    's-film':          A + 'solutions/film.png',
    's-warehousing':   A + 'solutions/warehousing.png',
    's-sourcing':      A + 'solutions/sourcing.png',
    's-assembly':      A + 'solutions/assembly.png'
  };

  let fbI = 0;
  function paint(el, key) {
    const url = IMAGES[key];
    const fb = FALLBACK[fbI++ % FALLBACK.length];
    if (!url) { el.style.backgroundImage = fb; return; }
    const abs = new URL(url, document.baseURI).href;
    const img = new Image();
    img.onload = () => { el.style.backgroundImage = `url("${abs}")`; };
    img.onerror = () => { el.style.backgroundImage = fb; };
    img.src = abs;
  }

  function splitWords() {
    document.querySelectorAll('.split-words').forEach((el) => {
      if (el.dataset.done) return; el.dataset.done = '1';
      const frag = document.createDocumentFragment();
      el.childNodes.forEach((node) => {
        if (node.nodeType === 3) {
          node.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok.trim()) { frag.appendChild(document.createTextNode(tok)); return; }
            const s = document.createElement('span'); s.className = 'word'; s.style.display = 'inline-block'; s.textContent = tok; frag.appendChild(s);
          });
        } else frag.appendChild(node.cloneNode(true));
      });
      el.innerHTML = ''; el.appendChild(frag);
    });
  }

  function initReveals() {
    const els = document.querySelectorAll('.reveal');
    if (reduced || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
  }

  function initNav() {
    const nav = document.getElementById('nav');
    const on = () => nav.classList.toggle('is-solid', window.scrollY > 40);
    window.addEventListener('scroll', on, { passive: true }); on();
  }
  let menuEl;
  function closeMenu() { if (menuEl) { menuEl.classList.remove('is-open'); menuEl.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; } }
  function initMenu() {
    menuEl = document.getElementById('menu');
    const b = document.getElementById('burger');
    if (!menuEl || !b) return;
    b.addEventListener('click', () => {
      const open = menuEl.classList.toggle('is-open');
      menuEl.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href'); if (id.length < 2) return;
      const t = document.querySelector(id); if (!t) return;
      e.preventDefault(); closeMenu();
      t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }));
  }
  function initLang() {
    document.querySelectorAll('.lang').forEach((g) => g.querySelectorAll('.lang__opt').forEach((o) => {
      o.addEventListener('click', () => {
        document.querySelectorAll('.lang__opt').forEach((x) => { x.classList.toggle('is-active', x.dataset.lang === o.dataset.lang); x.setAttribute('aria-pressed', x.dataset.lang === o.dataset.lang); });
        document.documentElement.lang = o.dataset.lang;
      });
    }));
  }

  function initHero() {
    const slides = document.querySelectorAll('.hero__slide');
    if (slides.length > 1 && !reduced) {
      let i = 0;
      setInterval(() => { slides[i].classList.remove('is-active'); i = (i + 1) % slides.length; slides[i].classList.add('is-active'); }, 5500);
    }
    if (hasGSAP && !reduced) {
      const lines = document.querySelectorAll('.hero__title .line > span');
      if (lines.length) {
        gsap.set(lines, { yPercent: 115 });
        gsap.to(lines, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.1, delay: 0.15 });
      }
      gsap.fromTo('.hero__eyebrow, .hero__lead, .hero__cta, .hero__aside > *', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.5 });
      setTimeout(() => { if (lines.length) gsap.set(lines, { yPercent: 0 }); gsap.set('.hero__eyebrow,.hero__lead,.hero__cta,.hero__aside > *', { opacity: 1, y: 0 }); }, 2200);
    }
  }

  function initCounters() {
    const nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    const io = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      const el = e.target, target = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', pre = el.dataset.prefix || '';
      if (reduced) { el.textContent = pre + target + suf; return; }
      let s = null; const dur = 1400;
      const step = (t) => { if (!s) s = t; const p = Math.min((t - s) / dur, 1); el.textContent = pre + Math.floor((1 - Math.pow(1 - p, 3)) * target) + suf; if (p < 1) requestAnimationFrame(step); else el.textContent = pre + target + suf; };
      requestAnimationFrame(step);
    }), { threshold: 0.5 });
    nums.forEach((n) => io.observe(n));
  }

  function initForm() {
    const form = document.getElementById('contactForm'), status = document.getElementById('formStatus');
    if (!form || !status) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const name = (form.elements.name && form.elements.name.value.trim()) || 'there';
      form.reset(); status.hidden = false;
      status.textContent = 'Thanks, ' + name + ' — your message is ready to send. Our team will be in touch shortly.';
    });
  }

  /* ---- scroll progress bar ---- */
  function initProgress() {
    const bar = document.getElementById('scrollProgress'); if (!bar) return;
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? (window.scrollY / max).toFixed(4) : 0) + ')';
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---- sticky mobile quote bar: shows after hero, hides at the contact form ---- */
  function initQuickbar() {
    const bar = document.getElementById('quickbar'); if (!bar) return;
    const contact = document.getElementById('contact');
    let nearContact = false;
    function update() {
      const show = window.scrollY > 600 && !nearContact;
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
    }
    window.addEventListener('scroll', update, { passive: true });
    if (contact && 'IntersectionObserver' in window) {
      new IntersectionObserver((ents) => { ents.forEach((e) => { nearContact = e.isIntersecting; }); update(); }, { threshold: 0.05 }).observe(contact);
    }
    update();
  }

  /* ---- clients logo carousel (mobile): auto-scrolls, swipeable, loops seamlessly ---- */
  function initClientsCarousel() {
    const row = document.querySelector('.clients__row');
    const track = document.querySelector('.clients__track');
    if (!row || !track) return;
    const mq = window.matchMedia('(max-width: 720px)');
    const SPEED = 55;            // px per second (auto-scroll)
    const IDLE_RESUME = 2500;    // ms after last user input before auto resumes
    let rafId = null, lastT = null, lastInput = 0;

    const wrap = () => {
      const w = track.offsetWidth;
      if (w > 0 && row.scrollLeft >= w) row.scrollLeft -= w;
    };
    const tick = (t) => {
      if (lastT === null) lastT = t;
      const dt = Math.min((t - lastT) / 1000, 0.1); lastT = t;
      if (!reduced && performance.now() - lastInput > IDLE_RESUME) row.scrollLeft += SPEED * dt;
      wrap();
      rafId = requestAnimationFrame(tick);
    };
    const markInput = () => { lastInput = performance.now(); };
    ['touchstart', 'touchmove', 'pointerdown', 'wheel'].forEach((ev) =>
      row.addEventListener(ev, markInput, { passive: true }));
    row.addEventListener('scroll', wrap, { passive: true });

    const start = () => { if (rafId === null) { lastT = null; rafId = requestAnimationFrame(tick); } };
    const stop = () => { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; row.scrollLeft = 0; } };
    const apply = () => { if (mq.matches) start(); else stop(); };
    (mq.addEventListener ? mq.addEventListener('change', apply) : mq.addListener(apply));
    apply();
  }

  function initFactoryTour() {
    const sec = document.getElementById('factory');
    const play = document.getElementById('factoryPlay');
    const embed = document.getElementById('factoryEmbed');
    const close = document.getElementById('factoryClose');
    if (!sec || !play || !embed) return;
    const TOUR = 'https://tours.vrg.asia/alcami/';
    let loaded = false;
    play.addEventListener('click', () => {
      if (!loaded) {
        const f = document.createElement('iframe');
        f.src = TOUR;
        f.title = 'Alcami 360° factory virtual tour';
        f.setAttribute('allow', 'fullscreen; xr-spatial-tracking; gyroscope; accelerometer');
        f.setAttribute('allowfullscreen', '');
        f.loading = 'lazy';
        embed.appendChild(f);
        loaded = true;
      }
      sec.classList.add('is-playing');
      embed.setAttribute('aria-hidden', 'false');
      if (close) close.focus();
    });
    if (close) close.addEventListener('click', () => {
      sec.classList.remove('is-playing');
      embed.setAttribute('aria-hidden', 'true');
      play.focus();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sec.classList.contains('is-playing')) {
        sec.classList.remove('is-playing'); embed.setAttribute('aria-hidden', 'true'); play.focus();
      }
    });
  }

  function initTop() {
    const btn = document.getElementById('toTop'); if (!btn) return;
    const t = () => btn.classList.toggle('is-visible', window.scrollY > 600);
    window.addEventListener('scroll', t, { passive: true }); t();
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
  }

  function init() {
    document.querySelectorAll('[data-img]').forEach((el) => paint(el, el.dataset.img));
    splitWords(); initReveals(); initNav(); initMenu(); initAnchors(); initLang();
    initHero(); initCounters(); initForm(); initFactoryTour(); initTop();
    initProgress(); initClientsCarousel(); initQuickbar();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
