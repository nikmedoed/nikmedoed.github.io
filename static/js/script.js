document.addEventListener('DOMContentLoaded', () => {
    function trackEvent(name, label = '') {
        if (typeof gtag === 'function') {
            gtag('event', name, { event_category: 'interaction', event_label: label });
        }
        if (typeof ym === 'function') {
            ym(103383232, 'reachGoal', name);
        }
    }
    const currentLang = document.documentElement.lang;
    const baseAttr = document.documentElement.dataset.base || '/';
    const basePath = baseAttr.replace(/\/$/, '');
    const storedLang = localStorage.getItem('lang');
    const translations = {
        en: {all: 'All', sent: 'Message sent!', fail: 'Failed to send message.'},
        ru: {all: 'Все', sent: 'Сообщение отправлено!', fail: 'Не удалось отправить сообщение.'}
    };
    let lastScroll = window.scrollY;
    if (!storedLang) {
        const navLang = (navigator.languages && navigator.languages[0]) || navigator.language || '';
        if (navLang.startsWith('ru') && currentLang === 'en') {
            const newPath = basePath + '/ru' + location.pathname.slice(basePath.length) + location.search + location.hash;
            localStorage.setItem('lang', 'ru');
            location.replace(newPath);
            return;
        }
    }
    document.querySelectorAll('.lang-switch').forEach(btn => {
        btn.addEventListener('click', () => {
            localStorage.setItem('lang', btn.dataset.lang);
        });
    });
    const $navbarBurgers = Array.from(document.querySelectorAll('.navbar-burger'));
    if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
                const nav = document.querySelector('.navbar');
                if (nav) {
                    nav.classList.remove('hidden');
                    lastScroll = window.scrollY;
                }
            });
        });
    }

    const $navbarItems = Array.from(document.querySelectorAll('#navbarMenu .navbar-item'));
    if ($navbarItems.length > 0) {
        $navbarItems.forEach(item => {
            item.addEventListener('click', () => {
                const burger = document.querySelector('.navbar-burger');
                const menu = document.getElementById('navbarMenu');
                if (burger && menu && burger.classList.contains('is-active')) {
                    burger.classList.remove('is-active');
                    menu.classList.remove('is-active');
                }
                const nav = document.querySelector('.navbar');
                if (nav) {
                    nav.classList.remove('hidden');
                    lastScroll = window.scrollY;
                }
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
        let storedTheme;
        try {
            storedTheme = localStorage.getItem('theme');
        } catch (e) {
            storedTheme = null;
        }
        applyTheme(storedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
        themeBtn.addEventListener('click', () => {
            const current = root.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            if (storedTheme !== newTheme) {
                try {
                    localStorage.setItem('theme', newTheme);
                    storedTheme = newTheme;
                } catch (e) {}
            }
            applyTheme(newTheme);
        });
    }

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            const burger = document.querySelector('.navbar-burger');
            if (burger && burger.classList.contains('is-active')) {
                navbar.classList.remove('hidden');
                return;
            }
            const current = window.scrollY;
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
        const allLabel = (translations[currentLang] && translations[currentLang].all) || 'All';
        filterBar.innerHTML = `<span class="tag filter-tag is-dark" data-tech="all">${allLabel}</span>`;
        Object.keys(counts).sort((a, b) => counts[b] - counts[a]).forEach(t => {
            const s = document.createElement('span');
            s.className = `tag filter-tag has-text-dark ${colors[t]}`;
            s.dataset.tech = t;
            s.textContent = t;
            filterBar.appendChild(s);
        });
        filterBar.addEventListener('click', e => {
            const tgt = e.target.closest('.filter-tag');
            if (!tgt) return;
            const tech = tgt.dataset.tech;
            trackEvent('tag_click', tech);
            filterBar.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('is-dark'));
            tgt.classList.add('is-dark');
            cards.forEach(c => {
                const techs = c.dataset.techs.split(',');
                c.closest('.column').style.display = tech === 'all' || techs.includes(tech) ? '' : 'none';
            });
        });

        document.querySelectorAll('.project-tag').forEach(tag => {
            tag.classList.add('filter-tag', 'has-text-dark');
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
            trackEvent('support_click', 'copy');
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

    document.querySelectorAll('.support-box .buttons .button').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('support_click', btn.textContent.trim());
        });
    });

    document.querySelectorAll('a[href*="t.me"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('telegram_click');
        });
    });

    const notifyContainer = document.getElementById('notification-container');

    function showNotification(key, type = 'is-success') {
        if (!notifyContainer) return;
        const lang = document.documentElement.lang;
        const msg = (translations[lang] && translations[lang][key]) || key;
        const note = document.createElement('div');
        note.className = `notification ${type}`;
        note.textContent = msg;
        notifyContainer.appendChild(note);
        setTimeout(() => note.remove(), 3000);
    }

    const form = document.getElementById('contact-form');
    const sendBtn = document.getElementById('send-btn');
    const emailBtn = document.getElementById('email-btn');
    const emailModal = document.getElementById('email-modal');
    if (emailBtn && emailModal) {
        const closeModal = () => {
            emailModal.classList.remove('is-active');
            document.documentElement.classList.remove('is-clipped');
        };
        emailBtn.addEventListener('click', () => {
            trackEvent('email_click');
            emailModal.classList.add('is-active');
            document.documentElement.classList.add('is-clipped');
        });
        emailModal.querySelector('.modal-background').addEventListener('click', closeModal);
        emailModal.querySelector('.modal-close').addEventListener('click', closeModal);
    }
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            if (sendBtn) {
                sendBtn.classList.add('is-loading');
                sendBtn.disabled = true;
            }
            const data = {
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            fetch("https://script.google.com/macros/s/AKfycbzlupb8JGBgQpClUJOMk3y8_ZfMzmQSV4zqf3KlxtwPlXqkdoBmvurL_Bcln2adh9_n/exec", {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(() => {
                showNotification('sent', 'is-success');
                form.reset();
            }).catch(() => {
                showNotification('fail', 'is-danger');
            }).finally(() => {
                if (sendBtn) {
                    sendBtn.classList.remove('is-loading');
                    sendBtn.disabled = false;
                }
                if (emailModal) {
                    emailModal.classList.remove('is-active');
                    document.documentElement.classList.remove('is-clipped');
                }
            });
        });
    }
});
