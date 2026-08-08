function calculateScore() {
    const score = {
        acquisition: 50,
        conversion: 50,
        brand: 50,
        organic: 50,
        data: 50,
        scalability: 50
    };
    
    const answers = funnelState.answers;
    
    if (answers.business_stage) {
        const stageScores = {
            'getting_started': { acquisition: 20, conversion: 20, brand: 15, organic: 20, data: 15, scalability: 20 },
            'finding_pmf': { acquisition: 35, conversion: 30, brand: 25, organic: 35, data: 25, scalability: 30 },
            'growing': { acquisition: 50, conversion: 45, brand: 40, organic: 45, data: 40, scalability: 45 },
            'scaling': { acquisition: 65, conversion: 60, brand: 55, organic: 60, data: 55, scalability: 60 }
        };
        const stageScore = stageScores[answers.business_stage];
        if (stageScore) {
            Object.keys(stageScore).forEach(key => {
                score[key] = Math.max(score[key], stageScore[key]);
            });
        }
    }
    
    if (answers.biggest_challenge && answers.biggest_challenge.length > 0) {
        answers.biggest_challenge.forEach(challenge => {
            const challengeMap = {
                'low_leads': { acquisition: -15, conversion: 0, brand: 0, organic: -5, data: 0, scalability: -5 },
                'expensive_ads': { acquisition: -10, conversion: -5, brand: 0, organic: 0, data: -10, scalability: -5 },
                'low_conversion': { acquisition: 0, conversion: -20, brand: 0, organic: 0, data: -5, scalability: -5 },
                'weak_brand': { acquisition: -5, conversion: -5, brand: -20, organic: -5, data: 0, scalability: -5 },
                'slow_organic': { acquisition: -5, conversion: 0, brand: -5, organic: -20, data: -5, scalability: -5 },
                'unknown': { acquisition: -5, conversion: -5, brand: -5, organic: -5, data: -20, scalability: -5 }
            };
            const impact = challengeMap[challenge];
            if (impact) {
                Object.keys(impact).forEach(key => {
                    score[key] += impact[key];
                });
            }
        });
    }
    
    if (answers.acquisition_channels && answers.acquisition_channels.length > 0) {
        const channelScores = {
            'seo': { organic: 15, brand: 5 },
            'instagram': { brand: 10, acquisition: 5 },
            'meta_ads': { acquisition: 10, conversion: 5 },
            'google': { acquisition: 10, organic: 5 },
            'referrals': { conversion: 10, brand: 5 },
            'website': { conversion: 5, organic: 5 }
        };
        
        answers.acquisition_channels.forEach(channel => {
            const impact = channelScores[channel];
            if (impact) {
                Object.keys(impact).forEach(key => {
                    score[key] = Math.min(100, score[key] + impact[key]);
                });
            }
        });
        
        if (answers.acquisition_channels.length >= 4) {
            score.scalability += 10;
        }
    }
    
    if (answers.marketing_budget) {
        const budgetScores = {
            'under_25k': { scalability: 10, data: 5 },
            '25k_50k': { scalability: 15, data: 10 },
            '50k_1l': { scalability: 25, data: 15 },
            '1l_5l': { scalability: 35, data: 20 },
            '5l_plus': { scalability: 45, data: 25 }
        };
        const budgetScore = budgetScores[answers.marketing_budget];
        if (budgetScore) {
            Object.keys(budgetScore).forEach(key => {
                score[key] = Math.min(100, score[key] + budgetScore[key]);
            });
        }
    }
    
    if (answers.data_confidence) {
        const confidence = parseInt(answers.data_confidence);
        score.data = Math.min(100, score.data + (confidence * 8));
    }
    
    Object.keys(score).forEach(key => {
        score[key] = Math.max(5, Math.min(100, score[key]));
    });
    
    return score;
}

function calculateTotalScore(score) {
    const weights = {
        acquisition: 0.2,
        conversion: 0.2,
        brand: 0.15,
        organic: 0.15,
        data: 0.15,
        scalability: 0.15
    };
    
    let total = 0;
    Object.keys(weights).forEach(key => {
        total += score[key] * weights[key];
    });
    
    return Math.round(total);
}

function getScoreTitle(totalScore) {
    if (totalScore >= 85) return { title: 'Exceptional Engine', subtitle: 'Your growth engine is highly optimized. Focus on compounding your wins and scaling what already works.' };
    if (totalScore >= 70) return { title: 'Strong Foundation', subtitle: 'Your growth engine has solid fundamentals. Here are the key areas to optimize next.' };
    if (totalScore >= 55) return { title: 'Growth Ready', subtitle: 'You have a good base to build from. A few strategic fixes could accelerate your results significantly.' };
    if (totalScore >= 40) return { title: 'Needs Attention', subtitle: 'Your growth engine has some gaps. Addressing these will create immediate improvement.' };
    return { title: 'High Opportunity', subtitle: 'Your brand has massive untapped potential. The right systems will transform your growth trajectory.' };
}

function getRecommendations(score) {
    const sorted = Object.entries(score).sort((a, b) => a[1] - b[1]);
    const lowest = sorted.slice(0, 3);
    
    const serviceMap = {
        acquisition: { title: 'Performance Marketing', desc: 'Build predictable lead generation with paid channels that actually convert.' },
        conversion: { title: 'Website & Conversion', desc: 'Turn existing traffic into more leads with conversion-optimized experiences.' },
        brand: { title: 'Branding & Positioning', desc: 'Become the brand people remember and choose over competitors.' },
        organic: { title: 'SEO & Organic Growth', desc: 'Build sustainable search visibility that compounds over time.' },
        data: { title: 'AI Automation Systems', desc: 'Get clear visibility into what\'s working and automate repetitive tasks.' },
        scalability: { title: 'Growth Strategy', desc: 'Build repeatable systems that scale without burning the engine.' }
    };
    
    return lowest.map(([key, value]) => ({
        key,
        score: value,
        ...serviceMap[key]
    }));
}

function getProfileData(score) {
    return [
        { key: 'acquisition', label: 'Acquisition', value: score.acquisition, color: 'var(--accent)' },
        { key: 'conversion', label: 'Conversion', value: score.conversion, color: 'var(--accent-rose)' },
        { key: 'brand', label: 'Brand Authority', value: score.brand, color: '#818cf8' },
        { key: 'organic', label: 'Organic Growth', value: score.organic, color: '#34d399' },
        { key: 'data', label: 'Data Clarity', value: score.data, color: '#fbbf24' },
        { key: 'scalability', label: 'Scalability', value: score.scalability, color: '#f87171' }
    ];
}
