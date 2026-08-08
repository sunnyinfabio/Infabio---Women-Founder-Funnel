let cursorDot, cursorRing;
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let ringX = 0, ringY = 0;
let isHovering = false;
let isHoveringCTA = false;

function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (typeof gsap === 'undefined') return;
    
    cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorRing);
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    const interactiveElements = document.querySelectorAll('a, button, .quiz-answer-card, .form-input, input, textarea, .hero-cta, .navbar-cta, .final-cta-button, .lead-submit, .lead-success-cta, .sticky-cta-button');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            isHovering = true;
            if (el.classList.contains('hero-cta') || el.classList.contains('navbar-cta') || el.classList.contains('final-cta-button') || el.classList.contains('lead-submit') || el.classList.contains('lead-success-cta') || el.classList.contains('sticky-cta-button')) {
                isHoveringCTA = true;
                cursorRing.classList.add('cta');
            } else {
                cursorRing.classList.add('hover');
            }
        });
        
        el.addEventListener('mouseleave', () => {
            isHovering = false;
            isHoveringCTA = false;
            cursorRing.classList.remove('hover', 'cta');
        });
    });
    
    animateCursor();
}

function animateCursor() {
    if (!cursorDot || !cursorRing) return;
    
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    ringX += (mouseX - ringX) * 0.08;
    ringY += (mouseY - ringY) * 0.08;
    
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    
    requestAnimationFrame(animateCursor);
}

function hideCursor() {
    if (cursorDot) cursorDot.style.opacity = '0';
    if (cursorRing) cursorRing.style.opacity = '0';
}

function showCursor() {
    if (cursorDot) cursorDot.style.opacity = '1';
    if (cursorRing) cursorRing.style.opacity = '1';
}
