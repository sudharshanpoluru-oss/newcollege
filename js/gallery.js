(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  /* ─────────────── Video Modal ─────────────── */
  function initVideoModal() {
    const modal = $('#videoModal');
    const iframe = $('#videoIframe');
    const closeBtn = $('.video-modal__close', modal);
    const backdrop = $('.video-modal__backdrop', modal);

    if (!modal || !iframe) return;

    $$('[data-video]').forEach(item => {
      item.addEventListener('click', () => {
        const videoId = item.getAttribute('data-video-id');
        const videoSrc = item.getAttribute('data-video-src');
        const videoType = item.getAttribute('data-video-type');

        if (videoId && videoType !== 'local') {
          iframe.style.display = '';
          iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
          modal.classList.add('open');
          document.body.style.overflow = 'hidden';
          closeBtn.focus();
        } else if (videoSrc && videoType === 'local') {
          iframe.style.display = 'none';
          const video = document.createElement('video');
          video.controls = true;
          video.autoplay = true;
          video.style.width = '100%';
          video.style.maxHeight = '80vh';
          video.innerHTML = `<source src="${videoSrc}" type="video/mp4">`;
          const embed = $('.video-modal__embed', modal);
          const oldVideo = embed.querySelector('video');
          if (oldVideo) oldVideo.remove();
          embed.appendChild(video);
          modal.classList.add('open');
          document.body.style.overflow = 'hidden';
          closeBtn.focus();
        }
      });
    });

    function closeModal() {
      modal.classList.remove('open');
      iframe.src = '';
      iframe.style.display = '';
      const embed = $('.video-modal__embed', modal);
      const video = embed.querySelector('video');
      if (video) video.remove();
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  /* ─────────────── Filter Enhancement ─────────────── */
  function initGalleryFilters() {
    const filterGroup = $('[data-filter-group]');
    if (!filterGroup) return;

    const buttons = $$('[data-filter]', filterGroup);
    const items = $$('.gallery-item');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        items.forEach(item => {
          if (filter === '*') {
            item.style.display = '';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          } else {
            const matches = item.matches(filter);
            if (matches) {
              item.style.display = '';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            } else {
              item.style.opacity = '0';
              item.style.transform = 'scale(0.92)';
              setTimeout(() => {
                if (!item.matches(filter)) {
                  item.style.display = 'none';
                }
              }, 400);
            }
          }
        });
      });
    });
  }

  /* ─────────────── Lightbox override for gallery ─────────────── */
  function initGalleryLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image lightbox');
    lightbox.innerHTML = `
      <button class="lightbox__close" type="button" aria-label="Close">&times;</button>
      <button class="lightbox__prev" type="button" aria-label="Previous">&#8249;</button>
      <button class="lightbox__next" type="button" aria-label="Next">&#8250;</button>
      <img class="lightbox__image" src="" alt="">
      <p class="lightbox__caption"></p>
    `;
    document.body.appendChild(lightbox);

    const img = $('.lightbox__image', lightbox);
    const caption = $('.lightbox__caption', lightbox);
    const closeBtn = $('.lightbox__close', lightbox);
    const prevBtn = $('.lightbox__prev', lightbox);
    const nextBtn = $('.lightbox__next', lightbox);

    const items = $$('[data-lightbox]');
    if (!items.length) return;

    let current = 0;

    function open(index) {
      current = index;
      const item = items[current];
      img.src = item.getAttribute('data-src');
      caption.textContent = item.getAttribute('data-caption') || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
      updateNav();
    }

    function close() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function prev() {
      if (current > 0) open(current - 1);
    }

    function next() {
      if (current < items.length - 1) open(current + 1);
    }

    function updateNav() {
      prevBtn.style.display = current > 0 ? '' : 'none';
      nextBtn.style.display = current < items.length - 1 ? '' : 'none';
    }

    items.forEach((item, i) => {
      item.addEventListener('click', e => {
        e.preventDefault();
        open(i);
      });
    });

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) close();
    });
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });
  }

  /* ─────────────── Init ─────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initVideoModal();
    initGalleryFilters();
    initGalleryLightbox();
  });

})();
