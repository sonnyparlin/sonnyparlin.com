(function () {
  if (/review=1/.test(location.search)) {
    var rv = document.createElement('style');
    rv.textContent = '.reveal{opacity:1!important;transform:none!important}';
    document.head.appendChild(rv);
  }

  // Live "on the mat for" counter in the nav. Once a second is plenty.
  var live = document.getElementById('live');
  if (live) {
    var since = new Date(live.getAttribute('data-since') + 'T00:00:00');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function tick() {
      var years = (Date.now() - since.getTime()) / 31557600000;
      live.textContent = (reduce ? years.toFixed(2) : years.toFixed(6)) + ' years';
    }
    tick();
    if (!reduce) setInterval(tick, 1000);
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Reveal-on-scroll.
  var targets = document.querySelectorAll('.story > *, .chain li, .belts, .prof, .big, .big-sub, .academy-grid > *, .match, .cards, .life > *, .train-inner > *');
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

  // YouTube facade: load the player only when asked.
  document.querySelectorAll('.video[data-id]').forEach(function (box) {
    var play = box.querySelector('.play');
    if (!play) return;
    play.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + box.getAttribute('data-id') + '?autoplay=1&rel=0';
      f.title = play.getAttribute('aria-label') || 'Video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.setAttribute('allowfullscreen', '');
      box.innerHTML = '';
      box.appendChild(f);
    });
  });

  // Lightbox with previous/next, keyboard, and swipe.
  var box = document.getElementById('lightbox');
  var boxImg = document.getElementById('lightbox-img');
  var boxCount = document.getElementById('lightbox-count');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  if (box && typeof box.showModal === 'function' && cards.length) {
    var idx = 0;
    function show(i) {
      idx = (i + cards.length) % cards.length;
      var card = cards[idx];
      var img = card.querySelector('img');
      boxImg.src = card.getAttribute('data-full');
      boxImg.alt = img ? img.alt : '';
      if (boxCount) boxCount.textContent = (idx + 1) + ' / ' + cards.length;
      // Warm the neighbours so arrows feel instant.
      [idx + 1, idx - 1].forEach(function (n) {
        var c = cards[(n + cards.length) % cards.length];
        var pre = new Image(); pre.src = c.getAttribute('data-full');
      });
    }
    cards.forEach(function (card, i) {
      card.addEventListener('click', function () { show(i); box.showModal(); });
    });
    box.querySelector('.lightbox-close').addEventListener('click', function () { box.close(); });
    box.querySelector('.lightbox-nav.prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    box.querySelector('.lightbox-nav.next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
    box.addEventListener('close', function () { boxImg.src = ''; });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
    });
    var startX = null;
    box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) show(dx < 0 ? idx + 1 : idx - 1);
    }, { passive: true });
  }
})();
