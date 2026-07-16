/* Clark & Sons — interactions & GSAP animations */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Header scroll state ---- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector('.nav__toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
    document.querySelectorAll('.mobile-panel a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      var ans = item.querySelector('.faq__a');
      var isOpen = item.classList.contains('open');
      if (isOpen) {
        item.classList.remove('open');
        ans.style.maxHeight = null;
      } else {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });
  window.addEventListener('resize', function () {
    document.querySelectorAll('.faq__item.open .faq__a').forEach(function (a) {
      a.style.maxHeight = a.scrollHeight + 'px';
    });
  });

  /* ---- Hero word rotator ---- */
  var rot = document.querySelector('[data-rotate]');
  if (rot && !reduce) {
    var words = JSON.parse(rot.getAttribute('data-rotate'));
    var i = 0;
    setInterval(function () {
      i = (i + 1) % words.length;
      if (window.gsap) {
        gsap.to(rot, { opacity: 0, y: -14, duration: 0.3, ease: 'power2.in', onComplete: function () {
          rot.textContent = words[i];
          gsap.fromTo(rot, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        }});
      } else { rot.textContent = words[i]; }
    }, 2600);
  }

  /* ---- GSAP animations ---- */
  if (window.gsap && !reduce) {
    gsap.registerPlugin(ScrollTrigger);

    /* Hero entrance */
    var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl.from('[data-hero] h1 > *, [data-hero] h1', { y: 40, opacity: 0, duration: 0.9 })
          .from('[data-hero] .hero__sub', { y: 26, opacity: 0, duration: 0.7 }, '-=0.55')
          .from('[data-hero] .hero__cta > *', { y: 24, opacity: 0, duration: 0.6, stagger: 0.12 }, '-=0.5')
          .from('[data-hero] .hstat__num, [data-hero] .hstat', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4');
    gsap.to('.hero__bg img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    /* Generic reveals */
    gsap.utils.toArray('.reveal').forEach(function (el) {
      var d = parseFloat(el.getAttribute('data-delay')) || 0;
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: d,
        scrollTrigger: { trigger: el, start: 'top 86%' },
        onStart: function () { el.classList.add('is-in'); }
      });
    });

    /* Staggered groups */
    gsap.utils.toArray('[data-stagger]').forEach(function (group) {
      var items = group.children;
      gsap.from(items, {
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: group, start: 'top 82%' }
      });
    });

    /* Count-up numbers */
    gsap.utils.toArray('[data-count]').forEach(function (el) {
      var end = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: function () {
          gsap.to(obj, { v: end, duration: 1.6, ease: 'power2.out',
            onUpdate: function () { el.textContent = Math.round(obj.v) + suffix; } });
        }
      });
    });
  } else {
    /* No GSAP / reduced motion: ensure everything visible */
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---- Footer year ---- */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();
})();
