// Theme management
const themeKey = 'site-theme';

// Function to toggle theme
function toggleTheme() {
    const currentTheme = localStorage.getItem(themeKey) || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(themeKey, newTheme);
}

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem(themeKey) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Set initial theme
initializeTheme(); 