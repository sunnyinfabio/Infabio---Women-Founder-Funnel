const questions = [
    {
        id: 'business_stage',
        category: 'Business Foundation',
        question: 'Where is your business right now?',
        type: 'single',
        options: [
            { value: 'getting_started', label: 'Just getting started' },
            { value: 'finding_pmf', label: 'Finding product-market fit' },
            { value: 'growing', label: 'Growing consistently' },
            { value: 'scaling', label: 'Scaling aggressively' }
        ]
    },
    {
        id: 'biggest_challenge',
        category: 'Growth Challenges',
        question: "What's your biggest growth challenge?",
        type: 'multiple',
        options: [
            { value: 'low_leads', label: 'Not enough leads' },
            { value: 'expensive_ads', label: 'Ads are too expensive' },
            { value: 'low_conversion', label: 'Low conversion' },
            { value: 'weak_brand', label: 'Weak brand visibility' },
            { value: 'slow_organic', label: 'Organic growth is slow' },
            { value: 'unknown', label: "I don't know what's working" }
        ]
    },
    {
        id: 'acquisition_channels',
        category: 'Acquisition',
        question: "How are you currently acquiring customers?",
        type: 'multiple',
        options: [
            { value: 'instagram', label: 'Instagram' },
            { value: 'google', label: 'Google Search' },
            { value: 'meta_ads', label: 'Meta Ads' },
            { value: 'seo', label: 'SEO / Organic' },
            { value: 'referrals', label: 'Referrals / Word of mouth' },
            { value: 'whatsapp', label: 'WhatsApp' },
            { value: 'website', label: 'Website traffic' },
            { value: 'offline', label: 'Offline / Events' },
            { value: 'other', label: 'Other' }
        ]
    },
    {
        id: 'marketing_budget',
        category: 'Investment',
        question: "What's your biggest marketing investment?",
        type: 'single',
        options: [
            { value: 'under_25k', label: 'Under ₹25K/month' },
            { value: '25k_50k', label: '₹25K – ₹50K/month' },
            { value: '50k_1l', label: '₹50K – ₹1L/month' },
            { value: '1l_5l', label: '₹1L – ₹5L/month' },
            { value: '5l_plus', label: '₹5L+/month' }
        ]
    },
    {
        id: 'growth_goal',
        category: 'Growth Goals',
        question: "What's your next growth goal?",
        type: 'single',
        options: [
            { value: 'more_leads', label: 'Generate more qualified leads' },
            { value: 'more_sales', label: 'Increase sales' },
            { value: 'reduce_waste', label: 'Reduce ad waste' },
            { value: 'brand_authority', label: 'Build brand authority' },
            { value: 'improve_conversion', label: 'Improve conversion' },
            { value: 'scale', label: 'Scale sustainably' }
        ]
    },
    {
        id: 'data_confidence',
        category: 'Data & Analytics',
        question: 'How confident are you in your marketing data?',
        type: 'slider',
        min: 1,
        max: 10,
        labels: {
            min: 'Not confident',
            max: 'Very confident'
        }
    },
    {
        id: 'ninety_day_goal',
        category: 'Vision',
        question: 'What would make the next 90 days a win?',
        type: 'text',
        placeholder: "e.g., I want to generate 100 qualified leads/month..."
    }
];

const funnelState = {
    currentStep: 0,
    answers: {},
    score: {
        acquisition: 0,
        conversion: 0,
        brand: 0,
        organic: 0,
        data: 0,
        scalability: 0
    }
};

function loadState() {
    const saved = sessionStorage.getItem('founderFunnel');
    if (saved) {
        const parsed = JSON.parse(saved);
        funnelState.currentStep = parsed.currentStep || 0;
        funnelState.answers = parsed.answers || {};
        funnelState.score = parsed.score || {
            acquisition: 0,
            conversion: 0,
            brand: 0,
            organic: 0,
            data: 0,
            scalability: 0
        };
    }
}

function saveState() {
    sessionStorage.setItem('founderFunnel', JSON.stringify(funnelState));
}

function clearState() {
    sessionStorage.removeItem('founderFunnel');
    funnelState.currentStep = 0;
    funnelState.answers = {};
    funnelState.score = {
        acquisition: 0,
        conversion: 0,
        brand: 0,
        organic: 0,
        data: 0,
        scalability: 0
    };
}

