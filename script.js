// ============================================
// APEX CONSTRUCTORA - MINIMAL JAVASCRIPT
// Philosophy: Essential functionality only
// ============================================

'use strict';

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// FORM HANDLING
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate
        if (!validateForm(data)) {
            showMessage('Por favor completa todos los campos correctamente.', 'error');
            return;
        }
        
        // Simulate sending (replace with actual API call)
        try {
            await simulateAPICall();
            showMessage('Mensaje enviado. Te contactaremos pronto.', 'success');
            contactForm.reset();
        } catch (error) {
            showMessage('Error al enviar. Intenta nuevamente.', 'error');
        }
    });
}

function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    
    if (!data.name || data.name.length < 2) return false;
    if (!emailRegex.test(data.email)) return false;
    if (!phoneRegex.test(data.phone) || data.phone.length < 8) return false;
    if (!data['project-type']) return false;
    if (!data.message || data.message.length < 10) return false;
    
    return true;
}

function simulateAPICall() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

function showMessage(message, type) {
    // Remove existing messages
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();
    
    // Create message
    const messageEl = document.createElement('div');
    messageEl.className = 'form-message form-message--' + type;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 2rem;
        background-color: ${type === 'success' ? '#0a0a0a' : '#ff6b35'};
        color: white;
        border-radius: 50px;
        font-size: 0.875rem;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.4s ease-out;
    `;
    
    document.body.appendChild(messageEl);
    
    // Remove after 4 seconds
    setTimeout(() => {
        messageEl.style.animation = 'slideOutRight 0.4s ease-out';
        setTimeout(() => messageEl.remove(), 400);
    }, 4000);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.service-minimal, .process-step, .portfolio-item').forEach(el => {
    observer.observe(el);
});

// ============================================
// NAVIGATION SCROLL EFFECT
// ============================================
let lastScroll = 0;
const nav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
    } else {
        nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// ADD ANIMATIONS STYLE
// ============================================
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
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
document.head.appendChild(animationStyle);

// ============================================
// INITIALIZE
// ============================================
console.log('%cAPEX Constructora', 'font-size: 20px; font-weight: bold;');
console.log('%cSistema minimalista inicializado', 'color: #6a6a6a;');