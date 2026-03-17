const burgerMenu = document.querySelector('.burger-menu');
const mainNav = document.querySelector('.main-nav');
const body = document.body;
const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
const navSections = [...document.querySelectorAll('[data-nav-theme][id]')];
const expMetaItems = document.querySelectorAll('.exp-feature-meta');
const expFeatures = document.querySelectorAll('.exp-feature');
const revealItems = [...expMetaItems, ...expFeatures];
const heroStatValues = document.querySelectorAll('.hero-stat-value');
const projectVideoTriggers = document.querySelectorAll('[data-video-open]');
const projectVideoModal = document.getElementById('project-video-modal');
const projectVideoPlayer = document.getElementById('project-video-player');
const projectVideoFrame = document.getElementById('project-video-frame');
const projectVideoClose = document.querySelector('[data-video-close]');
const certificateTriggers = document.querySelectorAll('[data-certificate-open]');
const certificateModal = document.getElementById('certificate-modal');
const certificateModalImage = document.getElementById('certificate-modal-image');
const certificateModalClose = document.querySelector('[data-certificate-close]');
const previewVideos = document.querySelectorAll('video.project-video-thumb');
const projectYtVideo = document.querySelector('.project-yt-video');
const projectsSection = document.querySelector('.projects-section');
const accordionTriggers = document.querySelectorAll('.exp-accordion-trigger');
const sourceExpFeatures = document.querySelectorAll('.bento-section .exp-features > .exp-feature');
const accordionItems = document.querySelectorAll('.exp-accordion-item');
expMetaItems.forEach((item, index) => {
    item.style.setProperty('--exp-meta-reveal-delay', `${index * 260}ms`);
});

expFeatures.forEach((item, index) => {
    item.style.setProperty('--exp-reveal-delay', `${220 + index * 260}ms`);
});

const buildInlineExperienceHeaders = () => {
    const experienceItems = document.querySelectorAll('.bento-section .exp-features > .exp-feature-meta');

    experienceItems.forEach((meta) => {
        const feature = meta.nextElementSibling;
        if (!feature || !feature.classList.contains('exp-feature') || feature.querySelector('.exp-feature-inline-header')) {
            return;
        }

        const dateText = meta.querySelector('.exp-feature-date')?.textContent?.trim() || '';
        const companyText = meta.querySelector('.exp-feature-company')?.textContent?.trim() || '';

        if (!dateText && !companyText) {
            return;
        }

        const header = document.createElement('div');
        header.className = 'exp-feature-inline-header';

        const accent = document.createElement('span');
        accent.className = 'exp-feature-inline-header-accent';
        accent.setAttribute('aria-hidden', 'true');

        const row = document.createElement('div');
        row.className = 'exp-feature-inline-header-row';

        const date = document.createElement('span');
        date.className = 'exp-feature-inline-header-date';
        date.textContent = dateText;

        const sep = document.createElement('span');
        sep.className = 'exp-feature-inline-header-sep';
        sep.textContent = '|';
        sep.setAttribute('aria-hidden', 'true');

        const company = document.createElement('span');
        company.className = 'exp-feature-inline-header-company';
        company.textContent = companyText;

        row.append(date, sep, company);
        header.append(accent, row);
        feature.prepend(header);
    });
};

buildInlineExperienceHeaders();

if (burgerMenu && mainNav) {
    burgerMenu.addEventListener('click', () => {
        mainNav.classList.toggle('is-open');
        burgerMenu.classList.toggle('is-open');
    });
}

if (navLinks.length) {
    const setActiveLink = (hash) => {
        const hasMatchingLink = [...navLinks].some((link) => link.getAttribute('href') === hash);
        if (!hasMatchingLink) {
            return;
        }

        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === hash;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            setActiveLink(link.getAttribute('href'));
            mainNav?.classList.remove('is-open');
            burgerMenu?.classList.remove('is-open');
        });
    });

    if ('IntersectionObserver' in window && navSections.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const sectionId = entry.target.id;
                if (sectionId) {
                    setActiveLink(`#${sectionId}`);
                }

                const isLightSection = entry.target.dataset.navTheme === 'light';
                body.classList.toggle('is-light-bg', isLightSection);
            });
        }, {
            root: null,
            rootMargin: '-20% 0px -55% 0px',
            threshold: 0.01
        });

        navSections.forEach((section) => {
            sectionObserver.observe(section);
        });
    } else {
        setActiveLink('#o-mnie');
    }
}

