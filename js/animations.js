let lenisInstance = null;

function updateScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    if (!scrollProgress) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    
    scrollProgress.style.width = progress + '%';
}

function initAnimations() {
    if (typeof gsap === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    if (!lenisInstance && typeof Lenis !== 'undefined') {
        lenisInstance = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.2,
            touchMultiplier: 2,
            infinite: false,
        });
        
        function raf(time) {
            lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        
        lenisInstance.on('scroll', () => {
            ScrollTrigger.update();
            updateScrollProgress();
        });
        
        gsap.ticker.add((time) => {
            lenisInstance.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }
    
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
    
    gsap.from('.hero-eyebrow', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.2
    });
    
    gsap.from('.hero-headline', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.4
    });
    
    gsap.from('.hero-subtext', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.6
    });
    
    gsap.from('.hero-cta', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.8
    });
    
    gsap.from('.hero-trust', {
        opacity: 0,
        y: 15,
        duration: 0.8,
        delay: 1
    });
    
    gsap.from('.hero-system-status', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 1.2
    });
    
    gsap.from('.hero-scroll-indicator', {
        opacity: 0,
        y: 10,
        duration: 0.8,
        delay: 1.5
    });
    
    gsap.from('.social-proof-item', {
        scrollTrigger: {
            trigger: '#social-proof',
            start: 'top 80%'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1
    });
    
    gsap.from('#diagnostic-intro .section-label', {
        scrollTrigger: {
            trigger: '#diagnostic-intro',
            start: 'top 75%'
        },
        opacity: 0,
        x: -20,
        duration: 0.6
    });
    
    gsap.from('#diagnostic-intro .section-title', {
        scrollTrigger: {
            trigger: '#diagnostic-intro',
            start: 'top 75%'
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        delay: 0.1
    });
    
    gsap.from('#diagnostic-intro .section-subtitle', {
        scrollTrigger: {
            trigger: '#diagnostic-intro',
            start: 'top 75%'
        },
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.2
    });
    
    gsap.from('.quiz-container', {
        scrollTrigger: {
            trigger: '#quiz',
            start: 'top 70%'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out'
    });
    
    gsap.from('.women-founder-card', {
        scrollTrigger: {
            trigger: '#women-founders',
            start: 'top 75%'
        },
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.1
    });
    
    gsap.from('.difference-card', {
        scrollTrigger: {
            trigger: '#difference',
            start: 'top 75%'
        },
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.15
    });
    
    gsap.from('.final-cta-title', {
        scrollTrigger: {
            trigger: '#final-cta',
            start: 'top 75%'
        },
        opacity: 0,
        y: 30,
        duration: 0.7
    });
    
    gsap.from('.final-cta-text', {
        scrollTrigger: {
            trigger: '#final-cta',
            start: 'top 75%'
        },
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.1
    });
    
    gsap.from('.final-cta-button', {
        scrollTrigger: {
            trigger: '#final-cta',
            start: 'top 75%'
        },
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.2
    });
    
    initMagneticButtons();
    initCardTilt();
    initParallax();
    initCounters();
}

function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const buttons = document.querySelectorAll('.hero-cta, .navbar-cta, .final-cta-button, .lead-submit, .lead-success-cta, .sticky-cta-button');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

function initCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (typeof gsap === 'undefined') return;
    
    const cards = document.querySelectorAll('.women-founder-card, .difference-card, .score-profile-item, .social-proof-item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.3,
                ease: 'power1.out',
                transformPerspective: 1000
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

function initParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 100,
        opacity: 0.3
    });
    
    gsap.to('.hero-system-status', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 60,
        opacity: 0
    });
    
    gsap.to('.hero-scroll-indicator', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        opacity: 0
    });
}

function initCounters() {
    const counters = document.querySelectorAll('.social-proof-value');
    
    counters.forEach(counter => {
        const text = counter.textContent;
        const hasPlus = text.includes('+');
        const hasX = text.includes('x');
        const hasPercent = text.includes('%');
        const hasCr = text.includes('Cr');
        const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
        
        if (isNaN(numericValue)) return;
        
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 80%',
            onEnter: () => {
                gsap.from(counter, {
                    textContent: 0,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: numericValue % 1 === 0 ? 1 : 0.1 },
                    onUpdate: function() {
                        let val = parseFloat(counter.textContent);
                        if (hasPlus) counter.textContent = Math.round(val) + '+';
                        else if (hasX) counter.textContent = val.toFixed(1) + 'x';
                        else if (hasPercent) counter.textContent = Math.round(val) + '%';
                        else if (hasCr) counter.textContent = '₹' + Math.round(val) + 'Cr+';
                        else counter.textContent = Math.round(val);
                    }
                });
            },
            once: true
        });
    });
}

function animateScore(targetScore) {
    if (typeof gsap === 'undefined') {
        document.getElementById('score-number').textContent = targetScore;
        return;
    }
    
    const scoreEl = document.getElementById('score-number');
    const obj = { value: 0 };
    
    gsap.to(obj, {
        value: targetScore,
        duration: 2.5,
        ease: 'power2.out',
        onUpdate: () => {
            scoreEl.textContent = Math.round(obj.value);
        }
    });
}

function animateAnalysis() {
    if (typeof gsap === 'undefined') return;
    
    const steps = document.querySelectorAll('.analysis-step');
    const progressFill = document.getElementById('analysis-progress-fill');
    
    steps.forEach((step, i) => {
        setTimeout(() => {
            step.classList.add('visible');
        }, i * 600);
    });
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        progressFill.style.width = Math.min(progress, 100) + '%';
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 150);
}

function animateProfileBars(profileData) {
    if (typeof gsap === 'undefined') return;
    
    const grid = document.getElementById('score-profile-grid');
    grid.innerHTML = profileData.map(item => `
        <div class="score-profile-item">
            <div class="score-profile-label">${item.label}</div>
            <div class="score-profile-bar">
                <div class="score-profile-bar-fill" data-width="${item.value}%" style="background:${item.color};width:0%"></div>
            </div>
            <div class="score-profile-value">${item.value}%</div>
        </div>
    `).join('');
    
    setTimeout(() => {
        document.querySelectorAll('.score-profile-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.width;
        });
    }, 300);
}

function revealRecommendations() {
    if (typeof gsap === 'undefined') return;
    
    const items = document.querySelectorAll('.recommendation-item');
    gsap.from(items, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.2
    });
}
