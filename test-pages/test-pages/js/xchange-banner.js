/**
 * BMW Supplier XChange — App Announcement Banner
 *
 * Behaviour:
 *  - First visit: banner slides in from the top after a short delay.
 *  - Close (×): banner slides out, floating icon appears. State saved to
 *    localStorage so the banner never auto-shows again for that visitor.
 *  - Floating icon click: banner re-expands (toggle, no localStorage change).
 *  - In-banner PDF icon: opens the How-To PDF in a new tab.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'xchangeBannerState';
  var PDF_PATH = 'files/BMW%20XChange%20App%20HOW-TO%202026.pdf';
  var BANNER_DELAY_MS = 400; // delay before first-visit slide-in
  var ANIM_DURATION_MS = 400; // matches CSS transition duration

  /* ---- SVG icons ---- */
  var phoneSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 ' +
    '2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>' +
    '</svg>';

  var closeSVG = '&times;';

  /* ---- Build DOM ---- */
  function buildBanner() {
    var banner = document.createElement('div');
    banner.id = 'xchange-banner';
    banner.setAttribute('role', 'banner');
    banner.classList.add('xchange-banner--hidden');

    banner.innerHTML =
      '<div class="xchange-banner-inner">' +
        '<span class="xchange-banner-text">' +
          '<strong>The BMW Supplier XChange event has gone digital!</strong> ' +
          'Check out the app — see your agenda, learn more about our speakers, ' +
          'view the event map and more! Click the icon to view the full how-to!' +
        '</span>' +
        '<a class="xchange-banner-pdf-btn" href="' + PDF_PATH + '" target="_blank" ' +
           'rel="noopener noreferrer" aria-label="View XChange App How-To PDF">' +
          phoneSVG +
        '</a>' +
        '<button class="xchange-banner-close" aria-label="Dismiss banner">' +
          closeSVG +
        '</button>' +
      '</div>';

    return banner;
  }

  function buildFloatingIcon() {
    var btn = document.createElement('button');
    btn.id = 'xchange-floating-icon';
    btn.setAttribute('aria-label', 'Show XChange app announcement');
    btn.innerHTML = phoneSVG;
    return btn;
  }

  /* ---- State helpers ---- */
  function isDismissed() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'dismissed';
    } catch (e) {
      return false;
    }
  }

  function setDismissed() {
    try {
      localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch (e) { /* storage unavailable — degrade gracefully */ }
  }

  /* ---- Animation helpers ---- */
  function showBanner(banner) {
    document.body.classList.add('xchange-banner-open');
    banner.classList.remove('xchange-banner--hidden');
  }

  function hideBanner(banner) {
    banner.classList.add('xchange-banner--hidden');
    document.body.classList.remove('xchange-banner-open');
  }

  function showFloatingIcon(icon) {
    icon.classList.add('xchange-floating-icon--visible');
  }

  function hideFloatingIcon(icon) {
    icon.classList.remove('xchange-floating-icon--visible');
  }

  /* ---- Init ---- */
  function init() {
    var banner = buildBanner();
    var floatingIcon = buildFloatingIcon();

    // Insert banner at the very start of <body> so it sits above all content
    document.body.insertBefore(banner, document.body.firstChild);
    document.body.appendChild(floatingIcon);

    if (isDismissed()) {
      // Returning visitor — show only the floating icon, no banner animation
      showFloatingIcon(floatingIcon);
    } else {
      // First visit — slide banner in after a short delay
      setTimeout(function () {
        showBanner(banner);
      }, BANNER_DELAY_MS);
    }

    /* ---- Close button ---- */
    var closeBtn = banner.querySelector('.xchange-banner-close');
    closeBtn.addEventListener('click', function () {
      setDismissed();
      hideBanner(banner);
      setTimeout(function () {
        showFloatingIcon(floatingIcon);
      }, ANIM_DURATION_MS);
    });

    /* ---- Floating icon — re-expand banner ---- */
    floatingIcon.addEventListener('click', function () {
      hideFloatingIcon(floatingIcon);
      showBanner(banner);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
