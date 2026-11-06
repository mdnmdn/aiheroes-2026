/* ==========================================================
   PRESENTATION ENGINE
   Complete slide presentation system with theme support
   ========================================================== */

/* HTML Escape */
function esc(v) {
    return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escNl(v) { return esc(v).replace(/\n/g,'<br>'); }

/* Syntax Highlighting Helper */
function highlightCode(code, language) {
    if (typeof hljs !== 'undefined' && language) {
        try {
            const result = hljs.highlight(code, { language: language });
            return result.value;
        } catch (e) { /* fallback to escaped */ }
    }
    if (typeof hljs !== 'undefined' && !language) {
        try {
            const result = hljs.highlightAuto(code);
            return result.value;
        } catch (e) { /* fallback to escaped */ }
    }
    return esc(code);
}

function codeBlock(code, language) {
    const langClass = language ? ` language-${esc(language)}` : '';
    return `<pre class="code-block reveal"><code class="hljs${langClass}">${highlightCode(code, language)}</code></pre>`;
}

/* Layout Renderers */
function bulletList(items) {
    return `<ul class="bullet-list">${items.map(i => `<li class="reveal">${esc(String(i))}</li>`).join('')}</ul>`;
}

function strongList(items) {
    return `<ul class="bullet-list">${items.map(i => `<li class="reveal"><strong>${esc(i.term)}:</strong> ${esc(i.desc)}</li>`).join('')}</ul>`;
}

function noteP(s) {
    if (!s.note) return '';
    const bold  = s.note_bold  ? 'font-weight:700;'             : '';
    const small = s.note_size === 'small' ? 'font-size:var(--small-size);' : '';
    const isFull = s.layout === 'diagram' || s.graph || (s.columns && s.columns.some(c => c.graph));
    const extra = isFull ? 'margin-top:calc(var(--element-gap) + 1rem);' : '';
    return `<p class="reveal" style="margin-top:var(--content-gap);${extra}${bold}${small}">${esc(s.note)}</p>`;
}

function columnDiv(col) {
    let content = '';
    let bare = false;
    if (col.code) {
        content = codeBlock(col.code, col.language);
        bare = true;
    } else if (col.graph) {
        content = `<div class="mermaid-container"><pre class="mermaid">${esc(col.graph)}</pre></div>`;
        bare = true;
    } else if (col.image) {
        const imgTag = `<img src="${esc(col.image)}" alt="${esc(col.image_alt || '')}">`;
        content = `<div class="image-container">${col.link ? `<a href="${esc(col.link)}">${imgTag}</a>` : imgTag}</div>`;
        bare = true;
    } else if (col.badge && !col.items) {
        content = `<div style="display:flex;align-items:center;justify-content:center;height:100%"><div class="neon-badge" style="font-size:1.2rem;padding:2rem">${esc(col.badge)}</div></div>`;
        bare = true;
    } else if (col.items) {
        content = bulletList(col.items);
        if (col.badge) content += `<div class="neon-badge">${esc(col.badge)}</div>`;
    }
    const heading = col.h3 ? `<h3>${esc(col.h3)}</h3>` : '';
    const cls = bare ? 'reveal col-bare' : 'reveal';
    return `<div class="${cls}">${heading}${content}</div>`;
}

const RENDERERS = {
    'title': s => `
        <h1 class="reveal">${escNl(s.h1)}</h1>
        <div class="accent-line reveal"></div>
        ${s.subtitle ? `<div class="subtitle reveal">${esc(s.subtitle)}</div>` : ''}
        ${s.tagline  ? `<p class="tagline reveal">${esc(s.tagline)}</p>` : ''}
    `,
    'title-closing': s => s.image ? `
        <h1 class="reveal">${escNl(s.h1)}</h1>
        <div class="accent-line reveal"></div>
        <div class="two-column">
            <div class="col-bare reveal">
                ${s.items   ? bulletList(s.items) : ''}
                ${s.tagline ? `<p class="tagline reveal">${esc(s.tagline)}</p>` : ''}
            </div>
            <div class="col-bare reveal"><div class="image-container"><img src="${esc(s.image)}" alt="${esc(s.image_alt || '')}"></div></div>
        </div>
    ` : `
        <h1 class="reveal">${escNl(s.h1)}</h1>
        <div class="accent-line reveal"></div>
        ${s.items   ? bulletList(s.items) : ''}
        ${s.tagline ? `<p class="tagline reveal">${esc(s.tagline)}</p>` : ''}
    `,
    'bullets': s => `<h2 class="reveal">${esc(s.h2)}</h2>${bulletList(s.items)}`,
    'bullets-note': s => `<h2 class="reveal">${esc(s.h2)}</h2>${bulletList(s.items)}${noteP(s)}`,
    'bullets-badge': s => `<h2 class="reveal">${esc(s.h2)}</h2>${bulletList(s.items)}<div class="neon-badge reveal">${esc(s.badge)}</div>`,
    'bullets-badge-note': s => `<h2 class="reveal">${esc(s.h2)}</h2>${bulletList(s.items)}<div class="neon-badge reveal">${esc(s.badge)}</div>${noteP(s)}`,
    'bullets-strong': s => `<h2 class="reveal">${esc(s.h2)}</h2>${strongList(s.items)}`,
    'two-column': s => {
        const count = s.columns[0]?.items?.length || s.columns[1]?.items?.length || 0;
        const rowClass = count > 6 ? 'rows-many' : '';
        return `<h2 class="reveal">${esc(s.h2)}</h2><div class="two-column ${rowClass}">${s.columns.map(columnDiv).join('')}</div>${s.badge ? `<div class="neon-badge reveal" style="margin-top:var(--content-gap)">${esc(s.badge)}</div>` : ''}${noteP(s)}`;
    },
    'two-column-note': s => RENDERERS['two-column'](s),
    'code': s => `<h2 class="reveal">${esc(s.h2)}</h2>${codeBlock(s.code, s.language)}${s.note ? `<p class="reveal" style="margin-top:var(--element-gap);font-size:var(--small-size)">${esc(s.note)}</p>` : ''}`,
    'feature-grid': s => {
        const cardHtml = c => {
            const textClass = (c.text?.length ?? 0) > 55 ? 'text-small' : '';
            return `<div class="card reveal">${c.icon ? `<span class="card-icon">${esc(c.icon)}</span>` : ''}<h3>${esc(c.h3)}</h3><p class="${textClass}">${esc(c.text)}</p></div>`;
        };
        return `<h2 class="reveal">${esc(s.h2)}</h2><div class="feature-grid">${s.cards.map(c => c.link ? `<a href="${esc(c.link)}" class="card-link">${cardHtml(c)}</a>` : cardHtml(c)).join('')}</div>`;
    },
    'quote': s => `<blockquote class="quote reveal"><p>${esc(s.quote)}</p></blockquote>${s.attribution ? `<cite class="attribution reveal">${esc(s.attribution)}</cite>` : ''}<div class="accent-line reveal"></div>`,
    'image-right': s => RENDERERS['two-column']({ h2: s.h2, columns: [{ items: s.items }, { image: s.image, image_alt: s.image_alt }], note: s.note }),
    'image-left': s => RENDERERS['two-column']({ h2: s.h2, columns: [{ image: s.image, image_alt: s.image_alt }, { items: s.items }], note: s.note }),
    'fullpage': s => `
        ${s.h1 ? `<h1 class="reveal">${escNl(s.h1)}</h1>` : ''}
        ${s.h2 ? `<h2 class="reveal">${esc(s.h2)}</h2>` : ''}
        ${s.text ? `<p class="reveal">${escNl(s.text)}</p>` : ''}
        ${s.items ? bulletList(s.items) : ''}
        ${s.image ? `<div class="fullpage-image-wrap reveal"><img src="${esc(s.image)}" alt="${esc(s.image_alt || '')}"></div>` : ''}
        ${s.code ? codeBlock(s.code, s.language) : ''}
        ${s.badge ? `<div class="neon-badge reveal">${esc(s.badge)}</div>` : ''}
        ${s.note ? noteP(s) : ''}
    `,
    'kpis': s => {
        const kpiHtml = item => `<div class="kpi-card reveal"><div class="kpi-value">${esc(item.value)}</div><div class="kpi-label">${esc(item.label)}</div></div>`;
        return `${s.h2 ? `<h2 class="reveal">${esc(s.h2)}</h2>` : ''}<div class="kpis-grid">${s.items.map(kpiHtml).join('')}</div>${noteP(s)}`;
    },
    'steps': s => `<h2 class="reveal">${esc(s.h2)}</h2><ol class="step-list">${s.steps.map((st, i) => `<li class="step reveal"><span class="step-number">${i + 1}</span><div><h3>${esc(st.h3)}</h3><p>${esc(st.text)}</p></div></li>`).join('')}</ol>`,
    'section-divider': s => `<div class="accent-line reveal"></div><h2 class="reveal">${esc(s.h2)}</h2>${s.tagline ? `<p class="tagline reveal">${esc(s.tagline)}</p>` : ''}`,
    'stat-hero': s => `${s.label ? `<p class="reveal" style="font-size:var(--small-size);text-transform:uppercase;letter-spacing:0.1em">${esc(s.label)}</p>` : ''}<div class="stat-number reveal">${esc(s.stat)}</div>${s.description ? `<p class="reveal">${esc(s.description)}</p>` : ''}<div class="accent-line reveal"></div>`,
    /* Legacy aliases — map old layouts to unified two-column */
    'text-code-right': s => RENDERERS['two-column']({ h2: s.h2, columns: [{ items: s.items }, { code: s.code, language: s.language }], note: s.note }),
    'text-code-left': s => RENDERERS['two-column']({ h2: s.h2, columns: [{ code: s.code, language: s.language }, { items: s.items }], note: s.note }),
    'text-badge-right': s => RENDERERS['two-column']({ h2: s.h2, columns: [{ items: s.items }, { badge: s.badge }], note: s.note }),
    'text-badge-left': s => RENDERERS['two-column']({ h2: s.h2, columns: [{ badge: s.badge }, { items: s.items }], note: s.note }),
    'diagram': s => `<h2 class="reveal">${esc(s.h2)}</h2><div class="mermaid-container reveal"><pre class="mermaid">${esc(s.graph)}</pre></div>${s.note ? `<p class="reveal" style="margin-top:calc(var(--element-gap) + 1rem);font-size:var(--small-size)">${esc(s.note)}</p>` : ''}`,
};

const SLIDE_EXTRA_CLASS = {
    'title': 'title-slide', 'title-closing': 'title-slide', 'quote': 'quote-slide',
    'section-divider': 'divider-slide', 'stat-hero': 'stat-slide', 'fullpage': 'fullpage-slide',
};

function buildSlides(deck) {
    const container = document.getElementById('slides-container');
    const defaultLogo = deck.meta?.logo;
    container.innerHTML = deck.slides.map((slide, i) => {
        const renderer = RENDERERS[slide.layout];
        if (!renderer) { console.warn(`[slide ${i + 1}] Unknown layout: "${slide.layout}"`); return ''; }
        const extra = SLIDE_EXTRA_CLASS[slide.layout] || '';
        const cls   = extra ? `slide ${extra}` : 'slide';
        const idAttr = slide.id ? ` id="${esc(slide.id)}"` : '';

        // Handle logos
        const logoToUse = slide.logo || defaultLogo;
        const isTitle = ['title', 'title-closing'].includes(slide.layout);
        let logoHtml = '';
        if (logoToUse) {
            if (isTitle) {
                logoHtml = `<div class="logo-circle"><img src="${esc(logoToUse)}" alt="Logo" class="logo logo-large"></div>`;
            } else {
                logoHtml = `<div class="logo-small"><img src="${esc(logoToUse)}" alt="Logo" class="logo"></div>`;
            }
        }

        return `<section class="${cls}"${idAttr}>${logoHtml}<div class="slide-content">${renderer(slide)}</div></section>`;
    }).join('');
}

/* Slide Presentation Controller */
class SlidePresentation {
    constructor() {
        this.slides      = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        this.current     = 0;
        this.isEdit      = false;
        this.progressBar = document.getElementById('progressBar');
        this.prevSlide = null;

        // Build map of named slides (id -> index)
        this.namedSlides = {};
        Array.from(this.slides).forEach((slide, i) => {
            if (slide.id) {
                this.namedSlides[slide.id] = i;
            }
        });

        // Read initial slide from URL hash (supports #slide=3, #slide=slide-name, #slide=_last, #slide=_last-1)
        const hash = window.location.hash;
        let initialSlide = 0;

        if (hash) {
            const slideMatch = hash.match(/#slide=(.+)$/);
            if (slideMatch) {
                const param = slideMatch[1];
                if (param === '_last' || param === '_last-1') {
                    // Load last or last-1 visited from session storage
                    const lastId = param === '_last' ? this.getLastSlideId() : this.getPrevSlideId();
                    if (lastId !== null) {
                        // Try to find by id first, then by numeric index
                        if (this.namedSlides[lastId] !== undefined) {
                            initialSlide = this.namedSlides[lastId];
                        } else {
                            const num = parseInt(lastId, 10);
                            if (!isNaN(num) && num >= 0 && num < this.totalSlides) {
                                initialSlide = num;
                            }
                        }
                    }
                } else {
                    // Try numeric index first
                    const numIndex = parseInt(param, 10);
                    if (!isNaN(numIndex) && numIndex >= 0 && numIndex < this.totalSlides) {
                        initialSlide = numIndex;
                        this.prevSlide = 0;
                    } else if (this.namedSlides[param] !== undefined) {
                        // Try named slide
                        initialSlide = this.namedSlides[param];
                        this.prevSlide = 0;
                    }
                }
            }
        }

        this.setupObserver();
        this.lastKey = null;
        this.lastKeyTime = 0;
        this.setupKeys();
        this.setupTouch();
        this.setupNavDots();
        this.setupEditMode();
        this.setupResize();

        this.goTo(initialSlide);
    }

    getStorageKey() {
        return `presentation-last-${currentPresentationFile() || 'default'}`;
    }

    getLastSlideId() {
        try {
            const key = this.getStorageKey();
            const data = sessionStorage.getItem(key);
            return data || null;
        } catch (e) { 
            return null; 
        }
    }

    getPrevSlideId() {
        try {
            const key = this.getStorageKey() + '-prev';
            const data = sessionStorage.getItem(key);
            return data || null;
        } catch (e) { 
            return null; 
        }
    }

    saveLastSlideId() {
        try {
            const key = this.getStorageKey();
            const currentSlide = this.slides[this.current];
            const slideId = currentSlide?.id || String(this.current);
            sessionStorage.setItem(key, slideId);
            
            const prevKey = key + '-prev';
            const prevSlide = this.prevSlide !== null ? this.slides[this.prevSlide] : null;
            const prevId = prevSlide?.id || (prevSlide !== null ? String(this.prevSlide) : null);
            if (prevId) {
                sessionStorage.setItem(prevKey, prevId);
            }
        } catch (e) {}
    }

    goToLast() {
        const lastId = this.getLastSlideId();
        
        let targetIndex = null;
        if (lastId !== null) {
            if (this.namedSlides[lastId] !== undefined) {
                targetIndex = this.namedSlides[lastId];
            } else {
                const num = parseInt(lastId, 10);
                if (!isNaN(num) && num >= 0 && num < this.totalSlides) {
                    targetIndex = num;
                }
            }
        }
        
        if (targetIndex !== null && this.current !== targetIndex) {
            this.goTo(targetIndex);
        } else if (this.current > 0) {
            this.goTo(this.current - 1);
        }
    }

    handleHomeKey(key) {
        const now = Date.now();
        if (this.lastKey === key && (now - this.lastKeyTime) < 500) {
            window.location.href = presentationUrl(currentPresentationFile()) + '#slide=_last';
        } else {
            this.lastKey = key;
            this.lastKeyTime = now;
        }
    }

    reloadPresentation() {
        location.reload();
    }

    setupObserver() {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    const i = Array.from(this.slides).indexOf(e.target);
                    if (i >= 0) {
                        this.current = i;
                        this.updateUI();
                        // Show only current slide's logo-small
                        document.querySelectorAll('.logo-small').forEach(logo => {
                            logo.style.display = 'none';
                        });
                        const currentLogo = e.target.querySelector('.logo-small');
                        if (currentLogo) currentLogo.style.display = 'flex';
                    }
                }
            });
        }, { threshold: 0.3 });
        this.slides.forEach(s => obs.observe(s));
    }

    setupKeys() {
        document.addEventListener('keydown', e => {
            if (e.target.getAttribute('contenteditable')) return;
            if      (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); this.goTo(this.current + 1); }
            else if (e.key === 'ArrowLeft')                   { e.preventDefault(); this.goTo(this.current - 1); }
            else if (e.key === 'e' || e.key === 'E')          { e.preventDefault(); this.toggleEdit(); }
            else if (e.key === 'r' || e.key === 'R')          { e.preventDefault(); this.reloadPresentation(); }
            else if (e.key === 'l' || e.key === 'L')          { e.preventDefault(); this.goToLast(); }
            else if (e.key === 'h' || e.key === 'H')          { e.preventDefault(); this.handleHomeKey(e.key); }
            else if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (this.isEdit) this.exportFile(); }
            else if (e.key === 'f' || e.key === 'F') {
                const now = Date.now();
                if (this.lastKey === e.key && now - this.lastKeyTime < 400) {
                    e.preventDefault();
                    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
                    else document.exitFullscreen();
                }
            }
            this.lastKey = e.key;
            this.lastKeyTime = Date.now();
        });
    }

    setupTouch() {
        let x0 = 0;
        document.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; });
        document.addEventListener('touchend',   e => {
            const dx = e.changedTouches[0].clientX - x0;
            if      (dx < -50) this.goTo(this.current + 1);
            else if (dx >  50) this.goTo(this.current - 1);
        });
    }

    setupResize() {
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.slides[this.current].scrollIntoView({ behavior: 'instant' });
            }, 150);
        });
    }

    setupNavDots() {
        const nav = document.getElementById('navDots');
        nav.innerHTML = '';
        for (let i = 0; i < this.totalSlides; i++) {
            const d = document.createElement('div');
            d.className = 'nav-dot' + (i === 0 ? ' active' : '');
            d.addEventListener('click', () => this.goTo(i));
            nav.appendChild(d);
        }
    }

    updateUI() {
        this.progressBar.style.width = ((this.current + 1) / this.totalSlides * 100) + '%';
        document.querySelectorAll('.nav-dot').forEach((d, i) => d.classList.toggle('active', i === this.current));
    }

    goTo(i) {
        if (i >= 0 && i < this.totalSlides) {
            this.prevSlide = this.current;
            this.current = i;
            this.slides[i].scrollIntoView({ behavior: 'smooth' });
            this.updateUI();
            this.saveLastSlideId();
            // Update URL hash to preserve slide position (use named ID if available)
            // Don't show #slide=0 (first slide uses clean URL)
            if (i === 0) {
                window.location.hash = '';
            } else {
                const slide = this.slides[i];
                const hashValue = slide.id || i;
                window.location.hash = `slide=${hashValue}`;
            }
        }
    }

    setupEditMode() {
        // Check if edit mode is disabled globally
        const editModeDisabled = window.EDIT_MODE_ENABLED === false;
        if (editModeDisabled) {
            const toggle = document.getElementById('editToggle');
            if (toggle) toggle.style.display = 'none';
            return;
        }

        const toggle  = document.getElementById('editToggle');
        const hotzone = document.querySelector('.edit-hotzone');
        let hideT = null;
        const show = () => { clearTimeout(hideT); toggle.classList.add('show'); };
        const hide = () => { hideT = setTimeout(() => { if (!this.isEdit) toggle.classList.remove('show'); }, 400); };
        hotzone.addEventListener('mouseenter', show);
        hotzone.addEventListener('mouseleave', hide);
        toggle.addEventListener('mouseenter',  show);
        toggle.addEventListener('mouseleave',  hide);
        hotzone.addEventListener('click', () => this.toggleEdit());
        toggle.addEventListener('click',  () => this.toggleEdit());
    }

    toggleEdit() {
        // Prevent edit mode if globally disabled
        if (window.EDIT_MODE_ENABLED === false) return;

        this.isEdit = !this.isEdit;
        const toggle = document.getElementById('editToggle');
        const banner = document.getElementById('editBanner');
        const els    = document.querySelectorAll('h1,h2,h3,p,li,.subtitle,.tagline');
        document.body.classList.toggle('edit-active', this.isEdit);
        toggle.classList.toggle('active', this.isEdit);
        banner.classList.toggle('active', this.isEdit);
        els.forEach(el => this.isEdit ? el.setAttribute('contenteditable','true') : el.removeAttribute('contenteditable'));
    }

    exportFile() {
        const els = Array.from(document.querySelectorAll('[contenteditable]'));
        els.forEach(el => el.removeAttribute('contenteditable'));
        document.body.classList.remove('edit-active');
        document.getElementById('editToggle')?.classList.remove('active','show');
        document.getElementById('editBanner')?.classList.remove('active');

        const html = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
        const blob = new Blob([html], { type:'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'presentation.html';
        a.click();
        URL.revokeObjectURL(a.href);

        document.body.classList.add('edit-active');
        els.forEach(el => el.setAttribute('contenteditable','true'));
        document.getElementById('editToggle')?.classList.add('active');
        document.getElementById('editBanner')?.classList.add('active');
    }
}

/* Presentation selection
 * window.PRESENTATIONS (set in index.html) lists the decks shown in the menu:
 *   [{ title: 'Talk', file: 'talk.yaml' }, ...]
 * The current deck is resolved from ?presentation=, then sessionStorage, then
 * window.DEFAULT_PRESENTATION_FILE, and saved in sessionStorage so a reload or
 * a plain index.html keeps it. */
const CURRENT_PRESENTATION_KEY = 'presentation-current';

function storedPresentationFile() {
    try { return sessionStorage.getItem(CURRENT_PRESENTATION_KEY); } catch (e) { return null; }
}

function rememberPresentationFile(file) {
    try { if (file) sessionStorage.setItem(CURRENT_PRESENTATION_KEY, file); } catch (e) {}
}

function currentPresentationFile() {
    return new URLSearchParams(location.search).get('presentation')
        || storedPresentationFile()
        || window.DEFAULT_PRESENTATION_FILE
        || null;
}

function presentationUrl(file) {
    return file ? `index.html?presentation=${encodeURIComponent(file)}` : 'index.html';
}

function initPresentationPicker() {
    const list  = Array.isArray(window.PRESENTATIONS) ? window.PRESENTATIONS : [];
    const panel = document.getElementById('menuPanel');
    if (!panel || list.length === 0) return;

    const current = currentPresentationFile();
    const items = [Object.assign(document.createElement('div'), { className: 'menu-panel-label', textContent: 'Presentation' })];
    list.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'menu-opt presentation-opt' + (p.file === current ? ' active' : '');
        btn.dataset.presentation = p.file;
        btn.textContent = (p.file === current ? '▸ ' : '') + (p.title || p.file);
        btn.addEventListener('click', () => {
            panel.classList.remove('open');
            if (p.file === current) return;
            rememberPresentationFile(p.file);
            window.location.href = presentationUrl(p.file) + '#slide=_last';
        });
        items.push(btn);
    });
    items.push(Object.assign(document.createElement('div'), { className: 'menu-divider' }));

    // Insert before the Theme section
    const themeLabel = Array.from(panel.querySelectorAll('.menu-panel-label')).find(el => el.textContent.trim() === 'Theme');
    const anchor = themeLabel || null;
    items.forEach(el => panel.insertBefore(el, anchor));
}

