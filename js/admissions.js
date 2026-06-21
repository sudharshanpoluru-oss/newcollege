document.addEventListener('DOMContentLoaded', function () {
  var stepCards = document.querySelectorAll('.step-card');
  var eligCards = document.querySelectorAll('.elig-card');
  var docItems = document.querySelectorAll('.doc-item');
  var allItems = [].slice.call(stepCards).concat([].slice.call(eligCards)).concat([].slice.call(docItems));

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  allItems.forEach(function (item) {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(item);
  });

  var tableRows = document.querySelectorAll('.fee-table tbody tr');
  tableRows.forEach(function (row, index) {
    row.style.opacity = '0';
    row.style.transform = 'translateX(-12px)';
    row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });

  var tableObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        tableRows.forEach(function (row, index) {
          setTimeout(function () {
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
          }, index * 80);
        });
        tableObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  var feeTable = document.querySelector('.fee-table-wrap');
  if (feeTable) {
    tableObserver.observe(feeTable);
  }
});
