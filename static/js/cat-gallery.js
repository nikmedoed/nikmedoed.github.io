document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;
  const cats = window.catsData || [];
  const cat = cats.find(c => c.id === id);
  if (!cat) return;
  const grid = document.getElementById('cat-gallery');
  const info = grid.querySelector(`.cat-info[data-cat="${id}"]`);
  if (info) info.style.display = '';
  const lang = document.documentElement.lang || 'en';
  cat.photos.forEach(url => {
    const item = document.createElement('div');
    item.className = 'grid-item';
    const img = document.createElement('img');
    img.src = url;
    img.alt = cat.name && cat.name[lang] ? cat.name[lang] : '';
    item.appendChild(img);
    grid.appendChild(item);
  });
  new Masonry(grid, {
    itemSelector: '.grid-item',
    columnWidth: 300,
    gutter: 16,
    fitWidth: true
  });
});
