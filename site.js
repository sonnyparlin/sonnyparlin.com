(function () {
  var root = document.documentElement;
  var review = /review=1/.test(location.search); // static render for tall screenshots
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motion = !review && !reduce;
  if (motion) root.classList.add('js');

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  // ---- Live "years on the mat" counter. Eight decimals so the last digit visibly moves.
  var live = document.getElementById('live');
  var heroVisible = true;
  if (live) {
    var since = new Date(live.getAttribute('data-since') + 'T00:00:00').getTime();
    var decimals = reduce ? 2 : 8;
    var cells = [];
    var paint = function () {
      var s = ((Date.now() - since) / 31557600000).toFixed(decimals);
      if (cells.length !== s.length) {
        live.textContent = '';
        cells = [];
        for (var i = 0; i < s.length; i++) {
          var c = document.createElement('i');
          if (s[i] === '.') c.className = 'dot';
          live.appendChild(c);
          cells.push(c);
        }
      }
      for (var j = 0; j < s.length; j++) if (cells[j].textContent !== s[j]) cells[j].textContent = s[j];
    };
    paint();
    if (motion) setInterval(function () { if (heroVisible && !document.hidden) paint(); }, 80);
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Tickers: build two identical halves so the loop is seamless.
  each('.ticker[data-items]', function (t) {
    var items = t.getAttribute('data-items').split('|');
    var track = document.createElement('div');
    track.className = 'ticker-track';
    for (var half = 0; half < 2; half++) {
      for (var rep = 0; rep < 8; rep++) {
        items.forEach(function (text, i) {
          var s = document.createElement('span');
          s.textContent = text;
          if (i % 3 === 0) s.className = 'k';
          if (i % 3 === 2) s.className = 'end';
          track.appendChild(s);
        });
      }
    }
    t.setAttribute('aria-hidden', 'true');
    t.appendChild(track);
  });

  // ---- Split headlines into words so they can rise into place.
  if (motion) {
    each('[data-split]', function (el) {
      var text = el.textContent.replace(/\s+/g, ' ').trim();
      el.setAttribute('aria-label', text);
      el.textContent = '';
      text.split(' ').forEach(function (word, i) {
        var outer = document.createElement('span');
        var inner = document.createElement('span');
        outer.className = 'w';
        outer.setAttribute('aria-hidden', 'true');
        outer.style.setProperty('--i', i);
        inner.textContent = word;
        outer.appendChild(inner);
        el.appendChild(outer);
        el.appendChild(document.createTextNode(' '));
      });
    });
  }

  // ---- Reveal on scroll.
  each('.chain li', function (li, i) { li.style.setProperty('--i', i); });
  each('.rack .bar', function (li, i) { li.style.setProperty('--i', i); });
  var fade = '.kicker, .lead, .count-label, .meta, .story-photo, .story-body p, .belts-head, .prof, .match, .big, .big-sub, .academy-photo, .academy-copy > *, .seal, .life-photo, .life-body p, .train-links li, .foot-word';
  var flag = '[data-split], .chain, .rack, .stripes';
  if (motion && 'IntersectionObserver' in window) {
    each(fade, function (el) { el.classList.add('rv'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    each(fade + ', ' + flag, function (el) { io.observe(el); });
    var hero = document.querySelector('.hero');
    if (hero) new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; }).observe(hero);
  } else {
    root.classList.remove('js');
  }

  // ---- Rail: size each segment to its section so the rail is the page in miniature.
  var belts = Array.prototype.slice.call(document.querySelectorAll('.belt'));
  var foot = document.querySelector('.foot');
  var railParts = Array.prototype.slice.call(document.querySelectorAll('.rail a, .rail b'));
  var dot = document.querySelector('.rail-dot');
  function sizeRail() {
    belts.concat(foot ? [foot] : []).forEach(function (sec, i) {
      if (railParts[i]) railParts[i].style.setProperty('--f', Math.max(1, sec.offsetHeight));
    });
  }

  // ---- Pinned sideways gallery (wide screens with a real pointer only).
  var hgal = document.getElementById('hgal');
  var pin = hgal && hgal.querySelector('.hgal-pin');
  var strip = hgal && hgal.querySelector('.cards');
  var ghost = hgal && hgal.querySelector('.hgal-ghost');
  var bar = hgal && hgal.querySelector('.hgal-bar');
  var wide = window.matchMedia('(min-width: 1000px) and (hover: hover) and (pointer: fine)');
  var pinned = false, overflow = 0;
  function setupGallery() {
    if (!hgal) return;
    hgal.classList.remove('is-pinned');
    hgal.style.removeProperty('--h');
    strip.style.transform = '';
    pinned = motion && wide.matches;
    if (!pinned) return;
    hgal.classList.add('is-pinned');
    var gutter = parseFloat(getComputedStyle(strip).paddingLeft) || 0;
    overflow = Math.max(0, strip.scrollWidth + gutter - window.innerWidth);
    hgal.style.setProperty('--h', (window.innerHeight + overflow) + 'px');
  }
  function galleryProgress() {
    var r = hgal.getBoundingClientRect();
    var span = r.height - window.innerHeight;
    return span > 0 ? clamp(-r.top / span, 0, 1) : 0;
  }
  if (strip) {
    // Keyboard users: bring the focused photo to the middle by scrolling the page.
    strip.addEventListener('focusin', function (e) {
      if (!pinned || !e.target.matches || !e.target.matches('.card:focus-visible')) return;
      var c = e.target;
      var p = overflow ? clamp((c.offsetLeft + c.offsetWidth / 2 - window.innerWidth / 2) / overflow, 0, 1) : 0;
      var top = hgal.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo(0, top + p * (hgal.offsetHeight - window.innerHeight));
      pin.scrollLeft = 0;
    });
    pin.addEventListener('scroll', function () { pin.scrollLeft = 0; });
  }

  // ---- One scroll handler: active nav link, rail marker, gallery position.
  var sections = ['story', 'lineage', 'competition', 'academy', 'life']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var links = document.querySelectorAll('[data-sec]');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var line = window.innerHeight * 0.4;
    var current = null;
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s.id; });
    Array.prototype.forEach.call(links, function (a) { a.classList.toggle('on', a.getAttribute('data-sec') === current); });
    if (dot) {
      var h = root.scrollHeight;
      dot.style.setProperty('--p', clamp((window.pageYOffset + window.innerHeight / 2) / h, 0, 1));
    }
    if (pinned) {
      var p = galleryProgress();
      strip.style.transform = 'translate3d(' + (-p * overflow) + 'px,0,0)';
      if (bar) bar.style.setProperty('--p', p);
      if (ghost) ghost.style.setProperty('--gx', (window.innerWidth * 0.35 - p * window.innerWidth * 1.1) + 'px');
    }
  }
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  function relayout() { setupGallery(); sizeRail(); onScroll(); }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', relayout);
  window.addEventListener('load', relayout);
  if (wide.addEventListener) wide.addEventListener('change', relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  relayout();

  // ---- YouTube facade: load the player only when asked.
  each('.video[data-id]', function (box) {
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

  // ---- Lightbox with previous/next, keyboard, and swipe.
  var box = document.getElementById('lightbox');
  var boxImg = document.getElementById('lightbox-img');
  var boxCount = document.getElementById('lightbox-count');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  if (box && typeof box.showModal === 'function' && cards.length) {
    var idx = 0;
    var show = function (i) {
      idx = (i + cards.length) % cards.length;
      var card = cards[idx];
      var img = card.querySelector('img');
      boxImg.src = card.getAttribute('data-full');
      boxImg.alt = img ? img.alt : '';
      if (boxCount) boxCount.textContent = (idx < 9 ? '0' : '') + (idx + 1) + ' / ' + cards.length;
      [idx + 1, idx - 1].forEach(function (n) {
        var c = cards[(n + cards.length) % cards.length];
        var pre = new Image(); pre.src = c.getAttribute('data-full');
      });
    };
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
