(function () {
  'use strict';

  /* Tabs */
  function initTabs() {
    var tabs = document.querySelectorAll('.program-tab');
    var panels = document.querySelectorAll('.program-panel');

    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = this.getAttribute('aria-controls');

        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });

        panels.forEach(function (p) {
          p.classList.remove('active');
        });

        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        var panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* Scroll reveal */
  function initReveal() {
    var elements = document.querySelectorAll('.reveal');

    if (!elements.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) { observer.observe(el); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTabs();
    initReveal();
  });
})();
