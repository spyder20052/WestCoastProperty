/**
 * WestCoast Property — Interactive System v2
 */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();

    initScrollRevelations();
    initNavbar();
    initNavIndicator();
    initNavSearch();
    initCounters();
    initChartBars();
    initCardInteractions();

    // Hero left side
    initHeroWordReveal();
    initLiveTicker();
    initHeroPills();
    initSearchPlaceholder();

    // Portfolio
    initSaveButtons();

    // Process timeline
    initTimelineFill();
});

/* ===========================
   SCROLL REVEAL
   =========================== */
function initScrollRevelations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ===========================
   NAVBAR SCROLL BEHAVIOR
   =========================== */
function initNavbar() {
    const navInner = document.querySelector('.nav-inner');
    if (!navInner) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            navInner.style.background = 'rgba(255, 255, 255, 0.97)';
            navInner.style.boxShadow = '0 8px 40px rgba(10,15,27,0.1)';
            navInner.style.padding = '8px 16px 8px 20px';
        } else {
            navInner.style.background = 'rgba(255, 255, 255, 0.88)';
            navInner.style.boxShadow = '0 4px 24px rgba(10,15,27,0.06)';
            navInner.style.padding = '10px 16px 10px 24px';
        }

        lastScroll = scrollY;
    }, { passive: true });
}

/* ===========================
   NAV SLIDING INDICATOR
   =========================== */
function initNavIndicator() {
    const navLinks = document.getElementById('navLinks');
    const indicator = document.getElementById('navIndicator');
    if (!navLinks || !indicator) return;

    const links = navLinks.querySelectorAll('[data-nav]');

    function moveIndicator(el) {
        const navRect = navLinks.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        indicator.style.opacity = '1';
        indicator.style.left = (rect.left - navRect.left) + 'px';
        indicator.style.width = rect.width + 'px';
    }

    // Init on active link
    const activeLink = navLinks.querySelector('.nav-link.active');
    if (activeLink) {
        // Slight delay to let layout settle
        requestAnimationFrame(() => moveIndicator(activeLink));
    }

    links.forEach(link => {
        link.addEventListener('mouseenter', () => moveIndicator(link));
        link.addEventListener('click', (e) => {
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            moveIndicator(link);
        });
    });

    navLinks.addEventListener('mouseleave', () => {
        const active = navLinks.querySelector('.nav-link.active');
        if (active) moveIndicator(active);
        else indicator.style.opacity = '0';
    });
}

/* ===========================
   NAVBAR SEARCH OVERLAY
   =========================== */
function initNavSearch() {
    const btn = document.getElementById('navSearchBtn');
    const overlay = document.getElementById('navSearchOverlay');
    const closeBtn = document.getElementById('searchCloseBtn');
    const input = document.getElementById('navSearchInput');
    if (!btn || !overlay) return;

    function open() {
        overlay.classList.add('active');
        setTimeout(() => input && input.focus(), 100);
    }

    function close() {
        overlay.classList.remove('active');
        if (input) input.value = '';
    }

    btn.addEventListener('click', () => {
        overlay.classList.contains('active') ? close() : open();
    });

    closeBtn && closeBtn.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            open();
        }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!overlay.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
            close();
        }
    });
}

/* ===========================
   ANIMATED COUNTERS
   =========================== */
function initCounters() {
    const counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || '';
            const format = el.dataset.format || '';
            const duration = 1600;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                const value = Math.round(eased * target);

                if (format === 'k') {
                    // e.g. 2800 → "2.8k"
                    el.textContent = (value / 1000).toFixed(1).replace('.0', '') + 'k';
                } else {
                    el.textContent = value.toLocaleString('fr-FR') + suffix;
                }

                if (progress < 1) requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
            observer.unobserve(el);
        });
    }, { threshold: 0.4 });

    counters.forEach(el => observer.observe(el));
}

/* ===========================
   STATS PROGRESS BARS
   =========================== */
function initStatsProgressBars() {
    const fills = document.querySelectorAll('.stat-progress-fill');
    if (!fills.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            // Stagger based on parent stat-item index
            const item = entry.target.closest('.stat-item');
            const delay = item ? (parseInt(item.dataset.index || 0) * 120) : 0;
            setTimeout(() => entry.target.classList.add('animated'), delay);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    fills.forEach(el => observer.observe(el));
}

/* ===========================
   CHART BAR REVEAL
   =========================== */
function initChartBars() {
    const charts = document.querySelectorAll('.mc-chart');
    if (!charts.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const bars = entry.target.querySelectorAll('.mc-bar');
            bars.forEach(bar => bar.classList.remove('mc-bar-init'));
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.6 });

    charts.forEach(chart => observer.observe(chart));
}

