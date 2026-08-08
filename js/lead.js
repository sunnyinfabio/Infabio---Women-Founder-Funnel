function buildLeadPayload() {
    const payload = {
        name: document.getElementById('lead-name').value.trim(),
        email: document.getElementById('lead-email').value.trim(),
        whatsapp: document.getElementById('lead-whatsapp').value.trim(),
        company: document.getElementById('lead-company').value.trim(),
        website: document.getElementById('lead-website').value.trim(),
        wantsCall: document.getElementById('lead-call').checked,
        
        founderStage: funnelState.answers.business_stage || null,
        industry: null,
        challenges: funnelState.answers.biggest_challenge || [],
        channels: funnelState.answers.acquisition_channels || [],
        marketingBudget: funnelState.answers.marketing_budget || null,
        growthGoal: funnelState.answers.growth_goal || null,
        dataConfidence: funnelState.answers.data_confidence || null,
        ninetyDayGoal: funnelState.answers.ninety_day_goal || null,
        
        growthScore: funnelState.totalScore || 0,
        profile: funnelState.profile || {}
    };
    
    return payload;
}

function submitLead(e) {
    e.preventDefault();
    
    const errors = validateLeadForm();
    if (errors.length > 0) {
        showFormErrors(errors);
        return;
    }
    
    const payload = buildLeadPayload();
    const submitBtn = document.getElementById('lead-submit');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    console.log('Lead payload:', payload);
    
    setTimeout(() => {
        document.getElementById('lead-card').style.display = 'none';
        document.getElementById('lead-success').style.display = 'block';
        
        if (typeof gsap !== 'undefined') {
            gsap.from('#lead-success', {
                opacity: 0,
                y: 20,
                duration: 0.6
            });
        }
        
        clearState();
    }, 1500);
}

function initLeadCapture() {
    const form = document.getElementById('lead-form');
    if (form) {
        form.addEventListener('submit', submitLead);
    }
}
