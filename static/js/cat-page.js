document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  if (grid) {
    imagesLoaded(grid, () => {
      new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true
      });
    });
  }

  const card = document.querySelector('.cat-profile');
  if (card) {
    const birth = card.dataset.birth;
    const ageSpan = card.querySelector('.cat-age');
    const categorySpan = card.querySelector('.cat-category');
    if (birth && ageSpan && categorySpan) {
      const [year, month] = birth.split('-').map(Number);
      const now = new Date();
      let y = now.getFullYear() - year;
      let m = now.getMonth() + 1 - month;
      if (m < 0) {
        y--;
        m += 12;
      }
      const lang = document.documentElement.lang;
      const labels = {
        en: { y: 'y', m: 'm', kitten: 'Kitten', teen: 'Teen', adult: 'Adult' },
        ru: { y: 'г.', m: 'мес.', kitten: 'Котёнок', teen: 'Подросток', adult: 'Взрослый' }
      };
      ageSpan.textContent = `${y} ${labels[lang].y} ${m} ${labels[lang].m}`;
      const months = y * 12 + m;
      let category = 'adult';
      if (months < 4) category = 'kitten';
      else if (months < 12) category = 'teen';
      categorySpan.textContent = labels[lang][category];
      const catClasses = { kitten: 'is-primary', teen: 'is-info', adult: 'is-dark' };
      categorySpan.classList.add(catClasses[category]);
    }
  }
});
