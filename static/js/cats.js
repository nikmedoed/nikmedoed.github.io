document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.cat-banner'));
    if (!cards.length) return;

    const statusFilter = document.getElementById('status-filter');
    const yearFilter = document.getElementById('year-filter');

    cards.forEach(card => {
        const birth = card.dataset.birth;
        if (birth) {
            const [y, m] = birth.split('-').map(Number);
            card.dataset.year = String(y);
            const now = new Date();
            let years = now.getFullYear() - y;
            let months = now.getMonth() + 1 - m;
            if (months < 0) { years--; months += 12; }
            const total = years * 12 + months;
            let category = 'adult';
            if (total < 4) category = 'kitten';
            else if (total < 12) category = 'teen';
            card.dataset.category = category;
        }
    });

    if (yearFilter) {
        const years = [...new Set(cards.map(c => c.dataset.year))].sort().reverse();
        years.forEach(y => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.dataset.year = y;
            span.textContent = y;
            yearFilter.appendChild(span);
        });
    }

    function applyFilters() {
        const status = statusFilter ? (statusFilter.querySelector('.is-dark')?.dataset.status || 'all') : 'all';
        const year = yearFilter ? (yearFilter.querySelector('.is-dark')?.dataset.year || 'all') : 'all';
        cards.forEach(c => {
            const matchStatus =
                status === 'all' ||
                (status === 'sterilized' && c.dataset.sterilized === 'yes') ||
                (status === 'intact' && c.dataset.sterilized === 'no') ||
                (status === 'treatment' && c.dataset.treatment === 'yes');
            const matchYear = year === 'all' || c.dataset.year === year;
            c.parentElement.style.display = matchStatus && matchYear ? '' : 'none';
        });
    }

    function setActive(tag, container) {
        container.querySelectorAll('.tag').forEach(t => t.classList.remove('is-dark'));
        tag.classList.add('is-dark');
        applyFilters();
    }

    if (statusFilter) {
        statusFilter.addEventListener('click', e => {
            const tag = e.target.closest('.tag');
            if (!tag) return;
            setActive(tag, statusFilter);
        });
    }

    if (yearFilter) {
        yearFilter.addEventListener('click', e => {
            const tag = e.target.closest('.tag');
            if (!tag) return;
            setActive(tag, yearFilter);
        });
    }
    document.querySelectorAll('.cat-relative').forEach(tag => {
        tag.addEventListener('click', () => {
            const id = tag.dataset.target;
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({behavior: 'smooth', block: 'center'});
                el.classList.add('highlight');
                setTimeout(() => el.classList.remove('highlight'), 2000);
            }
        });
    });
});
