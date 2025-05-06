class ThemeToggle {
    constructor() {
        this.initializeTheme();
    }

    initializeTheme() {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('site-theme', 'dark');
    }
}

// Initialize the theme
document.addEventListener('DOMContentLoaded', () => {
    new ThemeToggle();
}); 