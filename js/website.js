/* ============================================
   ORBE TÁCTICOS - WEBSITE JAVASCRIPT
   Version: 2.0
   Description: Full website functionality
============================================ */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        particleCount: 50,
        particleConnectionDistance: 150,
        mouseConnectionDistance: 200,
        scrollThreshold: 50,
        animationThreshold: 0.1,
        defaultLang: 'es',
        storageKey: 'orbe-lang',
        translationsPath: 'data/translations.json'
    };

    // ============================================
    // STATE
    // ============================================
    let translations = null;
    let currentLang = CONFIG.defaultLang;
    let particleSystem = null;

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const elements = {
        navbar: document.getElementById('navbar'),
        navbarToggle: document.getElementById('navbar-toggle'),
        mobileMenu: document.getElementById('mobile-menu'),
        mobileMenuOverlay: document.getElementById('mobile-menu-overlay'),
        contactForm: document.getElementById('contact-form'),
        formSuccess: document.getElementById('form-success'),
        submitBtn: document.getElementById('submit-btn'),
        particlesCanvas: document.getElementById('particles-canvas')
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    async function init() {
        // Load translations
        await loadTranslations();

        // Initialize language
        initLanguage();

        // Initialize navigation
        initNavigation();

        // Initialize scroll effects
        initScrollEffects();

        // Initialize scroll animations
        initScrollAnimations();

        // Initialize form
        initContactForm();

        // Initialize particles
        initParticles();

        // Initialize smooth scroll
        initSmoothScroll();

        console.log('Orbe Tácticos Website initialized');
    }

    // ============================================
    // TRANSLATIONS SYSTEM
    // ============================================
    async function loadTranslations() {
        try {
            const response = await fetch(CONFIG.translationsPath);
            if (!response.ok) throw new Error('Failed to load translations: ' + response.status);
            translations = await response.json();
            console.log('Translations loaded successfully');
        } catch (error) {
            console.error('Error loading translations:', error);
            console.log('Attempting to load from alternative path...');
            // Try alternative path
            try {
                const altResponse = await fetch('./data/translations.json');
                if (altResponse.ok) {
                    translations = await altResponse.json();
                    console.log('Translations loaded from alternative path');
                    return;
                }
            } catch (altError) {
                console.error('Alternative path also failed:', altError);
            }
            // Fallback: use inline translations
            translations = getInlineTranslations();
        }
    }

    function initLanguage() {
        // Get saved language or use default
        const savedLang = localStorage.getItem(CONFIG.storageKey);
        currentLang = savedLang || CONFIG.defaultLang;

        // Set HTML lang attribute
        document.documentElement.lang = currentLang;

        // Update UI
        updateLanguageButtons();
        applyTranslations();

        // Add event listeners to language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                if (lang !== currentLang) {
                    setLanguage(lang);
                }
            });
        });
    }

    function setLanguage(lang) {
        if (!translations[lang]) return;

        currentLang = lang;
        localStorage.setItem(CONFIG.storageKey, lang);
        document.documentElement.lang = lang;

        updateLanguageButtons();
        applyTranslations();
    }

    function updateLanguageButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });
    }

    function applyTranslations() {
        if (!translations || !translations[currentLang]) return;

        const t = translations[currentLang];

        // Apply text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const value = getNestedValue(t, key);
            if (value !== undefined) {
                // For select options, only update text, not the value
                if (el.tagName === 'OPTION') {
                    el.textContent = value;
                } else {
                    el.textContent = value;
                }
            }
        });

        // Apply placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            const value = getNestedValue(t, key);
            if (value !== undefined) {
                el.placeholder = value;
            }
        });

        // Apply aria-labels
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.dataset.i18nAria;
            const value = getNestedValue(t, key);
            if (value !== undefined) {
                el.setAttribute('aria-label', value);
            }
        });
    }

    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }

    // ============================================
    // NAVIGATION
    // ============================================
    function initNavigation() {
        // Mobile menu toggle
        if (elements.navbarToggle && elements.mobileMenu && elements.mobileMenuOverlay) {
            elements.navbarToggle.addEventListener('click', toggleMobileMenu);
            elements.mobileMenuOverlay.addEventListener('click', closeMobileMenu);

            // Close menu on link click
            elements.mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
        }

        // Active link highlighting on scroll
        initActiveNavHighlight();
    }

    function toggleMobileMenu() {
        const isActive = elements.mobileMenu.classList.contains('active');

        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        elements.navbarToggle.classList.add('active');
        elements.mobileMenu.classList.add('active');
        elements.mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        elements.navbarToggle.classList.remove('active');
        elements.mobileMenu.classList.remove('active');
        elements.mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function initActiveNavHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link:not(.nav-link-cta)');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        link.classList.toggle('active', href === `#${id}`);
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -50% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    // ============================================
    // SCROLL EFFECTS
    // ============================================
    function initScrollEffects() {
        let lastScrollY = 0;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Navbar background change
            if (elements.navbar) {
                elements.navbar.classList.toggle('scrolled', currentScrollY > CONFIG.scrollThreshold);
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: CONFIG.animationThreshold,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => observer.observe(el));
        } else {
            // Fallback for browsers without IntersectionObserver
            animatedElements.forEach(el => el.classList.add('visible'));
        }
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();

                    const navbarHeight = elements.navbar ? elements.navbar.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // CONTACT FORM
    // ============================================
    function initContactForm() {
        if (!elements.contactForm) return;

        elements.contactForm.addEventListener('submit', handleFormSubmit);
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = elements.submitBtn;

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Log submission (replace with actual API call)
        console.log('Form submission:', data);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Store submission locally
        const submissions = JSON.parse(localStorage.getItem('orbe-submissions') || '[]');
        submissions.push({
            ...data,
            timestamp: new Date().toISOString(),
            lang: currentLang
        });
        localStorage.setItem('orbe-submissions', JSON.stringify(submissions));

        // Show success
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        form.style.display = 'none';
        elements.formSuccess.classList.add('show');

        // Reset form
        form.reset();
    }

    // ============================================
    // PARTICLE SYSTEM
    // ============================================
    function initParticles() {
        if (!elements.particlesCanvas) return;

        particleSystem = new ParticleSystem(elements.particlesCanvas);
        particleSystem.init();

        // Handle resize
        window.addEventListener('resize', debounce(() => {
            particleSystem.resize();
        }, 250));

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                particleSystem.pause();
            } else {
                particleSystem.resume();
            }
        });
    }

    class ParticleSystem {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.mousePosition = { x: null, y: null };
            this.isRunning = false;
            this.animationId = null;
        }

        init() {
            this.resize();
            this.createParticles();
            this.bindEvents();
            this.start();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        createParticles() {
            this.particles = [];
            for (let i = 0; i < CONFIG.particleCount; i++) {
                this.particles.push(this.createParticle());
            }
        }

        createParticle() {
            return {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1
            };
        }

        bindEvents() {
            this.canvas.addEventListener('mousemove', (e) => {
                this.mousePosition.x = e.clientX;
                this.mousePosition.y = e.clientY;
            });

            this.canvas.addEventListener('mouseleave', () => {
                this.mousePosition.x = null;
                this.mousePosition.y = null;
            });
        }

        start() {
            this.isRunning = true;
            this.animate();
        }

        pause() {
            this.isRunning = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
        }

        resume() {
            if (!this.isRunning) {
                this.start();
            }
        }

        animate() {
            if (!this.isRunning) return;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.updateParticles();
            this.drawParticles();
            this.drawConnections();

            this.animationId = requestAnimationFrame(() => this.animate());
        }

        updateParticles() {
            this.particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Wrap around edges
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;
            });
        }

        drawParticles() {
            this.particles.forEach(particle => {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(45, 95, 63, ${particle.opacity})`;
                this.ctx.fill();
            });
        }

        drawConnections() {
            // Particle to particle connections
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < CONFIG.particleConnectionDistance) {
                        const opacity = 1 - (distance / CONFIG.particleConnectionDistance);
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.strokeStyle = `rgba(45, 95, 63, ${opacity * 0.3})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                }
            }

            // Mouse to particle connections
            if (this.mousePosition.x !== null && this.mousePosition.y !== null) {
                this.particles.forEach(particle => {
                    const dx = particle.x - this.mousePosition.x;
                    const dy = particle.y - this.mousePosition.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < CONFIG.mouseConnectionDistance) {
                        const opacity = 1 - (distance / CONFIG.mouseConnectionDistance);
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(this.mousePosition.x, this.mousePosition.y);
                        this.ctx.strokeStyle = `rgba(212, 165, 116, ${opacity * 0.5})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                });
            }
        }
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Inline translations fallback - minimal version, full translations should load from JSON
    function getInlineTranslations() {
        console.warn('Using inline translations fallback - JSON file may not have loaded correctly');
        return {
            es: {
                nav: {
                    inicio: "Inicio",
                    nosotros: "Nosotros",
                    soluciones: "Soluciones",
                    clientes: "Clientes",
                    socios: "Socios Estratégicos",
                    capacidades: "Capacidades",
                    contacto: "Contacto"
                },
                hero: {
                    title: "Soluciones de Movilidad Táctica de Clase Mundial",
                    subtitle: "Conectamos a las fuerzas de defensa y seguridad con los mejores fabricantes de vehículos blindados y tácticos del mundo",
                    cta: "Solicitar Información",
                    scrollText: "Descubre más"
                }
            },
            en: {
                nav: {
                    inicio: "Home",
                    nosotros: "About Us",
                    soluciones: "Solutions",
                    clientes: "Clients",
                    socios: "Strategic Partners",
                    capacidades: "Capabilities",
                    contacto: "Contact"
                },
                hero: {
                    title: "World-Class Tactical Mobility Solutions",
                    subtitle: "We connect defense and security forces with the world's leading armored and tactical vehicle manufacturers",
                    cta: "Request Information",
                    scrollText: "Discover more"
                }
            }
        };
    }

    // ============================================
    // INITIALIZE ON DOM READY
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
