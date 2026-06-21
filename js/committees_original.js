(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    var controls = null;
    var iframe = null;
    var zoomLevel = 1;

    function findRight() { return document.querySelector('.committee-right'); }
    function findIframe() { var r = findRight(); return r ? r.querySelector('iframe') : null; }

    // Watch for iframe changes
    var observer = new MutationObserver(function() {
      var newIframe = findIframe();
      if (newIframe && newIframe !== iframe) {
        iframe = newIframe;
        zoomLevel = 1;
        injectControls(findRight());
      } else if (!newIframe && iframe) {
        iframe = null;
        removeControls();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Listen for committee-item clicks — re-open modal and show controls
    document.addEventListener('click', function(e) {
      var item = e.target.closest('.committee-item');
      if (!item) return;
      var right = findRight();
      if (right) {
        right.classList.remove('committee-closed');
        if (controls) controls.classList.remove('committee-controls-hidden');
      }
    });

    function injectControls(right) {
      removeControls();

      controls = document.createElement('div');
      controls.className = 'committee-controls';

      var closeBtn = document.createElement('button');
      closeBtn.className = 'committee-ctrl-btn committee-close-btn';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.textContent = '←';

      var zoomOut = document.createElement('button');
      zoomOut.className = 'committee-ctrl-btn committee-zoom-out';
      zoomOut.setAttribute('aria-label', 'Zoom out');
      zoomOut.textContent = '−';

      var zoomLevelDisplay = document.createElement('span');
      zoomLevelDisplay.className = 'committee-zoom-level';
      zoomLevelDisplay.textContent = '1×';

      var zoomIn = document.createElement('button');
      zoomIn.className = 'committee-ctrl-btn committee-zoom-in';
      zoomIn.setAttribute('aria-label', 'Zoom in');
      zoomIn.textContent = '+';

      var zoomGroup = document.createElement('div');
      zoomGroup.className = 'committee-zoom-group';
      zoomGroup.appendChild(zoomOut);
      zoomGroup.appendChild(zoomLevelDisplay);
      zoomGroup.appendChild(zoomIn);

      controls.appendChild(closeBtn);
      controls.appendChild(zoomGroup);

      // Close: hide modal and controls
      closeBtn.addEventListener('click', function() {
        right.classList.add('committee-closed');
        if (controls) controls.classList.add('committee-controls-hidden');
      });

      zoomIn.addEventListener('click', function() {
        if (!iframe) return;
        zoomLevel = Math.min(3, +(zoomLevel + 0.1).toFixed(1));
        applyZoom();
      });

      zoomOut.addEventListener('click', function() {
        if (!iframe) return;
        zoomLevel = Math.max(0.3, +(zoomLevel - 0.1).toFixed(1));
        applyZoom();
      });

      // Click overlay background to close
      right.addEventListener('click', function onClickOverlay(e) {
        if (e.target === right && iframe) {
          right.classList.add('committee-closed');
          if (controls) controls.classList.add('committee-controls-hidden');
        }
      });

      document.body.appendChild(controls);
    }

    function removeControls() {
      if (controls) { controls.remove(); controls = null; }
    }

    function applyZoom() {
      if (!iframe) return;
      iframe.style.transform = 'scale(' + zoomLevel + ')';
      iframe.style.transformOrigin = 'center center';
      iframe.style.transition = 'transform 0.2s ease';
      var d = controls ? controls.querySelector('.committee-zoom-level') : null;
      if (d) d.textContent = zoomLevel + '×';
    }
  }
})();