if (revealItems.length) {
    if ('IntersectionObserver' in window) {
        body.classList.add('reveal-ready');

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -6% 0px'
        });

        revealItems.forEach((item) => {
            revealObserver.observe(item);
        });
    } else {
        revealItems.forEach((item) => {
            item.classList.add('is-visible');
        });
    }
}

if (heroStatValues.length) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const heroRevealDelay = 1000;

    const animateCounter = (el, duration = 1600) => {
        const target = Number(el.textContent.replace(/[^\d]/g, ''));
        if (!Number.isFinite(target) || target <= 0) {
            return;
        }

        const startTime = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = progress * progress * progress * (progress * (6 * progress - 15) + 10);
            const value = Math.round(target * eased);
            el.textContent = `+${value}`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    };

    const runCounters = () => {
        heroStatValues.forEach((el) => {
            if (el.dataset.counted === 'true') {
                return;
            }

            el.dataset.counted = 'true';

            if (prefersReducedMotion) {
                const target = Number(el.textContent.replace(/[^\d]/g, ''));
                el.textContent = `+${target}`;
                return;
            }

            window.setTimeout(() => {
                animateCounter(el);
            }, heroRevealDelay);
        });
    };

    runCounters();
}

if (previewVideos.length) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        previewVideos.forEach((video) => {
            const trigger = video.closest('.project-video-trigger');
            if (!trigger) {
                return;
            }

            trigger.addEventListener('mouseenter', () => {
                if (video.readyState >= 1 && video.currentTime < 1) {
                    video.currentTime = 1.2;
                }
                const playPromise = video.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(() => {});
                }
            });

            trigger.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
                video.load();
            });
        });
    }
}

if (projectYtVideo) {
    const clipStart = 6;

    projectYtVideo.addEventListener('loadedmetadata', () => {
        if (projectYtVideo.duration > clipStart) {
            projectYtVideo.currentTime = clipStart;
        }
    });

    projectYtVideo.addEventListener('ended', () => {
        projectYtVideo.currentTime = clipStart;
        const playPromise = projectYtVideo.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
    });
}

if (projectsSection) {
    if ('IntersectionObserver' in window) {
        const projectsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    projectsSection.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        projectsObserver.observe(projectsSection);
    } else {
        projectsSection.classList.add('is-visible');
    }
}

if (projectVideoModal && projectVideoPlayer && projectVideoTriggers.length) {
    const isYoutubeSource = (src) => /(?:youtube\.com|youtu\.be)/i.test(src || '');

    const openVideoModal = (src) => {
        if (!src) {
            return;
        }

        projectVideoModal.classList.add('is-open');
        projectVideoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (isYoutubeSource(src) && projectVideoFrame) {
            projectVideoPlayer.setAttribute('hidden', '');
            projectVideoPlayer.pause();
            projectVideoPlayer.removeAttribute('src');
            projectVideoPlayer.load();

            projectVideoFrame.removeAttribute('hidden');
            projectVideoFrame.src = src;
            return;
        }

        if (projectVideoFrame) {
            projectVideoFrame.setAttribute('hidden', '');
            projectVideoFrame.removeAttribute('src');
        }

        projectVideoPlayer.removeAttribute('hidden');
        projectVideoPlayer.src = src;

        const playPromise = projectVideoPlayer.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
    };

    const closeVideoModal = () => {
        projectVideoModal.classList.remove('is-open');
        projectVideoModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (projectVideoFrame) {
            projectVideoFrame.setAttribute('hidden', '');
            projectVideoFrame.removeAttribute('src');
        }

        projectVideoPlayer.pause();
        projectVideoPlayer.currentTime = 0;
        projectVideoPlayer.removeAttribute('hidden');
        projectVideoPlayer.removeAttribute('src');
        projectVideoPlayer.load();
    };

    projectVideoTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            openVideoModal(trigger.dataset.videoSrc);
        });
    });

    if (projectVideoClose) {
        projectVideoClose.addEventListener('click', closeVideoModal);
    }

    projectVideoModal.addEventListener('click', (event) => {
        if (event.target === projectVideoModal) {
            closeVideoModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && projectVideoModal.classList.contains('is-open')) {
            closeVideoModal();
        }
    });
}

