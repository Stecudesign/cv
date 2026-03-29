const burgerMenu = document.querySelector('.burger-menu');
const mainNav = document.querySelector('.main-nav');
const menuCloseButton = document.querySelector('.menu-close');
const body = document.body;
const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
const navSections = [...document.querySelectorAll('[data-nav-theme][id]')];
const expMetaItems = document.querySelectorAll('.exp-feature-meta');
const expFeatures = document.querySelectorAll('.exp-feature');
const aboutRevealItems = [...document.querySelectorAll('.about-highlight__copy, .about-highlight__card')];
const revealItems = [...expMetaItems, ...expFeatures, ...aboutRevealItems];
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
const certSectionIntro = document.querySelector('.cert-section__intro');
const certCards = document.querySelectorAll('.cert-card');
const toolsSection = document.querySelector('.tools-section');
const toolsHead = document.querySelector('.tools-head');
const toolRows = [...document.querySelectorAll('.tools-row')];
const toolPills = [...document.querySelectorAll('.tools-pill')];
const interestCards = document.querySelectorAll('.interest-card');
const accordionTriggers = document.querySelectorAll('.exp-accordion-trigger');
const sourceExpFeatures = document.querySelectorAll('.bento-section .exp-features > .exp-feature');
const accordionItems = document.querySelectorAll('.exp-accordion-item');
expMetaItems.forEach((item, index) => {
    item.style.setProperty('--exp-meta-reveal-delay', `${index * 145}ms`);
});

expFeatures.forEach((item, index) => {
    item.style.setProperty('--exp-reveal-delay', `${110 + index * 145}ms`);
});

aboutRevealItems.forEach((item, index) => {
    item.style.setProperty('--about-reveal-delay', `${120 + index * 140}ms`);
});

