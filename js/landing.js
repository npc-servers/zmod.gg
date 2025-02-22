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