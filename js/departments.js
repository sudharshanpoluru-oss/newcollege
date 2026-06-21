(function () {
  'use strict';

  /* Smooth scroll for in-page nav links */
  function initSmoothScroll() {
    var links = document.querySelectorAll('.dept-nav a[href^="#"]');

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });

          links.forEach(function (l) { l.classList.remove('active'); });
          this.classList.add('active');
        }
      });
    });
  }

  /* Active nav highlight on scroll */
  function initNavHighlight() {
    var sections = document.querySelectorAll('[data-nav-section]');
    var navLinks = document.querySelectorAll('.dept-nav a');

    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-60px 0px 0px 0px' }
    );

    sections.forEach(function (section) { observer.observe(section); });
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
    initSmoothScroll();
    initNavHighlight();
    initReveal();
  });
})();
