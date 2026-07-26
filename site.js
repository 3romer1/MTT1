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

// Any nav link click collapses the mobile hamburger menu
(function () {
  var navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;
  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a') && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      var burger = document.querySelector('.hamburger');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Services dropdown:
// - hover previews the menu (pure CSS)
// - on desktop, clicking "Services" toggles the menu open/closed instead of
//   jumping the page (the services overview stays reachable from the menu items,
//   footer, and hero CTA)
// - picking an item closes the menu immediately; Escape or clicking outside also closes
(function () {
  document.querySelectorAll('.nav-links li').forEach(function (li) {
    var dd = li.querySelector('.dropdown');
    if (!dd) return;
    var toggle = li.querySelector(':scope > a');
    var desktop = function () { return window.matchMedia('(min-width: 961px)').matches; };
    var setOpen = function (open) {
      dd.classList.toggle('force-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');

    // "is-closed" also suppresses the hover/focus preview, so a close action
    // sticks even while the pointer or focus is still on the nav item.
    // It re-arms when the pointer leaves or focus moves elsewhere.
    var close = function () { setOpen(false); dd.classList.add('is-closed'); };

    toggle.addEventListener('click', function (e) {
      if (!desktop()) return;                       // mobile: submenu is always visible; let it navigate
      e.preventDefault();
      if (dd.classList.contains('force-open')) { close(); }
      else { dd.classList.remove('is-closed'); setOpen(true); }
    });

    dd.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;                            // picked an item: hide at once
      close();
      link.blur();
    });

    li.addEventListener('mouseleave', function () { dd.classList.remove('is-closed'); });
    li.addEventListener('focusout', function (e) {
      if (!li.contains(e.relatedTarget)) { setOpen(false); dd.classList.remove('is-closed'); }
    });

    document.addEventListener('click', function (e) {
      if (!li.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && (dd.classList.contains('force-open') || li.matches(':focus-within'))) {
        close();
        toggle.focus();
      }
    });
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
