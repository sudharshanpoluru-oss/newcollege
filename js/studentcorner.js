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
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function closeAllModals() {
    modals.forEach(function (m) { closeModal(m); });
  }

  if (timetableBtn) {
    timetableBtn.addEventListener('click', function () {
      renderTimetableBranches();
      openModal(timetableModal);
    });
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

  /* ===== TIMETABLE BRANCH / YEAR BROWSER ===== */
  var branches = [
    {abbr:"CE", name:"Civil Engineering"},
    {abbr:"CSE", name:"Computer Science & Engineering"},
    {abbr:"ECE", name:"Electronics & Communication Engineering"},
    {abbr:"EEE", name:"Electrical & Electronics Engineering"},
    {abbr:"ME", name:"Mechanical Engineering"},
    {abbr:"MMT", name:"Metallurgy & Material Technology"},
    {abbr:"SH", name:"Science & Humanities"}
  ];
  var years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  function renderTimetableBranches() {
    var body = document.getElementById('ttModalBody');
    if (!body) return;
    body.removeAttribute('data-branch');
    body.removeAttribute('data-year');
    body.innerHTML =
      '<h2 class="tt-modal-title">Timetable</h2>' +
      '<p class="tt-modal-subtitle">Select your branch to view the academic scheduling.</p>' +
      '<div class="tt-grid-branches">' +
      branches.map(function(b) {
        return '<button type="button" class="tt-branch-btn" data-branch="' + b.abbr + '">' +
        '<span class="tt-branch-btn-abbr">' + b.abbr + '</span>' +
        '<span class="tt-branch-btn-name">' + b.name + '</span>' +
        '</button>';
      }).join("") +
      '</div>';
  }

  function renderTimetableYears(branch) {
    var body = document.getElementById('ttModalBody');
    if (!body) return;
    body.setAttribute('data-branch', branch);
    body.removeAttribute('data-year');
    var b = branches.find(function(x) { return x.abbr === branch; });
    body.innerHTML =
      '<div class="tt-header-flex">' +
      '<button type="button" class="tt-back-btn" aria-label="Back"><span class="material-symbols-outlined">arrow_back</span></button>' +
      '<h2 class="tt-modal-title">' + (b ? b.abbr + " - " + b.name : branch) + '</h2>' +
      '</div>' +
      '<p class="tt-modal-subtitle">Select your academic year.</p>' +
      '<div class="tt-grid-years">' +
      years.map(function(y) {
        return '<button type="button" class="tt-year-btn" data-branch="' + branch + '" data-year="' + y + '">' +
        '<span class="material-symbols-outlined tt-year-btn-icon">calendar_month</span>' +
        '<span class="tt-year-btn-text">' + y + '</span>' +
        '</button>';
      }).join("") +
      '</div>';
  }

  function renderTimetableImage(branch, year) {
    var body = document.getElementById('ttModalBody');
    if (!body) return;
    body.setAttribute('data-branch', branch);
    body.setAttribute('data-year', year);
    var b = branches.find(function(x) { return x.abbr === branch; });
    var imgPath = "/timetables/" + branch + "/" + year.charAt(0) + ".png";
    body.innerHTML =
      '<div class="tt-header-flex">' +
      '<button type="button" class="tt-back-btn" aria-label="Back"><span class="material-symbols-outlined">arrow_back</span></button>' +
      '<h2 class="tt-modal-title tt-title-ellipsis">' + (b ? b.abbr + " - " + b.name : branch) + ' - ' + year + '</h2>' +
      '<div class="tt-zoom-controls">' +
      '<button type="button" class="tt-zoom-btn tt-zoom-out" aria-label="Zoom out"><span class="material-symbols-outlined">remove</span></button>' +
      '<span class="tt-zoom-level">100%</span>' +
      '<button type="button" class="tt-zoom-btn tt-zoom-in" aria-label="Zoom in"><span class="material-symbols-outlined">add</span></button>' +
      '</div>' +
      '</div>' +
      '<div class="tt-image-wrap">' +
      '<img src="' + imgPath + '" class="tt-image-el" alt="' + (b ? b.abbr : branch) + ' ' + year + ' Timetable" onerror="this.outerHTML=\'<div class=\\\'tt-image-error\\\'><span class=\\\'material-symbols-outlined\\\'>image_not_supported</span><p>Timetable image not loaded.<br>Please select another year or check back later.</p></div>\'">' +
      '</div>';
  }

  // Click delegation for timetable modal
  document.getElementById('timetableModal').addEventListener('click', function(e) {
    var back = e.target.closest('.tt-back-btn');
    if (back) {
      var body = document.getElementById('ttModalBody');
      var curBranch = body.getAttribute('data-branch');
      var curYear = body.getAttribute('data-year');
      if (curBranch && curYear) {
        renderTimetableYears(curBranch);
      } else if (curBranch) {
        renderTimetableBranches();
      } else {
        renderTimetableBranches();
      }
      return;
    }

    var zi = e.target.closest('.tt-zoom-in');
    var zo = e.target.closest('.tt-zoom-out');
    if (zi || zo) {
      var body = document.getElementById('ttModalBody');
      var img = body.querySelector('.tt-image-el');
      var lvl = body.querySelector('.tt-zoom-level');
      if (!img || !lvl) return;
      var z = parseFloat(img.getAttribute('data-zoom') || '1');
      z = zi ? Math.min(z + 0.25, 5) : Math.max(z - 0.25, 0.25);
      img.style.transform = 'scale(' + z + ')';
      img.style.transformOrigin = 'top left';
      img.setAttribute('data-zoom', z);
      lvl.textContent = Math.round(z * 100) + '%';
      return;
    }

    var yr = e.target.closest('.tt-year-btn');
    if (yr) {
      renderTimetableImage(yr.getAttribute('data-branch'), yr.getAttribute('data-year'));
      return;
    }

    var btn = e.target.closest('.tt-branch-btn');
    if (btn) {
      renderTimetableYears(btn.getAttribute('data-branch'));
      return;
    }
  });

  // Wheel zoom on timetable image
  document.getElementById('timetableModal').addEventListener('wheel', function(e) {
    if (!e.ctrlKey) return;
    e.preventDefault();
    var body = document.getElementById('ttModalBody');
    var img = body.querySelector('.tt-image-el');
    var lvl = body.querySelector('.tt-zoom-level');
    if (!img || !lvl) return;
    var z = parseFloat(img.getAttribute('data-zoom') || '1');
    z = e.deltaY < 0 ? Math.min(z + 0.25, 5) : Math.max(z - 0.25, 0.25);
    img.style.transform = 'scale(' + z + ')';
    img.style.transformOrigin = 'top left';
    img.setAttribute('data-zoom', z);
    lvl.textContent = Math.round(z * 100) + '%';
  }, { passive: false });

  // Pan support for timetable image
  (function() {
    var body = document.getElementById('timetableModal');
    var panning = false, startX, startY, scrollL, scrollT, panTarget = null;
    body.addEventListener('mousedown', function(e) {
      var wrap = e.target.closest('.tt-image-wrap');
      if (!wrap || e.target.closest('a, button')) return;
      panning = true; panTarget = wrap;
      startX = e.clientX; startY = e.clientY;
      scrollL = wrap.scrollLeft; scrollT = wrap.scrollTop;
      wrap.style.cursor = "grabbing";
      e.preventDefault();
    });
    document.addEventListener('mousemove', function(e) {
      if (!panning || !panTarget) return;
      panTarget.scrollLeft = scrollL - (e.clientX - startX);
      panTarget.scrollTop = scrollT - (e.clientY - startY);
    });
    document.addEventListener('mouseup', function() {
      if (panTarget) panTarget.style.cursor = "";
      panning = false; panTarget = null;
    });
    var lastPinchDist = 0;
    body.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2) {
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchDist = Math.sqrt(dx * dx + dy * dy);
      }
    }, { passive: true });
    body.addEventListener('touchmove', function(e) {
      if (e.touches.length !== 2) return;
      e.preventDefault();
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (lastPinchDist > 0) {
        var dir = dist > lastPinchDist ? 1 : -1;
        var img = body.querySelector('.tt-image-el');
        var lvl = body.querySelector('.tt-zoom-level');
        if (img && lvl) {
          var z = parseFloat(img.getAttribute('data-zoom') || '1');
          z = dir > 0 ? Math.min(z + 0.25, 5) : Math.max(z - 0.25, 0.25);
          img.style.transform = 'scale(' + z + ')';
          img.style.transformOrigin = 'top left';
          img.setAttribute('data-zoom', z);
          lvl.textContent = Math.round(z * 100) + '%';
        }
      }
      lastPinchDist = dist;
    }, { passive: false });
    body.addEventListener('touchend', function() { lastPinchDist = 0; }, { passive: true });
  })();
});
