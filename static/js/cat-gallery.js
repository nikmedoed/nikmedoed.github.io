document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const catsData = typeof window.cats === 'string' ? JSON.parse(window.cats) : window.cats;
  if (!id || !catsData || !catsData[id]) return;

  const lang = document.documentElement.lang;
  const cat = catsData[id];

  const catsTitle = { en: 'Cats of Nansen street', ru: 'Коты улицы Нансена' };
  document.title = `${cat.name[lang]} | ${catsTitle[lang] || catsTitle.en}`;

  const grid = document.querySelector('.grid');
  if (!grid) return;

  const sizer = document.createElement('div');
  sizer.className = 'grid-sizer';
  grid.appendChild(sizer);

  function ageString(birth) {
    if (!birth) return '';
    const [year, month] = birth.split('-').map(Number);
    const now = new Date();
    let y = now.getFullYear() - year;
    let m = now.getMonth() + 1 - month;
    if (m < 0) {
      y--;
      m += 12;
    }
    const yLabel = lang === 'ru' ? 'г.' : 'y';
    const mLabel = lang === 'ru' ? 'мес.' : 'm';
    return `${y} ${yLabel} ${m} ${mLabel}`;
  }

  function infoCardHTML() {
    const name = cat.name[lang];
    const genderIcon = cat.gender === 'male' ? 'fa-mars has-text-link' : 'fa-venus has-text-danger';
    const sterText = cat.sterilized ? (lang === 'ru' ? 'Стерилизован' : 'Sterilized') : (lang === 'ru' ? 'Не стерилизован' : 'Not sterilized');
    const sterClass = cat.sterilized ? 'is-success' : 'is-warning';
    const wildIcon = cat.wild ? '<span class="icon is-medium cat-flag mr-2" tabindex="0"><i class="fa-solid fa-explosion fa-lg"></i></span>' : '';
    const wandererIcon = cat.wanderer ? '<span class="icon is-medium cat-flag mr-2" tabindex="0"><i class="fas fa-route fa-lg"></i></span>' : '';
      const parents = (cat.parents || []).map(pid => {
      const p = catsData[pid];
      if (!p) return '';
      const icon = p.gender === 'male' ? 'fa-mars has-text-link' : 'fa-venus has-text-danger';
      return `<a class="tag is-light ${p.gender === 'male' ? 'is-link' : 'is-danger'} cat-relative ml-1" href="?id=${p.id}"><span class="icon is-small mr-1"><i class="fas ${icon}"></i></span><span>${p.name[lang]}</span></a>`;
    }).join('');
    const parentsBlock = parents ? `<div class="mt-1"><span class="has-text-weight-semibold">${lang==='ru' ? 'Родители:' : 'Parents:'}</span>${parents}</div>` : '';
      const children = Object.values(catsData).filter(c => (c.parents || []).includes(cat.id)).map(ch => {
        const icon = ch.gender === 'male' ? 'fa-mars has-text-link' : 'fa-venus has-text-danger';
        return `<a class="tag is-light ${ch.gender === 'male' ? 'is-link' : 'is-danger'} cat-relative ml-1" href="?id=${ch.id}"><span class="icon is-small mr-1"><i class="fas ${icon}"></i></span><span>${ch.name[lang]}</span></a>`;
      }).join('');
    const childrenBlock = children ? `<div class="mt-1"><span class="has-text-weight-semibold">${lang==='ru' ? 'Дети:' : 'Children:'}</span>${children}</div>` : '';
    const issues = cat.treatment && cat.treatment[lang] ? (Array.isArray(cat.treatment[lang]) ? cat.treatment[lang] : [cat.treatment[lang]]) : [];
    const treatment = issues.length ? `<div class="tags bottom-tags mt-2">${issues.map(t => `<span class="tag is-danger">${t}</span>`).join('')}</div>` : '';
    const adoptText = lang === 'ru' ? 'Забрать' : 'Adopt';
    return `<div class="card cat-card"><div class="card-content"><div class="is-flex is-align-items-center is-justify-content-space-between mb-2"><div class="is-flex is-align-items-center"><p class="title is-5 mb-0">${name}</p><span class="icon cat-gender ml-2"><i class="fas ${genderIcon}"></i></span><span class="tag is-rounded is-hoverable cat-ster-tag ml-2 ${sterClass}">${sterText}</span></div><div class="is-flex is-align-items-center">${wildIcon}${wandererIcon}<p class="is-size-7 mb-0 cat-age">${ageString(cat.birth)}</p></div></div><p class="content mb-0">${cat.description[lang]}</p>${parentsBlock}${childrenBlock}${treatment}</div><footer class="card-footer"><button class="card-footer-item adopt-btn has-text-link" type="button" data-name="${name}">${adoptText}</button></footer></div>`;
  }

  const infoItem = document.createElement('div');
  infoItem.className = 'grid-item';
  infoItem.innerHTML = infoCardHTML();
  grid.appendChild(infoItem);

  const photos = [];
  cat.photos.forEach((url, idx) => {
    photos.push(url);
    const item = document.createElement('div');
    item.className = 'grid-item';
    item.innerHTML = `<figure class="image"><img src="${url}" alt="${cat.name[lang]}" data-index="${idx}"></figure>`;
    grid.appendChild(item);
  });

  const msnry = new Masonry(grid, {
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true
  });

  imagesLoaded(grid).on('progress', () => msnry.layout());

  const overlay = document.createElement('div');
  overlay.className = 'lightbox hidden';
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="close">&times;</button>
    <button class="lightbox-prev" aria-label="previous">&#10094;</button>
    <img class="lightbox-image" alt="${cat.name[lang]}">
    <button class="lightbox-next" aria-label="next">&#10095;</button>
  `;
  document.body.appendChild(overlay);

  const lbImg = overlay.querySelector('.lightbox-image');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn = overlay.querySelector('.lightbox-prev');
  const nextBtn = overlay.querySelector('.lightbox-next');
  let current = 0;

  function show(idx) {
    current = idx;
    lbImg.src = photos[current];
    overlay.classList.remove('hidden');
  }

  function hide() {
    overlay.classList.add('hidden');
  }

  function prev() {
    show((current - 1 + photos.length) % photos.length);
  }

  function next() {
    show((current + 1) % photos.length);
  }

  grid.addEventListener('click', e => {
    const img = e.target.closest('img[data-index]');
    if (!img) return;
    show(Number(img.dataset.index));
  });

  closeBtn.addEventListener('click', hide);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) hide();
  });
  prevBtn.addEventListener('click', e => {
    e.stopPropagation();
    prev();
  });
  nextBtn.addEventListener('click', e => {
    e.stopPropagation();
    next();
  });

  document.addEventListener('keydown', e => {
    if (overlay.classList.contains('hidden')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
});
