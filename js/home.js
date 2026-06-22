/**
 * Home Page JavaScript — Y.S.R. Engineering College
 * Carousel, Animated Counters, Scroll Animations, Map
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     Hero Carousel
     ───────────────────────────────────────────── */
  function initCarousel() {
    const container = document.querySelector('.hero-carousel');
    if (!container) return;

    const slides = container.querySelectorAll('.hero-slide');
    const dotsContainer = container.querySelector('.hero-carousel__dots');
    const prevBtn = container.querySelector('.hero-carousel__arrow--prev');
    const nextBtn = container.querySelector('.hero-carousel__arrow--next');

    if (!slides.length) return;

    let current = 0;
    let interval = null;
    const AUTOPLAY_DELAY = 5000;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('type', 'button');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('button');

    function goTo(index) {
      if (index === current) return;
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));

      slides[index].classList.add('active');
      dots[index].classList.add('active');
      current = index;
    }

    function goNext() {
      goTo((current + 1) % slides.length);
    }

    function goPrev() {
      goTo((current - 1 + slides.length) % slides.length);
    }

    function startAutoplay() {
      stopAutoplay();
      interval = setInterval(goNext, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', () => { goPrev(); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goNext(); startAutoplay(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
    });

    // Pause on hover
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) { goNext(); } else { goPrev(); }
        startAutoplay();
      }
    }, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
      if (!container.matches(':hover')) return;
      if (e.key === 'ArrowLeft') { goPrev(); startAutoplay(); }
      if (e.key === 'ArrowRight') { goNext(); startAutoplay(); }
    });

    // Init
    goTo(0);
    startAutoplay();
  }

  /* ─────────────────────────────────────────────
     Animated Counters (home-specific override)
     ───────────────────────────────────────────── */
  function initHomeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            observer.unobserve(el);
            animateCounter(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach(el => observer.observe(el));

    setTimeout(function () {
      counters.forEach(function (el) {
        if (el.textContent === '0') {
          animateCounter(el);
        }
      });
    }, 1500);
  }

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const duration = parseInt(el.getAttribute('data-duration')) || 2000;
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const isDecimal = target % 1 !== 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      if (isDecimal) {
        el.textContent = prefix + (target * eased).toFixed(2) + suffix;
      } else {
        el.textContent = prefix + Math.round(target * eased) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  /* ─────────────────────────────────────────────
     Scroll-triggered Animations (home-specific)
     ───────────────────────────────────────────── */
  function initHomeReveal() {
    const elements = document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-stagger');

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach(el => observer.observe(el));
  }

  /* ─────────────────────────────────────────────
     Map Initialization
     ───────────────────────────────────────────── */
  function initMap() {
    const mapContainer = document.getElementById('collegeMap');
    if (!mapContainer) return;

    // Check if Google Maps API is loaded
    if (typeof google !== 'undefined' && google.maps) {
      const location = { lat: 14.7392, lng: 78.5483 }; // Proddatur coordinates

      const map = new google.maps.Map(mapContainer, {
        center: location,
        zoom: 15,
        mapTypeId: 'roadmap',
        styles: [
          { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#f3f7fa' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d9e3eb' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
          { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#526372' }] },
          { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#d9e3eb' }] },
          { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#073f68' }] },
        ],
        disableDefaultUI: true,
        zoomControl: true,
      });

      new google.maps.Marker({
        position: location,
        map: map,
        title: 'Y.S.R. Engineering College',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#d89a25',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
      });
    } else {
      // Fallback: render a simple address card
      mapContainer.innerHTML = `
        <div class="map-placeholder">
          <span class="material-symbols-outlined">map</span>
          <p>
            <strong>Y.S.R. Engineering College</strong><br>
            Yogi Vemana University Campus<br>
            Proddatur, Y.S.R. Kadapa District<br>
            Andhra Pradesh — 516360
          </p>
          <a class="button button--small button--outline" href="https://maps.google.com/?q=Y.S.R.+Engineering+College+Proddatur" target="_blank" rel="noopener noreferrer">
            Open in Google Maps
          </a>
        </div>
      `;
    }
  }

  /* ─────────────────────────────────────────────
     Init
     ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initHomeCounters();
    initHomeReveal();
    initMap();
  });

})();
