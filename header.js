document.addEventListener('DOMContentLoaded', () => {
  const $navbarBurgers = Array.from(document.querySelectorAll('.navbar-burger'));
  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {
        const target = el.dataset.target;
        const $target = document.getElementById(target);
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }

  const themeBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeBtn) {
      const icon = themeBtn.querySelector('i');
      if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.toggle('is-dark', theme === 'dark');
      navbar.classList.toggle('is-light', theme === 'light');
    }
  }
  if (themeBtn) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    applyTheme(storedTheme || (prefersDark ? 'dark' : 'light'));
    themeBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    });
  }

  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  let lastScroll = window.pageYOffset || document.documentElement.scrollTop;

  window.addEventListener('scroll', () => {
    const current = window.pageYOffset || document.documentElement.scrollTop;
    if (current <= 0) {
      navbar.classList.remove('hidden');
      lastScroll = current;
      return;
    }
    if (current > lastScroll) {
      navbar.classList.add('hidden');
    } else if (current < lastScroll) {
      navbar.classList.remove('hidden');
    }
    lastScroll = current;
  });
});
