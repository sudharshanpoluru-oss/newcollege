document.addEventListener('DOMContentLoaded', function () {
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

  var currentPath = window.location.pathname;
  var navLinks = document.querySelectorAll('.primary-nav__links a');
  navLinks.forEach(function (link) {
    if (link.getAttribute('href') === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });

  // Dropdown toggle on click
  var dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.dropdown__trigger');
    if (trigger) {
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        
        // Close other dropdowns
        dropdowns.forEach(function (other) {
          if (other !== dropdown) {
            other.classList.remove('active');
          }
        });
        
        dropdown.classList.toggle('active');
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function () {
    dropdowns.forEach(function (dropdown) {
      dropdown.classList.remove('active');
    });
  });

  // Prevent closing when clicking inside the dropdown menu
  var dropdownMenus = document.querySelectorAll('.dropdown__menu');
  dropdownMenus.forEach(function (menu) {
    menu.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });

  // ===== VICE-CHANCELLOR MODAL TRIGGER & TABS =====
  var viewProfileBtn = document.getElementById('viewProfileBtn');
  var profileModal = document.getElementById('profileModal');
  var closeModalBtn = document.getElementById('closeModalBtn');
  var modalBackdrop = document.getElementById('modalBackdrop');

  if (viewProfileBtn && profileModal) {
    viewProfileBtn.addEventListener('click', function () {
      profileModal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden'; // Prevent scrolling background
    });

    function closeModal() {
      profileModal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', closeModal);
    }

    // Escape key close support
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !profileModal.hasAttribute('hidden')) {
        closeModal();
      }
    });

    // Tab switching
    var tabBtns = profileModal.querySelectorAll('.modal-tab-btn');
    var tabContents = profileModal.querySelectorAll('.tab-content');

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Remove active class from all buttons
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        // Hide all tab contents
        tabContents.forEach(function (c) { c.classList.remove('active'); });

        // Add active class to clicked button
        this.classList.add('active');
        // Show corresponding tab content
        var targetTab = this.getAttribute('data-tab');
        var targetEl = document.getElementById('tab-' + targetTab);
        if (targetEl) {
          targetEl.classList.add('active');
        }
      });
    });
  }
});
