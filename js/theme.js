// Theme management
const themeKey = 'site-theme';

// Initialize theme - always dark
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem(themeKey, 'dark');
}

// Set initial theme
initializeTheme(); 