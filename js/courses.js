document.addEventListener('DOMContentLoaded', function () {
  var courseCards = document.querySelectorAll('.course-card');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  courseCards.forEach(function (card, index) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    card.style.transitionDelay = (index * 0.08) + 's';
    observer.observe(card);
  });

  var tableRows = document.querySelectorAll('.summary-table tbody tr');
  tableRows.forEach(function (row, index) {
    row.style.opacity = '0';
    row.style.transition = 'opacity 0.4s ease';
    row.style.transitionDelay = (index * 0.1) + 's';
  });

  var tableObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        tableRows.forEach(function (row) {
          row.style.opacity = '1';
        });
        tableObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  var summaryTable = document.querySelector('.summary-table-wrap');
  if (summaryTable) {
    tableObserver.observe(summaryTable);
  }
});