if (certificateModal && certificateModalImage && certificateTriggers.length) {
    const openCertificateModal = (src, alt) => {
        if (!src) {
            return;
        }

        certificateModalImage.src = src;
        certificateModalImage.alt = alt || 'Podglad certyfikatu';
        certificateModal.classList.add('is-open');
        certificateModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeCertificateModal = () => {
        certificateModal.classList.remove('is-open');
        certificateModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        certificateModalImage.removeAttribute('src');
        certificateModalImage.alt = '';
    };

    certificateTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            openCertificateModal(trigger.dataset.certificateSrc, trigger.dataset.certificateAlt);
        });
    });

    if (certificateModalClose) {
        certificateModalClose.addEventListener('click', closeCertificateModal);
    }

    certificateModal.addEventListener('click', (event) => {
        if (event.target === certificateModal) {
            closeCertificateModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && certificateModal.classList.contains('is-open')) {
            closeCertificateModal();
        }
    });
}


if (accordionItems.length && sourceExpFeatures.length) {
    accordionItems.forEach((item) => {
        const sourceIndex = Number(item.dataset.sourceIndex);
        const panelContent = item.querySelector('.exp-accordion-panel-content');
        const sourceFeature = sourceExpFeatures[sourceIndex];

        if (!panelContent || !sourceFeature) {
            return;
        }

        const sourceContent = sourceFeature.querySelector('.exp-feature-content');
        if (!sourceContent) {
            return;
        }

        panelContent.replaceChildren(sourceContent.cloneNode(true));
    });
}

if (accordionTriggers.length) {
    const setOpenState = (trigger, panel, isOpen, animate = true) => {
        if (!panel) {
            return;
        }

        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        panel.classList.toggle('is-open', isOpen);

        if (!animate) {
            panel.hidden = !isOpen;
            panel.style.height = isOpen ? 'auto' : '0px';
            return;
        }

        if (isOpen) {
            panel.hidden = false;
            panel.style.height = '0px';
            const targetHeight = panel.scrollHeight;

            requestAnimationFrame(() => {
                panel.style.height = `${targetHeight}px`;
            });

            const onOpenEnd = (event) => {
                if (event.propertyName !== 'height') {
                    return;
                }
                panel.style.height = 'auto';
                panel.removeEventListener('transitionend', onOpenEnd);
            };

            panel.addEventListener('transitionend', onOpenEnd);
            return;
        }

        const startHeight = panel.scrollHeight;
        panel.style.height = `${startHeight}px`;
        requestAnimationFrame(() => {
            panel.style.height = '0px';
        });

        const onCloseEnd = (event) => {
            if (event.propertyName !== 'height') {
                return;
            }
            if (trigger.getAttribute('aria-expanded') === 'false') {
                panel.hidden = true;
            }
            panel.removeEventListener('transitionend', onCloseEnd);
        };

        panel.addEventListener('transitionend', onCloseEnd);
    };

    const toggleAccordion = (trigger) => {
        const panelId = trigger.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        accordionTriggers.forEach((item) => {
            if (item === trigger) {
                return;
            }

            const otherPanelId = item.getAttribute('aria-controls');
            const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
            if (item.getAttribute('aria-expanded') === 'true') {
                setOpenState(item, otherPanel, false, true);
            }
        });

        setOpenState(trigger, panel, !isExpanded, true);
    };

    accordionTriggers.forEach((trigger) => {
        const panelId = trigger.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        const shouldBeOpen = trigger.getAttribute('aria-expanded') === 'true';

        setOpenState(trigger, panel, shouldBeOpen, false);
        trigger.addEventListener('click', () => {
            toggleAccordion(trigger);
        });
    });
}


