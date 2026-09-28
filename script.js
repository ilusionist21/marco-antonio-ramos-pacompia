/* ═══════════════════════════════════════════════════════════════
   MARCO ANTONIO RAMOS PACOMPIA — CV PROFESIONAL
   Apple Pro & ChatGPT Dark Interactive Engine
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. Navbar Scroll Effect ─────────────────────────────────
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // ─── 2. Apple Dropdown Navigation ────────────────────────────
    const navToggle = document.getElementById('nav-toggle');
    const navDropdown = document.getElementById('nav-dropdown');
    const navBackdrop = document.getElementById('nav-backdrop');
    const navCloseBtn = document.getElementById('nav-close-btn');

    function openNav() {
        if (!navDropdown || !navToggle) return;
        navToggle.classList.add('is-active');
        navToggle.setAttribute('aria-expanded', 'true');
        navDropdown.classList.add('is-open');
        navDropdown.setAttribute('aria-hidden', 'false');
        if (navBackdrop) {
            navBackdrop.classList.add('is-active');
            navBackdrop.setAttribute('aria-hidden', 'false');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        if (!navDropdown || !navToggle) return;
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        navDropdown.classList.remove('is-open');
        navDropdown.setAttribute('aria-hidden', 'true');
        if (navBackdrop) {
            navBackdrop.classList.remove('is-active');
            navBackdrop.setAttribute('aria-hidden', 'true');
        }
        document.body.style.overflow = '';
    }

    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navDropdown && navDropdown.classList.contains('is-open');
            if (isOpen) {
                closeNav();
            } else {
                openNav();
            }
        });
    }

    if (navCloseBtn) {
        navCloseBtn.addEventListener('click', closeNav);
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeNav);
    }

    // Close the panel whenever the user clicks outside the menu or its toggle.
    document.addEventListener('pointerdown', (e) => {
        if (!navDropdown || !navDropdown.classList.contains('is-open')) return;
        const target = e.target;
        if (!navDropdown.contains(target) && !navToggle?.contains(target)) {
            closeNav();
        }
    });

    document.addEventListener('click', (e) => {
        if (!navDropdown || !navDropdown.classList.contains('is-open')) return;
        const target = e.target;
        if (!navDropdown.contains(target) && !navToggle?.contains(target)) {
            closeNav();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeNav();
            closeModal();
        }
    });

    // ─── 3. Active Page Highlighter in Menu ──────────────────────
    function setActivePageNav() {
        const currentPath = window.location.pathname;
        const page = currentPath.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-dropdown .nav-link, .nav-links .nav-link, .nav-primary-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            // Normalize comparison
            const linkFile = href.split('/').pop().split('#')[0];
            const activeFile = (page === '' || page === '/') ? 'index.html' : page;

            if (linkFile === activeFile) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else if (!href.includes(activeFile)) {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }

            // Close dropdown when navigating to an internal anchor on same page
            link.addEventListener('click', (e) => {
                if (href.startsWith('#')) {
                    closeNav();
                } else if (href.includes('.html')) {
                    closeNav();
                }
            });
        });
    }
    setActivePageNav();

    // ─── 3.5 Scroll reveal: animate sections only when they enter view ───
    // Activa el estado de motion antes de etiquetar los elementos para evitar
    // un frame visible antes de que comience su única animación.
    document.body.classList.add('motion-ready');

    const revealSelector = [
        '.brand-marquee',
        '.profile-accordion-section .accordion-item',
        '.page-main-content .page-breadcrumb',
        '.page-main-content .section-header',
        '.page-main-content .cert-filters',
        '.page-main-content .bento-card',
        '.page-main-content .cards-grid .design-card',
        '.page-main-content .recognition-showcase',
        '.page-main-content .cert-grid .cert-item',
        '.page-main-content .gallery-grid .gallery-card',
        '.page-main-content .timeline-card',
        '.page-main-content .skill-category-card',
        '.contact-cta-banner',
        'footer'
    ].join(',');
    const revealTargets = [...document.querySelectorAll(revealSelector)];

    revealTargets.forEach((target) => target.classList.add('scroll-reveal'));

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

        revealTargets.forEach((target) => revealObserver.observe(target));
    } else {
        revealTargets.forEach((target) => target.classList.add('is-visible'));
    }

    // ─── 3.6 Recognition showcase: rotating credential stories ───────
    const recognitionShowcase = document.getElementById('recognitionShowcase');
    const recognitionSlides = recognitionShowcase
        ? [...recognitionShowcase.querySelectorAll('.recognition-slide')]
        : [];
    const recognitionDots = recognitionShowcase
        ? [...recognitionShowcase.querySelectorAll('[data-recognition-go]')]
        : [];
    const recognitionCounter = document.getElementById('recognitionSlideCounter');
    const recognitionPrev = document.getElementById('recognitionPrev');
    const recognitionNext = document.getElementById('recognitionNext');
    let recognitionIndex = 0;
    let recognitionAutoplay = null;
    const recognitionAutoplayMs = 6200;

    function stopRecognitionAutoplay() {
        if (recognitionAutoplay) {
            clearInterval(recognitionAutoplay);
            recognitionAutoplay = null;
        }
    }

    function startRecognitionAutoplay() {
        stopRecognitionAutoplay();
        if (!recognitionShowcase || recognitionSlides.length < 2) return;
        recognitionAutoplay = setInterval(() => {
            setRecognitionSlide(recognitionIndex + 1, false);
        }, recognitionAutoplayMs);
    }

    function setRecognitionSlide(nextIndex, restartAutoplay = true) {
        if (!recognitionSlides.length) return;
        recognitionIndex = (nextIndex + recognitionSlides.length) % recognitionSlides.length;

        recognitionSlides.forEach((slide, index) => {
            const isActive = index === recognitionIndex;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });

        recognitionDots.forEach((dot, index) => {
            const isActive = index === recognitionIndex;
            dot.classList.toggle('is-active', isActive);
            dot.classList.toggle('is-complete', index < recognitionIndex);
            dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        if (recognitionCounter) {
            recognitionCounter.textContent = String(recognitionIndex + 1).padStart(2, '0');
        }
        if (restartAutoplay) startRecognitionAutoplay();
    }

    if (recognitionShowcase && recognitionSlides.length) {
        recognitionSlides.forEach((slide) => slide.setAttribute('aria-hidden', slide.classList.contains('is-active') ? 'false' : 'true'));
        recognitionDots.forEach((dot) => {
            dot.addEventListener('click', () => setRecognitionSlide(Number(dot.dataset.recognitionGo)));
        });
        recognitionPrev?.addEventListener('click', () => setRecognitionSlide(recognitionIndex - 1));
        recognitionNext?.addEventListener('click', () => setRecognitionSlide(recognitionIndex + 1));
        recognitionShowcase.addEventListener('mouseenter', stopRecognitionAutoplay);
        recognitionShowcase.addEventListener('mouseleave', startRecognitionAutoplay);
        recognitionShowcase.addEventListener('focusin', stopRecognitionAutoplay);
        recognitionShowcase.addEventListener('focusout', (event) => {
            if (!recognitionShowcase.contains(event.relatedTarget)) startRecognitionAutoplay();
        });
        recognitionShowcase.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                setRecognitionSlide(recognitionIndex - 1);
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                setRecognitionSlide(recognitionIndex + 1);
            }
        });
        startRecognitionAutoplay();
    }

    // ─── 4. Apple Pro Modal Sheet System ─────────────────────────
    const modal = document.getElementById('cardModal');
    const modalImg = document.getElementById('cardModalImg');
    const modalCarousel = document.getElementById('cardModalCarousel');
    const modalGallery = document.getElementById('cardModalGallery');
    const modalPrev = document.getElementById('cardModalPrev');
    const modalNext = document.getElementById('cardModalNext');
    const modalDots = document.getElementById('cardModalDots');
    const modalPH = document.getElementById('cardModalPlaceholder');
    const modalTitle = document.getElementById('cardModalTitle');
    const modalSub = document.getElementById('cardModalSub');
    const modalText = document.getElementById('cardModalText');
    const modalVerify = document.getElementById('cardModalVerify');
    const projectModalLink = document.getElementById('projectModalLink');
    const modalCloseBtn = document.getElementById('cardModalCloseBtn');

    let carouselIndex = 0;
    let carouselAutoplay = null;
    const carouselAutoplayMs = 4500;

    function stopCarouselAutoplay() {
        if (carouselAutoplay) {
            clearInterval(carouselAutoplay);
            carouselAutoplay = null;
        }
    }

    function startCarouselAutoplay() {
        stopCarouselAutoplay();
        if (!modalGallery || modalGallery.children.length < 2 || !modal?.classList.contains('active')) return;

        carouselAutoplay = setInterval(() => {
            carouselIndex = carouselIndex >= modalGallery.children.length - 1 ? 0 : carouselIndex + 1;
            syncCarousel();
        }, carouselAutoplayMs);
    }

    function syncCarousel() {
        if (!modalGallery) return;
        const total = modalGallery.children.length;
        if (!total) return;

        carouselIndex = Math.max(0, Math.min(carouselIndex, total - 1));
        modalGallery.scrollTo({
            left: carouselIndex * modalGallery.clientWidth,
            behavior: 'smooth'
        });

        const hasMultipleSlides = total > 1;
        if (modalPrev) modalPrev.disabled = !hasMultipleSlides;
        if (modalNext) modalNext.disabled = !hasMultipleSlides;
        if (modalDots) {
            [...modalDots.children].forEach((dot, index) => {
                dot.classList.toggle('is-active', index === carouselIndex);
                dot.setAttribute('aria-current', index === carouselIndex ? 'true' : 'false');
            });
        }
    }

    function buildCarouselDots(total) {
        if (!modalDots) return;
        modalDots.innerHTML = '';
        for (let index = 0; index < total; index += 1) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'card-modal-carousel-dot';
            dot.setAttribute('aria-label', `Ver foto ${index + 1}`);
            dot.addEventListener('click', () => {
                carouselIndex = index;
                syncCarousel();
                startCarouselAutoplay();
            });
            modalDots.appendChild(dot);
        }
    }

    function openModal(card) {
        if (!modal) return;

        const title = card.getAttribute('data-modal-title') || card.querySelector('h3, h4, .card-title')?.textContent || '';
        const sub   = card.getAttribute('data-modal-sub')   || card.querySelector('.card-badge, .card-year, .card-company')?.textContent || '';
        const text  = card.getAttribute('data-modal-text')  || card.querySelector('p, .card-desc')?.textContent || '';
        const img   = card.getAttribute('data-modal-img');
        const gallery = (card.getAttribute('data-modal-images') || '').split('|').map(path => path.trim()).filter(Boolean);
        const certUrl = card.getAttribute('data-cert-url');
        const projectUrl = card.getAttribute('data-modal-url');
        const projectUrlLabel = card.getAttribute('data-modal-url-label') || 'Abrir proyecto';

        if (modalTitle) modalTitle.textContent = title;
        if (modalSub)   modalSub.textContent   = sub;
        if (modalText)  modalText.textContent  = text;

        if (modalVerify) {
            if (certUrl) {
                modalVerify.href = certUrl;
                modalVerify.hidden = false;
            } else {
                modalVerify.removeAttribute('href');
                modalVerify.hidden = true;
            }
        }

        if (projectModalLink) {
            if (projectUrl) {
                projectModalLink.href = projectUrl;
                projectModalLink.innerHTML = `<i class="ph ph-arrow-up-right" aria-hidden="true"></i> ${projectUrlLabel}`;
                projectModalLink.hidden = false;
            } else {
                projectModalLink.removeAttribute('href');
                projectModalLink.hidden = true;
            }
        }

        if (modalGallery && gallery.length) {
            modalGallery.innerHTML = '';
            carouselIndex = 0;
            gallery.forEach((path, index) => {
                const image = document.createElement('img');
                image.src = path;
                image.alt = `${title} — captura ${index + 1}`;
                image.loading = 'lazy';
                modalGallery.appendChild(image);
            });
            buildCarouselDots(gallery.length);
            if (modalCarousel) modalCarousel.hidden = false;
            modalGallery.hidden = false;
            if (modalImg) {
                modalImg.src = '';
                modalImg.style.display = 'none';
            }
            if (modalPH) modalPH.classList.add('hidden');
        } else if (modalGallery) {
            modalGallery.innerHTML = '';
            modalGallery.hidden = true;
            if (modalCarousel) modalCarousel.hidden = true;
            if (modalDots) modalDots.innerHTML = '';
        }

        if (!gallery.length && modalImg && modalPH) {
            if (img && img.trim() !== '') {
                modalImg.src = img;
                modalImg.alt = title;
                modalImg.style.display = 'block';
                modalPH.classList.add('hidden');

                // Error fallback
                modalImg.onerror = () => {
                    modalImg.style.display = 'none';
                    modalPH.classList.remove('hidden');
                };
            } else {
                modalImg.src = '';
                modalImg.style.display = 'none';
                modalPH.classList.remove('hidden');
            }
        }

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (gallery.length) {
            syncCarousel();
            startCarouselAutoplay();
        }
    }

    function closeModal() {
        if (!modal) return;
        stopCarouselAutoplay();
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (modal) {
        if (modalPrev) {
            modalPrev.addEventListener('click', () => {
                carouselIndex = carouselIndex <= 0 ? modalGallery.children.length - 1 : carouselIndex - 1;
                syncCarousel();
                startCarouselAutoplay();
            });
        }
        if (modalNext) {
            modalNext.addEventListener('click', () => {
                carouselIndex = carouselIndex >= modalGallery.children.length - 1 ? 0 : carouselIndex + 1;
                syncCarousel();
                startCarouselAutoplay();
            });
        }
        if (modalGallery) {
            modalGallery.addEventListener('scroll', () => {
                const width = modalGallery.clientWidth;
                if (!width) return;
                carouselIndex = Math.round(modalGallery.scrollLeft / width);
                if (modalDots) {
                    [...modalDots.children].forEach((dot, index) => {
                        dot.classList.toggle('is-active', index === carouselIndex);
                        dot.setAttribute('aria-current', index === carouselIndex ? 'true' : 'false');
                    });
                }
            }, { passive: true });
        }
        if (modalCarousel) {
            modalCarousel.addEventListener('pointerdown', stopCarouselAutoplay);
            modalCarousel.addEventListener('pointerup', startCarouselAutoplay);
            modalCarousel.addEventListener('focusin', stopCarouselAutoplay);
            modalCarousel.addEventListener('focusout', startCarouselAutoplay);
        }

        // Attach click listeners to cards with data-modal
        document.querySelectorAll('[data-modal]').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicked an external link
                if (e.target.closest('a[target="_blank"]')) return;
                openModal(card);
            });
        });

        // Close button click
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }

        // Click outside modal box
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // ─── 5. Certification Filter Buttons (Pill Tabs) ─────────────
    const certFilters = document.querySelectorAll('.cert-filter-btn');
    const certItems = document.querySelectorAll('.cert-item');

    if (certFilters.length && certItems.length) {
        certFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter') || 'all';

                // Update active state
                certFilters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter cards
                certItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.classList.remove('filter-hidden');
                    } else {
                        item.classList.add('filter-hidden');
                    }
                });

                // Reinicia la entrada de las tarjetas visibles para que cada filtro
                // conserve la misma sensación de aparición que el scroll reveal.
                const visibleCerts = [...certItems].filter(item => !item.classList.contains('filter-hidden'));
                visibleCerts.forEach(item => item.classList.remove('is-visible'));
                requestAnimationFrame(() => {
                    visibleCerts.forEach(item => void item.offsetWidth);
                    requestAnimationFrame(() => {
                        visibleCerts.forEach(item => item.classList.add('is-visible'));
                    });
                });
            });
        });
    }

    // ─── 6. Terminal Line Typing (Hero on index.html) ─────────────
    const terminalLines = Array.from(document.querySelectorAll('.hero-terminal-line'));
    const typeSpeed = 20;
    const linePause = 240;

    function typeLine(lineElement, text) {
        return new Promise((resolve) => {
            lineElement.classList.add('typing');
            lineElement.textContent = '';
            let index = 0;

            function step() {
                if (index <= text.length) {
                    lineElement.textContent = text.slice(0, index);
                    index += 1;
                    setTimeout(step, typeSpeed);
                } else {
                    lineElement.classList.remove('typing');
                    setTimeout(resolve, linePause);
                }
            }
            step();
        });
    }

    async function runTerminalTyping() {
        for (const line of terminalLines) {
            const text = line.getAttribute('data-text') || '';
            await typeLine(line, text);
        }
    }

    if (terminalLines.length) {
        runTerminalTyping();
    }
});
