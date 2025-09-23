// TOS Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navbar functionality
    const navbar = new Navbar();
    
    // Initialize TOS-specific functionality
    initTOSScrollEffects();
    initTOSAnimations();
});


// Initialize TOS-specific scroll effects (non-navbar related)
function initTOSScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrollY = window.scrollY;
        
        // Parallax effect for hero section
        const hero = document.querySelector('.tos-hero');
        if (hero) {
            const heroHeight = hero.offsetHeight;
            const parallaxOffset = scrollY * 0.5;
            
            if (scrollY < heroHeight) {
                hero.style.transform = `translateY(${parallaxOffset}px)`;
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Initialize TOS animations
function initTOSAnimations() {
    // No animations - elements display immediately
}

// Utility function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// No scroll-triggered animations


// Add print styles functionality
function addPrintStyles() {
    const printStyles = `
        @media print {
            .header, .footer, .tos-footer {
                display: none !important;
            }
            .tos-main {
                padding-top: 0 !important;
            }
            .tos-sections {
                background: white !important;
                color: black !important;
                border: 1px solid #ccc !important;
            }
            .tos-section-title {
                color: black !important;
            }
            .tos-section-content {
                color: black !important;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
}

// Initialize print styles
addPrintStyles();

// Add accessibility improvements
function improveAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#tos-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-red);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    
    // Note: Focus styles are handled by CSS, not overridden here
}

// Initialize accessibility improvements
improveAccessibility();