function renderQuestion() {
    const step = funnelState.currentStep;
    const q = questions[step];
    
    if (!q) return;
    
    document.getElementById('quiz-step-label').textContent = 
        String(step + 1).padStart(2, '0') + ' / ' + String(questions.length).padStart(2, '0');
    document.getElementById('quiz-progress-fill').style.width = 
        ((step) / questions.length * 100) + '%';
    document.getElementById('quiz-category').textContent = q.category;
    document.getElementById('quiz-question').textContent = q.question;
    
    const answersContainer = document.getElementById('quiz-answers');
    const gridContainer = document.getElementById('quiz-answers-grid');
    answersContainer.innerHTML = '';
    gridContainer.innerHTML = '';
    
    if (q.type === 'single' || q.type === 'multiple') {
        const isMultiple = q.type === 'multiple';
        const options = q.options.map((opt, i) => `
            <button class="quiz-answer-card" data-value="${opt.value}" data-question="${q.id}" aria-pressed="false">
                <span class="quiz-answer-indicator"></span>
                <span class="quiz-answer-text">${opt.label}</span>
            </button>
        `).join('');
        
        if (isMultiple) {
            gridContainer.innerHTML = options;
            gridContainer.style.display = 'grid';
            answersContainer.style.display = 'none';
        } else {
            answersContainer.innerHTML = options;
            answersContainer.style.display = 'flex';
            gridContainer.style.display = 'none';
        }
        
        document.querySelectorAll('.quiz-answer-card').forEach(card => {
            const value = card.dataset.value;
            const questionId = card.dataset.question;
            
            if (funnelState.answers[questionId]) {
                const existing = funnelState.answers[questionId];
                if (Array.isArray(existing) && existing.includes(value)) {
                    card.classList.add('selected');
                    card.setAttribute('aria-pressed', 'true');
                } else if (existing === value) {
                    card.classList.add('selected');
                    card.setAttribute('aria-pressed', 'true');
                }
            }
            
            card.addEventListener('click', () => handleAnswer(q, card, value));
        });
    } else if (q.type === 'slider') {
        answersContainer.style.display = 'flex';
        gridContainer.style.display = 'none';
        answersContainer.innerHTML = `
            <div class="quiz-slider-container">
                <input type="range" class="quiz-slider" id="quiz-slider" 
                       min="${q.min}" max="${q.max}" value="${funnelState.answers[q.id] || q.min}"
                       aria-label="${q.question}">
                <div class="quiz-slider-labels">
                    <span>${q.labels.min}</span>
                    <span>${q.labels.max}</span>
                </div>
                <div class="quiz-slider-value" id="slider-value">${funnelState.answers[q.id] || q.min}</div>
            </div>
        `;
        
        const slider = document.getElementById('quiz-slider');
        const sliderValue = document.getElementById('slider-value');
        
        if (!funnelState.answers[q.id]) {
            funnelState.answers[q.id] = parseInt(slider.value);
        }
        
        sliderValue.textContent = funnelState.answers[q.id];
        
        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            sliderValue.textContent = val;
            funnelState.answers[q.id] = val;
            saveState();
        });
    } else if (q.type === 'text') {
        answersContainer.style.display = 'flex';
        gridContainer.style.display = 'none';
        answersContainer.innerHTML = `
            <textarea class="quiz-textarea" id="quiz-textarea" 
                      placeholder="${q.placeholder || ''}"
                      aria-label="${q.question}">${funnelState.answers[q.id] || ''}</textarea>
        `;
        
        const textarea = document.getElementById('quiz-textarea');
        textarea.addEventListener('input', (e) => {
            funnelState.answers[q.id] = e.target.value;
            saveState();
        });
    }
    
    updateNavButtons();
}

