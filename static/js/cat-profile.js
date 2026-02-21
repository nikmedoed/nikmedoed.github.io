document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.cat-gallery .grid');
  if (!grid) return;

  const msnry = new Masonry(grid, {
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true
  });

  imagesLoaded(grid).on('progress', () => msnry.layout());

  const photos = Array.from(grid.querySelectorAll('img[data-index]'));
  if (!photos.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox hidden';
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="close">&times;</button>
    <button class="lightbox-prev" aria-label="previous">&#10094;</button>
    <img class="lightbox-image" alt="">
    <button class="lightbox-next" aria-label="next">&#10095;</button>
  `;
  document.body.appendChild(overlay);

  const imageUrls = photos.map(photo => photo.src);
  const lbImg = overlay.querySelector('.lightbox-image');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn = overlay.querySelector('.lightbox-prev');
  const nextBtn = overlay.querySelector('.lightbox-next');
  let current = 0;

  function show(index) {
    current = index;
    lbImg.src = imageUrls[current];
    lbImg.alt = photos[current].alt || '';
    overlay.classList.remove('hidden');
  }

  function hide() {
    overlay.classList.add('hidden');
  }

  function prev() {
    show((current - 1 + imageUrls.length) % imageUrls.length);
  }

  function next() {
    show((current + 1) % imageUrls.length);
  }

  grid.addEventListener('click', event => {
    const img = event.target.closest('img[data-index]');
    if (!img) return;
    show(Number(img.dataset.index));
  });

  closeBtn.addEventListener('click', hide);
  overlay.addEventListener('click', event => {
    if (event.target === overlay) hide();
  });
  prevBtn.addEventListener('click', event => {
    event.stopPropagation();
    prev();
  });
  nextBtn.addEventListener('click', event => {
    event.stopPropagation();
    next();
  });

  document.addEventListener('keydown', event => {
    if (overlay.classList.contains('hidden')) return;
    if (event.key === 'Escape') hide();
    if (event.key === 'ArrowLeft') prev();
    if (event.key === 'ArrowRight') next();
  });
});
