function initTiltEffects() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (typeof gsap === 'undefined') return;
    
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) {
        quizContainer.addEventListener('mousemove', (e) => {
            const rect = quizContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;
            
            gsap.to(quizContainer, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.4,
                ease: 'power1.out',
                transformPerspective: 1000
            });
        });
        
        quizContainer.addEventListener('mouseleave', () => {
            gsap.to(quizContainer, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    }
    
    const cards = document.querySelectorAll('.quiz-answer-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

function initButtonRipples() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const buttons = document.querySelectorAll('.hero-cta, .navbar-cta, .final-cta-button, .lead-submit, .lead-success-cta, .sticky-cta-button, .quiz-nav-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-effect 0.6s ease-out forwards;
                pointer-events: none;
            `;
            
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

if (typeof gsap !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-effect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
