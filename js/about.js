document.addEventListener('DOMContentLoaded', function () {
  var statNumbers = document.querySelectorAll('.stat-number[data-count]');

  function animateStats() {
    statNumbers.forEach(function (el) {
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
        el.textContent = current + (target >= 5000 ? '+' : '');
      }, 30);
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateStats();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  var statsContainer = document.querySelector('.history-stats');
  if (statsContainer) {
    observer.observe(statsContainer);
  }

  var cards = document.querySelectorAll('.profile-card, .vm-card');
  var cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(function (card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
  });
});
