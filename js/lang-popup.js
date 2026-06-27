// ============================================================
// QUARTZ MØLLE — LANGUAGE POPUP
// Drop-in: just add <script src="js/lang-popup.js"></script> to a page.
// Shows once per visitor (stored in localStorage). Styles live in css/style.css.
// ============================================================
(function () {
  'use strict';

  var STORAGE_KEY = 'qm_lang_choice';   // stores 'da' or 'en'
  var SHOW_DELAY = 900;                 // ms before the card slides in

  // OPTIONAL: to actually send English visitors somewhere, set a URL here.
  // Leave null to just remember the choice and close (no English site exists yet).
  // Example with Google Translate:
  // var ENGLISH_URL = 'https://translate.google.com/translate?sl=da&tl=en&u=' +
  //                   encodeURIComponent(location.href);
  var ENGLISH_URL = null;

  // Don't run twice, and skip if the visitor already chose.
  if (window.__qmLangPopupLoaded) return;
  window.__qmLangPopupLoaded = true;

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}

  if (saved) {
    applyChoice(saved, false);
    return;
  }

  function applyChoice(lang, fromClick) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.documentElement.setAttribute('data-lang', lang);

    if (lang === 'en') {
      document.documentElement.lang = 'en';
      // Hook point: load English translations here when they exist.
      if (fromClick && ENGLISH_URL) {
        window.location.href = ENGLISH_URL;
      }
    } else {
      document.documentElement.lang = 'da';
    }
  }

  function build() {
    var pop = document.createElement('div');
    pop.className = 'lang-pop';
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-label', 'Vælg sprog / Choose language');
    pop.innerHTML =
      '<div class="lang-pop-head">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<circle cx="12" cy="12" r="10"></circle>' +
          '<path d="M2 12h20"></path>' +
          '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>' +
        '</svg>' +
        '<span>Sprog / Language</span>' +
      '</div>' +
      '<p class="lang-pop-q">Vil du se siden på engelsk?<br>Would you like to view this site in English?</p>' +
      '<div class="lang-pop-btns">' +
        '<button class="lang-pop-btn primary" data-lang="en">🇬🇧 &nbsp;Switch to English</button>' +
        '<button class="lang-pop-btn secondary" data-lang="da">🇩🇰 &nbsp;Fortsæt på dansk</button>' +
      '</div>';

    document.body.appendChild(pop);

    pop.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang-pop-btn');
      if (!btn) return;
      applyChoice(btn.getAttribute('data-lang'), true);
      close(pop);
    });

    // Slide in
    requestAnimationFrame(function () {
      setTimeout(function () { pop.classList.add('open'); }, SHOW_DELAY);
    });
  }

  function close(pop) {
    pop.classList.remove('open');
    setTimeout(function () {
      if (pop && pop.parentNode) pop.parentNode.removeChild(pop);
    }, 350);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
