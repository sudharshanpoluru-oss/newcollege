(function () {
  "use strict";

  // — — —  ✦ G O O G L E   M A T E R I A L   I C O N S ✦ — — — 
  (function() {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
    document.head.appendChild(l);
  })();

  // — — —  ✦ N A V   L I N K   A C T I V E ✦ — — — 
  function updateActiveNavLink() {
    var currentPath = window.location.pathname.replace(/\/+$/, "");
    document.querySelectorAll(".nav-links a, .primary-nav__links a").forEach(function (link) {
      try {
        var rawHref = link.getAttribute("href");
        if (!rawHref || rawHref.indexOf("#") === 0 || rawHref.indexOf("javascript:") === 0) {
          link.classList.remove("active");
          return;
        }
        var url = new URL(link.href, window.location.origin);
        if (url.origin !== window.location.origin) {
          link.classList.remove("active");
          return;
        }
        var linkPath = url.pathname.replace(/\/+$/, "");
        var isMatch = (currentPath === linkPath);
        link.classList.toggle("active", isMatch);
      } catch (e) {}
    });
  }
  updateActiveNavLink();
  window.addEventListener("popstate", updateActiveNavLink);
  (function() {
    var origPush = history.pushState, origRep = history.replaceState;
    history.pushState = function() {
      origPush.apply(this, arguments);
      setTimeout(updateActiveNavLink, 50);
    };
    history.replaceState = function() {
      origRep.apply(this, arguments);
      setTimeout(updateActiveNavLink, 50);
    };
  })();

  // — — —  ✦ M O B I L E   N A V   T O G G L E ✦ — — — 
  var navToggle = document.querySelector(".mobile-toggle, .nav-toggle");
  var primaryNav = document.querySelector("#primaryNav, .nav-links");
  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      primaryNav.classList.toggle("show");
      var expanded = primaryNav.classList.contains("show");
      navToggle.setAttribute("aria-expanded", String(expanded));
      navToggle.innerHTML = expanded ? "&#10005;" : "&#9776;";
    });
    primaryNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        primaryNav.classList.remove("show");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ——— ✦ S C R O L L   P R O G R E S S   +   N A V   C O M P A C T ✦ ———
  var scrollEl = document.documentElement;
  var navbar = document.querySelector(".main-navbar, .primary-nav");
  window.addEventListener("scroll", function () {
    var scrollY = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollEl.style.setProperty("--scroll-progress", progress + "%");
    if (navbar) {
      navbar.classList.toggle("is-scrolled", scrollY > 80);
      navbar.classList.toggle("official-nav-compact", scrollY > 120);
    }
  }, { passive: true });

  // ——— ✦ R E V E A L   A N I M A T I O N S ✦ ———
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".section, .leadership, .notice, .service-bar, .page-hero, .home-wrapper > div").forEach(function (el) {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });

  // ——— ✦ S T A G G E R E D   R E V E A L ✦ ———
  var cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add("official-visible");
        }, i * 60);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(
    ".profile-card,.admin-card-horizontal,.doc-card,.branch-item,.video-card,.photo-card,.calendar-card,.student-link-card,.committee-item,.facilities-menu li,.gallery-sidebar button,.dept-sidebar button"
  ).forEach(function (el) {
    el.classList.add("official-reveal");
    cardObserver.observe(el);
  });

  // ——— ✦ C O U N T E R   A N I M A T I O N ✦ ———
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (!isFinite(target)) return;
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    var started = false;
    var counterObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting || started) return;
      started = true;
      var duration = 1200;
      var startTime = performance.now();
      function tick(now) {
        var progress = Math.min((now - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        el.textContent = prefix + current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.disconnect();
    }, { threshold: 0.3 });
    counterObserver.observe(el);
    el.classList.add("gov-counter");
  });

  // ——— ✦ F I L T E R   B U T T O N S ✦ ———
  document.querySelectorAll("[data-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter");
      document.querySelectorAll("[data-filter]").forEach(function (b) {
        b.classList.toggle("is-selected", b === button);
      });
      document.querySelectorAll("[data-category]").forEach(function (card) {
        card.hidden = filter !== "all" && card.getAttribute("data-category") !== filter;
      });
    });
  });

  // ——— ✦ A C C O R D I O N ✦ ———
  document.querySelectorAll(".accordion__button").forEach(function (button) {
    button.addEventListener("click", function () {
      var item = button.closest(".accordion__item");
      var panel = item.querySelector(".accordion__panel");
      var open = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
    });
  });

  // ——— ✦ L I G H T B O X ✦ ———
  var galleryImages = document.querySelectorAll(".media-grid img, .gallery-content .photo-card img");
  if (galleryImages.length) {
    var lightbox = document.createElement("div");
    lightbox.className = "official-lightbox";
    lightbox.hidden = true;
    lightbox.innerHTML = '<button type="button" aria-label="Close">&#10005;</button><img alt=""><p></p>';
    document.body.appendChild(lightbox);
    var previewImage = lightbox.querySelector("img");
    var previewText = lightbox.querySelector("p");
    var closeButton = lightbox.querySelector("button");
    galleryImages.forEach(function (img) {
      img.addEventListener("click", function () {
        previewImage.src = img.src || img.querySelector("img").src;
        previewImage.alt = img.alt || img.querySelector("img").alt;
        var title = img.closest(".photo-card, .video-card");
        previewText.textContent = title ? title.querySelector(".media-title, p:last-child").textContent : "";
        lightbox.hidden = false;
        closeButton.focus();
        document.body.style.overflow = "hidden";
      });
    });
    closeButton.addEventListener("click", function () {
      lightbox.hidden = true;
      document.body.style.overflow = "";
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) { lightbox.hidden = true; document.body.style.overflow = ""; }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) { lightbox.hidden = true; document.body.style.overflow = ""; }
    });
  }

  // ——— ✦ G O   T O   T O P ✦ ———
  document.addEventListener("DOMContentLoaded", function() {
    var btn = document.querySelector(".scroll-top-btn, .official-back-top");
    if (!btn) {
      btn = document.createElement("button");
      btn.className = "official-back-top";
      btn.type = "button";
      btn.setAttribute("aria-label", "Scroll to top");
      btn.textContent = "Go to Top";
      document.body.appendChild(btn);
    }
    btn.addEventListener("click", function() { window.scrollTo(0, 0); });
  });

  // ——— ✦ S E A R C H   P A N E L ✦ ———
  document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "k") {
      event.preventDefault();
      var searchPanel = document.querySelector(".official-search-panel");
      if (searchPanel) {
        searchPanel.hidden = !searchPanel.hidden;
        if (!searchPanel.hidden) {
          var input = searchPanel.querySelector("input");
          if (input) input.focus();
        }
      }
    }
    if (event.key === "Escape") {
      var searchPanel = document.querySelector(".official-search-panel");
      if (searchPanel && !searchPanel.hidden) searchPanel.hidden = true;
      var mainNav = document.querySelector(".nav-links.show, #primaryNav.is-open");
      if (mainNav) {
        mainNav.classList.remove("show", "is-open");
        var toggle = document.querySelector(".mobile-toggle, .nav-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  // ——— ✦ C A R D   T I L T   ( 3 D   H O V E R ) ✦ ———
  document.querySelectorAll(
    ".profile-card, .admin-card-horizontal, .branch-item, .calendar-card, .doc-card, .student-link-card"
  ).forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      card.style.setProperty("--rotate-x", ((y - cy) / cy) * -6 + "deg");
      card.style.setProperty("--rotate-y", ((x - cx) / cx) * 6 + "deg");
      card.style.setProperty("--translate-y", "-5px");
    });
    card.addEventListener("mouseleave", function () {
      card.style.setProperty("--rotate-x", "0deg");
      card.style.setProperty("--rotate-y", "0deg");
      card.style.setProperty("--translate-y", "0px");
    });
  });

  // ——— ✦ B U T T O N   R I P P L E ✦ ———
  document.querySelectorAll(
    ".top-orange-btn, .tab-btn, .back-btn, .submit-btn, .grievance-form button, .direction-btn, .add-btn, .official-search-head button"
  ).forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement("span");
      ripple.className = "gov-ripple";
      var size = Math.max(rect.width, rect.height);
      var x = e.clientX - rect.left - size / 2;
      var y = e.clientY - rect.top - size / 2;
      ripple.style.cssText =
        "position:absolute;border-radius:50%;width:" + size + "px;height:" + size + "px;" +
        "left:" + x + "px;top:" + y + "px;" +
        "background:rgba(255,255,255,0.35);transform:scale(0);" +
        "animation:govRipple 0.5s ease-out forwards;pointer-events:none;";
      btn.style.position = "relative";
      btn.style.overflow = "hidden";
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 500);
    });
  });

  // ——— ✦ G R A D I E N T   S K Y   B A R   A N I M ✦ ———
  var skyBar = document.querySelector(".top-sky-bar");
  if (skyBar) {
    var pos = 0;
    setInterval(function () {
      pos = (pos + 1) % 200;
      skyBar.style.background =
        "linear-gradient(" + (135 + pos * 0.5) + "deg, var(--gov-navy-dark), #0a3a5a, var(--gov-navy-dark))";
    }, 80);
  }

  // ——— ✦ S T U D E N T   C O R N E R   N A V   I N J E C T ✦ ———
  var _scNavTarget = null;
  var _scObs = null;
  function injectStudentCornerLink() {
    if (_scObs) _scObs.disconnect();
    var nav = document.querySelector(".nav-links, .primary-nav__links");
    if (!nav) {
      if (_scNavTarget) _scObs.observe(_scNavTarget, { childList: true, subtree: true });
      return;
    }
    var existing;
    try { existing = nav.querySelectorAll('li:has(a[href*="/studentcorner" i])'); }
    catch(e) { existing = []; }
    existing.forEach(function (el) { el.remove(); });
    var li = document.createElement("li");
    li.className = "dropdown";
    var a = document.createElement("a");
    a.href = "/studentcorner/";
    a.className = "nav-link";
    a.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;vertical-align:middle;margin-right:3px;">school</span>Student Corner';
    a.addEventListener("click", function(e) {
      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
        e.preventDefault();
        var cur = window.location.pathname.replace(/\/+$/, "");
        var tgt = "/studentcorner";
        if (cur !== tgt) {
          window.history.pushState(null, "", "/studentcorner/");
          window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
          document.querySelectorAll(".nav-links a, .primary-nav__links a").forEach(function(l) {
            l.classList.toggle("active", l.getAttribute("href") === "/studentcorner/");
          });
        }
      }
    });
    li.appendChild(a);
    var ref = nav.querySelector('li a[href*="/facilities" i]');
    if (ref) {
      ref = ref.closest("li");
      nav.insertBefore(li, ref.nextElementSibling);
    } else {
      nav.appendChild(li);
    }
    var scPath = window.location.pathname.replace(/\/+$/, "");
    if (scPath === "/studentcorner") a.classList.add("active");
    if (_scNavTarget) _scObs.observe(_scNavTarget, { childList: true, subtree: true });
  }
  _scNavTarget = document.querySelector(".nav-links, .primary-nav__links");
  _scObs = new MutationObserver(injectStudentCornerLink);
  injectStudentCornerLink();

  // ——— ✦ S T U D E N T   C O R N E R   P O R T A L   I N J E C T ✦ ———
  var _scPortalHTML =
    '<div class="sc-dashboard">' +
    '  <!-- BREADCRUMBS -->' +
    '  <div class="sc-breadcrumbs">' +
    '    <a href="/">Home</a>' +
    '    <span class="material-symbols-outlined sc-bread-sep">chevron_right</span>' +
    '    <span class="sc-bread-current">Student Corner</span>' +
    '  </div>' +
    '  <!-- HERO SECTION -->' +
    '  <div class="sc-hero">' +
    '    <div class="sc-hero-overlay"></div>' +
    '    <div class="sc-hero-content">' +
    '      <div class="sc-hero-badge"><span class="material-symbols-outlined">school</span>Student Portal</div>' +
    '      <h1 class="sc-hero-title">Student Corner</h1>' +
    '      <p class="sc-hero-subtitle">Your unified gateway to academic resources, examination schedules, fee services, and support portals.</p>' +
    '      <div class="sc-hero-stats">' +
    '        <div class="sc-hero-stat-card">' +
    '          <span class="material-symbols-outlined">calendar_month</span>' +
    '          <div>' +
    '            <h3>Academic Year</h3>' +
    '            <p>2025-26</p>' +
    '          </div>' +
    '        </div>' +
    '        <div class="sc-hero-stat-card">' +
    '          <span class="material-symbols-outlined">apartment</span>' +
    '          <div>' +
    '            <h3>Institution</h3>' +
    '            <p>Y.S.R. Engineering College</p>' +
    '          </div>' +
    '        </div>' +
    '        <div class="sc-hero-stat-card">' +
    '          <span class="material-symbols-outlined">location_on</span>' +
    '          <div>' +
    '            <h3>Campus</h3>' +
    '            <p>Proddatur</p>' +
    '          </div>' +
    '        </div>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '  <!-- INTERACTIVE FILTER TABS -->' +
    '  <div class="sc-filter-container">' +
    '    <div class="sc-filter-tabs">' +
    '      <button type="button" class="sc-filter-btn active" data-filter="all">' +
    '        <span class="material-symbols-outlined">grid_view</span>All Services' +
    '      </button>' +
    '      <button type="button" class="sc-filter-btn" data-filter="academics">' +
    '        <span class="material-symbols-outlined">school</span>Academics & Exams' +
    '      </button>' +
    '      <button type="button" class="sc-filter-btn" data-filter="payments">' +
    '        <span class="material-symbols-outlined">payments</span>Fee Payments' +
    '      </button>' +
    '      <button type="button" class="sc-filter-btn" data-filter="support">' +
    '        <span class="material-symbols-outlined">support_agent</span>Student Support' +
    '      </button>' +
    '    </div>' +
    '  </div>' +
    '  <!-- MAIN CONTENT GRID -->' +
    '  <div class="sc-grid">' +
    '    <!-- LEFT SIDE: SERVICES -->' +
    '    <div class="sc-main">' +
    '      <!-- QUICK ACCESS SECTION -->' +
    '      <div class="sc-section" data-section="quick">' +
    '        <h2 class="sc-section-title"><span class="material-symbols-outlined">flash_on</span>Quick Access Resources</h2>' +
    '        <div class="sc-cards-grid sc-cards-grid-3">' +
    '          <a href="https://yvuexams.in/results.aspx" target="_blank" class="sc-card sc-card-accent-blue" data-category="academics">' +
    '            <span class="sc-card-badge badge-external">External Portal</span>' +
    '            <div class="sc-card-icon-wrap">' +
    '              <span class="material-symbols-outlined">description</span>' +
    '            </div>' +
    '            <div class="sc-card-body">' +
    '              <h3>Results</h3>' +
    '              <p>Check semester examination grades, score sheets, and marks declarations instantly online.</p>' +
    '              <span class="sc-card-action">View Results <span class="material-symbols-outlined">arrow_forward</span></span>' +
    '            </div>' +
    '          </a>' +
    '          <a href="#" class="sc-card sc-card-accent-teal timetable-link" data-category="academics">' +
    '            <span class="sc-card-badge badge-modal">Interactive Modal</span>' +
    '            <div class="sc-card-icon-wrap">' +
    '              <span class="material-symbols-outlined">calendar_view_month</span>' +
    '            </div>' +
    '            <div class="sc-card-body">' +
    '              <h3>Timetable</h3>' +
    '              <p>Access your class schedules, laboratory shifts, and exam timetables compiled by your department.</p>' +
    '              <span class="sc-card-action">Open Timetable <span class="material-symbols-outlined">arrow_forward</span></span>' +
    '            </div>' +
    '          </a>' +
    '          <a href="https://onlinesbi.sbi.bank.in/sbicollect/" target="_blank" class="sc-card sc-card-accent-orange" data-category="payments">' +
    '            <span class="sc-card-badge badge-payment">SBI Collect</span>' +
    '            <div class="sc-card-icon-wrap">' +
    '              <span class="material-symbols-outlined">account_balance</span>' +
    '            </div>' +
    '            <div class="sc-card-body">' +
    '              <h3>College Fee Payment</h3>' +
    '              <p>Securely pay tuition, admission, and institutional fees directly through the State Bank Collect gateway.</p>' +
    '              <span class="sc-card-action">Pay Fee <span class="material-symbols-outlined">arrow_forward</span></span>' +
    '            </div>' +
    '          </a>' +
    '        </div>' +
    '      </div>' +
    '      <!-- ACADEMIC & EXAMINATION SERVICES SECTION -->' +
    '      <div class="sc-section" data-section="academics">' +
    '        <h2 class="sc-section-title"><span class="material-symbols-outlined">menu_book</span>Academic & Examination Services</h2>' +
    '        <div class="sc-cards-grid sc-cards-grid-2">' +
    '          <a href="/academiccalendars/" class="sc-card" data-category="academics">' +
    '            <span class="sc-card-badge badge-pdf">Official PDF</span>' +
    '            <div class="sc-card-icon-wrap">' +
    '              <span class="material-symbols-outlined">calendar_month</span>' +
    '            </div>' +
    '            <div class="sc-card-body">' +
    '              <h3>Calendar</h3>' +
    '              <p>Review the comprehensive academic calendar listing semesters, exams, holidays, and college events.</p>' +
    '              <span class="sc-card-action">View Calendar <span class="material-symbols-outlined">arrow_forward</span></span>' +
    '            </div>' +
    '          </a>' +
    '          <a href="https://onlinesbi.sbi.bank.in/sbicollect/" target="_blank" class="sc-card" data-category="payments">' +
    '            <span class="sc-card-badge badge-payment">SBI Collect</span>' +
    '            <div class="sc-card-icon-wrap">' +
    '              <span class="material-symbols-outlined">receipt_long</span>' +
    '            </div>' +
    '            <div class="sc-card-body">' +
    '              <h3>Exam Fee Payment</h3>' +
    '              <p>Clear semester registration and backlog examination charges securely online before the due date.</p>' +
    '              <span class="sc-card-action">Pay Exam Fee <span class="material-symbols-outlined">arrow_forward</span></span>' +
    '            </div>' +
    '          </a>' +
    '          <a href="#" class="sc-card timetable-link" data-category="academics">' +
    '            <span class="sc-card-badge badge-modal">Interactive Modal</span>' +
    '            <div class="sc-card-icon-wrap">' +
    '              <span class="material-symbols-outlined">schedule</span>' +
    '            </div>' +
    '            <div class="sc-card-body">' +
    '              <h3>Class Timetable</h3>' +
    '              <p>Get latest day-wise scheduling details and updates from various branches and classrooms.</p>' +
    '              <span class="sc-card-action">Open Timetable <span class="material-symbols-outlined">arrow_forward</span></span>' +
    '            </div>' +
    '          </a>' +
    '          <a href="https://yvuexams.in/results.aspx" target="_blank" class="sc-card" data-category="academics">' +
    '            <span class="sc-card-badge badge-external">YVU Web</span>' +
    '            <div class="sc-card-icon-wrap">' +
    '              <span class="material-symbols-outlined">verified</span>' +
    '            </div>' +
    '            <div class="sc-card-body">' +
    '              <h3>YVU Exams Portal</h3>' +
    '              <p>Direct login link to the Yogi Vemana University official examinations and registrations website.</p>' +
    '              <span class="sc-card-action">Go to Portal <span class="material-symbols-outlined">arrow_forward</span></span>' +
    '            </div>' +
    '          </a>' +
    '        </div>' +
    '      </div>' +
    '      <!-- SUPPORT PORTALS & FEE SERVICES SECTION -->' +
    '      <div class="sc-section" data-section="support">' +
    '        <h2 class="sc-section-title"><span class="material-symbols-outlined">support_agent</span>Student Support Services</h2>' +
    '        <div class="sc-cards-grid sc-cards-grid-2">' +
    '          <a href="/grievance/" class="sc-card" data-category="support">' +
    '            <span class="sc-card-badge badge-support">Grievance Portal</span>' +
    '            <div class="sc-card-icon-wrap">' +
    '              <span class="material-symbols-outlined">warning</span>' +
    '            </div>' +
    '            <div class="sc-card-body">' +
    '              <h3>Grievance</h3>' +
    '              <p>Submit formal complaints or feedback regarding classes, examinations, or campus facilities directly to college authorities.</p>' +
    '              <span class="sc-card-action">Submit Grievance <span class="material-symbols-outlined">arrow_forward</span></span>' +
    '            </div>' +
    '          </a>' +
    '          <a href="https://onlinesbi.sbi.bank.in/sbicollect/" target="_blank" class="sc-card" data-category="payments">' +
    '            <span class="sc-card-badge badge-payment">SBI Collect</span>' +
    '            <div class="sc-card-icon-wrap">' +
    '              <span class="material-symbols-outlined">home</span>' +
    '            </div>' +
    '            <div class="sc-card-body">' +
    '              <h3>Girls Hostel Fee Payment</h3>' +
    '              <p>Convenient online payment channel for ladies\' campus accommodation, mess charges, and maintenance fees.</p>' +
    '              <span class="sc-card-action">Pay Hostel Fee <span class="material-symbols-outlined">arrow_forward</span></span>' +
    '            </div>' +
    '          </a>' +
    '        </div>' +
    '      </div>' +
    '    </div>' +
    '    <!-- RIGHT SIDE: SIDEBAR -->' +
    '    <div class="sc-sidebar">' +
    '      <!-- NOTIFICATIONS PANEL -->' +
    '      <div class="sc-panel sc-panel-notifications">' +
    '        <h3 class="sc-panel-title"><span class="material-symbols-outlined">notifications_active</span>Notifications & Updates</h3>' +
    '        <div class="sc-notifications-list">' +
    '          <div class="sc-notif-item">' +
    '            <div class="sc-notif-header">' +
    '              <span class="sc-notif-badge badge-critical">Critical</span>' +
    '              <span class="sc-notif-date">June 20, 2026</span>' +
    '            </div>' +
    '            <h4 class="sc-notif-title">Academic Calendar 2025-26 Released</h4>' +
    '            <p class="sc-notif-desc">The official academic calendar for the current session is now available for download.</p>' +
    '          </div>' +
    '          <div class="sc-notif-item">' +
    '            <div class="sc-notif-header">' +
    '              <span class="sc-notif-badge badge-info">General</span>' +
    '              <span class="sc-notif-date">June 15, 2026</span>' +
    '            </div>' +
    '            <h4 class="sc-notif-title">Tuition Fee Payment Portal Open</h4>' +
    '            <p class="sc-notif-desc">SBI Collect links for tuition, mess, and exam fees are fully active. Please pay before deadlines.</p>' +
    '          </div>' +
    '          <div class="sc-notif-item">' +
    '            <div class="sc-notif-header">' +
    '              <span class="sc-notif-badge badge-success">New</span>' +
    '              <span class="sc-notif-date">June 10, 2026</span>' +
    '            </div>' +
    '            <h4 class="sc-notif-title">Grievance Submission Form Online</h4>' +
    '            <p class="sc-notif-desc">Students can submit feedback or address queries using the newly integrated digital grievance portal.</p>' +
    '          </div>' +
    '        </div>' +
    '      </div>' +
    '      <!-- PORTAL HELPDESK PANEL -->' +
    '      <div class="sc-panel sc-panel-info">' +
    '        <h3 class="sc-panel-title"><span class="material-symbols-outlined">contact_support</span>Portal Helpdesk</h3>' +
    '        <div class="sc-helpdesk">' +
    '          <p>Need assistance with fees, examinations, or technical issues on the portal?</p>' +
    '          <div class="sc-help-contact">' +
    '            <span class="material-symbols-outlined">mail</span>' +
    '            <div>' +
    '              <h4>Technical Support</h4>' +
    '              <p><a href="mailto:support.yvuce@gmail.com">support.yvuce@gmail.com</a></p>' +
    '            </div>' +
    '          </div>' +
    '          <div class="sc-help-contact">' +
    '            <span class="material-symbols-outlined">call</span>' +
    '            <div>' +
    '              <h4>Academic Office</h4>' +
    '              <p>+91 99669 34674</p>' +
    '            </div>' +
    '          </div>' +
    '        </div>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</div>';

  function injectStudentCornerPortals() {
    var p = window.location.pathname.replace(/\/+$/, "");
    if (p !== "/studentcorner") return;
    var c = document.querySelector(".student-corner-container");
    if (!c) return;
    if (c.getAttribute("data-sc-injected")) return;
    c.innerHTML = _scPortalHTML;
    c.setAttribute("data-sc-injected", "1");

    // Add category filter logic:
    var filterTabs = c.querySelector(".sc-filter-tabs");
    if (filterTabs) {
      filterTabs.addEventListener("click", function(e) {
        var btn = e.target.closest(".sc-filter-btn");
        if (!btn) return;
        
        filterTabs.querySelectorAll(".sc-filter-btn").forEach(function(b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        
        var filterVal = btn.getAttribute("data-filter");
        var cards = c.querySelectorAll(".sc-card");
        
        cards.forEach(function(card) {
          var cardCategory = card.getAttribute("data-category");
          if (filterVal === "all" || cardCategory === filterVal) {
            card.style.display = "";
            card.classList.remove("sc-card-hidden");
          } else {
            card.classList.add("sc-card-hidden");
            card.style.display = "none";
          }
        });
        
        // Hide sections if no cards are shown in them
        var sections = c.querySelectorAll(".sc-section");
        sections.forEach(function(sec) {
          var visibleCards = sec.querySelectorAll(".sc-card:not(.sc-card-hidden)");
          if (visibleCards.length === 0) {
            sec.style.display = "none";
          } else {
            sec.style.display = "";
          }
        });
      });
    }

    var grid = c.querySelector(".sc-dashboard") || c;
    if (grid) {
      grid.addEventListener("click", function(e) {
        var t = e.target.closest("a");
        if (!t) return;
        if (t.classList.contains("timetable-link")) {
          e.preventDefault();
          openTimetableModal();
          return;
        }
        if (t.target === "_blank" || t.href.indexOf(window.location.origin) !== 0 || t.getAttribute("href").indexOf("//") === 0) return;
        e.preventDefault();
        var href = t.getAttribute("href");
        if (window.location.pathname.replace(/\/+$/, "") === href.replace(/\/+$/, "")) return;
        window.history.pushState(null, "", href);
        window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
      });
    }
  }

  var _ttModal = null;
  function openTimetableModal() {
    if (!_ttModal) buildTimetableModal();
    _ttModal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function closeTimetableModal() {
    if (_ttModal) _ttModal.classList.remove("show");
    document.body.style.overflow = "";
  }
  function buildTimetableModal() {
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

    function renderBranches(content) {
      content.innerHTML =
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

    function renderYears(content, branch) {
      var b = branches.find(function(x) { return x.abbr === branch; });
      content.innerHTML =
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

    function renderImage(content, branch, year) {
      var b = branches.find(function(x) { return x.abbr === branch; });
      var imgPath = "/timetables/" + branch + "/" + year.charAt(0) + ".png";
      content.innerHTML =
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

    var overlay = document.createElement("div");
    overlay.className = "tt-overlay";
    var box = document.createElement("div");
    box.className = "tt-modal-box";
    var content = document.createElement("div");
    content.className = "tt-modal-content";
    box.appendChild(content);
    var closeBtn = document.createElement("button");
    closeBtn.className = "tt-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("aria-label", "Close");
    box.appendChild(closeBtn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    _ttModal = overlay;

    closeBtn.addEventListener("click", closeTimetableModal);
    overlay.addEventListener("click", function(e) {
      if (e.target === overlay) closeTimetableModal();
    });
    function zoomImage(el, dir) {
      var img = el.querySelector(".tt-image-el");
      var lvl = el.querySelector(".tt-zoom-level");
      if (!img || !lvl) return;
      var z = parseFloat(img.getAttribute("data-zoom") || "1");
      z = dir > 0 ? Math.min(z + 0.25, 5) : Math.max(z - 0.25, 0.25);
      img.style.transform = "scale(" + z + ")";
      img.style.transformOrigin = "top left";
      img.setAttribute("data-zoom", z);
      lvl.textContent = Math.round(z * 100) + "%";
    }
    (function() {
      var panning = false, startX, startY, scrollL, scrollT, panTarget = null;
      content.addEventListener("mousedown", function(e) {
        var wrap = e.target.closest(".tt-image-wrap");
        if (!wrap || e.target.closest("a, button")) return;
        panning = true; panTarget = wrap;
        startX = e.clientX; startY = e.clientY;
        scrollL = wrap.scrollLeft; scrollT = wrap.scrollTop;
        wrap.style.cursor = "grabbing";
        e.preventDefault();
      });
      document.addEventListener("mousemove", function(e) {
        if (!panning || !panTarget) return;
        panTarget.scrollLeft = scrollL - (e.clientX - startX);
        panTarget.scrollTop = scrollT - (e.clientY - startY);
      });
      document.addEventListener("mouseup", function() {
        if (panTarget) panTarget.style.cursor = "";
        panning = false; panTarget = null;
      });
      var lastPinchDist = 0;
      content.addEventListener("touchstart", function(e) {
        if (e.touches.length === 2) {
          var dx = e.touches[0].clientX - e.touches[1].clientX;
          var dy = e.touches[0].clientY - e.touches[1].clientY;
          lastPinchDist = Math.sqrt(dx * dx + dy * dy);
        }
      }, { passive: true });
      content.addEventListener("touchmove", function(e) {
        if (e.touches.length !== 2) return;
        e.preventDefault();
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (lastPinchDist > 0) {
          var dir = dist > lastPinchDist ? 1 : -1;
          zoomImage(content, dir);
        }
        lastPinchDist = dist;
      }, { passive: false });
      content.addEventListener("touchend", function() { lastPinchDist = 0; }, { passive: true });
    })();
    content.addEventListener("click", function(e) {
      var back = e.target.closest(".tt-back-btn");
      if (back) {
        var curC = content.querySelector("img") ? content.getAttribute("data-branch") : null;
        if (curC) { renderYears(content, curC); content.removeAttribute("data-branch"); }
        else renderBranches(content);
        return;
      }
      var zi = e.target.closest(".tt-zoom-in");
      var zo = e.target.closest(".tt-zoom-out");
      if (zi || zo) {
        zoomImage(content, zi ? 1 : -1);
        return;
      }
      var yr = e.target.closest(".tt-year-btn");
      if (yr) {
        renderImage(content, yr.getAttribute("data-branch"), yr.getAttribute("data-year"));
        content.setAttribute("data-branch", yr.getAttribute("data-branch"));
        return;
      }
      var btn = e.target.closest("button[data-branch]");
      if (btn) {
        renderYears(content, btn.getAttribute("data-branch"));
        return;
      }
    });
    content.addEventListener("wheel", function(e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      zoomImage(content, e.deltaY < 0 ? 1 : -1);
    }, { passive: false });

    renderBranches(content);
  }
  var _scPortalTimer = setInterval(injectStudentCornerPortals, 100);
  (function() {
    var _push = history.pushState, _rep = history.replaceState;
    history.pushState = function() { _push.apply(this, arguments); setTimeout(injectStudentCornerPortals, 50); };
    history.replaceState = function() { _rep.apply(this, arguments); setTimeout(injectStudentCornerPortals, 50); };
  })();
  window.addEventListener("popstate", injectStudentCornerPortals);

  // ===== MANDATORY DISCLOSURES REDESIGN =====
  var _mdDocs = [
    {title:"EOA – 2025-26", file:"/pdfs/AICTE/EOA Report 2025-26.PDF", cat:"AICTE Documents", desc:"Extension of Approval for academic year 2025-26 from AICTE", date:"2025-06-15", type:"PDF", featured:true},
    {title:"EOA – 2024-25", file:"/pdfs/AICTE/EOA Report 2024-2025.PDF", cat:"AICTE Documents", desc:"Extension of Approval for academic year 2024-25", date:"2024-06-20", type:"PDF"},
    {title:"EOA – 2023-24", file:"/pdfs/AICTE/EOA-Report-2023-24.PDF", cat:"AICTE Documents", desc:"Extension of Approval for academic year 2023-24", date:"2023-07-10", type:"PDF"},
    {title:"EOA – 2022-23", file:"/pdfs/AICTE/EOA Report 22-23.PDF", cat:"AICTE Documents", desc:"Extension of Approval for academic year 2022-23", date:"2022-07-05", type:"PDF"},
    {title:"EOA – 2021-22", file:"/pdfs/AICTE/EOA Report 21-22.PDF", cat:"AICTE Documents", desc:"Extension of Approval for academic year 2021-22", date:"2021-08-12", type:"PDF"},
    {title:"EOA – 2020-21", file:"/pdfs/AICTE/EOA_Report_2020-21.PDF", cat:"AICTE Documents", desc:"Extension of Approval for academic year 2020-21", date:"2020-09-01", type:"PDF"},
    {title:"EOA – 2019-20", file:"/pdfs/AICTE/EOA_Report_2019-20.PDF", cat:"AICTE Documents", desc:"Extension of Approval for academic year 2019-20", date:"2019-07-18", type:"PDF"},
    {title:"EOA – 2017-18", file:"/pdfs/AICTE/EOA Report 2017-18.pdf", cat:"AICTE Documents", desc:"Extension of Approval for academic year 2017-18", date:"2017-06-25", type:"PDF"},
    {title:"EOA – 2015-16", file:"/pdfs/AICTE/EOA Report 2015-16.PDF", cat:"AICTE Documents", desc:"Extension of Approval for academic year 2015-16", date:"2015-07-30", type:"PDF"},
    {title:"EOA – 2014-15", file:"/pdfs/AICTE/EOA_Report_2014-15.PDF", cat:"AICTE Documents", desc:"Extension of Approval for academic year 2014-15", date:"2014-08-14", type:"PDF"},
    {title:"EOA – 2011-12", file:"/pdfs/AICTE/EOAReport 2011-12.pdf", cat:"AICTE Documents", desc:"Extension of Approval for academic year 2011-12", date:"2011-09-05", type:"PDF"},
    {title:"MoU – AADHAAR WATER TANKS", file:"/pdfs/MOUs/AADHAARWATERTANKS.pdf", cat:"Downloads & Forms", desc:"Memorandum of Understanding with Aadhaar Water Tanks", date:"2023-03-15", type:"PDF"},
    {title:"MoU – APSSDC", file:"/pdfs/MOUs/APSSDC.pdf", cat:"Downloads & Forms", desc:"MoU with Andhra Pradesh State Skill Development Corporation", date:"2023-04-20", type:"PDF"},
    {title:"MoU – DURANC", file:"/pdfs/MOUs/DURANC.pdf", cat:"Downloads & Forms", desc:"MoU with DURANC for industry collaboration", date:"2023-02-10", type:"PDF"},
    {title:"MoU – GDRC VIJAYAWADA", file:"/pdfs/MOUs/GDRCYLINDERSPVTLTD.pdf", cat:"Downloads & Forms", desc:"MoU with GDRC Cylinders Pvt Ltd, Vijayawada", date:"2023-05-08", type:"PDF"},
    {title:"MoU – Green Lantern", file:"/pdfs/MOUs/GreenLanternit.pdf", cat:"Downloads & Forms", desc:"MoU with Green Lantern IT Solutions", date:"2023-06-12", type:"PDF"},
    {title:"MoU – Indian Servers", file:"/pdfs/MOUs/Indian Servers.pdf", cat:"Downloads & Forms", desc:"MoU with Indian Servers for technology partnership", date:"2023-01-25", type:"PDF"},
    {title:"MoU – Kurnool Cylinders", file:"/pdfs/MOUs/KURNOOLCYLINDRSPVTLTD.pdf", cat:"Downloads & Forms", desc:"MoU with Kurnool Cylinders Pvt Ltd", date:"2023-07-14", type:"PDF"},
    {title:"MoU – Vijay Plastic Industries", file:"/pdfs/MOUs/VIJAYAPLASTICINDUSTRIES.pdf", cat:"Downloads & Forms", desc:"MoU with Vijaya Plastic Industries", date:"2023-08-01", type:"PDF"},
    {title:"MoU – YSRPVC Pipes", file:"/pdfs/MOUs/YSRPVCPIPES.pdf", cat:"Downloads & Forms", desc:"MoU with YSR PVC Pipes for industrial partnership", date:"2023-09-10", type:"PDF"}
  ];

  var _mdCategories = [
    "AICTE Documents",
    "Downloads & Forms"
  ];

  var _mdFeaturedDocs = [
    {title:"Academic Calendar 2025-26", file:"/pdfs/CALENDERS/I,II,III & IV B.Tech I Semester Academic Calendar 2025-26.pdf", desc:"Complete academic schedule for the current academic year", icon:"calendar_month"},
    {title:"AICTE Approval Letter", file:"/pdfs/AICTE/EOA Report 2025-26.PDF", desc:"Official AICTE Extension of Approval for 2025-26", icon:"verified"},
    {title:"Fee Structure", file:"/pdfs/AICTE/EOA Report 2025-26.PDF", desc:"Detailed fee structure for all programs", icon:"payments"},
    {title:"Annual Report", file:"/pdfs/AICTE/EOA_Report_2024-15.PDF", desc:"Comprehensive annual report of the institution", icon:"assessment"}
  ];

  function renderMDJSON() {
    return JSON.stringify({categories: _mdCategories, docs: _mdDocs, featured: _mdFeaturedDocs});
  }

  function escapeHTML(s) {
    var d = document.createElement("div");
    d.appendChild(document.createTextNode(s || ""));
    return d.innerHTML;
  }

  function _buildMDHero() {
    return '<div class="md-hero"><div class="md-hero-overlay"><div class="md-hero-content"><h1 class="md-hero-title">Mandatory Disclosures</h1><p class="md-hero-subtitle">Institutional, academic, governance, AICTE, and compliance documents — all in one place. Transparent access to official records and regulatory information.</p></div></div></div>';
  }

  function _buildMDStats() {
    var stats = [
      {icon:"description", label:"Total Documents", value:_mdDocs.length, color:"#073f68"},
      {icon:"verified", label:"AICTE Status", value:"Approved", color:"#0c6ea8"},
      {icon:"calendar_month", label:"Academic Year", value:"2025-26", color:"#d89a25"},
      {icon:"school", label:"Departments", value:"7", color:"#0c6ea8"},
      {icon:"group", label:"Faculty", value:"120+", color:"#073f68"},
      {icon:"groups", label:"Students", value:"2500+", color:"#d89a25"}
    ];
    return '<div class="md-stats">' + stats.map(function(s) {
      return '<div class="md-stat-card" style="--stat-color:' + s.color + '"><span class="md-stat-icon material-symbols-outlined">' + s.icon + '</span><span class="md-stat-value">' + s.value + '</span><span class="md-stat-label">' + s.label + '</span></div>';
    }).join("") + '</div>';
  }

  function _buildMDSearch() {
    return '<div class="md-search-wrap"><div class="md-search-inner"><span class="md-search-icon material-symbols-outlined">search</span><input type="text" class="md-search-input" placeholder="Search documents by title, category, or keyword..." aria-label="Search documents"><button type="button" class="md-search-clear" aria-label="Clear search"><span class="material-symbols-outlined">close</span></button></div><div class="md-search-suggestions"></div></div>';
  }

  function _buildMDDocCard(d, i) {
    var badgeColor = d.cat === "AICTE Documents" ? "#073f68" : "#d89a25";
    return '<div class="md-doc-card" data-index="' + i + '" data-category="' + escapeHTML(d.cat) + '" data-search="' + escapeHTML(d.title + " " + d.desc + " " + d.cat).toLowerCase() + '"><div class="md-doc-card-top"><span class="md-doc-card-badge" style="--badge-color:' + badgeColor + '">' + escapeHTML(d.cat) + '</span><span class="md-doc-card-type">' + d.type + '</span></div><h4 class="md-doc-card-title">' + escapeHTML(d.title) + '</h4><p class="md-doc-card-desc">' + escapeHTML(d.desc) + '</p><div class="md-doc-card-meta"><span class="md-doc-card-date"><span class="material-symbols-outlined">schedule</span>' + d.date + '</span></div><div class="md-doc-card-actions"><button type="button" class="md-doc-view" data-file="' + escapeHTML(d.file) + '"><span class="material-symbols-outlined">visibility</span>Preview</button><a href="' + escapeHTML(d.file) + '" target="_blank" rel="noopener" class="md-doc-download"><span class="material-symbols-outlined">download</span>Download</a></div></div>';
  }

  function _buildMDCategorySection(cat, docs) {
    var filtered = [];
    for (var i = 0; i < docs.length; i++) {
      if (docs[i].cat === cat) filtered.push(docs[i]);
    }
    if (filtered.length === 0) return '<div class="md-cat-section" data-cat="' + escapeHTML(cat) + '"><div class="md-cat-header"><h3 class="md-cat-title">' + escapeHTML(cat) + '</h3><span class="md-cat-count">' + filtered.length + ' documents</span><button type="button" class="md-cat-toggle" aria-label="Toggle section"><span class="material-symbols-outlined">expand_more</span></button></div><div class="md-cat-body"><div class="md-cat-empty">No documents available in this category.</div></div></div>';
    var cards = "";
    for (var j = 0; j < filtered.length; j++) {
      cards += _buildMDDocCard(filtered[j], _mdDocs.indexOf(filtered[j]));
    }
    return '<div class="md-cat-section" data-cat="' + escapeHTML(cat) + '"><div class="md-cat-header"><h3 class="md-cat-title">' + escapeHTML(cat) + '</h3><span class="md-cat-count">' + filtered.length + ' documents</span><button type="button" class="md-cat-toggle" aria-label="Toggle section"><span class="material-symbols-outlined">expand_more</span></button></div><div class="md-cat-body">' + cards + '</div></div>';
  }

  function _buildMDFeatured() {
    var cards = "";
    for (var i = 0; i < _mdFeaturedDocs.length; i++) {
      var f = _mdFeaturedDocs[i];
      cards += '<div class="md-featured-card"><span class="md-featured-icon material-symbols-outlined">' + f.icon + '</span><h4>' + escapeHTML(f.title) + '</h4><p>' + escapeHTML(f.desc) + '</p><button type="button" class="md-featured-view" data-file="' + escapeHTML(f.file) + '">View Document <span class="material-symbols-outlined">arrow_forward</span></button></div>';
    }
    return '<div class="md-featured"><div class="md-section-label"><h2>Featured Documents</h2><p>Quick access to the most important institutional documents</p></div><div class="md-featured-grid">' + cards + '</div></div>';
  }

  function _buildMDTimeline() {
    var events = [
      {date:"Jun 15, 2025", title:"EOA 2025-26 Published", desc:"AICTE Extension of Approval for the academic year 2025-26 has been published.", icon:"verified"},
      {date:"Apr 1, 2025", title:"Academic Calendar Released", desc:"The academic calendar for 2025-26 is now available for download.", icon:"calendar_month"},
      {date:"Sep 10, 2024", title:"MoU with YSR PVC Pipes", desc:"New MoU signed with YSR PVC Pipes for industrial collaboration.", icon:"handshake"},
      {date:"Aug 1, 2024", title:"MoU with Vijay Plastic", desc:"MoU with Vijaya Plastic Industries to strengthen industry-academia linkage.", icon:"handshake"},
      {date:"Jul 14, 2024", title:"MoU with Kurnool Cylinders", desc:"Partnership with Kurnool Cylinders Pvt Ltd for student training.", icon:"handshake"},
      {date:"Jun 12, 2024", title:"MoU with Green Lantern", desc:"Technology partnership MoU signed with Green Lantern IT Solutions.", icon:"handshake"},
      {date:"Jun 20, 2024", title:"EOA 2024-25 Published", desc:"AICTE Extension of Approval for 2024-25 academic year published.", icon:"verified"}
    ];
    var items = "";
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      items += '<div class="md-timeline-item"><div class="md-timeline-icon"><span class="material-symbols-outlined">' + e.icon + '</span></div><div class="md-timeline-content"><span class="md-timeline-date">' + e.date + '</span><h4>' + e.title + '</h4><p>' + e.desc + '</p></div></div>';
    }
    return '<div class="md-timeline-wrap"><div class="md-section-label"><h2>Document Timeline</h2><p>Latest updates, approvals, and administrative notifications</p></div><div class="md-timeline">' + items + '</div></div>';
  }

  function _buildMDDownloadCenter() {
    return '<div class="md-download-center"><div class="md-section-label"><h2>Download Center</h2><p>Most accessed documents and quick links</p></div><div class="md-dc-grid"><div class="md-dc-card"><span class="md-dc-icon material-symbols-outlined">trending_up</span><h4>Most Downloaded</h4><ul><li>EOA – 2025-26</li><li>EOA – 2024-25</li><li>MoU – APSSDC</li></ul></div><div class="md-dc-card"><span class="md-dc-icon material-symbols-outlined">schedule</span><h4>Recently Added</h4><ul><li>EOA – 2025-26</li><li>MoU – YSRPVC Pipes</li><li>MoU – Vijay Plastic Industries</li></ul></div><div class="md-dc-card"><span class="md-dc-icon material-symbols-outlined">folder_open</span><h4>Quick Access</h4><ul><li><button type="button" class="md-quick-link" data-file="/pdfs/AICTE/EOA Report 2025-26.PDF">AICTE Approval</button></li><li><button type="button" class="md-quick-link" data-file="/pdfs/CALENDERS/I,II,III & IV B.Tech I Semester Academic Calendar 2025-26.pdf">Academic Calendar</button></li><li><button type="button" class="md-quick-link" data-file="/pdfs/AICTE/EOA Report 2024-2025.PDF">EOA 2024-25</button></li></ul></div></div></div>';
  }

  function _buildMDHTML() {
    var categoriesHTML = "";
    for (var i = 0; i < _mdCategories.length; i++) {
      categoriesHTML += _buildMDCategorySection(_mdCategories[i], _mdDocs);
    }
    return _buildMDHero() + _buildMDStats() + '<div class="md-body">' + _buildMDSearch() + '<div class="md-categories">' + categoriesHTML + '</div></div>' + _buildMDFeatured() + _buildMDTimeline() + _buildMDDownloadCenter() + '<div class="md-pdf-modal"><div class="md-pdf-modal-content"><div class="md-pdf-modal-header"><button type="button" class="md-pdf-close" aria-label="Close PDF viewer"><span class="material-symbols-outlined">close</span></button></div><iframe class="md-pdf-frame" src="" title="PDF Viewer" width="100%" height="100%"></iframe></div></div>';
  }

  var _mdHTML = null;
  var _mdInjected = false;

  function injectMandatoryRedesign() {
    var p = window.location.pathname.replace(/\/+$/, "");
    var existing = document.querySelector(".md-redesign-wrapper");

    if (p !== "/mandatory-disclosures") {
      if (existing) {
        existing.remove();
        var banner = document.querySelector(".mandatory-banner");
        var container = document.querySelector(".mandatory-container");
        if (banner) banner.style.display = "";
        if (container) container.style.display = "";
        var injected = document.querySelector("[data-md-injected]");
        if (injected) injected.removeAttribute("data-md-injected");
        _mdInjected = false;
      }
      return;
    }

    var container = document.querySelector(".mandatory-container");
    if (!container) return;
    if (_mdInjected || container.getAttribute("data-md-injected")) return;

    if (existing) existing.remove();

    if (!_mdHTML) _mdHTML = _buildMDHTML();

    var banner = document.querySelector(".mandatory-banner");
    if (banner) banner.style.display = "none";
    container.style.display = "none";

    var wrapper = document.createElement("div");
    wrapper.className = "md-redesign-wrapper";
    wrapper.innerHTML = _mdHTML;
    container.parentNode.insertBefore(wrapper, container);
    container.setAttribute("data-md-injected", "1");
    _mdInjected = true;

    // Search
    var searchInput = wrapper.querySelector(".md-search-input");
    var searchClear = wrapper.querySelector(".md-search-clear");
    var suggestions = wrapper.querySelector(".md-search-suggestions");
    var allCards = wrapper.querySelectorAll(".md-doc-card");

    if (searchInput) {
      searchInput.addEventListener("input", function() {
        var q = this.value.toLowerCase().trim();
        var hasResults = false;
        var suggestHTML = "";
        if (q.length > 0) {
          var seen = {};
          allCards.forEach(function(c) {
            var searchData = c.getAttribute("data-search") || "";
            var match = searchData.indexOf(q) !== -1;
            c.style.display = match ? "" : "none";
            if (match && !seen[c.getAttribute("data-category")]) {
              seen[c.getAttribute("data-category")] = true;
              suggestHTML += '<div class="md-suggest-item" data-cat="' + c.getAttribute("data-category") + '">' + c.getAttribute("data-category") + '</div>';
              hasResults = true;
            }
          });
          if (!hasResults && q.length >= 2) {
            suggestHTML = '<div class="md-suggest-item md-suggest-no">No documents found matching "' + escapeHTML(q) + '"</div>';
          }
        } else {
          allCards.forEach(function(c) { c.style.display = ""; });
        }
        suggestions.innerHTML = suggestHTML;
        suggestions.style.display = q.length > 0 ? "block" : "none";
        searchClear.style.display = q.length > 0 ? "" : "none";

        // Show/hide category sections based on visible cards
        wrapper.querySelectorAll(".md-cat-section").forEach(function(s) {
          var visible = Array.from(s.querySelectorAll(".md-doc-card")).some(function(c) { return c.style.display !== "none"; });
          s.style.display = visible || q.length === 0 ? "" : "none";
        });
      });

      searchClear.addEventListener("click", function() {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input"));
        searchInput.focus();
      });

      suggestions.addEventListener("click", function(e) {
        var item = e.target.closest(".md-suggest-item");
        if (item && !item.classList.contains("md-suggest-no")) {
          searchInput.value = item.getAttribute("data-cat");
          searchInput.dispatchEvent(new Event("input"));
          suggestions.style.display = "none";
        }
      });
    }

    // Category accordion toggle
    wrapper.querySelectorAll(".md-cat-toggle").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var section = this.closest(".md-cat-section");
        section.classList.toggle("md-cat-open");
        var icon = this.querySelector(".material-symbols-outlined");
        if (icon) icon.textContent = section.classList.contains("md-cat-open") ? "expand_less" : "expand_more";
      });
    });

    // Open first category by default
    var firstCat = wrapper.querySelector(".md-cat-section");
    if (firstCat) {
      firstCat.classList.add("md-cat-open");
      var firstIcon = firstCat.querySelector(".md-cat-toggle .material-symbols-outlined");
      if (firstIcon) firstIcon.textContent = "expand_less";
    }

    // PDF viewer
    var modal = wrapper.querySelector(".md-pdf-modal");
    var frame = wrapper.querySelector(".md-pdf-frame");
    var closeBtn = wrapper.querySelector(".md-pdf-close");

    function openPDF(file) {
      if (frame) frame.src = file + "#toolbar=0";
      if (modal) modal.classList.add("md-pdf-open");
      document.body.style.overflow = "hidden";
    }

    function closePDF() {
      if (modal) modal.classList.remove("md-pdf-open");
      if (frame) { setTimeout(function() { frame.src = ""; }, 300); }
      document.body.style.overflow = "";
    }

    if (closeBtn) closeBtn.addEventListener("click", closePDF);
    if (modal) modal.addEventListener("click", function(e) {
      if (e.target === modal) closePDF();
    });
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape") closePDF();
    });

    wrapper.querySelectorAll(".md-doc-view, .md-featured-view, .md-quick-link").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var file = this.getAttribute("data-file");
        if (file) openPDF(file);
      });
    });

    // Animate stats cards on scroll
    var statCards = wrapper.querySelectorAll(".md-stat-card");
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("md-stat-visible");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      statCards.forEach(function(c) { obs.observe(c); });
    } else {
      statCards.forEach(function(c) { c.classList.add("md-stat-visible"); });
    }
  }

  var _mdTimer = setInterval(injectMandatoryRedesign, 100);
  (function() {
    var _push2 = history.pushState, _rep2 = history.replaceState;
    history.pushState = function() { _push2.apply(this, arguments); setTimeout(injectMandatoryRedesign, 50); };
    history.replaceState = function() { _rep2.apply(this, arguments); setTimeout(injectMandatoryRedesign, 50); };
  })();
  window.addEventListener("popstate", injectMandatoryRedesign);
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(injectMandatoryRedesign, 200);
  } else {
    document.addEventListener("DOMContentLoaded", function() { setTimeout(injectMandatoryRedesign, 200); });
  }

  // ===== FACILITIES REDESIGN =====
  var _fcData = [
    {
      id: "administrative",
      label: "Administrative Area",
      icon: "business",
      rooms: [
        {no:"101", type:"Faculty Room", area:"53.84"},
        {no:"101-1", type:"Cabin for Head of Dept", area:"20"},
        {no:"104", type:"Exam Control Office", area:"31.88"},
        {no:"104-1", type:"Cabin for Head of Dept", area:"25"},
        {no:"104-2", type:"Cabin for Head of Dept", area:"25"},
        {no:"117", type:"Office All Inclusive", area:"162.5"},
        {no:"120(A)", type:"Housekeeping", area:"20"},
        {no:"130", type:"Faculty Room", area:"84.54"},
        {no:"131", type:"Principal Directors Office", area:"30.24"},
        {no:"131(A)", type:"Cabin for Head of Dept", area:"25"},
        {no:"133", type:"Pantry for Staff", area:"13.33"},
        {no:"136", type:"Board Room", area:"44.54"},
        {no:"203", type:"Faculty Room", area:"17.65"},
        {no:"204", type:"Placement Office", area:"37.65"},
        {no:"A001", type:"Faculty Room", area:"48.02"},
        {no:"A002", type:"Cabin for Head of Dept", area:"15.02"},
        {no:"G01", type:"Cabin for Head of Dept", area:"53.84"},
        {no:"G11", type:"Central Store", area:"31.21"},
        {no:"G12", type:"Security", area:"11.2"},
        {no:"G13", type:"Maintenance", area:"12.1"}
      ]
    },
    {
      id: "amenities",
      label: "Amenities Area",
      icon: "deck",
      rooms: [
        {no:"111", type:"Toilet", area:"12.15"},
        {no:"112", type:"Toilet", area:"12.15"},
        {no:"114", type:"Stationery Store", area:"12.15"},
        {no:"121", type:"Toilet", area:"26.48"},
        {no:"132", type:"Toilet", area:"28.8"},
        {no:"133", type:"Toilet", area:"13.33"},
        {no:"204", type:"Student Activity / GCR", area:"17.65"},
        {no:"205", type:"Toilet", area:"12.15"},
        {no:"206", type:"Toilet", area:"12.15"},
        {no:"A003", type:"Auditorium", area:"218.25"},
        {no:"A01Gt2", type:"Toilet", area:"12.15"},
        {no:"A01Gtph", type:"Toilet", area:"14.25"},
        {no:"A02Gt1", type:"Toilet", area:"12.15"},
        {no:"A07Lt1", type:"Toilet", area:"12.15"},
        {no:"A07Ltph", type:"Toilet", area:"14.25"},
        {no:"A08Lt2", type:"Toilet", area:"12.15"},
        {no:"B111", type:"Boys Common Room", area:"80.5"},
        {no:"Bh", type:"Boys' Hostel", area:"889.1"},
        {no:"C112", type:"Cafeteria", area:"162.5"},
        {no:"C212", type:"Cafeteria", area:"80.25"},
        {no:"G09(A)", type:"First Aid cum Sick Room", area:"12.15"},
        {no:"G11", type:"Toilet", area:"12.5"},
        {no:"G111", type:"Girls Common Room", area:"80.5"},
        {no:"G12", type:"Toilet", area:"12.5"},
        {no:"Gh", type:"Girls' Hostel", area:"1412.4"}
      ]
    },
    {
      id: "instructional",
      label: "Instructional Area",
      icon: "school",
      rooms: [
        {no:"106", type:"Classroom", area:"79.71"},
        {no:"107", type:"Classroom", area:"81.88"},
        {no:"108", type:"Classroom", area:"60.39"},
        {no:"109", type:"Classroom", area:"60.39"},
        {no:"110", type:"Classroom", area:"53.84"},
        {no:"113", type:"Classroom", area:"81.29"},
        {no:"114", type:"Classroom", area:"81.29"},
        {no:"115", type:"Classroom", area:"81.29"},
        {no:"116", type:"Laboratory", area:"79.71"},
        {no:"117", type:"Laboratory", area:"81.88"},
        {no:"118", type:"Laboratory", area:"68.88"},
        {no:"119", type:"Laboratory", area:"51.7"},
        {no:"123", type:"Classroom", area:"48.03"},
        {no:"124", type:"Classroom", area:"56.11"},
        {no:"125", type:"Classroom", area:"56.11"},
        {no:"126", type:"Classroom", area:"56.11"},
        {no:"127", type:"Classroom", area:"56.11"},
        {no:"128", type:"Workshop", area:"153.84"},
        {no:"129", type:"Additional Workshop", area:"153.84"},
        {no:"201", type:"Classroom", area:"53.65"},
        {no:"201A", type:"Classroom", area:"79.71"},
        {no:"202", type:"Classroom", area:"53.65"},
        {no:"202A", type:"Classroom", area:"79.71"},
        {no:"206", type:"Classroom", area:"53.65"},
        {no:"207", type:"Classroom", area:"53.65"},
        {no:"209", type:"Laboratory", area:"81.29"},
        {no:"210", type:"Classroom", area:"81.29"},
        {no:"211", type:"Classroom", area:"81.29"},
        {no:"212", type:"Classroom", area:"81.29"},
        {no:"213", type:"Workshop", area:"81.29"},
        {no:"213(A)", type:"Additional Workshop", area:"81.29"},
        {no:"214", type:"Classroom", area:"68.89"},
        {no:"214-1", type:"Laboratory", area:"81.29"},
        {no:"215", type:"Classroom", area:"68.89"},
        {no:"216", type:"Laboratory", area:"81.29"},
        {no:"219", type:"Laboratory", area:"81.29"},
        {no:"220", type:"Laboratory", area:"53.69"},
        {no:"221", type:"Classroom", area:"53.65"},
        {no:"222", type:"Laboratory", area:"153"},
        {no:"223", type:"Laboratory", area:"153"},
        {no:"223-1", type:"Laboratory", area:"153"},
        {no:"224", type:"CAD Center", area:"153.84"},
        {no:"225", type:"Seminar Hall", area:"530"},
        {no:"A002", type:"Classroom", area:"75.02"},
        {no:"AC06", type:"Classroom", area:"71.8"},
        {no:"A007", type:"Classroom", area:"75.02"},
        {no:"A008", type:"Classroom", area:"48.02"},
        {no:"A101", type:"Tutorial Room", area:"48.02"},
        {no:"A102", type:"Tutorial Room", area:"74.59"},
        {no:"A103", type:"Tutorial Room", area:"76.51"},
        {no:"A106", type:"Classroom", area:"71.8"},
        {no:"Corri", type:"Other", area:"496"},
        {no:"G02", type:"Laboratory", area:"66.38"},
        {no:"G03", type:"Laboratory", area:"66.38"},
        {no:"G04", type:"Laboratory", area:"81.88"},
        {no:"G05", type:"Laboratory", area:"79.71"},
        {no:"G06", type:"Laboratory", area:"79.71"},
        {no:"G07", type:"Laboratory", area:"81.88"},
        {no:"G08", type:"Laboratory", area:"66.38"},
        {no:"G09", type:"Laboratory", area:"66.38"},
        {no:"G10", type:"Laboratory", area:"53.84"},
        {no:"G103", type:"Laboratory", area:"81.29"},
        {no:"G104", type:"Laboratory", area:"81.29"},
        {no:"G105", type:"Laboratory", area:"81.29"},
        {no:"G106", type:"Laboratory", area:"81.29"},
        {no:"G13", type:"Laboratory", area:"79.71"},
        {no:"Nb101", type:"Laboratory", area:"81.29"},
        {no:"Nb102", type:"Laboratory", area:"81.29"},
        {no:"Nb103", type:"Laboratory", area:"81.29"},
        {no:"Nb104", type:"Laboratory", area:"81.29"},
        {no:"Nb105", type:"Laboratory", area:"81.29"},
        {no:"Nb106", type:"Laboratory", area:"81.29"},
        {no:"Nb107", type:"Laboratory", area:"81.29"},
        {no:"Nb108", type:"Laboratory", area:"81.29"},
        {no:"Nb121", type:"CAD Center", area:"148.25"},
        {no:"Ncorri", type:"Other", area:"161"},
        {no:"Parkin", type:"Other", area:"862.72"},
        {no:"Upsrom", type:"Other", area:"6.5"}
      ]
    },
    {
      id: "common",
      label: "Instructional Area - Common Facilities",
      icon: "layers",
      rooms: [
        {no:"102", type:"Computer Center", area:"60.39"},
        {no:"103", type:"Computer Center", area:"60.39"},
        {no:"105", type:"Library & Reading Room", area:"79.71"},
        {no:"112", type:"Language Laboratory", area:"81.29"},
        {no:"116", type:"Language Laboratory", area:"81.29"},
        {no:"120", type:"Computer Center", area:"92.9"},
        {no:"224", type:"Library & Reading Room", area:"348.9"}
      ]
    }
  ];

  function _fcGetRoomIcon(type) {
    var t = type.toLowerCase();
    if (t.indexOf("laboratory") !== -1 || t.indexOf("lab") !== -1) return "science";
    if (t.indexOf("classroom") !== -1 || t.indexOf("class") !== -1) return "meeting_room";
    if (t.indexOf("workshop") !== -1) return "handyman";
    if (t.indexOf("toilet") !== -1) return "wc";
    if (t.indexOf("hostel") !== -1) return "hotel";
    if (t.indexOf("cafeteria") !== -1 || t.indexOf("canteen") !== -1) return "restaurant";
    if (t.indexOf("library") !== -1) return "local_library";
    if (t.indexOf("auditorium") !== -1) return "theater_comedy";
    if (t.indexOf("computer") !== -1) return "computer";
    if (t.indexOf("seminar") !== -1) return "event";
    if (t.indexOf("faculty") !== -1) return "badge";
    if (t.indexOf("cabin") !== -1 || t.indexOf("office") !== -1) return "desk";
    if (t.indexOf("board room") !== -1) return "groups";
    if (t.indexOf("placement") !== -1) return "work";
    if (t.indexOf("pantry") !== -1) return "coffee";
    if (t.indexOf("store") !== -1) return "inventory_2";
    if (t.indexOf("security") !== -1) return "security";
    if (t.indexOf("maintenance") !== -1) return "build";
    if (t.indexOf("housekeeping") !== -1) return "cleaning_services";
    if (t.indexOf("first aid") !== -1 || t.indexOf("sick") !== -1) return "local_hospital";
    if (t.indexOf("common room") !== -1) return "diversity_3";
    if (t.indexOf("stationery") !== -1) return "store";
    if (t.indexOf("exam") !== -1) return "assignment";
    if (t.indexOf("principal") !== -1) return "account_balance";
    if (t.indexOf("tutorial") !== -1) return "school";
    if (t.indexOf("cad") !== -1) return "draw";
    if (t.indexOf("student activity") !== -1) return "sports_esports";
    if (t.indexOf("language") !== -1) return "translate";
    return "room";
  }

  function _fcBuildHero() {
    return '<div class="fc-hero">' +
      '<div class="fc-hero-content">' +
      '<div class="fc-hero-icon"><span class="material-symbols-outlined">apartment</span></div>' +
      '<h1 class="fc-hero-title">Campus Facilities</h1>' +
      '<p class="fc-hero-subtitle">Comprehensive infrastructure and amenities at Y.S.R. Engineering College of Yogi Vemana University, Proddatur — designed to provide an enriching academic environment.</p>' +
      '</div></div>';
  }

  function _fcBuildStats() {
    var totalRooms = 0, totalArea = 0;
    _fcData.forEach(function(cat) {
      cat.rooms.forEach(function(r) {
        totalRooms++;
        totalArea += parseFloat(r.area) || 0;
      });
    });
    var stats = [
      {icon:"meeting_room", label:"Total Rooms", value:totalRooms, color:"#073f68"},
      {icon:"square_foot", label:"Total Area", value:totalArea.toFixed(0) + " m\xB2", color:"#0c6ea8"},
      {icon:"category", label:"Categories", value:_fcData.length, color:"#d89a25"},
      {icon:"business", label:"Admin Rooms", value:_fcData[0].rooms.length, color:"#0c6ea8"},
      {icon:"school", label:"Instructional", value:_fcData[2].rooms.length + _fcData[3].rooms.length, color:"#073f68"}
    ];
    var html = '<div class="fc-stats">';
    stats.forEach(function(s, i) {
      html += '<div class="fc-stat-card" style="--stat-color:' + s.color + ';transition-delay:' + (i * 0.05) + 's">' +
        '<span class="fc-stat-icon material-symbols-outlined">' + s.icon + '</span>' +
        '<span class="fc-stat-value">' + s.value + '</span>' +
        '<span class="fc-stat-label">' + s.label + '</span></div>';
    });
    html += '</div>';
    return html;
  }

  function _fcBuildTabs() {
    var html = '<div class="fc-tabs">';
    _fcData.forEach(function(cat, i) {
      html += '<button type="button" class="fc-tab' + (i === 0 ? ' fc-tab-active' : '') + '" data-fc-tab="' + cat.id + '">' +
        '<span class="material-symbols-outlined">' + cat.icon + '</span>' +
        cat.label +
        ' <span class="fc-tab-count">' + cat.rooms.length + '</span>' +
        '</button>';
    });
    html += '</div>';
    return html;
  }

  function _fcBuildTable(cat) {
    var total = 0;
    var rows = "";
    cat.rooms.forEach(function(r) {
      var area = parseFloat(r.area) || 0;
      total += area;
      var icon = _fcGetRoomIcon(r.type);
      rows += '<tr>' +
        '<td><span class="fc-room-no">' + r.no + '</span></td>' +
        '<td><span class="fc-room-type"><span class="material-symbols-outlined fc-room-icon">' + icon + '</span>' + _fcEscape(r.type) + '</span></td>' +
        '<td>' + r.area + '</td>' +
        '</tr>';
    });
    return '<div class="fc-section-header">' +
      '<h2 class="fc-section-title"><span class="material-symbols-outlined" style="font-size:24px;vertical-align:middle;margin-right:8px;color:#0c6ea8;">' + cat.icon + '</span>' + _fcEscape(cat.label) + '</h2>' +
      '<span class="fc-section-count">' + cat.rooms.length + ' rooms \u00B7 ' + total.toFixed(2) + ' m\u00B2</span>' +
      '</div>' +
      '<div class="fc-table-wrap" data-fc-table="' + cat.id + '">' +
      '<table class="fc-table">' +
      '<thead><tr><th>Room No.</th><th>Room Type</th><th>Carpet Area (m\u00B2)</th></tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '<tfoot><tr><td colspan="2">Total</td><td>' + total.toFixed(2) + ' m\u00B2</td></tr></tfoot>' +
      '</table></div>';
  }

  function _fcEscape(s) {
    var d = document.createElement("div");
    d.appendChild(document.createTextNode(s || ""));
    return d.innerHTML;
  }

  function _fcBuildPage() {
    var html = _fcBuildHero() + _fcBuildStats() +
      '<div class="fc-body">' +
      _fcBuildTabs() +
      '<div class="fc-tables-container">';
    _fcData.forEach(function(cat) {
      html += _fcBuildTable(cat);
    });
    html += '</div></div>';
    return html;
  }

  var _fcHTML = null;
  var _fcInjected = false;

  function injectFacilitiesRedesign() {
    var p = window.location.pathname.replace(/\/+$/, "");
    var existing = document.querySelector(".fc-redesign");

    if (p !== "" && p !== "/facilities") {
      if (existing) {
        existing.remove();
        var wrapper = document.querySelector(".facilities-wrapper");
        if (wrapper) wrapper.style.display = "";
        _fcInjected = false;
      }
      return;
    }

    if (existing) return;
    if (_fcInjected) return;

    var wrapper = document.querySelector(".facilities-wrapper");
    if (!wrapper) return;

    if (!_fcHTML) _fcHTML = _fcBuildPage();

    var redesign = document.createElement("div");
    redesign.className = "fc-redesign";
    redesign.innerHTML = _fcHTML;
    wrapper.parentNode.insertBefore(redesign, wrapper);
    wrapper.style.display = "none";
    _fcInjected = true;

    // Tab switching
    var tabs = redesign.querySelectorAll(".fc-tab");
    var tables = redesign.querySelectorAll(".fc-table-wrap");

    function showTab(id) {
      tabs.forEach(function(t) {
        t.classList.toggle("fc-tab-active", t.getAttribute("data-fc-tab") === id);
      });
      tables.forEach(function(t) {
        var show = t.getAttribute("data-fc-table") === id;
        t.style.display = show ? "" : "none";
        if (show) {
          setTimeout(function() { t.classList.add("fc-table-visible"); }, 50);
        } else {
          t.classList.remove("fc-table-visible");
        }
      });
    }

    tabs.forEach(function(tab) {
      tab.addEventListener("click", function() {
        var id = this.getAttribute("data-fc-tab");
        showTab(id);
        // Mobile: scroll to table after click
        var header = redesign.querySelector(".fc-section-header");
        if (header && window.innerWidth < 768) {
          setTimeout(function() {
            header.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      });
    });

    // Show first tab
    showTab(_fcData[0].id);

    // Animate stats on scroll
    var statCards = redesign.querySelectorAll(".fc-stat-card");
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("fc-stat-visible");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      statCards.forEach(function(c) { obs.observe(c); });
    } else {
      statCards.forEach(function(c) { c.classList.add("fc-stat-visible"); });
    }

    // Animate table on first view
    var firstTable = redesign.querySelector(".fc-table-wrap");
    if (firstTable) {
      setTimeout(function() { firstTable.classList.add("fc-table-visible"); }, 300);
    }
  }

  var _fcTimer = setInterval(injectFacilitiesRedesign, 100);
  (function() {
    var _push3 = history.pushState, _rep3 = history.replaceState;
    history.pushState = function() { _push3.apply(this, arguments); setTimeout(injectFacilitiesRedesign, 50); };
    history.replaceState = function() { _rep3.apply(this, arguments); setTimeout(injectFacilitiesRedesign, 50); };
  })();
  window.addEventListener("popstate", injectFacilitiesRedesign);
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(injectFacilitiesRedesign, 200);
  } else {
    document.addEventListener("DOMContentLoaded", function() { setTimeout(injectFacilitiesRedesign, 200); });
  }

  // ===== DEPARTMENTS SINGLE-PAGE SHOWCASE =====

  var _dsData = [
    { id: "ce",  short: "CE",  name: "Civil Engineering", est: "2008", intake: "60",
      hod: "Dr.G.Nageswara Reddy", hodRole: "Associate Professor", hodImg: "/images/faculty/EEE/Nageswara Reddy.png",
      hodMsg: "Our department strives to develop technically competent, ethically responsible, and socially committed civil engineers. We emphasize innovation, sustainable infrastructure development, research excellence, and industry readiness.",
      hodMobile: "9703144448", hodEmail: "gnageswarareddy@yvu.edu.in",
      about: "The Department of Civil Engineering is established in 2008 since inception of the college. The Courses offered are B. Tech, Full time and Part time Ph.D. The intake of students for B.Tech program is 60. The Department has qualified and experienced staff, to impart knowledge to the students. Department is having well equipped laboratories with basic equipment required for undergraduate courses and modern equipment to meet the research and industrial consultancy services." },
    { id: "cse", short: "CSE", name: "Computer Science & Engineering", est: "2008", intake: "60",
      hod: "Prof. C Nagaraju", hodRole: "Professor", hodImg: "/images/faculty/dean.jpeg",
      hodMsg: "Our department strives to create technically strong, ethically responsible and socially committed professionals. We emphasize innovation, research culture and industry readiness.",
      hodMobile: "9949218570", hodEmail: "cnrcse@yahoo.com",
      about: "The Department of Computer Science & Engineering was started in the year 2008 with an intake of 60. It administers bachelor's programs in Computer Science and Engineering. The department's strengths include state of the art facilities, renowned faculty, strong focus on undergraduate education balanced with leading-edge research, and emphasis on leadership, service and ethics." },
    { id: "eee", short: "EEE", name: "Electrical and Electronics Engineering", est: "2009", intake: "60",
      hod: "Dr.G.Nageswara Reddy", hodRole: "Associate Professor", hodImg: "/images/faculty/EEE/Nageswara Reddy.png",
      hodMsg: "Our Department of Electrical and Electronics Engineering strives to develop technically proficient, ethically responsible, and socially committed engineers. We emphasize innovation, research, and practical learning while fostering strong industry connections.",
      hodMobile: "9703144448", hodEmail: "gnageswarareddy@yvu.edu.in",
      about: "The Department of Electrical and Electronics Engineering started in 2009 with an intake of 60. The Four year B.Tech course study includes fundamentals of Electrical Engineering embedded with Electrical Machines, Power System, Power Electronics, Control, Electronics, Hybrid Electric Vehicles and IOT for Electrical Engineering." },
    { id: "ece", short: "ECE", name: "Electronics & Communication Engineering", est: "2008", intake: "60",
      hod: "Prof. K Venkata Ramanaiah", hodRole: "Professor", hodImg: "/images/faculty/viceprincipal.jpeg",
      hodMsg: "Our department strives to create technically strong, ethically responsible, and socially committed Electronics and Communication engineers. We emphasize innovation, research culture, and industry readiness in areas such as communication systems, embedded technologies, and signal processing.",
      hodMobile: "9849245750", hodEmail: "ramanaiahkota@gmail.com",
      about: "The Department of Electronics & Communication Engineering was established in the year 2008 with an intake of 60 students. It offers a Bachelor's program in Electronics and Communication Engineering with the objective of producing competent engineers to meet the growing demands of the electronics and communication industries." },
    { id: "me",  short: "ME",  name: "Mechanical Engineering", est: "2009", intake: "60",
      hod: "Prof. G. Jaya Chandra Reddy", hodRole: "Professor", hodImg: "/images/faculty/principal.jpeg",
      hodMsg: "Our Department of Mechanical Engineering strives to develop technically competent, ethically responsible, and socially committed engineers. We emphasize innovation, research, and practical learning while preparing students to meet the challenges of modern mechanical industries.",
      hodMobile: "9441210045", hodEmail: "jcr.yvuce@gmail.com",
      about: "The Department of Mechanical Engineering is established in the year 2009, one year after inception of the college. It offers four year full time B.Tech programme with intake of 60 students. The Department also offers Ph.D research programme. The Department has well qualified and experienced staff and equipped with decent laboratories." },
    { id: "mmt", short: "MMT", name: "Metallurgy and Material Technology", est: "2010", intake: "60",
      hod: "Sri. N. Harinath Reddy", hodRole: "Associate Professor", hodImg: "/images/faculty/ME/Harinath Reddy.jpg",
      hodMsg: "Our department strives to develop technically competent, ethically responsible, and socially committed professionals in the field of Metallurgical and Materials Technology. We focus on strengthening fundamental knowledge in materials science, encouraging innovation, and promoting research culture.",
      hodMobile: "9440478655", hodEmail: "reddynhn@gmail.com",
      about: "The Department of Metallurgy and Material Technology is one of the youngest departments started in this institute in the year 2010. It offers only B.Tech (under graduate programme) with in take of 60 students. Y.S.R. Engineering College of YVU is the third institute in Andhra Pradesh of its kind having this department." },
    { id: "sh",  short: "SH",  name: "Science & Humanities", est: "2008", intake: "All Branches",
      hod: "Dr. A. Ashok Kumar", hodRole: "Associate Professor", hodImg: "/images/faculty/SH/Ashok Kumar.png",
      hodMsg: "Our department strives to develop intellectually strong, ethically responsible, and socially aware students through a strong foundation in Science and Humanities. We emphasize critical thinking, innovation, research orientation, and effective communication skills to prepare students for academic excellence and professional success in a rapidly evolving world.",
      hodMobile: "9959763843", hodEmail: "drashok.yvuce@gmail.com",
      about: "The department has been engaged in imparting the highest level and quality of academic education and has focused upon addressing key issues of science and technology, which have gathered worldwide appreciation and recognition. We take immense pride in the teaching and research culture of the department which is guided by scientific temper as well as an aspiration for 'swarajya' or creative autonomy in thought and action. We are equally privileged to have a group of young and highly motivated students who believe that their reach should exceed their grasp and define the spirit of the department." }
  ];

  var _dsHTML = null;

  function _dsEscape(str) {
    var d = document.createElement("div");
    d.appendChild(document.createTextNode(str || ""));
    return d.innerHTML;
  }

  function _dsBuildNav() {
    return '<nav class="ds-nav" id="dsTopNav"><div class="ds-nav-inner">' +
      _dsData.map(function(d) {
        return '<a href="#ds-' + d.id + '">' + d.short + ' - ' + _dsEscape(d.name) + '</a>';
      }).join("") +
      '</div></nav>';
  }

  function _dsBuildSection(d, idx) {
    var progTags;
    if (d.id === "sh") {
      progTags =
        '<span class="ds-prog-tag">Engineering Mathematics <span>All Branches</span></span>' +
        '<span class="ds-prog-tag">Engineering Physics <span>All Branches</span></span>' +
        '<span class="ds-prog-tag">Engineering Chemistry <span>All Branches</span></span>' +
        '<span class="ds-prog-tag">Communicative English <span>All Branches</span></span>' +
        '<span class="ds-prog-tag">Applied Physics <span>All Branches</span></span>';
    } else {
      progTags = '<span class="ds-prog-tag">B.Tech in ' + _dsEscape(d.name) + ' <span>Intake: ' + d.intake + '</span></span>';
      if (d.id !== "mmt") {
        progTags += '<span class="ds-prog-tag">Ph.D <span>Full-time / Part-time</span></span>';
      }
    }

    return '<div class="ds-section-wrap" id="ds-' + d.id + '">' +
      '<section class="ds-section">' +
      '<div class="ds-section-header ds-reveal ds-reveal-d1">' +
      '<span class="ds-section-code">' + d.short + ' Department</span>' +
      '<h2>' + _dsEscape(d.name) + '</h2>' +
      '<span class="ds-est">Established ' + d.est + ' &middot; Annual Intake: ' + d.intake + '</span>' +
      '<div class="ds-section-divider"></div>' +
      '</div>' +

      '<div class="ds-banner ds-reveal ds-reveal-d2">' +
      '<div class="ds-banner-pattern"></div>' +
      '<div class="ds-banner-shapes"><div class="ds-banner-shape"></div><div class="ds-banner-shape"></div></div>' +
      '<div class="ds-banner-overlay">' +
      '<div class="ds-banner-text">' +
      '<div class="ds-banner-code">' + d.short + '</div>' +
      '<h3>Department of ' + _dsEscape(d.name) + '</h3>' +
      '<p>Y.S.R. Engineering College of Yogi Vemana University, Proddatur</p>' +
      '</div></div></div>' +

      '<div class="ds-two-col">' +
      '<div class="ds-hod-card ds-reveal ds-reveal-d3">' +
      '<div class="ds-hod-card-img-wrap">' +
      '<img class="ds-hod-card-img" src="' + d.hodImg + '" alt="' + _dsEscape(d.hod) + '" onerror="this.style.display=\'none\'">' +
      '<div class="ds-hod-card-img-badge"><span class="material-symbols-outlined">school</span> Head of Department</div>' +
      '</div>' +
      '<div class="ds-hod-card-body">' +
      '<h4>' + _dsEscape(d.hod) + '</h4>' +
      '<p class="ds-hod-role">' + _dsEscape(d.hodRole) + '</p>' +
      '<p class="ds-hod-msg">"' + _dsEscape(d.hodMsg) + '"</p>' +
      '<div class="ds-hod-contact">' +
      '<span class="ds-hod-contact-item"><span class="material-symbols-outlined">call</span> ' + d.hodMobile + '</span>' +
      '<span class="ds-hod-contact-item"><span class="material-symbols-outlined">mail</span> ' + d.hodEmail + '</span>' +
      '</div></div></div>' +

      '<div class="ds-reveal ds-reveal-d4">' +
      '<div class="ds-about">' +
      '<h3><span class="material-symbols-outlined">menu_book</span> About the Department</h3>' +
      '<p>' + _dsEscape(d.about) + '</p>' +
      '</div>' +

      '<div class="ds-programs">' +
      '<h3><span class="material-symbols-outlined">school</span> Programs Offered</h3>' +
      '<div class="ds-programs-list">' + progTags + '</div>' +
      '</div>' +

      '<div class="ds-stats-title"><span class="material-symbols-outlined">insights</span> At a Glance</div>' +
      '<div class="ds-stats-grid" data-dept-id="' + d.id + '">' +
      (d.id === "sh"
        ? '<div class="ds-stat-item" data-count="2008" data-suffix=""><span class="ds-stat-num">0</span><span class="ds-stat-label">Established</span></div>' +
          '<div class="ds-stat-item" data-count="15+" data-suffix=""><span class="ds-stat-num">0</span><span class="ds-stat-label">Faculty Members</span></div>' +
          '<div class="ds-stat-item" data-count="5" data-suffix=""><span class="ds-stat-num">0</span><span class="ds-stat-label">Courses Offered</span></div>' +
          '<div class="ds-stat-item" data-count="All" data-suffix=""><span class="ds-stat-num">All</span><span class="ds-stat-label">Engineering Branches</span></div>'
        : '<div class="ds-stat-item" data-count="' + d.est + '" data-suffix=""><span class="ds-stat-num">0</span><span class="ds-stat-label">Established</span></div>' +
          '<div class="ds-stat-item" data-count="' + d.intake + '" data-suffix="+"><span class="ds-stat-num">0</span><span class="ds-stat-label">Annual Intake</span></div>' +
          '<div class="ds-stat-item" data-count="4" data-suffix=""><span class="ds-stat-num">0</span><span class="ds-stat-label">Year Duration</span></div>' +
          '<div class="ds-stat-item" data-count="60+" data-suffix=""><span class="ds-stat-num">0</span><span class="ds-stat-label">Faculty &amp; Staff</span></div>'
      ) +
      '</div>' +

      '<a class="ds-cta" href="/' + d.id + '">Explore Full Department <span class="material-symbols-outlined">arrow_forward</span></a>' +
      '</div></div></section></div>';
  }

  function _dsBuildPage() {
    return '<div class="ds-redesign">' +
      '<div class="ds-hero">' +
      '<div class="ds-hero-bg-shapes">' +
      '<div class="ds-hero-shape"></div>' +
      '<div class="ds-hero-shape"></div>' +
      '<div class="ds-hero-shape"></div>' +
      '</div>' +
      '<div class="ds-hero-grid"></div>' +
      '<div class="ds-hero-badge"><span class="material-symbols-outlined">apartment</span> Academic Excellence</div>' +
      '<h1>Our <span>Departments</span></h1>' +
      '<p>Y.S.R. Engineering College offers seven specialized departments designed to nurture technical excellence, innovation, and leadership in engineering and technology.</p>' +
      '<div class="ds-hero-stats">' +
      '<div class="ds-hero-stat"><strong>7</strong><span class="ds-hs-label">Departments</span></div>' +
      '<div class="ds-hero-stat"><strong>10+</strong><span class="ds-hs-label">Programs</span></div>' +
      '<div class="ds-hero-stat"><strong>2008</strong><span class="ds-hs-label">Founded</span></div>' +
      '</div></div>' +
      _dsBuildNav() +
      _dsData.map(function(d, i) { return _dsBuildSection(d, i); }).join("") +
      '</div>';
  }

  var _dsObserved = false;

  function _dsObserveAll() {
    if (_dsObserved) return;
    _dsObserved = true;

    var revealEls = document.querySelectorAll(".ds-reveal");
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("ds-visible");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      revealEls.forEach(function(el) { obs.observe(el); });
    } else {
      revealEls.forEach(function(el) { el.classList.add("ds-visible"); });
    }

    // Nav shadow
    var nav = document.getElementById("dsTopNav");
    if (nav) {
      var navObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          nav.classList.toggle("ds-nav-shadow", !entry.isIntersecting);
        });
      }, { threshold: 0 });
      var hero = document.querySelector(".ds-hero");
      if (hero) navObs.observe(hero);
    }

    // Active nav link
    var navLinks = nav ? nav.querySelectorAll("a") : [];
    var _dsLastActive = "";
    if (navLinks.length && "IntersectionObserver" in window) {
      var sections = [];
      _dsData.forEach(function(d) {
        var el = document.getElementById("ds-" + d.id);
        if (el) sections.push(el);
      });
      var activeObs = new IntersectionObserver(function() {
        var current = "";
        sections.forEach(function(sec) {
          var rect = sec.getBoundingClientRect();
          if (rect.top <= 250) current = sec.id;
        });
        if (current === _dsLastActive) return;
        _dsLastActive = current;
        navLinks.forEach(function(a) {
          a.classList.toggle("ds-nav-active", a.getAttribute("href") === "#" + current);
        });
        if (current) {
          var activeEl = nav.querySelector('a[href="#' + current + '"]');
          if (activeEl) {
            var navRect = nav.getBoundingClientRect();
            var elRect = activeEl.getBoundingClientRect();
            nav.scrollLeft += elRect.left - navRect.left - navRect.width / 2 + elRect.width / 2;
          }
        }
      }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
      sections.forEach(function(s) { if (s) activeObs.observe(s); });
    }

    // Animated counters
    var statGrids = document.querySelectorAll(".ds-stats-grid");
    statGrids.forEach(function(grid) {
      var items = grid.querySelectorAll(".ds-stat-item");
      items.forEach(function(item) {
        var numEl = item.querySelector(".ds-stat-num");
        if (!numEl) return;
        var target = item.getAttribute("data-count") || "0";
        var suffix = item.getAttribute("data-suffix") || "";

        var numObs = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              var isNum = /^\d+$/.test(target);
              if (isNum) {
                var end = parseInt(target, 10);
                var duration = 800;
                var startTime = null;
                function step(t) {
                  if (!startTime) startTime = t;
                  var prog = Math.min((t - startTime) / duration, 1);
                  var eased = 1 - Math.pow(1 - prog, 3);
                  numEl.textContent = Math.round(eased * end);
                  if (prog < 1) requestAnimationFrame(step);
                  else numEl.textContent = end;
                }
                requestAnimationFrame(step);
              } else {
                numEl.textContent = target;
              }
              numObs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.3 });
        numObs.observe(item);
      });
    });

    // Smooth scroll for nav links
    navLinks.forEach(function(a) {
      a.addEventListener("click", function(e) {
        var href = this.getAttribute("href");
        if (href && href.charAt(0) === "#") {
          e.preventDefault();
          var target = document.getElementById(href.substring(1));
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    });
  }

  var _dsInjected = false;

  function injectDeptShowcase() {
    var p = window.location.pathname.replace(/\/+$/, "");
    var existing = document.querySelector(".ds-redesign");

    if (p !== "" && p !== "/courses") {
      if (existing) {
        existing.remove();
        var cc = document.querySelector(".course-container");
        if (cc) cc.style.display = "";
        _dsInjected = false;
        _dsObserved = false;
      }
      return;
    }

    if (existing) return;
    if (_dsInjected) return;

    var container = document.querySelector(".course-container");
    if (!container) return;

    if (!_dsHTML) _dsHTML = _dsBuildPage();

    var div = document.createElement("div");
    div.innerHTML = _dsHTML;
    container.parentNode.insertBefore(div, container);
    container.style.display = "none";
    _dsInjected = true;

    setTimeout(_dsObserveAll, 150);
  }

  var _dsTimer = setInterval(injectDeptShowcase, 100);
  (function() {
    var _push4 = history.pushState, _rep4 = history.replaceState;
    history.pushState = function() { _push4.apply(this, arguments); setTimeout(injectDeptShowcase, 50); };
    history.replaceState = function() { _rep4.apply(this, arguments); setTimeout(injectDeptShowcase, 50); };
  })();
  window.addEventListener("popstate", injectDeptShowcase);
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(injectDeptShowcase, 200);
  } else {
    document.addEventListener("DOMContentLoaded", function() { setTimeout(injectDeptShowcase, 200); });
  }

  // ===== INDIVIDUAL DEPARTMENT PAGE REDESIGN =====

  var _ipDeptPaths = {
    "/ce": "ce", "/cse": "cse", "/ece": "ece", "/eee": "eee",
    "/me": "me", "/mmt": "mmt", "/sh": "sh"
  };

  function _ipGetDeptId() {
    var p = window.location.pathname.replace(/\/+$/, "").toLowerCase();
    return _ipDeptPaths[p] || null;
  }

  function _ipGetDeptData(id) {
    for (var i = 0; i < _dsData.length; i++) {
      if (_dsData[i].id === id) return _dsData[i];
    }
    return null;
  }

  function _ipEsc(s) {
    var d = document.createElement("div");
    d.appendChild(document.createTextNode(s || ""));
    return d.innerHTML;
  }

  var _ipExtractedData = null;

  function _ipExtractFromContent(content) {
    var data = { about: "", hod: {}, faculty: [], research: "", infrastructure: "", placements: "" };
    if (!content) return data;

    // Extract paragraphs (for about, research, etc.)
    var ps = content.querySelectorAll("p");
    var allText = "";
    ps.forEach(function(p) { allText += p.textContent.trim() + " "; });
    data.about = allText;

    // Extract heading h2 text
    var h2 = content.querySelector("h2");
    var h2Text = h2 ? h2.textContent.trim().toLowerCase() : "";

    // Extract HOD info from admin-card-horizontal
    var cards = content.querySelectorAll(".admin-card-horizontal");
    var facultyList = [];
    cards.forEach(function(card) {
      var img = card.querySelector(".admin-left img");
      var nameEl = card.querySelector(".admin-right h3");
      var desigEl = card.querySelector(".admin-right .designation");
      var textEl = card.querySelector(".admin-right .admin-text");
      var imgSrc = img ? img.getAttribute("src") || "/temp.jpg" : "/temp.jpg";
      var name = nameEl ? nameEl.textContent.trim() : "";
      var desig = desigEl ? desigEl.textContent.trim() : "";
      var contact = textEl ? textEl.innerHTML.replace(/<br\s*\/?>/gi, " | ") : "";
      if (name) {
        facultyList.push({ img: imgSrc, name: name, designation: desig, contact: contact });
      }
    });
    data.faculty = facultyList;

    // Classify by heading or content keywords
    if (h2Text.indexOf("research") !== -1 || h2Text.indexOf("innovation") !== -1 ||
        allText.toLowerCase().indexOf("research") !== -1 || allText.toLowerCase().indexOf("innovation") !== -1) {
      data.research = allText;
    }
    if (h2Text.indexOf("infrastructure") !== -1 || h2Text.indexOf("laborator") !== -1 ||
        allText.toLowerCase().indexOf("infrastructure") !== -1 || allText.toLowerCase().indexOf("laborator") !== -1 || allText.toLowerCase().indexOf("equipment") !== -1) {
      data.infrastructure = allText;
    }
    if (h2Text.indexOf("placement") !== -1 || allText.toLowerCase().indexOf("placement") !== -1 || allText.toLowerCase().indexOf("recruiter") !== -1) {
      data.placements = allText;
    }

    return data;
  }

  function _ipExtractAllDataSync() {
    // Try a synchronous extraction from whatever is currently rendered
    var content = document.querySelector(".dept-content");
    return _ipExtractFromContent(content);
  }

  function _ipExtractAllDataAsync(callback) {
    var sidebar = document.querySelector(".dept-sidebar");
    if (!sidebar) { callback(_ipExtractAllDataSync()); return; }

    var btns = sidebar.querySelectorAll("button");
    if (!btns.length) { callback(_ipExtractAllDataSync()); return; }

    // Collect data from all sections by clicking each button
    var allData = { about: "", hod: {}, faculty: [], research: "", infrastructure: "", placements: "" };
    var idx = 0;
    var allTexts = [];

    function clickNext() {
      if (idx >= btns.length) {
        // Combine all text
        allData.about = allTexts.join(" ");
        // Deduplicate faculty by name
        var seen = {};
        var uniqueFaculty = [];
        allData.faculty.forEach(function(f) {
          var key = f.name.trim().toLowerCase();
          if (!seen[key]) {
            seen[key] = true;
            uniqueFaculty.push(f);
          }
        });
        allData.faculty = uniqueFaculty;
        callback(allData);
        return;
      }
      btns[idx].click();
      setTimeout(function() {
        var content = document.querySelector(".dept-content");
        if (content) {
          var partial = _ipExtractFromContent(content);
          allData.faculty = allData.faculty.concat(partial.faculty);
          if (partial.research) allData.research = partial.research;
          if (partial.infrastructure) allData.infrastructure = partial.infrastructure;
          if (partial.placements) allData.placements = partial.placements;
          allTexts.push(content.textContent.trim());
        }
        idx++;
        // Rapid sequential clicking
        clickNext();
      }, 180);
    }

    clickNext();
  }

  function _ipBuildHero(dept) {
    var deptInfo = _ipGetDeptData(dept);
    var name = deptInfo ? deptInfo.name : dept.toUpperCase();
    var est = deptInfo ? deptInfo.est : "";
    var intake = deptInfo ? deptInfo.intake : "";
    var about = deptInfo ? deptInfo.about : "";
    var short = deptInfo ? deptInfo.short : dept.toUpperCase();
    var intro = about ? about.split(".")[0] + "." : "Department of " + name;

    return '<div class="ip-hero">' +
      '<div class="ip-hero-bg">' +
      '<div class="ip-hero-shape"></div>' +
      '<div class="ip-hero-shape"></div>' +
      '<div class="ip-hero-shape"></div>' +
      '</div>' +
      '<div class="ip-hero-grid"></div>' +
      '<div class="ip-hero-inner">' +
      '<div class="ip-hero-left">' +
      '<div class="ip-hero-badge"><span class="material-symbols-outlined">school</span> ' + _ipEsc(short) + ' Department</div>' +
      '<h1>Department of ' + _ipEsc(name) + '</h1>' +
      '<p class="ip-hero-intro">' + _ipEsc(intro) + '</p>' +
      '<div class="ip-hero-highlights">' +
      (est ? '<span class="ip-hero-hl"><span class="material-symbols-outlined">calendar_today</span> Est. ' + _ipEsc(est) + '</span>' : '') +
      (intake ? '<span class="ip-hero-hl"><span class="material-symbols-outlined">group</span> Intake: ' + _ipEsc(intake) + '</span>' : '') +
      '<span class="ip-hero-hl"><span class="material-symbols-outlined">auto_stories</span> B.Tech Program</span>' +
      '</div></div>' +
      '<div class="ip-hero-right">' +
      '<div class="ip-hero-img-wrap">' +
      '<span class="material-symbols-outlined ip-hero-img-icon">apartment</span>' +
      '</div></div></div></div>';
  }

  function _ipBuildNav(extractedData) {
    var hasInfra = extractedData && extractedData.infrastructure && extractedData.infrastructure.length > 10;
    var hasPlacements = extractedData && extractedData.placements && extractedData.placements.length > 10;

    var html = '<nav class="ip-nav" id="ipNav">' +
      '<div class="ip-nav-inner">' +
      '<button class="ip-nav-btn ip-nav-active" data-ip-target="about">About</button>' +
      '<button class="ip-nav-btn" data-ip-target="hod">HOD</button>' +
      '<button class="ip-nav-btn" data-ip-target="faculty">Faculty</button>' +
      '<button class="ip-nav-btn" data-ip-target="research">Research</button>' +
      '<button class="ip-nav-btn" data-ip-target="labs">Laboratories</button>';

    if (hasInfra) html += '<button class="ip-nav-btn" data-ip-target="infrastructure">Infrastructure</button>';
    if (hasPlacements) html += '<button class="ip-nav-btn" data-ip-target="placements">Placements</button>';

    html += '<button class="ip-nav-btn" data-ip-target="vm">Vision & Mission</button>' +
      '<button class="ip-nav-btn" data-ip-target="peo">PEOs & PSOs</button>' +
      '<button class="ip-nav-btn" data-ip-target="stats">Statistics</button>' +
      '<button class="ip-nav-btn" data-ip-target="gallery">Gallery</button>' +
      '</div></nav>';

    return html;
  }

  function _ipBuildHOD(dept) {
    var info = _ipGetDeptData(dept);
    if (!info) return '<div class="ip-section"><div class="ip-section-inner"><p>HOD information not available.</p></div></div>';
    var hodName = info.hod || "";
    var hodRole = info.hodRole || "";
    var hodMsg = info.hodMsg || "";
    var hodImg = info.hodImg || "";
    var hodMobile = info.hodMobile || "";
    var hodEmail = info.hodEmail || "";

    return '<div class="ip-section ip-section-alt" id="ip-hod">' +
      '<div class="ip-section-inner">' +
      '<div class="ip-section-header ip-reveal">' +
      '<span class="ip-section-tag">Leadership</span>' +
      '<h2>Head of Department</h2>' +
      '<div class="ip-section-line"></div>' +
      '</div>' +
      '<div class="ip-hod-card ip-reveal">' +
      '<div class="ip-hod-card-inner">' +
      '<div class="ip-hod-img-wrap">' +
      '<img src="' + _ipEsc(hodImg) + '" alt="' + _ipEsc(hodName) + '" onerror="this.style.display=\'none\'">' +
      '<div class="ip-hod-img-badge"><span class="material-symbols-outlined">school</span> Head of Department</div>' +
      '</div>' +
      '<div class="ip-hod-body">' +
      '<h3>' + _ipEsc(hodName) + '</h3>' +
      '<p class="ip-hod-role">' + _ipEsc(hodRole) + '</p>' +
      '<div class="ip-hod-divider"></div>' +
      (hodMsg ? '<p class="ip-hod-msg">"' + _ipEsc(hodMsg) + '"</p>' : '') +
      '<div class="ip-hod-contact">' +
      (hodMobile ? '<span class="ip-hod-c-item"><span class="material-symbols-outlined">call</span> ' + _ipEsc(hodMobile) + '</span>' : '') +
      (hodEmail ? '<span class="ip-hod-c-item"><span class="material-symbols-outlined">mail</span> ' + _ipEsc(hodEmail) + '</span>' : '') +
      '</div></div></div></div></div></div>';
  }

  function _ipBuildAbout(dept) {
    var info = _ipGetDeptData(dept);
    var about = info ? info.about : "";
    var name = info ? info.name : dept.toUpperCase();

    return '<div class="ip-section" id="ip-about">' +
      '<div class="ip-section-inner">' +
      '<div class="ip-section-header ip-reveal">' +
      '<span class="ip-section-tag">Overview</span>' +
      '<h2>About the Department</h2>' +
      '<div class="ip-section-line"></div>' +
      '</div>' +
      '<div class="ip-about-content ip-reveal">' +
      (about ? '<p>' + _ipEsc(about) + '</p>' : '<p>Information about the ' + _ipEsc(name) + ' department.</p>') +
      '</div></div></div>';
  }

  function _ipCategorizeDesignation(d) {
    var low = (d || "").toLowerCase().trim();
    if (low.indexOf("professor") !== -1 && low.indexOf("associate") !== -1) return { cat: "Associate Professor", type: "teaching" };
    if (low.indexOf("professor") !== -1 && low.indexOf("assistant") !== -1) return { cat: "Assistant Professor", type: "teaching" };
    if (low.indexOf("professor") !== -1) return { cat: "Professor", type: "teaching" };
    if (low.indexOf("academic consultant") !== -1) return { cat: "Academic Consultant", type: "teaching" };
    if (low.indexOf("lecturer") !== -1) return { cat: "Lecturer", type: "teaching" };
    if (low.indexOf("lab assistant") !== -1 || low.indexOf("lab") !== -1) return { cat: "Lab Assistant", type: "non-teaching" };
    if (low.indexOf("junior assistant") !== -1) return { cat: "Junior Assistant", type: "non-teaching" };
    if (low.indexOf("attender") !== -1 || low.indexOf("watchman") !== -1 || low.indexOf("sweeper") !== -1 ||
        low.indexOf("driver") !== -1 || low.indexOf("pump") !== -1 || low.indexOf("gardener") !== -1 ||
        low.indexOf("sanitary") !== -1 || low.indexOf("watchwoman") !== -1) return { cat: "Non-Teaching Staff", type: "non-teaching" };
    if (low.indexOf("library") !== -1) return { cat: "Library Staff", type: "non-teaching" };
    if (low.indexOf("warden") !== -1) return { cat: "Warden", type: "non-teaching" };
    return { cat: "Other", type: "non-teaching" };
  }

  function _ipBuildFaculty(dept, extractedData) {
    var faculty = (extractedData && extractedData.faculty) || [];

    // Classify all faculty and collect categories
    var categories = {};
    var types = {};
    var allHTML = "";
    faculty.forEach(function(f) {
      var c = _ipCategorizeDesignation(f.designation);
      var cat = c.cat;
      var type = c.type;
      categories[cat] = (categories[cat] || 0) + 1;
      types[type] = (types[type] || 0) + 1;

      var contactIcons = '';
      if (f.contact) {
        var mobile = '', email = '';
        var parts = f.contact.split('|');
        parts.forEach(function(p) {
          var t = p.trim();
          var mLower = t.toLowerCase();
          if (mLower.indexOf('mobile') !== -1 || mLower.indexOf('phone') !== -1 || mLower.indexOf('call') !== -1) {
            mobile = t.replace(/mobile\s*:?\s*/i, '').replace(/phone\s*:?\s*/i, '').replace(/call\s*:?\s*/i, '').trim();
          } else if (mLower.indexOf('email') !== -1 || mLower.indexOf('e-mail') !== -1 || mLower.indexOf('@') !== -1) {
            email = t.replace(/email\s*:?\s*/i, '').replace(/e-mail\s*:?\s*/i, '').trim();
          } else if (mLower.indexOf('@') !== -1) {
            email = t;
          } else if (/^[\d\s\-\(\)\+]+$/.test(t.replace(/\s/g, ''))) {
            mobile = t;
          }
        });
        if (mobile || email) {
          contactIcons = '<div class="ip-faculty-contact-row">';
          if (mobile) contactIcons += '<a href="tel:' + _ipEsc(mobile.replace(/[^+\d]/g, '')) + '" class="ip-faculty-contact-link"><span class="material-symbols-outlined">call</span><span class="ip-faculty-contact-text">' + _ipEsc(mobile) + '</span></a>';
          if (email) contactIcons += '<a href="mailto:' + _ipEsc(email) + '" class="ip-faculty-contact-link"><span class="material-symbols-outlined">mail</span><span class="ip-faculty-contact-text">' + _ipEsc(email) + '</span></a>';
          contactIcons += '</div>';
        }
      }

      allHTML += '<div class="ip-faculty-card ip-reveal" data-ip-faculty="' + _ipEsc(f.name) + '" data-ip-designation="' + _ipEsc(f.designation) + '" data-ip-category="' + _ipEsc(cat) + '" data-ip-type="' + _ipEsc(type) + '">' +
        '<div class="ip-faculty-img">' +
        '<img src="' + _ipEsc(f.img) + '" alt="' + _ipEsc(f.name) + '" onerror="this.style.display=\'none\'">' +
        '<span class="material-symbols-outlined ip-faculty-fb">person</span>' +
        '</div>' +
        '<div class="ip-faculty-body">' +
        '<h4>' + _ipEsc(f.name) + '</h4>' +
        '<p class="ip-faculty-desig">' + _ipEsc(f.designation) + '</p>' +
        contactIcons +
        '</div></div>';
    });

    // Build filter buttons from detected categories
    var filterOrder = ["Professor", "Associate Professor", "Assistant Professor", "Academic Consultant", "Lecturer"];
    var filterBtns = '<button class="ip-faculty-filter ip-faculty-filter-active" data-ip-filter="all">All</button>';
    if (types["teaching"]) filterBtns += '<button class="ip-faculty-filter" data-ip-filter="__teaching__">Teaching</button>';
    if (types["non-teaching"]) filterBtns += '<button class="ip-faculty-filter" data-ip-filter="__non-teaching__">Non-Teaching Staff</button>';
    filterOrder.forEach(function(c) {
      if (categories[c]) {
        filterBtns += '<button class="ip-faculty-filter" data-ip-filter="' + _ipEsc(c) + '">' + _ipEsc(c) + '</button>';
      }
    });

    return '<div class="ip-section ip-section-alt" id="ip-faculty">' +
      '<div class="ip-section-inner">' +
      '<div class="ip-section-header ip-reveal">' +
      '<span class="ip-section-tag">Team</span>' +
      '<h2>Faculty Directory</h2>' +
      '<div class="ip-section-line"></div>' +
      '</div>' +

      '<div class="ip-faculty-tools ip-reveal">' +
      '<div class="ip-faculty-search">' +
      '<span class="material-symbols-outlined">search</span>' +
      '<input type="text" class="ip-faculty-input" id="ipFacultySearch" placeholder="Search faculty by name or designation...">' +
      '</div>' +
      '<div class="ip-faculty-filters" id="ipFacultyFilters">' + filterBtns + '</div>' +
      '</div>' +

      '<div class="ip-faculty-grid" id="ipFacultyGrid">' + allHTML + '</div></div></div>';
  }

  function _ipBuildResearch(dept, extractedData) {
    var text = (extractedData && extractedData.research) || "";
    if (!text || text.length < 10) {
      text = "The department actively promotes research and innovation among faculty and students. Faculty members engage in cutting-edge research and publish papers in reputed national and international journals. The department encourages collaborative research projects and organizes seminars, workshops, and conferences to foster a research culture.";
    }

    return '<div class="ip-section" id="ip-research">' +
      '<div class="ip-section-inner">' +
      '<div class="ip-section-header ip-reveal">' +
      '<span class="ip-section-tag">Innovation</span>' +
      '<h2>Research & Innovation</h2>' +
      '<div class="ip-section-line"></div>' +
      '</div>' +
      '<div class="ip-research-content ip-reveal">' +
      '<p>' + _ipEsc(text) + '</p>' +
      '<ul><li><strong>Research Publications:</strong> Faculty publish in Scopus/SCI indexed journals.</li>' +
      '<li><strong>Conference Presentations:</strong> Active participation in national and international conferences.</li>' +
      '<li><strong>Funding & Grants:</strong> Research proposals submitted to funding agencies.</li>' +
      '<li><strong>Workshops & Seminars:</strong> Regular technical events organized for students and faculty.</li></ul>' +
      '</div></div></div>';
  }

  function _ipBuildLabs(dept, extractedData) {
    var text = (extractedData && extractedData.infrastructure) || "";
    if (!text || text.length < 10) {
      text = "The department is equipped with state-of-the-art laboratories and modern infrastructure to support effective teaching-learning and research activities. Laboratories are well-maintained with the latest equipment and software tools.";
    }

    // Try to extract lab names from text
    var labNames = [];
    var lower = text.toLowerCase();
    var labMatches = text.match(/[A-Z][A-Za-z\s]+Lab(?:oratory)?/g);
    if (labMatches) {
      labNames = labMatches.map(function(l) { return l.trim(); });
    }
    if (labNames.length === 0 && lower.indexOf("lab") !== -1) {
      var parts = text.split(/[,.;]/);
      parts.forEach(function(p) {
        if (p.toLowerCase().indexOf("lab") !== -1) {
          var trimmed = p.trim();
          if (trimmed.length > 5 && trimmed.length < 80) labNames.push(trimmed);
        }
      });
    }

    var labCards = "";
    if (labNames.length > 0) {
      labNames.slice(0, 6).forEach(function(name) {
        labCards += '<div class="ip-lab-card ip-reveal">' +
          '<div class="ip-lab-card-icon"><span class="material-symbols-outlined">science</span></div>' +
          '<h4>' + _ipEsc(name) + '</h4>' +
          '<p>Equipped with modern instruments and facilities for hands-on training and research.</p></div>';
      });
    }

    return '<div class="ip-section ip-section-alt" id="ip-labs">' +
      '<div class="ip-section-inner">' +
      '<div class="ip-section-header ip-reveal">' +
      '<span class="ip-section-tag">Facilities</span>' +
      '<h2>Laboratories</h2>' +
      '<div class="ip-section-line"></div>' +
      '</div>' +
      '<div class="ip-lab-content ip-reveal">' +
      '<p>' + _ipEsc(text) + '</p>' +
      (labCards ? '<div class="ip-lab-grid">' + labCards + '</div>' : '') +
      '</div></div></div>';
  }

  function _ipBuildVnM(dept) {
    return '<div class="ip-section" id="ip-vm">' +
      '<div class="ip-section-inner">' +
      '<div class="ip-section-header ip-reveal">' +
      '<span class="ip-section-tag">Direction</span>' +
      '<h2>Vision & Mission</h2>' +
      '<div class="ip-section-line"></div>' +
      '</div>' +
      '<div class="ip-vm-grid">' +
      '<div class="ip-vm-card ip-reveal">' +
      '<div class="ip-vm-icon"><span class="material-symbols-outlined">visibility</span></div>' +
      '<h3>Vision</h3>' +
      '<p>To produce competent and socially responsible engineers with strong technical knowledge, ethical values, and leadership qualities who can contribute effectively to the development of society and the nation.</p>' +
      '</div>' +
      '<div class="ip-vm-card ip-reveal">' +
      '<div class="ip-vm-icon"><span class="material-symbols-outlined">flag</span></div>' +
      '<h3>Mission</h3>' +
      '<p>To provide quality education through well-designed curriculum, experienced faculty, modern infrastructure, and industry collaboration. To foster innovation, research, and entrepreneurship among students and prepare them for global challenges.</p>' +
      '</div></div></div></div>';
  }

  function _ipBuildPEOs(dept) {
    return '<div class="ip-section ip-section-alt" id="ip-peo">' +
      '<div class="ip-section-inner">' +
      '<div class="ip-section-header ip-reveal">' +
      '<span class="ip-section-tag">Objectives</span>' +
      '<h2>PEOs & PSOs</h2>' +
      '<div class="ip-section-line"></div>' +
      '</div>' +
      '<h3 class="ip-sub-heading ip-reveal">Program Educational Objectives (PEOs)</h3>' +
      '<div class="ip-peo-grid ip-reveal">' +
      '<div class="ip-peo-card"><span class="ip-peo-num">1</span><p>Graduates shall have a strong foundation in basic sciences, mathematics, and engineering fundamentals to analyze and solve real-world problems.</p></div>' +
      '<div class="ip-peo-card"><span class="ip-peo-num">2</span><p>Graduates shall possess professional skills and ethical values to work effectively in multidisciplinary teams and diverse environments.</p></div>' +
      '<div class="ip-peo-card"><span class="ip-peo-num">3</span><p>Graduates shall engage in lifelong learning, research, and innovation to adapt to emerging technologies and societal needs.</p></div>' +
      '<div class="ip-peo-card"><span class="ip-peo-num">4</span><p>Graduates shall demonstrate leadership qualities and entrepreneurial skills to contribute to industrial and economic growth.</p></div>' +
      '</div>' +
      '<h3 class="ip-sub-heading ip-reveal" style="margin-top: 36px;">Program Specific Outcomes (PSOs)</h3>' +
      '<div class="ip-peo-grid ip-reveal">' +
      '<div class="ip-peo-card"><span class="ip-peo-num">1</span><p>Apply domain-specific knowledge and skills to design and develop innovative solutions for engineering problems.</p></div>' +
      '<div class="ip-peo-card"><span class="ip-peo-num">2</span><p>Use modern engineering tools, software, and techniques for modeling, analysis, and simulation of engineering systems.</p></div>' +
      '<div class="ip-peo-card"><span class="ip-peo-num">3</span><p>Demonstrate professional competence to pursue higher education, research, and careers in industry or academia.</p></div>' +
      '</div></div></div>';
  }

  function _ipBuildStats(dept, extractedData) {
    var info = _ipGetDeptData(dept);
    var facultyCount = (extractedData && extractedData.faculty && extractedData.faculty.length) || "15+";
    var intake = info ? info.intake : "60";
    var est = info ? info.est : "2008";

    return '<div class="ip-section" id="ip-stats">' +
      '<div class="ip-section-inner">' +
      '<div class="ip-section-header ip-reveal">' +
      '<span class="ip-section-tag">Numbers</span>' +
      '<h2>Department at a Glance</h2>' +
      '<div class="ip-section-line"></div>' +
      '</div>' +
      '<div class="ip-stats-grid">' +
      '<div class="ip-stat-card ip-reveal"><span class="material-symbols-outlined ip-stat-icon">calendar_today</span><span class="ip-stat-num" data-count="' + _ipEsc(est) + '">0</span><span class="ip-stat-label">Established</span></div>' +
      '<div class="ip-stat-card ip-reveal"><span class="material-symbols-outlined ip-stat-icon">group</span><span class="ip-stat-num" data-count="' + _ipEsc(intake) + '">0</span><span class="ip-stat-label">Annual Intake</span></div>' +
      '<div class="ip-stat-card ip-reveal"><span class="material-symbols-outlined ip-stat-icon">school</span><span class="ip-stat-num" data-count="4">0</span><span class="ip-stat-label">Year Duration</span></div>' +
      '<div class="ip-stat-card ip-reveal"><span class="material-symbols-outlined ip-stat-icon">badge</span><span class="ip-stat-num" data-count="' + facultyCount + '">0</span><span class="ip-stat-label">Faculty & Staff</span></div>' +
      '<div class="ip-stat-card ip-reveal"><span class="material-symbols-outlined ip-stat-icon">auto_stories</span><span class="ip-stat-num">1</span><span class="ip-stat-label">Programs Offered</span></div>' +
      '<div class="ip-stat-card ip-reveal"><span class="material-symbols-outlined ip-stat-icon">science</span><span class="ip-stat-num" data-count="8">0</span><span class="ip-stat-label">Laboratories</span></div>' +
      '</div></div></div>';
  }

  function _ipBuildInfrastructure(dept, extractedData) {
    var text = (extractedData && extractedData.infrastructure) || "";
    if (!text || text.length < 10) {
      return "";
    }

    return '<div class="ip-section" id="ip-infrastructure">' +
      '<div class="ip-section-inner">' +
      '<div class="ip-section-header ip-reveal">' +
      '<span class="ip-section-tag">Facilities</span>' +
      '<h2>Infrastructure</h2>' +
      '<div class="ip-section-line"></div>' +
      '</div>' +
      '<div class="ip-infra-text ip-reveal"><p>' + _ipEsc(text) + '</p></div></div></div>';
  }

  function _ipBuildPlacements(dept, extractedData) {
    var text = (extractedData && extractedData.placements) || "";
    if (!text || text.length < 10) {
      return "";
    }

    return '<div class="ip-section ip-section-alt" id="ip-placements">' +
      '<div class="ip-section-inner">' +
      '<div class="ip-section-header ip-reveal">' +
      '<span class="ip-section-tag">Careers</span>' +
      '<h2>Placements</h2>' +
      '<div class="ip-section-line"></div>' +
      '</div>' +
      '<div class="ip-placement-content ip-reveal"><p>' + _ipEsc(text) + '</p></div></div></div>';
  }

  function _ipBuildGallery(dept) {
    return '<div class="ip-section" id="ip-gallery">' +
      '<div class="ip-section-inner">' +
      '<div class="ip-section-header ip-reveal">' +
      '<span class="ip-section-tag">Media</span>' +
      '<h2>Department Gallery</h2>' +
      '<div class="ip-section-line"></div>' +
      '</div>' +
      '<div class="ip-gallery-grid">' +
      '<div class="ip-gallery-placeholder ip-reveal">' +
      '<span class="material-symbols-outlined" style="font-size: 48px; display: block; margin-bottom: 12px;">photo_library</span>' +
      '<p style="font-size: 15px; color: #94a3b8;">Gallery images coming soon. Check back for photos of departmental events, labs, and facilities.</p>' +
      '</div></div></div></div>';
  }

  function _ipBuildFullPage(dept, extractedData) {
    return '<div class="ip-redesign">' +
      _ipBuildHero(dept) +
      _ipBuildNav(extractedData) +
      '<div class="ip-body">' +
      _ipBuildAbout(dept) +
      _ipBuildHOD(dept) +
      _ipBuildFaculty(dept, extractedData) +
      _ipBuildResearch(dept, extractedData) +
      _ipBuildLabs(dept, extractedData) +
      _ipBuildInfrastructure(dept, extractedData) +
      _ipBuildPlacements(dept, extractedData) +
      _ipBuildVnM(dept) +
      _ipBuildPEOs(dept) +
      _ipBuildStats(dept, extractedData) +
      _ipBuildGallery(dept) +
      '</div></div>';
  }

  function _ipObserveAll() {
    // Reveal animations
    var revealEls = document.querySelectorAll(".ip-redesign .ip-reveal");
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("ip-visible");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
      revealEls.forEach(function(el) { obs.observe(el); });
    } else {
      revealEls.forEach(function(el) { el.classList.add("ip-visible"); });
    }

    // Nav shadow
    var nav = document.getElementById("ipNav");
    if (nav) {
      var navObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          nav.classList.toggle("ip-nav-shadow", !entry.isIntersecting);
        });
      }, { threshold: 0 });
      var hero = document.querySelector(".ip-hero");
      if (hero) navObs.observe(hero);
    }

    // Nav button smooth scroll + active state
    if (nav) {
      var btns = nav.querySelectorAll(".ip-nav-btn");
      var sections = {};
      btns.forEach(function(btn) {
        btn.addEventListener("click", function() {
          var target = this.getAttribute("data-ip-target");
          var el = document.getElementById("ip-" + target);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          btns.forEach(function(b) { b.classList.remove("ip-nav-active"); });
          this.classList.add("ip-nav-active");
        });
      });

      // Update active nav on scroll
      var allSections = document.querySelectorAll(".ip-section");
      if (allSections.length && "IntersectionObserver" in window) {
        var sectionObs = new IntersectionObserver(function() {
          var current = "";
          allSections.forEach(function(sec) {
            var rect = sec.getBoundingClientRect();
            if (rect.top <= 200) current = sec.id;
          });
          btns.forEach(function(b) {
            var isActive = b.getAttribute("data-ip-target") === (current ? current.replace("ip-", "") : "");
            b.classList.toggle("ip-nav-active", isActive);
          });
          if (current) {
            var activeBtn = nav.querySelector('[data-ip-target="' + current.replace("ip-", "") + '"]');
            if (activeBtn) {
              var navRect = nav.getBoundingClientRect();
              var elRect = activeBtn.getBoundingClientRect();
              nav.scrollLeft += elRect.left - navRect.left - navRect.width / 2 + elRect.width / 2;
            }
          }
        }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
        allSections.forEach(function(s) { sectionObs.observe(s); });
      }
    }

    function _ipFilterFaculty() {
      var activeFilter = document.querySelector(".ip-faculty-filter-active");
      var filter = activeFilter ? activeFilter.getAttribute("data-ip-filter") : "all";
      var sq = document.getElementById("ipFacultySearch");
      var q = sq ? sq.value.toLowerCase().trim() : "";
      document.querySelectorAll(".ip-faculty-card").forEach(function(card) {
        var name = (card.getAttribute("data-ip-faculty") || "").toLowerCase();
        var desig = (card.getAttribute("data-ip-designation") || "").toLowerCase();
        var cat = card.getAttribute("data-ip-category") || "";
        var type = card.getAttribute("data-ip-type") || "";
        var matchFilter = filter === "all";
        if (!matchFilter) {
          if (filter === "__teaching__") matchFilter = type === "teaching";
          else if (filter === "__non-teaching__") matchFilter = type === "non-teaching";
          else matchFilter = cat === filter;
        }
        var matchSearch = !q || name.indexOf(q) !== -1 || desig.indexOf(q) !== -1;
        card.style.display = (matchFilter && matchSearch) ? "" : "none";
      });
    }

    // Faculty search
    var searchInput = document.getElementById("ipFacultySearch");
    if (searchInput) {
      searchInput.addEventListener("input", _ipFilterFaculty);
    }

    // Faculty filter buttons
    document.querySelectorAll(".ip-faculty-filter").forEach(function(btn) {
      btn.addEventListener("click", function() {
        document.querySelectorAll(".ip-faculty-filter").forEach(function(b) { b.classList.remove("ip-faculty-filter-active"); });
        this.classList.add("ip-faculty-filter-active");
        _ipFilterFaculty();
      });
    });

    // Animated counters
    document.querySelectorAll(".ip-stat-card .ip-stat-num[data-count]").forEach(function(el) {
      var target = el.getAttribute("data-count") || "0";
      var isNum = /^\d+$/.test(target);
      if (!isNum) { el.textContent = target; return; }
      var end = parseInt(target, 10);
      var counterObs = new IntersectionObserver(function(entries) {
        if (!entries[0].isIntersecting) return;
        var duration = 1000;
        var startTime = null;
        function step(t) {
          if (!startTime) startTime = t;
          var prog = Math.min((t - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - prog, 3);
          el.textContent = Math.round(eased * end);
          if (prog < 1) requestAnimationFrame(step);
          else el.textContent = end;
        }
        requestAnimationFrame(step);
        counterObs.disconnect();
      }, { threshold: 0.3 });
      counterObs.observe(el);
    });
  }

  var _ipInjected = false;
  var _ipObserved = false;
  var _ipExtracting = false;
  var _ipLastDeptId = null;

  function injectIndividualDeptPage() {
    var deptId = _ipGetDeptId();
    var existing = document.querySelector(".ip-redesign");

    // If URL doesn't match a department, clean up
    if (!deptId) {
      if (existing) {
        existing.remove();
        var wrapper = document.querySelector(".dept-wrapper");
        if (wrapper) wrapper.style.display = "";
        _ipInjected = false;
        _ipObserved = false;
        _ipLastDeptId = null;
      }
      return;
    }

    // If URL changed to a different department, clean up old redesign first
    if (existing && deptId !== _ipLastDeptId) {
      existing.remove();
      var wrapper = document.querySelector(".dept-wrapper");
      if (wrapper) wrapper.style.display = "";
      _ipInjected = false;
      _ipObserved = false;
      existing = null;
    }

    if (existing) return;
    if (_ipInjected) return;
    if (_ipExtracting) return;

    var deptWrapper = document.querySelector(".dept-wrapper");
    if (!deptWrapper) return;

    _ipLastDeptId = deptId;
    _ipExtracting = true;

    // Hide the original content while extracting
    deptWrapper.style.visibility = "hidden";
    deptWrapper.style.position = "absolute";

    // Extract all data asynchronously by cycling through tabs
    _ipExtractAllDataAsync(function(extractedData) {
      _ipExtractedData = extractedData;

      // Build the full page HTML with extracted data
      var html = _ipBuildFullPage(deptId, extractedData);

      // Now hide the original completely and inject
      deptWrapper.style.display = "none";
      deptWrapper.style.visibility = "";
      deptWrapper.style.position = "";

      var redesign = document.createElement("div");
      redesign.innerHTML = html;
      deptWrapper.parentNode.insertBefore(redesign, deptWrapper);
      _ipInjected = true;
      _ipExtracting = false;

      setTimeout(function() {
        _ipObserveAll();
        _ipObserved = true;

        // Trigger counter animation for stat cards
        var statNums = redesign.querySelectorAll(".ip-stat-num[data-count]");
        statNums.forEach(function(el) {
          var target = el.getAttribute("data-count");
          if (/^\d+$/.test(target)) {
            el.textContent = "0";
          }
        });
      }, 200);
    });
  }

  var _ipTimer = setInterval(injectIndividualDeptPage, 100);
  // ===== VICE-CHANCELLOR MODAL INJECTION & LOGIC =====
  var vcTimer = null;
  function injectVCProfileModal() {
    var isVCPage = window.location.pathname.replace(/\/+$/, "") === "/vice-chancellor";
    if (!isVCPage) {
      if (vcTimer) { clearInterval(vcTimer); vcTimer = null; }
      var modal = document.getElementById("profileModal");
      if (modal) {
        modal.remove();
        document.body.style.overflow = '';
      }
      return;
    }

    if (document.getElementById("viewProfileBtn")) return; // already injected

    var attempts = 0;
    if (vcTimer) clearInterval(vcTimer);
    vcTimer = setInterval(function() {
      attempts++;
      var infoEl = document.querySelector(".leadership-profile__info");
      if (infoEl) {
        clearInterval(vcTimer);
        vcTimer = null;
        performVCInjection(infoEl);
      } else if (attempts > 30) { // stop after 3 seconds
        clearInterval(vcTimer);
        vcTimer = null;
      }
    }, 100);
  }

  function performVCInjection(infoEl) {
    if (document.getElementById("viewProfileBtn")) return;

    var btnContainer = document.createElement("div");
    btnContainer.className = "leadership-profile__actions";
    btnContainer.style.marginTop = "20px";
    btnContainer.innerHTML = '<button class="button button--small" id="viewProfileBtn">' +
      '<span class="material-symbols-outlined" style="font-size: 16px; vertical-align: middle; margin-right: 4px;">account_box</span>' +
      'View Full Profile (CV)' +
      '</button>';

    var descEl = infoEl.querySelector(".leadership-profile__desc");
    if (descEl) {
      descEl.parentNode.insertBefore(btnContainer, descEl.nextSibling);
    } else {
      infoEl.appendChild(btnContainer);
    }

    if (document.getElementById("profileModal")) return;

    var modalEl = document.createElement("div");
    modalEl.className = "modal";
    modalEl.id = "profileModal";
    modalEl.setAttribute("hidden", "");
    modalEl.innerHTML = `
      <div class="modal__backdrop" id="modalBackdrop"></div>
      <div class="modal__content">
        <div class="modal__header">
          <div class="modal__header-title">
            <h2 style="font-family: var(--font-heading); font-weight: 700; color: var(--navy); margin: 0;">Detailed Curriculum Vitae</h2>
            <p style="font-size: 13px; color: var(--muted); margin: 4px 0 0 0;">Prof. Raja Shekhar Bellamkonda | Vice-Chancellor, Yogi Vemana University</p>
          </div>
          <button class="modal__close" id="closeModalBtn" aria-label="Close">&times;</button>
        </div>

        <div class="modal-tabs">
          <button class="modal-tab-btn active" data-tab="overview">Overview</button>
          <button class="modal-tab-btn" data-tab="journey">Professional Journey</button>
          <button class="modal-tab-btn" data-tab="research">Research & Guidance</button>
          <button class="modal-tab-btn" data-tab="publications">Publications</button>
          <button class="modal-tab-btn" data-tab="activities">Activities & Awards</button>
        </div>

        <div class="modal__body">
          <!-- TAB 1: OVERVIEW -->
          <div class="tab-content active" id="tab-overview">
            <div class="cv-overview-grid">
              <div class="cv-overview-card">
                <h3>Executive Summary</h3>
                <p><strong>Prof. Raja Shekhar Bellamkonda</strong> has a distinguished academic career spanning over 33 years in higher education, research, and university administration. He currently serves as the <strong>Vice-Chancellor of Yogi Vemana University</strong> and is a <strong>Senior Professor</strong> at the School of Management Studies, University of Hyderabad.</p>
                
                <h4 style="margin-top: 16px;">Core Fields of Interest</h4>
                <div class="cv-tags">
                  <span class="cv-tag">Quantitative Methods</span>
                  <span class="cv-tag">Operations Management</span>
                  <span class="cv-tag">Service Quality</span>
                  <span class="cv-tag">Research Methodology</span>
                </div>
                
                <h4 style="margin-top: 20px;">Research Impact</h4>
                <ul class="cv-list">
                  <li><strong>Ph.D. Guidance:</strong> 23 degrees awarded, 10 ongoing scholars.</li>
                  <li><strong>MBA Projects:</strong> Supervised over 120+ research projects.</li>
                  <li><strong>Research & Consultancy Projects:</strong> Completed projects worth <strong>Rs. 88.22 Lakhs</strong>.</li>
                </ul>
              </div>
              
              <div class="cv-overview-card">
                <h3>Academic Qualifications & Training</h3>
                <div class="cv-degrees-list">
                  <div class="cv-degree-item">
                    <span class="cv-degree-badge">FIE</span>
                    <div>
                      <strong>Fellow of the Institution of Engineers (India)</strong>
                      <p>Engineering • 2026</p>
                    </div>
                  </div>
                  <div class="cv-degree-item">
                    <span class="cv-degree-badge">M.Tech.</span>
                    <div>
                      <strong>BITS Pilani, Rajasthan</strong>
                      <p>Data Science and Engineering • 2025</p>
                    </div>
                  </div>
                  <div class="cv-degree-item">
                    <span class="cv-degree-badge">Ph.D. (Edu)</span>
                    <div>
                      <strong>Dr. B.R. Ambedkar Open University</strong>
                      <p>Education (Transformational Teaching & Student Satisfaction) • 2023</p>
                    </div>
                  </div>
                  <div class="cv-degree-item">
                    <span class="cv-degree-badge">Ph.D. (Psy)</span>
                    <div>
                      <strong>Sri Venkateswara University</strong>
                      <p>Psychology (Self-Efficacy & Decision Making Styles) • 2014</p>
                    </div>
                  </div>
                  <div class="cv-degree-item">
                    <span class="cv-degree-badge">Ph.D. (Mgt)</span>
                    <div>
                      <strong>Kakatiya University</strong>
                      <p>Commerce & Business Management (Consumerism in AP) • 2002</p>
                    </div>
                  </div>
                  <div class="cv-degree-item">
                    <span class="cv-degree-badge">M.Sc.</span>
                    <div>
                      <strong>Sri Venkateswara University</strong>
                      <p>Psychology (Industrial and Organizational Psychology) • 2006</p>
                    </div>
                  </div>
                  <div class="cv-degree-item">
                    <span class="cv-degree-badge">M.B.A.</span>
                    <div>
                      <strong>Osmania University</strong>
                      <p>Marketing Management • 1993</p>
                    </div>
                  </div>
                  <div class="cv-degree-item">
                    <span class="cv-degree-badge">B.Tech.</span>
                    <div>
                      <strong>Acharya Nagarjuna University</strong>
                      <p>Civil Engineering • 1990</p>
                    </div>
                  </div>
                </div>
                
                <h4 style="margin-top: 16px;">National / State Eligibility Tests (NET/SET)</h4>
                <div class="cv-tags">
                  <span class="cv-tag">UGC NET Women Studies (2020)</span>
                  <span class="cv-tag">TSSET Education (2018)</span>
                  <span class="cv-tag">UGC NET Education (2016)</span>
                  <span class="cv-tag">UGC NET Psychology (2015)</span>
                  <span class="cv-tag">UGC NET Management (2013)</span>
                  <span class="cv-tag">APSET Psychology (2012)</span>
                  <span class="cv-tag">UGC NET Business Management (1995)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: JOURNEY -->
          <div class="tab-content" id="tab-journey">
            <div class="cv-journey-grid">
              <div>
                <h3>Administrative Experience</h3>
                <div class="cv-timeline">
                  <div class="cv-timeline-item">
                    <div class="cv-timeline-dot"></div>
                    <div class="cv-timeline-content">
                      <span class="cv-timeline-date">2025 - Present</span>
                      <h4>Vice-Chancellor</h4>
                      <p>Yogi Vemana University, Kadapa, Andhra Pradesh</p>
                    </div>
                  </div>
                  <div class="cv-timeline-item">
                    <div class="cv-timeline-dot"></div>
                    <div class="cv-timeline-content">
                      <span class="cv-timeline-date">2019 - 2021</span>
                      <h4>Pro-Vice-Chancellor</h4>
                      <p>University of Hyderabad, Telangana</p>
                    </div>
                  </div>
                  <div class="cv-timeline-item">
                    <div class="cv-timeline-dot"></div>
                    <div class="cv-timeline-content">
                      <span class="cv-timeline-date">2013 - 2014</span>
                      <h4>Registrar</h4>
                      <p>University of Hyderabad, Telangana</p>
                    </div>
                  </div>
                  <div class="cv-timeline-item">
                    <div class="cv-timeline-dot"></div>
                    <div class="cv-timeline-content">
                      <span class="cv-timeline-date">2015 - 2018</span>
                      <h4>Dean, School of Management Studies</h4>
                      <p>University of Hyderabad, Telangana</p>
                    </div>
                  </div>
                  <div class="cv-timeline-item">
                    <div class="cv-timeline-dot"></div>
                    <div class="cv-timeline-content">
                      <span class="cv-timeline-date">2015 - 2019</span>
                      <h4>Director & Member Secretary, IQAC</h4>
                      <p>University of Hyderabad, Telangana</p>
                    </div>
                  </div>
                  <div class="cv-timeline-item">
                    <div class="cv-timeline-dot"></div>
                    <div class="cv-timeline-content">
                      <span class="cv-timeline-date">2009 - 2012</span>
                      <h4>Dean, Students' Welfare</h4>
                      <p>University of Hyderabad, Telangana</p>
                    </div>
                  </div>
                  <div class="cv-timeline-item">
                    <div class="cv-timeline-dot"></div>
                    <div class="cv-timeline-content">
                      <span class="cv-timeline-date">1999 - 2006</span>
                      <h4>Chief Warden / Warden</h4>
                      <p>University of Hyderabad & Satavahana PG Centre, Kakatiya University</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3>Academic Experience</h3>
                <div class="cv-timeline">
                  <div class="cv-timeline-item">
                    <div class="cv-timeline-dot"></div>
                    <div class="cv-timeline-content">
                      <span class="cv-timeline-date">2022 - Present</span>
                      <h4>Senior Professor</h4>
                      <p>School of Management Studies, University of Hyderabad</p>
                    </div>
                  </div>
                  <div class="cv-timeline-item">
                    <div class="cv-timeline-dot"></div>
                    <div class="cv-timeline-content">
                      <span class="cv-timeline-date">2010 - 2022</span>
                      <h4>Professor</h4>
                      <p>School of Management Studies, University of Hyderabad</p>
                    </div>
                  </div>
                  <div class="cv-timeline-item">
                    <div class="cv-timeline-dot"></div>
                    <div class="cv-timeline-content">
                      <span class="cv-timeline-date">2007 - 2010</span>
                      <h4>Associate Professor</h4>
                      <p>School of Management Studies, University of Hyderabad</p>
                    </div>
                  </div>
                  <div class="cv-timeline-item">
                    <div class="cv-timeline-dot"></div>
                    <div class="cv-timeline-content">
                      <span class="cv-timeline-date">2004 - 2007</span>
                      <h4>Reader</h4>
                      <p>School of Management Studies, University of Hyderabad</p>
                    </div>
                  </div>
                  <div class="cv-timeline-item">
                    <div class="cv-timeline-dot"></div>
                    <div class="cv-timeline-content">
                      <span class="cv-timeline-date">1999 - 2004</span>
                      <h4>Lecturer</h4>
                      <p>School of Management Studies, University of Hyderabad</p>
                    </div>
                  </div>
                  <div class="cv-timeline-item">
                    <div class="cv-timeline-dot"></div>
                    <div class="cv-timeline-content">
                      <span class="cv-timeline-date">1993 - 1999</span>
                      <h4>Lecturer / Associate Lecturer</h4>
                      <p>Satavahana PG Centre (Kakatiya University) & Kamala Nehru Polytechnic for Women</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 3: RESEARCH -->
          <div class="tab-content" id="tab-research">
            <h3>Doctoral Scholars Guided</h3>
            <p style="margin-bottom: 16px;">Prof. Raja Shekhar Bellamkonda has successfully guided <strong>23 Ph.D. scholars</strong> to completion and is currently supervising <strong>10 research scholars</strong>.</p>
            
            <h4 class="cv-section-heading">Awarded Ph.D. Degrees</h4>
            <div class="cv-table-container">
              <table class="cv-table">
                <thead>
                  <tr>
                    <th style="width: 50px;">S.No</th>
                    <th style="width: 180px;">Scholar Name</th>
                    <th style="width: 80px;">Year</th>
                    <th>Thesis Title</th>
                    <th style="width: 180px;">Current Designation / Institute</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td><strong>Dr. Parvez Ahmed</strong></td>
                    <td>2025</td>
                    <td>Consumer Satisfaction and Reuse Intention of Food Delivery Apps: Integration of Gratification and Stimulus-Organism-Response Theory.</td>
                    <td>Assistant Professor, SRM University, AP</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td><strong>Dr. Sri Sourya Sri Harsha Rongala</strong></td>
                    <td>2024</td>
                    <td>Food Tourists' Local Street Food Experience and its effect on their Behavioral Intentions towards the Destination.</td>
                    <td>Assistant Professor, SRM University, AP</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td><strong>Dr. Raja Lingam Goud P.</strong></td>
                    <td>2023</td>
                    <td>A Study on Flow of Credit and Management of Non-Performing Advances of Scheduled Commercial Banks In Priority Sector Lending in India.</td>
                    <td>Assistant Professor, Central University of Karnataka</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td><strong>Dr. Rasheed K.</strong></td>
                    <td>2023</td>
                    <td>Impact of Visual Servicescape Aesthetics Comprehension and Appreciation on Cognitive and Affective Evaluation, Satisfaction, and Behavioral Intentions: A study of select Resorts in India.</td>
                    <td>Assistant Professor, Aliah University, Kolkata</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td><strong>Dr. Srinivasa Rao Voruganti</strong></td>
                    <td>2022</td>
                    <td>The Effect of Service Climate on Customer Experience: The Mediating Role of Service Behavior.</td>
                    <td>Assistant Professor, MGIT, Hyderabad</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td><strong>Dr. Vinay Chittiprolu</strong></td>
                    <td>2021</td>
                    <td>The Antecedents of Customers' Compliments and Complaints towards different Categories of Hotels in India : Mining Meaning from Big Data using Latent Dirichlet Allocation.</td>
                    <td>Assistant Professor, IMT Nagpur</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td><strong>Dr. Bharath Shashanka Katkam</strong></td>
                    <td>2020</td>
                    <td>Intra-Individual dynamics among Exam Stress, Well-being Motives, Work productivity & Well-being Emotions of “Larks (Morning People)”.</td>
                    <td>Assistant Professor, ASCI, Hyderabad</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td><strong>Dr. Jyothi Chepur</strong></td>
                    <td>2020</td>
                    <td>The Role of Customer Experience in the formation of Customer Engagement.</td>
                    <td>Lecturer, TTWR Degree College for Women, Nizamabad</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td><strong>Dr. Chitti Seshu Jonnalagadda</strong></td>
                    <td>2019</td>
                    <td>Impact of Service Quality on Tourist Loyalty: Mediating role of Image and Satisfaction in Select State Tourism Development Corporations in India.</td>
                    <td>Visiting Faculty, Hyderabad</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td><strong>Dr. Ajay Kumar Koli</strong></td>
                    <td>2019</td>
                    <td>Handmade OK please: A Mixed Methods Study of Urban Indian Craft Consumers.</td>
                    <td>Founder & Director, SARA Institute, New Delhi</td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td><strong>Dr. Aditi Dang</strong></td>
                    <td>2018</td>
                    <td>Measuring the Business Performance of Indian Hotel Industry through Value Creation.</td>
                    <td>Assistant Professor, Jaipuria Institute of Management</td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td><strong>Dr. Krishnaiah Jajula</strong></td>
                    <td>2017</td>
                    <td>Technology Management Practices in Micro Small and Medium Enterprises (MSMEs): A Study on Pharmaceutical, Bulk Drug and Biotechnology Enterprises of Telangana and Andhra Pradesh.</td>
                    <td>Manager (Retd), AP State Finance Corporation</td>
                  </tr>
                  <tr>
                    <td>13</td>
                    <td><strong>Dr. Suresh Kandulapati</strong></td>
                    <td>2016</td>
                    <td>Examining the structural relationship between quality of mobile services and customer intention to stay: A study of mediation and moderation analysis.</td>
                    <td>Data Scientist, Amazon, Hyderabad</td>
                  </tr>
                  <tr>
                    <td>14</td>
                    <td><strong>Dr. Subhash Chandra Mahapatra</strong></td>
                    <td>2016</td>
                    <td>Evaluation of Service Quality Practices in Indian Airlines by Developing FliQual.</td>
                    <td>Assistant Professor, Central University of Odisha</td>
                  </tr>
                  <tr>
                    <td>15</td>
                    <td><strong>Dr. Mahesh Ramalingam</strong></td>
                    <td>2015</td>
                    <td>The Relationship between Service Quality and Attitudinal Loyalty of Bus Passengers: Mediating role of Perceived Value, Customer Trust and Customer Satisfaction.</td>
                    <td>Associate Professor, IMT Hyderabad</td>
                  </tr>
                  <tr>
                    <td>16</td>
                    <td><strong>Dr. Uma Maheswari Devi Paramata</strong></td>
                    <td>2015</td>
                    <td>Relative Effect of Service Quality on Customer Satisfaction – A Study with reference to one Indian Pharmaceutical Company.</td>
                    <td>Professor, Adikavi Nannaya University, Rajahmundry</td>
                  </tr>
                  <tr>
                    <td>17</td>
                    <td><strong>Dr. Ramaiah Itumalla</strong></td>
                    <td>2015</td>
                    <td>Evaluation of Service Quality Management in Indian Hospitals: A study of select Hospitals.</td>
                    <td>Associate Professor, The Apollo University, Chittoor</td>
                  </tr>
                  <tr>
                    <td>18</td>
                    <td><strong>Dr. Subrahmanyam Annamdevula</strong></td>
                    <td>2013</td>
                    <td>Impact of Service Quality on Student Satisfaction, Motivation and Loyalty in Indian Higher Education Sector by developing HiEduQual.</td>
                    <td>Associate Professor, GITAM University, Visakhapatnam</td>
                  </tr>
                  <tr>
                    <td>19</td>
                    <td><strong>Dr. Gayatri Reddy Kandula</strong></td>
                    <td>2013</td>
                    <td>Evaluation of Total Quality Management Practices in India: A comparative study of Public and Private Manufacturing units in Karnataka.</td>
                    <td>Associate Professor, VTU Bangalore</td>
                  </tr>
                  <tr>
                    <td>20</td>
                    <td><strong>Dr. Uday Bhaskar Nallamilli</strong></td>
                    <td>2012</td>
                    <td>Impact of Service Quality on Apparel Retailing with reference to Select Stores in Andhra Pradesh.</td>
                    <td>Professor, Adikavi Nannaya University, Rajahmundry</td>
                  </tr>
                  <tr>
                    <td>21</td>
                    <td><strong>Dr. Devi Prasad Maruvada</strong></td>
                    <td>2012</td>
                    <td>Evaluation of Service Quality and Passenger Satisfaction in Indian Railways by developing RAILQUAL.</td>
                    <td>Engineer, South Central Railways, Secunderabad</td>
                  </tr>
                  <tr>
                    <td>22</td>
                    <td><strong>Dr. Pramod Kumar Mishra</strong></td>
                    <td>2012</td>
                    <td>Evaluation of Supply Chain Management Practices in Indian Dairy Industry.</td>
                    <td>Assistant Professor, University of Hyderabad</td>
                  </tr>
                  <tr>
                    <td>23</td>
                    <td><strong>Dr. Sanjay Kumar Singavarapu</strong></td>
                    <td>2010</td>
                    <td>Management Practices in Non-profit Organizations: A study of Development Organizations in Andhra Pradesh.</td>
                    <td>Associate Professor, GGSIP University, Delhi</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 class="cv-section-heading" style="margin-top: 32px;">Ongoing Research Guidance</h4>
            <div class="cv-table-container">
              <table class="cv-table">
                <thead>
                  <tr>
                    <th style="width: 50px;">S.No</th>
                    <th style="width: 220px;">Scholar Name</th>
                    <th style="width: 140px;">Admission Year</th>
                    <th>Research Area / Topic</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td><strong>Suresh Siliveru</strong></td>
                    <td>2015</td>
                    <td>M-health Service Quality and Citizen Satisfaction, Quality of Life through M-government Services in India (Thesis Submitted)</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td><strong>Aafreen Ali</strong></td>
                    <td>2018</td>
                    <td>Evaluation of Service Recovery Strategies for the Indian Luxury Hotels: A QFD - ANP Approach</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td><strong>Megha Mittal</strong></td>
                    <td>2019</td>
                    <td>Enhancing Consumer Wellbeing: The Impact of Customer Experience Value in Smart Home Services</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td><strong>Mamata Purnima B.</strong></td>
                    <td>2021</td>
                    <td>Public Distribution System and AI</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td><strong>Dilip Kumar P.</strong></td>
                    <td>2021</td>
                    <td>Inventory Management</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td><strong>Pratima Kumari</strong></td>
                    <td>2023</td>
                    <td>Services Management</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td><strong>Christy Joselene</strong></td>
                    <td>2024</td>
                    <td>HR Analytics</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td><strong>Adil MD.</strong></td>
                    <td>2024</td>
                    <td>HR Analytics</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td><strong>Dasi Sumanth</strong></td>
                    <td>2025</td>
                    <td>Marketing Analytics</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td><strong>Sreeram Renusri</strong></td>
                    <td>2025</td>
                    <td>HR Analytics</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 4: PUBLICATIONS -->
          <div class="tab-content" id="tab-publications">
            <div class="cv-pub-counters">
              <div class="cv-pub-counter-card">
                <strong>6</strong>
                <span>Books Published</span>
              </div>
              <div class="cv-pub-counter-card">
                <strong>70</strong>
                <span>Papers in Journals</span>
              </div>
              <div class="cv-pub-counter-card">
                <strong>32</strong>
                <span>Papers in Conference Proceedings</span>
              </div>
              <div class="cv-pub-counter-card">
                <strong>52</strong>
                <span>Distance Education Lessons</span>
              </div>
            </div>

            <h3>Books Published</h3>
            <ul class="cv-pub-list">
              <li><strong>Raja Shekhar, B.</strong> and Acharyulu, G.V.R.K. (2009). <em>Logistics and Supply Chain management</em>. New Delhi: Excel Books. (Authored)</li>
              <li><strong>Raja Shekhar, B.</strong> (2002). <em>Issues and Dimensions of Consumer Protection</em>. Hyderabad: Consumers Awareness and Research Society. (Authored)</li>
              <li>Pramod K. Mishra, Sameer Prasad, Kamaiah B., <strong>Raja Shekhar B.</strong>, Chinmaya Behera, and Pratap Kumar Jena (eds.), (2024). <em>Responsible Production and Consumption: Agricultural Sustainability and Food Security</em>. London: Taylor & Francis Group. (Edited)</li>
              <li>Acharyulu, G.V.R.K. and <strong>Raja Shekhar, B.</strong> (eds.). (2010). <em>Strategic Quality Management</em>. New Delhi: Excel Books. (Edited)</li>
              <li><strong>Raja Shekhar, B.</strong> and Umamaheswari Devi, P. (eds.). (2009). <em>Emerging Trends in Consumer Protection</em>. New Delhi: Allied Publishers. (Edited)</li>
              <li><strong>Raja Shekhar, B.</strong> and Acharyulu, G.V.R.K. (eds.). (2009). <em>Supply Chain Management Practices in India</em>. New Delhi: Allied Publishers. (Edited)</li>
            </ul>

            <h3 style="margin-top: 32px;">Selected Recent Journal Publications (2023 - 2025)</h3>
            <ul class="cv-pub-list">
              <li>Ahmad, P., Kumar, A., <strong>Shekhar, R.</strong> & Kumari, P. (2025). Design matters, and so does the consumption value in consumers' intention to reuse food delivery apps. <em>British Food Journal</em>.</li>
              <li>Gupta, M., Ahmad, P., <strong>Bellamkonda, R. S.</strong>, & Kumar, A. (2025). The Environmental Beliefs and Information Technologies: A Step in Pursuit of Eco-Friendly Smart Home Adoption. <em>Asia Pacific Journal of Information Systems</em>, 35(1), 216-243.</li>
              <li>Ahmad, P., Kumar, A., & <strong>Shekhar, R.</strong> (2025). If not more, then provide the same! Determining the reuse intention of food delivery apps. <em>Journal of Foodservice Business Research</em>, 1-26.</li>
              <li>Ahmad, P., Ram, N., <strong>Shekhar Bellamkonda, R.</strong>, & Kumar, A. (2025). Consumer Satisfaction and Reuse Intention of Food Delivery Apps: Integration of Service Quality Model and Expectation Confirmation Theory. <em>Journal of Quality Assurance in Hospitality & Tourism</em>, 1-29.</li>
              <li>Ali, A., Chittiprolu, V., Rongala, S., & <strong>Bellamkonda, R. S.</strong> (2024). Do all complain the same? Examining the role of luxury hotels reviewer attributes using text mining. <em>Consumer Behavior in Tourism and Hospitality</em>.</li>
              <li>Mishra, P. K., Sahu, S., Behera, C., Jena, P. K., & <strong>Shekhar, B. R.</strong> (2024). Predicting Time-Varying Causality Between Inflation Expectations and Realization Using ML Technique: Evidence from India. <em>IUP Journal of Applied Economics</em>, 23(1).</li>
              <li><strong>Bellamkonda, R.S.</strong>, Mary Sunanda G. & Rongala Sourya (2023). Review and Synthesis of a Decade Research on Transformational Teaching and Student Engagement. <em>MIER Journal of Educational Studies Trends and Practices</em>, 13(2), 442-459.</li>
              <li>Mary Sunanda G., <strong>Bellamkonda, R.S.</strong>, & Rongala Sourya (2023). Do teacher engagement in higher education institutions differ with gender, age, designation, and experience? <em>Research and Reflections on Education</em>, 21(3), 10-13.</li>
              <li>Sourya Rongala & <strong>Bellamkonda, R.S.</strong> (2023). Food Tourists: Local Food Consumption Value and its effect on their Behavioural Intentions towards the Destination. <em>Academy of Marketing Studies Journal</em>, 27(5S), 1-10.</li>
              <li>Mishra, P. K., Kamaiah, B., Behera, C., Jena, P. K., & <strong>Shekhar, B. R.</strong> (2023). Predicting and Validating the Impact of Energy Price Fluctuations on Food Inflation: A Machine Learning-Based Approach. <em>IUP Journal of Applied Economics</em>, 22(3).</li>
              <li>Mahapatra, S. C., & <strong>Bellamkonda, R. S.</strong> (2023). Higher expectations of passengers do really sense: Development and validation a multiple scale-FliQual for air transport service quality. <em>Journal of Retailing and Consumer Services</em>, 70, 103162.</li>
            </ul>
          </div>

          <div class="tab-content" id="tab-activities">
            <h3>Workshops & Programs Coordinated</h3>
            <p style="margin-bottom: 16px;">Prof. Raja Shekhar Bellamkonda has coordinated and conducted <strong>26 major workshops, refresher courses, and seminars</strong>, including:</p>
            <ul class="cv-list">
              <li><strong>International Conference on Responsible Production and Consumption</strong> (Co-convenor, March 5-7, 2024) - SMS, University of Hyderabad.</li>
              <li><strong>Refresher Course in Computational Social Sciences</strong> (Coordinator, Jan 30 - Feb 11, 2023) - HRDC, University of Hyderabad.</li>
              <li><strong>Refresher Course in Computational Social Sciences</strong> (Coordinator, Jan 17-30, 2022) - HRDC, University of Hyderabad.</li>
              <li><strong>Refresher Courses on Research Methodology for Social Sciences</strong> (Coordinator, Multiple iterations: July 2021, Aug 2020, July 2020) - HRDC, University of Hyderabad.</li>
              <li><strong>Management Development Programmes (MDPs) & Faculty Development Programmes (FDPs)</strong> on Operations Management, Research Methodology, Quantitative Techniques, and Service Quality.</li>
            </ul>

            <h3 style="margin-top: 32px;">Online Teaching (MOOCs)</h3>
            <p>Successfully coordinated and delivered <strong>two online courses under the SWAYAM platform</strong> of the Government of India, focused on higher education pedagogy and management methods.</p>

            <h3 style="margin-top: 32px;">Academic Body Memberships</h3>
            <p>Serves as a member of several Academic Boards, Board of Studies, Academic Senates, and Governing Bodies of prestigious Indian universities and institutions.</p>

            <h3 style="margin-top: 32px;">Extension Work & Community Service</h3>
            <p>Actively participates in public education programs on Television, Radio, and Print Media, offering career counseling, guidance for UGC NET aspirants, and public lectures on education policy and management sciences.</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);

    // Bind events
    var closeModalBtn = document.getElementById('closeModalBtn');
    var modalBackdrop = document.getElementById('modalBackdrop');

    viewProfileBtn.addEventListener('click', function () {
      modalEl.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
    });

    function closeModal() {
      modalEl.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Escape key close support
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modalEl.hasAttribute('hidden')) {
        closeModal();
      }
    });

    // Tab switching
    var tabBtns = modalEl.querySelectorAll('.modal-tab-btn');
    var tabContents = modalEl.querySelectorAll('.tab-content');

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        tabContents.forEach(function (c) { c.classList.remove('active'); });

        this.classList.add('active');
        var targetTab = this.getAttribute('data-tab');
        var targetEl = document.getElementById('tab-' + targetTab);
        if (targetEl) {
          targetEl.classList.add('active');
        }
      });
    });
  }

  (function() {
    var _push5 = history.pushState, _rep5 = history.replaceState;
    history.pushState = function() { 
      _push5.apply(this, arguments); 
      setTimeout(injectIndividualDeptPage, 50); 
      setTimeout(injectVCProfileModal, 50); 
    };
    history.replaceState = function() { 
      _rep5.apply(this, arguments); 
      setTimeout(injectIndividualDeptPage, 50); 
      setTimeout(injectVCProfileModal, 50); 
    };
  })();
  window.addEventListener("popstate", injectIndividualDeptPage);
  window.addEventListener("popstate", injectVCProfileModal);
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(injectIndividualDeptPage, 200);
    setTimeout(injectVCProfileModal, 200);
  } else {
    document.addEventListener("DOMContentLoaded", function() { 
      setTimeout(injectIndividualDeptPage, 200); 
      setTimeout(injectVCProfileModal, 200); 
    });
  }

  // ——— ✦ S P A   N A V   I N T E R C E P T ✦ ———
  // Catch clicks on plain <a> tags (not React Router <Link>) and turn them
  // into client-side navigation so the page never fully reloads.
  var _ipNavRx = /\.(pdf|docx?|xlsx?|pptx?|zip|rar|jpg|jpeg|png|gif|svg|webp|mp4|mp3|avi|mov)$/i;
  document.addEventListener("click", function(e) {
    if (e.defaultPrevented) return;         // already handled (e.g. React Router <Link>)
    if (e.button !== 0) return;             // left click only
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    var el = e.target.closest("a");
    if (!el) return;
    if (el.getAttribute("target") === "_blank" || el.hasAttribute("download")) return;
    var href = el.getAttribute("href");
    if (!href) return;
    if (href.indexOf("#") === 0 || href.indexOf("javascript:") === 0) return;
    if (href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) return;
    // skip file downloads
    var _h = href.split("?")[0].split("#")[0];
    if (_ipNavRx.test(_h)) return;
    // skip external links (different origin)
    if (href.indexOf("http://") === 0 || href.indexOf("https://") === 0) {
      if (href.indexOf(location.origin) !== 0) return;
    }
    e.preventDefault();
    history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
  });

})();
