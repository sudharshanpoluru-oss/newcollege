(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  /* ─────────────── Contact Form Enhancement ─────────────── */
  function initContactForm() {
    const form = $('.contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = $('#name').value.trim();
      const email = $('#email').value.trim();
      const message = $('#message').value.trim();
      const subject = $('#subject').value;

      $$('.form-error', form).forEach(el => el.remove());
      $$('.error', form).forEach(el => el.classList.remove('error'));

      let hasError = false;

      if (!name) {
        showError('#name', 'Please enter your name');
        hasError = true;
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('#email', 'Please enter a valid email address');
        hasError = true;
      }

      if (!message || message.length < 10) {
        showError('#message', 'Message must be at least 10 characters');
        hasError = true;
      }

      if (hasError) return;

      const btn = form.querySelector('.button');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">sync</span> Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;

        if (window.Toast) {
          Toast.success(
            'Your message has been sent successfully. We will get back to you soon.',
            'Thank You!'
          );
        } else {
          alert('Thank you! Your message has been sent successfully.');
        }

        form.reset();
      }, 1500);
    });

    function showError(selector, message) {
      const field = $(selector);
      if (!field) return;
      field.classList.add('error');
      const errorEl = document.createElement('p');
      errorEl.className = 'form-error';
      errorEl.textContent = message;
      field.parentElement.appendChild(errorEl);
      field.focus();
    }

    $$('.form-input, .form-textarea, .form-select', form).forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const errorEl = field.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.remove();
      });
    });
  }

  /* ─────────────── Contact Detail Card Entrance ─────────────── */
  function initContactCardsReveal() {
    const cards = $$('.contact-detail-card');

    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateX(-20px)';
      card.style.transition = `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)`;
      card.style.transitionDelay = `${i * 100}ms`;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateX(0)';
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(card);
    });
  }

  /* ─────────────── Department Cards Reveal ─────────────── */
  function initDeptCardsReveal() {
    const cards = $$('.dept-contact-card');

    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)`;
      card.style.transitionDelay = `${i * 80}ms`;

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
        { threshold: 0.15 }
      );

      observer.observe(card);
    });
  }

  /* ─────────────── Init ─────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
    initContactCardsReveal();
    initDeptCardsReveal();
  });

})();
