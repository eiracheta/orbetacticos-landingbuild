/**
 * ORBE TÁCTICOS - Main JavaScript
 * Landing page functionality: i18n, countdown, form handling, particles
 */

(function() {
    'use strict';

    /* =========================================================================
       INTERNATIONALIZATION (i18n)
       ========================================================================= */

    const translations = {
        es: {
            status: 'EN DESARROLLO',
            title: 'Sitio en Construcción',
            subtitle: 'Soluciones de Movilidad Táctica para Fuerzas de Defensa',
            description: 'Especialistas en suministro de vehículos blindados y tácticos de alta especificación para operaciones de defensa y seguridad a nivel global.',
            progress: 'Progreso del sitio',
            available: 'Disponible',
            days: 'Días',
            hours: 'Horas',
            minutes: 'Minutos',
            seconds: 'Segundos',
            formIntro: 'Sé el primero en conocer nuestro lanzamiento',
            emailPlaceholder: 'correo@ejemplo.com',
            orgPlaceholder: 'País / Organización',
            notify: 'Notificarme',
            successMessage: '¡Registro exitoso! Te notificaremos pronto.',
            privacy: 'Tu información está protegida. No compartimos datos con terceros.',
            rights: 'Todos los derechos reservados.'
        },
        en: {
            status: 'IN DEVELOPMENT',
            title: 'Site Under Construction',
            subtitle: 'Tactical Mobility Solutions for Defense Forces',
            description: 'Specialists in the supply of high-specification armored and tactical vehicles for defense and security operations worldwide.',
            progress: 'Site progress',
            available: 'Available',
            days: 'Days',
            hours: 'Hours',
            minutes: 'Minutes',
            seconds: 'Seconds',
            formIntro: 'Be the first to know about our launch',
            emailPlaceholder: 'email@example.com',
            orgPlaceholder: 'Country / Organization',
            notify: 'Notify Me',
            successMessage: 'Registration successful! We\'ll notify you soon.',
            privacy: 'Your information is protected. We don\'t share data with third parties.',
            rights: 'All rights reserved.'
        }
    };

    let currentLang = localStorage.getItem('orbe-lang') || 'es';

    /**
     * Updates all translatable elements on the page
     */
    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('orbe-lang', lang);

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });

        // Update active button state
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    /**
     * Initialize language switcher
     */
    function initLanguageSwitcher() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                updateLanguage(btn.dataset.lang);
            });
        });

        // Apply saved language on load
        updateLanguage(currentLang);
    }

    /* =========================================================================
       COUNTDOWN TIMER
       ========================================================================= */

    // Target date: March 31, 2026 (Q1 2026)
    const targetDate = new Date('2026-03-31T00:00:00').getTime();

    /**
     * Updates the countdown display
     */
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        } else {
            // Countdown finished
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }

    /**
     * Initialize countdown timer
     */
    function initCountdown() {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    /* =========================================================================
       FORM HANDLING
       ========================================================================= */

    /**
     * Handle form submission
     */
    function initForm() {
        const form = document.getElementById('notify-form');
        const successMessage = document.getElementById('success-message');

        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const organization = document.getElementById('organization').value;

            // In production, you would send this to your backend
            console.log('Form submitted:', { email, organization });

            // Show success message
            form.style.display = 'none';
            successMessage.classList.remove('hidden');

            // Store in localStorage (demo purposes)
            const submissions = JSON.parse(localStorage.getItem('orbe-submissions') || '[]');
            submissions.push({
                email,
                organization,
                date: new Date().toISOString()
            });
            localStorage.setItem('orbe-submissions', JSON.stringify(submissions));
        });
    }

    /* =========================================================================
       PARTICLE ANIMATION
       ========================================================================= */

    class ParticleSystem {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.particleCount = 50;
            this.mousePosition = { x: null, y: null };

            this.init();
            this.animate();
            this.handleResize();
            this.handleMouse();
        }

        init() {
            this.resize();
            this.createParticles();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        createParticles() {
            this.particles = [];
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 2 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }
        }

        drawParticle(particle) {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(45, 95, 63, ${particle.opacity})`;
            this.ctx.fill();
        }

        drawConnections() {
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        const opacity = (1 - distance / 150) * 0.15;
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(45, 95, 63, ${opacity})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.stroke();
                    }
                }

                // Connect to mouse
                if (this.mousePosition.x !== null) {
                    const dx = this.particles[i].x - this.mousePosition.x;
                    const dy = this.particles[i].y - this.mousePosition.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 200) {
                        const opacity = (1 - distance / 200) * 0.3;
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(212, 165, 116, ${opacity})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.mousePosition.x, this.mousePosition.y);
                        this.ctx.stroke();
                    }
                }
            }
        }

        updateParticle(particle) {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Update and draw particles
            this.particles.forEach(particle => {
                this.updateParticle(particle);
                this.drawParticle(particle);
            });

            // Draw connections
            this.drawConnections();

            requestAnimationFrame(() => this.animate());
        }

        handleResize() {
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.resize();
                    this.createParticles();
                }, 250);
            });
        }

        handleMouse() {
            window.addEventListener('mousemove', (e) => {
                this.mousePosition.x = e.clientX;
                this.mousePosition.y = e.clientY;
            });

            window.addEventListener('mouseleave', () => {
                this.mousePosition.x = null;
                this.mousePosition.y = null;
            });
        }
    }

    /* =========================================================================
       INITIALIZATION
       ========================================================================= */

    function init() {
        initLanguageSwitcher();
        initCountdown();
        initForm();
        new ParticleSystem('particles');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
