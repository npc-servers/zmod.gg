// Landing section functionality for ZMod website
class Landing {
    constructor() {
        this.scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        
        this.init();
    }
    
    init() {
        this.initializeScrambleAnimation();
        this.initializeScrollAnimations();
    }
    
    // Scramble animation functionality
    initializeScrambleAnimation() {
        // Apply scramble animation to desktop nav links
        this.navLinks.forEach(link => {
            const originalText = link.textContent.trim();
            let isScrambling = false;
            
            link.addEventListener('mouseenter', () => {
                if (!isScrambling) {
                    isScrambling = true;
                    this.scrambleText(link, originalText, 500);
                    setTimeout(() => {
                        isScrambling = false;
                    }, 500);
                }
            });
        });
        
        // Apply scramble animation to mobile nav links
        this.mobileNavLinks.forEach(link => {
            const originalText = link.textContent.trim();
            let isScrambling = false;
            
            link.addEventListener('mouseenter', () => {
                if (!isScrambling) {
                    isScrambling = true;
                    this.scrambleText(link, originalText, 500);
                    setTimeout(() => {
                        isScrambling = false;
                    }, 500);
                }
            });
            
            // Also trigger on touch for mobile devices
            link.addEventListener('touchstart', () => {
                if (!isScrambling) {
                    isScrambling = true;
                    this.scrambleText(link, originalText, 500);
                    setTimeout(() => {
                        isScrambling = false;
                    }, 500);
                }
            });
        });
    }
    
    // Scramble text animation function
    scrambleText(element, originalText, duration = 600) {
        const chars = originalText.split('');
        const totalFrames = Math.floor(duration / 50); // 50ms per frame
        let frame = 0;
        
        // Store original text to restore later
        const finalText = originalText;
        
        // Fix the width before animation starts
        const originalWidth = element.offsetWidth;
        const originalMinWidth = element.style.minWidth;
        const originalWidth_style = element.style.width;
        element.style.width = originalWidth + 'px';
        element.style.minWidth = originalWidth + 'px';
        
        const scrambleInterval = setInterval(() => {
            let scrambledText = '';
            
            // Build scrambled text with exact same character count
            for (let i = 0; i < chars.length; i++) {
                const originalChar = finalText[i];
                const progress = frame / totalFrames;
                const charProgress = Math.max(0, (progress - (i * 0.1)) * 2);
                
                // Preserve spaces and special characters as-is
                if (originalChar === ' ' || originalChar === '-' || originalChar === '_') {
                    scrambledText += originalChar;
                } else if (charProgress >= 1) {
                    // Character is finalized
                    scrambledText += originalChar;
                } else {
                    // Character is scrambling - use random character
                    scrambledText += this.scrambleChars[Math.floor(Math.random() * this.scrambleChars.length)];
                }
            }
            
            element.textContent = scrambledText;
            frame++;
            
            if (frame > totalFrames) {
                clearInterval(scrambleInterval);
                element.textContent = finalText; // Ensure final text is correct
                
                // Reset width styles after animation
                element.style.width = originalWidth_style;
                element.style.minWidth = originalMinWidth;
            }
        }, 50);
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