/* Theme & Menu Switcher */
function initThemeSwitcher(defaultTheme, availableThemes) {
    const themeLink = document.getElementById('themeLink');
    const toggleBtn = document.getElementById('menuToggle');
    const panel     = document.getElementById('menuPanel');
    let particleAnim = null;

    const initial = localStorage.getItem('presentation-theme') || defaultTheme || 'launch-pad';
    applyTheme(initial);

    toggleBtn.addEventListener('click', e => { e.stopPropagation(); panel.classList.toggle('open'); });
    document.addEventListener('click',  e => { if (!e.target.closest('.general-menu')) panel.classList.remove('open'); });

    document.querySelectorAll('.menu-opt[data-theme]').forEach(btn => {
        btn.addEventListener('click', () => { applyTheme(btn.dataset.theme); panel.classList.remove('open'); });
    });

    document.querySelectorAll('.menu-opt[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'home') {
                window.location.href = presentationUrl(currentPresentationFile()) + '#slide=_last';
            } else if (action === 'refresh') {
                location.reload();
            } else if (action === 'last') {
                window.location.href = '#slide=_last';
            } else if (action === 'fullscreen') {
                toggleFullscreen();
            }
            panel.classList.remove('open');
        });
    });

    document.addEventListener('fullscreenchange', updateFullscreenBtn);

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    function updateFullscreenBtn() {
        const btn = document.getElementById('fullscreenBtn');
        if (btn) btn.textContent = document.fullscreenElement ? '✕ Exit Fullscreen' : '⛶ Fullscreen';
    }

    function applyTheme(id) {
        themeLink.href = `themes/theme-${id}.css`;
        localStorage.setItem('presentation-theme', id);
        document.querySelectorAll('.menu-opt[data-theme]').forEach(b => b.classList.toggle('active', b.dataset.theme === id));
        if (particleAnim) { cancelAnimationFrame(particleAnim); particleAnim = null; }
        setTimeout(() => {
            const canvas = document.getElementById('particleCanvas');
            if (getComputedStyle(canvas).display !== 'none') particleAnim = startParticles(canvas);
        }, 350);
    }
}

