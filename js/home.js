(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     Hero Carousel
     ───────────────────────────────────────────── */
  function initCarousel() {
    var container = document.querySelector('.hero-carousel');
    if (!container) return;

    var slides = container.querySelectorAll('.hero-slide');
    var dotsContainer = container.querySelector('.hero-carousel__dots');
    var prevBtn = container.querySelector('.hero-carousel__arrow--prev');
    var nextBtn = container.querySelector('.hero-carousel__arrow--next');

    if (!slides.length) return;

    var current = 0;
    var interval = null;
    var AUTOPLAY_DELAY = 5000;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.setAttribute('type', 'button');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll('button');

    function goTo(index) {
      if (index === current) return;
      slides.forEach(function (s) { s.classList.remove('active'); });
      dots.forEach(function (d) { d.classList.remove('active'); });
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      current = index;
    }

    function goNext() { goTo((current + 1) % slides.length); }
    function goPrev() { goTo((current - 1 + slides.length) % slides.length); }

    function startAutoplay() { stopAutoplay(); interval = setInterval(goNext, AUTOPLAY_DELAY); }
    function stopAutoplay() { if (interval) { clearInterval(interval); interval = null; } }

    if (prevBtn) prevBtn.addEventListener('click', function () { goPrev(); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goNext(); startAutoplay(); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); startAutoplay(); });
    });

    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);

    var touchStartX = 0;
    container.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', function (e) {
      var touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) { goNext(); } else { goPrev(); }
        startAutoplay();
      }
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (!container.matches(':hover')) return;
      if (e.key === 'ArrowLeft') { goPrev(); startAutoplay(); }
      if (e.key === 'ArrowRight') { goNext(); startAutoplay(); }
    });

    goTo(0);
    startAutoplay();
  }

  /* ─────────────────────────────────────────────
     Animated Counters
     ───────────────────────────────────────────── */
  function initHomeCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            observer.unobserve(el);
            animateCounter(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach(function (el) { observer.observe(el); });

    setTimeout(function () {
      counters.forEach(function (el) {
        if (el.textContent === '0') {
          animateCounter(el);
        }
      });
    }, 1500);
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var duration = parseInt(el.getAttribute('data-duration')) || 2000;
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var isDecimal = target % 1 !== 0;
    var startTime = performance.now();

    function update(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);

      if (isDecimal) {
        el.textContent = prefix + (target * eased).toFixed(2) + suffix;
      } else {
        el.textContent = prefix + Math.round(target * eased) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + Math.round(target).toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  /* ─────────────────────────────────────────────
     Scroll Animations (home-specific)
     ───────────────────────────────────────────── */
  function initHomeReveal() {
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

  /* ─────────────────────────────────────────────
     Init
     ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initCarousel();
    initHomeCounters();
    initHomeReveal();
  });

})();
