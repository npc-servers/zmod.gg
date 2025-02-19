// Store section animations
gsap.registerPlugin(ScrollTrigger);

// Mobile store text animation
function initStoreAnimations() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        const storeWords = gsap.utils.toArray('.store-word');
        
        // Create the staggered animation timeline
        const storeTL = gsap.timeline({
            scrollTrigger: {
                trigger: '.store-section',
                start: 'top 60%', // Trigger when first word would be visible
                end: 'center center',
                toggleActions: 'play none none reverse',
                markers: true, // Add markers
                id: "store-text" // Add ID for easier identification
            }
        });

        // Add staggered animations for each word
        storeTL.to(storeWords, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: {
                amount: 0.6,
                from: 'start'
            },
            ease: 'power3.out'
        });

        // Simple hover effect
        storeWords.forEach(word => {
            word.addEventListener('mouseenter', () => {
                gsap.to(word, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            word.addEventListener('mouseleave', () => {
                gsap.to(word, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.in'
                });
            });
        });
    }
}

// Initialize animations on page load
window.addEventListener('load', initStoreAnimations);

// Reinitialize on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initStoreAnimations, 250);
}); 