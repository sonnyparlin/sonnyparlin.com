(function () {
  if (/review=1/.test(location.search)) {
    var rv = document.createElement('style');
    rv.textContent = '.reveal{opacity:1!important;transform:none!important}';
    document.head.appendChild(rv);
  }

  // Live "on the mat for" counter in the nav, ticking to six decimals.
  var live = document.getElementById('live');
  if (live) {
    var since = new Date(live.getAttribute('data-since') + 'T00:00:00');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function tick() {
      var years = (Date.now() - since.getTime()) / 31557600000;
      live.textContent = (reduce ? years.toFixed(2) : years.toFixed(6)) + ' years';
    }
    tick();
    if (!reduce) setInterval(tick, 250);
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Reveal-on-scroll.
  var targets = document.querySelectorAll('.story > *, .chain li, .belts, .prof, .big, .academy-grid > *, .cards, .life > *');
  targets.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Active section in the nav.
  var sections = ['story', 'lineage', 'academy', 'competition', 'life']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var links = document.querySelectorAll('[data-sec]');
  function track() {
    var line = window.innerHeight * 0.4;
    var current = null;
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s.id; });
    links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-sec') === current); });
  }
  window.addEventListener('scroll', track, { passive: true });
  track();

  // Lightbox for the competition cards.
  var box = document.getElementById('lightbox');
  var boxImg = document.getElementById('lightbox-img');
  if (box && typeof box.showModal === 'function') {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('click', function () {
        var img = card.querySelector('img');
        boxImg.src = card.getAttribute('data-full');
        boxImg.alt = img ? img.alt : '';
        box.showModal();
      });
    });
    box.querySelector('.lightbox-close').addEventListener('click', function () { box.close(); });
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
    box.addEventListener('close', function () { boxImg.src = ''; });
  }
})();