function handleAnswer(question, card, value) {
    if (question.type === 'single') {
        document.querySelectorAll(`.quiz-answer-card[data-question="${question.id}"]`).forEach(c => {
            c.classList.remove('selected');
            c.setAttribute('aria-pressed', 'false');
        });
        card.classList.add('selected');
        card.setAttribute('aria-pressed', 'true');
        funnelState.answers[question.id] = value;
        saveState();
        
        setTimeout(() => nextQuestion(), 300);
    } else if (question.type === 'multiple') {
        if (card.classList.contains('selected')) {
            card.classList.remove('selected');
            card.setAttribute('aria-pressed', 'false');
            funnelState.answers[question.id] = funnelState.answers[question.id].filter(v => v !== value);
        } else {
            card.classList.add('selected');
            card.setAttribute('aria-pressed', 'true');
            if (!funnelState.answers[question.id]) {
                funnelState.answers[question.id] = [];
            }
            funnelState.answers[question.id].push(value);
        }
        saveState();
    }
}

function nextQuestion() {
    funnelState.currentStep++;
    saveState();
    
    if (funnelState.currentStep >= questions.length) {
        showAnalysis();
    } else {
        renderQuestion();
        if (typeof scrollToSection === 'function') {
            scrollToSection('quiz');
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

function prevQuestion() {
    if (funnelState.currentStep > 0) {
        funnelState.currentStep--;
        saveState();
        renderQuestion();
        if (typeof scrollToSection === 'function') {
            scrollToSection('quiz');
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

function updateNavButtons() {
    const existing = document.querySelector('.quiz-nav');
    if (existing) existing.remove();
    
    const nav = document.createElement('div');
    nav.className = 'quiz-nav';
    nav.style.cssText = 'display:flex;justify-content:space-between;margin-top:2.5rem;gap:1rem;';
    
    if (funnelState.currentStep > 0) {
        nav.innerHTML += `<button class="quiz-nav-btn" id="quiz-prev" style="padding:0.875rem 1.5rem;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-secondary);font-weight:500;transition:var(--transition-base);">← Back</button>`;
    }
    
    if (funnelState.currentStep < questions.length - 1) {
        const q = questions[funnelState.currentStep];
        let canProceed = false;
        
        if (q.type === 'single') {
            canProceed = !!funnelState.answers[q.id];
        } else if (q.type === 'multiple') {
            canProceed = funnelState.answers[q.id] && funnelState.answers[q.id].length > 0;
        } else if (q.type === 'slider') {
            canProceed = !!funnelState.answers[q.id];
        } else if (q.type === 'text') {
            canProceed = funnelState.answers[q.id] && funnelState.answers[q.id].trim().length > 0;
        }
        
        nav.innerHTML += `<button class="quiz-nav-btn" id="quiz-next" ${!canProceed ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : 'style="padding:0.875rem 1.5rem;background:var(--accent);border:1px solid var(--accent);border-radius:var(--radius-md);color:white;font-weight:600;transition:var(--transition-base);"'}>Continue →</button>`;
    } else {
        nav.innerHTML += `<button class="quiz-nav-btn" id="quiz-next" style="padding:0.875rem 1.5rem;background:var(--accent);border:1px solid var(--accent);border-radius:var(--radius-md);color:white;font-weight:600;transition:var(--transition-base);">See My Score →</button>`;
    }
    
    const quizContainer = document.querySelector('.quiz-container');
    quizContainer.appendChild(nav);
    
    const prevBtn = document.getElementById('quiz-prev');
    if (prevBtn) {
        prevBtn.addEventListener('click', prevQuestion);
        prevBtn.addEventListener('mouseenter', () => {
            prevBtn.style.borderColor = 'var(--border-hover)';
            prevBtn.style.color = 'var(--text-primary)';
        });
        prevBtn.addEventListener('mouseleave', () => {
            prevBtn.style.borderColor = 'var(--border)';
            prevBtn.style.color = 'var(--text-secondary)';
        });
    }
    
    const nextBtn = document.getElementById('quiz-next');
    if (nextBtn && !nextBtn.disabled) {
        nextBtn.addEventListener('click', nextQuestion);
        nextBtn.addEventListener('mouseenter', () => {
            nextBtn.style.transform = 'translateY(-2px)';
            nextBtn.style.boxShadow = '0 8px 24px var(--accent-glow)';
        });
        nextBtn.addEventListener('mouseleave', () => {
            nextBtn.style.transform = 'translateY(0)';
            nextBtn.style.boxShadow = 'none';
        });
    }
}
