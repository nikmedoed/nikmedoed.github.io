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
