function hideLoader() {
    const loader = document.getElementById('app-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('is-hidden');
        }, 800);
    }
}

function initLoader() {
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }
}
