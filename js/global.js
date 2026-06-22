document.addEventListener('DOMContentLoaded', function () {
  /* ── Mobile Nav Toggle ── */
  var navToggle = document.querySelector('.nav-toggle');
  var primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
      this.setAttribute('aria-expanded', expanded);
      primaryNav.classList.toggle('open');

      var label = this.querySelector('.sr-only');
      if (label) {
        label.textContent = expanded ? 'Close menu' : 'Open menu';
      }
    });
  }

  /* ── Active Nav Link ── */
  var currentPath = window.location.pathname;
  var navLinks = document.querySelectorAll('.primary-nav__links a');
  navLinks.forEach(function (link) {
    if (link.getAttribute('href') === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ── Dropdown toggle on click ── */
  var dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.dropdown__trigger');
    if (trigger) {
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdowns.forEach(function (other) {
          if (other !== dropdown) {
            other.classList.remove('active');
          }
        });
        dropdown.classList.toggle('active');
      });
    }
  });

  document.addEventListener('click', function () {
    dropdowns.forEach(function (dropdown) {
      dropdown.classList.remove('active');
    });
  });

  var dropdownMenus = document.querySelectorAll('.dropdown__menu');
  dropdownMenus.forEach(function (menu) {
    menu.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });

  /* ── Back to Top ── */
  var backToTop = document.querySelector('[data-back-to-top]');
  if (backToTop) {
    var toggleBackToTop = function () {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Smooth Scroll Anchor Links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Scroll Animation (global reveal) ── */
  function initGlobalReveal() {
    var elements = document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-stagger');
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach(function (el) { observer.observe(el); });
  }

  initGlobalReveal();

  /* ── Modal Triggers ── */
  var viewProfileBtn = document.getElementById('viewProfileBtn');
  var profileModal = document.getElementById('profileModal');
  var closeModalBtn = document.getElementById('closeModalBtn');
  var modalBackdrop = document.getElementById('modalBackdrop');

  function closeModal() {
    if (profileModal) {
      profileModal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }
  }

  if (viewProfileBtn && profileModal) {
    viewProfileBtn.addEventListener('click', function () {
      profileModal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      var body = profileModal.querySelector('.modal__body');
      if (body) body.scrollTop = 0;
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !profileModal.hasAttribute('hidden')) {
        closeModal();
      }
    });

    var tabBtns = profileModal.querySelectorAll('.modal-tab-btn');
    var tabContents = profileModal.querySelectorAll('.tab-content');

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        tabContents.forEach(function (c) { c.classList.remove('active'); });
        this.classList.add('active');
        var targetTab = this.getAttribute('data-tab');
        var targetEl = document.getElementById('tab-' + targetTab);
        if (targetEl) targetEl.classList.add('active');
        var body = profileModal.querySelector('.modal__body');
        if (body) body.scrollTop = 0;
      });
    });
  }
});