toolRows.forEach((row, rowIndex) => {
    const rowDelay = rowIndex * 100;
    row.style.setProperty('--tools-row-delay', `${rowDelay}ms`);

    [...row.querySelectorAll('.tools-pill')].forEach((pill, pillIndex) => {
        pill.style.setProperty('--tools-pill-delay', `${rowDelay + pillIndex * 60}ms`);
    });
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

const experienceSection = document.getElementById('doswiadczenie');
const mobileExperienceMedia = window.matchMedia('(max-width: 768px)');
let destroyMobileExperienceEnhancement = null;

const setupMobileExperienceEnhancement = () => {
    if (!experienceSection || !mobileExperienceMedia.matches) {
        return () => {};
    }

    const entries = [...experienceSection.querySelectorAll('.exp-feature-meta')]
        .map((meta, index) => {
            const feature = meta.nextElementSibling;
            if (!feature || !feature.classList.contains('exp-feature')) {
                return null;
            }

            return { meta, feature, index };
        })
        .filter(Boolean);

    if (!entries.length) {
        return () => {};
    }

    const revealObserver = 'IntersectionObserver' in window
        ? new IntersectionObserver((items, observer) => {
            items.forEach((item) => {
                if (!item.isIntersecting) {
                    return;
                }

                const index = Number(item.target.dataset.expMobileIndex);
                const entry = entries[index];
                if (!entry) {
                    return;
                }

                entry.meta.classList.add('is-mobile-visible');
                entry.feature.classList.add('is-mobile-visible');
                observer.unobserve(item.target);
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -8% 0px'
        })
        : null;

    let activeEntry = null;

    const setPanelState = (entry, shouldOpen) => {
        const { meta, feature, button, panel } = entry;
        if (!button || !panel) {
            return;
        }

        button.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        meta.classList.toggle('is-mobile-open', shouldOpen);
        feature.classList.toggle('is-mobile-open', shouldOpen);

        if (shouldOpen) {
            panel.hidden = false;
            panel.style.maxHeight = '0px';
            panel.style.opacity = '0';

            requestAnimationFrame(() => {
                panel.style.maxHeight = `${panel.scrollHeight}px`;
                panel.style.opacity = '1';
            });

            const handleOpenEnd = (event) => {
                if (event.propertyName !== 'max-height') {
                    return;
                }

                if (button.getAttribute('aria-expanded') === 'true') {
                    panel.style.maxHeight = `${panel.scrollHeight}px`;
                }
                panel.removeEventListener('transitionend', handleOpenEnd);
            };

            panel.addEventListener('transitionend', handleOpenEnd);
            activeEntry = entry;
            return;
        }

        panel.style.maxHeight = `${panel.scrollHeight}px`;
        panel.style.opacity = '1';

        requestAnimationFrame(() => {
            panel.style.maxHeight = '0px';
            panel.style.opacity = '0';
        });

        const handleCloseEnd = (event) => {
            if (event.propertyName !== 'max-height') {
                return;
            }

            if (button.getAttribute('aria-expanded') === 'false') {
                panel.hidden = true;
            }
            panel.removeEventListener('transitionend', handleCloseEnd);
        };

        panel.addEventListener('transitionend', handleCloseEnd);

        if (activeEntry === entry) {
            activeEntry = null;
        }
    };

    entries.forEach((entry) => {
        const { meta, feature, index } = entry;
        const content = feature.querySelector('.exp-feature-content');
        const role = feature.querySelector('.exp-feature-role');
        const panel = feature.querySelector('.job-content-wrapper');
        const date = meta.querySelector('.exp-feature-date');
        const companyName = meta.querySelector('.exp-feature-company')?.textContent?.trim() || '';

        meta.classList.add('exp-mobile-meta', 'is-visible');
        feature.classList.add('exp-mobile-feature', 'is-visible');
        meta.dataset.expMobileIndex = `${index}`;
        feature.dataset.expMobileIndex = `${index}`;
        meta.style.setProperty('--exp-mobile-delay', `${index * 80}ms`);
        feature.style.setProperty('--exp-mobile-delay', `${index * 80}ms`);

        if (date && /teva/i.test(companyName) && !date.querySelector('.exp-feature-active-badge')) {
            const badge = document.createElement('span');
            badge.className = 'exp-feature-active-badge';
            badge.textContent = 'aktywny';
            badge.dataset.mobileInjected = 'true';
            date.append(badge);
            entry.badge = badge;
        }

        if (!content || !role || !panel) {
            if (revealObserver) {
                revealObserver.observe(feature);
            } else {
                meta.classList.add('is-mobile-visible');
                feature.classList.add('is-mobile-visible');
            }
            return;
        }

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'exp-mobile-toggle';
        button.setAttribute('aria-expanded', 'false');

        if (!panel.id) {
            panel.id = `exp-mobile-panel-${index}`;
            panel.dataset.mobileGeneratedId = 'true';
        }

        button.setAttribute('aria-controls', panel.id);

        const copy = document.createElement('span');
        copy.className = 'exp-mobile-toggle-copy';

        const roleText = document.createElement('span');
        roleText.className = 'exp-mobile-toggle-role';
        roleText.textContent = role.textContent.trim();

        const companyText = document.createElement('span');
        companyText.className = 'exp-mobile-toggle-company';
        companyText.textContent = companyName;

        const icon = document.createElement('span');
        icon.className = 'exp-mobile-toggle-icon';
        icon.setAttribute('aria-hidden', 'true');

        copy.append(roleText, companyText);
        button.append(copy, icon);
        content.insertBefore(button, role);

        panel.classList.add('exp-mobile-panel');
        panel.hidden = true;
        panel.style.maxHeight = '0px';
        panel.style.opacity = '0';

        const handleToggle = () => {
            const isOpen = button.getAttribute('aria-expanded') === 'true';

            if (activeEntry && activeEntry !== entry) {
                setPanelState(activeEntry, false);
            }

            setPanelState(entry, !isOpen);
        };

        button.addEventListener('click', handleToggle);

        entry.button = button;
        entry.panel = panel;
        entry.handleToggle = handleToggle;

        if (revealObserver) {
            revealObserver.observe(feature);
        } else {
            meta.classList.add('is-mobile-visible');
            feature.classList.add('is-mobile-visible');
        }
    });

    return () => {
        revealObserver?.disconnect();

        entries.forEach((entry) => {
            entry.button?.removeEventListener('click', entry.handleToggle);
            entry.button?.remove();
            entry.badge?.dataset.mobileInjected === 'true' && entry.badge.remove();

            entry.meta.classList.remove('exp-mobile-meta', 'is-mobile-visible', 'is-mobile-open');
            entry.feature.classList.remove('exp-mobile-feature', 'is-mobile-visible', 'is-mobile-open');
            entry.meta.style.removeProperty('--exp-mobile-delay');
            entry.feature.style.removeProperty('--exp-mobile-delay');
            delete entry.meta.dataset.expMobileIndex;
            delete entry.feature.dataset.expMobileIndex;

            if (entry.panel) {
                entry.panel.classList.remove('exp-mobile-panel');
                entry.panel.hidden = false;
                entry.panel.style.removeProperty('max-height');
                entry.panel.style.removeProperty('opacity');

                if (entry.panel.dataset.mobileGeneratedId === 'true') {
                    entry.panel.removeAttribute('id');
                    delete entry.panel.dataset.mobileGeneratedId;
                }
            }
        });
    };
};

const syncMobileExperienceEnhancement = () => {
    destroyMobileExperienceEnhancement?.();
    destroyMobileExperienceEnhancement = mobileExperienceMedia.matches
        ? setupMobileExperienceEnhancement()
        : null;
};

syncMobileExperienceEnhancement();

if (typeof mobileExperienceMedia.addEventListener === 'function') {
    mobileExperienceMedia.addEventListener('change', syncMobileExperienceEnhancement);
} else if (typeof mobileExperienceMedia.addListener === 'function') {
    mobileExperienceMedia.addListener(syncMobileExperienceEnhancement);
}

if (burgerMenu && mainNav) {
    burgerMenu.addEventListener('click', () => {
        mainNav.classList.toggle('is-open');
        burgerMenu.classList.toggle('is-open');
    });
}

if (menuCloseButton && burgerMenu && mainNav) {
    menuCloseButton.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        burgerMenu.classList.remove('is-open');
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
            link.classList.toggle('active', isActive);
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
        const numberEl = el.querySelector('.hero-stat-number');
        const target = Number(numberEl?.textContent?.replace(/[^\d]/g, '') || 0);
        if (!Number.isFinite(target) || target <= 0) {
            return;
        }

        const startTime = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = progress * progress * progress * (progress * (6 * progress - 15) + 10);
            const value = Math.round(target * eased);
            numberEl.textContent = `${value}`;

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
                const numberEl = el.querySelector('.hero-stat-number');
                const target = Number(numberEl?.textContent?.replace(/[^\d]/g, '') || 0);
                if (numberEl && Number.isFinite(target)) {
                    numberEl.textContent = `${target}`;
                }
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

if (certSectionIntro || certCards.length) {
    const certRevealTargets = [
        ...(certSectionIntro ? [certSectionIntro] : []),
        ...certCards
    ];

    if ('IntersectionObserver' in window) {
        const certObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.15
        });

        certRevealTargets.forEach((item) => {
            certObserver.observe(item);
        });
    } else {
        certRevealTargets.forEach((item) => {
            item.classList.add('visible');
        });
    }
}

if (toolsSection && (toolsHead || toolRows.length || toolPills.length)) {
    const revealTools = () => {
        toolsSection.classList.remove('tools-section--pending');
        toolsHead?.classList.add('visible');
        toolRows.forEach((row) => row.classList.add('visible'));
        toolPills.forEach((pill) => pill.classList.add('visible'));
    };

    if ('IntersectionObserver' in window) {
        toolsSection.classList.add('tools-section--pending');

        const toolsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                revealTools();
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.1
        });

        toolsObserver.observe(toolsSection);
    } else {
        revealTools();
    }
}

if (interestCards.length) {
    if ('IntersectionObserver' in window) {
        const interestsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.1
        });

        interestCards.forEach((card) => {
            interestsObserver.observe(card);
        });
    } else {
        interestCards.forEach((card) => {
            card.classList.add('visible');
        });
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