/* ===========================
   PROCESS TIMELINE FILL
   =========================== */
function initTimelineFill() {
    const fill = document.getElementById('timelineFill');
    const timeline = document.getElementById('processTimeline');
    if (!fill || !timeline) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            setTimeout(() => fill.classList.add('animated'), 200);
            observer.unobserve(timeline);
        });
    }, { threshold: 0.3 });

    observer.observe(timeline);
}

/* ===========================
   SAVE BUTTON TOGGLE
   =========================== */
function initSaveButtons() {
    document.querySelectorAll('.prop-save-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('saved');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    });
}

/* ===========================
   HERO H1 — WORD SPLIT REVEAL
   =========================== */
function initHeroWordReveal() {
    const h1 = document.querySelector('.hero-h1');
    if (!h1) return;

    // Collect child nodes before modifying
    const nodes = Array.from(h1.childNodes);
    h1.innerHTML = '';

    const allWordSpans = [];

    nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            const words = node.textContent.trim().split(/\s+/).filter(Boolean);
            words.forEach(word => {
                const span = document.createElement('span');
                span.className = 'h1-word';
                span.textContent = word + ' ';
                h1.appendChild(span);
                allWordSpans.push(span);
            });
        } else if (node.nodeName === 'BR') {
            h1.appendChild(document.createElement('br'));
        } else if (node.nodeName === 'SPAN') {
            // The gold serif span — wrap its text words too
            const inner = node.cloneNode(false);
            inner.className = node.className + ' h1-word';
            inner.textContent = node.textContent;
            h1.appendChild(inner);
            allWordSpans.push(inner);
        }
    });

    // Stagger delays
    allWordSpans.forEach((span, i) => {
        span.style.transitionDelay = `${0.05 + i * 0.12}s`;
    });

    // Trigger when h1 enters viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            // Small RAF to let layout settle
            requestAnimationFrame(() => {
                allWordSpans.forEach(span => span.classList.add('visible'));
            });
            observer.unobserve(h1);
        });
    }, { threshold: 0.2 });

    observer.observe(h1);
}

/* ===========================
   HERO LIVE TICKER
   =========================== */
function initLiveTicker() {
    const container = document.getElementById('liveMessages');
    if (!container) return;

    const msgs = container.querySelectorAll('.live-msg');
    if (msgs.length < 2) return;

    let current = 0;

    function next() {
        const prev = current;
        current = (current + 1) % msgs.length;

        msgs[prev].classList.remove('active');
        msgs[prev].classList.add('exit');

        setTimeout(() => msgs[prev].classList.remove('exit'), 450);

        msgs[current].classList.add('active');
    }

    setInterval(next, 3500);
}

/* ===========================
   HERO TYPE PILLS
   =========================== */
function initHeroPills() {
    const pills = document.querySelectorAll('.hero-pill');
    const input = document.getElementById('searchTypeInput');
    if (!pills.length || !input) return;

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const value = pill.dataset.fill;
            input.value = value;

            // Re-init lucide in case icons need refresh
            if (typeof lucide !== 'undefined') lucide.createIcons();

            // Brief focus flash on the search container
            const searchBox = document.getElementById('heroSearch');
            if (searchBox) {
                searchBox.classList.add('pill-filled');
                setTimeout(() => searchBox.classList.remove('pill-filled'), 600);
            }
        });
    });
}

/* ===========================
   SEARCH PLACEHOLDER CYCLING
   =========================== */
function initSearchPlaceholder() {
    const input = document.getElementById('searchTypeInput');
    if (!input) return;

    const placeholders = [
        'Villa, Penthouse...',
        'Maison de luxe...',
        'Appartement Premium...',
        'Résidence Privée...',
        'Villa bord de mer...',
    ];

    let i = 0;

    // Only cycle when input is empty and not focused
    setInterval(() => {
        if (document.activeElement === input || input.value) return;
        i = (i + 1) % placeholders.length;

        input.style.opacity = '0';
        input.style.transition = 'opacity 0.3s';

        setTimeout(() => {
            input.placeholder = placeholders[i];
            input.style.opacity = '1';
        }, 300);
    }, 2800);
}

/* ===========================
   CARD 3D HOVER INTERACTIONS
   =========================== */
function initCardInteractions() {
    const cards = document.querySelectorAll('.eco-card, .mini-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rx = (cy - y) / 55;
            const ry = (x - cx) / 55;

            card.style.transform = `translateY(-5px) perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) perspective(1200px) rotateX(0) rotateY(0)';
            card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.15s ease';
        });
    });
}
