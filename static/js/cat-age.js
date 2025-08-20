/* Compute and render age like "2 y 3 m" or "10 m".
   Keep it short to preserve compact layout.
   Expects data-birth="YYYY-MM-DD" (ISO) on .cat-card.
*/
function humanAgeShort(birthIso) {
  if (!birthIso) return "";
  const birth = new Date(birthIso);
  if (Number.isNaN(birth.getTime())) return "";

  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) { months -= 1; }
  if (months < 0) { years -= 1; months += 12; }

  if (years <= 0) return `${months} мес.`;
  if (months <= 0) return `${years} г.`;
  return `${years} г. ${months} мес.`;
}

function renderCatAges(root = document) {
  const cards = root.querySelectorAll(".cat-card");
  cards.forEach(card => {
    const birth = card.getAttribute("data-birth");
    const ageEl = card.querySelector(".cat-age");
    if (ageEl) ageEl.textContent = humanAgeShort(birth);
  });
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => renderCatAges());
} else {
  renderCatAges();
}
