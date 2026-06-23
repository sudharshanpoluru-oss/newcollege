(function() {
  var savedTheme = localStorage.getItem('ysrec-theme') || 'classic';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

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

  /* ── Dropdown keyboard accessibility ── */
  var dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.dropdown__trigger');
    if (trigger) {
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');

      function toggleDropdown(e) {
        e.stopPropagation();
        var isActive = dropdown.classList.contains('active');
        dropdowns.forEach(function (other) {
          other.classList.remove('active');
          var otherTrigger = other.querySelector('.dropdown__trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        });
        if (!isActive) {
          dropdown.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        } else {
          dropdown.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        }
      }

      trigger.addEventListener('click', toggleDropdown);

      trigger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleDropdown(e);
        }
        if (e.key === 'Escape') {
          dropdown.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        }
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

  /* ── Scroll Progress Bar ── */
  function initScrollProgress() {
    var container = document.createElement('div');
    container.className = 'scroll-progress-container';
    var bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    container.appendChild(bar);
    document.body.appendChild(container);

    window.addEventListener('scroll', function () {
      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      bar.style.width = scrolled + "%";
    }, { passive: true });
  }

  /* ── Follow-Glow Spotlight Effect ── */
  function initFollowGlow() {
    var selector = '.card--glow, .profile-card, .stat-card, .panel, .map-address-card, .faculty-card, .lab-card, .placement-stat, .fact-card, .vm-card, .course-card, .committee-card, .corner-card, .tt-branch-btn, .tt-year-btn, .fc-stat-card, .fh-card';
    
    function attachGlow(el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        el.style.setProperty('--mouse-x', x + 'px');
        el.style.setProperty('--mouse-y', y + 'px');
      });
    }

    document.querySelectorAll(selector).forEach(attachGlow);

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches && node.matches(selector)) {
              attachGlow(node);
            }
            node.querySelectorAll(selector).forEach(attachGlow);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* ── Theme Switcher Widget ── */
  function initThemeSwitcher() {
    var widget = document.createElement('div');
    widget.className = 'theme-selector-widget';
    widget.innerHTML = [
      '<button class="theme-selector-btn" aria-label="Choose Theme" type="button">',
      '  <span class="material-symbols-outlined">palette</span>',
      '</button>',
      '<div class="theme-options-panel">',
      '  <div class="theme-options-title">Select Theme</div>',
      '  <div class="theme-option-row" data-theme="classic">',
      '    <div class="theme-swatch theme-swatch--classic"></div>',
      '    <span class="theme-option-label">Classic Prestige</span>',
      '  </div>',
      '  <div class="theme-option-row" data-theme="emerald">',
      '    <div class="theme-swatch theme-swatch--emerald"></div>',
      '    <span class="theme-option-label">Emerald Campus</span>',
      '  </div>',
      '  <div class="theme-option-row" data-theme="crimson">',
      '    <div class="theme-swatch theme-swatch--crimson"></div>',
      '    <span class="theme-option-label">Sunset Crimson</span>',
      '  </div>',
      '  <div class="theme-option-row" data-theme="midnight">',
      '    <div class="theme-swatch theme-swatch--midnight"></div>',
      '    <span class="theme-option-label">Cyber Midnight</span>',
      '  </div>',
      '</div>'
    ].join('\n');
    
    document.body.appendChild(widget);

    var btn = widget.querySelector('.theme-selector-btn');
    var rows = widget.querySelectorAll('.theme-option-row');

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      widget.classList.toggle('open');
    });

    rows.forEach(function (row) {
      row.addEventListener('click', function () {
        var selectedTheme = this.getAttribute('data-theme');
        setTheme(selectedTheme);
        widget.classList.remove('open');
      });
    });

    document.addEventListener('click', function () {
      widget.classList.remove('open');
    });
    widget.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    function setTheme(themeName) {
      document.documentElement.setAttribute('data-theme', themeName);
      localStorage.setItem('ysrec-theme', themeName);
      
      rows.forEach(function (r) {
        if (r.getAttribute('data-theme') === themeName) {
          r.classList.add('active');
        } else {
          r.classList.remove('active');
        }
      });
    }

    var currentTheme = localStorage.getItem('ysrec-theme') || 'classic';
    setTheme(currentTheme);
  }

  // Initialize UI upgrades
  initScrollProgress();
  initFollowGlow();
  initThemeSwitcher();
});
