document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.cat-card'));
    if (!cards.length) return;

    const sterFilter = document.getElementById('filter-ster');
    const genderFilter = document.getElementById('filter-gender');
    const healthFilter = document.getElementById('filter-health');
    const tameFilter = document.getElementById('filter-tame');
    const yearFilter = document.getElementById('year-filter');
    const resetBtn = document.getElementById('filter-reset');

    const filters = { ster: null, gender: null, health: null, tame: null, years: [] };

    if (yearFilter) {
        const years = [...new Set(cards.map(c => c.dataset.year))].sort().reverse();
        years.forEach(y => {
            const span = document.createElement('span');
            span.className = 'tag is-light has-text-link';
            span.dataset.year = y;
            span.textContent = y;
            yearFilter.appendChild(span);
        });
    }

    function applyFilters() {
        cards.forEach(c => {
            const matchSter =
                !filters.ster ||
                (filters.ster === 'yes' && c.dataset.sterilized === 'yes') ||
                (filters.ster === 'no' && c.dataset.sterilized === 'no');
            const matchGender = !filters.gender || c.dataset.gender === filters.gender;
            const matchHealth =
                !filters.health ||
                (filters.health === 'healthy' && c.dataset.treatment === 'no');
            const matchTame =
                !filters.tame ||
                (filters.tame === 'yes' && c.dataset.wild === 'no' && c.dataset.wanderer === 'no');
            const matchYear = filters.years.length === 0 || filters.years.includes(c.dataset.year);
            c.parentElement.style.display = matchSter && matchGender && matchHealth && matchTame && matchYear ? '' : 'none';
        });
    }

    function setupSingleSelect(container, key, attr) {
        if (!container) return;
        container.addEventListener('click', e => {
            const tag = e.target.closest('.tag');
            if (!tag) return;
            const value = tag.dataset[attr];
            if (filters[key] === value) {
                filters[key] = null;
                tag.classList.remove('is-selected');
                if (!tag.classList.contains('is-light')) tag.classList.add('is-light');
            } else {
                filters[key] = value;
                container.querySelectorAll('.tag').forEach(t => {
                    t.classList.remove('is-selected');
                    if (!t.classList.contains('is-light')) t.classList.add('is-light');
                });
                tag.classList.add('is-selected');
                tag.classList.remove('is-light');
            }
            applyFilters();
        });
    }

    setupSingleSelect(sterFilter, 'ster', 'ster');
    setupSingleSelect(genderFilter, 'gender', 'gender');
    setupSingleSelect(healthFilter, 'health', 'health');
    setupSingleSelect(tameFilter, 'tame', 'tame');

    if (yearFilter) {
        yearFilter.addEventListener('click', e => {
            const tag = e.target.closest('.tag');
            if (!tag) return;
            const y = tag.dataset.year;
            const idx = filters.years.indexOf(y);
            if (idx > -1) {
                filters.years.splice(idx, 1);
                tag.classList.remove('is-selected', 'is-link');
                tag.classList.add('is-light', 'has-text-link');
            } else {
                filters.years.push(y);
                tag.classList.add('is-selected', 'is-link');
                tag.classList.remove('is-light', 'has-text-link');
            }
            applyFilters();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            filters.ster = filters.gender = filters.health = filters.tame = null;
            filters.years = [];
            document.querySelectorAll('#cat-filters .tag').forEach(tag => {
                if (tag === resetBtn) return;
                tag.classList.remove('is-selected', 'is-link');
                if (tag.parentElement && tag.parentElement.id === 'year-filter') {
                    tag.classList.add('has-text-link');
                }
                if (!tag.classList.contains('is-light')) tag.classList.add('is-light');
            });
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

    cards.forEach(card => {
        const img = card.querySelector('img.cat-photo');
        if (!img) return;
        img.addEventListener('click', () => {
            const id = card.id.replace('cat-', '');
            location.href = `gallery/?id=${id}`;
        });
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
            filters.gender = filters.gender === g ? null : g;
            if (genderFilter) {
                genderFilter.querySelectorAll('.tag').forEach(t => {
                    t.classList.remove('is-selected');
                    if (!t.classList.contains('is-light')) t.classList.add('is-light');
                });
                if (filters.gender) {
                    const tag = genderFilter.querySelector(`[data-gender="${filters.gender}"]`);
                    if (tag) {
                        tag.classList.add('is-selected');
                        tag.classList.remove('is-light');
                    }
                }
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
            if (!target) return;
            if (filters.ster === status) {
                filters.ster = null;
                target.classList.remove('is-selected');
                if (!target.classList.contains('is-light')) target.classList.add('is-light');
            } else {
                filters.ster = status;
                sterFilter.querySelectorAll('.tag').forEach(t => {
                    t.classList.remove('is-selected');
                    if (!t.classList.contains('is-light')) t.classList.add('is-light');
                });
                target.classList.add('is-selected');
                target.classList.remove('is-light');
            }
            applyFilters();
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
