// Render age like "2 г. 3 мес." or "10 мес." into .cat-age elements.
// Uses data-birth="YYYY-MM-DD" on .cat-card.
function calcAge(iso) {
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

function renderCatCardAges(root = document) {
  root.querySelectorAll(".cat-card").forEach(card => {
    const el = card.querySelector(".cat-age");
    if (!el) return;
    const birth = card.getAttribute("data-birth");
    el.textContent = calcAge(birth);
  });
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", renderCatCardAges)
  : renderCatCardAges();
