document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id || !window.cats || !window.cats[id]) return;

  const lang = document.documentElement.lang;
  const cat = window.cats[id];

  document.title = cat.name[lang];

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
      const p = window.cats[pid];
      if (!p) return '';
      const icon = p.gender === 'male' ? 'fa-mars has-text-link' : 'fa-venus has-text-danger';
      return `<a class="tag is-light ${p.gender === 'male' ? 'is-link' : 'is-danger'} cat-relative ml-1" href="?id=${p.id}"><span class="icon is-small mr-1"><i class="fas ${icon}"></i></span><span>${p.name[lang]}</span></a>`;
    }).join('');
    const parentsBlock = parents ? `<div class="mt-1"><span class="has-text-weight-semibold">${lang==='ru' ? 'Родители:' : 'Parents:'}</span>${parents}</div>` : '';
    const children = Object.values(window.cats).filter(c => (c.parents || []).includes(cat.id)).map(ch => {
      const icon = ch.gender === 'male' ? 'fa-mars has-text-link' : 'fa-venus has-text-danger';
      return `<a class="tag is-light ${ch.gender === 'male' ? 'is-link' : 'is-danger'} cat-relative ml-1" href="?id=${ch.id}"><span class="icon is-small mr-1"><i class="fas ${icon}"></i></span><span>${ch.name[lang]}</span></a>`;
    }).join('');
    const childrenBlock = children ? `<div class="mt-1"><span class="has-text-weight-semibold">${lang==='ru' ? 'Дети:' : 'Children:'}</span>${children}</div>` : '';
    const treatment = cat.treatment && cat.treatment[lang] ? `<div class="tags bottom-tags mt-2"><span class="tag is-danger">${cat.treatment[lang]}</span></div>` : '';
    const adoptText = lang === 'ru' ? 'Забрать' : 'Adopt';
    return `<div class="card cat-card"><div class="card-content"><div class="is-flex is-align-items-center is-justify-content-space-between mb-2"><div class="is-flex is-align-items-center"><p class="title is-5 mb-0">${name}</p><span class="icon cat-gender ml-2"><i class="fas ${genderIcon}"></i></span><span class="tag is-rounded is-hoverable cat-ster-tag ml-2 ${sterClass}">${sterText}</span></div><div class="is-flex is-align-items-center">${wildIcon}${wandererIcon}<p class="is-size-7 mb-0 cat-age">${ageString(cat.birth)}</p></div></div><p class="content mb-0">${cat.description[lang]}</p>${parentsBlock}${childrenBlock}${treatment}</div><footer class="card-footer"><a class="card-footer-item adopt-btn" data-name="${name}">${adoptText}</a></footer></div>`;
  }

  const infoItem = document.createElement('div');
  infoItem.className = 'grid-item';
  infoItem.innerHTML = infoCardHTML();
  grid.appendChild(infoItem);

  cat.photos.forEach(url => {
    const item = document.createElement('div');
    item.className = 'grid-item';
    item.innerHTML = `<figure class="image"><img src="${url}" alt="${cat.name[lang]}"></figure>`;
    grid.appendChild(item);
  });

  new Masonry(grid, {
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    gutter: 10,
    percentPosition: true
  });
});
