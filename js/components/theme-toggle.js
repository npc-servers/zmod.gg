class ThemeToggle {
    constructor() {
        this.createToggleButton();
        this.initializeTheme();
        this.addEventListeners();
    }

    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.innerHTML = `
            <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1zm0 15a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm9-7a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zM4 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zm14.95-4.95a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0zm-12.02 12.02a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0zm12.02-1.414a1 1 0 0 1-1.414 0l-.707-.707a1 1 0 1 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414zM5.636 5.636a1 1 0 0 1-1.414 0l-.707-.707a1 1 0 0 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414zM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/>
            </svg>
            <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 3z"/>
            </svg>
        `;
        document.body.appendChild(button);
        this.button = button;
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('site-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.button.setAttribute('data-theme', savedTheme);
    }

    addEventListeners() {
        this.button.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            this.button.setAttribute('data-theme', newTheme);
            localStorage.setItem('site-theme', newTheme);
        });
    }
}

// Initialize the theme toggle
document.addEventListener('DOMContentLoaded', () => {
    new ThemeToggle();
}); 