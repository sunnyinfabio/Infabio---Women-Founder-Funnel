function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^[\d\s\+\-\(\)]{7,20}$/.test(phone);
}

function validateURL(url) {
    if (!url || url.trim() === '') return true;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function validateLeadForm() {
    const errors = [];
    const name = document.getElementById('lead-name').value.trim();
    const email = document.getElementById('lead-email').value.trim();
    const whatsapp = document.getElementById('lead-whatsapp').value.trim();
    const website = document.getElementById('lead-website').value.trim();
    
    if (!name || name.length < 2) {
        errors.push('Please enter your full name');
    }
    
    if (!email || !validateEmail(email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!whatsapp || !validatePhone(whatsapp)) {
        errors.push('Please enter a valid WhatsApp number');
    }
    
    if (website && !validateURL(website)) {
        errors.push('Please enter a valid website URL');
    }
    
    return errors;
}

function showFormErrors(errors) {
    const existing = document.querySelector('.form-errors');
    if (existing) existing.remove();
    
    if (errors.length === 0) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-errors';
    errorDiv.style.cssText = 'background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.2);border-radius:var(--radius-md);padding:1rem;margin-bottom:1.25rem;';
    
    errors.forEach(err => {
        const p = document.createElement('p');
        p.textContent = err;
        p.style.cssText = 'color:var(--error);font-size:0.875rem;margin-bottom:0.25rem;';
        errorDiv.appendChild(p);
    });
    
    const form = document.getElementById('lead-form');
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}
