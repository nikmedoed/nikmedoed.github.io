// Minimal age renderer. Expects data-birth="YYYY-MM-DD" on .cat-hcard.
// Keeps age short: "2 г. 3 мес.", "10 мес."
function ageShort(iso) {
  if (!iso) return "";
  const b = new Date(iso);
  if (isNaN(b)) return "";
  const n = new Date();
  let y = n.getFullYear() - b.getFullYear();
  let m = n.getMonth() - b.getMonth();
  let d = n.getDate() - b.getDate();
  if (d < 0) m -= 1;
  if (m < 0) { y -= 1; m += 12; }
  if (y <= 0) return `${m} мес.`;
  if (m <= 0) return `${y} г.`;
  return `${y} г. ${m} мес.`;
}
function renderAges(root = document) {
  root.querySelectorAll(".cat-hcard").forEach(card => {
    const birth = card.getAttribute("data-birth");
    const el = card.querySelector(".cat-age");
    if (el) el.textContent = ageShort(birth);
  });
}
document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", renderAges)
  : renderAges();
