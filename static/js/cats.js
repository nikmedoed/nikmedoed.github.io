document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.cat-card'));
    if (!cards.length) return;

    const statusFilter = document.getElementById('status-filter');
    const yearFilter = document.getElementById('year-filter');
    let genderFilter = 'all';

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
            const matchGender = genderFilter === 'all' || c.dataset.gender === genderFilter;
            c.parentElement.style.display = matchStatus && matchYear && matchGender ? '' : 'none';
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

    const lang = document.documentElement.lang;
    const labels = {
        en: {y: 'y', m: 'm'},
        ru: {y: 'г.', m: 'мес.'}
    };

    cards.forEach(card => {
        const birth = card.dataset.birth;
        const ageSpan = card.querySelector('.cat-age');
        if (birth && ageSpan) {
            const [year, month] = birth.split('-').map(Number);
            const now = new Date();
            let y = now.getFullYear() - year;
            let m = now.getMonth() + 1 - month;
            if (m < 0) {
                y--;
                m += 12;
            }
            ageSpan.textContent = `${y} ${labels[lang].y} ${m} ${labels[lang].m}`;
        }
    });

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

    document.querySelectorAll('.cat-gender').forEach(icon => {
        icon.addEventListener('click', () => {
            const g = icon.dataset.gender;
            genderFilter = genderFilter === g ? 'all' : g;
            applyFilters();
        });
    });

    document.querySelectorAll('.cat-flag').forEach(flag => {
        flag.addEventListener('click', e => {
            e.preventDefault();
            flag.classList.toggle('tooltip-active');
        });
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('.cat-flag')) {
            document.querySelectorAll('.cat-flag.tooltip-active').forEach(f => f.classList.remove('tooltip-active'));
        }
    });

    document.querySelectorAll('.cat-ster-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            if (!statusFilter) return;
            const status = tag.dataset.status;
            const target = statusFilter.querySelector(`[data-status="${status}"]`);
            if (target) setActive(target, statusFilter);
        });
    });

    const emailModal = document.getElementById('email-modal');
    const subjectInput = document.getElementById('subject');
    const subjectField = subjectInput ? subjectInput.closest('.field') : null;
    const messageLabel = document.querySelector('label[for="message"]');
    const defaultMsgLabel = messageLabel ? messageLabel.textContent : '';
    const adoptSubjects = { en: 'I want to adopt', ru: 'Хочу забрать' };
    const adoptMsgLabels = { en: 'Your contacts and questions', ru: 'Ваши контакты и вопросы' };

    function resetForm() {
        if (subjectField) subjectField.classList.remove('is-hidden');
        if (messageLabel) messageLabel.textContent = defaultMsgLabel;
        if (subjectInput) subjectInput.value = '';
    }

    const form = document.getElementById('contact-form');
    if (form) form.addEventListener('reset', resetForm);
    if (emailModal) {
        const bg = emailModal.querySelector('.modal-background');
        const closeBtn = emailModal.querySelector('.modal-close');
        [bg, closeBtn].forEach(el => el && el.addEventListener('click', resetForm));
    }
    const emailBtn = document.getElementById('email-btn');
    if (emailBtn) emailBtn.addEventListener('click', resetForm);

    document.querySelectorAll('.adopt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            resetForm();
            const name = btn.dataset.name;
            if (subjectInput) subjectInput.value = `${adoptSubjects[lang]} ${name}`;
            if (subjectField) subjectField.classList.add('is-hidden');
            if (messageLabel) messageLabel.textContent = adoptMsgLabels[lang];
            if (emailModal) {
                emailModal.classList.add('is-active');
                document.documentElement.classList.add('is-clipped');
            }
        });
    });
});
