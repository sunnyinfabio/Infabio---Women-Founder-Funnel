function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (!target) return;
    
    if (lenisInstance) {
        lenisInstance.scrollTo(target, {
            offset: 0,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
    } else {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

function showSection(sectionId) {
    const sections = ['hero', 'diagnostic-intro', 'quiz', 'analysis', 'score', 'recommendations', 'lead', 'women-founders', 'difference', 'final-cta', 'social-proof'];
    
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        
        const isActiveSection = id === sectionId;
        const isSupportingSection = ['hero', 'diagnostic-intro', 'social-proof', 'women-founders'].includes(id);
        const isQuizPhase = sectionId === 'quiz' || sectionId === 'analysis';
        
        if (isActiveSection) {
            if (id === 'quiz' || id === 'analysis' || id === 'score' || id === 'lead' || id === 'recommendations') {
                el.style.display = 'flex';
                el.style.minHeight = id === 'quiz' ? '100vh' : 'auto';
                el.style.alignItems = 'center';
                el.style.justifyContent = 'center';
            } else {
                el.style.display = 'block';
            }
        } else if (isSupportingSection && !isQuizPhase) {
            el.style.display = 'block';
        } else if (id === 'difference' || id === 'final-cta') {
            if (sectionId === 'score' || sectionId === 'lead' || sectionId === 'recommendations') {
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }
        } else {
            el.style.display = 'none';
        }
    });
}

function showAnalysis() {
    showSection('analysis');
    scrollToSection('analysis');
    
    if (typeof animateAnalysis === 'function') {
        animateAnalysis();
    }
    
    setTimeout(() => {
        showResults();
    }, 3500);
}

function showResults() {
    const score = calculateScore();
    const totalScore = calculateTotalScore(score);
    const { title, subtitle } = getScoreTitle(totalScore);
    const recommendations = getRecommendations(score);
    const profileData = getProfileData(score);
    
    funnelState.totalScore = totalScore;
    funnelState.profile = score;
    
    updateThreeJSWithScore(score);
    
    document.getElementById('score-number').textContent = '0';
    document.getElementById('score-title').textContent = title;
    document.getElementById('score-subtitle').textContent = subtitle;
    
    showSection('score');
    scrollToSection('score');
    
    if (typeof animateScore === 'function') {
        setTimeout(() => animateScore(totalScore), 300);
    } else {
        document.getElementById('score-number').textContent = totalScore;
    }
    
    if (typeof animateProfileBars === 'function') {
        setTimeout(() => animateProfileBars(profileData), 800);
    }
    
    const recGrid = document.getElementById('recommendations-grid');
    recGrid.innerHTML = recommendations.map((rec, i) => `
        <div class="women-founder-card recommendation-item">
            <div class="women-founder-icon">${i + 1}</div>
            <h4 class="women-founder-title">${rec.title}</h4>
            <p class="women-founder-text">${rec.desc}</p>
        </div>
    `).join('');
    
    document.getElementById('recommendations').style.display = 'block';
    document.getElementById('lead').style.display = 'flex';
    
    if (typeof revealRecommendations === 'function') {
        revealRecommendations();
    }
    
    const leadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (typeof gsap !== 'undefined') {
                    gsap.from('.lead-card', {
                        opacity: 0,
                        y: 40,
                        duration: 0.8
                    });
                }
                leadObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    const leadSection = document.getElementById('lead');
    if (leadSection) {
        leadObserver.observe(leadSection);
    }
}

function initApp() {
    loadState();
    
    if (funnelState.currentStep >= questions.length && funnelState.answers && Object.keys(funnelState.answers).length > 0) {
        showResults();
        return;
    }
    
    if (funnelState.currentStep > 0 && funnelState.answers && Object.keys(funnelState.answers).length > 0) {
        showSection('quiz');
    }
    
    renderQuestion();
    initLoader();
    initNavbar();
    initAnimations();
    initThreeJS();
    initCursor();
    initTiltEffects();
    initButtonRipples();
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                const sectionId = href.substring(1);
                scrollToSection(sectionId);
            }
        });
    });
    
    initStickyCTA();
}

function initThreeJS() {
    if (typeof THREE === 'undefined') return;
    
    const script = document.createElement('script');
    script.src = 'js/three/main.js';
    script.onload = () => {
        if (typeof initThreeScene === 'function') {
            initThreeScene();
        }
    };
    document.head.appendChild(script);
}

function updateThreeJSWithScore(score) {
    if (typeof updateNodeState !== 'function') return;
    
    Object.keys(score).forEach(key => {
        const value = score[key];
        let state = 'inactive';
        if (value >= 80) state = 'optimized';
        else if (value >= 60) state = 'active';
        else if (value >= 40) state = 'scanning';
        else state = 'warning';
        
        updateNodeState(key, state, value);
    });
}

function initStickyCTA() {
    const existing = document.getElementById('sticky-cta');
    if (existing) existing.remove();
    
    const stickyCTA = document.createElement('div');
    stickyCTA.id = 'sticky-cta';
    stickyCTA.innerHTML = `
        <a href="#quiz" class="sticky-cta-button">
            Take the Growth Score
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        </a>
    `;
    document.body.appendChild(stickyCTA);
    
    const quizSection = document.getElementById('quiz');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stickyCTA.style.transform = 'translateY(100%)';
                stickyCTA.style.opacity = '0';
            } else {
                stickyCTA.style.transform = 'translateY(0)';
                stickyCTA.style.opacity = '1';
            }
        });
    }, { threshold: 0.1 });
    
    if (quizSection) {
        observer.observe(quizSection);
    }
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });
}

document.addEventListener('DOMContentLoaded', initApp);
