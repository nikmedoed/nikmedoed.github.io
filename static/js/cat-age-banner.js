// Render readable age like "2 г. 3 мес." (short but not tiny).
// Expects data-birth="YYYY-MM-DD" on .cat-banner.
function fmtAge(iso) {
  if (!iso) return "";
  const b = new Date(iso);
  if (isNaN(b)) return "";
  const n = new Date();
  let y = n.getFullYear() - b.getFullYear();
  let m = n.getMonth() - b.getMonth();
  let d = n.getDate() - b.getDate();
  if (d < 0) m--;
  if (m < 0) { y--; m += 12; }
  if (y <= 0) return `${m} мес.`;
  if (m <= 0) return `${y} г.`;
  return `${y} г. ${m} мес.`;
}

function renderBannerAges(root = document) {
  root.querySelectorAll('.cat-banner').forEach(card => {
    const birth = card.getAttribute('data-birth');
    const el = card.querySelector('.cat-age');
    if (el) el.textContent = fmtAge(birth);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderBannerAges);
} else {
  renderBannerAges();
}
