// Handle scroll-related behaviors
const scrollIndicator = document.querySelector('.scroll-indicator');

// Hide scroll indicator when user scrolls down
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) { // Show after scrolling 100px
        scrollIndicator.classList.add('hidden');
    } else {
        scrollIndicator.classList.remove('hidden');
    }
});

// Smooth scroll functionality (moved from landing.js)
scrollIndicator.addEventListener('click', () => {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
}); 