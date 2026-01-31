// ============================================
// APEX CONSTRUCTORA - JAVASCRIPT
// Philosophy: Progressive enhancement, performance-first
// ============================================

'use strict';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    animationDuration: 600,
    scrollThreshold: 50,
    counterSpeed: 50,
    testimonialAutoPlay: true,
    testimonialInterval: 5000
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const utils = {
    /**
     * Debounce function to limit function calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= offset
        );
    },

    /**
     * Smooth scroll to element
     */
    smoothScrollTo(element) {
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Easing function for animations
     */
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
};

// ============================================
// NAVIGATION
// ============================================
class Navigation {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav__link');
        this.lastScrollTop = 0;
        
        this.init();
    }

    init() {
        this.setupScrollBehavior();
        this.setupMobileMenu();
        this.setupSmoothScroll();
    }

    setupScrollBehavior() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Hide/show navigation on scroll
        if (scrollTop > this.lastScrollTop && scrollTop > 100) {
            this.nav.classList.add('nav--hidden');
        } else {
            this.nav.classList.remove('nav--hidden');
        }
        
        this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }

    setupMobileMenu() {
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('nav__menu--active');
            this.animateToggle();
        });

        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('nav__menu--active');
                this.resetToggle();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target)) {
                this.navMenu.classList.remove('nav__menu--active');
                this.resetToggle();
            }
        });
    }

    animateToggle() {
        const spans = this.navToggle.querySelectorAll('span');
        if (this.navMenu.classList.contains('nav__menu--active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
        } else {
            this.resetToggle();
        }
    }

    resetToggle() {
        const spans = this.navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }

    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        utils.smoothScrollTo(target);
                    }
                }
            });
        });
    }
}

// ============================================
// STATS COUNTER
// ============================================
class StatsCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat');
        this.hasAnimated = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', utils.debounce(() => {
            this.checkVisibility();
        }, 100));
        
        this.checkVisibility(); // Check on load
    }

    checkVisibility() {
        if (this.hasAnimated) return;

        this.stats.forEach(stat => {
            if (utils.isInViewport(stat, 100)) {
                this.hasAnimated = true;
                this.animateCounters();
            }
        });
    }

    animateCounters() {
        this.stats.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const numberElement = stat.querySelector('.stat__number');
            this.animateValue(numberElement, 0, target, 2000);
        });
    }

    animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;

        const timer = setInterval(() => {
            current += increment * Math.ceil(range / 50);
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = this.formatNumber(current);
        }, stepTime);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    }
}

// ============================================
// PORTFOLIO FILTER
// ============================================
class PortfolioFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleFilter(button);
            });
        });
    }

    handleFilter(activeButton) {
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('filter-btn--active'));
        activeButton.classList.add('filter-btn--active');

        const filter = activeButton.dataset.filter;

        // Filter projects with animation
        this.projectCards.forEach((card, index) => {
            const category = card.dataset.category;
            
            if (filter === 'all' || category === filter) {
                setTimeout(() => {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                }, index * 50);
            } else {
                card.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

// ============================================
// TESTIMONIALS SLIDER
// ============================================
class TestimonialsSlider {
    constructor() {
        this.slider = document.querySelector('.testimonials__slider');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.prevBtn = document.querySelector('.testimonials__nav-btn--prev');
        this.nextBtn = document.querySelector('.testimonials__nav-btn--next');
        this.dots = document.querySelectorAll('.dot');
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        
        this.init();
    }

    init() {
        if (!this.slider) return;

        this.setupControls();
        
        if (CONFIG.testimonialAutoPlay) {
            this.startAutoPlay();
            
            // Pause on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }

    setupControls() {
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
    }

    goToSlide(index) {
        // Update current index
        this.currentIndex = index;
        
        // Update dots
        this.dots.forEach(dot => dot.classList.remove('dot--active'));
        this.dots[index]?.classList.add('dot--active');
        
        // On mobile, scroll to the card
        if (window.innerWidth <= 768) {
            const cardWidth = this.cards[0].offsetWidth + 32; // card width + gap
            this.slider.scrollTo({
                left: cardWidth * index,
                behavior: 'smooth'
            });
        }
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.dots.length;
        this.goToSlide(this.currentIndex);
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.dots.length) % this.dots.length;
        this.goToSlide(this.currentIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, CONFIG.testimonialInterval);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.service-card, .project-card, .timeline-item, .testimonial-card');
        this.init();
    }

    init() {
        // Add fade-in class to elements
        this.elements.forEach(el => {
            el.classList.add('fade-in');
        });

        // Setup scroll observer
        this.setupObserver();
    }

    setupObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        this.elements.forEach(el => observer.observe(el));
    }
}

// ============================================
// FORM VALIDATION
// ============================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('.form__input, .form__textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }

        // Phone validation (basic)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            isValid = phoneRegex.test(value) && value.length >= 8;
        }

        // Visual feedback
        if (!isValid) {
            field.style.borderColor = 'var(--color-primary)';
        } else {
            field.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }

        return isValid;
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Validate all fields
        const inputs = this.form.querySelectorAll('.form__input, .form__textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showMessage('Por favor, completa todos los campos correctamente.', 'error');
            return;
        }

        // In a real application, you would send this to a server
        console.log('Form data:', data);
        
        // Simulate API call
        await this.simulateAPICall();
        
        // Show success message
        this.showMessage('¡Mensaje enviado! Te contactaremos en breve.', 'success');
        this.form.reset();
    }

    simulateAPICall() {
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    showMessage(message, type) {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            padding: 1rem 2rem;
            background-color: ${type === 'success' ? 'var(--color-primary)' : '#e74c3c'};
            color: white;
            border-radius: 4px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(messageEl);

        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }
}

// ============================================
// PERFORMANCE MONITORING
// ============================================
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Log performance metrics in development
        if (window.location.hostname === 'localhost') {
            window.addEventListener('load', () => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page load time: ${pageLoadTime}ms`);
            });
        }
    }
}

// ============================================
// INITIALIZE APPLICATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    new Navigation();
    new StatsCounter();
    new PortfolioFilter();
    new TestimonialsSlider();
    new ScrollAnimations();
    new ContactForm();
    new PerformanceMonitor();

    // Add CSS animations for filter
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Log initialization
    console.log('%c⚡ APEX CONSTRUCTORA', 'font-size: 20px; font-weight: bold; color: #ff6b35;');
    console.log('%cSistema inicializado correctamente', 'color: #4a4a4a;');
});

// ============================================
// UTILITY: LAZY LOADING (Future enhancement)
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================
// Keyboard navigation for slider
document.addEventListener('keydown', (e) => {
    const slider = document.querySelector('.testimonials__slider');
    if (!slider || document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
    }

    if (e.key === 'ArrowLeft') {
        document.querySelector('.testimonials__nav-btn--prev')?.click();
    } else if (e.key === 'ArrowRight') {
        document.querySelector('.testimonials__nav-btn--next')?.click();
    }
});

// Focus visible for keyboard users
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add focus styles for keyboard navigation
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    .keyboard-nav *:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
    }
`;
document.head.appendChild(focusStyle);