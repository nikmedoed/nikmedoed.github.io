document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.cat-card'));
    if (!cards.length) return;

    const sterFilter = document.getElementById('filter-ster');
    const genderFilter = document.getElementById('filter-gender');
    const healthFilter = document.getElementById('filter-health');
    const wildFilter = document.getElementById('filter-wild');
    const yearFilter = document.getElementById('year-filter');

    const filters = { ster: 'all', gender: 'all', health: 'all', wild: 'all', year: 'all' };

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
        cards.forEach(c => {
            const matchSter =
                filters.ster === 'all' ||
                (filters.ster === 'yes' && c.dataset.sterilized === 'yes') ||
                (filters.ster === 'no' && c.dataset.sterilized === 'no');
            const matchGender = filters.gender === 'all' || c.dataset.gender === filters.gender;
            const matchHealth =
                filters.health === 'all' ||
                (filters.health === 'healthy' && c.dataset.treatment === 'no') ||
                (filters.health === 'care' && c.dataset.treatment === 'yes');
            const matchWild =
                filters.wild === 'all' ||
                (filters.wild === 'wild' && c.dataset.wild === 'yes') ||
                (filters.wild === 'tame' && c.dataset.wild === 'no');
            const matchYear = filters.year === 'all' || c.dataset.year === filters.year;
            c.parentElement.style.display = matchSter && matchGender && matchHealth && matchWild && matchYear ? '' : 'none';
        });
    }

    function setActive(tag, container) {
        container.querySelectorAll('.tag').forEach(t => {
            t.classList.remove('is-selected');
            if (!t.classList.contains('is-dark')) t.classList.add('is-light');
        });
        tag.classList.add('is-selected');
        tag.classList.remove('is-light');
    }

    if (sterFilter) {
        sterFilter.addEventListener('click', e => {
            const tag = e.target.closest('.tag');
            if (!tag) return;
            filters.ster = tag.dataset.ster;
            setActive(tag, sterFilter);
            applyFilters();
        });
    }

    if (genderFilter) {
        genderFilter.addEventListener('click', e => {
            const tag = e.target.closest('.tag');
            if (!tag) return;
            filters.gender = tag.dataset.gender;
            setActive(tag, genderFilter);
            applyFilters();
        });
    }

    if (healthFilter) {
        healthFilter.addEventListener('click', e => {
            const tag = e.target.closest('.tag');
            if (!tag) return;
            filters.health = tag.dataset.health;
            setActive(tag, healthFilter);
            applyFilters();
        });
    }

    if (wildFilter) {
        wildFilter.addEventListener('click', e => {
            const tag = e.target.closest('.tag');
            if (!tag) return;
            filters.wild = tag.dataset.wild;
            setActive(tag, wildFilter);
            applyFilters();
        });
    }

    if (yearFilter) {
        yearFilter.addEventListener('click', e => {
            const tag = e.target.closest('.tag');
            if (!tag) return;
            filters.year = tag.dataset.year;
            setActive(tag, yearFilter);
            applyFilters();
        });
    }

    applyFilters();

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
            filters.gender = filters.gender === g ? 'all' : g;
            if (genderFilter) {
                const tag = genderFilter.querySelector(`[data-gender="${filters.gender}"]`) || genderFilter.querySelector('[data-gender="all"]');
                setActive(tag, genderFilter);
            }
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
            if (!sterFilter) return;
            const status = tag.dataset.status === 'sterilized' ? 'yes' : 'no';
            const target = sterFilter.querySelector(`[data-ster="${status}"]`);
            if (target) {
                filters.ster = status;
                setActive(target, sterFilter);
                applyFilters();
            }
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
