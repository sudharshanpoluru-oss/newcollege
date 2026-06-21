document.addEventListener('DOMContentLoaded', function () {
  /* ===== FILTER TABS ===== */
  var filterBtns = document.querySelectorAll('.corner-filters__btn');
  var cards = document.querySelectorAll('.corner-grid .corner-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      var filter = btn.getAttribute('data-filter');

      cards.forEach(function (card) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ===== MODALS ===== */
  var modals = document.querySelectorAll('.modal');
  var timetableModal = document.getElementById('timetableModal');
  var calendarModal = document.getElementById('calendarModal');
  var timetableBtn = document.getElementById('timetableBtn');
  var calendarBtn = document.getElementById('calendarBtn');
  var closeBtns = document.querySelectorAll('.modal__close');
  var backdrops = document.querySelectorAll('.modal__backdrop');

  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  function closeAllModals() {
    modals.forEach(function (m) { closeModal(m); });
  }

  if (timetableBtn) {
    timetableBtn.addEventListener('click', function () { openModal(timetableModal); });
  }

  if (calendarBtn) {
    calendarBtn.addEventListener('click', function () { openModal(calendarModal); });
  }

  closeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = btn.closest('.modal');
      closeModal(modal);
    });
  });

  backdrops.forEach(function (backdrop) {
    backdrop.addEventListener('click', function () {
      var modal = backdrop.closest('.modal');
      closeModal(modal);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  /* ===== TIMETABLE TABS ===== */
  var ttBtns = document.querySelectorAll('.timetable-tabs__btn');
  var ttContents = {
    regular: document.getElementById('ttRegular'),
    supply: document.getElementById('ttSupply'),
    class: document.getElementById('ttClass')
  };

  ttBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      ttBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      var session = btn.getAttribute('data-session');

      Object.keys(ttContents).forEach(function (key) {
        if (ttContents[key]) {
          ttContents[key].hidden = key !== session;
        }
      });
    });
  });
});
