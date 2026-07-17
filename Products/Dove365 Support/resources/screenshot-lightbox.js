(function () {
  'use strict';

  var images = document.querySelectorAll(
    '.doc-figure img, .product-shot img'
  );

  if (!images.length) return;

  var style = document.createElement('style');
  style.textContent =
    '.doc-figure img,.product-shot img{cursor:zoom-in}' +
    '.doc-figure img:focus-visible,.product-shot img:focus-visible{outline:3px solid var(--teal);outline-offset:4px}' +
    '.screenshot-lightbox{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:4rem 1.25rem 1.25rem;background:rgba(4,15,28,.92)}' +
    '.screenshot-lightbox.is-open{display:flex}' +
    '.screenshot-lightbox img{display:block;max-width:min(96vw,1600px);max-height:calc(100vh - 5.5rem);width:auto;height:auto;object-fit:contain;border-radius:10px;box-shadow:0 24px 70px rgba(0,0,0,.45)}' +
    '.screenshot-lightbox-close{position:absolute;top:1rem;right:1rem;width:44px;height:44px;border:1px solid rgba(255,255,255,.45);border-radius:50%;background:#fff;color:#091f37;font:700 1.6rem/1 sans-serif;cursor:pointer}' +
    '.screenshot-lightbox-close:focus-visible{outline:3px solid #42d3c7;outline-offset:3px}' +
    'body.screenshot-lightbox-open{overflow:hidden}';
  document.head.appendChild(style);

  var overlay = document.createElement('div');
  overlay.className = 'screenshot-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Expanded screenshot');
  overlay.innerHTML = '<button class="screenshot-lightbox-close" type="button" aria-label="Close expanded screenshot">&times;</button><img alt="">';
  document.body.appendChild(overlay);

  var expandedImage = overlay.querySelector('img');
  var closeButton = overlay.querySelector('button');
  var trigger = null;

  function closeLightbox() {
    overlay.classList.remove('is-open');
    document.body.classList.remove('screenshot-lightbox-open');
    expandedImage.removeAttribute('src');
    if (trigger) trigger.focus();
  }

  function openLightbox(image) {
    trigger = image;
    expandedImage.src = image.currentSrc || image.src;
    expandedImage.alt = image.alt || 'Expanded screenshot';
    overlay.classList.add('is-open');
    document.body.classList.add('screenshot-lightbox-open');
    closeButton.focus();
  }

  images.forEach(function (image) {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', (image.alt || 'Screenshot') + '. Select to expand.');
    image.addEventListener('click', function () { openLightbox(image); });
    image.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) closeLightbox();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) closeLightbox();
  });
}());
