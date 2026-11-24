/* Light/dark toggle shared by every page of the suite.
   Uses the same localStorage key ('darkMode') as The Dagmaister, so the
   choice carries over between all tools. Load in <head> to avoid a flash. */
(function () {
  'use strict';
  var KEY = 'darkMode';

  function stored() {
    try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }

  function apply(dark) {
    document.documentElement.classList.toggle('dark', dark);
    if (document.body) document.body.classList.toggle('dark', dark);
    var btns = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', String(dark));
  }

  apply(stored());

  document.addEventListener('DOMContentLoaded', function () {
    apply(stored());
    var btns = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var dark = !document.documentElement.classList.contains('dark');
        try { localStorage.setItem(KEY, dark ? '1' : '0'); } catch (e) {}
        apply(dark);
      });
    }
  });
})();
