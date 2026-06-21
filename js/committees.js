(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  /* ─────────────── Committee Card Entrance Animation ─────────────── */
  function initCommitteeReveal() {
    const cards = $$('.committee-card');

    if (!cards.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)`;
      card.style.transitionDelay = `${i * 80}ms`;
      observer.observe(card);
    });
  }

  /* ─────────────── Category group header reveal ─────────────── */
  function initGroupReveal() {
    const groups = $$('.committee-group__header');

    groups.forEach(header => {
      header.style.opacity = '0';
      header.style.transform = 'translateY(20px)';
      header.style.transition = 'opacity 0.7s ease, transform 0.7s ease';

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(header);
    });
  }

  /* ─────────────── Init ─────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initCommitteeReveal();
    initGroupReveal();
  });

})();
document.addEventListener('DOMContentLoaded', function () {

  const modal = document.getElementById('pdfModal');
  const frame = document.getElementById('pdfFrame');
  const closeBtn = document.getElementById('closePdf');

  if (!modal || !frame || !closeBtn) return;

  document.querySelectorAll('.committee-card').forEach(card => {

    card.style.cursor = 'pointer';

    card.addEventListener('click', function () {

      const pdf = this.getAttribute('data-pdf');

      if (!pdf) return;

      frame.src = pdf;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';

    });

  });

  closeBtn.addEventListener('click', function () {

    modal.style.display = 'none';
    frame.src = '';
    document.body.style.overflow = '';

  });

  modal.addEventListener('click', function (e) {

    if (e.target === modal) {
      modal.style.display = 'none';
      frame.src = '';
      document.body.style.overflow = '';
    }

  });

});