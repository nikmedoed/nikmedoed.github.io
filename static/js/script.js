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
        const storedTheme = localStorage.getItem('theme');
        applyTheme(storedTheme || 'dark');
        themeBtn.addEventListener('click', () => {
            const current = root.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    const navbar = document.querySelector('.navbar');
    let lastScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (navbar) {
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
    }

    const cards = document.querySelectorAll('.project-card');
    const counts = {};
    const colors = {};
    cards.forEach(card => {
        const tagEls = card.querySelectorAll('.tags .tag');
        const tags = Array.from(tagEls).map(t => {
            const text = t.textContent.trim();
            if (!colors[text]) {
                const cls = Array.from(t.classList).filter(c => c !== 'tag').join(' ');
                colors[text] = cls;
            }
            counts[text] = (counts[text] || 0) + 1;
            return text;
        });
        card.dataset.techs = tags.join(',');
    });

    const filterBar = document.getElementById('tech-filter');
    if (filterBar) {
        filterBar.innerHTML = '<span class="tag filter-tag is-dark" data-tech="all">All</span>';
        Object.keys(counts).sort((a, b) => counts[b] - counts[a]).forEach(t => {
            const s = document.createElement('span');
            s.className = `tag filter-tag ${colors[t]}`;
            s.dataset.tech = t;
            s.textContent = t;
            filterBar.appendChild(s);
        });
        filterBar.addEventListener('click', e => {
            const tgt = e.target.closest('.filter-tag');
            if (!tgt) return;
            const tech = tgt.dataset.tech;
            filterBar.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('is-dark'));
            tgt.classList.add('is-dark');
            cards.forEach(c => {
                const techs = c.dataset.techs.split(',');
                c.closest('.column').style.display = tech === 'all' || techs.includes(tech) ? '' : 'none';
            });
        });

        document.querySelectorAll('.project-tag').forEach(tag => {
            tag.classList.add('filter-tag');
            tag.addEventListener('click', () => {
                const tech = tag.dataset.tech;
                const target = filterBar.querySelector(`[data-tech="${tech}"]`);
                if (target) target.click();
            });
        });
    }

    const overlay = document.getElementById('preview-overlay');
    const preview = document.getElementById('media-preview');
    const closeBtn = document.getElementById('close-preview');

    function show(media, modal = false) {
        preview.innerHTML = '';
        const clone = media.cloneNode(true);
        if (clone.tagName === 'VIDEO') {
            clone.muted = true;
            clone.autoplay = true;
            clone.loop = true;
            clone.playsInline = true;
        }
        preview.appendChild(clone);
        overlay.classList.add('active');
        overlay.classList.toggle('modal', modal);
        if (modal) {
            document.body.classList.add('no-scroll');
        }
    }

    function hide() {
        overlay.classList.remove('active', 'modal');
        preview.innerHTML = '';
        document.body.classList.remove('no-scroll');
    }

    document.querySelectorAll('.project-media').forEach(box => {
        const media = box.querySelector('img, video');
        box.addEventListener('mouseenter', () => show(media));
        box.addEventListener('click', (e) => {
            e.preventDefault();
            show(media, true);
        });
        box.addEventListener('mouseleave', () => {
            if (!overlay.classList.contains('modal')) hide();
        });
    });

    if (overlay) {
        overlay.addEventListener('click', e => {
            if (e.target === overlay || e.target === closeBtn) hide();
        });
    }

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.clipboardText;
            if (!text) return;
            navigator.clipboard.writeText(text).then(() => {
                const icon = btn.querySelector('i');
                if (icon) icon.className = 'fas fa-check';
                setTimeout(() => {
                    if (icon) icon.className = 'fas fa-copy';
                }, 1500);
            });
        });
    });

    const notifyContainer = document.getElementById('notification-container');

    function showNotification(msg, type = 'is-success') {
        if (!notifyContainer) return;
        const note = document.createElement('div');
        note.className = `notification ${type}`;
        note.textContent = msg;
        notifyContainer.appendChild(note);
        setTimeout(() => note.remove(), 3000);
    }

    const form = document.getElementById('contact-form');
    const emailBtn = document.getElementById('email-btn');
    const emailModal = document.getElementById('email-modal');
    if (emailBtn && emailModal) {
        const closeModal = () => {
            emailModal.classList.remove('is-active');
            document.documentElement.classList.remove('is-clipped');
        };
        emailBtn.addEventListener('click', () => {
            emailModal.classList.add('is-active');
            document.documentElement.classList.add('is-clipped');
        });
        emailModal.querySelector('.modal-background').addEventListener('click', closeModal);
        emailModal.querySelector('.modal-close').addEventListener('click', closeModal);
    }
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const data = {
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            const url = window.CONTACT_SCRIPT_URL || '';
            fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(() => {
                showNotification('Message sent!', 'is-success');
                form.reset();
            }).catch(() => {
                showNotification('Failed to send message.', 'is-danger');
            }).finally(() => {
                if (emailModal) {
                    emailModal.classList.remove('is-active');
                    document.documentElement.classList.remove('is-clipped');
                }
            });
        });
    }
});