/* Particle System */
function startParticles(canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    const style = getComputedStyle(document.documentElement);
    const c1 = (style.getPropertyValue('--particle-c1') || '0,255,204').trim();
    const c2 = (style.getPropertyValue('--particle-c2') || '255,0,170').trim();

    const particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
        r:  Math.random() * 1.5 + 0.3, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        color: Math.random() > 0.45 ? c1 : c2, alpha: Math.random() * 0.5 + 0.1,
    }));

    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
            ctx.fill();
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x, dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(${p.color},${(1 - dist / 120) * 0.15})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        return requestAnimationFrame(draw);
    }
    return requestAnimationFrame(draw);
}

/* MAIN BOOTSTRAP */
async function init() {
    const loading   = document.getElementById('loading-screen');
    const errScreen = document.getElementById('error-screen');
    const errDetail = document.getElementById('errorDetail');
    const loadingLabel = document.getElementById('loadingLabel');

    function hideLoading() {
        loading.classList.add('hidden');
        setTimeout(() => loading.remove(), 450);
    }

    function showError(html) {
        hideLoading();
        errDetail.innerHTML = html;
        errScreen.classList.add('visible');
    }

    function render(deck) {
        if (!deck?.slides?.length) throw new Error('No slides found.');
        if (deck.meta?.title) document.title = deck.meta.title;
        buildSlides(deck);
        hideLoading();
        if (typeof mermaid !== 'undefined' && document.querySelector('.mermaid')) {
            mermaid.initialize({ startOnLoad: false, theme: 'dark', fontFamily: 'inherit', themeVariables: { darkMode: true, background: 'transparent', primaryColor: '#f0a020', primaryTextColor: '#f0f4ff', secondaryColor: '#00c8ff', tertiaryColor: '#ff4081', lineColor: '#00c8ff', fontSize: '24px', mainBkg: '#0c1830', nodeBorder: '#f0a020', clusterBkg: '#0c1830', clusterBorder: '#00c8ff', edgeLabelBackground: '#070e20' }, flowchart: { useMaxWidth: false, htmlLabels: true, padding: 20, nodeSpacing: 30, rankSpacing: 50 } });
            mermaid.run({ querySelector: '.mermaid' });
        }
        requestAnimationFrame(() => {
            initPresentationPicker();
            new SlidePresentation();
            const styleParam = new URLSearchParams(location.search).get('style');
            initThemeSwitcher(styleParam || deck.meta?.theme, deck.meta?.themes);
        });
    }

    try {
        const params = new URLSearchParams(location.search);
        let deck = null;

        /* 1. Try query parameter, then the deck saved in sessionStorage (HTTP only) */
        const presentationParam = params.get('presentation') || storedPresentationFile();
        if (presentationParam && location.protocol !== 'file:') {
            loadingLabel.textContent = `Loading ${presentationParam}…`;
            try {
                const res = await fetch(presentationParam + (presentationParam.includes('?') ? '&' : '?') + '_=' + Date.now());
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const yaml = await res.text();
                deck = jsyaml.load(yaml);
                rememberPresentationFile(presentationParam);
                console.log(`[init] Loaded from parameter: ${presentationParam}`);
            } catch (err) {
                console.warn(`[init] Parameter load failed, trying embedded...`, err);
            }
        }

        /* 2. Try embedded YAML */
        if (!deck && !window.DEFAULT_PRESENTATION_FILE) {
            const embedded = document.getElementById('defaultPresentation');
            if (embedded?.textContent?.trim()) {
                loadingLabel.textContent = 'Loading embedded presentation…';
                try {
                    deck = jsyaml.load(embedded.textContent);
                    console.log(`[init] Loaded embedded YAML`);
                } catch (err) {
                    console.warn(`[init] Embedded YAML parse failed`, err);
                }
            }
        }

        /* 3. Fallback to default file */
        if (!deck) {
            const defaultFile = window.DEFAULT_PRESENTATION_FILE || 'presentation.yaml';
            loadingLabel.textContent = `Loading ${defaultFile}…`;
            try {
                const res = await fetch(defaultFile + (defaultFile.includes('?') ? '&' : '?') + '_=' + Date.now());
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const yaml = await res.text();
                deck = jsyaml.load(yaml);
                rememberPresentationFile(defaultFile);
                console.log(`[init] Loaded default ${defaultFile}`);
            } catch (err) {
                throw new Error(`Could not load any presentation: ${err.message}`);
            }
        }

        render(deck);

    } catch (err) {
        console.error('[init] Error:', err);
        showError(`<strong>Failed to load presentation</strong>

Error: ${esc(err.message)}

<strong>Troubleshooting:</strong>
  • Embedded: Check <script type="application/x-yaml"> tag
  • File: Ensure presentation.yaml exists
  • Parameter: ?presentation=file.yaml (HTTP only)`);
    }
}

/* Start when js-yaml is ready */
if (window.jsyaml) {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}
