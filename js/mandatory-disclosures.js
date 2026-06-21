(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ── Accordion Toggle ── */
    var toggles = document.querySelectorAll('.accordion__toggle');
    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
        this.setAttribute('aria-expanded', expanded);
      });
    });

    /* ── Live Search Filter ── */
    var searchInput = document.getElementById('docSearch');
    var clearBtn = document.getElementById('searchClear');
    var allCards = document.querySelectorAll('.doc-card');
    var noResultsMsg = document.createElement('div');
    noResultsMsg.className = 'no-results';
    noResultsMsg.innerHTML = '<span class="material-symbols-outlined">search_off</span><h3>No documents found</h3><p>Try adjusting your search query.</p>';

    var disclosuresSection = document.getElementById('disclosures');
    var accordionGroup = document.getElementById('docAccordion');
    if (disclosuresSection && accordionGroup) {
      accordionGroup.parentNode.insertBefore(noResultsMsg, accordionGroup.nextSibling);
    }

    function filterDocs() {
      var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      var visibleCount = 0;

      allCards.forEach(function (card) {
        var title = card.getAttribute('data-title') || '';
        var year = card.getAttribute('data-year') || '';
        var badge = card.querySelector('.doc-card__badge');
        var badgeText = badge ? badge.textContent.toLowerCase() : '';
        var desc = card.querySelector('.doc-card__desc');
        var descText = desc ? desc.textContent.toLowerCase() : '';
        var searchableText = (title + ' ' + year + ' ' + badgeText + ' ' + descText).toLowerCase();

        if (!query || searchableText.indexOf(query) !== -1) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      /* Show/hide accordion bodies based on visible children */
      var accordions = document.querySelectorAll('.accordion');
      accordions.forEach(function (acc) {
        var cards = acc.querySelectorAll('.doc-card');
        var hasVisible = false;
        cards.forEach(function (c) {
          if (!c.classList.contains('hidden')) hasVisible = true;
        });
        if (query && !hasVisible) {
          acc.style.display = 'none';
        } else {
          acc.style.display = '';
        }
      });

      /* Show no-results message */
      if (query && visibleCount === 0) {
        noResultsMsg.classList.add('visible');
      } else {
        noResultsMsg.classList.remove('visible');
      }

      /* Toggle clear button visibility */
      if (clearBtn) {
        if (query) {
          clearBtn.classList.add('visible');
        } else {
          clearBtn.classList.remove('visible');
        }
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', filterDocs);
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = '';
          filterDocs();
          searchInput.focus();
        }
      });
    }

    /* ── Stats Counter Animation ── */
    var statsGrid = document.getElementById('statsGrid');
    if (statsGrid) {
      var counterValue = statsGrid.querySelector('.stat-card__value[data-count]');
      if (counterValue) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(counterValue);
              observer.unobserve(counterValue);
            }
          });
        }, { threshold: 0.5 });
        observer.observe(counterValue);
      }
    }

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(target)) return;
      var current = 0;
      var increment = Math.ceil(target / 40);
      var timer = setInterval(function () {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current;
      }, 30);
    }

    /* ── Timeline Scroll Animation ── */
    var timelineItems = document.querySelectorAll('.timeline__item');
    if (timelineItems.length) {
      var tlObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            tlObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

      timelineItems.forEach(function (item) {
        tlObserver.observe(item);
      });
    }

    /* ── Keyboard: Escape to clear search ── */
    if (searchInput) {
      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          this.value = '';
          filterDocs();
          this.blur();
        }
      });
    }

  });

})();
