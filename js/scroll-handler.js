// Initialize Lenis smooth scrolling
window.lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    wheelMultiplier: 1,
    normalizeWheel: true,
    infinite: false,
    orientation: 'vertical',
    smoothWheel: true
});

// Integrate Lenis with GSAP ScrollTrigger
window.lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    window.lenis.raf(time * 1000);
});

// Ensure ScrollTrigger works with Lenis
gsap.ticker.lagSmoothing(0);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll-related elements
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        // Hide scroll indicator when user scrolls down
        window.lenis.on('scroll', ({ scroll }) => {
            if (scroll > 100) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        });

        // Handle scroll indicator click
        scrollIndicator.addEventListener('click', () => {
            window.lenis.scrollTo(window.innerHeight, {
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        });
    }

    // Handle anchor links smoothly
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.lenis.scrollTo(targetElement, {
                        offset: 0,
                        duration: 1.2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                }
            }
        });
    });
}); 