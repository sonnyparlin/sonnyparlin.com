// Floating proposal switcher shared by all concept pages.
(function () {
  // ?scroll=N jumps straight to that offset (used for review screenshots).
  var m = location.search.match(/scroll=(\d+)/);
  if (m) { document.documentElement.style.scrollBehavior = 'auto'; addEventListener('load', function () { scrollTo(0, +m[1]); }); }
  // ?review=1 caps viewport-height sections so a tall headless screenshot shows every section.
  if (/review=1/.test(location.search)) {
    var rv = document.createElement('style');
    rv.textContent = '.hero{height:860px!important;min-height:0!important}.years .pin{position:static!important;height:auto!important;padding:60px 0!important}.step{min-height:0!important;padding:40px 0 40px 60px!important}.steps{padding:0!important}';
    document.head.appendChild(rv);
  }
  var here = location.pathname.split('/').pop();
  var items = [
    ['index.html', 'Compare'],
    ['a-editorial.html', 'A · Black Belt Editorial'],
    ['b-poster.html', 'B · Fight Night Poster'],
    ['c-cinematic.html', 'C · The Mat'],
    ['d-matwhite.html', 'D · Mat White'],
    ['e-sticker.html', 'E · Sticker'],
    ['f-journal.html', 'F · Journal']
  ];
  var bar = document.createElement('div');
  bar.id = 'proposal-switcher';
  bar.innerHTML = items.map(function (it) {
    return '<a href="' + it[0] + '"' + (it[0] === here ? ' class="on"' : '') + '>' + it[1] + '</a>';
  }).join('');
  var css = document.createElement('style');
  css.textContent = '#proposal-switcher{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:9999;display:flex;gap:4px;padding:5px;background:rgba(20,20,22,.92);border:1px solid rgba(255,255,255,.14);border-radius:999px;backdrop-filter:blur(8px);font:600 12px/1 Inter,system-ui,sans-serif;letter-spacing:.04em;box-shadow:0 10px 30px rgba(0,0,0,.5)}#proposal-switcher a{color:#cfcbc3;text-decoration:none;padding:8px 12px;border-radius:999px;white-space:nowrap}#proposal-switcher a.on{background:#c8102e;color:#fff}#proposal-switcher a:hover{color:#fff}@media(max-width:640px){#proposal-switcher{left:8px;right:8px;transform:none;overflow-x:auto}}';
  document.head.appendChild(css);
  document.body.appendChild(bar);
})();
