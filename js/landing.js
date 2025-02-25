// Add hover effect to logo
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo-image');
    if (logo) {
        logo.addEventListener('mouseover', () => {
            logo.style.transform = 'scale(1.05)';
        });

        logo.addEventListener('mouseout', () => {
            logo.style.transform = 'scale(1)';
        });
    }
});

// Add click events to navigation buttons
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    });
});

// Simple hash router for gamemode links
function handleHashChange() {
    const hash = window.location.hash;
    
    if (hash.startsWith('#gamemode/')) {
        const gamemodeId = hash.replace('#gamemode/', '');
        console.log(`Navigating to gamemode: ${gamemodeId}`);
        // This will be replaced with actual navigation when the gamemode directory is built
        alert(`Gamemode directory coming soon! You clicked on: ${gamemodeId}`);
        
        // Reset hash to prevent the alert from showing again if the page is refreshed
        history.pushState("", document.title, window.location.pathname + window.location.search);
    }
}

// Listen for hash changes
window.addEventListener('hashchange', handleHashChange);

// Check hash on initial page load
document.addEventListener('DOMContentLoaded', () => {
    handleHashChange();
    // ... any existing DOMContentLoaded code ...
}); 