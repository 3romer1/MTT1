'use strict';

// Mobile navigation
(function () {
  var burger = document.querySelector('.hamburger');
  var links = document.querySelector('.nav-links');
  if (!burger || !links) return;
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Scroll-reveal animations
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
})();

// Animated stat counters
document.querySelectorAll('[data-count]').forEach(function (el) {
  var target = +el.dataset.count, start = performance.now(), dur = 1400;
  (function tick(now) {
    var p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(start);
});

// Graceful image fallback (replaces inline onerror handlers, which a strict CSP blocks).
// data-fallback="self" removes the image; "parent" removes its container.
(function () {
  function prune(img) {
    var t = img.dataset.fallback === 'parent' ? img.parentElement : img;
    if (t) t.remove();
  }
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) prune(img);
    else img.addEventListener('error', function () { prune(img); }, { once: true });
  });
})();

// Contact form → mailto (all fields URL-encoded)
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (name) {
      var f = form.elements[name];
      return f ? f.value.trim() : '';
    };
    var subject = '[Website] ' + v('topic') + ' inquiry from ' + v('name');
    var body = 'Name: ' + v('name') +
      '\nCompany: ' + v('company') +
      '\nEmail: ' + v('email') +
      '\nPhone: ' + v('phone') +
      '\n\n' + v('message');
    location.href = 'mailto:info@callmtt.com?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  });
})();
