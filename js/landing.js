// Landing section functionality for ZMod website
class Landing {
    constructor() {
        this.init();
    }
    
    init() {
        this.initializeScrollAnimations();
    }
    
    
    // Initialize scroll animations for landing elements
    initializeScrollAnimations() {
        // Intersection Observer for scroll animations
        const animationObserverOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, animationObserverOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.landing-content, .hero-logo');
        animateElements.forEach(el => animationObserver.observe(el));
    }
}

// Export the Landing class for use in main.js
window.Landing = Landing;